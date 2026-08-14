import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, DestroyRef, inject} from '@angular/core';
import * as ApexCharts from 'apexcharts';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ApexYAxis,
  ApexResponsive,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
} from 'ng-apexcharts';
import { LayoutService } from 'src/app/layout/services/layout.service';

import { environment } from "src/environments/environment";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  colors: string[];
  legend: ApexLegend;
  yaxis: ApexYAxis;
  fill: ApexFill;
};

export type ChartOptions3 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  colors: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  standalone: false,
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('chart') charts: ChartComponent;
  @Input() chart: ApexChart;
  @Input() labels: string[];
  @Input() xaxis: ApexXAxis;
  @Input() colors: string[];
  @Input() legend: ApexLegend;
  @Input() yaxis: ApexYAxis;

  public chartOptions1: ChartOptions1;
  public chartOptions3: ChartOptions3;

  empty: boolean = false;
  data: any = [];
  width1: number;
  width2: number;
  width3: number;
  max: number;
  roundUp: number;
  divide: number;
  numbers: any = 0;
  numbersArr: any = [];
  percent: any;
  series: any;

  spendings: any;
  debitCard: any;
  creditCard: any;
  cash: any;

  getSpendings() {
    this.http.get(`${environment.BaseUrl}spending`).subscribe(data => {
      this.spendings = data;
      this.debitCard = this.spendings[0].value;
      this.creditCard = this.spendings[1].value;
      this.cash = this.spendings[2].value;
      this.data = [this.debitCard, this.creditCard, this.cash];
      this.chart2();
          this.cdr.markForCheck();
    });
  }

  constructor(private ls: LayoutService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  chart2() {
    this.max = Math.max(...this.data);
    let maxLength = this.max.toString().length;
    this.roundUp =
      Math.ceil(this.max / Math.pow(10, maxLength - 1)) *
      Math.pow(10, maxLength - 1);
    this.width1 = this.data[0] / (this.roundUp / 100);
    this.width2 = this.data[1] / (this.roundUp / 100);
    this.width3 = this.data[2] / (this.roundUp / 100);
    this.divide = this.roundUp / Math.pow(10, maxLength - 1);
    for (let i = 0; i < this.divide; i++) {
      this.numbers += Math.pow(10, maxLength - 1);
      this.percent = this.numbers;
      if (maxLength > 6) {
        this.percent = (this.numbers / 1000000).toString() + 'M';
      } else if (maxLength > 3) {
        this.percent = (this.numbers / 1000).toString() + 'K';
      }
      this.numbersArr.push(this.percent);
    }
  }

  incomes: any;
  incomesCards: any;
  incomeDeposits: any;
  concatIncomeArrays: any = [];
  expenses: any;
  expensesCards: any;
  expensesDeposits: any;
  concatExpensesArrays: any = [];
  canRenderChart1 = false;

  overall = 'overall';

  changeLink(value: string) {
    this.overall = value;
    this.getIncome();
    this.getExpenses();
    this.buildSeries();
    this.renderChart1();
  }
  link(value: string) {
    if (this.overall === 'overall') {
      return `${environment.BaseUrl}${value}`;
    } else {
      return `${environment.BaseUrl}${value}?type=${this.overall}`;
    }
  }

  ngOnInit(): void {
    this.ls.sidebarStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      setTimeout(() => {
        this.renderChart1();
        this.renderChart3();
      }, 1000);
          this.cdr.markForCheck();
    });
    this.getIncome();
    this.getExpenses();
    this.getSpendings();
    this.expenseCategories();
  }

  /* "Overall" totals the cards series and the deposits series. Both were read
     from records[0], so the chart plotted the card figures twice and the deposit
     line never appeared. */
  /** Short month names for the last `count` months, oldest first. */
  private recentMonths(count: number): string[] {
    const now = new Date();
    return Array.from({ length: count }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
      return month.toLocaleString('en-US', { month: 'short' });
    });
  }

  private combine(records: any[]): number[] {
    const first: number[] = records?.[0]?.data ?? [];
    const second: number[] = records?.[1]?.data ?? [];
    return first.map((value, i) => value + (second[i] ?? 0));
  }

  getIncome() {
    this.http.get<any[]>(this.link('income')).subscribe(data => {
      this.incomes = data;
      this.incomesCards = data?.[0]?.data ?? [];
      this.incomeDeposits = data?.[1]?.data ?? [];
      this.concatIncomeArrays = this.combine(data);
      this.canRenderChart1 = true;
      /* Rebuild the series before handing it to the chart — rendering first left
         `chartOptions1.series` pointing at the array from the previous load. */
      this.buildSeries();
      this.renderChart1();
      this.cdr.markForCheck();
    });
  }

  getExpenses() {
    this.http.get<any[]>(this.link('expenses')).subscribe(data => {
      this.expenses = data;
      this.expensesCards = data?.[0]?.data ?? [];
      this.expensesDeposits = data?.[1]?.data ?? [];
      this.concatExpensesArrays = this.combine(data);
      this.canRenderChart1 = true;
      this.buildSeries();
      this.renderChart1();
      this.cdr.markForCheck();
    });
  }

  buildSeries() {
    if (this.overall === 'overall') {
      this.series = [
        {
          name: 'Income',
          data: this.concatIncomeArrays,
        },
        {
          name: 'Expenses',
          data: this.concatExpensesArrays,
        },
      ];
    } else if (this.overall === 'card') {
      this.series = [
        {
          name: 'Income',
          data: this.incomesCards,
        },
        {
          name: 'Expenses',
          data: this.expensesCards,
        },
      ];
    } else if (this.overall === 'deposits') {
      this.series = [
        {
          name: 'Income',
          data: this.incomeDeposits,
        },
        {
          name: 'Expenses',
          data: this.expensesDeposits,
        },
      ];
    }
    this.renderChart1();
  }

  categories: any;
  grocery: any;
  health: any;
  rent: any;
  transportation: any;

  expenseCategories() {
    this.http.get(`${environment.BaseUrl}expenseCategories`).subscribe(data => {
      this.categories = data;
      this.grocery = this.categories[0].value;
      this.health = this.categories[1].value;
      this.rent = this.categories[2].value;
      this.transportation = this.categories[3].value;
      this.renderChart3();
          this.cdr.markForCheck();
    });
  }

  //////charts

  renderChart1() {
    this.chartOptions1 = {
      colors: ['#FFAB2B', '#4D7CFE'],
      series: this.series,
      fill: {
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.2,
        },
      },
      chart: {
        toolbar: {
          show: false,
        },
        height: 295,
        type: 'area',
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '14px',
        itemMargin: {
          horizontal: 10,
          vertical: 20,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        labels: {
          show: true,
        },
        /* One label per month, ending with the current one. The old config used a
           datetime axis pinned to five fixed 2018 timestamps, which squashed the
           whole series into the far left of the plot. */
        type: 'category',
        categories: this.recentMonths(5),
      },
      yaxis: {
        tickAmount: 5,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }
  renderChart3() {
    this.chartOptions3 = {
      colors: ['#D28715', '#9D630A', '#4D7CFE', '#FFAB2B'],
      series: [this.grocery, this.health, this.rent, this.transportation],
      chart: {
        height: 245,
        type: 'donut',
      },
      legend: {
        position: 'left',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
          },
        },
      },
      labels: ['Grocery', 'Health & Weliness', 'Home Rent', 'Transportation'],
      responsive: [
        {
          breakpoint: 1190,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: 'top',
              itemMargin: {
                horizontal: 10,
                vertical: 0,
              },
              onItemHover: {
                highlightDataSeries: true,
              },
            },
          },
        },
        {
          breakpoint: 940,
          options: {
            chart: {
              width: 600,
            },
            legend: {
              position: 'top',
              itemMargin: {
                horizontal: 10,
                vertical: 5,
              },
              onItemHover: {
                highlightDataSeries: true,
              },
            },
          },
        },
        {
          breakpoint: 1000,
          options: {
            chart: {
              width: 300,
            },
          },
        },
        {
          breakpoint: 1100,
          options: {
            chart: {
              width: 300,
            },
          },
        },
        {
          breakpoint: 900,
          options: {
            chart: {
              width: 500,
            },
            legend: {
              position: 'top',
            },
          },
        },

        {
          breakpoint: 780,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: 'top',
            },
          },
        },
        {
          breakpoint: 720,
          options: {
            chart: {
              width: 350,
            },
            legend: {
              position: 'top',
            },
          },
        },
        {
          breakpoint: 650,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: 'top',
            },
          },
        },
      ],
    };
  }
}
