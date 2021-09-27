import { Player } from './Player';
import { Color } from '../interface';
import { GameService } from '../provider/game.service';

export class HumanPlayer extends Player {

  constructor(color: Color) {
    super(color);
  }

  watch(r: number, c: number, color: Color) { }

  turn() {
    GameService.game.turn(this.color, true);
    GameService.instance.turn(this.color, 'Your turn');
  }

  terminate() { }

}