import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/** Modal */
import { NewGameComponent } from '../../modal';

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

    // const { data } = await modal.onWillDismiss();
    // console.log(data);

    return await modal.present();
  }

  win() {

  }

  lose() {

  }

}
