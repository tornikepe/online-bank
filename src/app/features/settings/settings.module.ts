import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsGeneralInformationComponent } from './settings-general-information/settings-general-information.component';
import { SettingsSecurityComponent } from './settings-security/settings-security.component';
import { SettingsPaymentLimitsComponent } from './settings-payment-limits/settings-payment-limits.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
	declarations: [
		SettingsComponent,
		SettingsGeneralInformationComponent,
		SettingsSecurityComponent,
		SettingsPaymentLimitsComponent,
		SettingsNotificationsComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule,
		SettingsRoutingModule,
	],
	exports: [
		SettingsComponent,
		SettingsGeneralInformationComponent,
		SettingsSecurityComponent,
		SettingsPaymentLimitsComponent,
		SettingsNotificationsComponent,
	],
})
export class SettingsModule {}
