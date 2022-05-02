import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Invoice } from '../invoice.model';
import { InvoicesService } from '../invoices.service';
import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexXAxis,
	ApexDataLabels,
	ApexTooltip,
	ApexStroke,
	ApexLegend,
	ApexYAxis,
	ApexTitleSubtitle,
	ApexGrid,
} from 'ng-apexcharts';
import { ActivatedRoute, Router } from '@angular/router';
export interface ChartOptionsType {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	stroke: ApexStroke;
	dataLabels: ApexDataLabels;
	colors: string[];
	legend: ApexLegend;
	yaxis: ApexYAxis;
	grid: ApexGrid;
}
@Component({
	selector: 'app-invoices',
	templateUrl: './invoices.component.html',
	styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnDestroy {
	public template_name: string;
	public showtoggle: any;
	public chartOptions: ChartOptionsType;
	public series: ApexAxisChartSeries;
	public xaxis: ApexXAxis;
	public allinvoices: Invoice[];
	public pendings: Invoice[];
	public paid: Invoice[];
	public cancelled: Invoice[];
	public totalamount: number;
	public month_names: string[];
	public yearsForDropDown: string[];
	public selectedMonth: string;
	public selectedyear: string;
	public userId: number;

	private getInvoicesSub: Subscription;

	constructor(
		private invoiceService: InvoicesService,
		private route: ActivatedRoute,
		private router: Router
	) {}
	ngOnInit(): void {
		this.template_name = 'Webdesign';
		this.userId = Number(localStorage.getItem('userId'));
		this.month_names = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		this.yearsForDropDown = [];
		const today = new Date();
		for (let i = today.getFullYear(); i >= 1990; i--) {
			this.yearsForDropDown.push(`${i}`);
		}
		this.selectedMonth = today.toLocaleString('default', { month: 'long' });
		this.selectedyear = `${today.getUTCFullYear()}`;
		this.series = [{ data: [] }];
		this.allinvoices = [];
		this.pendings = [];
		this.paid = [];
		this.cancelled = [];
		this.totalamount = 0;
		this.initialChartOptions();
		this.comparedates();
	}
	initialChartOptions() {
		this.chartOptions = {
			colors: ['#FFAB2B'],
			series: [
				{
					name: '$',
					data: [1, 2],
				},
			],
			chart: {
				toolbar: {
					show: false,
				},
				type: 'area',
			},
			legend: {
				position: 'top',
				horizontalAlign: 'left',
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
			},
			xaxis: {},
			yaxis: {
				labels: {
					show: false,
				},
			},
			grid: {
				show: false,
			},
		};
	}
	comparedates() {
		this.getInvoicesSub = this.invoiceService.getAllInvoices().subscribe(invoices => {
			this.allinvoices = [];
			this.pendings = [];
			this.paid = [];
			this.cancelled = [];
			this.totalamount = 0;
			for (let invoice of invoices) {
				if (this.userId == invoice.userId) {
					var invoiceDate = new Date(invoice.dateOfCreation);
					var invoice_month_name = invoiceDate.toLocaleString('default', {
						month: 'long',
					});
					var invoice_Year = `${invoiceDate.getFullYear()}`;
					if (
						invoice_month_name == this.selectedMonth &&
						invoice_Year == this.selectedyear
					) {
						this.allinvoices.push(invoice);
					}
				}
			}
			let amounts: number[] = [];
			var categories: string[] = [];
			for (let i of this.allinvoices) {
				let invoice_amount: number = 0;
				for (let item of i.items) {
					invoice_amount += item.price * item.itemQty;
				}
				i.amount = invoice_amount;
				if (i.status == 'Pending') {
					this.pendings.push(i);
				} else if (i.status == 'Paid') {
					this.paid.push(i);
					var date = new Date(i.dueDate);
					categories.push(
						`${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`
					);
					amounts.push(i.amount);
					this.totalamount += i.amount;
				} else if (i.status == 'Cancelled') {
					this.cancelled.push(i);
				}
			}
			this.series = [
				{
					name: '$',
					data: amounts,
				},
			];
			this.xaxis = {
				labels: {
					show: false,
				},
				axisBorder: {
					show: false,
				},
				axisTicks: {
					show: false,
				},
				categories: categories,
			};
		});
	}

	getInvoiceForModal(invoice: Invoice) {
		this.showtoggle = invoice;
	}

	changeMontName(event: any) {
		this.selectedMonth = event;
		this.comparedates();
	}

	changeyear(event: any) {
		this.selectedyear = event;
		this.comparedates();
	}

	onCreateInvoice() {
		//set selected Template Value in Service
		this.invoiceService.setSelectedTemplate = this.template_name;
		//redirect to new invoice page
		this.router.navigate(['newInvoice'], { relativeTo: this.route });
	}

	ngOnDestroy(): void {
		this.getInvoicesSub.unsubscribe();
	}
}
