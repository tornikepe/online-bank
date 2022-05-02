import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-toggle",
  templateUrl: "./toggle.component.html",
  styleUrls: ["./toggle.component.scss"],
})
export class ToggleComponent implements OnInit {
  @Output() value = new EventEmitter<boolean>();
  @Input() validityChecker: boolean = false;
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;
  @Input() text: string = "";

  constructor() {}

  ngOnInit(): void {}

  clickButton() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.value.emit(this.checked);
    }
  }
}
