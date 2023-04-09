import {
  AfterViewInit, Component, ChangeDetectionStrategy,
  HostBinding, ViewChild, inject, ChangeDetectorRef
} from '@angular/core';
import { DialogService } from '@libs/dialog';

import { AudioService } from '@services';
import { Game, GameConfig, GameOver, Place, Status } from '@models';

import { BoardComponent } from './components';
import { GameOverDialogComponent, SetUpDialogComponent } from './dialogs';

@Component({
  selector: 'gomoku-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements AfterViewInit {

  @ViewChild('board') board: BoardComponent;
  @HostBinding('class.playing') playing = false;

  status: Status = {message: 'ready'};

  private _config: GameConfig = {
    mode: 'hvc',
    level: 'medium',
    color: 'white',
  };

  private _game: Game = Game.getInstance();
  private _dialog = inject(DialogService);

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _audio: AudioService,
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Life cycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngAfterViewInit(): void {
    // Set default configs
    this._game
      .setColor(this._config.color)
      .setLevel(this._config.level)
      .setMode(this._config.mode);

    this.create();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  create() {
    this.board?.clear();
    this._game.create(this.board);
    this._game.setOnOver(this.over.bind(this));
    this._game.setOnStatus(this.update.bind(this));
  }

  start() {
    this.playing = true;
    this._game?.create();
    this._game?.start();
  }

  update(status: Status) {
    this.status = status;
    this._cdr.detectChanges();
  }

  over(result: GameOver) {
    this.playing = false;
    this._cdr.detectChanges();

    const dialogRef = this._dialog.open(GameOverDialogComponent, {
      data: {
        config: this._config,
        result: result
      }
    });

    dialogRef.afterClosed$.subscribe((result) => {
      if (result) {
        // play again with same configs
        this.start();
      }
    });
  }

  turn(place: Place) {
    if (!this.playing) {
      return;
    }

    this._audio.play('step');
    this._game?.place(place);
  }

  undo() {
    this._game?.regret();

    if (!this.playing) {
      this.playing = true;
      this._cdr.detectChanges();
    }
  }

  setup() {
    const dialogRef = this._dialog.open(SetUpDialogComponent, {
      data: {
        config: this._config
      }
    });

    dialogRef.afterClosed$.subscribe((result) => {
      if (result) {
        this._config = result.config;

        this._game
          .setColor(this._config.color)
          .setLevel(this._config.level)
          .setMode(this._config.mode);

        this.start();
      }
    });
  }

}
