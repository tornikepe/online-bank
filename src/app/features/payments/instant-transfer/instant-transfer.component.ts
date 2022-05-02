import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NotificationsService } from "src/app/shared/notifications/notifications.service";

import { PaymentsService } from "../payments.service";

@Component({
  selector: "app-instant-transfer",
  templateUrl: "./instant-transfer.component.html",
  styleUrls: ["./instant-transfer.component.scss"],
})
export class InstantTransferComponent implements OnInit {
  transferType: string = "Personal transfer";
  //dropdown list array
  cardList: any = [];
  activeCard: any = this.paymentService.currentCards[0];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentsService,
    private notification: NotificationsService
  ) { }

  public instantTransferForm = this.fb.group({
    account: ["", [Validators.required, Validators.pattern("^.{16}$")]],
    amount: ["", [Validators.required]],
  });

  // Validator variables
  amountIsInvalid: boolean;
  accountIsValid: boolean;
  userIsSame: boolean;
  errorMessage: any;
  // Validator variables

  // CUSTOM VALIDATORS START HERE
  incorrectAmountVal() {
    if (!this.amountIsInvalid) {
      return { invalidAmount: true };
    }
    return null;
  }

  incorrectAccount() {
    if (!this.accountIsValid) {
      return { invalidAccount: true };
    }
    return null;
  }

  userIdentity() {
    if (this.userIsSame || this.userIsSame === undefined) {
      return { sameUser: true };
    }
    return null;
  }
  // -- CUSTOM VALIDATORS END HERE

  get formControl() {
    return this.instantTransferForm.controls;
  }

  ngOnInit(): void {
    this.getCardList();
  }
  getCurrentCard(event: any) {
    for (let card of this.paymentService.currentCards) {
      if (card.account === event.value) {
        this.activeCard = card;
      }
    }
  }

  //for dropdown list array
  getCardList() {
    this.paymentService.currentCards.forEach((card: any) => {
      this.cardList.push({
        iconClass:
          card.card == "VisaMasterCard"
            ? "fab fa-cc-visa"
            : "fab fa-cc-mastercard",
        value: card.account,
        secondValue: card.amount,
      });
    });
  }

  // get form value

  getTransferType(event: string) {
    this.transferType = event;
  }

  getTransferToUserId() {
    this.paymentService;
  }

  onSubmitTransfer() {
    let validAmount = this.paymentService.validationAmount(
      this.activeCard.account,
      this.instantTransferForm.get("amount")?.value
    );
    // if amount is valid
    this.amountIsInvalid = validAmount;

    let validAccount = this.paymentService.validationAccount(
      this.instantTransferForm.get("account")?.value
    );
    // if account is valid
    if (validAccount) {
      this.accountIsValid = true;
    } else {
      this.accountIsValid = false;
    }

    if (validAccount && validAmount) {
      this.paymentService
        .postTransactions(
          this.activeCard.account,
          this.instantTransferForm.get("account")?.value,
          this.instantTransferForm.get("amount")?.value,
          "USD",
          this.transferType,
          this.paymentService.userId,
          this.paymentService.getCardUserId(
            this.instantTransferForm.get("account")?.value
          )
        )
        .subscribe(
          res => {
            this.notification.open({
              class: "secondary-green",
              text: "Transaction sent successfully",
            });
          },
          error => {
            this.notification.open({
              class: "income",
              text: "Something wrong",
            });
          }
        );
    }
    // validation on account
    this.instantTransferForm
      .get("account")
      ?.setValidators([
        Validators.required,
        Validators.pattern("^.{16}$"),
        this.incorrectAccount.bind(this),
      ]);

    // validation on amount
    this.instantTransferForm
      .get("amount")
      ?.setValidators([
        Validators.required,
        this.incorrectAmountVal.bind(this),
      ]);
    this.instantTransferForm.get("account")?.updateValueAndValidity();
    this.instantTransferForm.get("amount")?.updateValueAndValidity();
    if (this.instantTransferForm.status !== "INVALID") {
      //send transaction
      this.instantTransferForm.reset();
    }
  }
}
