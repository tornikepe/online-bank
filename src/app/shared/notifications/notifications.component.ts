import {
  NotificationsService
} from './notifications.service';
import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  text: any;
  notifClass: any;

  constructor(notificationsService: NotificationsService, private loading: NotificationsService) {}

  isDisplay: boolean = false;

  config: any;

  ngOnInit() {
    this.loading.show.subscribe((res: any) => {
      if (res) {
        this.isDisplay = true;
        this.text = res.text;
        this.notifClass = res.class
        setTimeout(() => {
          this.isDisplay = false
        }, 3000);
      } 
    })
  }

  toggleDisplay() {
    this.isDisplay = false;
  }

}
