import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { DisplayTransaction } from "src/app/models/banking.model";

@Component({
  standalone: false,
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @Input() currentElement: DisplayTransaction;

  @Output() modalClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /* The template hands over `$event.target`, which the DOM types as possibly
     null and without a className. Only the backdrop and the two close controls
     carry the class, so a click anywhere inside the card is ignored. */
  closeModal(target: EventTarget | null) {
    if (target instanceof Element && target.classList.contains("close-modal")) {
      this.modalClose.emit(target);
    }
  }
}
