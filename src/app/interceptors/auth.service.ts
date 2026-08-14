import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'userId';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* Older builds stored the token with JSON.stringify, which wrapped it in quotes
     and made every Authorization header malformed. Strip them so sessions saved by
     a previous version keep working. */
  getToken(): string | null {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) {
      return null;
    }
    return raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  isSignedIn(): boolean {
    return !!this.getToken();
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
}
