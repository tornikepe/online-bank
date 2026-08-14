import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsModule } from '../../accounts.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../../testing/testing-support.module';
import { MortgageComponent } from './mortage.component';

describe('MortageComponent', () => {
  let component: MortgageComponent;
  let fixture: ComponentFixture<MortgageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
