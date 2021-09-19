import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/** Modal */
import { NewGameComponent } from '../../modal';
import { GameOverWinComponent } from '../../modal';
import { GameOverLoseComponent } from '../../modal';

@Component({
  selector: 'gomoku-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: NewGameComponent,
      cssClass: 'overlay-modal'
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      console.log(data);
    });

    return await modal.present();
  }

  async win() {
    const modal = await this.modalCtrl.create({
      component: GameOverWinComponent,
      cssClass: 'overlay-modal'
    });

    return await modal.present();
  }

  async lose() {
    const modal = await this.modalCtrl.create({
      component: GameOverLoseComponent,
      cssClass: 'overlay-modal'
    });

    return await modal.present();
  }

}
