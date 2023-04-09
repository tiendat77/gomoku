import { Injectable } from '@angular/core';
import { NativeAudio } from '@libs/audio';

@Injectable({providedIn: 'root'})
export class AudioService {

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.preload('step', 'step.mp3');
    this.preload('win', 'win.mp3');
    this.preload('lose', 'lose.wav');
    this.preload('applause', 'applause.wav');
  }

  preload(key: string, location: string): Promise<void> {
    return NativeAudio.preload({
      assetId: key,
      assetPath: location
    });
  }

  play(sound: 'step' | 'win' | 'lose' | 'applause') {
    NativeAudio.play({assetId: sound});
  }

}
