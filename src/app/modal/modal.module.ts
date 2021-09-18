import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewGameComponent } from './new-game/new-game.component';
import { GameOverWinComponent } from './game-over-win/game-over-win.component';
import { GameOverLoseComponent } from './game-over-lose/game-over-lose.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    NewGameComponent,
    GameOverWinComponent,
    GameOverLoseComponent
  ],
  declarations: [
    NewGameComponent,
    GameOverWinComponent,
    GameOverLoseComponent
  ]
})
export class ModalModule { }
