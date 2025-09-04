import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

export interface Store {
  id: string;
  nome: string;
  numero: string;
  localizacao: string;
  status: 'VAGA' | 'OCUPADA' | 'MANUTENCAO';
  empresaId: string;
  criadoEm: string;
  contratos: any[];
}

export interface CreateStoreData {
  nome: string;
  numero: string;
  localizacao: string;
}

export interface UpdateStoreData {
  nome?: string;
  numero?: string;
  localizacao?: string;
  status?: string;
  inquilinoId?: string | null;
  vincularInquilino?: {
    inquilinoId: string | null;
  };
}

export interface Tenant {
  id: string;
  nome: string;
  email: string;
  cpf?: string | null;
  telefone?: string | null;
}

export interface TenantsResponse {
  sucesso: boolean;
  inquilinos: Tenant[];
}

export interface StoreResponse {
  sucesso: boolean;
  lojas: Store[];
  paginacao?: {
    paginaAtual: number;
    totalPaginas: number;
    totalLojas: number;
    limitePorPagina: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = 'http://localhost:3010/api/loja/empresa';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getStores(params?: PaginationParams): Observable<StoreResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Token de acesso não encontrado. Faça login novamente.'));
    }

    let url = this.apiUrl;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (queryParams.toString()) {
        url += '?' + queryParams.toString();
      }
    }

    return this.http.get<StoreResponse>(url, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar lojas:', error);
          let errorMessage = 'Erro ao carregar as lojas. Tente novamente.';
          
          if (error.status === 401) {
            errorMessage = 'Sessão expirada. Faça login novamente.';
          } else if (error.status === 403) {
            errorMessage = 'Você não tem permissão para acessar essas informações.';
          } else if (error.status === 0) {
            errorMessage = 'Erro de conexão. Verifique sua internet.';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  createStore(storeData: CreateStoreData): Observable<Store> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Token de acesso não encontrado. Faça login novamente.'));
    }

    const createUrl = 'http://localhost:3010/api/loja/criar';
    
    return this.http.post<any>(createUrl, storeData, { headers })
      .pipe(
        map(response => response.loja || response),
        catchError(error => {
          console.error('Erro ao criar loja:', error);
          let errorMessage = 'Erro ao criar a loja. Tente novamente.';
          
          if (error.status === 401) {
            errorMessage = 'Sessão expirada. Faça login novamente.';
          } else if (error.status === 403) {
            errorMessage = 'Você não tem permissão para criar lojas.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Dados inválidos. Verifique os campos.';
          } else if (error.status === 0) {
            errorMessage = 'Erro de conexão. Verifique sua internet.';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updateStore(storeId: string, storeData: UpdateStoreData): Observable<Store> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Token de acesso não encontrado. Faça login novamente.'));
    }

    const updateUrl = `http://localhost:3010/api/loja/editar/${storeId}`;
    
    return this.http.put<any>(updateUrl, storeData, { headers })
      .pipe(
        map(response => response.loja || response),
        catchError(error => {
          console.error('Erro ao editar loja:', error);
          let errorMessage = 'Erro ao editar a loja. Tente novamente.';
          
          if (error.status === 401) {
            errorMessage = 'Sessão expirada. Faça login novamente.';
          } else if (error.status === 403) {
            errorMessage = 'Você não tem permissão para editar lojas.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Dados inválidos. Verifique os campos.';
          } else if (error.status === 404) {
            errorMessage = 'Loja não encontrada.';
          } else if (error.status === 0) {
            errorMessage = 'Erro de conexão. Verifique sua internet.';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getTenants(): Observable<Tenant[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Token de acesso não encontrado. Faça login novamente.'));
    }

    return this.http.get<TenantsResponse>('http://localhost:3010/api/usuario/inquilinos', { headers }).pipe(
      map(response => response.inquilinos),
      catchError(error => {
        let errorMessage = 'Erro ao buscar inquilinos';
        
        if (error.status === 500) {
          errorMessage = 'Erro interno do servidor';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.authService.token;
    if (!token) {
      return null;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}