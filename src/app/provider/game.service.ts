import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { GameConfig, Color } from '../interface';

import { GameComponent } from '../component';
import { NewGameComponent } from '../modal';
import { GameOverAiComponent } from '../modal';
import { GameOverHumanComponent } from '../modal';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  color: string;
  message: string;

  config: GameConfig = {
    mode: 'medium',
    color: 'white',
  };

  static game: GameComponent;
  static instance: GameService;

  constructor(
    private modalCtrl: ModalController
  ) {
    GameService.instance = this;
  }

  init(game) {
    GameService.game = game;
  }

  start() {
    GameService.game.create(this.config.mode, this.config.color);
    GameService.game.start();
  }

  undo() {
    GameService.game.regret();
  }

  turn(color: Color, message: string) {
    this.color = color;
    this.message = message;
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: NewGameComponent,
      cssClass: 'overlay-modal',
      componentProps: {
        config: this.config
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      this.config = data;
      this.start();
    });

    return await modal.present();
  }

  /**
   * @param result: win | lose | draw | black | white
   * @param level: easy | medium | master
   */
  async over(result) {
    const human = this.config.mode === 'hvh';
    const level = !human ? this._getLevel(this.config.mode) : null;

    const modal = await this.modalCtrl.create({
      component: human ? GameOverHumanComponent : GameOverAiComponent,
      cssClass: 'overlay-modal',
      componentProps: { level, result }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      this.start();
    });

    return await modal.present();
  }

  private _getLevel(mode) {
    switch (mode) {
      case 'easy':
        return 'novice';

      case 'medium':
        return 'easy';

      case 'master':
        return 'insane';

      default:
        return null;
    }
  }

}
