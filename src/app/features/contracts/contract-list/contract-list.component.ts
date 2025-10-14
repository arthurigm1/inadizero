import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContractService } from '../contract.service';
import {
  Contract,
  ContractFilters,
  ContractStatus,
  StoreOption,
  TenantOption
} from '../contract.interfaces';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Lista de Contratos</h1>
        <div class="flex space-x-3">
          <button 
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Relatórios
          </button>
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Novo Contrato
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              [(ngModel)]="filters.status" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos os status</option>
              <option value="ATIVO">Ativo</option>
              <option value="VENCIDO">Vencido</option>
              <option value="RESCINDIDO">Rescindido</option>
              <option value="SUSPENSO">Suspenso</option>
            </select>
          </div>

          <!-- Ativo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Situação</label>
            <select 
              [(ngModel)]="filters.ativo" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option [value]="true">Ativo</option>
              <option [value]="false">Inativo</option>
            </select>
          </div>

          <!-- Loja -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loja</label>
            <select 
              [(ngModel)]="filters.lojaId" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas as lojas</option>
              <option *ngFor="let store of stores" [value]="store.id">
                {{ store.nome }} - {{ store.numero }}
              </option>
            </select>
          </div>

          <!-- Inquilino -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Inquilino</label>
            <select 
              [(ngModel)]="filters.inquilinoId" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos os inquilinos</option>
              <option *ngFor="let tenant of tenants" [value]="tenant.id">
                {{ tenant.nome }}
              </option>
            </select>
          </div>
        </div>

        <!-- Filtros de Data -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data Início (De)</label>
            <input 
              type="date" 
              [(ngModel)]="filters.dataInicioMin" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data Início (Até)</label>
            <input 
              type="date" 
              [(ngModel)]="filters.dataInicioMax" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data Fim (De)</label>
            <input 
              type="date" 
              [(ngModel)]="filters.dataFimMin" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data Fim (Até)</label>
            <input 
              type="date" 
              [(ngModel)]="filters.dataFimMax" 
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button 
            (click)="clearFilters()"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors mr-2">
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Tabela de Contratos -->
      <div *ngIf="!loading" class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loja</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquilino</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let contract of contracts" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ contract.loja?.nome || 'N/A' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Nº {{ contract.loja?.numero || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ contract.inquilino?.nome || 'N/A' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ contract.inquilino?.email || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ contract.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}
                  </div>
                  <div *ngIf="contract.reajusteAnual" class="text-sm text-gray-500">
                    Reajuste: {{ contract.percentualReajuste }}%
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(contract.dataInicio) }} -
                  </div>
                  <div class="text-sm text-gray-900">
                    {{ formatDate(contract.dataFim) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(contract.status)">
                    {{ contract.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      [routerLink]="['/contracts/details', contract.id]"
                      class="text-blue-600 hover:text-blue-900">
                      Visualizar
                    </button>
                    <button 
                      [routerLink]="['/contracts/edit', contract.id]"
                      class="text-green-600 hover:text-green-900">
                      Editar
                    </button>
                    <button 
                      *ngIf="contract.status === 'ATIVO'"
                      (click)="openRescindModal(contract)"
                      class="text-yellow-600 hover:text-yellow-900">
                      Rescindir
                    </button>
                    <button 
                      *ngIf="contract.status === 'ATIVO'"
                      (click)="openRenewModal(contract)"
                      class="text-purple-600 hover:text-purple-900">
                      Renovar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginação -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              (click)="goToPreviousPage()"
              [disabled]="!hasPreviousPage"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Anterior
            </button>
            <button 
              (click)="goToNextPage()"
              [disabled]="!hasNextPage"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Próximo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ getDisplayRange().start }}</span>
                a
                <span class="font-medium">{{ getDisplayRange().end }}</span>
                de
                <span class="font-medium">{{ totalItems }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  (click)="goToPreviousPage()"
                  [disabled]="!hasPreviousPage"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Anterior
                </button>
                
                <button 
                  *ngFor="let page of getPageNumbers()"
                  (click)="goToPage(page)"
                  [class]="page === currentPage ? 
                    'z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium' :
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ">
                  {{ page }}
                </button>
                
                <button 
                  (click)="goToNextPage()"
                  [disabled]="!hasNextPage"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Próximo
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem quando não há contratos -->
      <div *ngIf="!loading && contracts.length === 0" class="text-center py-12">
        <div class="text-gray-500 text-lg">Nenhum contrato encontrado</div>
        <button 
          routerLink="/contracts/create"
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Criar Primeiro Contrato
        </button>
      </div>
    </div>
  `
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];
  stores: StoreOption[] = [];
  tenants: TenantOption[] = [];
  loading = false;
  
  // Paginação
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  hasNextPage = false;
  hasPreviousPage = false;

  // Filtros
  filters: ContractFilters = {
    page: 1,
    limit: 10
  };

  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.loadStores();
    this.loadTenants();
    this.loadContracts();
  }

  loadContracts() {
    this.loading = true;
    this.contractService.getCompanyContracts(this.filters).subscribe({
      next: (response) => {
        this.contracts = response.contracts;
        this.totalItems = response.total;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.hasNextPage = this.currentPage < this.totalPages;
        this.hasPreviousPage = this.currentPage > 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contratos:', error);
        this.loading = false;
      }
    });
  }

  loadStores() {
    this.contractService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
      },
      error: (error) => {
        console.error('Erro ao carregar lojas:', error);
      }
    });
  }

  loadTenants() {
    this.contractService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      },
      error: (error) => {
        console.error('Erro ao carregar inquilinos:', error);
      }
    });
  }

  applyFilters() {
    this.filters.page = 1;
    this.loadContracts();
  }

  clearFilters() {
    this.filters = {
      page: 1,
      limit: 10
    };
    this.loadContracts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.loadContracts();
    }
  }

  goToPreviousPage() {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDisplayRange() {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);
    return { start, end };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  getStatusClass(status: ContractStatus): string {
    const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full';
    
    switch (status) {
      case ContractStatus.ATIVO:
        return `${baseClass} bg-green-100 text-green-800`;
      case ContractStatus.VENCIDO:
        return `${baseClass} bg-red-100 text-red-800`;
      case ContractStatus.RESCINDIDO:
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case ContractStatus.SUSPENSO:
        return `${baseClass} bg-gray-100 text-gray-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  openRescindModal(contract: Contract) {
    // TODO: Implementar modal de rescisão
    console.log('Rescindir contrato:', contract.id);
  }

  openRenewModal(contract: Contract) {
    // TODO: Implementar modal de renovação
    console.log('Renovar contrato:', contract.id);
  }
}