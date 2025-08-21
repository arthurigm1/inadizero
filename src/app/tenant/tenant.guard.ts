import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { TenantService } from './tenant.service';

export const tenantGuard: CanActivateFn = (route, state) => {
  const tenantService = inject(TenantService);
  const router = inject(Router);

  if (tenantService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/tenant/login'], { queryParams: { returnUrl: state.url }});
  return false;
};