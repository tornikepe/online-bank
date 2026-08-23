import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CurrencyModule } from '../currency.module';
import { TestingSupportModule } from '../../../testing/testing-support.module';
import { CurrencyComponent } from './currency.component';

describe('CurrencyComponent', () => {
  let component: CurrencyComponent;
  let fixture: ComponentFixture<CurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('dailyChange', () => {
    /* The bank publishes `diff` as an absolute move in lari. The table used to
       pipe it straight through `percent`, which just multiplied it by a
       hundred. */
    it('reads the move against yesterday, not as a bare fraction', () => {
      // AED on 2026-08-22: 7.1127, down 0.0014 — that is 0.02%, not 0.14%.
      const change = component.dailyChange({ rate: 7.1127, diff: -0.0014 });
      expect(change * 100).toBeCloseTo(-0.02, 2);
    });

    it('scales with the size of the rate', () => {
      // The same absolute move is a far bigger deal on a smaller rate.
      const onLargeRate = component.dailyChange({ rate: 7.1127, diff: 0.0132 });
      const onSmallRate = component.dailyChange({ rate: 0.8761, diff: 0.0132 });
      expect(onSmallRate).toBeGreaterThan(onLargeRate);
      expect(onSmallRate * 100).toBeCloseTo(1.53, 2);
    });

    /* The percent pipe prints the minus; sign() only supplies the plus. */
    it('keeps the direction of the move on the number', () => {
      expect(component.dailyChange({ rate: 1.8711, diff: -0.0091 })).toBeLessThan(0);
      expect(component.dailyChange({ rate: 1.8711, diff: 0.0091 })).toBeGreaterThan(0);
    });

    it('does not divide by zero on a rate that just appeared', () => {
      expect(component.dailyChange({ rate: 0.5, diff: 0.5 })).toBe(0);
    });
  });

  describe('priceDigits', () => {
    /* toFixed(2) printed a coin trading under a cent as 0.00. */
    it('keeps two decimals for anything above a dollar', () => {
      expect(component.priceDigits(76188)).toBe('1.2-2');
      expect(component.priceDigits(1)).toBe('1.2-2');
    });

    it('widens as the price falls below a dollar', () => {
      expect(component.priceDigits(0.091241)).toBe('1.2-4');
      expect(component.priceDigits(0.0013)).toBe('1.2-6');
      expect(component.priceDigits(0.0000094)).toBe('1.2-8');
    });
  });
});
