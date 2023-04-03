import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'game'
  },
  {
    path: 'signed-in-redirect',
    pathMatch : 'full',
    redirectTo: 'game'
  },
  {
    path: 'game',
    loadChildren: () => import('./modules/game/game.module').then(m => m.GameModule)
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
