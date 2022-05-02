import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @Input() currentElement: elementType;

  @Output() modalClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  closeModal(event: any) {
    if (event.className.slice(0, 11) == "close-modal")
      this.modalClose.emit(event);
  }
}

export interface elementType {
  id: number;
  account: string;
  img: string;
  description: string;
  date: any;
  type: string;
  amount: number;
}
