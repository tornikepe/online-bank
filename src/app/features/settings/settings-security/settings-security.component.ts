import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, Subscription, tap } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from '../settings.service';

@Component({
	selector: 'app-settings-security',
	templateUrl: './settings-security.component.html',
	styleUrls: ['./settings-security.component.scss'],
})
export class SettingsSecurityComponent implements OnInit, OnDestroy {
	public form!: FormGroup;
	public passInputValidClass: string = '';
	public showIcon = true;

	private user: User;
	private SubUpdate: Subscription;
	private SubCancel: Subscription;
	private SubForm: Subscription;

	constructor(
		private fb: FormBuilder,
		private settingsService: SettingsService,
		private userService: UserService,
		private apiService: ApiService
	) {}

	ngOnInit(): void {
		//Create Virtual ReactiveForm
		this.form = this.fb.group({
			oldPassword: ['', [Validators.required]],
			newPassword: ['', [Validators.required]],
		});
		//Set NewPassword Input Field Disabled
		this.form.controls['newPassword'].disable();
		//Listen to Update Button Click
		this.SubUpdate = this.settingsService.updateSettingsButtonClicked.subscribe(() => {
			this.onUpdateSettingsClick();
		});
		//Listen to Cancel Button Click
		this.SubCancel = this.settingsService.cancelSettingsButtonClicked.subscribe(() => {
			this.onCancelSettingsClick();
		});

		//Listen To Input valueChange
		this.SubForm = this.form.valueChanges
			.pipe(
				distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
				tap(() => {
					//Set NewPassword Input Field Enable
					this.form.controls['newPassword'].enable();
					//Set Input View Classes in case
					if (this.form.invalid) {
						this.passInputValidClass = 'input-warn';
						//Disable Update Button
						this.settingsService.disabledUpdateButton(true);
					} else if (this.form.valid) {
						this.passInputValidClass = 'input-success';
						//Enable Update Button
						this.settingsService.disabledUpdateButton(false);
					}
					this.showIcon = false;
					//Show Cancel/Reset button
					this.settingsService.toggleCancelButton(true);
				})
			)
			.subscribe();
	}

	onUpdateSettingsClick() {
		if (this.form.valid) {
			//Take Value from Input Form
			const oldPassword = this.form.controls['oldPassword'].value;
			const newPassword = this.form.controls['newPassword'].value;
			//Get Active User Info
			this.user = this.userService.activeUser;

			//Check If Old Pass Is Valid
			this.apiService.LogIn(this.user.email, oldPassword).subscribe(
				res => {
					//If Res === Success
					//delete Old Token
					localStorage.removeItem('auth_token');
					//Sett New Token
					localStorage.setItem('auth_token', JSON.stringify(res.accessToken));
					//Check If New Pass is valid
					if (newPassword !== '') {
						//create User Object for Update Request
						const user = {
							email: this.user.email,
							password: newPassword,
							Full_Name: this.user.Full_Name,
							Agree_Term: this.user.Agree_Term,
						};
						//Update Password )--->>> Send Update Request
						this.apiService.update_user_to_server_with_id(user, this.user.id!).subscribe(
							resData => {
								//Notification about Success
								//clear Form Value
								this.form.reset();
								this.passInputValidClass = '';
								alert('Password updated successfully!');
							},
							//Alert Error
							error => {
								alert(error.error);
							}
						);
					}
				},
				//Alert Error LogIn
				error => {
					//clear Form Value
					this.form.reset();
					this.passInputValidClass = '';
					alert('Incorrect Password!');
				}
			);
		} else {
			alert('You Must Complete Forms!');
		}
	}

	onCancelSettingsClick() {
		//clear Form Value
		this.form.reset();
		this.passInputValidClass = '';
		this.settingsService.disabledUpdateButton(true);
	}

	ngOnDestroy(): void {
		// unsubscribe
		this.SubUpdate.unsubscribe();
		this.SubCancel.unsubscribe();
		this.SubForm.unsubscribe();
		// Hide Cancel Button
		this.settingsService.toggleCancelButton(false);
	}
}
