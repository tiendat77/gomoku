import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewGameComponent } from './new-game/new-game.component';
import { GameOverWinComponent } from './game-over-win/game-over-win.component';
import { GameOverLoseComponent } from './game-over-lose/game-over-lose.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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
