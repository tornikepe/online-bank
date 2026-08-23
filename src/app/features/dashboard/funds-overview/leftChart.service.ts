import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { MoneySeries } from "src/app/models/banking.model";
import { environment } from "src/environments/environment";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTooltip,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  ApexStroke,
} from "ng-apexcharts";

export type leftChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  markers: ApexMarkers;
  grid: ApexGrid;
};

/** The two series the funds-overview chart plots. */
export interface LeftChartData {
  income: number[];
  expenses: number[];
}

@Injectable()
export class LeftChartService {
  loggedUser = localStorage.getItem("userId");
  // loggedUser = 12;
  activeCategories: string[];
  weeklyCategories: string[] = [];
  dailyCategories: string[] = [];
  month = new Date().getMonth().toString();
  year = new Date().getFullYear().toString();
  interval: string = "monthly";
  activeIncomeSeries: number[];
  activeExpensesSeries: number[];
  canRenderLeftChart = false;
  monthlyCategories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  total = {
    income: 0,
    expenses: 0,
  };

  constructor(private http: HttpClient) {}

  configureDailyCategories() {
    let dailyCategories = [];
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date();
      const date = new Date(currentDate.setDate(currentDate.getDate() - i)).getDate().toString();
      dailyCategories.push(`${date}/${this.month}/${this.year}`);
    }
    return dailyCategories;
  }

  configureWeeklyCategories() {
    let weeklyCategories = [];
    for (let i = 3; i >= 0; i--) {
      const currentDate = new Date();
      const date = new Date(currentDate.setDate(currentDate.getDate() - i * 7))
        .getDate()
        .toString();
      weeklyCategories.push(`${date}/${this.month}/${this.year}`);
    }
    return weeklyCategories;
  }

  getLeftChartData(interval: string): Observable<LeftChartData | null> {
    let incomeRequest = this.http.get<MoneySeries[]>(
      `${environment.BaseUrl}income?interval=${interval}&userId=${this.loggedUser}`
    );
    let expensesRequest = this.http.get<MoneySeries[]>(
      `${environment.BaseUrl}expenses?interval=${interval}&userId=${this.loggedUser}`
    );

    return forkJoin([incomeRequest, expensesRequest]).pipe(
      map(([income, expenses]) => {
        if (income?.length === 0 && expenses?.length === 0) {
          return null;
        }

        const seriesLength = interval === "monthly" ? 12 : interval === "weekly" ? 4 : 7;
        const activeIncomeSeries: number[] = [];
        const activeExpensesSeries: number[] = [];

        for (let i = 0; i < seriesLength; i++) {
          let totalIncome = 0;
          income.forEach((incomeObject) => {
            totalIncome += incomeObject.data[i];
          });
          activeIncomeSeries.push(totalIncome);
        }

        for (let i = 0; i < seriesLength; i++) {
          let totalExpenses = 0;
          expenses.forEach((expensesObject) => {
            totalExpenses += expensesObject.data[i];
          });
          activeExpensesSeries.push(totalExpenses);
        }

        return {
          income: activeIncomeSeries,
          expenses: activeExpensesSeries,
        };
      })
    );
  }

  leftChartOptions(
    activeIncomeSeries: number[],
    activeExpensesSeries: number[],
    interval: string
  ): leftChartOptions {
    this.activeCategories =
      interval === "monthly"
        ? this.monthlyCategories
        : interval === "weekly"
        ? this.configureWeeklyCategories()
        : this.configureDailyCategories();
    return {
      colors: ["#FFAB2B", "#4D7CFE"],
      series: [
        {
          name: "Income",
          data: activeIncomeSeries,
        },
        {
          name: "Expenses",
          data: activeExpensesSeries,
        },
      ],
      chart: {
        width: "100%",
        height: 280,
        type: "area",
        toolbar: {
          show: false,
        },
        events: {
          /* This read `event.path[0]`, a Chrome-only property removed in
             Chrome 109, so every pointer move over the chart threw a
             TypeError. `composedPath()` is the standard replacement. */
          mouseMove: function (event: MouseEvent) {
            const target = event.composedPath?.()[0] ?? event.target;
            if (target instanceof HTMLElement || target instanceof SVGElement) {
              target.style.cursor = "pointer";
            }
          },
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeWidth: 8,
        strokeColors: ["#FFAB2B", "#4D7CFE"],
        strokeOpacity: 0.5,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: this.activeCategories,
        labels: {
          offsetX: this.interval === "monthly" ? 0 : 4.5,
        },
      },
      yaxis: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: false,
        fixed: {
          position: "topRight",
        },
      },
    };
  }
}
