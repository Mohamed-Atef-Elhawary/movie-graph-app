import { Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home-component/home-component';

import { DetailsComponent } from './pages/details-component/details-component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('../app/pages/home-component/home-component').then((c) => HomeComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/details-component/details-component').then((c) => DetailsComponent),
  },
];
