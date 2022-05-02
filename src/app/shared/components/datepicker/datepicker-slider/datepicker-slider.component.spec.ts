import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerSliderComponent } from './datepicker-slider.component';

describe('DatepickerSliderComponent', () => {
  let component: DatepickerSliderComponent;
  let fixture: ComponentFixture<DatepickerSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
