import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastCtrl: ToastController
  ) { }

  async show(message: string, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
    });

    return toast.present();
  }
}
