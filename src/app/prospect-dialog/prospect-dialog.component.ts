import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Prospect } from '../models/prospect';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prospect-dialog',
  templateUrl: './prospect-dialog.component.html',
  styleUrls: ['./prospect-dialog.component.css'],
})
export class ProspectDialogComponent {
  prospectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProspectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prospect: Prospect | null }
  ) {
    const prospect = data.prospect || ({} as Partial<Prospect>);
    this.prospectForm = this.fb.group({
      id: [prospect.id || null],
      name: [prospect.name || '', Validators.required],
      phoneNumber: [prospect.phoneNumber || '', Validators.required],
      email: [prospect.email || '', [Validators.required, Validators.email]],
      prospectStatus: [prospect.prospectStatus || 'NEW', Validators.required],
      prospectionType: [
        prospect.prospectionType || 'OTHER',
        Validators.required,
      ],
      prospectDetails: [prospect.prospectDetails || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.prospectForm.valid) {
      this.dialogRef.close(this.prospectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
