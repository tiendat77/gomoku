import { Player } from '../model';

export interface GamePlayers {
  black: Player;
  white: Player;
}

export interface GameConfig {
  mode: Mode | Level;
  color: Color;
}

export type Color = 'black' | 'white';

export type Mode = 'hvh' | 'hvc';

export type Level = 'easy' | 'medium' | 'master';

export interface Place {
  r: number;
  c: number;
}

export interface PlaceMap {
  black: Array<Array<Array<number>>>;
  white: Array<Array<Array<number>>>;
}

export interface PlaceHistory {
  row: number;
  col: number;
  color: number;
}
