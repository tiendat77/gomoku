import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { DialogService } from '@libs/dialog';
import { Confetti } from '@shared/helpers';

import { NotificationService } from '@services';
import { FEEDBACK_URL } from '@configs';
import { environment } from '@environment';

import { AppInfoDialogComponent, PrivacyDialogComponent } from './dialogs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  version = environment.version;
  feedbackUrl = FEEDBACK_URL;

  constructor(
    private _router: Router,
    private _dialog: DialogService,
    private _toast: NotificationService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  info() {
    const dialog = this._dialog.open(AppInfoDialogComponent, {size: 'fullScreen'});

    this._router.navigate([], {fragment: 'app-info'});
    dialog.afterClosed$.subscribe(() => {
      this._router.navigate([], {fragment: null});
    });
  }

  privacy() {
    const dialog = this._dialog.open(PrivacyDialogComponent, {size: 'fullScreen'});

    this._router.navigate([], {fragment: 'privacy'});
    dialog.afterClosed$.subscribe(() => {
      this._router.navigate([], {fragment: null});
    });
  }

  share() {
    const link = 'https://gomokudo.vercel.app';

    if (navigator.share) {
      navigator.share({
        title: 'Gomoku',
        url: link
      });

    } else {
      Clipboard.write({string: link});
      this._toast.info('Copied link to clipboard! Now, you can share it with your friends.');
    }
  }

  firework() {
    setTimeout(() => {
      new Confetti().fire();
    }, 0);
    setTimeout(() => {
      new Confetti().fire();
    }, 700);
  }

}
