import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../auth/auth.service';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Schema de validaÃ§Ã£o para criar inquilino
interface CriarInquilinoData {
  nome: string;
  email: string;
  senha: string;
}

interface ApiPaginationResponse {
  sucesso: boolean;
  paginacao: {
    paginaAtual: number;
    totalPaginas: number;
    totalUsuarios: number;
    limite: number;
    temProximaPagina: boolean;
    temPaginaAnterior: boolean;
  };
  usuarios: any[];
}

enum TipoUsuario {
  ADMIN_EMPRESA = 'ADMIN_EMPRESA',    // UsuÃ¡rio principal da empresa que pode criar outros usuÃ¡rios
  FUNCIONARIO = 'FUNCIONARIO',        // FuncionÃ¡rio da empresa
  INQUILINO = 'INQUILINO',            // Inquilino (pode ser criado por usuÃ¡rios da empresa)
  VISITANTE = 'VISITANTE'             // Visitante
}

@Component({
  selector: 'app-users',
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
    ])
  ],
  template: `
    <div class="min-h-screen p-4 sm:p-6">
      <!-- Header -->
      <div class="mb-8" [@fadeIn]>
        <h1 class="text-2xl sm:text-4xl font-bold text-blue-800 mb-2">Gerenciamento de Usuários</h1>
        <p class="text-sm sm:text-base text-gray-600">Gerencie todos os usuários do sistema com busca e filtros</p>
      </div>

      <!-- Modal para Criar Inquilino -->
      <div *ngIf="showCreateTenantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@fadeIn]>
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 border border-blue-200">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-blue-700">Criar Novo Inquilino</h2>
            <button (click)="closeCreateTenantModal()" class="text-gray-500 hover:text-blue-800 transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form [formGroup]="createTenantForm" (ngSubmit)="onCreateTenant()">
            <!-- Nome -->
            <div class="mb-4">
              <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                id="nome"
                type="text"
                formControlName="nome"
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Nome completo do inquilino"
              >
              <div *ngIf="createTenantForm.get('nome')?.invalid && createTenantForm.get('nome')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="createTenantForm.get('nome')?.errors?.['required']">Nome Ã© obrigatÃ³rio!</span>
              </div>
            </div>
            
            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="email@exemplo.com"
              >
              <div *ngIf="createTenantForm.get('email')?.invalid && createTenantForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="createTenantForm.get('email')?.errors?.['required']">Email Ã© obrigatÃ³rio!</span>
                <span *ngIf="createTenantForm.get('email')?.errors?.['email']">Email invÃ¡lido</span>
              </div>
            </div>
            
            <!-- Senha -->
            <div class="mb-6">
              <label for="senha" class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                id="senha"
                type="password"
                formControlName="senha"
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Senha (mÃ­nimo 6 caracteres)"
              >
              <div *ngIf="createTenantForm.get('senha')?.invalid && createTenantForm.get('senha')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="createTenantForm.get('senha')?.errors?.['required']">Senha Ã© obrigatÃ³ria!</span>
                <span *ngIf="createTenantForm.get('senha')?.errors?.['minlength']">Senha deve ter no mÃ­nimo 6 caracteres</span>
              </div>
            </div>
            
            <!-- BotÃµes -->
            <div class="flex gap-3">
              <button
                type="button"
                (click)="closeCreateTenantModal()"
                class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="createTenantForm.invalid || isCreatingTenant"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isCreatingTenant">Criar Inquilino</span>
                <span *ngIf="isCreatingTenant" class="flex items-center justify-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Criando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- NotificaÃ§Ã£o -->
      <div *ngIf="notification.show" class="fixed top-4 right-4 z-50" [@slideIn]>
        <div [ngClass]="{
          'bg-green-100 border-green-400': notification.type === 'success',
          'bg-red-100 border-red-400': notification.type === 'error',
          'bg-blue-100 border-blue-400': notification.type === 'info'
        }" class="border rounded-lg p-4 shadow-lg max-w-sm">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <i [ngClass]="{
                'fas fa-check-circle text-green-500': notification.type === 'success',
                'fas fa-exclamation-circle text-red-500': notification.type === 'error',
                'fas fa-info-circle text-blue-500': notification.type === 'info'
              }"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
            </div>
            <div class="ml-auto pl-3">
              <button (click)="hideNotification()" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de confirmaÃ§Ã£o de desativaÃ§Ã£o -->
      <div *ngIf="showDeactivateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@fadeIn]>
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 border border-blue-200">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-blue-700">Desativar Usuário</h2>
            <button (click)="closeDeactivateModal()" class="text-gray-500 hover:text-blue-800 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="text-gray-700 mb-6">
            <p>Tem certeza que deseja desativar o usuário <span class="font-semibold">{{ userToDeactivate?.name }}</span>?</p>
            <p class="text-sm text-gray-500 mt-1">Esta ação impede o usuário de acessar o sistema.</p>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              (click)="closeDeactivateModal()"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="confirmDeactivateUser()"
              [disabled]="isDeactivating"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isDeactivating">Desativar</span>
              <span *ngIf="isDeactivating" class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Desativando...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmaÃ§Ã£o de ativaÃ§Ã£o -->
      <div *ngIf="showActivateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@fadeIn]>
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 border border-blue-200">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-blue-700">Ativar Usuário</h2>
            <button (click)="closeActivateModal()" class="text-gray-500 hover:text-blue-800 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="text-gray-700 mb-6">
            <p>Tem certeza que deseja ativar o usuário <span class="font-semibold">{{ userToActivate?.name }}</span>?</p>
            <p class="text-sm text-gray-500 mt-1">Esta ação permitirá o acesso do usuário ao sistema.</p>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              (click)="closeActivateModal()"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="confirmActivateUser()"
              [disabled]="isActivating"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isActivating">Ativar</span>
              <span *ngIf="isActivating" class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Ativando...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center" [@slideIn]>
        <div class="flex flex-col sm:flex-row gap-4">
          <button (click)="openCreateTenantModal()" class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg w-full sm:w-auto">
            <i class="fas fa-plus mr-2"></i>
            Novo Inquilino
          </button>

        </div>
        
        <div class="flex flex-wrap gap-4">
          <!-- Campo de busca -->
          <div class="relative flex-1 min-w-0 w-full sm:w-80 md:w-[28rem]">
            <input 
              type="text" 
              placeholder="Buscar por nome ou email..."
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
              class="bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 pl-10 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 w-full"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
          </div>
          
          <!-- Filtro por tipo -->
          <select 
            [(ngModel)]="selectedTypeFilter"
            (change)="onTypeFilterChange()"
            class="bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 min-w-48 w-full sm:w-auto">
            <option *ngFor="let type of userTypes" [value]="type.value">{{ type.label }}</option>
          </select>
          
          <!-- Filtro por status -->
          <select 
            [(ngModel)]="selectedStatusFilter"
            (change)="onStatusFilterChange()"
            class="bg-white backdrop-blur-sm border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 min-w-40 w-full sm:w-auto">
            <option *ngFor="let status of statusTypes" [value]="status.value">{{ status.label }}</option>
          </select>
          
          <!-- BotÃ£o limpar filtros -->
          <button 
            (click)="clearFilters()"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 w-full sm:w-auto">
            <i class="fas fa-times"></i>
            Limpar
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 overflow-hidden shadow-2xl" [@fadeIn]>
        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead class="bg-blue-50">
              <tr>
                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Usuário</th>
                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Email</th>
                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Tipo</th>
                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Último Acesso</th>
                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-blue-100">
              <tr *ngFor="let user of users" class="group hover:bg-blue-50 transition-colors duration-200">
                <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold mr-3 sm:mr-4 ring-2 ring-blue-200">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="text-sm sm:text-base font-semibold text-blue-900">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <a [href]="'mailto:' + user.email" class="text-sm text-blue-700 hover:text-blue-900 hover:underline truncate max-w-[240px] inline-block">{{ user.email }}</a>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-red-100 text-red-800 border-red-200': user.type === 'ADMIN_EMPRESA',
                    'bg-blue-100 text-blue-800 border-blue-200': user.type === 'FUNCIONARIO',
                    'bg-green-100 text-green-800 border-green-200': user.type === 'INQUILINO',
                    'bg-purple-100 text-purple-800 border-purple-200': user.type === 'VISITANTE'
                  }" class="inline-flex px-3 py-1 text-xs font-semibold rounded-full border shadow-sm">
                    {{ getUserTypeLabel(user.type) }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-green-100 text-green-800 border-green-200': user.ativo === true,
                    'bg-red-100 text-red-800 border-red-200': user.ativo === false
                  }" class="inline-flex px-3 py-1 text-xs font-semibold rounded-full border shadow-sm">
                    {{ user.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-700">
                  {{ user.lastAccess }}
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button *ngIf="user.ativo === true" class="p-2 rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2" title="Desativar" aria-label="Desativar usuário" (click)="openDeactivateModal(user)">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        <path d="M12 14c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z" />
                        <path stroke-linecap="round" d="M4 4l16 16" />
                      </svg>
                      <span class="hidden sm:inline text-sm font-semibold">Desativar</span>
                    </button>
                    <button *ngIf="user.ativo === false" class="p-2 rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2" title="Ativar" aria-label="Ativar usuário" (click)="openActivateModal(user)">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="hidden sm:inline text-sm font-semibold">Ativar</span>
                    </button>
                    <button
                      class="p-2 rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2"
                      title="Editar"
                      aria-label="Editar usuário"
                      (click)="openEditModal(user)"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 4h2a2 2 0 012 2v2m-1 5l-7 7H4v-3l7-7m4-4l3 3" />
                      </svg>
                      <span class="hidden sm:inline text-sm font-semibold">Editar</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="users.length === 0">
                <td colspan="6" class="px-6 py-10 text-center">
                  <div class="flex flex-col items-center text-blue-700">
                    <i class="fas fa-users-slash text-4xl mb-3"></i>
                  <p class="text-sm">Nenhum usuário encontrado para os filtros atuais.</p>
                    <button (click)="clearFilters()" class="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">Limpar filtros</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de edição de usuário -->
      <div
        *ngIf="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        [@fadeIn]
      >
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 border border-blue-200">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-blue-700">Editar Usuário</h2>
            <button (click)="closeEditModal()" class="text-gray-500 hover:text-blue-800 transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form [formGroup]="editForm" (ngSubmit)="onEditUser()">
            <div class="mb-4">
              <label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                id="edit-nome"
                type="text"
                formControlName="nome"
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Nome do usuário"
              >
              <div *ngIf="editForm.get('nome')?.invalid && editForm.get('nome')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="editForm.get('nome')?.errors?.['minlength']">Nome deve ter no mínimo 2 caracteres</span>
              </div>
            </div>

            <div class="mb-4">
              <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="edit-email"
                type="email"
                formControlName="email"
                class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="email@exemplo.com"
              >
              <div *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="editForm.get('email')?.errors?.['email']">Email inválido</span>
              </div>
            </div>

            <div class="mb-6">
              <label for="edit-tipo" class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select id="edit-tipo" formControlName="tipo" class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:border-blue-500">
                <option [ngValue]="null">(sem alteração)</option>
                <option value="ADMIN_EMPRESA">Admin da Empresa</option>
                <option value="FUNCIONARIO">Funcionário</option>
                <option value="INQUILINO">Inquilino</option>
                <option value="VISITANTE">Visitante</option>
              </select>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                (click)="closeEditModal()"
                class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="isEditing || !hasEditChanges() || editForm.invalid"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isEditing">Salvar alterações</span>
                <span *ngIf="isEditing" class="flex items-center justify-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Salvando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- Pagination (estilo alinhado ao invoices/lojas) -->
      <div *ngIf="totalItems > 0" class="bg-blue-50 px-6 py-3 flex items-center justify-between border border-blue-200 rounded-lg mt-8" [@slideIn]>
        <!-- Mobile -->
        <div class="flex-1 flex justify-between sm:hidden">
          <button (click)="goToPreviousPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
            Anterior
          </button>
          <button (click)="goToNextPage()" [disabled]="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
            PrÃ³ximo
          </button>
        </div>
        <!-- Desktop -->
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-blue-700">
              Mostrando <span class="font-medium">{{(currentPage - 1) * itemsPerPage + 1}}</span> a 
              <span class="font-medium">{{currentPage * itemsPerPage < totalItems ? currentPage * itemsPerPage : totalItems}}</span> 
              de <span class="font-medium">{{totalItems}}</span> usuÃ¡rios
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
  `
})
export class UsersComponent implements OnInit {
  // Propriedades do formulÃ¡rio
  createTenantForm: FormGroup;
  showCreateTenantModal = false;
  isCreatingTenant = false;
  
