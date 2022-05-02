import { Component, EventEmitter, OnInit, Output } from "@angular/core";
// import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { PaymentsService } from '../payments.service';

@Component({
  selector: "app-electronic-transfer",
  templateUrl: "./electronic-transfer.component.html",
  styleUrls: ["./electronic-transfer.component.scss"],
})
export class ElectronicTransferComponent implements OnInit {
  @Output() makeCloseTransfer = new EventEmitter();

  amountValue: number;
  fee: number;
  activeCard: any = this.paymentsService.currentCards[0];
  transferType: string = "Personal transfer";
  currencyType: string = "USD";

  cardList: any = [];

  public eTransferForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentsService: PaymentsService,
    private notification: NotificationsService
  ) {
    this.eTransferForm = fb.group({
      paypal: ["", [Validators.required, Validators.pattern("^.{22}$")]],
      amount: ["", [Validators.required]],
    });
  }

  // Validator variables
  amountIsInvalid: boolean;
  accountIsValid: boolean;
  userIsSame: boolean;
  // Validator variables

  closeTransfer(event: any) {
    this.makeCloseTransfer.emit(event);
  }

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
  // -- CUSTOM VALIDATORS END HERE

  ngOnInit(): void {
    this.paymentsService.currentCards.forEach((card: any) => {
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

  public onSubmit(): void {
    let benAccount = this.account["paypal"].value;
    let amount = this.account["amount"].value;

    // სადაც რიცხავ იმ ბარათის ვალიდაცია
    let validAccount = this.paymentsService.validationAccount(benAccount);
    // if account is valid
    if (validAccount) {
      this.accountIsValid = true;
    } else {
      this.accountIsValid = false;
    }
    // validAccount ? this.accountIsValid : false;
    // საკმარისი თანხა თუა ამჟამინდელ ბარათზე მაგის ვალიდაცია
    let enoughMoney = this.paymentsService.validationAmount(
      String(this.activeCard.account),
      amount
    );
    // if amount is valid
    this.amountIsInvalid = enoughMoney;

    if (validAccount && enoughMoney) {
      this.paymentsService
        .postTransactions(
          this.activeCard.account,
          benAccount,
          amount,
          this.currencyType,
          this.transferType,
          this.paymentsService.userId,
          this.paymentsService.getCardUserId(benAccount)
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
    this.eTransferForm
      .get("paypal")
      ?.setValidators([
        Validators.required,
        Validators.pattern("^.{22}$"),
        this.incorrectAccount.bind(this),
      ]);

    // validation on amount
    this.eTransferForm
      .get("amount")
      ?.setValidators([
        Validators.required,
        this.incorrectAmountVal.bind(this),
      ]);

    this.eTransferForm.get("paypal")?.updateValueAndValidity();
    this.eTransferForm.get("amount")?.updateValueAndValidity();

    if (this.eTransferForm.status !== "INVALID") {
      //send transaction
      this.eTransferForm.reset();
    }
  }

  displayAmount() {
    this.amountValue = this.eTransferForm.get("amount")?.value;
    this.fee = (this.amountValue * 2) / 100;
  }

  // getter
  get account() {
    return this.eTransferForm.controls;
  }

  getCurrentCard(event: any) {
    for (let card of this.paymentsService.currentCards) {
      if (card.account === event.value) {
        this.activeCard = card;
      }
    }
  }
  getTransferType(event: string) {
    this.transferType = event;
  }
  getCurrencyType(event: string) {
    this.currencyType = event;
  }
}
