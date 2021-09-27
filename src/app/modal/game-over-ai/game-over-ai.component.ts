import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'gomoku-game-over-ai',
  templateUrl: './game-over-ai.component.html',
  styleUrls: ['./game-over-ai.component.scss'],
})
export class GameOverAiComponent {

  @Input() mode;
  @Input() level;
  @Input() result = 'draw';

  constructor(
    private modalCtrl: ModalController
  ) {
    this.mode = this.getMode(this.level);
  }

  private getMode(level) {
    switch (level) {
      case 'easy':
        return 'novice';

      case 'medium':
        return 'easy';

      case 'insane':
        return 'master'

      default:
        return null;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  again() {
    this.modalCtrl.dismiss(true);
  }

}