  // Propriedades da notificaÃ§Ã£o
  notification = {
    show: false,
    type: 'success' as 'success' | 'error' | 'info',
    title: '',
    message: ''
  };
  
  // Estado do diÃ¡logo de desativaÃ§Ã£o
  showDeactivateModal = false;
  isDeactivating = false;
  userToDeactivate: any | null = null;

  // Estado do diÃ¡logo de ativaÃ§Ã£o
  showActivateModal = false;
  isActivating = false;
  userToActivate: any | null = null;
  
  // Estado de edição de usuário
  showEditModal = false;
  isEditing = false;
  userToEdit: any | null = null;
  editForm!: FormGroup;
  
  // Propriedades de filtro
  selectedTypeFilter: TipoUsuario | 'todos' = 'todos';
  selectedStatusFilter: 'active' | 'inactive' | 'pending' | 'todos' = 'todos';
  searchTerm = '';
  
  // Lista de usuÃ¡rios original e filtrada
  allUsers: any[] = [];
  users: any[] = [];
  
  // Propriedades de paginaÃ§Ã£o
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  
  // Tipos de usuÃ¡rio disponÃ­veis
  userTypes: { value: TipoUsuario | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos os tipos' },
    { value: TipoUsuario.ADMIN_EMPRESA, label: 'Admin da Empresa' },
    { value: TipoUsuario.FUNCIONARIO, label: 'FuncionÃ¡rio' },
    { value: TipoUsuario.INQUILINO, label: 'Inquilino' },
    { value: TipoUsuario.VISITANTE, label: 'Visitante' }
  ];
  
