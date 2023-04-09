import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DialogRef } from '@libs/dialog';
import { GameConfig, GameOver, Level, Mode } from '@models';

@Component({
  selector: 'app-game-over-dialog',
  templateUrl: './game-over-dialog.component.html',
  styleUrls: ['./game-over-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameOverDialogComponent implements OnInit {

  ref: DialogRef<{
    config: GameConfig;
    result: GameOver;
  }> = inject(DialogRef);

  mode: Mode;
  level: Level;
  result: GameOver;

  constructor() { }

  // -----------------------------------------------------------------------------------------------------
  // @ Life cycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    if (!this.ref.data) {
      return;
    }

    const config = this.ref.data.config;

    this.mode = config?.mode ?? 'hvc';
    this.level = config?.level ?? 'medium';
    this.result = this.ref.data.result;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  close() {
    this.ref?.close();
  }

  again() {
    this.ref?.close('again');
  }

}
