import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { NotificationsService } from "src/app/shared/notifications/notifications.service";

import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class PaymentsService {
  userId: any = 11;

  public data: any;
  public users: any;
  public cards: any;

  currentUser: any;
  currentCards: any[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  private url = `${environment.BaseUrl}`;
  private urlPaymentTypes = "paymentTypes";
  private urlUsers = "users";
  private urlCards = "cards";
  private urlTransactions = "transactions";

  getData(): Observable<any> {
    return this.http.get<any>(this.url + this.urlPaymentTypes);
  }
  getUsers(): Observable<any> {
    return this.http.get<any>(this.url + this.urlUsers);
  }
  getCards(): Observable<any> {
    return this.http.get<any>(this.url + this.urlCards);
  }

  postTransactions(
    currAccount: string,
    currTransferedTo: string,
    currAmount: string,
    currCurrency: string,
    currType: string,
    currTransferFrom: number,
    currTransferTo: number
  ): Observable<any> {
    let currTransferToUserName: string;
    let currTransferFromUserName: string = this.currentUser.Full_Name;
    for (let user of this.users) {
      if (user.id == currTransferTo) currTransferToUserName = user.Full_Name;
    }
    let transaction = {
      account: currAccount,
      transferedTo: currTransferedTo,
      date: this.getCurrentDate(),
      amount: currAmount,
      currency: currCurrency,
      type: currType,
      transferFromUserId: currTransferFrom,
      currTransferFromUser: currTransferFromUserName,
      transferToUserId: currTransferTo,
      currTransferToUser: currTransferToUserName!,
      img: "../../../favicon.ico",
    };

    let currentCard = this.getCard(currAccount);
    let beneficiaryCard = this.getCard(currTransferedTo);

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

    return this.http.post<any>(this.url + this.urlTransactions, transaction);
  }

  getUppercaseData(data: any) {
    for (var payment of data) {
      for (var provider of payment.providers) {
        let first = provider.name.substring(0, 1).toUpperCase();
        provider.name = first + provider.name.substring(1);
      }
    }
    this.data = data;
  }

  getCard(number: string) {
    for (let card of this.cards) {
      if (card.account == number) {
        return card;
      }
    }
  }

  getCurrentUser(data: any) {
    for (const user of data) {
      if (user.id == this.userId) {
        this.currentUser = user;
        return user;
      }
    }
  }

  getCurrentCards(data: any) {
    for (const card of data) {
      if (card.userId == this.userId) this.currentCards.push(card);
    }
  }

  validationAmount(cardNumber: string, cardAmount: string): boolean {
    for (const card of this.currentCards) {
      if (card.account == cardNumber) {
        return parseFloat(card.amount) >= parseFloat(cardAmount);
      }
    }
    return false;
  }

  validationSimilarityBeneficiaryAccount(
    Beneficiary: string,
    account: string
  ): boolean | string {
    let userId: string = "";
    for (let card of this.currentCards) {
      if (card.account == account)
        return "You are trying to transfer money to your card";
    }
    /* Compare both sides case-insensitively: the stored names are mixed case,
       so lowercasing only the typed name never matched. */
    const typedName = Beneficiary.trim().toLocaleLowerCase();
    for (let user of this.users) {
      if ((user.Full_Name ?? "").trim().toLocaleLowerCase() === typedName)
        userId = user.id;
    }
    for (let card of this.cards) {
      if (card.userId == Number(userId) && card.account == account) return true;
    }
    return "Wrong card number or beneficiary!";
  }

  validationAccount(account: string) {
    let i = this.cards.findIndex(
      (i: any) => i.account === account && i.userId !== this.userId
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
    let i = this.cards.findIndex((i: any) => i.account === account);

    return i >= 0 ? this.cards[i].userId : 0;
  }
}
