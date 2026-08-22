import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
} from "@angular/core";
import { GetnotfsService } from "../../../services/getnotfs.service";

@Component({
  standalone: false,
  host: {
    "(document:click)": "onClick($event)",
  },
  selector: "app-notifications-topbar",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit {
  show: boolean = false;
  notificationData: any = [];

  constructor(
    private _eref: ElementRef,
    private getnotfsService: GetnotfsService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleShow() {
    this.notificationsData();
    return (this.show = !this.show);
  }

  onClick(event: any) {
    // this.notificationsData()
    if (!this._eref.nativeElement.contains(event.target))
      return (this.show = false);
    else return (this.show = true);
  }

  notificationsData() {
    this.getnotfsService.getNotfs().subscribe((data: any) => {
      this.notificationData = data;
      this.cdr.markForCheck();
    });
  }

  deletenotf(id: number) {
    this.getnotfsService.deleteNotf(id).subscribe();
    this.notificationsData();
  }

  ngOnInit(): void {
    this.notificationsData();
  }
}