  // Status disponÃ­veis
  statusTypes: { value: 'active' | 'inactive' | 'pending' | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
  ];
  
  private apiUrl = `${environment.apiBaseUrl}/api/usuario`;
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.createTenantForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit(): void {
    // Inicializa o formulário de edição para evitar erros de template com objeto possivelmente nulo
    this.editForm = this.fb.group({
      nome: ['', [Validators.minLength(2)]],
      email: ['', [Validators.email]],
      tipo: [null]
    });
    this.loadUsuariosDaEmpresa(1);
  }
  
  // MÃ©todos de filtro
  applyFilters() {
    this.currentPage = 1;
    this.loadUsuariosDaEmpresa(1);
  }
  
  onTypeFilterChange() {
    this.applyFilters();
  }
  
  onStatusFilterChange() {
    this.applyFilters();
  }
  
  onSearchChange() {
    this.applyFilters();
  }
  
  clearFilters() {
    this.selectedTypeFilter = 'todos';
    this.selectedStatusFilter = 'todos';
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadUsuariosDaEmpresa(1);
  }
  
  // MÃ©todo para obter o rÃ³tulo do tipo de usuÃ¡rio
  getUserTypeLabel(type: TipoUsuario): string {
    const typeObj = this.userTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }
  
  // MÃ©todos para o modal
  openCreateTenantModal(): void {
    this.showCreateTenantModal = true;
    this.createTenantForm.reset();
  }
  
