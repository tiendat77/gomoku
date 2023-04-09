import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '@libs/dialog';

@Component({
  selector: 'app-privacy-dialog',
  templateUrl: './privacy-dialog.component.html',
  styleUrls: ['./privacy-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyDialogComponent {

  ref = inject(DialogRef);

  close() {
    this.ref?.close();
  }

}
