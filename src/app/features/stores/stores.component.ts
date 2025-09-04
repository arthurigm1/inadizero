import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { StoreService, Store, CreateStoreData, UpdateStoreData, StoreResponse, PaginationParams, Tenant, TenantsResponse } from './store.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('cardHover', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 p-6">
      <!-- Header -->
      <div class="mb-8" [@fadeIn]>
        <h1 class="text-4xl font-bold text-yellow-400 mb-2">Gerenciamento de Lojas</h1>
        <p class="text-gray-300">Visualize e gerencie todas as propriedades</p>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="loading" class="flex justify-center items-center py-12" [@fadeIn]>
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span class="ml-3 text-gray-300">Carregando lojas...</span>
      </div>

      <!-- Error Message -->
      <div *ngIf="error && !loading" class="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6" [@fadeIn]>
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle text-red-400 mr-3"></i>
          <span class="text-red-300">{{ error }}</span>
          <button 
            (click)="loadStores()" 
            class="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fas fa-redo mr-2"></i>
            Tentar Novamente
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" [@slideIn]>
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Total de Lojas</p>
              <p class="text-2xl font-bold text-white">{{ stores.length }}</p>
            </div>
            <div class="bg-blue-500/20 p-3 rounded-lg">
              <i class="fas fa-store text-blue-400 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Lojas Ocupadas</p>
            </div>
            <div class="bg-green-500/20 p-3 rounded-lg">
              <i class="fas fa-check-circle text-green-400 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Lojas Vagas</p>
            </div>
            <div class="bg-red-500/20 p-3 rounded-lg">
              <i class="fas fa-times-circle text-red-400 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Receita Mensal</p>
            </div>
            <div class="bg-yellow-500/20 p-3 rounded-lg">
              <i class="fas fa-dollar-sign text-yellow-400 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div *ngIf="!loading && !error" class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center" [@slideIn]>
        <div class="flex flex-col sm:flex-row gap-4">
          <button 
            (click)="openCreateModal()"
            class="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            <i class="fas fa-plus mr-2"></i>
            Nova Loja
          </button>

        </div>
        
        <div class="flex gap-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Buscar lojas..."
              class="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <select class="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500">
            <option value="all">Todas as lojas</option>
            <option value="occupied">Ocupadas</option>
            <option value="vacant">Vagas</option>
            <option value="maintenance">Em Manutenção</option>
          </select>
        </div>
      </div>

      <!-- Stores Grid -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" [@fadeIn]>
        <!-- Empty State -->
        <div *ngIf="stores.length === 0" class="col-span-full text-center py-12">
          <i class="fas fa-store text-6xl text-gray-500 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">Nenhuma loja encontrada</h3>
          <p class="text-gray-400">Não há lojas cadastradas para esta empresa.</p>
        </div>
        <div *ngFor="let store of stores" 
             class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
             [@cardHover]>
          
          <!-- Store Image -->
          <div class="h-48 bg-gradient-to-br from-gray-700 to-gray-800 relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <i class="fas fa-store text-6xl text-gray-500"></i>
            </div>
            <div class="absolute top-4 right-4">
              <span [ngClass]="{
                'bg-green-500': store.status === 'OCUPADA',
                'bg-red-500': store.status === 'VAGA',
                'bg-yellow-500': store.status === 'MANUTENCAO'
              }" class="px-3 py-1 rounded-full text-xs font-semibold text-white">
                {{ store.status === 'OCUPADA' ? 'Ocupada' : store.status === 'VAGA' ? 'Vaga' : 'Manutenção' }}
              </span>
            </div>
          </div>
          
          <!-- Store Info -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-white">{{ store.nome }}</h3>
              <span class="text-yellow-400 font-bold text-lg">#{{ store.numero }}</span>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center text-gray-300">
                <i class="fas fa-map-marker-alt w-5 text-gray-400 mr-3"></i>
                <span>{{ store.localizacao }}</span>
              </div>
              
              <div class="flex items-center text-gray-300">
                <i class="fas fa-info-circle w-5 text-gray-400 mr-3"></i>
                <span class="capitalize">{{ store.status.toLowerCase() }}</span>
              </div>
              
              <div class="flex items-center text-gray-300">
                <i class="fas fa-calendar-plus w-5 text-gray-400 mr-3"></i>
                <span>Criado em {{ store.criadoEm | date:'dd/MM/yyyy' }}</span>
              </div>
              
              <div class="flex items-center text-gray-300">
                <i class="fas fa-file-contract w-5 text-gray-400 mr-3"></i>
                <span>{{ store.contratos.length || 0 }} contrato(s)</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-6 flex gap-2">
              <button 
                (click)="openEditModal(store)"
                class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                <i class="fas fa-edit mr-2"></i>
                Editar
              </button>
              <button 
                (click)="openTenantModal(store)"
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                <i class="fas fa-user mr-2"></i>
                Inquilino
              </button>
              <button class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <i class="fas fa-eye"></i>
              </button>
              <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && !error && (totalItems > 0 || stores.length > 0)" class="mt-8 flex flex-col sm:flex-row justify-between items-center" [@slideIn]>
        <div class="text-sm text-gray-400 mb-4 sm:mb-0">
          Mostrando {{ getStartItem() }} a {{ getEndItem() }} de {{ getDisplayTotalItems() }} lojas
        </div>
        <div class="flex items-center space-x-2">
          <!-- Botão Primeira Página -->
          <button 
            (click)="goToPage(1)"
            [disabled]="currentPage === 1"
            class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Primeira página">
            <i class="fas fa-angle-double-left"></i>
          </button>
          
          <!-- Botão Página Anterior -->
          <button 
            (click)="goToPreviousPage()"
            [disabled]="currentPage === 1"
            class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página anterior">
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <!-- Números das Páginas -->
          <div class="flex space-x-1">
            <button 
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [class]="page === currentPage ? 
                'px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold shadow-lg' : 
                'px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200'"
              class="min-w-[40px] transition-all duration-200">
              {{ page }}
            </button>
          </div>
          
          <!-- Botão Próxima Página -->
          <button 
            (click)="goToNextPage()"
            [disabled]="currentPage === totalPages"
            class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Próxima página">
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <!-- Botão Última Página -->
          <button 
            (click)="goToPage(totalPages)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Última página">
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
      
      <!-- Informações adicionais de paginação -->
      <div *ngIf="!loading && !error && (totalItems > 0 || stores.length > 0)" class="mt-4 text-center text-sm text-gray-500">
        Página {{ currentPage }} de {{ totalPages }} • {{ itemsPerPage }} itens por página
      </div>
    </div>

    <!-- Modal de Criação de Loja -->
    <div *ngIf="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Nova Loja</h3>
          <button 
            (click)="closeCreateModal()"
            class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form [formGroup]="createForm" (ngSubmit)="onSubmitCreate()">
          <!-- Nome da Loja -->
          <div class="mb-4">
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
            <input 
              type="text" 
              id="nome" 
              formControlName="nome"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome da loja">
            <div *ngIf="getFieldError('nome')" class="text-red-500 text-sm mt-1">
              {{ getFieldError('nome') }}
            </div>
          </div>

          <!-- Número da Loja -->
          <div class="mb-4">
            <label for="numero" class="block text-sm font-medium text-gray-700 mb-1">Número da Loja</label>
            <input 
              type="text" 
              id="numero" 
              formControlName="numero"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o número da loja">
            <div *ngIf="getFieldError('numero')" class="text-red-500 text-sm mt-1">
              {{ getFieldError('numero') }}
            </div>
          </div>

          <!-- Localização -->
          <div class="mb-4">
            <label for="localizacao" class="block text-sm font-medium text-gray-700 mb-1">Localização</label>
            <input 
              type="text" 
              id="localizacao" 
              formControlName="localizacao"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite a localização da loja">
            <div *ngIf="getFieldError('localizacao')" class="text-red-500 text-sm mt-1">
              {{ getFieldError('localizacao') }}
            </div>
          </div>


          <!-- Erro de criação -->
          <div *ngIf="createError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{{ createError }}</p>
          </div>

          <!-- Botões -->
          <div class="flex justify-end gap-3">
            <button 
              type="button"
              (click)="closeCreateModal()"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="createForm.invalid || creating"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md transition-colors flex items-center gap-2">
              <svg *ngIf="creating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ creating ? 'Criando...' : 'Criar Loja' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Editar Loja</h2>
          <button (click)="closeEditModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form [formGroup]="editForm" (ngSubmit)="onSubmitEdit()">
          <!-- Nome -->
          <div class="mb-4">
            <label for="editNome" class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              id="editNome"
              type="text"
              formControlName="nome"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome da loja"
            />
            <div *ngIf="getEditFieldError('nome')" class="text-red-500 text-sm mt-1">
              {{ getEditFieldError('nome') }}
            </div>
          </div>

          <!-- Número -->
          <div class="mb-4">
            <label for="editNumero" class="block text-sm font-medium text-gray-700 mb-2">Número</label>
            <input
              id="editNumero"
              type="text"
              formControlName="numero"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número da loja"
            />
            <div *ngIf="getEditFieldError('numero')" class="text-red-500 text-sm mt-1">
              {{ getEditFieldError('numero') }}
            </div>
          </div>

          <!-- Localização -->
          <div class="mb-4">
            <label for="editLocalizacao" class="block text-sm font-medium text-gray-700 mb-2">Localização</label>
            <input
              id="editLocalizacao"
              type="text"
              formControlName="localizacao"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Localização da loja"
            />
            <div *ngIf="getEditFieldError('localizacao')" class="text-red-500 text-sm mt-1">
              {{ getEditFieldError('localizacao') }}
            </div>
          </div>

          <!-- Status -->
          <div class="mb-6">
            <label for="editStatus" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="editStatus"
              formControlName="status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
            <div *ngIf="getEditFieldError('status')" class="text-red-500 text-sm mt-1">
              {{ getEditFieldError('status') }}
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="editError" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ editError }}
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              type="button"
              (click)="closeEditModal()"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="editForm.invalid || editing"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <span *ngIf="!editing">Salvar</span>
              <span *ngIf="editing">Salvando...</span>
            </button>
          </div>
        </form>
       </div>
     </div>

     <!-- Tenant Modal -->
     <div *ngIf="showTenantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
         <div class="flex justify-between items-center mb-4">
           <h2 class="text-xl font-bold text-gray-800">Gerenciar Inquilino</h2>
           <button (click)="closeTenantModal()" class="text-gray-500 hover:text-gray-700">
             <i class="fas fa-times"></i>
           </button>
         </div>
         
         <div class="mb-4">
           <p class="text-sm text-gray-600 mb-2">
             Loja: <span class="font-semibold">{{ currentStoreForTenant?.nome }}</span>
           </p>
         </div>

         <!-- Loading State -->
         <div *ngIf="loadingTenants" class="text-center py-4">
           <i class="fas fa-spinner fa-spin text-blue-500 text-xl"></i>
           <p class="text-gray-600 mt-2">Carregando inquilinos...</p>
         </div>

         <!-- Tenant Selection -->
         <div *ngIf="!loadingTenants && tenants.length > 0">
           <label class="block text-sm font-medium text-gray-700 mb-2">Selecionar Inquilino</label>
           <select 
             [(ngModel)]="selectedTenant"
             class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
             <option value="">Selecione um inquilino</option>
             <option *ngFor="let tenant of tenants" [value]="tenant.id">
               {{ tenant.nome }} - {{ tenant.email }}
             </option>
           </select>
         </div>

         <!-- No Tenants Message -->
         <div *ngIf="!loadingTenants && tenants.length === 0" class="text-center py-4">
           <i class="fas fa-users text-gray-400 text-3xl mb-2"></i>
           <p class="text-gray-600">Nenhum inquilino encontrado</p>
         </div>

         <!-- Error Message -->
         <div *ngIf="tenantError" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
           {{ tenantError }}
         </div>

         <!-- Action Buttons -->
         <div class="flex gap-3">
           <button
             type="button"
             (click)="closeTenantModal()"
             class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
           >
             Cancelar
           </button>
           <button
             type="button"
             (click)="onRemoveTenant()"
             [disabled]="assigningTenant"
             class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
           >
             <span *ngIf="!assigningTenant">Remover</span>
             <span *ngIf="assigningTenant">Removendo...</span>
           </button>
           <button
             type="button"
             (click)="onAssignTenant()"
             [disabled]="!selectedTenant || assigningTenant"
             class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
           >
             <span *ngIf="!assigningTenant">Vincular</span>
             <span *ngIf="assigningTenant">Vinculando...</span>
           </button>
         </div>
       </div>
     </div>
   `
 })
export class StoresComponent implements OnInit {
  stores: Store[] = [];
  loading = false;
  error: string | null = null;
  showCreateModal = false;
  createForm: FormGroup;
  creating = false;
  createError: string | null = null;
  
  // Propriedades do// Edit modal properties
  showEditModal = false;
  editForm: FormGroup;
  editing = false;
  editError: string | null = null;
  editingStore: Store | null = null;

  // Tenant modal properties
  showTenantModal = false;
  tenants: Tenant[] = [];
  loadingTenants = false;
  tenantError: string | null = null;
  selectedTenant: string | null = null;
  assigningTenant = false;
  currentStoreForTenant: Store | null = null;
  
  // Propriedades de paginação
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  totalItems = 0;

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(1)]],
      numero: ['', [Validators.required, Validators.minLength(1)]],
      localizacao: ['', [Validators.required, Validators.minLength(1)]],
    });
    
    this.editForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(1)]],
      numero: ['', [Validators.required, Validators.minLength(1)]],
      localizacao: ['', [Validators.required, Validators.minLength(1)]],
      status: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(page: number = this.currentPage): void {
    this.loading = true;
    this.error = null;

    const params: PaginationParams = {
      page: page,
      limit: this.itemsPerPage
    };

    this.storeService.getStores(params).subscribe({
      next: (response: StoreResponse) => {
        this.stores = response.lojas || [];
        
        if (response.paginacao) {
          this.currentPage = response.paginacao.paginaAtual;
          this.totalPages = response.paginacao.totalPaginas;
          this.totalItems = response.paginacao.totalLojas;
          this.itemsPerPage = response.paginacao.limitePorPagina;
        } else {
          // Fallback se não houver paginação no backend
          this.currentPage = page;
          this.totalPages = 1;
          this.totalItems = this.stores.length;
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Erro ao carregar as lojas. Verifique sua conexão.';
      }
    });
  }


  onSubmitCreate(): void {
    if (this.createForm.valid && !this.creating) {
      this.creating = true;
      this.createError = null;

      const formData = this.createForm.value;
      const createData: CreateStoreData = {
        nome: formData.nome,
        numero: formData.numero,
        localizacao: formData.localizacao,
      };

      this.storeService.createStore(createData).subscribe({
        next: (newStore) => {
          this.creating = false;
          this.closeCreateModal();
          this.loadStores(); // Recarrega a lista de lojas
        },
        error: (err) => {
          this.creating = false;
          this.createError = err.message || 'Erro ao criar a loja. Tente novamente.';
        }
      });
    }
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.createForm.reset({
      nome: '',
      numero: '',
      localizacao: '',
    });
    this.createError = null;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createForm.reset();
    this.createError = null;
    this.creating = false;
  }

  openEditModal(store: Store): void {
    this.editingStore = store;
    this.showEditModal = true;
    this.editForm.patchValue({
      nome: store.nome,
      numero: store.numero,
      localizacao: store.localizacao,
      status: store.status
    });
    this.editError = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
    this.editError = null;
    this.editing = false;
    this.editingStore = null;
  }

  onSubmitEdit(): void {
    if (this.editForm.valid && !this.editing && this.editingStore) {
      this.editing = true;
      this.editError = null;

      const formData = this.editForm.value;
      const updateData: UpdateStoreData = {
        nome: formData.nome,
        numero: formData.numero,
        localizacao: formData.localizacao,
        status: formData.status
      };

      this.storeService.updateStore(this.editingStore.id, updateData).subscribe({
        next: (updatedStore) => {
          this.editing = false;
          this.closeEditModal();
          this.loadStores(); // Recarrega a lista de lojas
        },
        error: (err) => {
          this.editing = false;
          this.editError = err.message || 'Erro ao editar a loja. Tente novamente.';
        }
      });
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.createForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} é obrigatório`;
      }
      if (field.errors?.['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return null;
  }

  getEditFieldError(fieldName: string): string | null {
    const field = this.editForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors?.['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return null;
  }

  // Tenant modal methods
  openTenantModal(store: Store): void {
    this.currentStoreForTenant = store;
    this.showTenantModal = true;
    this.selectedTenant = null;
    this.tenantError = null;
    this.loadTenants();
  }

  closeTenantModal(): void {
    this.showTenantModal = false;
    this.currentStoreForTenant = null;
    this.selectedTenant = null;
    this.tenantError = null;
    this.tenants = [];
  }

  loadTenants(): void {
    this.loadingTenants = true;
    this.tenantError = null;
    
    this.storeService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
        this.loadingTenants = false;
      },
      error: (error) => {
        this.tenantError = error.message;
        this.loadingTenants = false;
      }
    });
  }

  onAssignTenant(): void {
    if (!this.selectedTenant || !this.currentStoreForTenant) {
      return;
    }

    this.assigningTenant = true;
    this.tenantError = null;

    const updateData = {
      vincularInquilino: {
        inquilinoId: this.selectedTenant
      }
    };

    this.storeService.updateStore(this.currentStoreForTenant.id, updateData).subscribe({
      next: () => {
        this.assigningTenant = false;
        this.closeTenantModal();
        this.loadStores(); // Reload stores to show updated data
      },
      error: (error) => {
        this.tenantError = error.message;
        this.assigningTenant = false;
      }
    });
  }

  onRemoveTenant(): void {
    if (!this.currentStoreForTenant) {
      return;
    }

    this.assigningTenant = true;
    this.tenantError = null;

    const updateData = {
      vincularInquilino: {
        inquilinoId: null
      }
    };

    this.storeService.updateStore(this.currentStoreForTenant.id, updateData).subscribe({
      next: () => {
        this.assigningTenant = false;
        this.closeTenantModal();
        this.loadStores(); // Reload stores to show updated data
      },
      error: (error) => {
        this.tenantError = error.message;
        this.assigningTenant = false;
      }
    });
  }

  trackByStoreId(index: number, store: Store): string {
    return store.id;
  }

  // Métodos de paginação
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadStores(page);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  getStartItem(): number {
    if (this.stores.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    const total = this.totalItems > 0 ? this.totalItems : this.stores.length;
    return Math.min(this.currentPage * this.itemsPerPage, total);
  }

  getDisplayTotalItems(): number {
    return this.totalItems > 0 ? this.totalItems : this.stores.length;
  }

}