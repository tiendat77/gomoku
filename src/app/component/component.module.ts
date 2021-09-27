import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { GoComponent } from './go/go.component';
import { GameComponent } from './game/game.component';
import { BoardComponent } from './board/board.component';
import { PlacesComponent } from './places/places.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    GoComponent,
    GameComponent,
    BoardComponent,
    PlacesComponent,
  ],
  declarations: [
    GoComponent,
    GameComponent,
    BoardComponent,
    PlacesComponent,
  ]
})
export class ComponentModule {}
