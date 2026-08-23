import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/** A toast: the palette class and the message. */
export interface Config {
  class: string,
  text: string
}
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public show = new BehaviorSubject<Config | null>(null);

  open(config: Config){
    this.show.next(config);
  }

  constructor() { }

}
