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
