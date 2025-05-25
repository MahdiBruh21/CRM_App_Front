import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectionDialogComponent } from './prospection-dialog.component';

describe('ProspectionDialogComponent', () => {
  let component: ProspectionDialogComponent;
  let fixture: ComponentFixture<ProspectionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectionDialogComponent]
    });
    fixture = TestBed.createComponent(ProspectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
