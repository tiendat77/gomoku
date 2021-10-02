import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild, HostBinding } from '@angular/core'

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { GameService } from '../../provider/game.service';
import { AudioService } from '../../provider/audio.service';
import { PlacesComponent } from '../places/places.component';

import { HumanPlayer, AIPlayer } from '../../model';
import { COLOUR, GRID, PLAYER } from '../../interface/constant';
import { GamePlayers, Color, Level, Mode, Place, PlaceHistory } from '../../interface';

@Component({
  selector: 'gomoku-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  host: {
    'class': 'gomoku-game'
  }
})
export class GameComponent implements OnDestroy, AfterViewInit {

  @ViewChild('places') places: PlacesComponent;
  @HostBinding('class.playing') private playing = false;

  rounds = 0;
  color: Color;
  grid: number[][] = [];
  mode: Mode | Level = 'medium';

  players: GamePlayers = {
    black: null,
    white: null
  };

  private history: PlaceHistory[] = [];

  private readonly subscription$: Subscription = new Subscription();

  constructor(
    private game: GameService,
    private audio: AudioService,
    private elementRef: ElementRef
  ) {
    this.game.init(this);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._adjust();
      this._resize();
    }, 555);
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe();
  }

  /** Game status */
  create(mode: Mode | Level, color: Color = 'white') {
    try {
      this.players['black']?.terminate();
      this.players['white']?.terminate();
    } catch(e) { }

    this.rounds = 0;
    this.mode = mode;
    this.history = [];
    this.color = color;

    this.places.clear();
    this.grid = GRID.map(row => row.slice());

    this.players['black'] = null;
    this.players['white'] = null;

    if (this.mode === 'hvh') {
      this.players['black'] = new HumanPlayer('black');
      this.players['white'] = new HumanPlayer('white');

    } else {
      const other = COLOUR[1 - PLAYER[color]];
      this.players[other] = new AIPlayer(other, this.mode as Level);
      this.players[color] = new HumanPlayer(color);
    }
  }

  start() {
    this.playing = true;
    this.players.black.turn();
  }

  end(result: string) {
    this.playing = false;
    this.places.setPlaceable(false);
    this.game.turn(null, 'Game over');

    if (result === 'draw') {
      this.audio.play('applause');
      return this.game.over('draw');
    }

    if (this.mode === 'hvh') {
      this.audio.play('win');
      return this.game.over(this.color);
    }

    if (this.players[this.color] instanceof HumanPlayer) {
      this.audio.play('win');
      return this.game.over('win');

    } else {
      this.audio.play('lose');
      return this.game.over('lose');
    }
  }

  /** Game control */
  onGo(place: Place) {
    const player = this.players[this.color];

    if (player instanceof HumanPlayer) {
      this.go(place.r, place.c, this.color);
    }
  }

  go(row: number, col: number, color: Color) {
    if (!this.playing) {
      return false;
    }

    if (this.grid[row][col] !== -1) {
      return false;
    }

    this.audio.play('step');

    this.rounds++;
    this.grid[row][col] = PLAYER[color];
    this.places.set(row, col, color);
    this.history.push({ row, col, color: PLAYER[color] });

    const result = this._result(row, col, PLAYER[color]);

    if (result) {
      this.end('over');
      return true;
    }

    if (this.rounds >= 255) {
      this.end('draw');
      return true;
    }

    this.update(row, col, color);
    return true;
  }

  update(row: number, col: number, color: Color) {
    this.players['black'].watch(row, col, color);
    this.players['white'].watch(row, col, color);
    setTimeout(() => this.progress(), 10);
  }

  progress() {
    if (this.color === 'black') {
      this.players['white'].turn();

    } else {
      this.players['black'].turn();
    }
  }

  turn(color: Color, placeable = false) {
    this.color = color;
    this.places.setColor(color);
    this.places.setPlaceable(placeable);
  }

  regret() {
    if (this.mode !== 'hvh' && this.history.length === 1) {
      return;
    }

    let last: PlaceHistory;

    for (let i = 0; i < 2; i++) {
      last = this.history.pop();
      if (last) {
        this.rounds--;
        this.grid[last.row][last.col] = -1;
        this.places.unset(last.row, last.col);
        this.players.white.watch(last.row, last.col, 'remove');
        this.players.black.watch(last.row, last.col, 'remove');
      }
    }

    last = this.history[this.history.length - 1];
    if (last) {
      this.places.getPlace(last.row, last.col).highlight();
      this.players[COLOUR[1 - last.color]].turn();

    } else {
      this.places.unhighlight();
    }

    if (!this.playing) {
      this.playing = true;
      this.places.unblur();
      this.places.setPlaceable(true);
    }
  }

  /** Helpers */
  private _result(row, col, player) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) {
          continue;
        }

        let cnt = 1;
        const line = [{row, col}];

        for (let dir = -1; dir <= 1; dir += 2) {
          for (let l = 1; l <= 4; l++) {
            let newrow = row + dir * i * l;
            let newcol = col + dir * j * l;

            if (this._isInBoard(newrow, newcol) && player == this.grid[newrow][newcol]) {
              cnt++;
              line.push({row: newrow, col: newcol});

            } else {
              break;
            }

            if (cnt === 5) {
              this._highlight(line);
              return true;
            }
          }
        }

        if (cnt >= 5) {
          this._highlight(line);
          return true;
        }
      }
    }

    return false;
  }

  private _isInBoard(row, col) {
    return row >= 0 && col >= 0 && row < 15 && col < 15;
  }

  private _highlight(line: any[]) {
    this.places.unhighlight();

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        this.places.getPlace(i, j).blur();
      }
    }

    for (const place of line) {
      this.places.getPlace(place.row, place.col).unBlur();
    }
  }

  private _getElement() {
    return this.elementRef.nativeElement as HTMLElement;
  }

  private _adjust() {
    const parent = this._getElement().parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    const size = Math.min(width, height);
    const delta = size / 640;

    const board = this._getElement();
    board.style.transform = `scale(${delta})`;
  }

  private _resize() {
    const event = fromEvent(window, 'resize').pipe(
      debounceTime(200)
    ).subscribe(() => this._adjust());

    this.subscription$.add(event);
  }

}
