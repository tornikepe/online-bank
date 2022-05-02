import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {
  @Output() clickedRadioButton=new EventEmitter<boolean>()
  @Input() checked = false;
  @Input () disabled: boolean = false;
  @Input () notdefaulte: boolean = false;
  @Input() text:string='';
  constructor() {}

  ngOnInit(): void {
  }
  
  radiobutton(){
    if(!this.disabled){
      this.checked = !this.checked
      this.clickedRadioButton.emit(this.checked)
    }
  }

}
