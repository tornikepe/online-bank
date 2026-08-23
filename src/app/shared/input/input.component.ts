import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	standalone: false,
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
  @Input() value: string;
  @Input() width: string;
  @Output() inputValue = new EventEmitter<string>();

	sendParentData(userInput: HTMLInputElement) {
		this.inputValue.emit(userInput.value);
	}

	constructor() {}
}
