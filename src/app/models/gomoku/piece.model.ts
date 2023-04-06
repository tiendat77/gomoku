import { Color } from './color.model';

export abstract class Piece {
  abstract r: number;
  abstract c: number;

  abstract go(color: Color): void;
  abstract unGo(): void;
  abstract canGo(): boolean;
  abstract highlight(): void;
  abstract unHighlight(): void;
  abstract warn(): void;
  abstract unWarn(): void;
  abstract blur(): void;
  abstract unBlur(): void;
  abstract clear(): void;
}
