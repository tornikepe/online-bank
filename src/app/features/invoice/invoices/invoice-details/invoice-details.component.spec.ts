import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesModule } from '../../invoice.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../../testing/testing-support.module';
import { InvoiceDetailsComponent } from './invoice-details.component';

describe('InvoiceDetailsComponent', () => {
	let component: InvoiceDetailsComponent;
	let fixture: ComponentFixture<InvoiceDetailsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
      imports: [InvoicesModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InvoiceDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
