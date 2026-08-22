import { Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from './settings.service';

@Component({
	standalone: false,
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
		private router: Router, private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.Sub = this.settingsService.showCancelButton.subscribe(value => {
			this.showCancelButton = value;
			this.cdr.markForCheck();
		});
		this.subscribed = this.settingsService.disableUpdateButton.subscribe(value => {
			this.disableUpdateButton = value;
			this.cdr.markForCheck();
		});
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
								  this.cdr.markForCheck();
				},
				error => {
					//Server - ი აერორებს 500 , მაგრამ მაინც შლის Users
					this.router.navigate(['/']);
								  this.cdr.markForCheck();
				}
			);
		}
	}

	ngOnDestroy() {
		this.Sub.unsubscribe();
		this.subscribed.unsubscribe();
	}
}
