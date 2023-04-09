import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DialogRef } from '@libs/dialog';

import { AudioService } from '@services';
import { Confetti } from '@shared/helpers';
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

  constructor(
    private _audio: AudioService
  ) { }

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
    this.sound();
    this.confetti();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  sound() {
    /** Draw no matter mode */
    if (this.result === 'draw') {
      this._audio.play('applause');
      return;
    }

    /** Mode human vs human */
    if (this.mode === 'hvh') {
      this._audio.play('win');
      return;
    }

    /** Mode human vs computer */
    if (this.result === 'win') {
      this._audio.play('win');
      return;
    }

    if (this.result === 'lose') {
      this._audio.play('lose');
      return;
    }
  }

  confetti() {
    if (this.result !== 'win' && this.mode !== 'hvh') {
      return;
    }

    function fire(ratio: any, opts: any) {
      new Confetti(Object.assign({}, opts, {
        particleCount: Math.floor(200 * ratio),
      })).fire();
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  close() {
    this.ref?.close();
  }

  again() {
    this.ref?.close('again');
  }

}
