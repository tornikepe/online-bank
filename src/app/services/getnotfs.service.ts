import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import {catchError, Observable} from "rxjs";

import { environment } from "src/environments/environment";
export interface Notf {
  userId: any,
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

  getNotfs() {
    return this.http.get<any>(`${this.link}/userNotifications`)
        .pipe(
            map(spots => {
              const cards: any = [];
              spots.forEach((spot: any) => {
                if(spot.userId == localStorage.getItem('userId')) {
                  cards.push(spot);
                }
              })
              return cards
            })
        )
  }

  deleteNotf(id: number) {
    return this.http.delete(`${this.link}/userNotifications/${id}`)
  }

  addNotf(hero: Notf): Observable<Notf> {
    return this.http.post<Notf>(`${this.link}/userNotifications`, hero)
  }
}
