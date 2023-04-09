import { Color } from './color.model';
import { Level } from './level.model';
import { Mode } from './mode.model';

export interface GameConfig {
  mode: Mode;
  level: Level;
  color: Color;
}
