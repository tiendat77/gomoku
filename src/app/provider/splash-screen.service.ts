import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument
  ) { }

  show() {
    const element = this.document.getElementById('splash-screen');
    element.classList.remove('hidden');
  }

  hide(timeout = 5) {
    setTimeout(() => {
      const element = this.document.getElementById('splash-screen');
      element.classList.add('hidden');
    }, timeout * 1000);
  }

}
