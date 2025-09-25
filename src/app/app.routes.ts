import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { tenantGuard } from './tenant/tenant.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./auth/registro/registro.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
  {
    path: 'tenant/login',
    loadComponent: () =>
      import('./tenant/login/tenant-login.component').then(
        (m) => m.TenantLoginComponent
      ),
  },
  {
    path: 'tenant/portal',
    loadComponent: () =>
      import('./tenant/portal/tenant-portal.component').then(
        (m) => m.TenantPortalComponent
      ),
    canActivate: [tenantGuard],
  },
  { path: '**', redirectTo: '' },
];
