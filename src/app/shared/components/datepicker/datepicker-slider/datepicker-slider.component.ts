import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

interface Date {
  year: number;
  month: string;
  day: number;
}

@Component({
  selector: 'app-datepicker-slider',
  templateUrl: './datepicker-slider.component.html',
  styleUrls: ['./datepicker-slider.component.scss']
})
export class DatepickerSliderComponent implements OnInit {
  public months: any  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public year: number = 2021;
  public month: string = 'December';
  public day: number = 21;
  public date!: Date;
  public showBoolean: Boolean = false;

  model!: NgbDateStruct;

  @Output() datepickerValue = new EventEmitter();

  show() {
    this.showBoolean = !this.showBoolean;
  }

  decrement() {
    this.year -= 1;
  }

  increment() {
    this.year += 1
  }

  lastMonth() {
    let index = this.months.indexOf(this.month)
    if (index != 0) this.month = this.months[index - 1]
  }

  nextMonth() {
    let index = this.months.indexOf(this.month)
    if (index != 11) this.month = this.months[index + 1]
  }

  lastDay() {
    if(this.day != 1) this.day -= 1
  }

  nextDay() {
    if(this.day != 31) this.day += 1
  }

  setDate() {
    this.date = {
      year: this.year,
      month: this.month,
      day: this.day
    }
    this.datepickerValue.emit(this.date)
    this.showBoolean = false
  }

  constructor() { }

  ngOnInit(): void {
  }

}
