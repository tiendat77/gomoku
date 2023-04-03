import { ChangeDetectionStrategy, Component, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { PanZoomConfig } from '@libs/panzoom';
import { BoardHelper } from '../../helpers';
import { PieceComponent } from '../piece/piece.component';
import { Place } from '@models';


@Component({
  selector: 'gomoku-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {

  @Output() onGo: EventEmitter<Place> = new EventEmitter();
  @ViewChildren(PieceComponent) protected places: QueryList<PieceComponent>;

  size = 15;
  board: number[][] = BoardHelper.board(this.size - 1);
  pieces: number[][] = BoardHelper.board(this.size);

  panZoomConfig: PanZoomConfig = new PanZoomConfig({
    zoomLevels: 3,
    scalePerZoomLevel: 2.0,
    initialZoomToFit: {
      x: 0,
      y: 0,
      width: 640,
      height: 640
    },
    neutralZoomLevel: 1,
    zoomOnMouseWheel: false,
    zoomToFitZoomLevelFactor: 1,
  });

}
