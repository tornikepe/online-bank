import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from './settings.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
	public showCancelButton: boolean = false;
	public disableUpdateButton: boolean = true;

	private subscribed: Subscription;
	private Sub: Subscription;

	constructor(
		private settingsService: SettingsService,
		private userService: UserService,
		private apiService: ApiService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.Sub = this.settingsService.showCancelButton.subscribe(
			value => (this.showCancelButton = value)
		);
		this.subscribed = this.settingsService.disableUpdateButton.subscribe(
			value => (this.disableUpdateButton = value)
		);
	}

	onUpdateButton() {
		this.settingsService.updateButtonClicked();
	}

	onCancelButton() {
		this.settingsService.cancelButtonClicked();
	}

	onCloseAccount() {
		//take Active user Info
		const user = this.userService.activeUser;
		const name = user.email;
		const id = user.id;
		//Confirm Delete Request
		if (confirm('Are you sure to delete ' + name)) {
			this.apiService.DeleteUser(id!).subscribe(
				resData => {
					//Server - ი აერორებს 500 მაგრამ მაინც შლის Users
					this.router.navigate(['/']);
				},
				error => {
					//Server - ი აერორებს 500 , მაგრამ მაინც შლის Users
					this.router.navigate(['/']);
				}
			);
		}
	}

	ngOnDestroy() {
		this.Sub.unsubscribe();
		this.subscribed.unsubscribe();
	}
}