  closeCreateTenantModal(): void {
    this.showCreateTenantModal = false;
    this.createTenantForm.reset();
  }
  
  // MÃ©todo para criar inquilino
  onCreateTenant(): void {
    if (this.createTenantForm.invalid) {
      this.createTenantForm.markAllAsTouched();
      return;
    }
    
    this.isCreatingTenant = true;
    const tenantData: CriarInquilinoData = this.createTenantForm.value;
    
    this.criarInquilino(tenantData).subscribe({
      next: (response) => {
        this.isCreatingTenant = false;
        this.closeCreateTenantModal();
        this.showNotification('success', 'Sucesso!', 'Inquilino criado com sucesso!');
        this.loadUsuariosDaEmpresa(this.currentPage); // Recarrega a pÃ¡gina atual
      },
      error: (error) => {
        this.isCreatingTenant = false;
        this.showNotification('error', 'Erro!', error.message || 'Erro ao criar inquilino');
      }
    });
  }
  
  // MÃ©todo para criar inquilino via API
  private criarInquilino(data: CriarInquilinoData): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.post(`${this.apiUrl}/criar-inquilino`, data, { headers })
        .pipe(
          catchError((error) => {
            console.error('Erro ao criar inquilino:', error);
            if (error.status === 401) {
              return throwError(() => new Error('Token de autenticaÃ§Ã£o invÃ¡lido ou expirado'));
            }
            return throwError(() => new Error(error.error?.message || 'Erro ao criar inquilino'));
          })
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }
  
