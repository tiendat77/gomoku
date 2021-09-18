import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { BoardComponent } from './board/board.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    BoardComponent
  ],
  declarations: [
    BoardComponent
  ]
})
export class ComponentModule {}
