import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { PaymentProvider } from "src/app/models/banking.model";
import { UserService } from "src/app/services/user.service";
import { PaymentsService } from "./payments.service";

@Component({
  standalone: false,
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
    private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    /* Read straight from localStorage rather than waiting a tick for the
       profile request — the id is there from sign-in onwards. */
    this.paymentsService.userId = this.userService.activeUserId;

    this.paymentsService.getData().subscribe((data) => {
      this.paymentsService.getUppercaseData(data);
          this.cdr.markForCheck();
    });
    this.paymentsService.getUsers().subscribe((data) => {
      this.paymentsService.getCurrentUser(data);
      this.paymentsService.users = data;
          this.cdr.markForCheck();
    });
    this.paymentsService.getCards().subscribe((data) => {
      this.paymentsService.getCurrentCards(data);
      this.paymentsService.cards = data;
          this.cdr.markForCheck();
    });
    // this.paymentsService.postTransactions("1111*2222", "2222*3333", "120", "USD", "Bank transfer", 1, 2).subscribe()
  }

  /* Match on the provider's `formPath` rather than its display name: the third
     provider is called "Transfer to my account" in the data but the old code
     compared against "Instant transfer", so its form could never open. */
  getTransferWindow(event: PaymentProvider) {
    const form = event?.formPath;
    this.bankTransferOpen = form === "bank-transfer";
    this.onlineTransferOpen = form === "electronic-payment";
    this.instantTransferOpen = form === "internal-transfer";
  }

  closeETransfer() {
    this.onlineTransferOpen = false;
  }
}
