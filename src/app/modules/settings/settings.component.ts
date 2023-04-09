import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogService } from '@libs/dialog';
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

  private _dialog = inject(DialogService);

  constructor() {}

  info() {
    this._dialog.open(AppInfoDialogComponent, {size: 'fullScreen'});
  }

  privacy() {
    this._dialog.open(PrivacyDialogComponent, {size: 'fullScreen'});
  }

}
