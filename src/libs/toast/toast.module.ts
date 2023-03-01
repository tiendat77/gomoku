import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotToastModule } from '@ngneat/hot-toast';
import { IconsModule } from '@libs/icons';

import { ToastService } from './toast.service';
import { ToastPanelComponent } from './toast-panel/toast-panel.component';

@NgModule({
  declarations: [
    ToastPanelComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
    HotToastModule.forRoot(),
  ],
  exports: [
    HotToastModule
  ],
  providers: [
    ToastService
  ]
})
export class ToastModule { }
