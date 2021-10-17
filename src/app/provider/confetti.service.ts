import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

const confetti = require('canvas-confetti');

const defaults = { startVelocity: 30, spread: 360, ticks: 60 };

@Injectable({providedIn: 'root'})
export class ConfettiService {

  private _confetti;

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument
  ) { }

  create() {
    const canvas = this.document.getElementById('confetti');

    this._confetti = confetti.create(canvas, {
      resize: true,
      useWorker: true
    });
  }

  firework(duration = 5000) {
    const endTime = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = endTime - Date.now();

      if (timeLeft < 0) {
        return clearInterval(interval);
      }

      const particleCount = 60 * (timeLeft / duration);

      this._confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      this._confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }

}