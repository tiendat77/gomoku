import { NgModule } from '@angular/core';
import { CommonsModule } from '@shared/modules';

/* Components */
import { RequestErrorComponent } from './request-error/request-error.component';

const COMPONENTS: any[] = [
  RequestErrorComponent,
];

@NgModule({
  imports: [
    CommonsModule,
  ],
  exports: [
    ...COMPONENTS,
  ],
  declarations: COMPONENTS,
})
export class ComponentsModule { }
