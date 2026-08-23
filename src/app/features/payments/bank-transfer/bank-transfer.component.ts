import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Card } from "src/app/models/banking.model";
import { ListWithIcons } from "src/app/shared/components/dropdown/list-with-icons.model";
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { PaymentsService } from '../payments.service';

@Component({
  standalone: false,
  selector: "app-bank-transfer",
  templateUrl: "./bank-transfer.component.html",
  styleUrls: ["./bank-transfer.component.scss"],
})
export class BankTransferComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentsService,
    private http: HttpClient,
    private notification: NotificationsService, private cdr: ChangeDetectorRef) {
    this.activeCard = this.paymentService.currentCards[0];
    this.bankTransferForm = this.fb.group({
      account: ["", [Validators.required, Validators.pattern("^.{22}$")]],
      benName: ["", [Validators.required]],
      amount: ["", [Validators.required]],
    });
  }
  amountValue: number;
  activeCard: Card;
  transferType: string = "Personal transfer";
  currencyType: string = "USD";

  cardList: ListWithIcons[] = [];



  // Validator variables
  amountIsInvalid: boolean;
  accountIsValid: boolean;
  userIsSame: boolean;
  errorMessage: boolean | string;
  // Validator variables

  public bankTransferForm: FormGroup;

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

  ngOnInit(): void {
    this.getCardList();
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

  userIdentity() {
    if (this.userIsSame || this.userIsSame === undefined) {
      return { sameUser: true };
    }
    return null;
  }
  // -- CUSTOM VALIDATORS END HERE

  getTransferType(event: string) {
    this.transferType = event;
  }
  getCurrencyType(event: string) {
    this.currencyType = event;
  }
  getCurrentCard(event: ListWithIcons) {
    for (let card of this.paymentService.currentCards) {
      if (card.account === event.value) {
        this.activeCard = card;
      }
    }
  }

  get formControl() {
    return this.bankTransferForm.controls;
  }

  onSubmitBankTransForm() {
    let account = this.bankTransferForm.get("account")?.value;
    let beneficiary = this.bankTransferForm.get("benName")?.value;
    let amount = this.formControl["amount"].value;

    // if user is same
    let sameUser = this.paymentService.validationSimilarityBeneficiaryAccount(
      beneficiary,
      account
    );

    if (sameUser === "You are trying to transfer money to your card") {
    } else if (sameUser === "Wrong card number or beneficiary!") {
      this.userIsSame = true;
    } else if (sameUser) {
      this.userIsSame = false;
    }
    if (typeof this.errorMessage !== "boolean") {
      this.errorMessage = sameUser;
    }

    // If account is valid
    let validAmount = this.paymentService.validationAmount(
      this.activeCard.account,
      amount
    );

    this.amountIsInvalid = validAmount;

    let validAccount = this.paymentService.validationAccount(account);
    if (validAccount) {
      this.accountIsValid = true;
    } else {
      this.accountIsValid = false;
    }

    if (
      validAccount &&
      validAmount &&
      typeof sameUser === "boolean" &&
      sameUser
    ) {
      this.paymentService
        .postTransactions(
          this.activeCard.account,
          account,
          amount,
          this.currencyType,
          this.transferType,
          this.paymentService.userId,
          this.paymentService.getCardUserId(account)
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
    this.bankTransferForm
      .get("account")
      ?.setValidators([
        Validators.required,
        Validators.pattern("^.{22}$"),
        this.incorrectAccount.bind(this),
      ]);

    // validation on amount
    this.bankTransferForm
      .get("amount")
      ?.setValidators([
        Validators.required,
        this.incorrectAmountVal.bind(this),
      ]);

    // validation on user similarity
    this.bankTransferForm
      .get("benName")
      ?.setValidators([Validators.required, this.userIdentity.bind(this)]);

    this.bankTransferForm.get("account")?.updateValueAndValidity();
    this.bankTransferForm.get("amount")?.updateValueAndValidity();
    this.bankTransferForm.get("benName")?.updateValueAndValidity();

    // --SET VALIDATORS END HERE
    if (this.bankTransferForm.valid) {
      //send transaction
      this.bankTransferForm.reset();
    }

    // SET VALIDATORS

    // validation on account
  }
}
