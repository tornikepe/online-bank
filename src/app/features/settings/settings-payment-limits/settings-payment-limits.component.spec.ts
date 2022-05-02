import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPaymentLimitsComponent } from './settings-payment-limits.component';

describe('SettingsPaymentLimitsComponent', () => {
  let component: SettingsPaymentLimitsComponent;
  let fixture: ComponentFixture<SettingsPaymentLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsPaymentLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPaymentLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
