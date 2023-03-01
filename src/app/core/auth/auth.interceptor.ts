import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '@core/auth';
import { NotificationService } from '@services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private _authService: AuthService,
    private _notification: NotificationService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq = req.clone();

    const token = this._authService.accessToken;
    if (token) { //  && !AuthUtils.isTokenExpired(token)
      newReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + token
        ),
      });
    }

    // Response
    return next.handle(newReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          // Catch "401 Unauthorized" responses
          if (error.status === 401) {
            // Sign out
            this._authService.signOut();

            // Reload the app
            setTimeout(() => location.reload(), 1000);
          }

          this._error(error.status);
        }

        return throwError(() => error);
      })
    );
  }

  private _error(code: number) {
    switch (code) {
      case 0:
        this._notification.error('Oops, it seems like you are offline');
        break;

      case 401:
        this._notification.error('Oops, unauthorized!');
        break;
    }
  }

}
