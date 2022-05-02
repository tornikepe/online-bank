import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import { CardService } from "../../card.service";
import {GetnotfsService} from "../../../../services/getnotfs.service";
import {NotificationsService} from "../../../../shared/notifications/notifications.service";
@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit {
  public id: number;
  public cardInfo: any;
  public transactions: any;
  public currentUserId: any = localStorage.getItem('userId')

  constructor(private route: ActivatedRoute,
              private CardService: CardService,
              private router: Router,
              private getnotfsService: GetnotfsService,
              private notification: NotificationsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
    });
    this.showConfig();
    this.showTransactions()
  }

  showConfig() {
    this.CardService.get(this.id).subscribe(
      (data: any) => (this.cardInfo = [data])
    );
  }

  showTransactions() {
    this.CardService.getTransactions().subscribe(
        (data: any) => (this.transactions = [data])
    )
  }

  delete() {
    this.CardService.delete(this.id).subscribe(() => {
      this.router.navigate(['accounts'])
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
