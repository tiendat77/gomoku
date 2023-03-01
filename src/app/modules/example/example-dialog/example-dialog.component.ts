import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-example-dialog',
  templateUrl: './example-dialog.component.html',
  styleUrls: ['./example-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleDialogComponent {

}
