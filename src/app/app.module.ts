import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ModalModule } from './modal/modal.module';
import { ComponentModule } from './component/component.module';
import { DirectiveModule } from './directive/directive.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({_forceStatusbarPadding: true}),
    IonicStorageModule.forRoot(),
    ModalModule,
    ComponentModule,
    DirectiveModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ]
})
export class AppModule {}
