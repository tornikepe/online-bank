import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import {catchError, Observable} from "rxjs";

import { UserNotification } from "src/app/models/banking.model";
import { environment } from "src/environments/environment";
export interface Notf {
  /** Read straight from localStorage at three call sites, hence the null. */
  userId: number | string | null,
  title: string,
  value: string,
  link?: string
}

@Injectable({
  providedIn: 'root'
})
export class GetnotfsService {
  private link: string = environment.BaseUrl.replace(/\/$/, "")
  constructor(private http: HttpClient) { }

  /** Only the signed-in user's notifications; the API returns everyone's. */
  getNotfs(): Observable<UserNotification[]> {
    const userId = localStorage.getItem('userId');
    return this.http
        .get<UserNotification[]>(`${this.link}/userNotifications`)
        .pipe(map(all => all.filter(notification => notification.userId == Number(userId))))
  }

  deleteNotf(id: number) {
    return this.http.delete(`${this.link}/userNotifications/${id}`)
  }

  addNotf(hero: Notf): Observable<Notf> {
    return this.http.post<Notf>(`${this.link}/userNotifications`, hero)
  }
}
