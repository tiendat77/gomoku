import { Player } from './Player';
import { Color, Level } from '../interface';
import { GameService } from '../provider/game.service';

export class AIPlayer extends Player {

  level: Level;
  worker: Worker;

  cancel = 0;
  computing = false;

  constructor(color: Color, level: Level) {
    super(color);
    this.level = level;
    this.initWorker();
  }

  initWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../ai.worker', import.meta.url));

      this.worker.onmessage = ({ data }) => {
        this.onMessage(data);
        console.log('new message', data);
      };

      this.worker.postMessage({
        type: 'ini',
        mode: this.level,
        color: this.color
      });
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  terminate() {
    this.worker?.terminate();
  }

  watch(r: number, c: number, color: Color) {
    this.worker.postMessage({
      r,
      c,
      color,
      type: 'watch',
    });
  }

  turn() {
    GameService.game.turn(this.color, false);
    GameService.instance.turn(this.color, 'Thinking...');
    this.move();
  }

  private onMessage(data) {
    switch (data.type) {
      case 'decision':
        this.go(data.r, data.c);
        break;

      case 'starting':
        this.computing = true;
        break;

      default:
        console.log(data);
    }
  }

  private go(r: number, c: number) {
    this.computing = false;

    if (this.cancel > 0) {
      this.cancel--;
      return false;
    }

    return GameService.game.go({r, c}, this.color);
  }

  private first() {
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

      if(this.go(moves[index][0], moves[index][1])){
        return;
      }

      moves.splice(index,1);
    }
  }

  private move() {
    if (GameService.game.rounds === 0) {
      // go at the center of the table
      return this.go(7, 7);
    }

    if (GameService.game.rounds === 1) {
      return this.first();
    }

    this.worker.postMessage({
      type: 'compute'
    });
  }

}