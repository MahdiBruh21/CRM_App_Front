import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutFrontchannelComponent } from './logout-frontchannel.component';

describe('LogoutFrontchannelComponent', () => {
  let component: LogoutFrontchannelComponent;
  let fixture: ComponentFixture<LogoutFrontchannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutFrontchannelComponent]
    });
    fixture = TestBed.createComponent(LogoutFrontchannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
