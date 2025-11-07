import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  name: string;
  role:
  | 'visitante'
  | 'lojista'
  | 'gerente'
  | 'proprietario'
  | 'contador'
  | 'secretaria';
  token?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  empresaId?: string;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  criadoEm?: string;
  _count?: {
    usuarios: number;
  };
}

interface EmpresasResponse {
  sucesso: boolean;
  empresas: Empresa[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = `${environment.apiBaseUrl}/api/usuario`;
  private empresaApiUrl = `${environment.apiBaseUrl}/api/empresa`;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    const user = this.currentUserValue;
    return user?.token || null;
  }
  isTokenExpired(): boolean {
    const token = this.token;
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiration;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return true; // Se há erro no token, considera expirado
    }
  }
  login(email: string, senha: string): Observable<User> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        map((response) => {
          // Armazena user e token
          const user = { ...response.user, token: response.token };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(
            () => new Error('Falha no login. Verifique suas credenciais.')
          );
        })
      );
  }

  register(userData: RegisterData): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/registro`, userData).pipe(
      map((response) => {
        const user = { ...response.user, token: response.token };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(
          () => new Error('Falha no registro. Tente novamente.')
        );
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: User['role'] | User['role'][]): boolean {
    if (!this.currentUserValue) return false;

    if (Array.isArray(role)) {
      return role.includes(this.currentUserValue.role);
    }
    return this.currentUserValue.role === role;
  }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<EmpresasResponse>(`${this.empresaApiUrl}/listar`).pipe(
      map((response) => response.empresas),
      catchError((error) => {
        console.error('Erro ao buscar empresas:', error);
        return throwError(
          () => new Error('Falha ao carregar empresas.')
        );
      })
    );
  }

  // POST /redefinir-senha - Alterar senha do usuário autenticado
  changePassword(senhaAtual: string, novaSenha: string): Observable<{ sucesso: boolean; mensagem?: string } | any> {
    const token = this.token;
    if (!token) {
      return throwError(() => new Error('Usuário não autenticado.')); 
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { senhaAtual, novaSenha };

    return this.http.post<{ sucesso: boolean; mensagem?: string }>(`${this.apiUrl}/redefinir-senha`, body, { headers }).pipe(
      tap(() => {
        // Opcional: permanecer logado; se o backend retornar novo token, poderíamos atualizá-lo aqui.
      }),
      catchError((error) => {
        const msg = error?.error?.mensagem || 'Falha ao alterar a senha. Verifique os dados e tente novamente.';
        return throwError(() => new Error(msg));
      })
    );
  }
}
