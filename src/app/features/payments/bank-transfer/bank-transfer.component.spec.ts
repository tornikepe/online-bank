import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { PaymentsModule } from '../payments.module';
import { TestingSupportModule } from '../../../testing/testing-support.module';
import { BankTransferComponent } from './bank-transfer.component';

describe('BankTransferComponent', () => {
  let component: BankTransferComponent;
  let fixture: ComponentFixture<BankTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* The account input capped typing at 16 characters while the validator
     demanded exactly 22, so the form could never become valid and no bank
     transfer could be submitted at all. */
  it('lets the account field hold as many characters as the validator requires', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[name=account]');
    const maxLength = Number(input.getAttribute('maxlength'));

    const control = component.bankTransferForm.get('account')!;
    control.setValue('G'.repeat(maxLength));

    expect(control.errors?.['pattern']).toBeUndefined();
  });

  /* The PAY NOW button carried both (click)="onSubmitBankTransForm()" and
     type="submit" inside a form bound to the same handler, so one real click
     ran the transfer twice. */
  it('routes the submit button through the form only once', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button[type=submit]');

    expect(button).toBeTruthy();
    expect(button.getAttribute('ng-reflect-on-click')).toBeNull();

    let calls = 0;
    component.onSubmitBankTransForm = () => { calls++; };
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );

    expect(calls).toBe(1);
  });
});
