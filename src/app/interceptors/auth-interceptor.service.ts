import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  authService: any;

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService?.getToken();

    if (token) {
      // If we have a token, we set it to the header
      req = req.clone({
         setHeaders: {Authorization: `Authorization token ${token}`}
      });
   }
   
   return next.handle(req).pipe(
     catchError((err) => {
       if (err instanceof HttpErrorResponse) {
           if (err.status === 401) {
           // redirect user to the logout page
           //this.router.navigate("/recovery-passw");
        }
     }
     return throwError(err);
   })
    )
   }
}
