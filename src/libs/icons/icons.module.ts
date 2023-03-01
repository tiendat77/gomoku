import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Icon } from './icon';
import { IconRegistry } from './icon-registry';

@NgModule({
  exports: [Icon],
  declarations: [Icon],
})
export class IconsModule {
  constructor(
    private _domSanitizer: DomSanitizer,
    private _iconRegistry: IconRegistry
  ) {
    // Register icon sets
    this._iconRegistry.addSvgIconSetInNamespace('heroicons_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/svg-icons/heroicons-outline.svg'));
    this._iconRegistry.addSvgIconSetInNamespace('heroicons_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/svg-icons/heroicons-solid.svg'));
  }
}
