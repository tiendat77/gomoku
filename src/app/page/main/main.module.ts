import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalModule } from '../../modal/modal.module';
import { ComponentModule } from '../../component/component.module';
import { DirectiveModule } from '../../directive/directive.module';

import { MainPage } from './main.page';
import { MainPageRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalModule,
    ComponentModule,
    DirectiveModule,
    MainPageRoutingModule
  ],
  declarations: [MainPage]
})
export class MainPageModule {}
