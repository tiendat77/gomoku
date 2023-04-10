import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { DialogRef } from '@libs/dialog';

@Component({
  selector: 'app-app-info-dialog',
  templateUrl: './app-info-dialog.component.html',
  styleUrls: ['./app-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppInfoDialogComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;

  constructor(
    private _ref: DialogRef,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._subscription = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this._ref?.close();
    });
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  close() {
    this._ref?.close();
  }

}
