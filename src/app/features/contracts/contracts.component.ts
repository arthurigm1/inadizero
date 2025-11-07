import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ContractService } from './contract.service';
import { Contract, ContractStats, StoreOption, TenantOption, CreateContractRequest, ContractStatus, ContractFilters } from './contract.interfaces';
import { StoreService, Tenant } from '../stores/store.service';
import { ContractEditModalComponent } from './contract-edit-modal/contract-edit-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule, ContractEditModalComponent],
  template: `<div class="min-h-screen " [@fadeIn]>
  <!-- Header -->
  <div class="mb-6 sm:mb-8 p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-blue-900">Gerenciamento de Contratos</h1>
        <p class="text-gray-600 mt-1 text-sm sm:text-base">Gerencie todos os contratos de locação</p>
      </div>
      <button (click)="openCreateContractModal()" 
              class="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>Novo Contrato</span>
      </button>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="p-4 sm:p-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <!-- Active Contracts -->
      <div class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-600 text-xs sm:text-sm font-medium">Contratos Ativos</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mt-1 sm:mt-2">{{totalContracts}}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Pending Contracts -->
      <div class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-600 text-xs sm:text-sm font-medium">Pendentes</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mt-1 sm:mt-2">{{contractStats.pendingContracts}}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Expiring Soon -->
      <div class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-600 text-xs sm:text-sm font-medium">Vencendo em 30 dias</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mt-1 sm:mt-2">{{contractStats.expiringSoon}}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-600 text-xs sm:text-sm font-medium">Receita Total</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mt-1 sm:mt-2 truncate">{{formatCurrency(contractStats.totalRevenue)}}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-3 sm:mb-4">Filtros</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select [(ngModel)]="filters.status" (ngModelChange)="applyFilters()" 
                  class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
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
                  class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
            <option value="">Todas</option>
            <option *ngFor="let store of stores" [value]="store.id">{{store.nome}}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
          <input type="date" [(ngModel)]="filters.dataInicioMin" (ngModelChange)="applyFilters()" 
                 class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
          <input type="date" [(ngModel)]="filters.dataFimMax" (ngModelChange)="applyFilters()" 
                 class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
        </div>
      </div>
    </div>

    <!-- Contracts Cards -->
    <div class="bg-white backdrop-blur-sm border border-blue-200 rounded-xl p-4 sm:p-6">
      <div class="mb-4 sm:mb-6">
        <h3 class="text-lg font-semibold text-blue-900">Lista de Contratos</h3>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div *ngFor="let contract of contracts" 
             (click)="viewContractDetails(contract)"
             class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          
          <!-- Contract Header -->
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-semibold text-blue-900 group-hover:text-blue-700 transition-colors text-sm sm:text-base truncate">#{{contract.id.substring(0, 8)}}</h4>
                <p class="text-xs sm:text-sm text-gray-600">Contrato</p>
              </div>
            </div>
            <span [class]="getStatusClass(contract.status)" class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap">
              {{getStatusText(contract.status)}}
            </span>
          </div>

          <!-- Contract Info -->
          <div class="space-y-2 sm:space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs sm:text-sm text-gray-600">Loja:</span>
              <span class="text-xs sm:text-sm font-medium text-blue-900 truncate ml-2">{{contract.loja?.nome}}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-xs sm:text-sm text-gray-600">Inquilino:</span>
              <span class="text-xs sm:text-sm font-medium text-blue-900 truncate ml-2">{{contract.inquilino?.nome}}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-xs sm:text-sm text-gray-600">Valor:</span>
              <span class="text-base sm:text-lg font-bold text-green-600 truncate">{{formatCurrency(contract.valorAluguel)}}</span>
            </div>
            
            <div class="border-t border-gray-200 pt-2 sm:pt-3">
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span class="truncate">{{formatDate(contract.dataInicio)}}</span>
                <span class="mx-2">até</span>
                <span class="truncate">{{formatDate(contract.dataFim)}}</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      <!-- Pagination (estilo alinhado ao Usuários) -->
      <div *ngIf="totalContracts > 0" class="bg-blue-50 px-6 py-3 flex items-center justify-between border border-blue-200 rounded-lg mt-6" [@slideIn]>
        <!-- Mobile -->
        <div class="flex-1 flex justify-between sm:hidden">
          <button (click)="previousPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
            Anterior
          </button>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
            Próximo
          </button>
        </div>
        <!-- Desktop -->
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-blue-700">
              Mostrando <span class="font-medium">{{(currentPage - 1) * pageSize + 1}}</span> a 
              <span class="font-medium">{{currentPage * pageSize < totalContracts ? currentPage * pageSize : totalContracts}}</span> 
              de <span class="font-medium">{{totalContracts}}</span> contratos
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button (click)="previousPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50 disabled:opacity-50">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </button>
              <span class="relative inline-flex items-center px-4 py-2 border border-blue-300 bg-white text-sm font-medium text-blue-700">
                {{currentPage}} de {{totalPages}}
              </span>
              <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50 disabled:opacity-50">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Contract Modal -->
  <div *ngIf="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" [@slideIn]>
    <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-blue-900">Novo Contrato</h2>
        <button (click)="closeCreateModal()" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <form (ngSubmit)="createContract()" #contractForm="ngForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loja *</label>
            <select [(ngModel)]="newContract.lojaId" name="lojaId" required 
                    class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
              <option value="">Selecione uma loja</option>
              <option *ngFor="let store of stores" [value]="store.id">{{store.nome}}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Inquilino *</label>
            <select [(ngModel)]="newContract.inquilinoId" name="inquilinoId" required 
                    class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
              <option value="">Selecione um inquilino</option>
              <option *ngFor="let tenant of tenants" [value]="tenant.id">{{tenant.nome}}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Valor do Aluguel *</label>
            <input type="number" [(ngModel)]="newContract.valorAluguel" name="valorAluguel" required 
                   step="0.01" min="0" placeholder="0.00"
                   class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
          </div>

          <div class="flex items-center md:items-end">
            <div class="flex items-center h-full">
              <input type="checkbox" [(ngModel)]="newContract.reajusteAnual" name="reajusteAnual" 
                     class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <label class="ml-2 text-sm text-gray-700">Aplicar reajuste anual</label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
            <input type="date" [(ngModel)]="newContract.dataInicio" name="dataInicio" required 
                   class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Fim *</label>
            <input type="date" [(ngModel)]="newContract.dataFim" name="dataFim" required 
                   class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dia de Vencimento *</label>
            <input type="number" [(ngModel)]="newContract.dataVencimento" name="dataVencimento" required 
                   min="1" max="31" placeholder="Ex: 10"
                   class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm">
          </div>
        </div>

        <div class="mt-4 sm:mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea [(ngModel)]="newContract.observacoes" name="observacoes" rows="3" 
                    class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                    placeholder="Observações adicionais sobre o contrato..."></textarea>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
          <button type="button" (click)="closeCreateModal()" 
                  class="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
            Cancelar
          </button>
          <button type="submit" [disabled]="!contractForm.form.valid || isCreating" 
                  class="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 text-sm sm:text-base">
            <span *ngIf="!isCreating">Criar Contrato</span>
            <span *ngIf="isCreating">Criando...</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Edit Contract Modal -->
  <app-contract-edit-modal 
    [isVisible]="showEditModal"
    [contractToEdit]="contractToEdit"
    (onCancel)="closeEditModal()"
    (onSave)="onContractSaved($event)">
  </app-contract-edit-modal>

  <!-- Error Dialog: criação de contrato -->
  <div *ngIf="showErrorDialog" class="fixed inset-0 z-[60] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" (click)="closeErrorDialog()"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-[92%] max-w-lg p-6" [@slideIn]>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <line x1="12" y1="7" x2="12" y2="13" stroke-width="2" stroke-linecap="round" />
            <circle cx="12" cy="17" r="1.5" fill="currentColor" />
          </svg>
          <h2 class="text-xl sm:text-2xl font-bold text-blue-900">{{ errorDialogTitle }}</h2>
        </div>
        <button (click)="closeErrorDialog()" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="space-y-3">
        <div *ngFor="let item of errorDialogItems" class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          <div class="text-sm text-gray-700">
            <div>{{ item.message }}</div>
            <div *ngIf="item.path?.length" class="text-xs text-gray-500">Campo: {{ getPathString(item) }}</div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button (click)="closeErrorDialog()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">Entendi</button>
      </div>
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
  @Output() contractSelected = new EventEmitter<string>();
  
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

  // Error dialog state (creation failures)
  showErrorDialog = false;
  errorDialogTitle: string = '';
  errorDialogItems: { message: string; path?: string[] }[] = [];
  
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

    // Removido log de carregamento de filtros (desnecessário em produção)
    this.contractService.getCompanyContracts(filters).subscribe({
      next: (response: any) => {
        // Removidos logs de resposta da API (ruído em produção)
        
        // Extrair dados do objeto de resposta
        if (response && response.sucesso) {
          // Extrair array de contratos
          if (response.contratos && Array.isArray(response.contratos)) {
            this.contracts = response.contratos;
            // Removido log de contratos extraídos
          } else {
            console.warn('Array de contratos não encontrado na resposta');
            this.contracts = [];
          }
          
          // Extrair total de contratos
          if (typeof response.totalContratos === 'number') {
            this.totalContracts = response.totalContratos;
            this.totalPages = Math.ceil(this.totalContracts / this.pageSize);
            // Removidos logs de totais calculados
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
    // Removido log de carregamento de lojas
    this.contractService.getStores().subscribe({
      next: (response: any) => {
        // Removidos logs de resposta de lojas
        
        // Extrair o array de lojas do objeto de resposta
        let stores = [];
        if (response && response.lojas && Array.isArray(response.lojas)) {
          stores = response.lojas;
          // Removido log de lojas extraídas
        } else if (Array.isArray(response)) {
          // Caso a API retorne diretamente um array (fallback)
          stores = response;
          // Removido log redundante
        } else {
          console.warn('Formato de resposta inesperado para lojas:', response);
          stores = [];
        }
        
        this.stores = stores;
        // Removido log de lojas finais atribuídas
      },
      error: (error) => {
        console.error('Erro ao carregar lojas:', error);
        this.stores = []; // Garantir que seja um array vazio em caso de erro
      }
    });
  }


  loadTenants(): void {
    // Removido log de carregamento de inquilinos
    this.storeService.getTenants().subscribe({
      next: (tenants: Tenant[]) => {
        // Removidos logs de resposta de inquilinos
        
        // Garantir que sempre seja um array
        if (Array.isArray(tenants)) {
          this.tenants = tenants;
        } else {
          console.warn('API retornou um objeto ao invés de array para inquilinos:', tenants);
          this.tenants = [];
        }
        // Removido log de inquilinos finais
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
    this.contractService.createContract(this.newContract)
      .pipe(finalize(() => { this.isCreating = false; }))
      .subscribe({
      next: (contract) => {
        // Removido log de sucesso na criação de contrato
        this.closeCreateModal();
        this.loadContracts();
      },
      error: (error) => {
        console.error('Erro ao criar contrato:', error);
        this.openErrorDialogFromHttpError(error);
      }
    });
  }

  viewContractDetails(contract: Contract): void {
    this.contractSelected.emit(contract.id);
  }

  editContract(contract: Contract): void {
    this.contractToEdit = contract;
    this.showEditModal = true;
  }

  deleteContract(contract: Contract): void {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      this.contractService.rescindContract(contract.id).subscribe({
        next: () => {
          // Removido log de sucesso na exclusão de contrato
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
    // Removido log de sucesso ao salvar contrato
    this.closeEditModal();
    this.loadContracts();
  }

  // Error dialog helpers
  openErrorDialogFromHttpError(err: any): void {
    const payload = (err && err.error) ? err.error : err;
    const title = (payload && typeof payload.error === 'string' && payload.error.trim())
      ? payload.error
      : 'Erro ao criar contrato';

    const details = Array.isArray(payload?.details) ? payload.details : [];
    const items = details.map((d: any) => {
      const msg = (d && typeof d.message === 'string') ? d.message : 'Erro inesperado';
      const path = Array.isArray(d?.path) ? d.path : undefined;
      return { message: msg, path };
    });

    // Fallback when backend returns a simple string or other shape
    if (!items.length) {
      const fallbackMsg = typeof payload === 'string' ? payload : (payload?.message || 'Não foi possível criar o contrato.');
      items.push({ message: fallbackMsg });
    }

    this.errorDialogTitle = title;
    this.errorDialogItems = items;
    this.showErrorDialog = true;
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
  }

  getPathString(item: { path?: string[] }): string {
    return Array.isArray(item.path) ? item.path.join('.') : '';
  }

  Math = Math;
}