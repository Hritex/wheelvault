import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'WheelVault — Every car on Indian roads, decoded',
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./pages/brand-list/brand-list.component').then((m) => m.BrandListComponent),
    title: 'Brands — WheelVault',
  },
  {
    path: 'brands/:brandSlug',
    loadComponent: () =>
      import('./pages/brand-detail/brand-detail.component').then((m) => m.BrandDetailComponent),
    title: 'WheelVault',
  },
  {
    path: 'brands/:brandSlug/:modelSlug',
    loadComponent: () =>
      import('./pages/car-detail/car-detail.component').then((m) => m.CarDetailComponent),
    title: 'WheelVault',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not found — WheelVault',
  },
];
