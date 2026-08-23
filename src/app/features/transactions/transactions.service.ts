import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DisplayTransaction, Transaction } from "src/app/models/banking.model";
import { UserService } from "src/app/services/user.service";

import { environment } from "src/environments/environment";
let months = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  Octomber: 10,
  November: 11,
  December: 12,
};

@Injectable({
  providedIn: "root",
})
export class TransactionsService {
  filteredTransactions$ = new Subject<DisplayTransaction[]>();

  constructor(private http: HttpClient, private userService: UserService) {}

  currentUserId = 11;

  // private url = `${environment.BaseUrl}posts`;
  private url = `${environment.BaseUrl}transactions`;

  getData(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.url);
  }

  universalFilter(
    data: DisplayTransaction[],
    searchValue: string,
    typeValue: string,
    dateValue: string
  ) {
    data = data.filter((transaction) => {
      return (transaction.description ?? "").toLowerCase().includes(searchValue);
    });

    if (typeValue != "All") {
      data = data.filter((transaction) => {
        return transaction.type === typeValue;
      });
    }

    if (dateValue != "All Time") {
      data = data.filter((transaction) => {
        return (
          `${transaction.date.longMonth} ${transaction.date.year}` === dateValue
        );
      });
    }

    return data;
  }
}
