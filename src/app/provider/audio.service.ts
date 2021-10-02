import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

interface Sounds {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private isNative = false;
  private sounds: Sounds = {};
  private player: HTMLAudioElement = new Audio();

  constructor(
    private audio: NativeAudio,
    private platform: Platform,
  ) {
    this.initialize();
  }

  private initialize() {
    this.platform.ready().then(() => {
      /**
       * To fix error:
       *  Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
       */
      this.player.muted = false;
      this.player.autoplay = true;

      if (this.platform.is('hybrid')) {
        this.isNative = true;
      }
    });
  }

  preload(key: string, location: string) {
    this.sounds[key] = location;

    if (this.isNative) {
      return this.audio.preloadSimple(key, location);
    }

    return Promise.resolve(key);
  }

  play(key: string) {
    const location = this.sounds[key];

    if (!location) {
      return;
    }

    if (this.isNative) {
      this.audio.play(key);

    } else {
      this.player.src = location;
      this.player.load();
      this.player.play();
    }
  }

}
