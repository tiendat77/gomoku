import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastPanelComponent } from './toast-panel/toast-panel.component';

export type ToastType = 'basic' | 'info' | 'success' | 'error' | 'warning';

@Injectable({providedIn: 'root'})
export class ToastService {

  constructor(private _toast: HotToastService) {}

  toast(message: string, type: ToastType) {
    switch(type) {
      case 'info':
        return this._toast.info(message);

      case 'success':
        return this._toast.success(message);

      case 'error':
        return this._toast.error(message);

      case 'warning':
        return this._toast.warning(message);

      default:
        return this._toast.info(message);
    }
  }

  info(message: string) {
    return this._toast.show(ToastPanelComponent, {
      className: 'hot-toast-notification-panel',
      position: 'top-right',
      data: {
        message,
        title: '',
        type: 'info',
      },
    });
  }

  success(message: string) {
    return this._toast.show(ToastPanelComponent, {
      className: 'hot-toast-notification-panel',
      position: 'top-right',
      data: {
        message,
        title: '',
        type: 'success',
      },
    });
  }

  error(message: string) {
    return this._toast.show(ToastPanelComponent, {
      className: 'hot-toast-notification-panel',
      position: 'top-right',
      data: {
        message,
        title: '',
        type: 'error',
      },
    });
  }

  warning(message: string) {
    return this._toast.show(ToastPanelComponent, {
      className: 'hot-toast-notification-panel',
      position: 'top-right',
      data: {
        message,
        title: '',
        type: 'warning',
      },
    });
  }

  show(message: string, title = '', type: ToastType = 'basic', options?: any) {
    return this._toast.show(ToastPanelComponent, {
      className: 'hot-toast-notification-panel',
      position: 'top-right',
      data: {
        message,
        title,
        type,
      },
    });
  }

}
