import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CardService } from "../card.service";
import {NotificationsService} from "../../../shared/notifications/notifications.service";

@Component({
  selector: "app-accounts-list",
  templateUrl: "./accounts-list.component.html",
  styleUrls: ["./accounts-list.component.scss"],
})
export class AccountsListComponent implements OnInit, OnDestroy {
  constructor(private cardService: CardService, private rouer: Router) {}
  cardsArray: any = [];
  depositsArray: any = [];
  loansArray: any = [];

  charts: any = [1];
  cardType: string;
  ngOnInit(): void {
    this.cardService.getDeposits().subscribe((data) => {
      this.depositsArray = data;
      console.log("deposits", this.depositsArray);
    });
    this.cardService.getCards().subscribe((data) => {
      this.cardsArray = data;
      console.log("cards:", this.cardsArray);
    });
    this.cardService.getLoans().subscribe((data) => {
      this.loansArray = data;
      console.log("loans:", this.loansArray);
    });
    this.getCharts();
  }
  addCard() {
    console.log("add card");
    this.rouer.navigate(["/accounts/create-card"]);
  }
  openDeposit() {
    console.log("open deposit");
  }
  navigteCardPage(e: any) {
    this.rouer.navigate(["/accounts/info/card/", e]);
  }

  getCharts() {
    this.cardService
      .chartValues()
      .subscribe((charts: any) => (this.charts = [charts]));
  }
  ngOnDestroy(): void {
    this.cardsArray = [];
    this.loansArray = [];
    this.depositsArray = [];
  }
}
