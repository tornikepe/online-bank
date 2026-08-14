import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SharedModule } from '../shared/shared.module';
import { DatepickerModuleModule } from '../shared/components/datepicker/datepicker-module.module';

/**
 * The pieces nearly every component template reaches for — pipes, form
 * directives, the shared UI kit, icons and charts.
 *
 * The generated specs declared their component and nothing else, so every
 * template that used `app-input-field`, `fa-icon` or the `currency` pipe failed
 * to compile. Importing this module in a spec makes those available without
 * repeating the list in each file.
 */
@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    DatepickerModuleModule,
    FontAwesomeModule,
    NgApexchartsModule,
    NgbModule,
    InfiniteScrollModule,
  ],
})
export class TestingSupportModule {}
