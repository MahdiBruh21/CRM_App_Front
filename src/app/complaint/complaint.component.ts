import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Complaint } from '../models/complaint';
import { ComplaintService } from '../services/complaint.service';
import { AuthService } from '../auth.service';
import { ComplaintDialogComponent } from '../complaint-dialog/complaint-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css'],
})
export class ComplaintComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'customer',
    'complaintType',
    'complaintStatus',
    'description',
    'actions',
  ];
  complaints: MatTableDataSource<Complaint> = new MatTableDataSource<Complaint>(
    []
  );
  error: string | null = null;
  isAuthenticated = false;
  customers: Customer[] = [];

  constructor(
    public complaintService: ComplaintService,
    public customerService: CustomerService,
    public dialog: MatDialog,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$().subscribe((auth) => {
      this.isAuthenticated = auth;
      if (auth) {
        this.loadCustomers();
        this.loadComplaints();
      }
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadComplaints() {
    this.complaintService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load complaints. Please try again.';
          console.error('Complaint load error:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.complaints.data = data;
        this.cdr.detectChanges();
      });
  }

  loadCustomers() {
    this.customerService
      .getAll()
      .pipe(
        catchError((err) => {
          console.error('Failed to load customers:', err);
          return of([]);
        })
      )
      .subscribe((customers) => {
        this.customers = customers;
      });
  }

  openDialog(complaint?: Complaint): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to manage complaints.';
      return;
    }

    const dialogRef = this.dialog.open(ComplaintDialogComponent, {
      width: '400px',
      data: {
        complaint: complaint || null,
        customers: this.customers,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (complaint) {
          this.complaintService
            .update(complaint.id, result)
            .pipe(
              catchError((err) => {
                this.error = 'Failed to update complaint.';
                return of(null);
              })
            )
            .subscribe(() => this.loadComplaints());
        } else {
          this.complaintService
            .create(result)
            .pipe(
              catchError((err) => {
                this.error = 'Failed to create complaint.';
                return of(null);
              })
            )
            .subscribe(() => this.loadComplaints());
        }
      }
    });
  }

  deleteComplaint(id: number): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to delete complaints.';
      return;
    }

    this.complaintService
      .delete(id)
      .pipe(
        catchError((err) => {
          this.error = 'Failed to delete complaint.';
          return of(null);
        })
      )
      .subscribe(() => this.loadComplaints());
  }
}
