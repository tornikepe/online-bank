import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  Card,
  PaymentProvider,
  Transaction,
  User,
} from "src/app/models/banking.model";
import { NotificationsService } from "src/app/shared/notifications/notifications.service";

import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class PaymentsService {
  /* Replaced with the signed-in id as soon as the payments page loads. */
  userId: number = 11;

  public data: PaymentProvider[] = [];
  public users: User[] = [];
  public cards: Card[] = [];

  currentUser: User;
  currentCards: Card[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  private url = `${environment.BaseUrl}`;
  private urlPaymentTypes = "paymentTypes";
  private urlUsers = "users";
  private urlCards = "cards";
  private urlTransactions = "transactions";

  getData(): Observable<PaymentProvider[]> {
    return this.http.get<PaymentProvider[]>(this.url + this.urlPaymentTypes);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + this.urlUsers);
  }
  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.url + this.urlCards);
  }

  postTransactions(
    currAccount: string,
    currTransferedTo: string,
    currAmount: string | number,
    currCurrency: string,
    currType: string,
    currTransferFrom: number,
    currTransferTo: number
  ): Observable<Transaction> {
    let currTransferToUserName: string;
    let currTransferFromUserName: string = this.currentUser.Full_Name;
    for (let user of this.users) {
      if (user.id == currTransferTo) currTransferToUserName = user.Full_Name;
    }
    let transaction = {
      account: currAccount,
      transferedTo: currTransferedTo,
      date: this.getCurrentDate(),
      amount: Number(currAmount),
      currency: currCurrency,
      type: currType,
      transferFromUserId: currTransferFrom,
      currTransferFromUser: currTransferFromUserName,
      transferToUserId: currTransferTo,
      currTransferToUser: currTransferToUserName!,
      img: "../../../favicon.ico",
    };

    const currentCard = this.getCard(currAccount);
    const beneficiaryCard = this.getCard(currTransferedTo);

    /* The forms check both accounts before getting here, so this is a guard
       rather than a path anyone should reach — but reading `.amount` off a
       card that was never found would take the page down with it. */
    if (!currentCard || !beneficiaryCard) {
      return throwError(
        () => new Error("Transfer failed: one of the accounts no longer exists")
      );
    }

    /* Card balances are stored as strings in some records, so `+` concatenated
       instead of adding — crediting 100 to a balance of "156300" produced
       "156300100". Coerce both sides to numbers before doing arithmetic. */
    const creditMoney = Number(currentCard.amount) - Number(currAmount);
    const debitMoney = Number(beneficiaryCard.amount) + Number(currAmount);

    this.http
      .patch(this.url + `cards/${currentCard.id}`, { amount: creditMoney })
      .subscribe();
    this.http
      .patch(this.url + `cards/${beneficiaryCard.id}`, { amount: debitMoney })
      .subscribe();

    this.getCards().subscribe((data) => {
      this.cards = data;
    });

    return this.http.post<Transaction>(this.url + this.urlTransactions, transaction);
  }

  getUppercaseData(data: PaymentProvider[]) {
    for (var payment of data) {
      for (var provider of payment.providers) {
        let first = provider.name.substring(0, 1).toUpperCase();
        provider.name = first + provider.name.substring(1);
      }
    }
    this.data = data;
  }

  getCard(account: string): Card | undefined {
    return this.cards.find((card) => card.account == account);
  }

  getCurrentUser(data: User[]): User | undefined {
    const user = data.find((candidate) => candidate.id == this.userId);
    if (user) {
      this.currentUser = user;
    }
    return user;
  }

  getCurrentCards(data: Card[]) {
    for (const card of data) {
      if (card.userId == this.userId) this.currentCards.push(card);
    }
  }

  validationAmount(cardNumber: string, cardAmount: string | number): boolean {
    for (const card of this.currentCards) {
      if (card.account == cardNumber) {
        return Number(card.amount) >= Number(cardAmount);
      }
    }
    return false;
  }

  validationSimilarityBeneficiaryAccount(
    Beneficiary: string,
    account: string
  ): boolean | string {
    if (this.currentCards.some((card) => card.account == account)) {
      return "You are trying to transfer money to your card";
    }

    /* Compare both sides case-insensitively: the stored names are mixed case,
       so lowercasing only the typed name never matched. */
    const typedName = Beneficiary.trim().toLocaleLowerCase();
    const beneficiary = this.users.find(
      (user) => (user.Full_Name ?? "").trim().toLocaleLowerCase() === typedName
    );

    const matches = this.cards.some(
      (card) => card.userId === beneficiary?.id && card.account == account
    );
    return matches ? true : "Wrong card number or beneficiary!";
  }

  validationAccount(account: string) {
    let i = this.cards.findIndex(
      (card) => card.account === account && card.userId !== this.userId
    );
    return i >= 0 ? this.cards[i] : false;
  }

  /* The old version sliced fixed offsets out of toLocaleString(), so a
     single-digit month or day shifted the window and swallowed the leading hour
     digit — 10:51 was recorded as "0:51". Read the parts directly instead. */
  getCurrentDate() {
    const now = new Date();
    const hours24 = now.getHours();
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    return {
      year: now.getFullYear(),
      longMonth: now.toLocaleString("en-US", { month: "long" }),
      shortMonth: now.toLocaleString("en-US", { month: "short" }),
      day: now.getDate(),
      hoursNMinutes: `${hours12}:${String(now.getMinutes()).padStart(2, "0")}`,
      ampm: hours24 < 12 ? "AM" : "PM",
    };
  }

  getCardUserId(account: string): number {
    let currentId = 0;
    const i = this.cards.findIndex((card) => card.account === account);

    return i >= 0 ? this.cards[i].userId : 0;
  }
}
