import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectorRef, DestroyRef, inject} from "@angular/core";
import { Subscription } from "rxjs";
import { TransactionsService } from "../transactions.service";

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: false,
  selector: "app-sort-by-date",
  templateUrl: "./sort-by-date.component.html",
  styleUrls: ["./sort-by-date.component.scss"],
})
export class SortByDateComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  @Output() dateSortResult = new EventEmitter();
  public dateList: any = ["All Time"];

  private subscribtion: Subscription;

  constructor(private transactionService: TransactionsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.transactionService.getData().subscribe((data: any) => {

    this.subscribtion = this.transactionService.filteredTransactions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (res: any) => {
        let dates = res.map(
          (tr: any) => `${tr.date.longMonth} ${tr.date.year}`
        );

        let unique = [...new Set(dates)].reverse();

        this.dateList.push(...unique);
              this.cdr.markForCheck();
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
