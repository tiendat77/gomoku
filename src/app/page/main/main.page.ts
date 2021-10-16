import { Component } from '@angular/core';
import { SettingsService } from 'src/app/provider';
import { GameService } from '../../provider/game.service';

@Component({
  selector: 'gomoku-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  constructor(
    public control: GameService,
    public settings: SettingsService,
  ) { }

  go() {
    this.control.start();
  }

  setting() {
    this.settings.open();
  }

}
