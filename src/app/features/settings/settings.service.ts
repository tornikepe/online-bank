import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PaymentLimits } from 'src/app/models/banking.model';

import { environment } from "src/environments/environment";
@Injectable({ providedIn: 'root' })
export class SettingsService {
	constructor(private _http: HttpClient) {}

	showCancelButton = new BehaviorSubject<boolean>(false);
	disableUpdateButton = new BehaviorSubject<boolean>(true);
	updateSettingsButtonClicked = new Subject<void>();
	cancelSettingsButtonClicked = new Subject<void>();

	updateButtonClicked() {
		this.updateSettingsButtonClicked.next();
	}

	disabledUpdateButton(value: boolean) {
		this.disableUpdateButton.next(value);
	}

	cancelButtonClicked() {
		this.cancelSettingsButtonClicked.next();
	}

	toggleCancelButton(value: boolean) {
		this.showCancelButton.next(value);
	}

	getAllLimits(): Observable<PaymentLimits[]> {
		return this._http.get<PaymentLimits[]>(`${environment.BaseUrl}limits`);
	}

	updateLimit(id: number, newUserLimit: Omit<PaymentLimits, 'id'>) {
		return this._http.put(`${environment.BaseUrl}limits/${id}`, newUserLimit);
	}

	createLimit(newUserLimit: Omit<PaymentLimits, 'id'>) {
		return this._http.post(`${environment.BaseUrl}limits`, newUserLimit);
	}

	getAllSpendings(): Observable<PaymentLimits[]> {
		return this._http.get<PaymentLimits[]>(`${environment.BaseUrl}spendings`);
	}
}
