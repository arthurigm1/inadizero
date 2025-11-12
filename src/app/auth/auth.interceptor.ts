import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { TenantService } from '../tenant/tenant.service';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Interceptor que força logout quando detectar token inválido/expirado,
// tanto em respostas de erro (401) quanto em respostas 200 com { success: false, message: 'Token inválido ou expirado' }
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);

  const requestAuthHeader = req.headers.get('Authorization') || '';
  const userToken = authService.token || '';
  const tenantToken = localStorage.getItem('tenantToken') || '';

  const logoutByRequestToken = () => {
    // Decide qual sessão encerrar com base no token presente no header
    if (userToken && requestAuthHeader.includes(userToken)) {
      authService.logout();
      return;
    }
    if (tenantToken && requestAuthHeader.includes(tenantToken)) {
      tenantService.logout();
      return;
    }
    // Fallback: encerra sessão padrão de usuário
    authService.logout();
  };

  const hasInvalidTokenMessage = (raw: unknown): boolean => {
    const body: any = raw as any;
    const msg: unknown = body?.message ?? body?.mensagem ?? body?.error?.message ?? body?.error?.mensagem;
    if (typeof msg !== 'string') return false;
    const normalized = msg.toLowerCase();
    // Checa variações com/sem acento e termos similares
    return (
      (normalized.includes('token inválido') || normalized.includes('token invalido')) ||
      normalized.includes('token expirado') ||
      normalized.includes('expirado')
    );
  };

  const hasFalseSuccessFlag = (raw: unknown): boolean => {
    const body: any = raw as any;
    return body?.success === false || body?.sucesso === false;
  };

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body: unknown = event.body as unknown;
        // Caso sucesso=false e mensagem de token inválido/expirado
        if (hasFalseSuccessFlag(body) && hasInvalidTokenMessage(body)) {
          logoutByRequestToken();
        }
      }
    }),
    catchError((error) => {
      // 401 deve forçar logout
      if (error?.status === 401) {
        logoutByRequestToken();
      } else {
        // Algumas APIs retornam 200/4xx com corpo indicando token inválido
        const body: unknown = error?.error as unknown;
        if (hasInvalidTokenMessage(body) || (hasFalseSuccessFlag(body) && hasInvalidTokenMessage(body))) {
          logoutByRequestToken();
        }
      }
      return throwError(() => error);
    })
  );
};