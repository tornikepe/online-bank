import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Invoice, item } from '../../invoice.model'; 
@Component({ 
	standalone: false,
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
	} 
	cancelModal() { 
		this.cancelTogle.emit(null); 
	} 
	sumItemPrices(item: item) { 
		let sum = 0; 
		sum += item.itemQty * item.price; 
		return sum; 
	} 
	getsubtotal(amount: number = 0, tax: number) { 
		return amount - (amount / 100) * tax; 
	} 
	getTax(amount: number = 0, tax: number) { 
		return (amount / 100) * tax; 
	} 
} 