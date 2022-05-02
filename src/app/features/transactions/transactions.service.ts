import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { UserService } from "src/app/services/user.service";

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
  filteredTransactions$ = new Subject();

  constructor(private http: HttpClient, private userService: UserService) {}

  currentUserId = 11;

  // private url = 'http://localhost:3000/posts';
  private url = "http://localhost:3000/transactions";

  getData(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  universalFilter(
    data: any[],
    searchValue: string,
    typeValue: string,
    dateValue: string
  ) {
    data = data.filter((transaction: any) => {
      return transaction.description.toLowerCase().includes(searchValue);
    });

    if (typeValue != "All") {
      data = data.filter((transaction: any) => {
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
