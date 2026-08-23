import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { MoneyTransferShortcut } from 'src/app/models/banking.model';
import { environment } from "src/environments/environment";
@Component({
  standalone: false,
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  /* Header label for the transaction list — was hardcoded to "AUGUST 2018". */
  readonly currentPeriod = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  }).toUpperCase();

  public myarray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  moneytransfer: MoneyTransferShortcut[] = [];
  /* The template reads .name, .dataAndTime and .icon off these, so the
     list holds the records themselves. `data` was never used. */
  name: MoneyTransferShortcut[] = [];
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http
      .get<MoneyTransferShortcut[]>(`${environment.BaseUrl}moneytransfer`)
      .subscribe((moneytransfer) => {
        this.moneytransfer = moneytransfer;
        for (let i = 0; i < this.moneytransfer.length; i++) {
          this.name.push(this.moneytransfer[i]);
        }
              this.cdr.markForCheck();
      });
  }
}
