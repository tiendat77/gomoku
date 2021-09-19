import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'gomoku-game-over-lose',
  templateUrl: './game-over-lose.component.html',
  styleUrls: ['./game-over-lose.component.scss'],
})
export class GameOverLoseComponent {

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
