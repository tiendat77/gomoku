import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPage } from './about.page';
import { AboutPageRoutingModule } from './about-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutPageRoutingModule
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {}
