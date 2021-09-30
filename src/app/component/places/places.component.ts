import { Component, Output, EventEmitter } from '@angular/core';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';

import { GoComponent } from '../go/go.component';
import { Color, Place } from '../../interface';

@Component({
  selector: 'gomoku-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  host: {
    'class': 'gomoku-places'
  }
})
export class PlacesComponent {

  @Output() onGo: EventEmitter<Place> = new EventEmitter();
  @ViewChildren(GoComponent) protected places: QueryList<GoComponent>;

  readonly size = new Array(15).fill(0).map((value, index) => index);

  protected placeable = false;
  protected warnings = {
    black: false,
    white: false
  };

  constructor(
    private elementRef: ElementRef
  ) { }

  clear() {
    this.unhighlight();
    this.places.forEach(place => place.clear());
  }

  set(row: number, col: number, color: Color) {
    this.unhighlight();

    this.getPlace(row, col).go(color);
    this.getPlace(row, col).highlight();
  }

  unset(row: number, col: number) {
    this.getPlace(row, col).unGo();
  }

  unhighlight() {
    const childs = this.getElement().getElementsByClassName('last-move');
    for (let i = 0; i < childs.length; i++) {
      childs[i].classList.remove('last-move');
    }
  }

  getPlace(row: number, col: number) {
    return this.places.get(row * 15 + col);
  }

  setColor(color: Color) {
    if (color) {
      this.getElement().classList.remove('black', 'white');
      this.getElement().classList.add(color);
    }
  }

  setPlaceable(placeable: boolean) {
    if (placeable) {
      this.placeable = true;
      this.getElement().classList.add('placeable');

    } else {
      this.placeable = false;
      this.getElement().classList.remove('placeable');
    }
  }

  setWarning(color: Color, shouldWarn: boolean) {
    this.warnings[color] = !!shouldWarn;
  }

  warning(row: number, col: number, dir: number, color: Color) {
    if (!this.warnings[color]) {
      return;
    }

    // TODO
    // if (this.map[color][dir][row][col] > 4) {
    //   this.getPlace(row, col).warn();

    // } else {
    //   this.getPlace(row, col).unWarn();
    // }
  }

  onSet(place: Place) {
    if (!this.getPlace(place.r, place.c).canGo()) {
      return;
    }

    this.onGo.emit(place);
  }

  /** Helper */
  private getElement() {
    return this.elementRef.nativeElement as HTMLElement;
  }

}
