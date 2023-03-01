import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonsModule } from '@shared/modules';

/** Modules */
import { AuthModule } from './auth/auth.module';
import { LayoutsModule } from './layouts/layouts.module';
import { TranslateModule } from './translate/translate.module';

@NgModule({
  imports: [
    CommonsModule,
    AuthModule,
    LayoutsModule,
    TranslateModule,
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule?: CoreModule,
  ) {
    // Do not allow multiple injections
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. Import this module in the AppModule only.'
      );
    }
  }
}
