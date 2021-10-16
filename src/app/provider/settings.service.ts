import { Injectable } from '@angular/core';
import { ActionSheetController, ModalController, Platform } from '@ionic/angular';

import { SettingsComponent } from '../modal';
import { StorageService } from './storage.service';

const SETTINGS = {
  SOUND: 'SETTING_SOUND',
  TIMER: 'SETTING_TIMER',
  THEME: 'SETTING_THEME',
  LANGUAGE: 'SETTING_LANGUAGE',
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private isNative = false;

  sound = true;
  timer = true;
  theme = 'gobang';
  language = 'en';

  constructor(
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private platform: Platform,
    private storage: StorageService,
  ) {
    this._init();
  }

  private _init() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        this.isNative = true;
      }
    });
  }

  async load() {
    const sound = !!(await this.storage.get(SETTINGS.SOUND));
    const timer = !!(await this.storage.get(SETTINGS.TIMER));
    console.log(!!sound);
  }

  open() {
    if (this.isNative) {
      return this.openActionSheet();
    }

    return this.openModal();
  }

  private async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Settings',
      mode: 'ios',
      buttons: [
        {
          text: 'Sound',
          handler: () => {
            console.log('sound');
          }
        },
        {
          text: 'Warning',
          handler: () => {
            console.log('wn');
          }
        },
        {
          text: 'Theme',
          handler: () => {
            console.log('theme');
          }
        }
      ]
    });

    await actionSheet.present();
  }

  private async openModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      cssClass: 'overlay-modal',
    });

    return await modal.present();
  }

  toggleSound() {
    this.sound = !this.sound;
    this.storage.set(SETTINGS.SOUND, this.sound);
  }

  toggleTimer() {
    this.timer = !this.timer;
    this.storage.set(SETTINGS.TIMER, this.timer);
  }

}
