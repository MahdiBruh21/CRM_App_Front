import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Prospection } from '../models/prospection';
import { Prospect } from '../models/prospect';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prospection-dialog',
  templateUrl: './prospection-dialog.component.html',
  styleUrls: ['./prospection-dialog.component.css'],
})
export class ProspectionDialogComponent {
  prospectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProspectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { prospection: Prospection | null; prospects: Prospect[] }
  ) {
    const prospection = data.prospection || ({} as Partial<Prospection>);
    this.prospectionForm = this.fb.group({
      id: [prospection.id || null],
      prospectId: [prospection.prospect?.id || '', Validators.required],
      prospectionStatus: [
        prospection.prospectionStatus || 'INITIAL',
        Validators.required,
      ],
      prospectionDetails: [
        prospection.prospectionDetails || '',
        Validators.required,
      ],
    });
  }

  onSave(): void {
    if (this.prospectionForm.valid) {
      const formValue = this.prospectionForm.value;
      const prospect = this.data.prospects.find(
        (p) => p.id === formValue.prospectId
      );

      if (!prospect) {
        console.error('Selected prospect not found');
        return;
      }

      this.dialogRef.close({
        ...formValue,
        prospect: prospect,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
