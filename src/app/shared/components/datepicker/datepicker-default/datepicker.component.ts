import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  model!: NgbDateStruct;

  @Output() datepickerValue = new EventEmitter();

  eventEmit(e: any) {
    this.datepickerValue.emit(this.model)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
