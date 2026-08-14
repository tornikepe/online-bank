import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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

	getAllLimits() {
		return this._http.get(`${environment.BaseUrl}limits`);
	}

	updateLimit(id: number, newUserLimit: any) {
		return this._http.put(`${environment.BaseUrl}limits/${id}`, newUserLimit);
	}

	createLimit(newUserLimit: any) {
		return this._http.post(`${environment.BaseUrl}limits`, newUserLimit);
	}

	getAllSpendings() {
		return this._http.get(`${environment.BaseUrl}spendings`);
	}
}
