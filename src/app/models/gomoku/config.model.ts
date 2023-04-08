import { Color } from './color.model';
import { Level } from './level.model';
import { Mode } from './mode.model';

export interface GameConfig {
  mode: Mode | Level;
  color: Color;
}
