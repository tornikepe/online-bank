import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsProvidersComponent } from './payments-providers/payments-providers.component';
import { PaymentsComponent } from './payments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InstantTransferComponent } from './instant-transfer/instant-transfer.component';
import { BankTransferComponent } from './bank-transfer/bank-transfer.component';
import { ElectronicTransferComponent } from './electronic-transfer/electronic-transfer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: "", component: PaymentsComponent }];

@NgModule({
  declarations: [
    PaymentsComponent,
    PaymentsProvidersComponent,
    InstantTransferComponent,
    BankTransferComponent,
    ElectronicTransferComponent,
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [PaymentsComponent, PaymentsProvidersComponent],
})
export class PaymentsModule { }
