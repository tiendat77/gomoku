import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[greet]'
})
export class GreetDirective implements AfterViewInit {

  constructor(private _el: ElementRef) { }

  ngAfterViewInit(): void {
    if (this._el.nativeElement) {
      this._el.nativeElement.innerHTML = this.greet();
    }
  }

  greet() {
    const now = new Date().getHours();
    if (now < 12) {
      return 'Good Morning';
    }

    if (now >= 12 && now <= 17) {
      return 'Good Afternoon';
    }

    if (now >= 17 && now <= 24) {
      return 'Good Evening';
    }

    return 'Hello';
  }

}
