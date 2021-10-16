import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../../provider';

@Component({
  selector: 'gomoku-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {

  constructor(
    public settings: SettingsService,
    public modalController: ModalController
  ) { }

  close() {
    this.modalController.dismiss();
  }

}
