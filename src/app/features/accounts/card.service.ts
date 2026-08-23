import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { UserService } from "../../services/user.service";

import { environment } from "src/environments/environment";
import { BalanceChart, Card, Deposit, Loan, Transaction } from "src/app/models/banking.model";

/** Fields the create-card form supplies; the API assigns the id. */
export type NewCard = Omit<Card, "id">;

@Injectable({
  providedIn: "root",
})
export class CardService implements OnInit {
  _url = environment.BaseUrl.replace(/\/$/, "");
  id: any;

  constructor(private http: HttpClient, private userservice: UserService) {
    this.id = this.userservice.activeUser.id;
  }

  ngOnInit(): void {}
  create(card: NewCard): Observable<Card> {
    return this.http.post<Card>(`${environment.BaseUrl}cards`, {
      name: card.name,
      account: card.account,
      card: card.card,
      cardholder: card.cardholder,
      date: card.date,
      amount: card.amount,
      security: card.security,
      userId: card.userId,
    });
  }
  createDeposit(deposit: Omit<Deposit, "id">): Observable<Deposit> {
    return this.http.post<Deposit>(`${environment.BaseUrl}deposits`, deposit);
  }

  createLoan(loan: Omit<Loan, "id">): Observable<Loan> {
    return this.http.post<Loan>(`${environment.BaseUrl}loans`, loan);
  }

  get(id: number): Observable<Card> {
    return this.http.get<Card>(`${environment.BaseUrl}cards/${id}`);
  }
  /* Every one of these endpoints returns the whole table, so the caller has to
     narrow it to the signed-in user — otherwise one customer sees another's
     cards, deposits and loans. */
  private onlyMine<T extends { userId: number }>() {
    return map((rows: T[]) =>
      (rows ?? []).filter(
        (row) => Number(row.userId) === this.userservice.activeUserId
      )
    );
  }

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this._url}/cards`).pipe(this.onlyMine<Card>());
  }

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this._url}/loans`).pipe(this.onlyMine<Loan>());
  }

  getDeposits(): Observable<Deposit[]> {
    return this.http
      .get<Deposit[]>(`${this._url}/deposits`)
      .pipe(this.onlyMine<Deposit>());
  }

  getDepositsSingle(id: number): Observable<Deposit> {
    return this.http.get<Deposit>(`${this._url}/deposits/${id}`)
  }

  getLoansSingle(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this._url}/loans/${id}`)
  }

  delete(id: number) {
    return this.http.delete(`${this._url}/cards/${id}`);
  }

  deleteDeposit(id: number) {
    return this.http.delete(`${this._url}/deposits/${id}`);
  }

  deleteLoan(id: number) {
    return this.http.delete(`${this._url}/loans/${id}`);
  }

  chartValues(): Observable<BalanceChart[]> {
    return this.http.get<BalanceChart[]>(`${this._url}/charts`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this._url}/transactions`)
    //     .pipe(
    //   map((spots) => {
    //     const cards: any = [];
    //     spots.forEach((spot: any) => {
    //       if (spot.transferFromUserId == this.userservice.activeUser.id) {
    //         cards.push(spot);
    //       }
    //     });
    //     return cards;
    //   })
    // );
  }
}
