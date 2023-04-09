import {
  ChangeDetectionStrategy, Component, ElementRef,
  EventEmitter, OnDestroy, OnInit, Output, QueryList,
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import { Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

import { PanZoomAPI, PanZoomConfig } from '@libs/panzoom';
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
export class BoardComponent implements Board, OnInit, OnDestroy {

  @Output() onTurn: EventEmitter<Place> = new EventEmitter();
  @ViewChildren(PieceComponent) protected places: QueryList<PieceComponent>;

  board: number[][] = BoardHelper.board(BOARD_SIZE - 1);
  pieces: number[][] = BoardHelper.board(BOARD_SIZE);
  readonly panZoomConfig = new PanZoomConfig(PANZOOM_CONFIG);

  protected placeable = false;
  private _panZoomAPI: PanZoomAPI;
  private _destroyed$ = new Subject<void>();

  constructor(
    private  _elementRef: ElementRef
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get element() {
    return this._elementRef.nativeElement as HTMLElement;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.panZoomConfig?.api?.pipe(
      takeUntil(this._destroyed$)
    )?.subscribe(api => this._panZoomAPI = api);

    fromEvent(window, 'resize').pipe(
      debounceTime(200),
      takeUntil(this._destroyed$)
    ).subscribe(() => {
      this._panZoomAPI?.resetView();
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
