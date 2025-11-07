import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IPortalInquilinoData } from './tenant.interfaces';
import { environment } from '../../environments/environment';

export interface Tenant {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  endereco?: string;
  imovel?: {
    id: string;
    endereco: string;
    tipo: string;
    valorAluguel: number;
  };
  contrato?: {
    id: string;
    dataInicio: string;
    dataFim: string;
    valorAluguel: number;
    status: string;
  };
  token?: string;
}

export interface TenantLoginData {
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private apiUrl = `${environment.apiBaseUrl}/api/usuario`;
  private notificationApiUrl = `${environment.apiBaseUrl}/api/notificacao`;
  private currentTenantSubject = new BehaviorSubject<Tenant | null>(null);
  public currentTenant$ = this.currentTenantSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Verificar se há um inquilino logado no localStorage
    const storedTenant = localStorage.getItem('currentTenant');
    if (storedTenant) {
      this.currentTenantSubject.next(JSON.parse(storedTenant));
    }
  }

  login(loginData: TenantLoginData): Observable<Tenant> {
    return this.http.post<any>(`${this.apiUrl}/login-inquilino`, loginData).pipe(
      map((response) => {
        const tenant = response.inquilino || response;

        // Detecta estados de desativação mesmo em respostas 200
        const isDeactivated =
          response?.desativado === true ||
          response?.code === 'USER_DEACTIVATED' ||
          response?.motivo === 'DESATIVADO' ||
          (tenant?.status && typeof tenant.status === 'string' &&
            ['DESATIVADO', 'INATIVO'].includes(tenant.status.toUpperCase()));

        if (isDeactivated) {
          // Lança um erro estruturado com a mensagem no topo para o componente exibir
          throw {
            message: 'Usuário desativado. Contate o administrador.',
            error: {
              desativado: true,
              code: 'USER_DEACTIVATED',
              motivo: 'DESATIVADO',
              message: 'Usuário desativado. Contate o administrador.'
            }
          };
        }

        if (tenant && response.token) {
          tenant.token = response.token;
          localStorage.setItem('currentTenant', JSON.stringify(tenant));
          localStorage.setItem('tenantToken', response.token);
          this.currentTenantSubject.next(tenant);
        }
        return tenant;
      }),
      catchError((error) => {
        console.error('Erro no login do inquilino:', error);
        // Mantém erro do fluxo interno que marca usuário desativado
        if (error?.error?.desativado === true) {
          return throwError(() => error);
        }
        // Mapeia 403 para erro personalizado de usuário desativado
        if (error?.status === 403) {
          const deactivatedError = {
            message: 'Usuário desativado. Contate o administrador.',
            error: {
              desativado: true,
              code: 'USER_DEACTIVATED',
              motivo: 'DESATIVADO',
              message: 'Usuário desativado. Contate o administrador.'
            },
            status: 403
          };
          return throwError(() => deactivatedError);
        }
        // Qualquer outro erro vira erro de validação de dados
        const validationError = {
          message: 'Erro na validação de dados',
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Erro na validação de dados'
          },
          status: 400
        };
        return throwError(() => validationError);
      })
    );
  }

  getTenantInfo(): Observable<Tenant> {
    const token = localStorage.getItem('tenantToken');
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
    
    return this.http.get<any>(`${this.apiUrl}/perfil`, { headers }).pipe(
      map((response: any) => {
        const tenant = response.inquilino || response;
        this.currentTenantSubject.next(tenant);
        return tenant;
      }),
      catchError((error) => {
        console.error('Erro ao buscar informações do inquilino:', error);
        return throwError(() => new Error(error.error?.message || 'Erro ao buscar informações'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentTenant');
    localStorage.removeItem('tenantToken');
    this.currentTenantSubject.next(null);
    this.router.navigate(['/tenant/login']);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        // Não é um JWT válido, assume não expirado para evitar falsos negativos
        return false;
      }
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload?.exp;
      if (!exp || typeof exp !== 'number') {
        // Sem claim exp: considere não expirado
        return false;
      }
      const now = Math.floor(Date.now() / 1000);
      return exp <= now;
    } catch {
      // Em caso de erro no parse, considerar não expirado
      return false;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('tenantToken');
    if (!token) {
      return false;
    }
    if (this.isTokenExpired(token)) {
      // Token expirado: desloga e bloqueia acesso
      this.logout();
      return false;
    }
    return true;
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenantSubject.value;
  }

  getPortalData(): Observable<IPortalInquilinoData> {
    const token = localStorage.getItem('tenantToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<{success: boolean, message: string, data: IPortalInquilinoData}>(
      `${environment.apiBaseUrl}/api/portal-inquilino/dados`,
      { headers }
    )
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Erro ao buscar dados do portal:', error);
          if (error.status === 401) {
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }

  // Marca uma notificação como lida
  markNotificationAsRead(id: string): Observable<{success: boolean, message: string}> {
    const token = localStorage.getItem('tenantToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.patch<{success: boolean, message: string}>(`${this.notificationApiUrl}/marcar-lida/${id}`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao marcar notificação como lida:', error);
        return throwError(() => error);
      })
    );
  }

  // Marca todas as notificações como lidas
  markAllNotificationsAsRead(): Observable<{success: boolean, message: string, updatedCount?: number}> {
    const token = localStorage.getItem('tenantToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.patch<{success: boolean, message: string, updatedCount?: number}>(`${this.notificationApiUrl}/marcar-todas-lidas`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao marcar todas notificações como lidas:', error);
        return throwError(() => error);
      })
    );
  }
}