import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'gomoku-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    const config = {
      vs: 'human',
      level: 'easy',
      playas: 'white',
    };

    this.modalCtrl.dismiss(config);
  }

}
