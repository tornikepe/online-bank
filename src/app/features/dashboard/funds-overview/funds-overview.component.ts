import { Component, OnInit } from "@angular/core";
import { LayoutService } from "src/app/layout/services/layout.service";
import { leftChartOptions, LeftChartService } from "./leftChart.service";
import { rightChartOptions, RightChartService } from "./rightChart.service";

@Component({
  selector: "app-funds-overview",
  templateUrl: "./funds-overview.component.html",
  styleUrls: ["./funds-overview.component.scss"],
})
export class FundsOverviewComponent implements OnInit {
  isSidebarCollapsed: boolean;
  noData = false;
  shownTotal: "income" | "expenses" = "income";
  interval: string = "monthly";
  avgIncomeVersion = "cards";
  leftChartOptions: leftChartOptions;
  rightChartOptions: rightChartOptions;
  canRenderLeftChart = false;
  canRenderRightChart = false;
  activeCategories: string[];
  activeIncomeSeries: number[];
  activeAvgIncomeSeries: number[];
  activeExpensesSeries: number[];
  didAvgIncrease: boolean;
  avgIncomePercentage: number;
  avgIncome: number = 0;
  total = {
    income: 0,
    expenses: 0,
  };

  constructor(
    private layoutService: LayoutService,
    private leftChartService: LeftChartService,
    private rightChartService: RightChartService
  ) {}

  ngOnInit(): void {
    this.getLeftChartDataAndRender();
    this.getRightChartDataAndRender();

    this.layoutService.sidebarStatus$.subscribe((value: boolean) => {
      this.isSidebarCollapsed = value;
      setTimeout(() => {
        this.renderLeftChart();
        this.renderRightChart();
      }, 1000);
    });
  }

  onIntervalChange(interval: string) {
    this.interval = interval;
    this.getLeftChartDataAndRender();
  }

  onAvgIncomeVersionChange(avgIncomeVersion: string) {
    this.avgIncomeVersion = avgIncomeVersion;
    this.getRightChartDataAndRender();
  }

  onTotalChange() {
    if (this.shownTotal === "income") {
      this.shownTotal = "expenses";
    } else {
      this.shownTotal = "income";
    }
  }

  getLeftChartDataAndRender() {
    this.leftChartService.getLeftChartData(this.interval).subscribe((data: any) => {
      if (!data) {
        this.noData = true;
        return;
      }

      this.total.income = 0;
      this.total.expenses = 0;
      this.activeIncomeSeries = data.income;
      this.activeExpensesSeries = data.expenses;

      data.income.map((incomeData: number) => {
        this.total.income += incomeData;
      });

      data.expenses.map((expensesData: number) => {
        this.total.expenses += expensesData;
      });

      this.canRenderLeftChart = true;
      this.renderLeftChart();
    });
  }

  getRightChartDataAndRender() {
    this.rightChartService
      .getRightChartData(this.avgIncomeVersion)
      .subscribe((rightChartData: any) => {
        this.activeAvgIncomeSeries = rightChartData.activeAvgIncomeSeries;
        this.avgIncome = rightChartData.avgIncome;
        this.avgIncomePercentage = rightChartData.avgIncomePercentage;
        this.didAvgIncrease = rightChartData.didAvgIncrease;
        this.canRenderRightChart = true;
        this.renderRightChart();
      });
  }

  renderRightChart() {
    this.rightChartOptions = this.rightChartService.rightChartOptions(this.activeAvgIncomeSeries);
  }

  renderLeftChart() {
    this.leftChartOptions = this.leftChartService.leftChartOptions(
      this.activeIncomeSeries,
      this.activeExpensesSeries,
      this.interval
    );
  }
}
