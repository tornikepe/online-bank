import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  getToken():any {
    return localStorage.getItem('auth_token');
    }
}
