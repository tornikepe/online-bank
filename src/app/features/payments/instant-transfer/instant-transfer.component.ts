import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Card } from "src/app/models/banking.model";
import { ListWithIcons } from "src/app/shared/components/dropdown/list-with-icons.model";
import { NotificationsService } from "src/app/shared/notifications/notifications.service";

import { PaymentsService } from "../payments.service";

@Component({
  standalone: false,
  selector: "app-instant-transfer",
  templateUrl: "./instant-transfer.component.html",
  styleUrls: ["./instant-transfer.component.scss"],
})
export class InstantTransferComponent implements OnInit {
  transferType: string = "Personal transfer";
  //dropdown list array
  cardList: ListWithIcons[] = [];
  activeCard: Card;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentsService,
    private notification: NotificationsService, private cdr: ChangeDetectorRef) {
    this.activeCard = this.paymentService.currentCards[0];
    this.instantTransferForm = this.fb.group({
      account: ["", [Validators.required, Validators.pattern("^.{16}$")]],
      amount: ["", [Validators.required]],
    });
  }

  public instantTransferForm: FormGroup;

  // Validator variables
  amountIsInvalid: boolean;
  accountIsValid: boolean;
  userIsSame: boolean;
  errorMessage: boolean | string;
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
  getCurrentCard(event: ListWithIcons) {
    for (let card of this.paymentService.currentCards) {
      if (card.account === event.value) {
        this.activeCard = card;
      }
    }
  }

  //for dropdown list array
  getCardList() {
    this.paymentService.currentCards.forEach((card: Card) => {
      this.cardList.push({
        /* This compared the card number against the literal "VisaMasterCard",
           which never matches, so every card drew the Mastercard icon. Visa
           numbers begin with 4 — the same test the accounts page uses. */
        iconClass:
          card.card[0] === "4"
            ? "fab fa-cc-visa"
            : "fab fa-cc-mastercard",
        value: card.account,
        secondValue: String(card.amount),
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
                      this.cdr.markForCheck();
          },
          error => {
            this.notification.open({
              class: "income",
              text: "Something wrong",
            });
                      this.cdr.markForCheck();
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
