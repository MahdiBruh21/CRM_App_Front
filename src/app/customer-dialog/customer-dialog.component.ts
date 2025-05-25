import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../models/customer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.css'],
})
export class CustomerDialogComponent {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {
    this.customerForm = this.fb.group({
      id: [data.id || null],
      name: [data.name || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      phone: [data.phone || '', Validators.required],
      address: [data.address || '', Validators.required],
      customerType: [data.customerType || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.customerForm.valid) {
      const updatedCustomer = {
        ...this.customerForm.value,
        profile: this.data.profile, // preserve nested profile object
        // Add other nested objects if needed
      };
      this.dialogRef.close(this.customerForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
