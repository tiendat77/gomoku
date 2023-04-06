import { COLOUR, GRID, PLAYER } from '@constants';

import { Color } from './color.model';
import { Level } from './level.model';
import { Mode } from './mode.model';
import { Place, PlaceHistory } from './place.model';
import { HumanPlayer } from './player-human.model';
import { GamePlayers } from './player.model';
import { AIPlayer } from './player-ai.model';
import { Board } from './board.model';

export class Game {
  rounds = 0;
  color: Color;
  grid: number[][] = [];
  mode: Mode | Level = 'medium';
  playing = false;

  players: GamePlayers = {
    black: null,
    white: null,
  };

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

  create(mode: Mode | Level, color: Color = 'white') {
    try {
      this.players['black']?.terminate();
      this.players['white']?.terminate();
    } catch (e) {}

    this.rounds = 0;
    this.mode = mode;
    this._history = [];
    this.color = color;

    this._board.clear();
    this.grid = GRID.map((row) => row.slice());

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

    return this;
  }

  start() {
    this.playing = true;
    this.players?.black?.turn();
  }

  end(result: string) {
    this.playing = false;
    this._board.setPlaceable(false);

    // TODO:
    // this.game.turn(null, 'Game over');
    // if (result === 'draw') {
    //   this.audio.play('applause');
    //   return this.game.over('draw');
    // }

    // if (this.mode === 'hvh') {
    //   this.audio.play('win');
    //   return this.game.over(this.color);
    // }

    // if (this.players[this.color] instanceof HumanPlayer) {
    //   this.audio.play('win');
    //   return this.game.over('win');

    // } else {
    //   this.audio.play('lose');
    //   return this.game.over('lose');
    // }
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

    // TODO:
    // this.audio.play('step');
    this._board?.set(row, col, color);

    this.rounds++;
    this.grid[row][col] = PLAYER[color];
    this._history.push({ row, col, color: PLAYER[color] });

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
    this._board?.setColor(color);
    this._board?.setPlaceable(placeable);
  }

  regret() {
    if (this.mode !== 'hvh' && this._history.length === 1) {
      return;
    }

    let last: PlaceHistory;

    for (let i = 0; i < 2; i++) {
      last = this._history.pop();
      if (last) {
        this.rounds--;
        this.grid[last.row][last.col] = -1;
        this._board?.unset(last.row, last.col);

        // TODO: Check this func
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

  private _result(row: number, col: number, player: number) {
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
