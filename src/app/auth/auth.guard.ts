import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está autenticado
  if (!authService.isAuthenticated()) {
    console.log('Usuário não autenticado, redirecionando para login...');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Verifica se o token é válido (não expirado)
  if (authService.isTokenExpired()) {
    console.log('Token expirado, redirecionando para login...');
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
    console.log('Usuário não tem permissão, redirecionando...');
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};