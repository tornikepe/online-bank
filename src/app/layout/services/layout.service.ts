import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LayoutService {
  private $sidebarStatus: Subject<boolean> = new Subject();
  public sidebarStatus$ = this.$sidebarStatus.asObservable();

  updateStatus(status: boolean) {
    this.$sidebarStatus.next(status);
  }
}
