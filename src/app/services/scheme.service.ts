import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { StorageHelper } from '@shared/helpers';
import { STORAGE_KEY } from '../configs/storage.config';

@Injectable()
export class SchemeService {

  private _scheme = 'default';

  constructor(
    @Inject(DOCUMENT) private _document: any,
  ) {
    this.init();
  }

  init() {
    // Load theme that user select previously
    const scheme = StorageHelper.get<string>(STORAGE_KEY.SCHEME);

    // If exist previous theme, apply it
    if (scheme) {
      this.update(scheme);

    // If not, apply the default theme
    } else {
      this.update('default');
    }
  }

  update(value: string) {
    // Save the selected theme
    this._scheme = value;
    StorageHelper.set(STORAGE_KEY.SCHEME, value);

    document.documentElement.setAttribute('data-theme', value);

    // // Find the class name for the previously selected theme and remove it
    // this._document.body.classList.forEach((className: string) => {
    //   if ( className.startsWith('theme-') ) {
    //     this._document.body.classList.remove(className, className.split('-')[1]);
    //   }
    // });

    // // Add class name for the currently selected theme
    // this._document.body.classList.add(value);
  }

}
