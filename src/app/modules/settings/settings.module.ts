import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { SettingsComponent } from './settings.component';
import { AppInfoDialogComponent } from './dialogs';
import { PrivacyDialogComponent } from './dialogs';


@NgModule({
  declarations: [
    /** Components */
    SettingsComponent,
    /** Dialogs */
    AppInfoDialogComponent,
    PrivacyDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: SettingsComponent
    }])
  ]
})
export class SettingsModule { }
