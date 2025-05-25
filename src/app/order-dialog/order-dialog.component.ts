import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../models/order';
import { Customer } from '../models/customer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css'],
})
export class OrderDialogComponent {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { order: Order | null; customers: Customer[] }
  ) {
    const order = data.order || ({} as Partial<Order>);

    // Format date to show only YYYY-MM-DD without time
    const formattedDate = order.orderDate
      ? formatDate(order.orderDate, 'yyyy-MM-dd', 'en-US')
      : formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    this.orderForm = this.fb.group({
      id: [order.id || null],
      customerId: [order.customer?.id || '', Validators.required],
      orderDate: [formattedDate, Validators.required],
      price: [order.price || 0, [Validators.required, Validators.min(0)]],
      orderStatus: [order.orderStatus || 'PENDING', Validators.required],
      orderDetails: [order.orderDetails || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      this.dialogRef.close({
        id: formValue.id,
        customerId: formValue.customerId,
        orderDate: formValue.orderDate, // Already formatted as YYYY-MM-DD
        price: formValue.price,
        orderStatus: formValue.orderStatus,
        orderDetails: formValue.orderDetails,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
