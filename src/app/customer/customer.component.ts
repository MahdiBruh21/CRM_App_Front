import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../auth.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'actions'];
  customers: MatTableDataSource<Customer> = new MatTableDataSource<Customer>(
    []
  );
  error: string | null = null;
  isAuthenticated = false;

  constructor(
    public customerService: CustomerService,
    public dialog: MatDialog,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$().subscribe((auth) => {
      console.log('Is authenticated:', auth);
      this.isAuthenticated = auth;
      if (auth) {
        this.loadCustomers();
      }
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadCustomers() {
    this.customerService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load customers. Please try again.';
          console.error('Customer load error:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        console.log('Customers data:', data);
        this.customers.data = data;
        console.log('Customers dataSource:', this.customers.data);
        this.cdr.detectChanges();
      });
  }

  openDialog(customer?: Customer): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to manage customers.';
      return;
    }
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '400px',
      data: customer ? { ...customer } : {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (customer) {
          this.customerService
            .update(customer)
            .pipe(
              catchError((err) => {
                this.error = 'Failed to update customer.';
                return of(null);
              })
            )
            .subscribe(() => this.loadCustomers());
        } else {
          this.customerService
            .create(result)
            .pipe(
              catchError((err) => {
                this.error = 'Failed to create customer.';
                return of(null);
              })
            )
            .subscribe(() => this.loadCustomers());
        }
      }
    });
  }

  deleteCustomer(id: number): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to delete customers.';
      return;
    }
    this.customerService
      .delete(id)
      .pipe(
        catchError((err) => {
          this.error = 'Failed to delete customer.';
          return of(null);
        })
      )
      .subscribe(() => this.loadCustomers());
  }
}
