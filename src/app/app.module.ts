import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { DatepickerModuleModule } from './shared/components/datepicker/datepicker-module.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecoverPassComponent } from "./auth/recover-pass/recover-pass.component";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

/* The application bootstraps through `bootstrapApplication` (see main.ts), so this
   module no longer bootstraps a component. It groups the NgModule-based parts of the
   app — the auth screens and the shared/layout scopes — and is pulled into the
   injector via `importProvidersFrom` in app.config.ts. */
@NgModule({
	declarations: [
		RecoverPassComponent,
		SignInComponent,
		SignUpComponent,
	],
	imports: [
		CommonModule,
		AppRoutingModule,
		SharedModule,
		LayoutModule,
		ReactiveFormsModule,
		FontAwesomeModule,
		FormsModule,
		DatepickerModuleModule,
		NgbModule,
		InfiniteScrollModule,
	],
})
export class AppModule {}
