import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef} from "@angular/core";
import { Router } from "@angular/router";
import { CardService } from "../card.service";
import {NotificationsService} from "../../../shared/notifications/notifications.service";

@Component({
  standalone: false,
  selector: "app-accounts-list",
  templateUrl: "./accounts-list.component.html",
  styleUrls: ["./accounts-list.component.scss"],
})
export class AccountsListComponent implements OnInit, OnDestroy {
  constructor(private cardService: CardService, private rouer: Router, private cdr: ChangeDetectorRef) {}
  cardsArray: any = [];
  depositsArray: any = [];
  loansArray: any = [];

  charts: any = [1];
  cardType: string;
  ngOnInit(): void {
    this.cardService.getDeposits().subscribe((data) => {
      this.depositsArray = data;
          this.cdr.markForCheck();
    });
    this.cardService.getCards().subscribe((data) => {
      this.cardsArray = data;
          this.cdr.markForCheck();
    });
    this.cardService.getLoans().subscribe((data) => {
      this.loansArray = data;
          this.cdr.markForCheck();
    });
    this.getCharts();
  }
  addCard() {
    this.rouer.navigate(["/accounts/create-card"]);
  }
  openDeposit() {
  }
  navigteCardPage(e: any) {
    this.rouer.navigate(["/accounts/info/card/", e]);
  }

  getCharts() {
    this.cardService.chartValues().subscribe((charts: any) => {
      this.charts = [charts];
      this.cdr.markForCheck();
    });
  }

  /* The three summary tiles used to show three fixed numbers that had nothing to
     do with the account below them. Derive them from the real balances. */
  get cardsBalance(): number {
    return this.sum(this.cardsArray, "amount");
  }

  get depositsBalance(): number {
    return this.sum(this.depositsArray, "balance");
  }

  get outstandingCredit(): number {
    return (this.loansArray ?? []).reduce(
      (total: number, loan: any) =>
        total + (Number(loan.startingAmount) - Number(loan.paidAmount)),
      0
    );
  }

  private sum(rows: any[], key: string): number {
    return (rows ?? []).reduce(
      (total: number, row: any) => total + Number(row[key] ?? 0),
      0
    );
  }
  ngOnDestroy(): void {
    this.cardsArray = [];
    this.loansArray = [];
    this.depositsArray = [];
  }
}
