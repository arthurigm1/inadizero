import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Verificar se o usuário tem a role necessária para acessar a rota
    const requiredRole = route.data['role'];
    if (requiredRole && !authService.hasRole(requiredRole)) {
      router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  return false;
};