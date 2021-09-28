import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild, HostBinding } from '@angular/core'

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { GameService } from '../../provider/game.service';
import { PlacesComponent } from '../places/places.component';

import { HumanPlayer, AIPlayer } from '../../model';
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

  color: Color = 'black';
  mode: Mode | Level = 'medium';

  players: GamePlayers = {
    black: null,
    white: null
  };

  private history: PlaceHistory[] = [];

  private readonly subscription$: Subscription = new Subscription();

  constructor(
    private game: GameService,
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

    this.mode = mode;
    this.color = color;
    this.places.clear();

    this.rounds = 0;
    this.history = [];
    this.players['black'] = null;
    this.players['white'] = null;

    if (this.mode === 'hvh') {
      this.players['black'] = new HumanPlayer('black');
      this.players['white'] = new HumanPlayer('white');

      this.places.setWarning('black', false);
      this.places.setWarning('white', false);

    } else {
      const other = color === 'black' ? 'white' : 'black';
      this.players[other] = new AIPlayer(other, this.mode as Level);
      this.players[color] = new HumanPlayer(color);

      this.places.setWarning(other, true);
    }
  }

  start() {
    this.playing = true;
    this.players.black.turn();
  }

  end(result: string) {
    this.playing = false;
    this.places.setPlaceable(false);

    if (result === 'draw') {
      return this.game.over('draw');
    }

    if (this.mode === 'hvh') {
      return this.game.over(this.color);
    }

    if (this.players[this.color] instanceof HumanPlayer) {
      return this.game.over('win');

    } else {
      return this.game.over('lose');
    }
  }

  /** Game control */
  onGo(place: Place) {
    const player = this.players[this.color];

    if (player instanceof HumanPlayer) {
      this.go(place, this.color);
    }
  }

  go(place: Place, color: Color) {
    if (!this.playing) {
      return false;
    }

    this.places.set(place, color);
    this.history.push({
      r: place.r,
      c: place.c,
      color
    });

    const result = this.places.result(place.r, place.c, color);

    if (!result) {
      this.update(place.r, place.c, color);

    } else {
      this.end(result);
    }

    return true;
  }

  update(r: number, c: number, color: Color) {
    this.rounds++;
    this.places.update(r, c, color);
    this.players['black'].watch(r, c, color);
    this.players['white'].watch(r, c, color);
    setTimeout(() => this.progress(), 10);
  }

  progress() {
    if (this.color === 'black') {
      this.players['white'].turn();

    } else {
      this.players['black'].turn();
    }
  }

  undo() {
    if (!this.history.length) {
      return;
    }

    let last;

    if (!this.playing) {
      last = this.history.pop();
      this.places.unset({r: last.r, c: last.c});
      this.players.black.watch(last.r, last.c, 'remove');
      this.players.white.watch(last.r, last.c, 'remove');
      return;
    }

    do {
      if (!this.history.length) {
        return;
      }

      last = this.history.pop();
      this.places.unset({r: last.r, c: last.c});
      this.players.black.watch(last.r, last.c, 'remove');
      this.players.white.watch(last.r, last.c, 'remove');

    } while(this.players[last.color] instanceof AIPlayer);

    last = this.history[this.history.length - 1];

    if (this.history.length > 0) {
      this.places.getPlace(last.r, last.c).highlight();
    } else {
      this.places.unhighlight();
    }

    const other = last.color === 'black' ? 'white' : 'black';
    this.players[other].turn();

    if (this.players['black'] instanceof AIPlayer && this.players['black'].computing) {
      this.players['black'].cancel++;
    }

    if (this.players['white'] instanceof AIPlayer && this.players['white'].computing) {
      this.players['white'].cancel++;
    }
  }

  turn(color: Color, placeable = false) {
    this.setColor(color);
    this.places.setColor(color);
    this.places.setPlaceable(placeable);
  }

  setColor(color: Color) {
    this.color = color;
  }

  /** Helpers */
  private getElement() {
    return this.elementRef.nativeElement as HTMLElement;
  }

  private _adjust() {
    const parent = this.getElement().parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    const size = Math.min(width, height);
    const delta = size / 640;

    const board = this.getElement();
    board.style.transform = `scale(${delta})`;
  }

  private _resize() {
    const event = fromEvent(window, 'resize').pipe(
      debounceTime(200)
    ).subscribe(() => this._adjust());

    this.subscription$.add(event);
  }

}
