import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost:3010/api/usuario'; // Ajuste para sua URL

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
    return this.http.post<LoginResponse>(`${this.apiUrl}`, userData).pipe(
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
}
