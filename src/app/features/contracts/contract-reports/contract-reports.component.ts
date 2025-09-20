import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContractService } from '../contract.service';
import { Contract, ExpiringContractsRequest } from '../contract.interfaces';

@Component({
  selector: 'app-contract-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex items-center mb-6">
        <button 
          routerLink="/contracts/list"
          class="mr-4 text-gray-600 hover:text-gray-900">
          ← Voltar
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Relatórios de Contratos</h1>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              (click)="activeTab = 'expiring'"
              [class]="activeTab === 'expiring' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
              Contratos Vencendo
            </button>
            <button
              (click)="activeTab = 'expired'; loadExpiredContracts()"
              [class]="activeTab === 'expired' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
              Contratos Vencidos
            </button>
          </nav>
        </div>
      </div>

      <!-- Contratos Vencendo -->
      <div *ngIf="activeTab === 'expiring'" class="space-y-6">
        <!-- Filtro de Dias -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtrar por Período</h3>
          <form [formGroup]="expiringForm" (ngSubmit)="loadExpiringContracts()" class="flex items-end space-x-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contratos vencendo em quantos dias?
              </label>
              <input 
                type="number" 
                formControlName="dias"
                min="1"
                max="365"
                placeholder="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="expiringForm.get('dias')?.invalid && expiringForm.get('dias')?.touched">
              <div *ngIf="expiringForm.get('dias')?.invalid && expiringForm.get('dias')?.touched" 
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="expiringForm.get('dias')?.errors?.['required']">Número de dias é obrigatório</span>
                <span *ngIf="expiringForm.get('dias')?.errors?.['min']">Mínimo de 1 dia</span>
                <span *ngIf="expiringForm.get('dias')?.errors?.['max']">Máximo de 365 dias</span>
              </div>
            </div>
            <button 
              type="submit"
              [disabled]="expiringForm.invalid || loadingExpiring"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="loadingExpiring" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </span>
              <span *ngIf="!loadingExpiring">Buscar</span>
            </button>
          </form>
        </div>

        <!-- Resultados Contratos Vencendo -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                Contratos Vencendo
                <span *ngIf="expiringContracts.length > 0" class="ml-2 text-sm font-normal text-gray-500">
                  ({{ expiringContracts.length }} encontrado{{ expiringContracts.length !== 1 ? 's' : '' }})
                </span>
              </h3>
              <button 
                *ngIf="expiringContracts.length > 0"
                (click)="exportExpiringContracts()"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Exportar
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loadingExpiring" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loadingExpiring && expiringContracts.length === 0" class="text-center py-12">
            <div class="text-gray-500 text-lg mb-2">Nenhum contrato vencendo encontrado</div>
            <p class="text-gray-400">Não há contratos vencendo no período especificado.</p>
          </div>

          <!-- Tabela -->
          <div *ngIf="!loadingExpiring && expiringContracts.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loja</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquilino</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Fim</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Restantes</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let contract of expiringContracts" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ contract.loja?.nome || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">Nº {{ contract.loja?.numero || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ contract.inquilino?.nome || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatCurrency(contract.valorAluguel) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(contract.dataFim) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getDaysRemainingClass(contract.dataFim)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getDaysRemaining(contract.dataFim) }} dias
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(contract.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ contract.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      routerLink="/contracts/details/{{ contract.id }}"
                      class="text-blue-600 hover:text-blue-900 transition-colors">
                      Ver
                    </button>
                    <button 
                      routerLink="/contracts/edit/{{ contract.id }}"
                      class="text-green-600 hover:text-green-900 transition-colors">
                      Editar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Contratos Vencidos -->
      <div *ngIf="activeTab === 'expired'" class="space-y-6">
        <!-- Ações para Contratos Vencidos -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Ações para Contratos Vencidos</h3>
              <p class="text-gray-600">Atualize automaticamente o status de todos os contratos vencidos</p>
            </div>
            <button 
              (click)="updateExpiredContractsStatus()"
              [disabled]="updatingExpiredStatus"
              class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="updatingExpiredStatus" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Atualizando...
              </span>
              <span *ngIf="!updatingExpiredStatus">Atualizar Status</span>
            </button>
          </div>
        </div>

        <!-- Resultados Contratos Vencidos -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                Contratos Vencidos
                <span *ngIf="expiredContracts.length > 0" class="ml-2 text-sm font-normal text-gray-500">
                  ({{ expiredContracts.length }} encontrado{{ expiredContracts.length !== 1 ? 's' : '' }})
                </span>
              </h3>
              <button 
                *ngIf="expiredContracts.length > 0"
                (click)="exportExpiredContracts()"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Exportar
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loadingExpired" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loadingExpired && expiredContracts.length === 0" class="text-center py-12">
            <div class="text-gray-500 text-lg mb-2">Nenhum contrato vencido encontrado</div>
            <p class="text-gray-400">Todos os contratos estão dentro do prazo de validade.</p>
          </div>

          <!-- Tabela -->
          <div *ngIf="!loadingExpired && expiredContracts.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loja</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquilino</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Fim</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Vencido</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let contract of expiredContracts" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ contract.loja?.nome || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">Nº {{ contract.loja?.numero || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ contract.inquilino?.nome || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatCurrency(contract.valorAluguel) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(contract.dataFim) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {{ getDaysExpired(contract.dataFim) }} dias
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(contract.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ contract.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      routerLink="/contracts/details/{{ contract.id }}"
                      class="text-blue-600 hover:text-blue-900 transition-colors">
                      Ver
                    </button>
                    <button 
                      routerLink="/contracts/edit/{{ contract.id }}"
                      class="text-green-600 hover:text-green-900 transition-colors">
                      Editar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContractReportsComponent implements OnInit {
  activeTab: 'expiring' | 'expired' = 'expiring';
  
  expiringForm: FormGroup;
  expiringContracts: Contract[] = [];
  expiredContracts: Contract[] = [];
  
  loadingExpiring = false;
  loadingExpired = false;
  updatingExpiredStatus = false;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService
  ) {
    this.expiringForm = this.fb.group({
      dias: [30, [Validators.required, Validators.min(1), Validators.max(365)]]
    });
  }

  ngOnInit() {
    // Carregar contratos vencendo em 30 dias por padrão
    this.loadExpiringContracts();
  }

  loadExpiringContracts() {
    if (this.expiringForm.invalid) {
      Object.keys(this.expiringForm.controls).forEach(key => {
        this.expiringForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loadingExpiring = true;
    const dias = this.expiringForm.value.dias;
    const request: ExpiringContractsRequest = { dias };

    this.contractService.getExpiringContracts(request).subscribe({
      next: (contracts) => {
        this.expiringContracts = contracts;
        this.loadingExpiring = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contratos vencendo:', error);
        this.loadingExpiring = false;
      }
    });
  }

  loadExpiredContracts() {
    this.loadingExpired = true;
    
    this.contractService.getExpiredContracts().subscribe({
      next: (contracts) => {
        this.expiredContracts = contracts;
        this.loadingExpired = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contratos vencidos:', error);
        this.loadingExpired = false;
      }
    });
  }

  updateExpiredContractsStatus() {
    this.updatingExpiredStatus = true;
    
    this.contractService.updateExpiredContractsStatus().subscribe({
      next: (response) => {
        console.log('Status dos contratos vencidos atualizado:', response);
        this.updatingExpiredStatus = false;
        // Recarregar a lista de contratos vencidos
        this.loadExpiredContracts();
      },
      error: (error) => {
        console.error('Erro ao atualizar status dos contratos vencidos:', error);
        this.updatingExpiredStatus = false;
      }
    });
  }

  exportExpiringContracts() {
    const csvContent = this.generateCSV(this.expiringContracts, 'vencendo');
    this.downloadCSV(csvContent, `contratos-vencendo-${this.expiringForm.value.dias}-dias.csv`);
  }

  exportExpiredContracts() {
    const csvContent = this.generateCSV(this.expiredContracts, 'vencidos');
    this.downloadCSV(csvContent, 'contratos-vencidos.csv');
  }

  private generateCSV(contracts: Contract[], type: 'vencendo' | 'vencidos'): string {
    const headers = [
      'Loja',
      'Número da Loja',
      'Inquilino',
      'Valor do Aluguel',
      'Data de Início',
      'Data de Fim',
      type === 'vencendo' ? 'Dias Restantes' : 'Dias Vencido',
      'Status',
      'Ativo'
    ];

    const rows = contracts.map(contract => [
      contract.loja?.nome || 'N/A',
      contract.loja?.numero || 'N/A',
      contract.inquilino?.nome || 'N/A',
      contract.valorAluguel.toString(),
      this.formatDate(contract.dataInicio),
      this.formatDate(contract.dataFim),
      type === 'vencendo' ? this.getDaysRemaining(contract.dataFim).toString() : this.getDaysExpired(contract.dataFim).toString(),
      contract.status,
      contract.ativo ? 'Sim' : 'Não'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  getDaysRemaining(dateString: string): number {
    const endDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysExpired(dateString: string): number {
    const endDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - endDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysRemainingClass(dateString: string): string {
    const days = this.getDaysRemaining(dateString);
    
    if (days <= 7) {
      return 'bg-red-100 text-red-800';
    } else if (days <= 15) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'VENCIDO':
        return 'bg-red-100 text-red-800';
      case 'RESCINDIDO':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENSO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatCurrency(value?: number): string {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}