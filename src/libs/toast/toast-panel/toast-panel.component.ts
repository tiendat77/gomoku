import { Component, Inject, Optional } from '@angular/core';
import { HotToastRef } from '@ngneat/hot-toast';

export interface ToastDataModel {
  title?: string;
  message?: string;
  type?: 'basic' | 'info' | 'success' | 'error' | 'warning';
}

@Component({
  selector: 'hot-toast-notification-panel',
  templateUrl: './toast-panel.component.html'
})
export class ToastPanelComponent {

  constructor(
    @Optional()
    @Inject(HotToastRef)
    public toastRef: HotToastRef<ToastDataModel>
  ) {}

  close() {
    this.toastRef?.close({ dismissedByAction: true });
  }

}
