import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'nova-forma', pathMatch: 'full' },
  { 
    path: 'nova-forma', 
    loadComponent: () => import('./components/car-form/car-form.component').then(m => m.CarFormComponent) 
  },
  { 
    path: 'istorija', 
    loadComponent: () => import('./components/car-history/car-history.component').then(m => m.CarHistoryComponent) 
  }
];