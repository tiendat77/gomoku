import { Component } from '@angular/core';
import { GameService } from '../../provider/game.service';

@Component({
  selector: 'gomoku-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  constructor(public control: GameService) { }

  go() {
    this.control.start();
  }

}
