import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationService } from '@services';
import { DialogService } from '@libs/dialog';
import { ExampleDialogComponent } from './example-dialog/example-dialog.component';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {

  constructor(
    private _notification: NotificationService,
    private _dialog: DialogService
  ) { }

  toast() {
    this._notification.error('This is a test notification');
  }

  dialog() {
    this._dialog.open(ExampleDialogComponent);
  }

}
