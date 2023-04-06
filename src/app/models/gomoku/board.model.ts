import { Color } from './color.model';
import { Piece } from './piece.model';
import { Place } from './place.model';

export abstract class Board {
  abstract clear(): void;
  abstract set(row: number, col: number, color: Color): void;
  abstract unset(row: number, col: number): void;
  abstract unHighlight(): void;
  abstract unBlur(): void;
  abstract getPlace(row: number, col: number): Piece;
  abstract setColor(color: Color): void;
  abstract setPlaceable(placeable: boolean): void;
  abstract onSet(place: Place): void;
}
