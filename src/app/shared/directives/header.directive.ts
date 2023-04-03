import { Directive, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { Subject, debounceTime, fromEvent, takeUntil } from "rxjs";


@Directive({
  selector: '[header]',
})
export class HeaderDirective implements OnInit, OnDestroy {

  get element() {
    return this._element?.nativeElement as HTMLElement;
  }

  private _destroyed$ = new Subject<void>();

  constructor(private _element: ElementRef) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    fromEvent(
      document.getElementsByTagName('app-root'),
      'scroll'
    ).pipe(
      takeUntil(this._destroyed$),
      debounceTime(50)
    ).subscribe((event) => {
      this._onScroll(event);
    });
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _onScroll(event: any) {
    if (this._getScrollTop(event) > 30) {
      this.element?.setAttribute('sticky', 'true');
    } else {
      this.element?.removeAttribute('sticky');
    }
  }

  private _getScrollTop(event: any) {
    return (
      event?.target.scrollTop ||
      event?.target?.documentElement?.scrollTop ||
      0
    );
  }

}