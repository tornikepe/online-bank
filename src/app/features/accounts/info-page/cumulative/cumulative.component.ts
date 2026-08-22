import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CardService} from "../../card.service";
import {GetnotfsService} from "../../../../services/getnotfs.service";
import {NotificationsService} from "../../../../shared/notifications/notifications.service";

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: false,
  selector: 'app-cumulative',
  templateUrl: './cumulative.component.html',
  styleUrls: ['./cumulative.component.scss']
})
export class CumulativeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  /* Header label for the transaction list — was hardcoded to "AUGUST 2018". */
  readonly currentPeriod = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  }).toUpperCase();


  public id: number;
  public loadData: any[] = [];

  constructor(private route: ActivatedRoute,
              private cardService: CardService,
              private getnotfsService: GetnotfsService,
              private router: Router,
              private notification: NotificationsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.id = params['id'];
          this.cdr.markForCheck();
    })
    this.getData()
  }

  getData() {
    this.cardService.getDepositsSingle(this.id)
        .subscribe((data: any) => {
          this.loadData = [data]
                  this.cdr.markForCheck();
        })
  }

  delete() {
    this.cardService.deleteDeposit(this.id)
        .subscribe()
    this.getnotfsService.addNotf({
      userId: localStorage.getItem('userId'),
      title: 'deposit deleted',
      value: 'deposit has been successfully deleted from your account and cannot be restored',
      link: 'accounts'
    }).subscribe()
    this.router.navigate(['accounts'])
    this.notification.open({
      class: 'secondary-pink',
      text: 'cumulative has been deleted'
    });
  }

  /* Placeholder activity for the account detail panel until per-account history
     is wired up. Previously this was the same row repeated thirty-five times. */
  public transactions: any = [
    { name: 'bank transfer', title: 'Transfer to Levan Chkhaidze', amount: 480 },
    { name: 'card payment', title: 'Grocery — Carrefour', amount: 76 },
    { name: 'direct debit', title: 'Monthly home rent', amount: 1200 },
    { name: 'bank transfer', title: 'Transfer from Nino Beridze', amount: 950 },
    { name: 'card payment', title: 'Subscription — cloud storage', amount: 12 },
    { name: 'cash withdrawal', title: 'ATM withdrawal', amount: 300 },
    { name: 'bank transfer', title: 'Transfer to Mariam Tsiklauri', amount: 640 },
    { name: 'card payment', title: 'Fuel — Wissol', amount: 88 },
  ];
}
