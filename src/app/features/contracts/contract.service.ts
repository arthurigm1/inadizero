import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Contract,
  CreateContractRequest,
  UpdateContractRequest,
  RescindContractRequest,
  ContractRenewRequest,
  ContractFilters,
  ContractListResponse,
  ExpiringContractsRequest,
  UpdateExpiredStatusResponse,
  ContractStats,
  StoreOption,
  TenantOption
} from './contract.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = 'http://localhost:3000/api/contrato';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // POST /criar - Criar novo contrato
  createContract(contract: CreateContractRequest): Observable<Contract> {
    const headers = this.getAuthHeaders();
    return this.http.post<Contract>(`${this.apiUrl}/criar`, contract, { headers });
  }

  // GET /empresa - Listar contratos da empresa
  getCompanyContracts(filters?: ContractFilters): Observable<ContractListResponse> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.ativo !== undefined) params = params.set('ativo', filters.ativo.toString());
      if (filters.lojaId) params = params.set('lojaId', filters.lojaId);
      if (filters.inquilinoId) params = params.set('inquilinoId', filters.inquilinoId);
      if (filters.dataInicioMin) params = params.set('dataInicioMin', filters.dataInicioMin);
      if (filters.dataInicioMax) params = params.set('dataInicioMax', filters.dataInicioMax);
      if (filters.dataFimMin) params = params.set('dataFimMin', filters.dataFimMin);
      if (filters.dataFimMax) params = params.set('dataFimMax', filters.dataFimMax);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<ContractListResponse>(`${this.apiUrl}/empresa`, { headers, params });
  }

  // GET /id/:id - Buscar contrato por ID
  getContractById(id: string): Observable<Contract> {
    const headers = this.getAuthHeaders();
    return this.http.get<Contract>(`${this.apiUrl}/id/${id}`, { headers });
  }

  // PUT /atualizar/:id - Atualizar contrato
  updateContract(id: string, contract: UpdateContractRequest): Observable<Contract> {
    const headers = this.getAuthHeaders();
    return this.http.put<Contract>(`${this.apiUrl}/atualizar/${id}`, contract, { headers });
  }

  // DELETE /deletar/:id - Deletar contrato
  deleteContract(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`, { headers });
  }

  // PATCH /rescindir/:id - Rescindir contrato
  rescindContract(id: string, data: RescindContractRequest): Observable<Contract> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Contract>(`${this.apiUrl}/rescindir/${id}`, data, { headers });
  }

  // PATCH /renovar/:id - Renovar contrato
  renewContract(id: string, data: ContractRenewRequest): Observable<Contract> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Contract>(`${this.apiUrl}/renovar/${id}`, data, { headers });
  }

  // Relatórios
  getExpiringContracts(request: ExpiringContractsRequest): Observable<Contract[]> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('dias', request.dias.toString());
    return this.http.get<Contract[]>(`${this.apiUrl}/vencendo`, { headers, params });
  }

  getExpiredContracts(): Observable<Contract[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Contract[]>(`${this.apiUrl}/vencidos`, { headers });
  }

  updateExpiredContractsStatus(): Observable<UpdateExpiredStatusResponse> {
    const headers = this.getAuthHeaders();
    return this.http.patch<UpdateExpiredStatusResponse>(`${this.apiUrl}/atualizar-status-vencidos`, {}, { headers });
  }

  // Métodos auxiliares para obter dados para selects
  getStores(): Observable<StoreOption[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<StoreOption[]>('http://localhost:3000/api/loja/empresa', { headers });
  }

  getTenants(): Observable<TenantOption[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TenantOption[]>('http://localhost:3000/api/inquilino/empresa', { headers });
  }

  // Método para obter estatísticas dos contratos
  getContractStats(): Observable<ContractStats> {
    const headers = this.getAuthHeaders();
    return this.http.get<ContractStats>(`${this.apiUrl}/stats`, { headers });
  }
}