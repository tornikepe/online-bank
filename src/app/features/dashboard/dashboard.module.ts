import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { FundsOverviewComponent } from "./funds-overview/funds-overview.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from "src/app/shared/shared.module";
import { YourcardsComponent } from "./yourcards/yourcards.component";
import { LeftChartService } from "./funds-overview/leftChart.service";
import { RightChartService } from "./funds-overview/rightChart.service";
import { TransactionComponent } from "./transaction/transaction.component";

const routes: Routes = [{ path: "", component: DashboardComponent }];

@NgModule({
  declarations: [
    DashboardComponent,
    FundsOverviewComponent,
    YourcardsComponent,
    TransactionComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgApexchartsModule, SharedModule],
  exports: [DashboardComponent],
  providers: [LeftChartService, RightChartService],
})
export class DashboardModule {}
