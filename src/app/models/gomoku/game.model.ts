import { COLOUR, GRID, PLAYER } from '@constants';

import { Color } from './color.model';
import { Level } from './level.model';
import { Mode } from './mode.model';
import { Place, PlaceHistory } from './place.model';
import { HumanPlayer } from './player-human.model';
import { GamePlayers } from './player.model';
import { AIPlayer } from './player-ai.model';
import { Board } from './board.model';
import { GameOver } from './over.model';
import { Status } from './status.model';

export class Game {

  /** Game Play */
  rounds = 0;
  playing = false;
  color: Color = 'black';
  grid: number[][] = [];

  players: GamePlayers = {
    black: null,
    white: null,
  };

  /** Game Configs */
  // mode: Mode | Level = 'medium';
  private _mode: Mode;
  private _level: Level;
  private _color: Color;

  private _overCallback: (result: GameOver) => void;
  private _statusCallback: (data: Status) => void;
  private _board: Board;
  private _history: PlaceHistory[] = [];

  private static _instance: Game;

  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  static getInstance(): Game {
    if (!Game._instance) {
      Game._instance = new Game();
    }

    return Game._instance;
  }

  setBoard(board: Board): Game {
    this._board = board;
    return this;
  }

  setMode(mode: Mode): Game {
    this._mode = mode;
    return this;
  }

  setLevel(level: Level) {
    this._level = level;
    return this;
  }

  setColor(color: Color): Game {
    this._color = color;
    return this;
  }

  setOnOver(callback: (result: GameOver) => void) {
    this._overCallback = callback;
  }

  setOnStatus(callback: (data: Status) => void) {
    if (this._overCallback) {
      this._statusCallback = callback;
    }
  }

  setStatus(status: Status) {
    if (this._statusCallback) {
      this._statusCallback(status);
    }
  }

  create(board?: Board) {
    if (board) {
      this._board = board;
    }

    this.reset();

    if (this._mode === 'hvh') {
      this.players['black'] = new HumanPlayer('black');
      this.players['white'] = new HumanPlayer('white');

    } else {
      const other = COLOUR[1 - PLAYER[this._color]];
      this.players[other] = new AIPlayer(other, this._level);
      this.players[this._color] = new HumanPlayer(this._color);
    }

    return this;
  }

  reset() {
    try {
      this.players['black']?.terminate();
      this.players['white']?.terminate();
    } catch (e) {}

    this.rounds = 0;
    this.grid = GRID.map((row) => row.slice());
    this._history = [];
    this._board?.clear();

    this.players['black'] = null;
    this.players['white'] = null;
  }

  start() {
    this.playing = true;
    this.players?.black?.turn();
  }

  end(result: 'over' | 'draw') {
    this.playing = false;
    this._board.setPlaceable(false);
    this.setStatus({message: 'game over'});

    if (result === 'draw') {
      return this._overCallback('draw');
    }

    if (this._mode === 'hvh') {
      return this._overCallback(this.color);
    }

    if (this.players[this.color] instanceof HumanPlayer) {
      return this._overCallback('win');

    } else {
      return this._overCallback('lose');
    }
  }

  place(place: Place) {
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

    this._board?.set(row, col, color);

    this.rounds++;
    this.grid[row][col] = PLAYER[color];
    this._history.push({ row, col, color: PLAYER[color] });

    const result = this._isOver(row, col, PLAYER[color]);

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
    this._board?.setColor(color);
    this._board?.setPlaceable(placeable);
  }

  regret() {
    if (this._mode !== 'hvh' && this._history.length === 1) {
      return;
    }

    let last: PlaceHistory;

    for (let i = 0; i < 2; i++) {
      last = this._history.pop();
      if (last) {
        this.rounds--;
        this.grid[last.row][last.col] = -1;
        this._board?.unset(last.row, last.col);

        this.players.white?.regret(last.row, last.col);
        this.players.black?.regret(last.row, last.col);
      }
    }

    last = this._history[this._history.length - 1];
    if (last) {
      this._board?.getPlace(last.row, last.col)?.highlight();
      this.players[COLOUR[1 - last.color]].turn();

    } else {
      this._board?.unHighlight();
    }

    if (!this.playing) {
      this.playing = true;
      this._board?.unBlur();
      this._board?.setPlaceable(true);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _isOver(row: number, col: number, player: number) {
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

  private _isInBoard(row: number, col: number) {
    return row >= 0 && col >= 0 && row < 15 && col < 15;
  }

  private _highlight(line: any[]) {
    this._board?.unHighlight();

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        this._board?.getPlace(i, j)?.blur();
      }
    }

    for (const place of line) {
      this._board?.getPlace(place.row, place.col)?.unBlur();
    }
  }

}
