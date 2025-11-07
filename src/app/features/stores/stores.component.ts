import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { trigger, transition, style, animate } from '@angular/animations';
import { StoreService, Store, CreateStoreData, UpdateStoreData, StoreResponse, PaginationParams, Tenant, TenantsResponse } from './store.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
  <div class="min-h-screen  p-4 sm:p-6">
  <!-- Store List View -->
  <div *ngIf="viewMode === 'list'">
    <!-- Header -->
    <div class="mb-6 sm:mb-8" [@fadeIn]>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-2">Gerenciamento de Lojas</h1>
      <p class="text-gray-600 text-sm sm:text-base">Visualize e gerencie todas as propriedades</p>
    </div>

    <!-- Loading Indicator -->
    <div *ngIf="loading" class="flex justify-center items-center py-8 sm:py-12" [@fadeIn]>
      <div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-blue-600 text-sm sm:text-base">Carregando lojas...</span>
    </div>

    <!-- Error Message -->
    <div *ngIf="error && !loading" class="bg-red-100 border border-red-400 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6" [@fadeIn]>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle text-red-500 mr-2 sm:mr-3 text-sm sm:text-base"></i>
          <span class="text-red-700 text-sm sm:text-base">{{ error }}</span>
        </div>
        <button 
          (click)="loadStores()" 
          class="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base">
          <i class="fas fa-redo mr-1 sm:mr-2"></i>
          Tentar Novamente
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div *ngIf="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8" [@slideIn]>
      <div class="bg-white backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-xs sm:text-sm">Total de Lojas</p>
            <p class="text-xl sm:text-2xl font-bold text-blue-900">{{ totalItems }}</p>
          </div>
          <div class="bg-blue-100 p-2 sm:p-3 rounded-lg">
            <!-- Ícone SVG: grade (total) -->
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <rect x="3" y="3" width="6" height="6" rx="1"></rect>
              <rect x="11" y="3" width="6" height="6" rx="1"></rect>
              <rect x="3" y="11" width="6" height="6" rx="1"></rect>
              <rect x="11" y="11" width="6" height="6" rx="1"></rect>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-xs sm:text-sm">Lojas Ocupadas</p>
            <p class="text-xl sm:text-2xl font-bold text-red-600">{{ occupiedCount }}</p>
          </div>
          <div class="bg-red-100 p-2 sm:p-3 rounded-lg">
            <!-- Ícone SVG: círculo com X (ocupadas) -->
            <svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="9" class="text-red-600" fill="currentColor"></circle>
              <path d="M7 7 L13 13 M13 7 L7 13" stroke="white" stroke-width="2" stroke-linecap="round"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-xs sm:text-sm">Lojas Vagas</p>
            <p class="text-xl sm:text-2xl font-bold text-green-600">{{ vacantCount }}</p>
          </div>
          <div class="bg-green-100 p-2 sm:p-3 rounded-lg">
            <!-- Ícone SVG: círculo com check (vagas) -->
            <svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="9" class="text-green-600" fill="currentColor"></circle>
              <path d="M6 10 L9 13 L14 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-xs sm:text-sm">Lojas Inativas</p>
            <p class="text-xl sm:text-2xl font-bold text-amber-600">{{ inactiveCount }}</p>
          </div>
          <div class="bg-amber-100 p-2 sm:p-3 rounded-lg">
            <!-- Ícone SVG: círculo com traço (inativas) -->
            <svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="9" class="text-amber-600" fill="currentColor"></circle>
              <rect x="5" y="9" width="10" height="2" rx="1" fill="white"></rect>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Bar -->
    <div *ngIf="!loading && !error" class="mb-6 flex flex-col gap-4" [@slideIn]>
      <!-- Botões principais -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button 
          (click)="openCreateModal()"
          class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
          <i class="fas fa-plus mr-2"></i>
          Nova Loja
        </button>
        <button 
          (click)="showFilters = !showFilters" 
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
          <i class="fas fa-filter mr-2"></i>
          Filtros
        </button>
      </div>
      
      <!-- Busca e Filtros -->
      <div class="flex flex-col lg:flex-row gap-3">

        

      </div>
    </div>

    <!-- Seção de Filtros -->
    <div *ngIf="showFilters && !loading && !error" class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-4 sm:p-6 mb-6" [@slideIn]>
      <form [formGroup]="filterForm" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Filtro por Nome -->
          <div>
            <label for="filterNome" class="block text-sm font-medium text-blue-700 mb-1">Nome da Loja</label>
            <input
              id="filterNome"
              type="text"
              formControlName="nome"
              placeholder="Buscar por nome..."
              class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
            />
          </div>

          <!-- Filtro por Status -->
          <div>
            <label for="filterStatus" class="block text-sm font-medium text-blue-700 mb-1">Status</label>
            <select
              id="filterStatus"
              formControlName="status"
              class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
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
              class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
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
              class="w-full bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 sm:gap-3 mt-2">
          <button
            type="button"
            (click)="clearFilters()"
            class="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors text-sm sm:text-base">
            Limpar
          </button>
          <button
            type="button"
            (click)="applyFilters()"
            class="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
            <i class="fas fa-check mr-1 sm:mr-2"></i>
            Aplicar filtros
          </button>
        </div>
      </form>
    </div>

    <!-- Pagination dentro de filtros removida para padronização com Usuários -->

    <!-- Stores Grid -->
    <div *ngIf="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" [@fadeIn]>
      <!-- Empty State -->
      <div *ngIf="stores.length === 0" class="col-span-full text-center py-8 sm:py-12">
        <i class="fas fa-store text-4xl sm:text-6xl text-blue-400 mb-3 sm:mb-4"></i>
        <h3 class="text-lg sm:text-xl font-semibold text-blue-700 mb-2">Nenhuma loja encontrada</h3>
        <p class="text-blue-600 text-sm sm:text-base">Não há lojas cadastradas para esta empresa.</p>
      </div>
      
      <div *ngFor="let store of stores; trackBy: trackByStoreId" 
           class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 overflow-hidden hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl cursor-pointer"
           [ngClass]="{
             'border-l-4 border-red-400': store.status === 'OCUPADA',
             'border-l-4 border-green-400': store.status === 'VAGA',
             'border-l-4 border-amber-400': store.status === 'INATIVA'
           }"
           [@cardHover]
           (click)="viewStoreDetails(store)">
        
        <!-- Store Info -->
        <div class="p-4 sm:p-6">
          <div class="flex justify-between items-start mb-3 sm:mb-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg sm:text-xl font-bold text-blue-900 truncate">{{ store.nome }}</h3>
              <span class="text-blue-600 font-bold text-sm sm:text-base">#{{ store.numero }}</span>
            </div>
            <!-- Status no topo direito -->
            <span [ngClass]="{
              'bg-red-500': store.status === 'OCUPADA',
              'bg-green-500': store.status === 'VAGA',
              'bg-amber-500': store.status === 'INATIVA'
            }" class="px-2 sm:px-3 py-1 sm:py-1 rounded-full text-xs font-semibold text-white shadow whitespace-nowrap">
              {{ store.status === 'OCUPADA' ? 'Ocupada' : store.status === 'VAGA' ? 'Vaga' : 'Inativa' }}
            </span>
          </div>
          
          <div class="space-y-2 sm:space-y-3">
            <div class="flex items-center text-blue-700">
              <i class="fas fa-map-marker-alt w-4 sm:w-5 text-blue-500 mr-2 sm:mr-3 text-sm"></i>
              <span class="text-sm truncate">{{ store.localizacao }}</span>
            </div>
            
            <div class="flex items-center text-blue-700">
              <i class="fas fa-calendar-plus w-4 sm:w-5 text-blue-500 mr-2 sm:mr-3 text-sm"></i>
              <span class="text-sm">{{ store.criadoEm | date:'dd/MM/yyyy' }}</span>
            </div>

            <div *ngIf="store.m2 !== undefined" class="flex items-center text-blue-700">
              <i class="fas fa-ruler-combined w-4 sm:w-5 text-blue-500 mr-2 sm:mr-3 text-sm"></i>
              <span class="text-sm">{{ store.m2 }} m²</span>
            </div>
            
            <div class="flex items-center text-blue-700">
              <i class="fas fa-file-contract w-4 sm:w-5 text-blue-500 mr-2 sm:mr-3 text-sm"></i>
              <span class="text-sm">{{ store.contratos?.length || 0 }} contrato(s)</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="mt-4 sm:mt-6 flex gap-2">
            <button 
              (click)="openEditModal(store); $event.stopPropagation()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-xs sm:text-sm">
              <i class="fas fa-edit mr-1 sm:mr-2"></i>
              Editar
            </button>
            <button
              *ngIf="store.inquilino"
              (click)="openUnlinkTenantModal(store); $event.stopPropagation()"
              class="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-xs sm:text-sm">
              <i class="fas fa-user-times mr-1 sm:mr-2"></i>
              Desvincular
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination (estilo alinhado ao Usuários) -->
    <div *ngIf="totalItems > 0" class="bg-blue-50 px-6 py-3 flex items-center justify-between border border-blue-200 rounded-lg mt-8" [@slideIn]>
      <!-- Mobile -->
      <div class="flex-1 flex justify-between sm:hidden">
        <button (click)="goToPreviousPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
          Anterior
        </button>
        <button (click)="goToNextPage()" [disabled]="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
          Próximo
        </button>
      </div>
      <!-- Desktop -->
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-blue-700">
            Mostrando <span class="font-medium">{{(currentPage - 1) * itemsPerPage + 1}}</span> a 
            <span class="font-medium">{{currentPage * itemsPerPage < totalItems ? currentPage * itemsPerPage : totalItems}}</span> 
            de <span class="font-medium">{{totalItems}}</span> lojas
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button (click)="goToPreviousPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50 disabled:opacity-50">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
            <span class="relative inline-flex items-center px-4 py-2 border border-blue-300 bg-white text-sm font-medium text-blue-700">
              {{currentPage}} de {{totalPages}}
            </span>
            <button (click)="goToNextPage()" [disabled]="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50 disabled:opacity-50">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Criação de Loja -->
  <div *ngIf="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto border border-blue-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg sm:text-xl font-semibold text-blue-900">Nova Loja</h3>
        <button 
          (click)="closeCreateModal()"
          class="text-blue-600 hover:text-blue-800">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900 text-sm sm:text-base"
            placeholder="Digite o nome da loja">
          <div *ngIf="getFieldError('nome')" class="text-red-500 text-xs sm:text-sm mt-1">
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
            class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900 text-sm sm:text-base"
            placeholder="Digite o número da loja">
          <div *ngIf="getFieldError('numero')" class="text-red-500 text-xs sm:text-sm mt-1">
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
            class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900 text-sm sm:text-base"
            placeholder="Digite a localização da loja">
          <div *ngIf="getFieldError('localizacao')" class="text-red-500 text-xs sm:text-sm mt-1">
            {{ getFieldError('localizacao') }}
          </div>
        </div>
        <!-- Metragem (m²) -->
        <div class="mb-4">
          <label for="m2" class="block text-sm font-medium text-blue-700 mb-1">Metragem (m²)</label>
          <input
            type="number"
            id="m2"
            formControlName="m2"
            min="0"
            class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900 text-sm sm:text-base"
            placeholder="Ex.: 42"
          />
          <div *ngIf="getFieldError('m2')" class="text-red-500 text-xs sm:text-sm mt-1">
            {{ getFieldError('m2') }}
          </div>
        </div>

        <!-- Erro de criação -->
        <div *ngIf="createError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-red-600 text-sm">{{ createError }}</p>
        </div>

        <!-- Botões -->
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <button 
            type="button"
            (click)="closeCreateModal()"
            class="px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors text-sm sm:text-base">
            Cancelar
          </button>
          <button 
            type="submit"
            [disabled]="createForm.invalid || creating"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
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
  <div *ngIf="showEditModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-4 sm:p-6 lg:p-8 w-full max-w-lg mx-auto shadow-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <div class="flex items-center">
          <div class="bg-blue-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
            <i class="fas fa-edit text-blue-600 text-lg sm:text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-blue-900">Editar Loja</h2>
            <p class="text-blue-600 text-xs sm:text-sm">Atualize as informações da loja</p>
          </div>
        </div>
        <button 
          (click)="closeEditModal()" 
          class="text-blue-600 hover:text-blue-800 transition-colors p-1 sm:p-2 hover:bg-blue-50 rounded-lg">
          <i class="fas fa-times text-lg sm:text-xl"></i>
        </button>
      </div>
      
      <form [formGroup]="editForm" (ngSubmit)="onSubmitEdit()" class="space-y-4 sm:space-y-6">
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
            class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
            placeholder="Digite o nome da loja"
          />
          <div *ngIf="getEditFieldError('nome')" class="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
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
            class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
            placeholder="Digite o número da loja"
          />
          <div *ngIf="getEditFieldError('numero')" class="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
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
            class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
            placeholder="Digite a localização da loja"
          />
          <div *ngIf="getEditFieldError('localizacao')" class="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ getEditFieldError('localizacao') }}
          </div>
        </div>
        <!-- Metragem (m²) -->
        <div>
          <label for="editm2" class="block text-sm font-semibold text-blue-700 mb-2">
            <i class="fas fa-ruler-combined text-blue-600 mr-2"></i>
            Metragem (m²)
          </label>
          <input
            id="editm2"
            type="number"
            formControlName="m2"
            min="0"
            class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
            placeholder="Ex.: 42"
          />
          <div *ngIf="getEditFieldError('m2')" class="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ getEditFieldError('m2') }}
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
            class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
          >
            <option value="" class="bg-white">Selecione o status</option>
            <option value="VAGA" class="bg-white">Vaga</option>
            <option value="OCUPADA" class="bg-white">Ocupada</option>
            <option value="INATIVA" class="bg-white">Inativa</option>
          </select>
          <div *ngIf="getEditFieldError('status')" class="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ getEditFieldError('status') }}
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="editError" class="bg-red-100 border border-red-400 rounded-lg p-3 sm:p-4">
          <div class="flex items-center text-red-700">
            <i class="fas fa-exclamation-triangle mr-2 sm:mr-3"></i>
            <span class="text-sm">{{ editError }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            (click)="closeEditModal()"
            class="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-gray-300 text-sm sm:text-base"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="editForm.invalid || editing"
            class="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-sm sm:text-base"
          >
            <i class="fas fa-save mr-2" *ngIf="!editing"></i>
            <i class="fas fa-spinner fa-spin mr-2" *ngIf="editing"></i>
            <span *ngIf="!editing">Salvar</span>
            <span *ngIf="editing">Salvando...</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Store Details View -->
  <div *ngIf="viewMode === 'details'">
    <!-- Header with Back Button -->
    <div class="mb-6 sm:mb-8" [@fadeIn]>
      <button 
        (click)="backToStoresList()"
        class="mb-3 sm:mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base">
        <i class="fas fa-arrow-left mr-2"></i>
        Voltar para Lista de Lojas
      </button>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-2">Detalhes da Loja</h1>
      <p class="text-blue-600 text-sm sm:text-base">Visualize e gerencie informações da loja</p>
    </div>

    <!-- Loading Store Details -->
    <div *ngIf="loadingStoreDetails" class="flex justify-center items-center py-8 sm:py-12" [@fadeIn]>
      <div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-blue-600 text-sm sm:text-base">Carregando detalhes da loja...</span>
    </div>

    <!-- Store Details Content -->
    <div *ngIf="!loadingStoreDetails && selectedStore" class="space-y-4 sm:space-y-6" [@fadeIn]>
      <!-- Store Info Card -->
      <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-4 sm:p-6">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 sm:mb-6">
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-blue-900 mb-2 truncate">{{ selectedStore.nome }}</h2>
            <p class="text-blue-600 text-sm sm:text-base">Loja #{{ selectedStore.numero }}</p>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">

            <div class="flex flex-wrap gap-2">
              <button 
                (click)="openEditModal(selectedStore)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm">
                <i class="fas fa-edit mr-1 sm:mr-2"></i>
                Editar
              </button>
              <button 
                *ngIf="selectedStore.inquilino"
                (click)="openUnlinkTenantModal(selectedStore)"
                class="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm">
                <i class="fas fa-user-times mr-1 sm:mr-2"></i>
                Desvincular
              </button>
              <button 
                (click)="openDeactivateModal(selectedStore)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm">
                <i class="fas fa-ban mr-1 sm:mr-2"></i>
                Desativar
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 class="text-lg font-semibold text-blue-700 mb-3">Informações Básicas</h3>
            <div class="space-y-2 sm:space-y-3">
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-24 flex-shrink-0">Nome:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.nome }}</span>
              </div>
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-24 flex-shrink-0">Número:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">#{{ selectedStore.numero }}</span>
              </div>
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-24 flex-shrink-0">Localização:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.localizacao }}</span>
              </div>
              <div *ngIf="selectedStore.m2 !== undefined" class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-24 flex-shrink-0">Metragem:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.m2 }} m²</span>
              </div>
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-24 flex-shrink-0">Status:</span>
                <span class="flex-1">
                  <span
                    class="text-white text-xs sm:text-sm px-2 py-1 rounded-full"
                    [ngClass]="{
                      'bg-green-500': selectedStore?.status === 'VAGA',
                      'bg-red-500': selectedStore?.status === 'OCUPADA',
                      'bg-amber-500': selectedStore?.status === 'INATIVA'
                    }"
                  >
                    {{ selectedStore?.status === 'OCUPADA' ? 'Ocupada' : selectedStore?.status === 'VAGA' ? 'Vaga' : 'Inativa' }}
                  </span>
                </span>
              </div>
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-24 flex-shrink-0">Criado em:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
          </div>

          <!-- Informações da Empresa -->
          <div *ngIf="selectedStore.empresa">
            <h3 class="text-lg font-semibold text-blue-700 mb-3">Empresa</h3>
            <div class="space-y-2 sm:space-y-3">
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-20 flex-shrink-0">Nome:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.empresa.nome }}</span>
              </div>
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-20 flex-shrink-0">CNPJ:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.empresa.cnpj }}</span>
              </div>
            </div>
          </div>

          <!-- Informações do Inquilino/Responsável -->
          <div class="lg:col-span-2">
            <h3 class="text-lg font-semibold text-blue-700 mb-3">Inquilino</h3>
            
            <!-- Informações do Usuário (quando há usuário vinculado) -->
            <div *ngIf="selectedStore.usuario" class="space-y-3 mb-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 class="text-sm font-medium text-blue-700 mb-2">Usuário Vinculado</h4>
                <div class="space-y-2">
                  <div class="flex flex-col sm:flex-row">
                    <span class="text-blue-600 text-sm sm:text-base w-20 flex-shrink-0">Nome:</span>
                    <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.usuario.nome }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row">
                    <span class="text-blue-600 text-sm sm:text-base w-20 flex-shrink-0">Email:</span>
                    <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.usuario.email }}</span>
                  </div>
                </div>
              </div>
              <div class="flex">
                <button
                  (click)="openUnlinkTenantModal(selectedStore)"
                  [disabled]="unlinkingTenant"
                  class="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm">
                  <i class="fas fa-user-minus mr-1 sm:mr-2"></i>
                  Desvincular Usuário
                </button>
              </div>
            </div>
            
            <!-- Informações do Inquilino -->
            <div *ngIf="selectedStore.inquilino" class="space-y-2 sm:space-y-3">
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-32 flex-shrink-0">Nome do Inquilino:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.inquilino.nome }}</span>
              </div>
              <div class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-32 flex-shrink-0">Email do Inquilino:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.inquilino.email }}</span>
              </div>
              <div *ngIf="selectedStore.inquilino.cpf" class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-32 flex-shrink-0">CPF:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.inquilino.cpf }}</span>
              </div>
              <div *ngIf="selectedStore.inquilino.telefone" class="flex flex-col sm:flex-row">
                <span class="text-blue-600 text-sm sm:text-base w-32 flex-shrink-0">Telefone:</span>
                <span class="text-blue-900 text-sm sm:text-base flex-1">{{ selectedStore.inquilino.telefone }}</span>
              </div>
            </div>
            
            <div *ngIf="!selectedStore.inquilino && !selectedStore.usuario" class="text-blue-600">
              <p class="mb-3 sm:mb-4 text-sm sm:text-base">Nenhum inquilino vinculado</p>
              <button 
                (click)="onAssignTenant(selectedStore)"
                class="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm">
                <i class="fas fa-user-plus mr-1 sm:mr-2"></i>
                Vincular Inquilino
              </button>
            </div>
          </div>

          <!-- Contratos -->
          <div *ngIf="selectedStore.contratos && selectedStore.contratos.length > 0" class="lg:col-span-2">
            <h3 class="text-lg font-semibold text-blue-700 mb-3">Contratos</h3>
            <div class="space-y-2">
              <div *ngFor="let contrato of selectedStore.contratos" class="bg-blue-50 p-3 rounded-lg">
                <div class="text-blue-900 text-sm sm:text-base">Contrato #{{ contrato.id || 'N/A' }}</div>
                <div class="text-blue-600 text-xs sm:text-sm">{{ contrato.descricao || 'Sem descrição' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação - Desativar Loja -->
  <div *ngIf="showDeactivateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" [@fadeIn]>
    <div class="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto border border-blue-200">
      <div class="flex items-center mb-3 sm:mb-4">
        <i class="fas fa-exclamation-triangle text-red-500 text-xl sm:text-2xl mr-2 sm:mr-3"></i>
        <h3 class="text-lg sm:text-xl font-bold text-blue-900">Confirmar Desativação</h3>
      </div>
      <p class="text-blue-600 mb-4 sm:mb-6 text-sm sm:text-base">
        Tem certeza que deseja desativar a loja <strong class="text-blue-800">{{ storeToDeactivate?.nome }}</strong>?
        Esta ação pode afetar contratos e inquilinos vinculados.
      </p>
      <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button 
          (click)="closeDeactivateModal()"
          [disabled]="deactivatingStore"
          class="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
          Cancelar
        </button>
        <button 
          (click)="confirmDeactivateStore()"
          [disabled]="deactivatingStore"
          class="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
          <span *ngIf="!deactivatingStore">Desativar</span>
          <span *ngIf="deactivatingStore">Desativando...</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Vincular Inquilino -->
  <div *ngIf="showTenantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" [@fadeIn]>
    <div class="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto border border-blue-200">
      <div class="flex items-center mb-3 sm:mb-4">
        <i class="fas fa-user-plus text-green-600 text-xl sm:text-2xl mr-2 sm:mr-3"></i>
        <h3 class="text-lg sm:text-xl font-bold text-blue-900">Vincular Inquilino</h3>
      </div>
      <p class="text-blue-600 mb-4 sm:mb-6 text-sm sm:text-base">
        Selecione um inquilino para vincular à loja
        <span class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-semibold text-sm ml-1">
          {{ currentStoreForTenant?.nome }}
        </span>.
      </p>

      <!-- Loading Tenants -->
      <div *ngIf="loadingTenants" class="flex items-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-blue-600 text-sm">Carregando inquilinos...</span>
      </div>

      <!-- Error Tenants -->
      <div *ngIf="tenantError && !loadingTenants" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-red-600 text-sm">{{ tenantError }}</p>
      </div>

      <!-- Select Tenant -->
      <div *ngIf="!loadingTenants" class="space-y-3">
        <label class="block text-sm font-medium text-blue-700">Inquilino</label>
        <select [(ngModel)]="selectedTenant" class="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm">
          <option [ngValue]="null">Selecione um inquilino</option>
          <option *ngFor="let t of tenants" [ngValue]="t.id">{{ t.nome }} - {{ t.email }}</option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
        <button 
          (click)="closeTenantModal()"
          [disabled]="assigningTenant"
          class="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
          Cancelar
        </button>
        <button 
          (click)="onAssignTenant()"
          [disabled]="!selectedTenant || assigningTenant"
          class="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
          <span *ngIf="!assigningTenant">Vincular</span>
          <span *ngIf="assigningTenant">Vinculando...</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação - Desvincular Inquilino -->
  <div *ngIf="showUnlinkTenantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" [@fadeIn]>
    <div class="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto border border-blue-200">
      <div class="flex items-center mb-3 sm:mb-4">
        <i class="fas fa-user-times text-orange-500 text-xl sm:text-2xl mr-2 sm:mr-3"></i>
        <h3 class="text-lg sm:text-xl font-bold text-blue-900">Confirmar Desvinculação</h3>
      </div>
      <div class="mb-4 sm:mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p class="text-blue-700 text-sm sm:text-base">
          Você está prestes a desvincular 
          <span class="font-semibold text-blue-900">{{ getUnlinkTargetLabel() }}</span>
          da loja 
          <span class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-semibold text-sm">
            {{ storeToUnlinkTenant?.nome }}
          </span>.
        </p>
        <p class="text-blue-500 text-xs sm:text-sm mt-2">
          Após confirmar, o vínculo será removido e os dados permanecerão intactos.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button 
          (click)="closeUnlinkTenantModal()"
          [disabled]="unlinkingTenant"
          class="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
          Cancelar
        </button>
        <button 
          (click)="confirmUnlinkTenant()"
          [disabled]="unlinkingTenant"
          class="px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
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

  get inactiveCount(): number {
    return this.stores.filter(s => s.status === 'INATIVA').length;
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
      m2: [null, [Validators.min(0)]],
    });
    
    this.editForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(1)]],
      numero: ['', [Validators.required, Validators.minLength(1)]],
      localizacao: ['', [Validators.required, Validators.minLength(1)]],
      m2: [null, [Validators.min(0)]],
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

    // Auto-aplicar filtros com debounce para evitar chamadas excessivas
    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.applyFilters();
      });
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
        m2: formData.m2 != null && formData.m2 !== '' ? Number(formData.m2) : undefined,
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
      m2: null,
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
      m2: store.m2 ?? null,
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
        m2: formData.m2 != null && formData.m2 !== '' ? Number(formData.m2) : undefined,
        status: formData.status
      };

      const editedStoreId = this.editingStore.id;
      this.storeService.updateStore(editedStoreId, updateData).subscribe({
        next: (updatedStore) => {
          this.editing = false;
          this.closeEditModal();
          this.loadStores(); // Recarrega a lista de lojas
          
          // Se estamos na visualização de detalhes, atualiza os dados da loja selecionada
          if (this.viewMode === 'details' && this.selectedStore && this.selectedStore.id === editedStoreId) {
            this.loadStoreDetails(editedStoreId);
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
      if (field.errors?.['min']) {
        return `Valor mínimo é ${field.errors['min'].min}`;
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
      if (field.errors?.['min']) {
        return `Valor mínimo é ${field.errors['min'].min}`;
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