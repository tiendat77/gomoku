import {
  AfterViewInit, Component, ChangeDetectionStrategy,
  HostBinding, ViewChild, inject
} from '@angular/core';
import { DialogService } from '@libs/dialog';
import { Game, GameConfig, Place } from '@models';

import { BoardComponent } from './components';
import { SetUpDialogComponent } from './dialogs';

@Component({
  selector: 'gomoku-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements AfterViewInit {

  @ViewChild('board') board: BoardComponent;
  @HostBinding('class.playing') private playing = false;

  private _config: GameConfig = {
    mode: 'medium',
    color: 'white',
  };

  private _game: Game = Game.getInstance();
  private _dialog = inject(DialogService);

  constructor() { }

  // -----------------------------------------------------------------------------------------------------
  // @ Life cycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngAfterViewInit(): void {
    this.create();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  create() {
    this.board?.clear();
    this._game.create(this.board);
  }

  start() {
    this.playing = true;
    this._game?.create();
    this._game?.start();
  }

  turn(place: Place) {
    this._game?.place(place);
  }

  undo() {
    this._game?.regret();
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
        this._game.setMode(this._config.mode);
        this._game.setColor(this._config.color);
        this.start();
      }
    });
  }

}
