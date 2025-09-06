import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Prospect } from '../models/prospect';
import { ProspectService } from '../services/prospect.service';
import { AuthService } from '../auth.service';
import { ProspectDialogComponent } from '../prospect-dialog/prospect-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-prospect',
  templateUrl: './prospect.component.html',
  styleUrls: ['./prospect.component.css'],
})
export class ProspectComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phoneNumber',
    'prospectStatus',
    'prospectionType',
    'actions',
  ];
  prospects: MatTableDataSource<Prospect> = new MatTableDataSource<Prospect>(
    []
  );
  error: string | null = null;
  isAuthenticated = false;

  constructor(
    public prospectService: ProspectService,
    public dialog: MatDialog,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$().subscribe((auth) => {
      this.isAuthenticated = auth;
      if (auth) {
        this.loadProspects();
      }
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadProspects() {
    this.prospectService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load prospects. Please try again.';
          console.error('Prospect load error:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.prospects.data = data;
        this.cdr.detectChanges();
      });
  }

  openDialog(prospect?: Prospect): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to manage prospects.';
      return;
    }

    const dialogRef = this.dialog.open(ProspectDialogComponent, {
      width: '500px',
      data: {
        prospect: prospect || null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (prospect) {
          this.prospectService
            .update(prospect.id, result)
            .pipe(
              catchError((err) => {
                console.error('Update error:', err); // ADD THIS
                this.error = 'Failed to update prospect.';
                return of(null);
              })
            )
            .subscribe(() => this.loadProspects());
        } else {
          this.prospectService
            .create(result)
            .pipe(
              catchError((err) => {
                this.error = 'Failed to create prospect.';
                return of(null);
              })
            )
            .subscribe(() => this.loadProspects());
        }
      }
    });
  }

  deleteProspect(id: number): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to delete prospects.';
      return;
    }
    this.prospectService
      .delete(id)
      .pipe(
        catchError((err) => {
          this.error = 'Failed to delete prospect.';
          return of(null);
        })
      )
      .subscribe(() => this.loadProspects());
  }
}
