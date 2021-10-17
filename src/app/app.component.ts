import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { environment } from './../environments/environment';

import { AudioService } from './provider';
import { ConfettiService } from './provider';
import { SettingsService } from './provider';
import { StorageService } from './provider';
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
    private confetti: ConfettiService,
    private settings: SettingsService,
    private storage: StorageService,
    private splash: SplashScreenService,
  ) {
    this.platform.ready().then(() => {
      this.initialize();
    });
  }

  private initialize() {
    this.splash.hide(environment.production ? 5 : 0);
    this.confetti.create();
    this.prepareAudio();
    this.prepareSetting();
  }

  private prepareAudio() {
    this.audio.preload('step', 'assets/sound/step.mp3');
    this.audio.preload('win', 'assets/sound/win.mp3');
    this.audio.preload('lose', 'assets/sound/lose.wav');
    this.audio.preload('applause', 'assets/sound/applause.wav');
  }

  private async prepareSetting() {
    await this.storage.init();
    await this.settings.load();
  }

}
