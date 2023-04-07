import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, ViewChild } from '@angular/core';
import { BoardComponent } from './components';
import { Game, Place } from '@models';

@Component({
  selector: 'gomoku-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements AfterViewInit {

  @ViewChild('board') board: BoardComponent;
  @HostBinding('class.playing') private playing = false;

  private _game: Game = Game.getInstance();

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
    this._game.setBoard(this.board);
    this._game.create('easy');
  }

  start() {
    this.playing = true;
    this._game?.start();
  }

  turn(place: Place) {
    this._game?.place(place);
  }

  undo() {
    this._game?.regret();
  }

  setup() {

  }

}
