import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Prospection } from '../models/prospection';
import { ProspectionService } from '../services/prospection.service';
import { ProspectService } from '../services/prospect.service';
import { AuthService } from '../auth.service';
import { ProspectionDialogComponent } from '../prospection-dialog/prospection-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-prospection',
  templateUrl: './prospection.component.html',
  styleUrls: ['./prospection.component.css'],
})
export class ProspectionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'prospect',
    'prospectionStatus',
    'prospectionDetails',
    'actions',
  ];
  prospections: MatTableDataSource<Prospection> =
    new MatTableDataSource<Prospection>([]);
  error: string | null = null;
  isAuthenticated = false;

  constructor(
    private prospectionService: ProspectionService,
    private prospectService: ProspectService,
    private dialog: MatDialog,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$().subscribe((auth) => {
      this.isAuthenticated = auth;
      if (auth) {
        this.loadProspections();
      }
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadProspections() {
    this.prospectionService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load prospections. Please try again.';
          console.error('Prospection load error:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.prospections.data = data;
        this.cdr.detectChanges();
      });
  }

  openDialog(prospection?: Prospection): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to manage prospections.';
      return;
    }

    this.prospectService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load prospects.';
          console.error('Failed to load prospects for dialog:', err);
          return of([]);
        })
      )
      .subscribe((prospects) => {
        const dialogRef = this.dialog.open(ProspectionDialogComponent, {
          width: '500px',
          data: {
            prospection: prospection || null,
            prospects: prospects,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            if (prospection) {
              this.prospectionService
                .update(prospection.id, result)
                .pipe(
                  catchError((err) => {
                    this.error = 'Failed to update prospection.';
                    console.error(err);
                    return of(null);
                  })
                )
                .subscribe(() => this.loadProspections());
            } else {
              this.prospectionService
                .create(result)
                .pipe(
                  catchError((err) => {
                    this.error = 'Failed to create prospection.';
                    console.error(err);
                    return of(null);
                  })
                )
                .subscribe(() => this.loadProspections());
            }
          }
        });
      });
  }

  deleteProspection(id: number): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to delete prospections.';
      return;
    }

    this.prospectionService
      .delete(id)
      .pipe(
        catchError((err) => {
          this.error = 'Failed to delete prospection.';
          console.error(err);
          return of(null);
        })
      )
      .subscribe(() => this.loadProspections());
  }
}
