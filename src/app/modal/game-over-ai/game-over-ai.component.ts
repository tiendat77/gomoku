import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfettiService } from '../../provider';

@Component({
  selector: 'gomoku-game-over-ai',
  templateUrl: './game-over-ai.component.html',
  styleUrls: ['./game-over-ai.component.scss'],
})
export class GameOverAiComponent implements AfterViewInit {

  @Input() level;
  @Input() result = 'draw';

  constructor(
    private modalCtrl: ModalController,
    private confetti: ConfettiService,
  ) {
    this.initialize();
  }

  private initialize() {
  }

  ngAfterViewInit() {
    if (this.result === 'win') {
      this.confetti.firework();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  again() {
    this.modalCtrl.dismiss(true);
  }

}
