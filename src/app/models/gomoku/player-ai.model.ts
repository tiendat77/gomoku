import { Player } from '@models';
import { Color, Level } from '@models';
import { LEVEL, PLAYER } from '@constants';
// import { GameService } from '../provider/game.service';

export class AIPlayer extends Player {

  level: Level;
  override worker: Worker;
  computing = false;

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
    // GameService.game.turn(this.color, false);
    // GameService.instance.turn(this.color, 'Thinking...');

    this.move();
  }

  private move() {
    // if (GameService.game.rounds === 0) {
    //   // go at the center of the table
    //   return this.first();
    // }

    // if (GameService.game.rounds === 1) {
    //   return this.second();
    // }

    this.worker.postMessage({
      type: 'compute'
    });
  }

  private go(row: number, col: number) {
    this.computing = false;
    // return GameService.game.go(row, col, this.color);
    return true;
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

      if (this.go(moves[index][0], moves[index][1])){
        return;
      }

      moves.splice(index,1);
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
