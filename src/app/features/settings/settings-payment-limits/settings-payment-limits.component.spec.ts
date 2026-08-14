import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModule } from '../settings.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../testing/testing-support.module';
import { SettingsPaymentLimitsComponent } from './settings-payment-limits.component';

describe('SettingsPaymentLimitsComponent', () => {
  let component: SettingsPaymentLimitsComponent;
  let fixture: ComponentFixture<SettingsPaymentLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
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
