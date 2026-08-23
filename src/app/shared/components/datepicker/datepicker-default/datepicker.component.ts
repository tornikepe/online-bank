import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: false,
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  model!: NgbDateStruct;

  @Output() datepickerValue = new EventEmitter();

  /* The template passes the input element; the value comes from ngModel. */
  eventEmit() {
    this.datepickerValue.emit(this.model)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
