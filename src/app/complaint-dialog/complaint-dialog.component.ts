// src/app/components/complaint/complaint-dialog/complaint-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Complaint } from '../models/complaint';
import { Customer } from '../models/customer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-complaint-dialog',
  templateUrl: './complaint-dialog.component.html',
  styleUrls: ['./complaint-dialog.component.css'],
})
export class ComplaintDialogComponent {
  complaintForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ComplaintDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { complaint: Complaint | null; customers: Customer[] }
  ) {
    const complaint = data.complaint || ({} as Partial<Complaint>);
    this.complaintForm = this.fb.group({
      id: [complaint.id || null],
      customerId: [complaint.customer?.id || '', Validators.required],
      complaintType: [complaint.complaintType || '', Validators.required],
      complaintStatus: [complaint.complaintStatus || '', Validators.required],
      description: [complaint.description || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.complaintForm.valid) {
      const formValue = this.complaintForm.value;
      const customer = this.data.customers.find(
        (c) => c.id === formValue.customerId
      );
      if (!customer) {
        console.error('Customer not found for ID:', formValue.customerId);
        return;
      }
      this.dialogRef.close({
        id: formValue.id,
        customer: { id: customer.id }, // Send only the customer ID
        complaintType: formValue.complaintType,
        complaintStatus: formValue.complaintStatus,
        description: formValue.description,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
