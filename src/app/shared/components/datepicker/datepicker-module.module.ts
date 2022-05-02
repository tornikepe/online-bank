import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker-default/datepicker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DatepickerRangedComponent } from './datepicker-ranged/datepicker-ranged.component';
import { DatepickerSliderComponent } from './datepicker-slider/datepicker-slider.component';

@NgModule({
  declarations: [
    DatepickerComponent,
    DatepickerRangedComponent,
    DatepickerSliderComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  exports: [
    DatepickerComponent,
    DatepickerRangedComponent,
    DatepickerSliderComponent
  ]
})
export class DatepickerModuleModule { }
