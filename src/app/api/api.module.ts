import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@core/auth/auth.interceptor';

import { ApiService } from './api.service';
import { ExampleService } from './resources/example.service';

const SERVICES = [
  ApiService,
  ExampleService,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ...SERVICES,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
})
export class ApiModule {
  constructor(
    private readonly _api: ApiService
  ) {}
}
