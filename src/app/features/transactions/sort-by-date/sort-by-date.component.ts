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

  @Output() dateSortResult = new EventEmitter<string>();
  public dateList: string[] = ["All Time"];

  private subscribtion: Subscription;

  constructor(private transactionService: TransactionsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribtion = this.transactionService.filteredTransactions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (res) => {
        let dates = res.map(
          (tr) => `${tr.date.longMonth} ${tr.date.year}`
        );

        let unique = [...new Set(dates)].reverse();

        this.dateList.push(...unique);
              this.cdr.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

  sortByDate(event: string) {
    this.dateSortResult.emit(event);
  }
}
