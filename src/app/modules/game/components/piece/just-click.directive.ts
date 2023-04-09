import {
  AfterViewInit, Directive, ElementRef,
  EventEmitter, HostListener, OnDestroy, Output
} from '@angular/core';

import { Subject, Subscription, fromEvent } from 'rxjs';
import { filter,  debounceTime } from 'rxjs/operators';

/**
 * @description Prevent double click, long click
 */
@Directive({
  standalone: true,
  selector: '[justClick]'
})
export class JustClickDirective implements AfterViewInit, OnDestroy {

  @Output() justClick = new EventEmitter();

  private _click$ = new Subject<MouseEvent>();
  private _startTime = 0;
  private _endTime = 0;

  private _subscriptions$ = new Subscription();

  constructor(
    private _elementRef: ElementRef
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

  ngAfterViewInit() {
    const mouseDown$ = fromEvent<MouseEvent>(this.element, 'mousedown')
      .subscribe((event) => {
        this._startTime = event.timeStamp;
      });

    const mouseUp$ = fromEvent<MouseEvent>(this.element, 'mouseup')
      .subscribe((event) => {
        this._endTime = event.timeStamp;
      });

    const touchStart$ = fromEvent<TouchEvent>(this.element, 'touchstart')
      .subscribe((event) => {
        this._startTime = event.timeStamp;
      });

    const touchEnd$ = fromEvent<TouchEvent>(this.element, 'touchend')
      .subscribe((event) => {
        this._endTime = event.timeStamp;
      });

    const click$ = this._click$.pipe(
      debounceTime(200),
      filter((event) => this._endTime - this._startTime < 200),
      filter((event) => event.type === 'click' || event.type === 'touchend'),
    ).subscribe(event => {
      this.justClick.emit(event);
      this.element.dispatchEvent(new Event('just-click'));
    });

    this._subscriptions$.add(mouseDown$);
    this._subscriptions$.add(mouseUp$);
    this._subscriptions$.add(touchStart$);
    this._subscriptions$.add(touchEnd$);
    this._subscriptions$.add(click$);
  }

  ngOnDestroy() {
    this._subscriptions$?.unsubscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this._click$.next(event);
  }

  @HostListener('dblclick', ['$event'])
  onDblClick(event: MouseEvent) {
    this._click$.next(event);
  }

}