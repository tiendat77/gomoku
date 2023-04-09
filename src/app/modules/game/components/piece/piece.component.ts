import {
  ChangeDetectionStrategy, Component,
  ElementRef, EventEmitter, HostListener,
  Input, Output, ViewEncapsulation
} from '@angular/core';
import { Color, Piece, Place } from '@models';
import { JustClickDirective } from './just-click.directive';

@Component({
  selector: 'gomoku-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
  hostDirectives: [JustClickDirective],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieceComponent implements Piece {

  @Input() r: number = 0;
  @Input() c: number = 0;
  @Output() onGo: EventEmitter<Place> = new EventEmitter();

  protected isSet = false;

  constructor(
    private readonly _elementRef: ElementRef
  ) { }

  get element() {
    return this._elementRef.nativeElement as HTMLElement;
  }

  /**
   * @description Prevent double click, long click
   * To make sure this component don't effect to the pan-zoom component
   */
  @HostListener('just-click', ['$event'])
  justClick() {
    this.onGo.emit({r: this.r, c: this.c});
  }

  go(color: Color) {
    this.isSet = true;
    this.element?.classList.add('set', color);
  }

  unGo() {
    this.isSet = false;
    this.element.classList?.remove('black', 'white', 'set', 'last-move');
  }

  canGo() {
    return !this.isSet;
  }

  highlight() {
    this.element.classList?.add('last-move');
  }

  unHighlight() {
    this.element.classList?.remove('last-move');
  }

  warn() {
    this.element.classList?.add('warning');
  }

  unWarn() {
    this.element.classList?.remove('warning');
  }

  blur() {
    this.element.classList?.add('blur');
  }

  unBlur() {
    this.element.classList?.remove('blur');
  }

  clear() {
    this.isSet = false;
    this.element.classList?.remove('black', 'white', 'set', 'last-move', 'warning', 'blur');
  }

}
