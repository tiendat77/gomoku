import { Player } from './player.model';
import { Color } from './color.model';
import { Level } from './level.model'
import { LEVEL, PLAYER } from '@constants';
import { Game } from './game.model';

export class AIPlayer extends Player {

  level: Level;
  computing = false;
  override worker: Worker;

  constructor(color: Color, level: Level) {
    super(color);
    this.level = level;

    this.init();
  }

  init() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../ai/ai.worker', import.meta.url));

      this.worker.onmessage = ({ data }) => {
        this.onMessage(data);
      };

      this.worker.postMessage({
        type: 'ini',
        mode: LEVEL[this.level],
        color: PLAYER[this.color]
      });
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  terminate() {
    this.worker?.terminate();
  }

  watch(row: number, col: number, color: Color) {
    this.worker.postMessage({
      row,
      col,
      color: PLAYER[color],
      type: 'watch',
    });
  }

  turn() {
    Game.getInstance().setStatus({
      color: this.color,
      message: 'thinking...',
    });
    Game.getInstance().turn(this.color, false);

    this.move();
  }

  regret(row: number, col: number) {
    this.worker.postMessage({
      row,
      col,
      type: 'regret',
    });
  }

  move() {
    if (Game.getInstance().rounds === 0) {
      // go at the center of the table
      return this.first();
    }

    if (Game.getInstance().rounds === 1) {
      return this.second();
    }

    this.worker.postMessage({
      type: 'compute'
    });
  }

  private go(row: number, col: number) {
    this.computing = false;
    return Game.getInstance().go(row, col, this.color);
  }

  private first() {
    this.go(7, 7);
  }

  private second() {
    const moves = [
      [6,6],
      [6,7],
      [6,8],
      [7,6],
      [7,7],
      [7,8],
      [8,6],
      [8,7],
      [8,8]
    ];

    while(true) {
      const index = Math.floor(Math.random() * moves.length);

      if (this.go(moves[index][0], moves[index][1])) {
        return;
      }

      moves.splice(index, 1);
    }
  }

  private onMessage(data: any) {
    switch (data.type) {
      case 'decision':
        this.go(data.row, data.col);
        break;

      case 'starting':
        this.computing = true;
        break;

      default:
        console.log(data);
    }
  }

}
