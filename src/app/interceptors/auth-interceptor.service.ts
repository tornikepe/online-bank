import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

/** Our own API — third-party hosts and local assets must never see the token. */
function isOwnApi(url: string): boolean {
  return url.startsWith(environment.BaseUrl);
}

/**
 * Attaches the bearer token to requests aimed at our API and signs the user out
 * when that API rejects it.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isOwnApi(req.url)) {
    return next(req);
  }

  const token = auth.getToken();
  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.clear();
        router.navigate(['/sign-in']);
      }
      return throwError(() => err);
    })
  );
};
