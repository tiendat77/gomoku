import { NgModule } from '@angular/core';
import { CommonsModule } from '@shared/modules';

import { EmptyLayoutComponent } from './empty.component';


@NgModule({
  declarations: [
    EmptyLayoutComponent,
  ],
  exports: [
    EmptyLayoutComponent
  ],
  imports: [
    CommonsModule
  ]
})
export class EmptyLayoutModule { }
