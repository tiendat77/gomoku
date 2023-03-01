import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({providedIn: 'root'})
export class LoaderService {

  constructor(
    @Inject(DOCUMENT) private _document: any
  ) {}

  show() {
    this._document?.body?.classList?.add('loader-show');
  }

  hide() {
    this._document?.body?.classList?.remove('loader-show');
  }

}
