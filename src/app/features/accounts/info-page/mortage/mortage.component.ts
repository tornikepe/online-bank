import {Component, OnInit, ViewChild} from "@angular/core";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent, ApexDataLabels, ApexLegend
} from "ng-apexcharts";
import {CardService} from "../../card.service";
import {GetnotfsService} from "../../../../services/getnotfs.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NotificationsService} from "../../../../shared/notifications/notifications.service";

export type ChartOptions = {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  noData: ApexNoData | any;
};

@Component({
  selector: "app-mortage",
  templateUrl: "./mortage.component.html",
  styleUrls: ["./mortage.component.scss"],
})
export class MortgageComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public loadData: any[];
  private id: number;

  chartValues: any[];

  constructor(
      private cardService: CardService,
      private getnotfsService: GetnotfsService,
      private router: Router,
      private route: ActivatedRoute,
      private notification: NotificationsService
  ) {
    this.chartOptions = {
      series: [70, 10, 20],
      chart: {
        type: "donut",
        width: 400,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'left',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Rubik, Arial',
        fontWeight: 400,
        formatter: undefined,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 50,
        labels: {
          colors: undefined,
          useSeriesColors: false
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: undefined,
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0
        },
        itemMargin: {
          horizontal: 5,
          vertical: 0
        },
        onItemClick: {
          toggleDataSeries: true
        },
        onItemHover: {
          highlightDataSeries: true
        },
      },
      noData: {
        text: "Loading data...",
      },
      labels: ["Amount", "Interest rate", "Paid"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "top"
            }
          }
        }
      ]
    };
  }

  getData() {
    this.cardService.getLoansSingle(this.id)
        .subscribe((data: any) => {
          this.loadData = [data]
          setTimeout(() => {
            console.log(this.loadData)
          },1000)
        })
  }

  delete() {
    this.cardService.deleteLoan(this.id)
        .subscribe()
    this.getnotfsService.addNotf({
      userId: localStorage.getItem('userId'),
      title: 'loan deleted',
      value: 'loan has been successfully deleted from your account and cannot be restored',
      link: 'accounts'
    }).subscribe()
    this.router.navigate(['accounts'])
    this.notification.open({
      class: 'secondary-pink',
      text: 'mortgage has been deleted'
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })
    this.getData()
    setTimeout(() => {
      for(let item of this.loadData) {
        this.chartValues = [item.paidAmount + item.startingAmount, item.startingAmount, item.paidAmount]
      }
      this.chart.updateSeries(this.chartValues)
    },1000);
  }

  public transactions: any = [
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
    {
      name: "bank transfer",
      title: "Money transfer to david khvedelidze",
      amount: 10480000,
    },
  ];
}
