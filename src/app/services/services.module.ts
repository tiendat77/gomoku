import { NgModule } from '@angular/core';

// Services
import { LoaderService } from './loader.service';
import { MetaService } from './meta.service';
import { NotificationService } from './notification.service';
import { PlatformService } from './platform.service';
import { PreferencesService } from './preferences.service';
import { SchemeService } from './scheme.service';
import { SplashScreenService } from './splash-screen.service';
import { UserService } from './user.service';

@NgModule({
  providers: [
    LoaderService,
    MetaService,
    NotificationService,
    PlatformService,
    PreferencesService,
    SchemeService,
    SplashScreenService,
    UserService,
  ],
})
export class ServicesModule {
  constructor(
    private _loader: LoaderService,
    private _meta: MetaService,
    private _notification: NotificationService,
    private _platform: PlatformService,
    private _preferences: PreferencesService,
    private _scheme: SchemeService,
    private _splash: SplashScreenService,
    private _user: UserService,
  ) {}
}
