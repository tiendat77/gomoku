import { NgModule } from '@angular/core';
import { CommonsModule } from './modules/commons.module';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  exports: [
    CommonsModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule,
  ],
})
export class SharedModule {}
