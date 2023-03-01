import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberOnlyDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    if (event?.data === 'e' || event?.data === '-') {
      event.stopPropagation();
    }

    const initalValue = '' + this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');

    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
