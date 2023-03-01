import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of, from, throwError } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';

import { STORAGE_KEY } from '@configs';
import { AuthUtils } from '@core/auth';
import { UserService, PreferencesService } from '@services';

@Injectable()
export class AuthService {

  private _accessToken: string;
  private _authenticated = false;
  private _httpClient: HttpClient;

  constructor(
    private _handler: HttpBackend,
    private readonly _router: Router,
    private readonly _user: UserService,
    private readonly _preferences: PreferencesService,
  ) {
    // by pass http interceptor
    this._httpClient = new HttpClient(_handler);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    this._accessToken = token;
    this._preferences.set(STORAGE_KEY.TOKEN, token);
  }

  get accessToken(): string {
    return this._accessToken ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError(() => new Error('User is already logged in.'));
    }

    return this._httpClient.post<string>(
      `/users/authenticate`,
      {
        UserName: credentials.email,
        Password: credentials.password,
      },
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        responseType: 'text' as 'json'
      }
    ).pipe(
      map(response => {
        if (!response) {
          throw new Error('Error');
        }
        return (response || '').replace('"', '');
      }),
      tap((token) => {
        // Store the access token in the local storage
        this.accessToken = token;
        // Set the authenticated flag to true
        this._authenticated = true;
      }),
      tap((token) => {
        const user = AuthUtils.decodeUserInfo(token);

        if (!user || !user.id) {
          throw new Error('Invalid token')
        }

        this._user.setUser(user);
      }),
      catchError((error) => {
        if (error?.status === 400) {
          try {
            const body = JSON.parse(error.error);
            return throwError(() => body.errorCode);
          } catch (e) {}
        }

        return throwError(() => error);
      })
    );
  }

  signInUsingToken(): Observable<any> {
    return from(this._preferences.get<string>(STORAGE_KEY.TOKEN)).pipe(
      switchMap(token => {
        if (!token) {
          return of(false);
        }

        const decoded = AuthUtils.decodeUserInfo(token);

        if (!decoded) {
          return of(false);
        }

        this.accessToken = token;
        this._authenticated = true;

        this._user.setUser(decoded);

        return of(true);
      }),
      catchError(error => {
        console.error(error);
        return of(false);
      })
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Set the authenticated flag to false
    this._authenticated = false;

    // Clear user data
    this._user.clearUser();

    // Remove the access token from the local storage
    this._preferences.clear();

    // Return the observable
    this._router.navigate(['/sign-in']);
    return of(true);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check if token already generated
    return from(this._preferences.get<string>(STORAGE_KEY.TOKEN)).pipe(
      switchMap((token) => {
        if (!token) {
          return of(false);
        }

        if (AuthUtils.isTokenExpired(token ?? '')) {
          return of(false);
        }

        return token;
      }),
      switchMap((token) =>
        // If the access token exists and it didn't expire, sign in using it
        this.signInUsingToken()
      ),
      catchError((error) => {
        // Clear invalid token, cause this error
        this._preferences.remove(STORAGE_KEY.TOKEN);
        return of(false);
      })
    );
  }

}
