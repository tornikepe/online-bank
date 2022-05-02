import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { DatepickerModuleModule } from './shared/components/datepicker/datepicker-module.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecoverPassComponent } from "./auth/recover-pass/recover-pass.component";
import { AuthInterceptorService } from "./interceptors/auth-interceptor.service";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
	declarations: [
		AppComponent,
		RecoverPassComponent,
		SignInComponent,
		SignUpComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SharedModule,
		HttpClientModule,
		LayoutModule,
		ReactiveFormsModule,
		FontAwesomeModule,
		FormsModule,
		DatepickerModuleModule,
		NgbModule,
		CommonModule,
		InfiniteScrollModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
	exports: [],
})
export class AppModule {}
