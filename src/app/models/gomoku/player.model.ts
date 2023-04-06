import { Color } from './color.model';

export abstract class Player {
  color: Color;
  worker?: Worker;

  constructor(color: Color) {
    this.color = color;
  }

  abstract turn(): void;
  abstract watch(row: number, col: number, color: Color): void;
  abstract terminate(): void;
  abstract regret(row: number, col: number): void;
}

export interface GamePlayers {
  black: Player;
  white: Player;
}
