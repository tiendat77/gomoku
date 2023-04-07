import {
  ChangeDetectionStrategy, Component, ElementRef,
  EventEmitter, Output, QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { PanZoomConfig } from '@libs/panzoom';
import { BOARD_SIZE, PANZOOM_CONFIG } from '@configs';
import { Board, Color, Place } from '@models';

import { BoardHelper } from '../../helpers';
import { PieceComponent } from '../piece/piece.component';


@Component({
  selector: 'gomoku-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements Board {

  @Output() onTurn: EventEmitter<Place> = new EventEmitter();

  @ViewChildren(PieceComponent) protected places: QueryList<PieceComponent>;

  board: number[][] = BoardHelper.board(BOARD_SIZE - 1);
  pieces: number[][] = BoardHelper.board(BOARD_SIZE);

  protected placeable = false;

  readonly panZoomConfig = new PanZoomConfig(PANZOOM_CONFIG);

  constructor(
    private  _elementRef: ElementRef
  ) { }

  get element() {
    return this._elementRef.nativeElement as HTMLElement;
  }

  clear() {
    this.unHighlight();
    this.places.forEach(place => place?.clear());
  }

  set(row: number, col: number, color: Color) {
    this.unHighlight();

    this.getPlace(row, col).go(color);
    this.getPlace(row, col).highlight();
  }

  unset(row: number, col: number) {
    this.getPlace(row, col).unGo();
  }

  unHighlight() {
    const childs = this.element?.getElementsByClassName('last-move');
    for (let i = 0; i < childs.length; i++) {
      childs[i].classList.remove('last-move');
    }
  }

  unBlur() {
    this.places.forEach(place => place.unBlur());
  }

  getPlace(row: number, col: number) {
    return this.places.get(row * 15 + col);
  }

  setColor(color: Color) {
    if (color) {
      this.element?.classList.remove('black', 'white');
      this.element?.classList.add(color);
    }
  }

  setPlaceable(placeable: boolean) {
    if (placeable) {
      this.placeable = true;
      this.element?.classList.add('placeable');

    } else {
      this.placeable = false;
      this.element?.classList.remove('placeable');
    }
  }

  onSet(place: Place) {
    if (!this.getPlace(place.r, place.c).canGo()) {
      return;
    }

    this.onTurn.emit(place);
  }

}
