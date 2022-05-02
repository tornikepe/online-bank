import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { UserService } from "../../services/user.service";

interface Card {
  name: string;
  account: string;
  card: string;
  cardholder: string;
  date: string;
  amount: string;
  security: boolean;
  userId: string;
}

@Injectable({
  providedIn: "root",
})
export class CardService implements OnInit {
  _url = "http://localhost:3000";
  id = this.userservice.activeUser.id;
  constructor(private http: HttpClient, private userservice: UserService) {}

  ngOnInit(): void {}
  create(card: Card): Observable<any> {
    return this.http.post(`http://localhost:3000/cards`, {
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
  get(id: any): Observable<any> {
    return this.http.get(`http://localhost:3000/cards/${id}`);
  }
  getCards() {
    // console.log(this.userservice.activeUser.id)
    return this.http.get<any[]>(`${this._url}/cards`).pipe(
      map((spots) => {
        const cards: any = [];
        spots.forEach((spot: any) => {
          if (spot.userId == this.userservice.activeUser.id) {
            cards.push(spot);
          }
        });
        return cards;
      })
    );
  }
  getLoans() {
    return this.http.get<any[]>(`${this._url}/loans`)
        // .pipe(
    //   map((spots) => {
    //     const loans: any = [];
    //     spots.forEach((spot: any) => {
    //       if (spot.userId == this.userservice.activeUser.id) {
    //         loans.push(spot);
    //       }
    //     });
    //
    //     return loans;
    //   })
    // );
  }
  getDeposits() {
    return this.http.get<any[]>(`${this._url}/deposits`)
    //     .pipe(
    //   map((spots) => {
    //     const cards: any = [];
    //     spots.forEach((spot: any) => {
    //       if (spot.userId == this.userservice.activeUser.id) {
    //         cards.push(spot);
    //       }
    //     });
    //     return cards;
    //   })
    // );
  }

  getDepositsSingle(id: number) {
    return this.http.get<any[]>(`${this._url}/deposits/${id}`)
  }

  getLoansSingle(id: number) {
    return this.http.get<any[]>(`${this._url}/loans/${id}`)
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

  chartValues() {
    return this.http.get(`${this._url}/charts`);
  }

  getTransactions() {
    return this.http.get<any>(`${this._url}/transactions`)
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
