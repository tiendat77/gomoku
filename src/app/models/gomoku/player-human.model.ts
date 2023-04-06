import { Player } from './player.model';
import { Color } from './color.model';
import { Game } from './game.model';

export class HumanPlayer extends Player {

  constructor(color: Color) {
    super(color);
  }

  watch(row: number, col: number, color: Color) { }
  terminate() {}
  regret(row: number, col: number) {}

  turn() {
    Game.getInstance().turn(this.color, true);
  }

}
