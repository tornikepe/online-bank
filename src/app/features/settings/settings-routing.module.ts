import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { SettingsGeneralInformationComponent } from './settings-general-information/settings-general-information.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsPaymentLimitsComponent } from './settings-payment-limits/settings-payment-limits.component';
import { SettingsSecurityComponent } from './settings-security/settings-security.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
	{
		path: '',
		component: SettingsComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: SettingsGeneralInformationComponent },
			{ path: 'notification', component: SettingsNotificationsComponent },
			{ path: 'payments', component: SettingsPaymentLimitsComponent },
			{ path: 'security', component: SettingsSecurityComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SettingsRoutingModule {}
