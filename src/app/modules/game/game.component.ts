import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, ViewChild } from '@angular/core';
import { BoardComponent, PieceComponent } from './components';
import { Game, Place } from '@models';

@Component({
  selector: 'gomoku-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements AfterViewInit {

  // @ViewChild('places') places: PieceComponent;
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
  }

  start() {
    this.playing = true;
    this.board?.clear();
    this._game.setBoard(this.board);
    this._game.create('easy');
    this._game?.start();
  }

  onGo(place: Place) {
    this._game?.place(place);
  }

}
