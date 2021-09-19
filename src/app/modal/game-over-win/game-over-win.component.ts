import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'gomoku-game-over-win',
  templateUrl: './game-over-win.component.html',
  styleUrls: ['./game-over-win.component.scss'],
})
export class GameOverWinComponent {

  constructor(
    private modalCtrl: ModalController
  ) { }

  close() {
    this.modalCtrl.dismiss();
  }

  again() {
    this.modalCtrl.dismiss(true);
  }

}
