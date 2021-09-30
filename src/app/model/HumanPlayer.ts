import { Player } from './Player';
import { PLAYER } from './Gomoku';
import { Color } from '../interface';
import { GameService } from '../provider/game.service';

export class HumanPlayer extends Player {

  constructor(color: Color) {
    super(color);
  }

  watch(row: number, col: number, color: Color) { }

  turn() {
    GameService.game.turn(this.color, true);
    GameService.instance.turn(this.color, 'Your turn');
  }

  terminate() { }

}