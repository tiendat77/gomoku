import { NgModule } from '@angular/core';

/** Layouts */
import { EmptyLayoutModule } from './empty/empty.module';

export const LAYOUTS: any[] = [
  EmptyLayoutModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...LAYOUTS
  ],
  exports: [
    ...LAYOUTS
  ],
})
export class LayoutsModule { }
