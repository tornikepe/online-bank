import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'; 
import { Invoice } from '../../invoice.model'; 
@Component({ 
	selector: 'app-invoice-details', 
	templateUrl: './invoice-details.component.html', 
	styleUrls: ['./invoice-details.component.scss'], 
}) 
export class InvoiceDetailsComponent implements OnInit { 
	@Output() cancelTogle = new EventEmitter(); 
	@Input() singleInvoice: Invoice; 
	@Input() toggleModal: boolean; 
	blur: string = 'inactive'; 
	// public toggleModal:boolean = true 
	constructor() {} 
	ngOnInit(): void { 
		console.log(this.singleInvoice); 
	} 
	cancelModal() { 
		this.cancelTogle.emit(null); 
	} 
	sumItemPrices(item: any) { 
		let sum = 0; 
		sum += item.itemQty * item.price; 
		return sum; 
	} 
	getsubtotal(amount: any, tax: number) { 
		return amount - (amount / 100) * tax; 
	} 
	getTax(amount: any, tax: number) { 
		return (amount / 100) * tax; 
	} 
} 