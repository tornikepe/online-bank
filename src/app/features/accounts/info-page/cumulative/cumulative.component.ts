import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CardService} from "../../card.service";
import {GetnotfsService} from "../../../../services/getnotfs.service";
import {NotificationsService} from "../../../../shared/notifications/notifications.service";

@Component({
  selector: 'app-cumulative',
  templateUrl: './cumulative.component.html',
  styleUrls: ['./cumulative.component.scss']
})
export class CumulativeComponent implements OnInit {

  public id: number;
  public loadData: any;

  constructor(private route: ActivatedRoute,
              private cardService: CardService,
              private getnotfsService: GetnotfsService,
              private router: Router,
              private notification: NotificationsService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })
    this.getData()
  }

  getData() {
    this.cardService.getDepositsSingle(this.id)
        .subscribe((data: any) => {
          this.loadData = [data]
          setTimeout(() => {
            console.log(this.loadData)
          },1000)
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

  public transactions: any = [
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    },
    {
      'name': 'bank transfer',
      'title': 'Money transfer to david khvedelidze',
      'amount': 10480000
    }
  ]

}
