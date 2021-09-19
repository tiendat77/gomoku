import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SplashScreenService } from './provider';

@Component({
  selector: 'gomoku-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splash: SplashScreenService,
  ) {
    this.initialize();
  }

  private initialize() {
    this.platform.ready().then(() => {
      this.splash.hide(0);
    });
  }

}
