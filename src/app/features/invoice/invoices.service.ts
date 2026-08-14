import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Invoice } from './invoice.model';

import { environment } from "src/environments/environment";
@Injectable({ providedIn: 'root' })
export class InvoicesService {
	protected templateValue: string;

	constructor(private http: HttpClient) {}

	sendNewInvoice(invoice: Invoice) {
		//send Http request to server
		return this.http.post<any>(`${environment.BaseUrl}invoices`, { ...invoice });
	}

	set setSelectedTemplate(value: string) {
		this.templateValue = value;
	}

	get getSelectedTemplate() {
		return this.templateValue;
	}

	public getAllInvoices() {
		return this.http.get<Invoice[]>(`${environment.BaseUrl}invoices`).pipe(
			map(data => {
				return data.sort((a: any, b: any) => {
					var dateA = new Date(a.date).getTime();
					var dateB = new Date(b.date).getTime();
					return dateA > dateB ? 1 : -1;
				});
			})
		);
	}
}
