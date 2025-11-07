import { inject } from '@angular/core';
import { Router, type CanActivateFn, type CanActivateChildFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Verifica se o token é válido (não expirado)
  if (authService.isTokenExpired()) {
    authService.logout(); // Limpa o token expirado
    router.navigate(['/login'], { 
      queryParams: { 
        returnUrl: state.url,
        expired: 'true'
      }
    });
    return false;
  }

  // Verifica roles se necessário
  const requiredRole = route.data?.['role'];
  if (requiredRole && !authService.hasRole(requiredRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

// Garante que rotas filhas (como dashboards dentro do MainLayout) também sejam protegidas
export const authChildGuard: CanActivateChildFn = (route, state) => {
  return authGuard(route, state);
};