import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'example'
  },
  {
    path: 'signed-in-redirect',
    pathMatch : 'full',
    redirectTo: 'example'
  },
  {
    path: 'example',
    loadChildren: () => import('./modules/example/example.module').then(m => m.ExampleModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/not-found',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