  // MÃ©todo para listar usuÃ¡rios da empresa
  private loadUsuariosDaEmpresa(page: number = 1): void {
    try {
      const headers = this.getAuthHeaders();
      let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', this.itemsPerPage.toString());

      // Adicionar filtros se estiverem definidos
      if (this.selectedTypeFilter && this.selectedTypeFilter !== 'todos') {
        params = params.set('tipo', this.selectedTypeFilter);
      }
      if (this.selectedStatusFilter && this.selectedStatusFilter !== 'todos') {
        if (this.selectedStatusFilter === 'active') {
          params = params.set('ativo', 'true');
        } else if (this.selectedStatusFilter === 'inactive') {
          params = params.set('ativo', 'false');
        }
      }
      // Busca: usar q (genÃ©rico), ou nome/email especÃ­ficos
      if (this.searchTerm && this.searchTerm.trim()) {
        const raw = this.searchTerm.trim();
        const lower = raw.toLowerCase();

        // Suporte a prefixos explÃ­citos: "nome:" e "email:"
        if (lower.startsWith('email:')) {
          const emailValue = raw.slice(raw.indexOf(':') + 1).trim();
          if (emailValue) {
            params = params.set('email', emailValue);
          }
        } else if (lower.startsWith('nome:')) {
          const nomeValue = raw.slice(raw.indexOf(':') + 1).trim();
          if (nomeValue) {
            params = params.set('nome', nomeValue);
          }
        } else if (/@/.test(raw)) {
          // HeurÃ­stica: se contÃ©m '@', tratar como filtro de email especÃ­fico
          params = params.set('email', raw);
        } else {
          // Busca genÃ©rica por qualquer termo (nome OU email)
          params = params.set('q', raw);
        }
      }


      
      this.http.get<ApiPaginationResponse>(`${this.apiUrl}/empresa/usuarios`, { headers, params })
        .pipe(
          catchError((error) => {
            console.error('Erro ao carregar usuÃ¡rios:', error);
            if (error.status === 401) {
              this.showNotification('error', 'Erro de AutenticaÃ§Ã£o', 'Token invÃ¡lido ou expirado. FaÃ§a login novamente.');
            } else {
              this.showNotification('error', 'Erro!', 'Erro ao carregar usuÃ¡rios da empresa');
            }
            
            // Retornar estrutura de fallback com paginaÃ§Ã£o aninhada
            return of({
              sucesso: false,
              paginacao: {
                paginaAtual: 1,
                totalPaginas: 1,
                totalUsuarios: 0,
                limite: this.itemsPerPage,
                temProximaPagina: false,
                temPaginaAnterior: false
              },
              usuarios: []
            } as ApiPaginationResponse);
          })
        )
        .subscribe((response: ApiPaginationResponse) => {
          // Atualizar propriedades de paginaÃ§Ã£o
          this.currentPage = response.paginacao.paginaAtual;
          this.totalPages = response.paginacao.totalPaginas;
          this.totalItems = response.paginacao.totalUsuarios;
          this.hasNextPage = response.paginacao.temProximaPagina;
          this.hasPreviousPage = response.paginacao.temPaginaAnterior;
          
          // Mapear usuÃ¡rios da resposta
           if (response.usuarios && response.usuarios.length > 0) {
             this.users = response.usuarios.map((user: any) => ({
               id: user.id,
               name: user.nome || user.name,
               email: user.email,
               type: this.mapApiTypeToEnum(user.tipo || user.type),
               ativo: user.ativo === true, // usar booleano 'ativo' vindo do backend
               status: user.ativo === true ? 'active' : 'inactive', // manter compatibilidade interna se usado em outros pontos
               lastAccess: user.ultimoAcesso || user.lastAccess || 'Nunca'
             }));
           } else {
             this.users = [];
           }
        });
    } catch (error: any) {
       this.showNotification('error', 'Erro de AutenticaÃ§Ã£o', error.message);
       // Definir valores padrÃ£o em caso de erro
       this.users = [];
       this.currentPage = 1;
       this.totalPages = 1;
       this.totalItems = 0;
       this.hasNextPage = false;
       this.hasPreviousPage = false;
     }
  }
  
