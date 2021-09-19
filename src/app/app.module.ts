import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot({_forceStatusbarPadding: true}),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ]
})
export class AppModule {}
