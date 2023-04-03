import { NgModule } from '@angular/core';
import { CommonsModule } from './modules/commons.module';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
import { IconsModule } from '@libs/icons';

@NgModule({
  exports: [
    CommonsModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    IconsModule,
  ],
})
export class SharedModule {}
