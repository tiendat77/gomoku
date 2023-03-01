import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_KEY } from '@configs';
import { PreferencesService } from './preferences.service';

@Injectable()
export class UserService {

  user$ = new BehaviorSubject<any>(null!);

  constructor(
    private _preferences: PreferencesService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  setUser(user: any): void {
    if (!user) {
      return;
    }

    // User
    this.user$.next(user);
    this._preferences.set(STORAGE_KEY.USER, user);
  }

  clearUser(): void {
    this.user$.next(null!);
    this._preferences.remove(STORAGE_KEY.USER);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private async _init() {
    const user = await this._preferences.get<any>(STORAGE_KEY.USER);
    if (user !== null) {
      this.setUser(user);
    }
  }

}
