import { Color } from '@models';

// export interface PlayerModel {
//   color: Color;
//   worker?: Worker;
//   turn(): void;
//   watch(row: number, col: number, color: Color): void;
//   terminate(): void;
// }

export abstract class Player {
  color: Color;
  worker?: Worker;

  constructor(color: Color) {
    this.color = color;
  }

  abstract turn(): void;
  abstract watch(row: number, col: number, color: Color): void;
  abstract terminate(): void;
}

export interface GamePlayers {
  black: Player;
  white: Player;
}
