/** Angular */
import { Component } from '@angular/core';

/** Ionic */
import { Storage } from '@ionic/storage-angular';
import { MenuController, ModalController, Platform } from '@ionic/angular';

/** Service */
import { SplashScreenService } from './provider';

/** Modal */
import { NewGameComponent } from './modal/new-game/new-game.component';

@Component({
  selector: 'gomoku-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private storage: Storage,
    private platform: Platform,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,

    private splash: SplashScreenService,
  ) {
    this.initialize();
  }

  private initialize() {
    this.platform.ready().then(() => {
      this.splash.hide(0);
    });
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: NewGameComponent,
      cssClass: 'overlay-modal'
    });

    // const { data } = await modal.onWillDismiss();
    // console.log(data);

    return await modal.present();
  }

  win() {

  }

  lose() {

  }

}
