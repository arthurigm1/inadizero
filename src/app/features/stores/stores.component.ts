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
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <!-- Store List View -->
      <div *ngIf="viewMode === 'list'">
        <!-- Header -->
        <div class="mb-8" [@fadeIn]>
          <h1 class="text-4xl font-bold text-blue-800 mb-2">Gerenciamento de Lojas</h1>
          <p class="text-gray-600">Visualize e gerencie todas as propriedades</p>
        </div>

      <!-- Loading Indicator -->
      <div *ngIf="loading" class="flex justify-center items-center py-12" [@fadeIn]>
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-blue-600">Carregando lojas...</span>
      </div>

      <!-- Error Message -->
      <div *ngIf="error && !loading" class="bg-red-100 border border-red-400 rounded-xl p-4 mb-6" [@fadeIn]>
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i>
          <span class="text-red-700">{{ error }}</span>
          <button 
            (click)="loadStores()" 
            class="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fas fa-redo mr-2"></i>
            Tentar Novamente
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8" [@slideIn]>
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Total de Lojas</p>
              <p class="text-2xl font-bold text-blue-900">{{ stores.length }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <i class="fas fa-store text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Lojas Ocupadas</p>
              <p class="text-2xl font-bold text-red-600">{{ occupiedCount }}</p>
            </div>
            <div class="bg-red-100 p-3 rounded-lg">
              <i class="fas fa-door-closed text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Lojas Vagas</p>
              <p class="text-2xl font-bold text-green-600">{{ vacantCount }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <i class="fas fa-door-open text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Em Manutenção</p>
              <p class="text-2xl font-bold text-amber-600">{{ maintenanceCount }}</p>
            </div>
            <div class="bg-amber-100 p-3 rounded-lg">
              <i class="fas fa-tools text-amber-600 text-xl"></i>
            </div>
          </div>
        </div>

      </div>

      <!-- Actions Bar -->
      <div *ngIf="!loading && !error" class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center" [@slideIn]>
        <div class="flex flex-col sm:flex-row gap-4">
          <button 
            (click)="openCreateModal()"
            class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            <i class="fas fa-plus mr-2"></i>
            Nova Loja
          </button>
          <button 
            (click)="showFilters = !showFilters" 
            class="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            <i class="fas fa-filter mr-2"></i>
            Filtros
          </button>
        </div>
        
        <div class="flex gap-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Buscar lojas..."
              class="bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 pl-10 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 w-full sm:w-72 md:w-96"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
          </div>
          <select class="bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 w-full sm:w-48">
            <option value="all">Todas as lojas</option>
            <option value="occupied">Ocupadas</option>
            <option value="vacant">Vagas</option>
            <option value="maintenance">Em Manutenção</option>
          </select>
        </div>
      </div>

      <!-- Seção de Filtros -->
      <div *ngIf="showFilters && !loading && !error" class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-6 mb-6" [@slideIn]>
        <form [formGroup]="filterForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Filtro por Nome -->
            <div>
              <label for="filterNome" class="block text-sm font-medium text-blue-700 mb-1">Nome da Loja</label>
              <input
                id="filterNome"
                type="text"
                formControlName="nome"
                placeholder="Buscar por nome..."
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>

            <!-- Filtro por Status -->
            <div>
              <label for="filterStatus" class="block text-sm font-medium text-blue-700 mb-1">Status</label>
              <select
                id="filterStatus"
                formControlName="status"
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option *ngFor="let option of statusOptions" [value]="option.value">{{ option.label }}</option>
              </select>
            </div>

            <!-- Filtro por Número -->
            <div>
              <label for="filterNumero" class="block text-sm font-medium text-blue-700 mb-1">Número</label>
              <input
                id="filterNumero"
                type="text"
                formControlName="numero"
                placeholder="Buscar por número..."
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>

            <!-- Filtro por Localização -->
            <div>
              <label for="filterLocalizacao" class="block text-sm font-medium text-blue-700 mb-1">Localização</label>
              <input
                id="filterLocalizacao"
                type="text"
                formControlName="localizacao"
                placeholder="Buscar por localização..."
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              (click)="applyFilters()"
              class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <i class="fas fa-search"></i>
              Buscar
            </button>
            <button
              type="button"
              (click)="clearFilters()"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <i class="fas fa-times"></i>
              Limpar
            </button>
          </div>
        </form>
      </div>

      <!-- Stores Grid -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" [@fadeIn]>
        <!-- Empty State -->
        <div *ngIf="stores.length === 0" class="col-span-full text-center py-12">
          <i class="fas fa-store text-6xl text-blue-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-blue-700 mb-2">Nenhuma loja encontrada</h3>
          <p class="text-blue-600">Não há lojas cadastradas para esta empresa.</p>
        </div>
        <div *ngFor="let store of stores; trackBy: trackByStoreId" 
             class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 overflow-hidden hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl cursor-pointer"
             [ngClass]="{
               'border-l-4 border-red-400': store.status === 'OCUPADA',
               'border-l-4 border-green-400': store.status === 'VAGA',
               'border-l-4 border-amber-400': store.status === 'MANUTENCAO'
             }"
             [@cardHover]
             (click)="viewStoreDetails(store)">
          
          <!-- Store Image -->
          <div class="h-48 bg-gradient-to-br from-blue-100 to-blue-200 relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <i [ngClass]="{
                'fas fa-door-closed text-red-500': store.status === 'OCUPADA',
                'fas fa-door-open text-green-500': store.status === 'VAGA',
                'fas fa-tools text-amber-500': store.status === 'MANUTENCAO'
              }" class="text-6xl"></i>
            </div>
            <div class="absolute top-4 right-4">
              <span [ngClass]="{
                'bg-red-500': store.status === 'OCUPADA',
                'bg-green-500': store.status === 'VAGA',
                'bg-amber-500': store.status === 'MANUTENCAO'
              }" class="px-3 py-1 rounded-full text-xs font-semibold text-white shadow">
                {{ store.status === 'OCUPADA' ? 'Ocupada' : store.status === 'VAGA' ? 'Vaga' : 'Manutenção' }}
              </span>
            </div>
          </div>
          
          <!-- Store Info -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-blue-900">{{ store.nome }}</h3>
              <span class="text-blue-600 font-bold text-lg">#{{ store.numero }}</span>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center text-blue-700">
                <i class="fas fa-map-marker-alt w-5 text-blue-500 mr-3"></i>
                <span>{{ store.localizacao }}</span>
              </div>
              
              <div class="flex items-center">
                <i [ngClass]="{
                  'fas fa-door-closed text-red-500': store.status === 'OCUPADA',
                  'fas fa-door-open text-green-500': store.status === 'VAGA',
                  'fas fa-tools text-amber-500': store.status === 'MANUTENCAO'
                }" class="w-5 mr-3"></i>
                <span [ngClass]="{
                  'bg-red-100 text-red-700 border-red-200': store.status === 'OCUPADA',
                  'bg-green-100 text-green-700 border-green-200': store.status === 'VAGA',
                  'bg-amber-100 text-amber-700 border-amber-200': store.status === 'MANUTENCAO'
                }" class="px-3 py-1 rounded-full text-xs font-semibold border">
                  {{ store.status === 'OCUPADA' ? 'Ocupada' : store.status === 'VAGA' ? 'Vaga' : 'Manutenção' }}
                </span>
              </div>
              
              <div class="flex items-center text-blue-700">
                <i class="fas fa-calendar-plus w-5 text-blue-500 mr-3"></i>
                <span>Criado em {{ store.criadoEm | date:'dd/MM/yyyy' }}</span>
              </div>
              
              <div class="flex items-center text-blue-700">
                <i class="fas fa-file-contract w-5 text-blue-500 mr-3"></i>
                <span>{{ store.contratos?.length || 0 }} contrato(s)</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-6 flex gap-2">
              <button 
                (click)="openEditModal(store); $event.stopPropagation()"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                <i class="fas fa-edit mr-2"></i>
                Editar
              </button>
              <button
                *ngIf="store.inquilino"
                (click)="openUnlinkTenantModal(store); $event.stopPropagation()"
                class="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                <i class="fas fa-user-times mr-2"></i>
                Desvincular Inquilino
              </button>

            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && !error && (totalItems > 0 || stores.length > 0)" class="mt-8 flex flex-col sm:flex-row justify-between items-center" [@slideIn]>
        <div class="text-sm text-blue-600 mb-4 sm:mb-0">
          Mostrando {{ getStartItem() }} a {{ getEndItem() }} de {{ getDisplayTotalItems() }} lojas
        </div>
        <div class="flex items-center space-x-2">
          <!-- Botão Primeira Página -->
          <button 
            (click)="goToPage(1)"
            [disabled]="currentPage === 1"
            class="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Primeira página">
            <i class="fas fa-angle-double-left"></i>
          </button>
          
          <!-- Botão Página Anterior -->
          <button 
            (click)="goToPreviousPage()"
            [disabled]="currentPage === 1"
            class="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página anterior">
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <!-- Números das Páginas -->
          <div class="flex space-x-1">
            <button 
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [class]="page === currentPage ? 
                'px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold shadow-lg' : 
                'px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200'"
              class="min-w-[40px] transition-all duration-200">
              {{ page }}
            </button>
          </div>
          
          <!-- Botão Próxima Página -->
          <button 
            (click)="goToNextPage()"
            [disabled]="currentPage === totalPages"
            class="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Próxima página">
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <!-- Botão Última Página -->
          <button 
            (click)="goToPage(totalPages)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Última página">
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
      
      <!-- Informações adicionais de paginação -->
      <div *ngIf="!loading && !error && (totalItems > 0 || stores.length > 0)" class="mt-4 text-center text-sm text-blue-500">
        Página {{ currentPage }} de {{ totalPages }} • {{ itemsPerPage }} itens por página
      </div>
    </div>

    <!-- Modal de Criação de Loja -->
    <div *ngIf="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-blue-200">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-blue-900">Nova Loja</h3>
          <button 
            (click)="closeCreateModal()"
            class="text-blue-600 hover:text-blue-800">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form [formGroup]="createForm" (ngSubmit)="onSubmitCreate()">
          <!-- Nome da Loja -->
          <div class="mb-4">
            <label for="nome" class="block text-sm font-medium text-blue-700 mb-1">Nome da Loja</label>
            <input 
              type="text" 
              id="nome" 
              formControlName="nome"
              class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
              placeholder="Digite o nome da loja">
            <div *ngIf="getFieldError('nome')" class="text-red-500 text-sm mt-1">
              {{ getFieldError('nome') }}
            </div>
          </div>

          <!-- Número da Loja -->
          <div class="mb-4">
            <label for="numero" class="block text-sm font-medium text-blue-700 mb-1">Número da Loja</label>
            <input 
              type="text" 
              id="numero" 
              formControlName="numero"
              class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
              placeholder="Digite o número da loja">
            <div *ngIf="getFieldError('numero')" class="text-red-500 text-sm mt-1">
              {{ getFieldError('numero') }}
            </div>
          </div>

          <!-- Localização -->
          <div class="mb-4">
            <label for="localizacao" class="block text-sm font-medium text-blue-700 mb-1">Localização</label>
            <input 
              type="text" 
              id="localizacao" 
              formControlName="localizacao"
              class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
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
              class="px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors">
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
    <div *ngIf="showEditModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" [@fadeIn]>
      <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-8 w-full max-w-lg mx-4 shadow-2xl">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center">
            <div class="bg-blue-100 p-3 rounded-lg mr-4">
              <i class="fas fa-edit text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-blue-900">Editar Loja</h2>
              <p class="text-blue-600 text-sm">Atualize as informações da loja</p>
            </div>
          </div>
          <button 
            (click)="closeEditModal()" 
            class="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form [formGroup]="editForm" (ngSubmit)="onSubmitEdit()" class="space-y-6">
          <!-- Nome -->
          <div>
            <label for="editNome" class="block text-sm font-semibold text-blue-700 mb-2">
              <i class="fas fa-store text-blue-600 mr-2"></i>
              Nome da Loja
            </label>
            <input
              id="editNome"
              type="text"
              formControlName="nome"
              class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              placeholder="Digite o nome da loja"
            />
            <div *ngIf="getEditFieldError('nome')" class="text-red-500 text-sm mt-2 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i>
              {{ getEditFieldError('nome') }}
            </div>
          </div>

          <!-- Número -->
          <div>
            <label for="editNumero" class="block text-sm font-semibold text-blue-700 mb-2">
              <i class="fas fa-hashtag text-blue-600 mr-2"></i>
              Número da Loja
            </label>
            <input
              id="editNumero"
              type="text"
              formControlName="numero"
              class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              placeholder="Digite o número da loja"
            />
            <div *ngIf="getEditFieldError('numero')" class="text-red-500 text-sm mt-2 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i>
              {{ getEditFieldError('numero') }}
            </div>
          </div>

          <!-- Localização -->
          <div>
            <label for="editLocalizacao" class="block text-sm font-semibold text-blue-700 mb-2">
              <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
              Localização
            </label>
            <input
              id="editLocalizacao"
              type="text"
              formControlName="localizacao"
              class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              placeholder="Digite a localização da loja"
            />
            <div *ngIf="getEditFieldError('localizacao')" class="text-red-500 text-sm mt-2 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i>
              {{ getEditFieldError('localizacao') }}
            </div>
          </div>

          <!-- Status -->
          <div>
            <label for="editStatus" class="block text-sm font-semibold text-blue-700 mb-2">
              <i class="fas fa-toggle-on text-blue-600 mr-2"></i>
              Status da Loja
            </label>
            <select
              id="editStatus"
              formControlName="status"
              class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            >
              <option value="" class="bg-white">Selecione o status</option>
              <option value="VAGA" class="bg-white">Vaga</option>
              <option value="OCUPADA" class="bg-white">Ocupada</option>
              <option value="MANUTENCAO" class="bg-white">Manutenção</option>
            </select>
            <div *ngIf="getEditFieldError('status')" class="text-red-500 text-sm mt-2 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i>
              {{ getEditFieldError('status') }}
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="editError" class="bg-red-100 border border-red-400 rounded-lg p-4">
            <div class="flex items-center text-red-700">
              <i class="fas fa-exclamation-triangle mr-3"></i>
              <span>{{ editError }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              (click)="closeEditModal()"
              class="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-gray-300"
            >
              <i class="fas fa-times mr-2"></i>
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="editForm.invalid || editing"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              <i class="fas fa-save mr-2" *ngIf="!editing"></i>
              <i class="fas fa-spinner fa-spin mr-2" *ngIf="editing"></i>
              <span *ngIf="!editing">Salvar Alterações</span>
              <span *ngIf="editing">Salvando...</span>
            </button>
          </div>
        </form>
       </div>
     </div>

     <!-- Tenant Modal -->
     <div *ngIf="showTenantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-blue-200">
         <div class="flex justify-between items-center mb-4">
           <h2 class="text-xl font-bold text-blue-900">Gerenciar Inquilino</h2>
           <button (click)="closeTenantModal()" class="text-blue-600 hover:text-blue-800">
             <i class="fas fa-times"></i>
           </button>
         </div>
         
         <div class="mb-4">
           <p class="text-sm text-blue-600 mb-2">
             Loja: <span class="font-semibold">{{ currentStoreForTenant?.nome }}</span>
           </p>
         </div>

         <!-- Loading State -->
         <div *ngIf="loadingTenants" class="text-center py-4">
           <i class="fas fa-spinner fa-spin text-blue-500 text-xl"></i>
           <p class="text-blue-600 mt-2">Carregando inquilinos...</p>
         </div>

         <!-- Tenant Selection -->
         <div *ngIf="!loadingTenants && tenants.length > 0">
           <label class="block text-sm font-medium text-blue-700 mb-2">Selecionar Inquilino</label>
           <select 
             [(ngModel)]="selectedTenant"
             class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-blue-50 text-blue-900">
             <option value="">Selecione um inquilino</option>
             <option *ngFor="let tenant of tenants" [value]="tenant.id">
               {{ tenant.nome }} - {{ tenant.email }}
             </option>
           </select>
         </div>

         <!-- No Tenants Message -->
         <div *ngIf="!loadingTenants && tenants.length === 0" class="text-center py-4">
           <i class="fas fa-users text-blue-400 text-3xl mb-2"></i>
           <p class="text-blue-600">Nenhum inquilino encontrado</p>
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
             class="flex-1 px-4 py-2 border border-blue-200 text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
           >
             Cancelar
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

     <!-- Store Details View -->
     <div *ngIf="viewMode === 'details'">
       <!-- Header with Back Button -->
       <div class="mb-8" [@fadeIn]>
         <button 
           (click)="backToStoresList()"
           class="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors">
           <i class="fas fa-arrow-left mr-2"></i>
           Voltar para Lista de Lojas
         </button>
         <h1 class="text-4xl font-bold text-blue-800 mb-2">Detalhes da Loja</h1>
         <p class="text-blue-600">Visualize e gerencie informações da loja</p>
       </div>

       <!-- Loading Store Details -->
       <div *ngIf="loadingStoreDetails" class="flex justify-center items-center py-12" [@fadeIn]>
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
         <span class="ml-3 text-blue-600">Carregando detalhes da loja...</span>
       </div>

       <!-- Store Details Content -->
       <div *ngIf="!loadingStoreDetails && selectedStore" class="space-y-6" [@fadeIn]>
         <!-- Store Info Card -->
         <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-6">
           <div class="flex justify-between items-start mb-6">
             <div>
               <h2 class="text-2xl font-bold text-blue-900 mb-2">{{ selectedStore.nome }}</h2>
               <p class="text-blue-600">Loja #{{ selectedStore.numero }}</p>
             </div>
             <div class="flex items-center space-x-4">
                <span [ngClass]="{
                  'bg-green-500': selectedStore.status === 'OCUPADA',
                  'bg-red-500': selectedStore.status === 'VAGA',
                  'bg-yellow-500': selectedStore.status === 'MANUTENCAO'
                }" class="px-4 py-2 rounded-full text-sm font-semibold text-white">
                  {{ selectedStore.status === 'OCUPADA' ? 'Ocupada' : selectedStore.status === 'VAGA' ? 'Vaga' : 'Manutenção' }}
                </span>
                <div class="flex space-x-2">
                  <button 
                    (click)="openEditModal(selectedStore)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-edit mr-2"></i>
                    Editar Loja
                  </button>
                  <button 
                    *ngIf="selectedStore.inquilino"
                    (click)="openUnlinkTenantModal(selectedStore)"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-user-times mr-2"></i>
                    Desvincular Inquilino
                  </button>
                  <button 
                    (click)="openDeactivateModal(selectedStore)"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-ban mr-2"></i>
                    Desativar Loja
                  </button>
                </div>
              </div>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <h3 class="text-lg font-semibold text-blue-700 mb-3">Informações Básicas</h3>
               <div class="space-y-3">
                 <div>
                   <span class="text-blue-600">Nome:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.nome }}</span>
                 </div>
                 <div>
                   <span class="text-blue-600">Número:</span>
                   <span class="text-blue-900 ml-2">#{{ selectedStore.numero }}</span>
                 </div>
                 <div>
                   <span class="text-blue-600">Localização:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.localizacao }}</span>
                 </div>
                 <div>
                   <span class="text-blue-600">Status:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.status === 'OCUPADA' ? 'Ocupada' : selectedStore.status === 'VAGA' ? 'Vaga' : 'Manutenção' }}</span>
                 </div>
                 <div>
                   <span class="text-blue-600">Criado em:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
                 </div>
               </div>
             </div>

             <!-- Informações da Empresa -->
             <div *ngIf="selectedStore.empresa">
               <h3 class="text-lg font-semibold text-blue-700 mb-3">Empresa</h3>
               <div class="space-y-3">
                 <div>
                   <span class="text-blue-600">Nome:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.empresa.nome }}</span>
                 </div>
                 <div>
                   <span class="text-blue-600">CNPJ:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.empresa.cnpj }}</span>
                 </div>
               </div>
             </div>

             <!-- Informações do Inquilino/Responsável -->
             <div>
               <h3 class="text-lg font-semibold text-blue-700 mb-3">Inquilino</h3>
               
               <!-- Informações do Usuário (quando há usuário vinculado) -->
               <div *ngIf="selectedStore.usuario" class="space-y-3 mb-4">
                 <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                   <h4 class="text-sm font-medium text-blue-700 mb-2">Usuário Vinculado</h4>
                   <div class="space-y-2">
                     <div>
                       <span class="text-blue-600">Nome:</span>
                       <span class="text-blue-900 ml-2">{{ selectedStore.usuario.nome }}</span>
                     </div>
                     <div>
                       <span class="text-blue-600">Email:</span>
                       <span class="text-blue-900 ml-2">{{ selectedStore.usuario.email }}</span>
                     </div>
                   </div>
                 </div>
                 <div class="flex">
                   <button
                     (click)="openUnlinkTenantModal(selectedStore)"
                     [disabled]="unlinkingTenant"
                     class="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                     <i class="fas fa-user-minus mr-2"></i>
                     Desvincular Usuário
                   </button>
                 </div>
               </div>
               
               <!-- Informações do Inquilino -->
               <div *ngIf="selectedStore.inquilino" class="space-y-3">
                 <div>
                   <span class="text-blue-600">Nome do Inquilino:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.inquilino.nome }}</span>
                 </div>
                 <div>
                   <span class="text-blue-600">Email do Inquilino:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.inquilino.email }}</span>
                 </div>
                 <div *ngIf="selectedStore.inquilino.cpf">
                   <span class="text-blue-600">CPF:</span>
                   <span class="text-blue-900 ml-2">{{ selectedStore.inquilino.cpf }}</span>
                 </div>
                 <div *ngIf="selectedStore.inquilino.telefone">
                    <span class="text-blue-600">Telefone:</span>
                    <span class="text-blue-900 ml-2">{{ selectedStore.inquilino.telefone }}</span>
                  </div>
               </div>
               
               <div *ngIf="!selectedStore.inquilino && !selectedStore.usuario" class="text-blue-600">
                  <p class="mb-4">Nenhum inquilino vinculado</p>
                  <button 
                    (click)="onAssignTenant(selectedStore)"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-user-plus mr-2"></i>
                    Vincular Inquilino
                  </button>
                </div>
             </div>

             <!-- Contratos -->
             <div *ngIf="selectedStore.contratos && selectedStore.contratos.length > 0">
               <h3 class="text-lg font-semibold text-blue-700 mb-3">Contratos</h3>
               <div class="space-y-2">
                 <div *ngFor="let contrato of selectedStore.contratos" class="bg-blue-50 p-3 rounded-lg">
                   <div class="text-blue-900">Contrato #{{ contrato.id || 'N/A' }}</div>
                   <div class="text-blue-600 text-sm">{{ contrato.descricao || 'Sem descrição' }}</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
      </div>

      <!-- Modal de Confirmação - Desativar Loja -->
      <div *ngIf="showDeactivateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@fadeIn]>
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 border border-blue-200">
          <div class="flex items-center mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
            <h3 class="text-xl font-bold text-blue-900">Confirmar Desativação</h3>
          </div>
          <p class="text-blue-600 mb-6">
            Tem certeza que deseja desativar a loja <strong class="text-blue-800">{{ storeToDeactivate?.nome }}</strong>?
            Esta ação pode afetar contratos e inquilinos vinculados.
          </p>
          <div class="flex justify-end space-x-3">
            <button 
              (click)="closeDeactivateModal()"
              [disabled]="deactivatingStore"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button 
              (click)="confirmDeactivateStore()"
              [disabled]="deactivatingStore"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
              <span *ngIf="!deactivatingStore">Desativar</span>
              <span *ngIf="deactivatingStore">Desativando...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmação - Desvincular Inquilino -->
      <div *ngIf="showUnlinkTenantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@fadeIn]>
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 border border-blue-200">
          <div class="flex items-center mb-4">
            <i class="fas fa-user-times text-orange-500 text-2xl mr-3"></i>
            <h3 class="text-xl font-bold text-blue-900">Confirmar Desvinculação</h3>
          </div>
          <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-700">
              Você está prestes a desvincular 
              <span class="font-semibold text-blue-900">{{ getUnlinkTargetLabel() }}</span>
              da loja 
              <span class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-semibold">
                {{ storeToUnlinkTenant?.nome }}
              </span>.
            </p>
            <p class="text-blue-500 text-sm mt-2">
              Após confirmar, o vínculo será removido e os dados permanecerão intactos.
            </p>
          </div>
          <div class="flex justify-end space-x-3">
            <button 
              (click)="closeUnlinkTenantModal()"
              [disabled]="unlinkingTenant"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button 
              (click)="confirmUnlinkTenant()"
              [disabled]="unlinkingTenant"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50">
              <span *ngIf="!unlinkingTenant">Desvincular</span>
              <span *ngIf="unlinkingTenant">Desvinculando...</span>
            </button>
          </div>
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

  // Store details view properties
  viewMode: 'list' | 'details' = 'list';
  selectedStoreId: string | null = null;
  selectedStore: Store | null = null;
  loadingStoreDetails: boolean = false;

  // Propriedades para modais de confirmação
  showDeactivateModal = false;
  showUnlinkTenantModal = false;
  deactivatingStore = false;
  unlinkingTenant = false;
  storeToDeactivate: Store | null = null;
  storeToUnlinkTenant: Store | null = null;

  // Propriedades para filtros
  filterForm: FormGroup;
  showFilters = false;
  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'VAGA', label: 'Vaga' },
    { value: 'OCUPADA', label: 'Ocupada' },
    { value: 'INATIVA', label: 'Inativa' }
  ];

  // Contadores derivados para o template (evitam arrow functions no HTML)
  get occupiedCount(): number {
    return this.stores.filter(s => s.status === 'OCUPADA').length;
  }

  get vacantCount(): number {
    return this.stores.filter(s => s.status === 'VAGA').length;
  }

  get maintenanceCount(): number {
    return this.stores.filter(s => s.status === 'MANUTENCAO').length;
  }
  
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

    this.filterForm = this.fb.group({
      nome: [''],
      status: [''],
      numero: [''],
      localizacao: ['']
    });
  }

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(page: number = this.currentPage, filters?: any): void {
    this.loading = true;
    this.error = null;

    const params: PaginationParams = {
      page: page,
      limit: this.itemsPerPage,
      ...filters
    };

    this.storeService.getStores(params).subscribe({
      next: (response: StoreResponse)  =>  {
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

  // Tenant unlinking methods
  unlinkTenant(store: Store): void {
    if (!store.inquilino) {
      return;
    }

    // Show confirmation dialog
    if (!confirm(`Tem certeza que deseja desvincular o inquilino ${store.inquilino.nome} da loja ${store.nome}?`)) {
      return;
    }

    this.assigningTenant = true;
    this.tenantError = null;

    this.storeService.unlinkTenant(store.id).subscribe({
      next: () => {
        this.assigningTenant = false;
        this.loadStores(); // Reload stores to show updated data
        // Update selected store if in details view
        if (this.viewMode === 'details' && this.selectedStore) {
          this.loadStoreDetails(this.selectedStore.id);
        }
      },
      error: (error) => {
        this.tenantError = error.message;
        this.assigningTenant = false;
      }
    });
  }

  // O fluxo de desvinculação de usuário usa o mesmo modal de confirmação



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
          
          // Se estamos na visualização de detalhes, atualiza os dados da loja selecionada
          if (this.viewMode === 'details' && this.selectedStore && this.selectedStore.id === this.editingStore!.id) {
            this.loadStoreDetails(this.editingStore!.id);
          }
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

  onAssignTenant(store?: Store): void {
    if (store) {
      // Called from details view
      this.currentStoreForTenant = store;
      this.openTenantModal(store);
      return;
    }

    // Original logic for modal
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
        // Update selected store if in details view
        if (this.viewMode === 'details' && this.selectedStore) {
          this.loadStoreDetails(this.selectedStore.id);
        }
      },
      error: (error) => {
        this.tenantError = error.message;
        this.assigningTenant = false;
      }
    });
  }

  onRemoveTenant(store?: Store): void {
    if (store) {
      // Called from details view - use the new unlink endpoint
      this.unlinkTenant(store);
      return;
    }

    // Original logic for modal
    if (!this.currentStoreForTenant) {
      return;
    }

    this.assigningTenant = true;
    this.tenantError = null;
    // Use DELETE /desvincular/:id for tenant unlinking
    this.storeService.unlinkTenant(this.currentStoreForTenant.id).subscribe({
      next: () => {
        this.assigningTenant = false;
        this.closeTenantModal();
        this.loadStores(); // Reload stores to show updated data
        // Update selected store if in details view
        if (this.viewMode === 'details' && this.selectedStore) {
          this.loadStoreDetails(this.selectedStore.id);
        }
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
      const currentFilters = this.getCurrentFilters();
      this.loadStores(page, currentFilters);
    }
  }

  private getCurrentFilters(): any {
    const filters = this.filterForm.value;
    return Object.keys(filters).reduce((acc: any, key) => {
      if (filters[key] && filters[key].trim() !== '') {
        acc[key] = filters[key].trim();
      }
      return acc;
    }, {});
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      const currentFilters = this.getCurrentFilters();
      this.loadStores(this.currentPage - 1, currentFilters);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      const currentFilters = this.getCurrentFilters();
      this.loadStores(this.currentPage + 1, currentFilters);
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

  // Métodos de filtros
  applyFilters(): void {
    const filters = this.filterForm.value;
    
    // Remove campos vazios do filtro
    const cleanFilters = Object.keys(filters).reduce((acc: any, key) => {
      if (filters[key] && filters[key].trim() !== '') {
        acc[key] = filters[key].trim();
      }
      return acc;
    }, {});
    
    this.currentPage = 1; // Resetar para primeira página
    this.loadStores(1, cleanFilters);
  }

  clearFilters(): void {
    this.filterForm.reset({
      nome: '',
      status: '',
      numero: '',
      localizacao: ''
    });
    this.currentPage = 1;
    this.loadStores(1); // Recarregar sem filtros
  }

  // Store details methods
  viewStoreDetails(store: Store): void {
    this.selectedStore = store;
    this.selectedStoreId = store.id;
    this.viewMode = 'details';
    this.loadStoreDetails(store.id);
  }

  loadStoreDetails(storeId: string): void {
    this.loadingStoreDetails = true;
    this.storeService.getStoreById(storeId).subscribe({
      next: (store: Store) => {
        this.selectedStore = store;
        this.loadingStoreDetails = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar detalhes da loja:', error);
        this.loadingStoreDetails = false;
      }
    });
  }

  backToStoresList(): void {
    this.viewMode = 'list';
    this.selectedStore = null;
    this.selectedStoreId = null;
  }

  // Métodos para modal de desativar loja
  openDeactivateModal(store: Store): void {
    this.storeToDeactivate = store;
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void {
    this.showDeactivateModal = false;
    this.storeToDeactivate = null;
    this.deactivatingStore = false;
  }

  confirmDeactivateStore(): void {
    if (!this.storeToDeactivate) return;

    this.deactivatingStore = true;
    this.storeService.deactivateStore(this.storeToDeactivate.id).subscribe({
      next: () => {
        // Atualizar a lista de lojas
        this.loadStores();
        // Se estamos na visualização de detalhes da loja desativada, voltar para a lista
        if (this.viewMode === 'details' && this.selectedStore?.id === this.storeToDeactivate?.id) {
          this.backToStoresList();
        }
        // Atualizar os detalhes se ainda estamos visualizando a mesma loja
        else if (this.viewMode === 'details' && this.selectedStore?.id === this.storeToDeactivate?.id && this.storeToDeactivate) {
          this.loadStoreDetails(this.storeToDeactivate.id);
        }
        this.closeDeactivateModal();
      },
      error: (error) => {
        console.error('Erro ao desativar loja:', error);
        this.deactivatingStore = false;
        // Aqui você pode adicionar uma notificação de erro
      }
    });
  }

  // Métodos para modal de desvincular inquilino
  openUnlinkTenantModal(store: Store): void {
    this.storeToUnlinkTenant = store;
    this.showUnlinkTenantModal = true;
  }

  closeUnlinkTenantModal(): void {
    this.showUnlinkTenantModal = false;
    this.storeToUnlinkTenant = null;
    this.unlinkingTenant = false;
  }

  confirmUnlinkTenant(): void {
    if (!this.storeToUnlinkTenant) return;

    this.unlinkingTenant = true;

    // Se houver inquilino vinculado, usa o endpoint de desvincular inquilino (DELETE)
    if (this.storeToUnlinkTenant.usuario) {
      this.storeService.unlinkTenant(this.storeToUnlinkTenant.id).subscribe({
        next: () => {
          this.loadStores();
          const id = this.storeToUnlinkTenant?.id;
          if (this.viewMode === 'details' && id && this.selectedStore?.id === id) {
            this.loadStoreDetails(id);
          }
          this.closeUnlinkTenantModal();
        },
        error: (error) => {
          console.error('Erro ao desvincular inquilino:', error);
          this.unlinkingTenant = false;
        }
      });
      return;
    }

    // Se houver usuário vinculado, usa o update para limpar usuarioId
    if (this.storeToUnlinkTenant.usuario) {
      const id = this.storeToUnlinkTenant.id;
      this.storeService.updateStore(id, { usuarioId: null }).subscribe({
        next: () => {
          this.loadStores();
          if (this.viewMode === 'details' && this.selectedStore?.id === id) {
            this.loadStoreDetails(id);
          }
          this.closeUnlinkTenantModal();
        },
        error: (error) => {
          console.error('Erro ao desvincular usuário:', error);
          this.unlinkingTenant = false;
        }
      });
      return;
    }

    // Caso não haja vínculo, apenas fecha o modal
    this.unlinkingTenant = false;
    this.closeUnlinkTenantModal();
  }

  getUnlinkTargetLabel(): string {
    if (!this.storeToUnlinkTenant) {
      return 'o vínculo atual';
    }
    const store = this.storeToUnlinkTenant;
    if (store.inquilino) {
      const nome = store.inquilino.nome || '';
      return `o inquilino ${nome}`;
    }
    if (store.usuario) {
      const nome = store.usuario.nome || '';
      return `o usuário ${nome}`;
    }
    return 'o vínculo atual';
  }
}