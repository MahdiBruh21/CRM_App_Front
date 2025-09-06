import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../models/order';
import { OrderService } from '../services/order.service';
import { AuthService } from '../auth.service';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'customer',
    'orderDate',
    'price',
    'status',
    'actions',
  ];
  orders: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);
  error: string | null = null;
  isAuthenticated = false;
  customers: Customer[] = [];

  constructor(
    public orderService: OrderService,
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
        this.loadOrders();
      }
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadOrders() {
    this.orderService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load orders. Please try again.';
          console.error('Order load error:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.orders.data = data;
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

  openDialog(order?: Order): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to manage orders.';
      return;
    }

    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '400px',
      data: {
        order: order || null,
        customers: this.customers,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const orderData = {
          customerId: result.customerId,
          orderDate: result.orderDate,
          price: result.price,
          orderStatus: result.orderStatus,
          orderDetails: result.orderDetails,
        };

        if (order) {
          this.orderService
            .update(order.id, orderData)
            .pipe(
              catchError((err) => {
                this.error = 'Failed to update order.';
                return of(null);
              })
            )
            .subscribe(() => this.loadOrders());
        } else {
          this.orderService
            .create(orderData)
            .pipe(
              catchError((err) => {
                this.error = 'Failed to create order.';
                return of(null);
              })
            )
            .subscribe(() => this.loadOrders());
        }
      }
    });
  }

  deleteOrder(id: number): void {
    if (!this.isAuthenticated) {
      this.error = 'Please log in to delete orders.';
      return;
    }

    this.orderService
      .delete(id)
      .pipe(
        catchError((err) => {
          this.error = 'Failed to delete order.';
          return of(null);
        })
      )
      .subscribe(() => this.loadOrders());
  }
}
