import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

import { FaturaResponse } from '../../interfaces/invoice.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiBaseUrl}/api/fatura`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.token;
    
    if (!token) {
      console.warn('Token de autenticação não encontrado');
      // Pode redirecionar para login ou lidar com a falta de token de outra forma
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleAuthError(): Observable<never> {
    // Redirecionar para login ou lidar com autenticação
    this.authService.logout();
    return throwError(() => new Error('Autenticação necessária'));
  }

  getFaturas(page: number = 1, limit: number = 10): Observable<FaturaResponse> {
    const token = this.authService.token;
    if (!token) {
      return this.handleAuthError();
    }

    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<FaturaResponse>(this.apiUrl, { 
      headers, 
      params
    }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar faturas:', error);
        if (error.status === 401) {
          return this.handleAuthError();
        }
        throw error;
      })
    );
  }

  getFaturaById(id: string): Observable<any> {
    const token = this.authService.token;
    if (!token) {
      return this.handleAuthError();
    }

    const headers = this.getAuthHeaders();
    
    return this.http.get<any>(`${this.apiUrl}/${id}`, { 
      headers
    }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar fatura:', error);
        if (error.status === 401) {
          return this.handleAuthError();
        }
        throw error;
      })
    );
  }

  getFaturaDetalhes(id: string): Observable<any> {
    const token = this.authService.token;
    if (!token) {
      return this.handleAuthError();
    }

    const headers = this.getAuthHeaders();

    return this.http.get<any>(`${this.apiUrl}/detalhes/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar detalhes da fatura:', error);
        if (error.status === 401) {
          return this.handleAuthError();
        }
        throw error;
      })
    );
  }

  // POST /fatura/:id/enviar-email - Envia a fatura por email ao inquilino (PIX/Boleto)
  enviarFaturaPorEmail(id: string): Observable<any> {
    const token = this.authService.token;
    if (!token) {
      return this.handleAuthError();
    }

    const headers = this.getAuthHeaders();

    return this.http.post<any>(`${this.apiUrl}/${id}/enviar-email`, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao enviar fatura por email:', error);
        if (error.status === 401) {
          return this.handleAuthError();
        }
        throw error;
      })
    );
  }
}