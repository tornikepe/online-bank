import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerModuleModule } from '../datepicker-module.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../../testing/testing-support.module';
import { DatepickerRangedComponent } from './datepicker-ranged.component';

describe('DatepickerRangedComponent', () => {
  let component: DatepickerRangedComponent;
  let fixture: ComponentFixture<DatepickerRangedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerModuleModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerRangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
