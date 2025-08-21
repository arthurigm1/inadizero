import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  private apiUrl = 'http://localhost:3010/api/usuario';
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
        return throwError(() => new Error(error.error?.message || 'Erro ao fazer login'));
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

  isAuthenticated(): boolean {
    return !!localStorage.getItem('tenantToken');
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenantSubject.value;
  }
}