import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Subscription } from "rxjs";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-sort-by-date",
  templateUrl: "./sort-by-date.component.html",
  styleUrls: ["./sort-by-date.component.scss"],
})
export class SortByDateComponent implements OnInit, OnDestroy {
  @Output() dateSortResult = new EventEmitter();
  public dateList: any = ["All Time"];

  private subscribtion: Subscription;

  constructor(private transactionService: TransactionsService) { }

  ngOnInit(): void {
    // this.transactionService.getData().subscribe((data: any) => {

    this.subscribtion = this.transactionService.filteredTransactions$.subscribe(
      (res: any) => {
        let dates = res.map(
          (tr: any) => `${tr.date.longMonth} ${tr.date.year}`
        );

        let unique = [...new Set(dates)].reverse();

        this.dateList.push(...unique);
      }
    );

    // data.map((x: any) => {
    //   this.dateList.push(x.date);
    // });

    // this.dateList = [...new Set(this.dateList)];
    // });
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

  sortByDate(event: any) {
    this.dateSortResult.emit(event);
  }

  dateListF() {
    for (let i of this.dateList) {
      return i;
    }
  }
}
