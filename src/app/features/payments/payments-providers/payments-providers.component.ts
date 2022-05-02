import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { PaymentsService } from "../payments.service";
@Component({
  selector: "app-payments-providers",
  templateUrl: "./payments-providers.component.html",
  styleUrls: ["./payments-providers.component.scss"],
})
export class PaymentsProvidersComponent implements OnInit {
  @Output() currentTransferWindow = new EventEmitter();
  paymentsArray: any;

  constructor(private paymentsService: PaymentsService) { }

  ngOnInit(): void {
    this.paymentsService.getData().subscribe((payments) => {
      this.paymentsArray = this.paymentsService.data;
    });
  }

  getCurrentCard(payment: HTMLDivElement, payments: HTMLDivElement) {
    let count = 0;
    for (count; count < payments.children.length; count++) {
      payments.children[count].id = " ";
    }
    payment.id = "activeCard";
  }

  getCurrentTransferName(event: any) {
    this.currentTransferWindow.emit(event);
  }
}
