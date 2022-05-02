import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EmojiEvent } from "ngx-emoji-picker";

@Component({
  selector: "app-text-area",
  templateUrl: "./text-area.component.html",
  styleUrls: ["./text-area.component.scss"],
})
export class TextAreaComponent implements OnInit {
  form = new FormGroup({
    textarea: new FormControl({
      value: "",
      disabled: false,
    }),
  });

  @Output() value = new EventEmitter();
  @Input() isDisabled: boolean;
  @Input() placeholderText: string = "Your message";

  constructor() { }

  emoji: string = "";

  toggled: boolean = false;

  ngOnInit(): void { }

  handleSelection(event: EmojiEvent) {
    this.emoji = event.char;
    console.log(this.getValueTextarea());
    this.form.get("textarea")?.setValue(this.getValueTextarea());
  }

  getValueTextarea() {
    return this.form.get("textarea")?.value + this.emoji;
  }

  getValue(event: any) {
    this.value.emit(event.target.value);
    // this.textareaValue = event.target.value;
  }
}
