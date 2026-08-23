import { Component, OnDestroy, OnInit, ChangeDetectorRef, DestroyRef, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentLimits } from 'src/app/models/banking.model';

/** The three progress bars, keyed the same way the limits are. */
type LimitPercentages = Pick<
	PaymentLimits,
	'cashWithdrawals' | 'bankTransactions' | 'onlinePayments'
>;
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from '../settings.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from "src/app/shared/notifications/notifications.service";
@Component({
	standalone: false,
	selector: 'app-settings-payment-limits',
	templateUrl: './settings-payment-limits.component.html',
	styleUrls: ['./settings-payment-limits.component.scss'],
})
export class SettingsPaymentLimitsComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

	public existUserLimitInDB: boolean = false;
	public userId: number;
	public usersLimits: PaymentLimits;

	private SubCancel: Subscription;
	constructor(private settingService: SettingsService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private notification: NotificationsService) {}

	usersSpendings: PaymentLimits;

	/** How much of each limit is already spent, as a percentage. */
	persents: LimitPercentages;

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

		/* A placeholder until the real record lands, so the bars have something
		   to draw. id 0 means "not saved yet". */
		this.usersLimits = {
			id: 0,
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
						  this.cdr.markForCheck();
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

		this.valuechangeSub = this.limitForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(formvalue => {
			this.cancalButton();
			let showupdate = false;
			for (const i of Object.keys(formvalue) as (keyof LimitPercentages)[]) {
				if (formvalue[i] < this.usersSpendings[i]) {
					showupdate = true;
				}
			}
			if (this.comperaUserLimitsAndForm() || this.limitForm.invalid) {
				showupdate = true;
			}
			this.settingService.disabledUpdateButton(showupdate);
				  this.cdr.markForCheck();
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
				  this.cdr.markForCheck();
		});
	}

	initialUserLimits() {
		this.initialuserLimitsSub = this.settingService
			.getAllLimits()
			.subscribe((limits) => {
				const user_limits = limits.find((limit) => {
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
						  this.cdr.markForCheck();
			});
	}

	initialUserSpending() {
		this.initialSpendingsSub = this.settingService
			.getAllSpendings()
			.subscribe((spendings) => {
				const user_spendings = spendings.find((spending) => {
					return spending.userId == this.userId;
				});
				if (user_spendings) {
					this.usersSpendings = user_spendings;
				}
				this.getPercent();
						  this.cdr.markForCheck();
			});
	}

	comperaUserLimitsAndForm(): boolean {
		const fields = Object.keys(this.limitForm.value) as (keyof LimitPercentages)[];
		return fields.every(
			(field) => this.limitForm.value[field] == this.usersLimits[field]
		);
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

						this.notification.open({
          class: 'secondary-green',
          text: 'Notification Updated',
        });
										  this.cdr.markForCheck();
					});
			} else {
				this.createLimitSub = this.settingService
					.createLimit(newUserLimit)
					.subscribe(data => {
						this.initialUserSpending();
						this.initialUserLimits();
						this.settingService.toggleCancelButton(false);
						this.settingService.disabledUpdateButton(true);
						this.notification.open({
          class: 'secondary-green',
          text: 'Notification Updated',
        });
										  this.cdr.markForCheck();
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
