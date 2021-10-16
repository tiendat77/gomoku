import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewGameComponent } from './new-game/new-game.component';
import { GameOverAiComponent } from './game-over-ai/game-over-ai.component';
import { GameOverHumanComponent } from './game-over-human/game-over-human.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NewGameComponent,
    GameOverAiComponent,
    GameOverHumanComponent,
    SettingsComponent
  ],
  declarations: [
    NewGameComponent,
    GameOverAiComponent,
    GameOverHumanComponent,
    SettingsComponent
  ]
})
export class ModalModule { }
