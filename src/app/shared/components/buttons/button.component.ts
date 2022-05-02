import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonsComponent implements OnInit {
  @Input() text!: string;
  @Input() btnClass!: string;
  @Input() btnWidth!: any;
  @Input() btnHeight!: any;
  @Input() isDisable!: boolean;
  @Input() icon!: string;
  constructor() {}
  ngOnInit(): void {}
}
