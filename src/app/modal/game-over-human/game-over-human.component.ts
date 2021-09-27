import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'gomoku-game-over-human',
  templateUrl: './game-over-human.component.html',
  styleUrls: ['./game-over-human.component.scss'],
})
export class GameOverHumanComponent {

  @Input() result = 'black';

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
