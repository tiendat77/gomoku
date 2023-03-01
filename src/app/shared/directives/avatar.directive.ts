import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DEFAULT_AVATAR, PRIMARY_COLOR } from '@constants';

@Directive({
  selector: '[avatar]'
})
export class AvatarDirective {

  @Input() name = '';

  constructor(private elementRef: ElementRef) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  get element() {
    return this.elementRef?.nativeElement as HTMLImageElement;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  @HostListener('error')
  onError(event?: any) {
    if (this.element) {
      this.element.src = this._generate();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private _generate() {
    const name = this._getName();

    if (!name) {
      return DEFAULT_AVATAR;
    }

    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 256 256');

    const circle = document.createElementNS(svgns, 'circle');
    circle.setAttribute('cx', '128');
    circle.setAttribute('cy', '128');
    circle.setAttribute('r', '128');
    circle.setAttribute('fill', '#f5f5fa');

    const text = document.createElementNS(svgns, 'text');
    text.setAttribute('x', '128');
    text.setAttribute('y', '128');
    text.setAttribute('dy', '0');
    text.setAttribute('text-align', 'center');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'central');
    text.setAttribute('font-size', '128px');
    text.setAttribute('font-family', 'Ubuntu, sans-serif');
    text.setAttribute('fill', PRIMARY_COLOR);
    text.innerHTML = name;

    svg.appendChild(circle);
    svg.appendChild(text);
    return 'data:image/svg+xml,' + encodeURIComponent(svg.outerHTML);
  }

  private _getName(name = this.name) {
    if (!name) {
      return '';
    }

    return name.split(' ', 1)
      .map(letters => letters[0])
      .join('')
      .toUpperCase();
  }

}
