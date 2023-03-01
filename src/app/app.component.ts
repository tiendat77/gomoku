import { Component } from '@angular/core';
import { MetaService } from './services/meta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly _meta: MetaService
  ) {
    this._initialize();
  }

  private _initialize() {
    this._meta.init();
  }

}
