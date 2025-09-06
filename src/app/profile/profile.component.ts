import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../auth.service';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'customer',
    'facebookLink',
    'instagramLink',
    'whatsappLink',
    'actions',
  ];
  profiles: MatTableDataSource<Profile> = new MatTableDataSource<Profile>([]);
  error: string | null = null;
  isAuthenticated = false;

  constructor(
    public profileService: ProfileService,
    public dialog: MatDialog,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$().subscribe((auth) => {
      this.isAuthenticated = auth;
      if (auth) {
        this.loadProfiles();
      }
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadProfiles() {
    this.profileService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load profiles. Please try again.';
          console.error('Profile load error:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.profiles.data = data;
        this.cdr.detectChanges();
      });
  }

  openDialog(profile: Profile): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to edit profiles.';
      return;
    }

    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '400px',
      data: {
        profile: profile,
        customers: [], // You might want to load customers if needed
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profileService
          .update(profile.id, result)
          .pipe(
            catchError((err) => {
              this.error = 'Failed to update profile.';
              return of(null);
            })
          )
          .subscribe(() => this.loadProfiles());
      }
    });
  }
}
