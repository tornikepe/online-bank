import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from '../settings.service';

export interface notificationType {
	id?: number;
	userId?: number;
	productupdate: boolean;
	offerupdates: boolean;
	comments: boolean;
	notifications: boolean;
}

@Component({
	selector: 'app-settings-notifications',
	templateUrl: './settings-notifications.component.html',
	styleUrls: ['./settings-notifications.component.scss'],
})
export class SettingsNotificationsComponent implements OnInit, OnDestroy { 
	public notificationGroup: FormGroup; 
	public isnotificationInDB = false; 
	public userId: number; 
	public notifications: any; 

	private updatenotification: Subscription; 
	private Subcreatenotification: Subscription; 
	private getnotification: Subscription; 
	private updatebuttonSub: Subscription; 
	private subCancel: Subscription; 
 
	constructor( 
		private _http: HttpClient, 
		private settingService: SettingsService, 
		private fb: FormBuilder 
	) {} 
 
	ngOnInit(): void { 
		this.userId = Number(localStorage.getItem('userId')); 
 
		this.notifications = { 
			userId: this.userId, 
			productupdate: false, 
			offerupdates: false, 
			comments: false, 
			notifications: false, 
		}; 
 
		this.subCancel = this.settingService.cancelSettingsButtonClicked.subscribe(() => { 
			this.reset(); 
		}); 
 
		this.updatebuttonSub = this.settingService.updateSettingsButtonClicked.subscribe( 
			() => { 
				this.createnotification(); 
			}  
		); 
 
		this.notificationGroup = this.fb.group({ 
			productupdate: [false], 
			offerupdates: [false], 
			comments: [false], 
			notifications: [false], 
		}); 
 
		this.getnotification = this._http 
			.get<notificationType[]>('http://localhost:3000/notifications') 
			.subscribe((allnotifications: notificationType[]) => { 
				const notification = allnotifications.find((element: notificationType) => { 
					return element.userId == this.userId; 
				}); 
				if (notification) { 
					this.isnotificationInDB = true; 
					this.notifications = notification; 
					this.notificationGroup.patchValue({ 
						productupdate: notification.productupdate, 
						offerupdates: notification.offerupdates, 
						comments: notification.comments, 
						notifications: notification.notifications, 
					}); 
				} 
			}); 
	} 
	setForm(value: boolean, whichtogle: string) { 
		this.notificationGroup.patchValue({ 
			[whichtogle]: value, 
		}); 
		this.compareFormAndNotification(); 
	} 
	compareFormAndNotification() { 
		var isequal: boolean = true; 
		for (let i in this.notificationGroup.value) { 
			if (this.notificationGroup.value[i] !== this.notifications[i]) { 
				isequal = false; 
			} 
		} 
		this.settingService.disabledUpdateButton(isequal); 
		this.settingService.toggleCancelButton(!isequal); 
	} 
 
	createnotification() { 
		const notificationforsend = {  
			userId: this.userId, 
			productupdate: this.notificationGroup.get('productupdate')?.value, 
			offerupdates: this.notificationGroup.get('offerupdates')?.value, 
			comments: this.notificationGroup.get('comments')?.value, 
			notifications: this.notificationGroup.get('notifications')?.value, 
		}; 
		if (this.isnotificationInDB) { 
			this.updatenotification = this._http 
				.put( 
					`http://localhost:3000/notifications/${this.notifications.id}`, 
					notificationforsend 
				) 
				.subscribe(data => { 
					this.settingService.disabledUpdateButton(true); 
					this.settingService.toggleCancelButton(false); 
					this.notifications = data; 
 
					alert('Notification Updated!'); 
				}); 
		} else { 
			this.Subcreatenotification = this._http 
				.post(`http://localhost:3000/notifications/`, notificationforsend) 
				.subscribe(data => { 
					this.settingService.disabledUpdateButton(true); 
					this.settingService.toggleCancelButton(false); 
					this.isnotificationInDB = true; 
					this.notifications = data; 
					alert('Notification Updated!'); 
				}); 
		} 
	} 
 
	reset() { 
		this.notificationGroup.patchValue({ 
			productupdate: this.notifications.productupdate, 
			offerupdates: this.notifications.offerupdates, 
			comments: this.notifications.comments, 
			notifications: this.notifications.notifications, 
		}); 
		this.settingService.disabledUpdateButton(true); 
		this.settingService.toggleCancelButton(false); 
	} 
 
	ngOnDestroy(): void { 
		this.getnotification.unsubscribe(); 
		this.updatebuttonSub.unsubscribe(); 
		this.subCancel.unsubscribe(); 
		if (this.updatenotification) { 
			this.updatenotification.unsubscribe(); 
		} 
		if (this.Subcreatenotification) { 
			this.Subcreatenotification.unsubscribe(); 
		} 
 
		this.settingService.disabledUpdateButton(true); 
		this.settingService.toggleCancelButton(false); 
	} 
} 