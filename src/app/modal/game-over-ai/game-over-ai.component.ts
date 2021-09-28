import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'gomoku-game-over-ai',
  templateUrl: './game-over-ai.component.html',
  styleUrls: ['./game-over-ai.component.scss'],
})
export class GameOverAiComponent {

  @Input() level;
  @Input() result = 'draw';

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
