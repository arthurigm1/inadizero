import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { TenantService } from './tenant.service';

export const tenantGuard: CanActivateFn = (route, state) => {
  const tenantService = inject(TenantService);
  // Se autenticado e token válido, permite navegação
  if (tenantService.isAuthenticated()) {
    return true;
  }
  // Caso contrário, garante limpeza de sessão e redireciona pelo próprio serviço
  tenantService.logout();
  return false;
};