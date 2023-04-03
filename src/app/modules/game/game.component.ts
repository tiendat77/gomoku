import { ChangeDetectionStrategy, Component, HostBinding, ViewChild } from '@angular/core';
import { Color, GamePlayers, Level, Mode } from '@models';
import { PieceComponent } from './components';

@Component({
  selector: 'gomoku-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {

  @ViewChild('places') places: PieceComponent;
  @HostBinding('class.playing') private playing = false;

  rounds = 0;
  color: Color;
  grid: number[][] = [];
  mode: Mode | Level = 'medium';

  players: GamePlayers = {
    black: null,
    white: null
  };

}
