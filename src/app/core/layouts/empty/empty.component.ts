import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'layout-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyLayoutComponent {

  constructor() { }

}
