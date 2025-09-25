import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ContractService } from './contract.service';
import { Contract, ContractStats, StoreOption, TenantOption, CreateContractRequest, ContractStatus, ContractFilters } from './contract.interfaces';
import { StoreService, Tenant } from '../stores/store.service';
import { ContractEditComponent } from './contract-edit/contract-edit.component';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule, ContractEditComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" [@fadeIn]>
      <!-- Header -->
      <div class="bg-white border-b border-blue-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-blue-900">Contratos</h1>
            <p class="text-gray-600 mt-1">Gerencie todos os contratos de locação</p>
          </div>
          <button (click)="openCreateContractModal()" 
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Novo Contrato</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Active Contracts -->
          <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Contratos Ativos</p>
                <p class="text-3xl font-bold text-blue-900 mt-2">{{totalContracts}} </p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Contracts -->
          <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Pendentes</p>
                <p class="text-3xl font-bold text-blue-900 mt-2">{{contractStats.pendingContracts}}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Expiring Soon -->
          <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Vencendo em 30 dias</p>
                <p class="text-3xl font-bold text-blue-900 mt-2">{{contractStats.expiringSoon}}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Revenue -->
          <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Receita Total</p>
                <p class="text-3xl font-bold text-blue-900 mt-2">{{formatCurrency(contractStats.totalRevenue)}}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white border border-blue-200 rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">Filtros</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select [(ngModel)]="filters.status" (ngModelChange)="applyFilters()" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                <option value="ATIVO">Ativo</option>
                <option value="VENCIDO">Vencido</option>
                <option value="RESCINDIDO">Rescindido</option>
                <option value="SUSPENSO">Suspenso</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Loja</label>
              <select [(ngModel)]="filters.lojaId" (ngModelChange)="applyFilters()" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas</option>
                <option *ngFor="let store of stores" [value]="store.id">{{store.nome}}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
              <input type="date" [(ngModel)]="filters.dataInicioMin" (ngModelChange)="applyFilters()" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
              <input type="date" [(ngModel)]="filters.dataFimMax" (ngModelChange)="applyFilters()" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>

        <!-- Contracts Table -->
        <div class="bg-white border border-blue-200 rounded-xl overflow-hidden">
          <div class="p-6 border-b border-blue-200">
            <h3 class="text-lg font-semibold text-blue-900">Lista de Contratos</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-blue-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Loja</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Inquilino</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Valor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Data Início</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Data Fim</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-blue-200">
                <tr *ngFor="let contract of contracts" class="hover:bg-blue-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">#{{contract.id}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{{contract.loja?.nome}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{{contract.inquilino?.nome}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{{formatCurrency(contract.valorAluguel)}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{{formatDate(contract.dataInicio)}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{{formatDate(contract.dataFim)}}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(contract.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{getStatusText(contract.status)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button (click)="viewContract(contract)" class="text-blue-600 hover:text-blue-900">Ver</button>
                      <button (click)="editContract(contract)" class="text-green-600 hover:text-green-900">Editar</button>
                      <button (click)="deleteContract(contract)" class="text-red-600 hover:text-red-900">Excluir</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-3 border-t border-blue-200 bg-blue-50">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Mostrando {{getDisplayStart()}} a {{getDisplayEnd()}} de {{totalContracts}} contratos
              </div>
              <div class="flex items-center space-x-1">
                <!-- Botão Anterior -->
                <button (click)="previousPage()" [disabled]="!hasPreviousPage()" 
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Anterior
                </button>
                
                <!-- Números das páginas -->
                <button 
                  *ngFor="let page of getPageNumbers()"
                  (click)="goToPage(page)"
                  [class]="page === currentPage ? 
                    'z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium' :
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ">
                  {{ page }}
                </button>
                
                <!-- Botão Próximo -->
                <button (click)="nextPage()" [disabled]="!hasNextPage()" 
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Contract Modal -->
      <div *ngIf="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@slideIn]>
        <div class="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-blue-900">Novo Contrato</h2>
            <button (click)="closeCreateModal()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="createContract()" #contractForm="ngForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Loja *</label>
                <select [(ngModel)]="newContract.lojaId" name="lojaId" required 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione uma loja</option>
                  <option *ngFor="let store of stores" [value]="store.id">{{store.nome}}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Inquilino *</label>
                <select [(ngModel)]="newContract.inquilinoId" name="inquilinoId" required 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione um inquilino</option>
                  <option *ngFor="let tenant of tenants" [value]="tenant.id">{{tenant.nome}}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Valor do Aluguel *</label>
                <input type="number" [(ngModel)]="newContract.valorAluguel" name="valorAluguel" required 
                       step="0.01" min="0" placeholder="0.00"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reajuste Anual</label>
                <div class="flex items-center">
                  <input type="checkbox" [(ngModel)]="newContract.reajusteAnual" name="reajusteAnual" 
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label class="ml-2 text-sm text-gray-700">Aplicar reajuste anual</label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
                <input type="date" [(ngModel)]="newContract.dataInicio" name="dataInicio" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Data de Fim *</label>
                <input type="date" [(ngModel)]="newContract.dataFim" name="dataFim" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Dia de Vencimento *</label>
                <input type="number" [(ngModel)]="newContract.dataVencimento" name="dataVencimento" required 
                       min="1" max="31" placeholder="Ex: 10"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              <textarea [(ngModel)]="newContract.observacoes" name="observacoes" rows="3" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Observações adicionais sobre o contrato..."></textarea>
            </div>

            <div class="flex justify-end space-x-4 mt-8">
              <button type="button" (click)="closeCreateModal()" 
                      class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" [disabled]="!contractForm.form.valid || isCreating" 
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                <span *ngIf="!isCreating">Criar Contrato</span>
                <span *ngIf="isCreating">Criando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Contract Modal -->
      <div *ngIf="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@slideIn]>
        <div class="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
          <app-contract-edit 
            [contractToEdit]="contractToEdit"
            (onCancel)="closeEditModal()"
            (onSave)="onContractSaved($event)">
          </app-contract-edit>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ContractsComponent implements OnInit {
  contracts: Contract[] = [];
  contractStats: ContractStats = {
    activeContracts: 0,
    pendingContracts: 0,
    expiringSoon: 0,
    totalRevenue: 0
  };
  stores: StoreOption[] = [];
  tenants: Tenant[] = [];
  
  // Filters
  filters: ContractFilters = {
    status: undefined,
    lojaId: '',
    dataInicioMin: '',
    dataFimMax: ''
  };
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalContracts = 0;
  totalPages = 0;
  
  // Modal states
  showCreateModal = false;
  isCreating = false;
  showEditModal = false;
  contractToEdit: Contract | null = null;
  
  newContract: CreateContractRequest = {
    lojaId: '',
    inquilinoId: '', 
    valorAluguel: 0,
    reajusteAnual: false,
    dataInicio: '',
    dataFim: '',
    dataVencimento: 0,
    observacoes: ''
  };

  constructor(
    private contractService: ContractService,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.loadContracts();
    this.loadTenants();
    this.loadStores();
  }
loadContracts(): void {
    const filters = {
      ...this.filters,
      page: this.currentPage,
      limit: this.pageSize
    };

    console.log('Carregando contratos com filtros:', filters);
    this.contractService.getCompanyContracts(filters).subscribe({
      next: (response: any) => {
        console.log('Resposta da API de contratos:', response);
        console.log('Tipo da resposta:', typeof response);
        
        // Extrair dados do objeto de resposta
        if (response && response.sucesso) {
          // Extrair array de contratos
          if (response.contratos && Array.isArray(response.contratos)) {
            this.contracts = response.contratos;
            console.log('Contratos extraídos:', this.contracts);
          } else {
            console.warn('Array de contratos não encontrado na resposta');
            this.contracts = [];
          }
          
          // Extrair total de contratos
          if (typeof response.totalContratos === 'number') {
            this.totalContracts = response.totalContratos;
            this.totalPages = Math.ceil(this.totalContracts / this.pageSize);
            console.log('Total de contratos:', this.totalContracts);
            console.log('Total de páginas:', this.totalPages);
          } else {
            this.totalContracts = 0;
            this.totalPages = 0;
          }
          
        } else {
          console.error('Resposta da API não indica sucesso:', response);
          this.contracts = [];
          this.totalContracts = 0;
          this.totalPages = 0;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar contratos:', error);
        this.contracts = [];
        this.totalContracts = 0;
        this.totalPages = 0;
      }
    });
  }



  loadStores(): void {
    console.log('Carregando lojas...');
    this.contractService.getStores().subscribe({
      next: (response: any) => {
        console.log('Resposta da API de lojas:', response);
        console.log('Tipo da resposta:', typeof response);
        
        // Extrair o array de lojas do objeto de resposta
        let stores = [];
        if (response && response.lojas && Array.isArray(response.lojas)) {
          stores = response.lojas;
          console.log('Array de lojas extraído com sucesso:', stores);
        } else if (Array.isArray(response)) {
          // Caso a API retorne diretamente um array (fallback)
          stores = response;
          console.log('Resposta já é um array:', stores);
        } else {
          console.warn('Formato de resposta inesperado para lojas:', response);
          stores = [];
        }
        
        this.stores = stores;
        console.log('Lojas finais atribuídas:', this.stores);
      },
      error: (error) => {
        console.error('Erro ao carregar lojas:', error);
        this.stores = []; // Garantir que seja um array vazio em caso de erro
      }
    });
  }


  loadTenants(): void {
    console.log('Carregando inquilinos...');
    this.storeService.getTenants().subscribe({
      next: (tenants: Tenant[]) => {
        console.log('Resposta da API de inquilinos:', tenants);
        console.log('Tipo da resposta:', typeof tenants);
        console.log('É array?', Array.isArray(tenants));
        
        // Garantir que sempre seja um array
        if (Array.isArray(tenants)) {
          this.tenants = tenants;
        } else {
          console.warn('API retornou um objeto ao invés de array para inquilinos:', tenants);
          this.tenants = [];
        }
        console.log('Inquilinos finais:', this.tenants);
      },
      error: (error) => {
        console.error('Erro ao carregar inquilinos:', error);
        this.tenants = []; // Garantir que seja um array vazio em caso de erro
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadContracts();
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage--;
      this.loadContracts();
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.loadContracts();
    }
  }

  // Métodos auxiliares para paginação
  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadContracts();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    // Ajustar startPage se não tivermos páginas suficientes no final
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDisplayStart(): number {
    if (this.totalContracts === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getDisplayEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalContracts);
  }

  openCreateContractModal(): void {
    this.showCreateModal = true;
    this.resetNewContract();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetNewContract();
  }

  resetNewContract(): void {
    this.newContract = {
      lojaId: '',
      inquilinoId: '',
      valorAluguel: 0,
      reajusteAnual: false,
      dataInicio: '',
      dataVencimento: 1,
      dataFim: '',
      observacoes: ''
    };
  }

  createContract(): void {
    if (this.isCreating) return;
    
    this.isCreating = true;
    this.contractService.createContract(this.newContract).subscribe({
      next: (contract) => {
        console.log('Contrato criado com sucesso:', contract);
        this.closeCreateModal();
        this.loadContracts();
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Erro ao criar contrato:', error);
        this.isCreating = false;
      }
    });
  }

  viewContract(contract: Contract): void {
    this.router.navigate(['/contracts', contract.id]);
  }

  editContract(contract: Contract): void {
    this.contractToEdit = contract;
    this.showEditModal = true;
  }

  deleteContract(contract: Contract): void {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      this.contractService.deleteContract(contract.id).subscribe({
        next: () => {
          console.log('Contrato excluído com sucesso');
          this.loadContracts();
        },
        error: (error) => {
          console.error('Erro ao excluir contrato:', error);
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getStatusClass(status: ContractStatus): string {
    const classes = {
      'ATIVO': 'bg-green-100 text-green-800',
      'VENCIDO': 'bg-red-100 text-red-800',
      'RESCINDIDO': 'bg-gray-100 text-gray-800',
      'SUSPENSO': 'bg-yellow-100 text-yellow-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: ContractStatus): string {
    const texts = {
      'ATIVO': 'Ativo',
      'VENCIDO': 'Vencido',
      'RESCINDIDO': 'Rescindido',
      'SUSPENSO': 'Suspenso'
    };
    return texts[status] || 'Desconhecido';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.contractToEdit = null;
  }

  onContractSaved(contract: Contract): void {
    console.log('Contrato salvo com sucesso:', contract);
    this.closeEditModal();
    this.loadContracts();
  }

  Math = Math;
}