import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { NgApexchartsModule } from 'ng-apexcharts';


const routes: Routes = [
	{
		path: '',
		component: InvoicesComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'newInvoice',
		component: NewInvoiceComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	declarations: [InvoicesComponent, InvoiceDetailsComponent, NewInvoiceComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule,
		RouterModule.forChild(routes),
		NgApexchartsModule
	],
	exports: [InvoicesComponent, InvoiceDetailsComponent, NewInvoiceComponent],
})
export class InvoicesModule {}
