import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { GameConfig } from '../../interface';

@Component({
  selector: 'gomoku-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {

  @Input() config: GameConfig;

  form: FormGroup;

  get mode() {
    return this.form.get('mode');
  }

  get color() {
    return this.form.get('color');
  }

  get level() {
    return this.form.get('level');
  }

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.form = new FormGroup({
      mode: new FormControl('hvc'),
      color: new FormControl('white'),
      level: new FormControl('medium'),
    });

    this.mode.valueChanges.subscribe((mode) => {
      if (mode === 'hvh') {
        this.level.disable();
        this.color.disable();

      } else {
        this.color.enabled
        this.level.enable();
        this.color.enable();
      }
    });

    if (this.config) {
      this.setGameConfig(this.config);
    }
  }

  private setGameConfig(config: GameConfig) {
    if (config.mode === 'hvh') {
      this.form.patchValue({mode: 'hvh'});

    } else {
      this.form.patchValue({
        mode: 'hvc',
        level: config.mode,
        color: config.color,
      });
    }
  }

  private getGameConfig() {
    const form = this.form.value;
    const config: GameConfig = {
      mode: 'medium',
      color: 'white'
    };

    if (form.mode === 'hvh') {
      config.mode = 'hvh';

    } else {
      config.mode = form.level;
      config.color = form.color;
    }

    return config;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    const config = this.getGameConfig();
    this.modalCtrl.dismiss(config);
  }

}
