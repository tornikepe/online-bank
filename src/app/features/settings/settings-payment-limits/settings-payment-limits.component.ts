import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from '../settings.service';

@Component({
	selector: 'app-settings-payment-limits',
	templateUrl: './settings-payment-limits.component.html',
	styleUrls: ['./settings-payment-limits.component.scss'],
})
export class SettingsPaymentLimitsComponent implements OnInit, OnDestroy {
	public existUserLimitInDB: boolean = false;
	public userId: number;
	public usersLimits: any;

	private SubCancel: Subscription;
	constructor(private settingService: SettingsService, private fb: FormBuilder) {}

	usersSpendings: any;

	persents: any;

	limitForm!: FormGroup;
	private regexForNumber = /^\d+$/;
	private checkfirstnumber = /^([1-9][0-9]*)|([0]+)$/;

	private updatebuttonSub: Subscription;
	private initialuserLimitsSub: Subscription;
	private initialSpendingsSub: Subscription;
	private createLimitSub: Subscription;
	private updateLimitSub: Subscription;
	private valuechangeSub: Subscription;

	ngOnInit(): void {
		this.userId = Number(localStorage.getItem('userId'));

		this.usersLimits = {
			cashWithdrawals: 0,
			bankTransactions: 0,
			onlinePayments: 0,
			userId: this.userId,
		};

		this.usersSpendings = { ...this.usersLimits };

		this.persents = { ...this.usersLimits };

		this.updatebuttonSub = this.settingService.updateSettingsButtonClicked.subscribe(
			() => {
				this.createlimit();
			}
		);

		if (!this.limitForm) {
			this.limitForm = this.fb.group({
				cashWithdrawals: [
					0,
					[
						Validators.required,
						Validators.pattern(this.regexForNumber),
						Validators.pattern(this.checkfirstnumber),
					],
				],
				bankTransactions: [
					0,
					[
						Validators.required,
						Validators.pattern(this.regexForNumber),
						Validators.pattern(this.checkfirstnumber),
					],
				],
				onlinePayments: [
					0,
					[
						Validators.required,
						Validators.pattern(this.regexForNumber),
						Validators.pattern(this.checkfirstnumber),
					],
				],
			});
		}

		this.valuechangeSub = this.limitForm.valueChanges.subscribe(formvalue => {
			this.cancalButton();
			var showupdate: any = false;
			for (let i in formvalue) {
				if (formvalue[i] < this.usersSpendings[i]) {
					showupdate = true;
				}
			}
			if (this.comperaUserLimitsAndForm() || this.limitForm.invalid) {
				showupdate = true;
			}
			this.settingService.disabledUpdateButton(showupdate);
		});

		this.initialUserSpending();
		this.initialUserLimits();

		this.SubCancel = this.settingService.cancelSettingsButtonClicked.subscribe(() => {
			this.limitForm.patchValue({
				cashWithdrawals: this.usersLimits.cashWithdrawals,
				bankTransactions: this.usersLimits.bankTransactions,
				onlinePayments: this.usersLimits.onlinePayments,
			});
			this.settingService.disabledUpdateButton(true);
		});
	}

	initialUserLimits() {
		this.initialuserLimitsSub = this.settingService
			.getAllLimits()
			.subscribe((limits: any) => {
				const user_limits = limits.find((limit: any) => {
					return limit.userId == this.userId;
				});
				if (user_limits) {
					this.usersLimits = user_limits;
					this.existUserLimitInDB = true;
					this.limitForm.patchValue({
						cashWithdrawals: this.usersLimits.cashWithdrawals,
						bankTransactions: this.usersLimits.bankTransactions,
						onlinePayments: this.usersLimits.onlinePayments,
					});
				}
				this.getPercent();
			});
	}

	initialUserSpending() {
		this.initialSpendingsSub = this.settingService
			.getAllSpendings()
			.subscribe((spendings: any) => {
				const user_spendings = spendings.find((spending: any) => {
					return spending.userId == this.userId;
				});
				if (user_spendings) {
					this.usersSpendings = user_spendings;
				}
				this.getPercent();
			});
	}

	comperaUserLimitsAndForm() {
		for (let i in this.limitForm.value) {
			if (this.limitForm.value[i] != this.usersLimits[i]) {
				return false;
			}
		}
		return true;
	}

	cancalButton() {
		let isequal: boolean = this.comperaUserLimitsAndForm();
		this.settingService.toggleCancelButton(!isequal);
	}

	getPercent() {
		this.persents = {
			cashWithdrawals:
				(this.usersSpendings.cashWithdrawals /
					this.limitForm.get('cashWithdrawals')?.value) *
				100,
			bankTransactions:
				(this.usersSpendings.bankTransactions /
					this.limitForm.get('bankTransactions')?.value) *
				100,
			onlinePayments:
				(this.usersSpendings.onlinePayments /
					this.limitForm.get('onlinePayments')?.value) *
				100,
			userId: this.userId,
		};
	}

	createlimit() {
		if (this.limitForm.valid) {
			const newUserLimit = Object.assign({
				cashWithdrawals: +this.limitForm.value.cashWithdrawals,
				bankTransactions: +this.limitForm.value.bankTransactions,
				onlinePayments: +this.limitForm.value.onlinePayments,
				userId: this.userId,
			});
			if (this.existUserLimitInDB) {
				this.updateLimitSub = this.settingService
					.updateLimit(this.usersLimits.id, newUserLimit)
					.subscribe(data => {
						this.initialUserSpending();
						this.initialUserLimits();
						this.settingService.toggleCancelButton(false);
						this.settingService.disabledUpdateButton(true);

						alert('Notification Updated');
					});
			} else {
				this.createLimitSub = this.settingService
					.createLimit(newUserLimit)
					.subscribe(data => {
						this.initialUserSpending();
						this.initialUserLimits();
						this.settingService.toggleCancelButton(false);
						this.settingService.disabledUpdateButton(true);
						alert('Notification Updated');
					});
			}
		}
	}

	ngOnDestroy(): void {
		this.settingService.toggleCancelButton(false);
		this.settingService.disabledUpdateButton(true);

		this.SubCancel.unsubscribe();
		this.initialuserLimitsSub.unsubscribe();
		this.initialSpendingsSub.unsubscribe();
		this.valuechangeSub.unsubscribe();

		if (this.updateLimitSub) {
			this.updateLimitSub.unsubscribe();
		}

		if (this.createLimitSub) {
			this.createLimitSub.unsubscribe();
		}
		if (this.updatebuttonSub) {
			this.updatebuttonSub.unsubscribe();
		}
	}
}
