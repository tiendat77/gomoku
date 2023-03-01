import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { ExampleComponent } from './example.component';
import { IconsModule } from '@libs/icons';
import { ExampleDialogComponent } from './example-dialog/example-dialog.component';

const routes: Route[] = [{
  path: '',
  component: ExampleComponent
}];

@NgModule({
  declarations: [
    ExampleComponent,
    ExampleDialogComponent
  ],
  imports: [
    CommonModule,
    IconsModule,
    RouterModule.forChild(routes)
  ]
})
export class ExampleModule { }
