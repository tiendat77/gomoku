import { Injectable } from '@angular/core';
import { ToastService, ToastType } from '@libs/toast';

@Injectable()
export class NotificationService {

  constructor(private _toast: ToastService) {}

  toast(message: string, type: ToastType) {
    return this._toast.toast(message, type);
  }

  info(message: string) {
    return this._toast.show(message);
  }

  success(message: string) {
    return this._toast.success(message);
  }

  error(message: string) {
    return this._toast.error(message);
  }

  warning(message: string) {
    return this._toast.warning(message);
  }

  show(message: string, title = '', type: ToastType = 'basic') {
    return this._toast.show(message, title, type);
  }

}