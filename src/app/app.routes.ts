import { Routes } from '@angular/router';
import { Weather } from './pages/weather';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'weather',
    pathMatch: 'full',
  },
  {
    path: 'weather',
    component: Weather,
  },
];