  // MÃ©todo auxiliar para mapear tipos da API para o enum
  private mapApiTypeToEnum(apiType: string): TipoUsuario {
    switch (apiType?.toUpperCase()) {
      case 'ADMIN_EMPRESA':
      case 'ADMIN':
        return TipoUsuario.ADMIN_EMPRESA;
      case 'FUNCIONARIO':
        return TipoUsuario.FUNCIONARIO;
      case 'INQUILINO':
        return TipoUsuario.INQUILINO;
      case 'VISITANTE':
        return TipoUsuario.VISITANTE;
      default:
        return TipoUsuario.VISITANTE; // Valor padrÃ£o
    }
  }
  
  // MÃ©todo para obter headers de autenticaÃ§Ã£o
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.token;
    if (!token) {
      this.showNotification('error', 'Erro de AutenticaÃ§Ã£o', 'Token de acesso nÃ£o encontrado. FaÃ§a login novamente.');
      throw new Error('Token de autenticaÃ§Ã£o nÃ£o encontrado');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  // MÃ©todos para notificaÃ§Ã£o
  showNotification(type: 'success' | 'error' | 'info', title: string, message: string): void {
    this.notification = {
      type,
      title,
      message,
      show: true
    };
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }
  
  hideNotification(): void {
    this.notification.show = false;
  }
  
  // AÃ§Ãµes de desativaÃ§Ã£o de usuÃ¡rio
  openDeactivateModal(user: any): void {
    this.userToDeactivate = user;
    this.showDeactivateModal = true;
  }
  
  closeDeactivateModal(): void {
    this.showDeactivateModal = false;
    this.userToDeactivate = null;
    this.isDeactivating = false;
  }
  
  confirmDeactivateUser(): void {
    if (!this.userToDeactivate?.id) {
      this.showNotification('error', 'Erro', 'UsuÃ¡rio invÃ¡lido para desativaÃ§Ã£o.');
      return;
    }
    try {
      const headers = this.getAuthHeaders();
      this.isDeactivating = true;
      this.http.patch(`${this.apiUrl}/desativar/${this.userToDeactivate.id}`, {}, { headers })
        .pipe(
          catchError((error) => {
            console.error('Erro ao desativar usuÃ¡rio:', error);
            if (error.status === 401) {
              this.showNotification('error', 'Erro de AutenticaÃ§Ã£o', 'Token invÃ¡lido ou expirado. FaÃ§a login novamente.');
            } else {
              const message = error?.error?.message || 'Erro ao desativar usuÃ¡rio';
              this.showNotification('error', 'Erro!', message);
            }
            return throwError(() => error);
          })
        )
        .subscribe({
          next: () => {
            this.isDeactivating = false;
            this.closeDeactivateModal();
            this.showNotification('success', 'Sucesso!', 'UsuÃ¡rio desativado com sucesso!');
            this.loadUsuariosDaEmpresa(this.currentPage);
          },
          error: () => {
            this.isDeactivating = false;
          }
        });
    } catch (error: any) {
      this.isDeactivating = false;
      this.showNotification('error', 'Erro', error.message || 'Erro inesperado ao desativar usuÃ¡rio');
    }
  }

  // AÃ§Ãµes de ativaÃ§Ã£o de usuÃ¡rio
  openActivateModal(user: any): void {
    this.userToActivate = user;
    this.showActivateModal = true;
  }

  closeActivateModal(): void {
    this.showActivateModal = false;
    this.userToActivate = null;
    this.isActivating = false;
  }

  confirmActivateUser(): void {
    if (!this.userToActivate?.id) {
      this.showNotification('error', 'Erro', 'UsuÃ¡rio invÃ¡lido para ativaÃ§Ã£o.');
      return;
    }
    try {
      const headers = this.getAuthHeaders();
      this.isActivating = true;
      this.http.patch(`${this.apiUrl}/ativar/${this.userToActivate.id}`, {}, { headers })
        .pipe(
          catchError((error) => {
            console.error('Erro ao ativar usuÃ¡rio:', error);
            if (error.status === 401) {
              this.showNotification('error', 'Erro de AutenticaÃ§Ã£o', 'Token invÃ¡lido ou expirado. FaÃ§a login novamente.');
            } else {
              const message = error?.error?.message || 'Erro ao ativar usuÃ¡rio';
              this.showNotification('error', 'Erro!', message);
            }
            return throwError(() => error);
          })
        )
        .subscribe({
          next: () => {
            this.isActivating = false;
            this.closeActivateModal();
            this.showNotification('success', 'Sucesso!', 'UsuÃ¡rio ativado com sucesso!');
            this.loadUsuariosDaEmpresa(this.currentPage);
          },
          error: () => {
            this.isActivating = false;
          }
        });
    } catch (error: any) {
      this.isActivating = false;
      this.showNotification('error', 'Erro', error.message || 'Erro inesperado ao ativar usuÃ¡rio');
    }
  }
  
  // MÃ©todos de navegaÃ§Ã£o de paginaÃ§Ã£o
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadUsuariosDaEmpresa(page);
    }
  }

  goToPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.loadUsuariosDaEmpresa(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.loadUsuariosDaEmpresa(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDisplayRange(): string {
    if (this.totalItems === 0) return '0';
    
    const start = ((this.currentPage - 1) * this.itemsPerPage) + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    
    return `${start} a ${end}`;
  }
  
  // Métodos de edição de usuário
  openEditModal(user: any): void {
    this.userToEdit = user;
    this.editForm = this.fb.group({
      nome: [user?.nome || '', [Validators.minLength(2)]],
      email: [user?.email || '', [Validators.email]],
      tipo: [null]
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.userToEdit = null;
    this.isEditing = false;
  }

  hasEditChanges(): boolean {
    if (!this.editForm || !this.userToEdit) return false;
    const v = this.editForm.value as any;
    const nomeChanged = (v.nome?.trim() ?? '') !== ((this.userToEdit.nome ?? '') as string).trim();
    const emailChanged = (v.email?.trim() ?? '') !== ((this.userToEdit.email ?? '') as string).trim();
    const tipoChanged = !!v.tipo;
    return !!(nomeChanged || emailChanged || tipoChanged);
  }

  onEditUser(): void {
    if (!this.editForm || !this.userToEdit?.id) {
      this.showNotification('error','Erro','Formulário inválido ou usuário não selecionado.');
      return;
    }
    const v = this.editForm.value as any;
    const body: any = {};
    if (v.nome && v.nome.trim() !== ((this.userToEdit.nome ?? '') as string).trim()) body.nome = v.nome.trim();
    if (v.email && v.email.trim() !== ((this.userToEdit.email ?? '') as string).trim()) body.email = v.email.trim();
    if (v.tipo) body.tipo = v.tipo;
    if (Object.keys(body).length === 0) {
      this.showNotification('info','Sem alterações','Nenhuma alteração detectada.');
      return;
    }
    try {
      const headers = this.getAuthHeaders();
      this.isEditing = true;
      this.http.patch(`${this.apiUrl}/editar/${this.userToEdit.id}`, body, { headers })
        .pipe(
          catchError((error) => {
            console.error('Erro ao editar usuário:', error);
            if (error.status === 401) {
              this.showNotification('error','Erro de Autenticação','Token inválido ou expirado. Faça login novamente.');
            } else {
              const message = error?.error?.message || 'Erro ao editar usuário';
              this.showNotification('error','Erro!', message);
            }
            return throwError(() => error);
          })
        )
        .subscribe({
          next: () => {
            this.isEditing = false;
            this.closeEditModal();
            this.showNotification('success','Sucesso!','Usuário atualizado com sucesso!');
            this.loadUsuariosDaEmpresa(this.currentPage);
          },
          error: () => {
            this.isEditing = false;
          }
        });
    } catch (error: any) {
      this.isEditing = false;
      this.showNotification('error', 'Erro', error.message || 'Erro inesperado ao editar usuário');
    }
  }
}
