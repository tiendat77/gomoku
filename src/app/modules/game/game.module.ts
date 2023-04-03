import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { NgxPanZoomModule } from '@libs/panzoom';

import { GameComponent } from './game.component';
import { BoardComponent } from './components';
import { PieceComponent } from './components';

const routes: Route[] = [{
  path: '',
  component: GameComponent
}];

@NgModule({
  declarations: [
    GameComponent,
    BoardComponent,
    PieceComponent,
  ],
  imports: [
    SharedModule,
    NgxPanZoomModule,
    RouterModule.forChild(routes)
  ]
})
export class GameModule { }
