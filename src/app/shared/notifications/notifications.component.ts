import {
  Config,
  NotificationsService
} from './notifications.service';
import {
  Component,
  OnInit,
  Input, ChangeDetectorRef} from '@angular/core';

@Component({
	standalone: false,
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  text: string;
  notifClass: string;

  constructor(notificationsService: NotificationsService, private loading: NotificationsService, private cdr: ChangeDetectorRef) {}

  isDisplay: boolean = false;


  ngOnInit() {
    this.loading.show.subscribe((res: Config | null) => {
      if (res) {
        this.isDisplay = true;
        this.text = res.text;
        this.notifClass = res.class
        setTimeout(() => {
          this.isDisplay = false
        }, 3000);
      } 
          this.cdr.markForCheck();
    })
  }

  toggleDisplay() {
    this.isDisplay = false;
  }

}
