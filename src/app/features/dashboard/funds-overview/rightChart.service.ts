import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTooltip,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  ApexStroke,
} from "ng-apexcharts";

export type rightChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: ApexGrid;
};

@Injectable()
export class RightChartService {
  loggedUser = localStorage.getItem("userId");
  //   loggedUser = 12;
  lastYearAvgIncomeByCards = 2950;
  lastYearAvgIncomeByAccounts = 3800;
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

  constructor(private http: HttpClient) {}

  getRightChartData(avgIncomeVersion: string) {
    return this.http
      .get<number[]>(
        `http://localhost:3000/income?interval=monthly&to=${avgIncomeVersion}&userId=${this.loggedUser}`
      )
      .pipe(
        map((avgIncomeData: number[]) => {
          let activeAvgIncomeSeries = [];
          for (let i = 0; i < 12; i++) {
            let totalIncomeForMonth = 0;
            avgIncomeData.forEach((incomeObject: any) => {
              totalIncomeForMonth += incomeObject.data[i];
            });
            activeAvgIncomeSeries.push(totalIncomeForMonth);
          }

          let monthlyTotalIncome = 0;
          activeAvgIncomeSeries.map((avgIncomeData: number) => {
            monthlyTotalIncome += avgIncomeData;
          });
          let avgIncome = monthlyTotalIncome / activeAvgIncomeSeries.length;
          let avgIncomePercentage =
            avgIncomeVersion === "cards"
              ? (avgIncome / this.lastYearAvgIncomeByCards) * 100 - 100
              : (avgIncome / this.lastYearAvgIncomeByAccounts) * 100 - 100;
          let didAvgIncrease = avgIncomePercentage >= 0 ? true : false;

          return {
            didAvgIncrease,
            avgIncome,
            avgIncomePercentage,
            activeAvgIncomeSeries,
          };
        })
      );
  }

  rightChartOptions(activeAvgIncomeSeries: number[]): rightChartOptions {
    return {
      series: [
        {
          name: "Avg Income",
          data: activeAvgIncomeSeries,
        },
      ],
      chart: {
        type: "bar",
        height: 280,
        toolbar: {
          show: false,
        },
        events: {
          dataPointMouseEnter: function (event: any) {
            event.path[0].style.cursor = "pointer";
          },
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "18px",
          borderRadius: 5,
          colors: {
            backgroundBarColors: ["#F8FAFB"],
            backgroundBarRadius: 5,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: this.monthlyCategories,
        tickPlacement: "on",
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {},
      },
    };
  }
}
