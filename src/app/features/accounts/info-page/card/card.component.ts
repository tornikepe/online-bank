import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import { Card, Transaction } from "src/app/models/banking.model";
import { CardService } from "../../card.service";
import {GetnotfsService} from "../../../../services/getnotfs.service";
import {NotificationsService} from "../../../../shared/notifications/notifications.service";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: false,
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  /* Header label for the transaction list — was hardcoded to "AUGUST 2018". */
  readonly currentPeriod = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  }).toUpperCase();

  public id: number;
  public cardInfo: Card[] = [];
  /* The template reads transactions?.[0], so the list is wrapped once. */
  public transactions: Transaction[][] = [];
  public currentUserId: number = Number(localStorage.getItem('userId'))

  constructor(private route: ActivatedRoute,
              private CardService: CardService,
              private router: Router,
              private getnotfsService: GetnotfsService,
              private notification: NotificationsService, private cdr: ChangeDetectorRef) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.id = params["id"];
          this.cdr.markForCheck();
    });
    this.showConfig();
    this.showTransactions()
  }

  showConfig() {
    this.CardService.get(this.id).subscribe((data) => {
      this.cardInfo = [data];
      this.cdr.markForCheck();
    });
  }

  showTransactions() {
    this.CardService.getTransactions().subscribe((data) => {
      this.transactions = [data];
      this.cdr.markForCheck();
    });
  }

  delete() {
    this.CardService.delete(this.id).subscribe(() => {
      this.router.navigate(['accounts'])
          this.cdr.markForCheck();
    });
    this.getnotfsService.addNotf({
      userId: localStorage.getItem('userId'),
      title: 'card deleted',
      value: 'card has been deleted from your account and it cannot be restored',
      link: 'accounts'
    }).subscribe()
    this.router.navigate(["accounts"]);
    this.notification.open({
      class: 'secondary-pink',
      text: 'card has been deleted'
    });
  }
}
