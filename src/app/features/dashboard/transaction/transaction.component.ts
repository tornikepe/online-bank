import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  public myarray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  moneytransfer: any[];
  name: any = [];
  data: any = [];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get("http://localhost:3000/moneytransfer")
      .subscribe((moneytransfer: any) => {
        this.moneytransfer = moneytransfer;
        for (let i = 0; i < this.moneytransfer.length; i++) {
          this.name.push(this.moneytransfer[i]);
        }
      });
  }
}
