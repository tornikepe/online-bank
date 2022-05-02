import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsListComponent } from './accounts-list/accounts-list.component';
import { CreateCardComponent } from './create-card/create-card.component';
import { CardComponent } from './info-page/card/card.component';
import { CumulativeComponent } from './info-page/cumulative/cumulative.component';
import { MortgageComponent } from './info-page/mortage/mortage.component';
import { ChartsComponent } from './accounts-list/charts/charts.component';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  declarations: [
    CreateCardComponent,
    AccountsListComponent,
    CardComponent,
    CumulativeComponent,
    MortgageComponent,
    ChartsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AccountsRoutingModule,
    NgApexchartsModule,
  ],
})
export class AccountsModule { }
