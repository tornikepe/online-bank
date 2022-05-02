import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface Config {
  class: string,
  text: string
}
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public show: BehaviorSubject<Config | null> = new BehaviorSubject<any>(null)

  open(config: Config){
    this.show.next(config);
  }

  constructor() { }

}
