import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() name: string;
  @Input() type: string;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() inputClass: string;
  @Input() disabled: boolean;
  @Input() value: any;
  @Input() width: string;
  @Output() inputValue = new EventEmitter();

	sendParentData(userInput: any) {
		this.inputValue.emit(userInput.value);
	}

	constructor() {}
}
