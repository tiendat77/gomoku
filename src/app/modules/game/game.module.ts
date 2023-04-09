import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { NgxPanZoomModule } from '@libs/panzoom';

import { GameComponent } from './game.component';
import { BoardComponent } from './components';
import { PieceComponent } from './components';
import { SetUpDialogComponent } from './dialogs';
import { GameOverDialogComponent } from './dialogs';

const routes: Route[] = [{
  path: '',
  component: GameComponent
}];

@NgModule({
  declarations: [
    /** Components */
    GameComponent,
    BoardComponent,
    PieceComponent,
    /** Dialogs */
    SetUpDialogComponent,
    GameOverDialogComponent,
  ],
  imports: [
    SharedModule,
    NgxPanZoomModule,
    RouterModule.forChild(routes)
  ]
})
export class GameModule { }
