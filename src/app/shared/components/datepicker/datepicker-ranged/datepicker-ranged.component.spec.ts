import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerRangedComponent } from './datepicker-ranged.component';

describe('DatepickerRangedComponent', () => {
  let component: DatepickerRangedComponent;
  let fixture: ComponentFixture<DatepickerRangedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerRangedComponent ]
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
