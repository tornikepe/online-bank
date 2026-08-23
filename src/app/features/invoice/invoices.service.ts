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
				/* This sorted on `a.date`, which no invoice has — the model holds
				   dateOfCreation and dueDate. Both sides came out NaN, so the
				   comparison was always false and the list never got ordered.
				   Due date is the one the list shows, so order by that. */
				return [...data].sort(
					(a, b) =>
						new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
				);
			})
		);
	}
}
