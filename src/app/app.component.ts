import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { AudioService } from './provider';
import { SplashScreenService } from './provider';

@Component({
  selector: 'gomoku-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private audio: AudioService,
    private splash: SplashScreenService,
  ) {
    this.initialize();
  }

  private initialize() {
    this.platform.ready().then(() => {
      this.splash.hide(0);
      this.prepareAudio();
    });
  }

  private prepareAudio() {
    this.audio.preload('step', 'assets/sound/step.mp3');
    this.audio.preload('win', 'assets/sound/win.mp3');
    this.audio.preload('lose', 'assets/sound/lose.wav');
    this.audio.preload('applause', 'assets/sound/applause.wav');
  }

}
