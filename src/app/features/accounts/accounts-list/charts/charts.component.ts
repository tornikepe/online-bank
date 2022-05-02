import { Component, OnInit, ViewChild, Input } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexGrid,
  ApexFill,
  ApexNoData,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  grid: ApexGrid | any;
  stroke: ApexStroke | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  fill: ApexFill | any;
  noData: ApexNoData | any;
};

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.scss"],
})
export class ChartsComponent implements OnInit {
  @Input() chartValues: any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartId: number;
  public charts: any;

  @Input() amount: number;
  @Input() type: string;
  @Input() color: string;

  constructor() {
    setTimeout(() => {
      this.chartOptions = {
        series: [
          {
            name: "series1",
            data: [],
          },
        ],
        chart: {
          width: 171,
          height: 100,
          type: "area",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          lineCap: "butt",
          width: 1,
          colors: [this.color],
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          show: false,
        },
        grid: {
          show: false,
        },
        fill: {
          type: "gradient",
          colors: [this.color, "#fff"],
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0,
            stops: [0, 100],
          },
        },
        noData: {
          text: "Loading data...",
        },
      };
    }, 1000);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.chart?.updateSeries([
        {
          data: this.chartValues,
        },
      ]);
    }, 1000);
  }
}
