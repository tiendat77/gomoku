import { Component, ElementRef, EventEmitter } from '@angular/core';
import { HostListener, Input, Output } from '@angular/core';

import { Color, Place } from '../../interface';

@Component({
  selector: 'gomoku-go',
  templateUrl: './go.component.html',
  styleUrls: ['./go.component.scss'],
  host: {
    'class': 'gomoku-go'
  }
})
export class GoComponent {

  @Input() r: number = 0;
  @Input() c: number = 0;
  @Output() onGo: EventEmitter<Place> = new EventEmitter();

  protected isSet = false;

  constructor(
    private elementRef: ElementRef
  ) { }

  private getElement() {
    return this.elementRef.nativeElement as HTMLElement;
  }

  @HostListener('click', ['$event'])
  click() {
    this.onGo.emit({r: this.r, c: this.c});
  }

  go(color: Color) {
    this.isSet = true;
    this.getElement().classList.add('set', color);
  }

  unGo() {
    this.isSet = false;
    this.getElement().classList.remove('black', 'white', 'set', 'last-move');
  }

  canGo() {
    return !this.isSet;
  }

  highlight() {
    this.getElement().classList.add('last-move');
  }

  unHighlight() {
    this.getElement().classList.remove('last-move');
  }

  warn() {
    this.getElement().classList.add('warning');
  }

  unWarn() {
    this.getElement().classList.remove('warning');
  }

  blur() {
    this.getElement().classList.add('blur');
  }

  unBlur() {
    this.getElement().classList.remove('blur');
  }

  clear() {
    this.isSet = false;
    this.getElement().classList.remove('black', 'white', 'set', 'last-move', 'warning', 'blur');
  }

}
