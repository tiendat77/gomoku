import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '@libs/dialog';

@Component({
  selector: 'app-app-info-dialog',
  templateUrl: './app-info-dialog.component.html',
  styleUrls: ['./app-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppInfoDialogComponent {

  ref = inject(DialogRef);

  close() {
    this.ref?.close();
  }
}
