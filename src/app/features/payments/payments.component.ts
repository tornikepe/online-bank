import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { PaymentsService } from "./payments.service";

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
})
export class PaymentsComponent implements OnInit {
  bankTransferOpen = false;
  onlineTransferOpen = false;
  instantTransferOpen = false;

  constructor(
    private paymentsService: PaymentsService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.paymentsService.userId = this.userService.activeUser.id;
    }, 0);

    this.paymentsService.getData().subscribe((data) => {
      this.paymentsService.getUppercaseData(data);
    });
    this.paymentsService.getUsers().subscribe((data) => {
      this.paymentsService.getCurrentUser(data);
      this.paymentsService.users = data;
    });
    this.paymentsService.getCards().subscribe((data) => {
      this.paymentsService.getCurrentCards(data);
      this.paymentsService.cards = data;
    });
    // this.paymentsService.postTransactions("1111*2222", "2222*3333", "120", "USD", "Bank transfer", 1, 2).subscribe()
  }

  getTransferWindow(event: any) {
    if (event.name === "Bank Transfer") {
      this.onlineTransferOpen = false;
      this.instantTransferOpen = false;
      this.bankTransferOpen = true;
    } else if (event.name === "Electronic Payments") {
      this.onlineTransferOpen = true;
      this.instantTransferOpen = false;
      this.bankTransferOpen = false;
    } else if (event.name === "Instant transfer") {
      this.onlineTransferOpen = false;
      this.instantTransferOpen = true;
      this.bankTransferOpen = false;
    }
  }

  closeETransfer() {
    this.onlineTransferOpen = false;
  }
}
