import { ClickOutsideDirective } from './components/profile/clickoutside.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './components/profile/profile.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationComponent } from './pagination/pagination.component';
import { ButtonsComponent } from './components/buttons/button.component';
import { ToggleComponent } from './toggle/toggle.component';
import { TabsGroupComponent } from './tabs-group/tabs-group.component';
import { SingleTab } from './tabs-group/tab.component';
import { InputComponent } from './input/input.component';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { CreditcardPipe } from './pipes/creditcard.pipe';

import {
  faChartBar,
  faCreditCard,
  faShare,
  faTachometerAlt,
  faBars,
  faChevronLeft,
  faChevronRight,
  faCog,
  faUser,
  faNewspaper,
  faFileInvoice,
  faEllipsisH,
  faPoundSign,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		NgxEmojiPickerModule,
		FontAwesomeModule,
	],
	declarations: [
		ClickOutsideDirective,
		TextAreaComponent,
		ToggleComponent,
		TabsGroupComponent,
		SingleTab,
		InputComponent,
		NotificationsComponent,
		PaginationComponent,
		ButtonsComponent,
		ProfileComponent,
		DropdownComponent,
		ProgressbarComponent,
		InputFieldComponent,
		RadioButtonComponent,
		CreditcardPipe,
	],
	exports: [
		ProfileComponent,
		ClickOutsideDirective,
		TextAreaComponent,
		TabsGroupComponent,
		SingleTab,
		ToggleComponent,
		InputComponent,
		ProgressbarComponent,
		PaginationComponent,
		ButtonsComponent,
		FontAwesomeModule,
		DropdownComponent,
		InputFieldComponent,
		RadioButtonComponent,
		NotificationsComponent,
		CreditcardPipe,
	],
})
export class SharedModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(
			faShare,
			faCreditCard,
			faChartBar,
			faTachometerAlt,
			faChevronLeft,
			faChevronRight,
			faBars,
			faCog,
			faUser,
			faNewspaper,
			faFileInvoice,
			faEllipsisH,
			faPoundSign,
			faLongArrowAltUp,
			faLongArrowAltDown,
			faBell
		);
	}
}
