import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

interface Tenant {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  telefone: string | null;
}

interface TenantsResponse {
  sucesso: boolean;
  inquilinos: Tenant[];
}

interface EnviarPredefinidasPayload {
  tipo: TipoNotificacao;
  mensagem: string;
  assunto?: string;
  inquilinoId?: string;
}

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 sm:p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.93 4.93l9.07 9.07-9.07 9.07L4.93 4.93z"/>
              </svg>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Central de Notificações</h1>
          </div>
          <p class="text-slate-600 text-sm sm:text-lg max-w-3xl">
            Gerencie e envie notificações personalizadas para seus inquilinos através do sistema ou por e-mail.
          </p>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Formulário Principal -->
          <div class="xl:col-span-2">
            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <!-- Header do Card -->
              <div class="bg-slate-50/80 backdrop-blur px-5 py-4 border-b border-slate-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-100 rounded-lg">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                    </div>
                    <h2 class="text-xl font-semibold text-slate-900">Compor Notificação</h2>
                  </div>
                  <div class="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-emerald-700 text-sm font-medium">Online</span>
                  </div>
                </div>
              </div>

              <!-- Conteúdo do Formulário -->
              <div class="p-5 space-y-5">
                <!-- Configurações Rápidas -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Destinatário -->
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Destinatário
                    </label>
                    <div class="relative">
                      <select 
                        class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer"
                        [(ngModel)]="selectedTenantId"
                        name="destinatario">
                        <option [ngValue]="null" class="text-gray-500">Todos os inquilinos</option>
                        <option *ngFor="let t of tenants" [ngValue]="t.id" class="text-gray-900">
                          {{ t.nome }} • {{ t.email }}
                        </option>
                      </select>
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ selectedTenantId ? 'Enviando para inquilino específico' : 'Enviando para todos os inquilinos' }}
                    </div>
                  </div>

                  <!-- Tipo de Notificação -->
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Tipo de Notificação
                    </label>
                    <div class="relative">
                      <select 
                        class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer"
                        [(ngModel)]="form.tipo"
                        name="tipo">
                        <option [ngValue]="TipoNotificacao.PAGAMENTO_VENCIDO" class="text-gray-900">Pagamento vencido</option>
                        <option [ngValue]="TipoNotificacao.PAGAMENTO_PROXIMO_VENCIMENTO" class="text-gray-900">Pagamento próximo</option>
                        <option [ngValue]="TipoNotificacao.PAGAMENTO_REALIZADO" class="text-gray-900">Pagamento realizado</option>
                        <option [ngValue]="TipoNotificacao.CONTRATO_VENCIMENTO" class="text-gray-900">Contrato próximo</option>
                        <option [ngValue]="TipoNotificacao.GERAL" class="text-gray-900">Geral</option>
                      </select>
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Assunto -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Assunto
                    <span class="text-xs font-normal text-slate-500">(opcional)</span>
                  </label>
                  <input 
                    type="text" 
                    class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    [class]="isAssuntoValido() ? 'border-slate-200' : 'border-red-300 ring-2 ring-red-100'"
                    [(ngModel)]="form.assunto" 
                    name="assunto" 
                    [placeholder]="getDefaultSubject(form.tipo)"
                    maxlength="200" />
                  <div class="flex items-center justify-between">
                    <div class="text-xs" [class]="isAssuntoValido() ? 'text-slate-500' : 'text-red-600'">
                      {{ isAssuntoValido() ? 'Assunto válido' : 'Máximo 200 caracteres' }}
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 transition-all duration-300" [style.width.%]="assuntoProgress"></div>
                      </div>
                      <span class="text-xs text-slate-500 font-mono">{{ assuntoLength }}/200</span>
                    </div>
                  </div>
                </div>

                <!-- Mensagem -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                    </svg>
                    Mensagem
                  </label>
                  <textarea 
                    rows="6"
                    class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    [class]="isMensagemValida() ? 'border-slate-200' : 'border-red-300 ring-2 ring-red-100'"
                    [(ngModel)]="form.mensagem" 
                    name="mensagem" 
                    placeholder="Escreva sua mensagem aqui..."
                    maxlength="500"></textarea>
                  <div class="flex items-center justify-between">
                    <div class="text-xs" [class]="isMensagemValida() ? 'text-slate-500' : 'text-red-600'">
                      {{ isMensagemValida() ? 'Mensagem válida' : 'Mensagem é obrigatória (1-500 caracteres)' }}
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 transition-all duration-300" [style.width.%]="mensagemProgress"></div>
                      </div>
                      <span class="text-xs text-slate-500 font-mono">{{ mensagemLength }}/500</span>
                    </div>
                  </div>
                </div>

                <!-- Ações -->
                <div class="flex flex-wrap gap-3 pt-4">
                  <button 
                    class="w-full sm:w-auto flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50"
                    (click)="sendSystemNotification()" 
                    [disabled]="sendingSystem || !isFormValido()">
                    <svg *ngIf="!sendingSystem" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <svg *ngIf="sendingSystem" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>{{ sendingSystem ? 'Enviando...' : 'Enviar no Sistema' }}</span>
                  </button>

                  <button 
                    class="w-full sm:w-auto flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50"
                    (click)="sendEmailNotification()" 
                    [disabled]="sendingEmail || !isFormValido()">
                    <svg *ngIf="!sendingEmail" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <svg *ngIf="sendingEmail" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>{{ sendingEmail ? 'Enviando...' : 'Enviar por Email' }}</span>
                  </button>

                  <button 
                    class="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    (click)="resetForm()" 
                    [disabled]="sendingSystem || sendingEmail">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Limpar
                  </button>
                </div>

                <!-- Feedback -->
                <div class="space-y-3">
                  <div *ngIf="sendResult" class="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-green-700 font-medium">{{ sendResult }}</span>
                  </div>
                  <div *ngIf="sendError" class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-red-700 font-medium">{{ sendError }}</span>
                  </div>
                </div>

                <!-- Preview -->
                <div class="border border-slate-200 bg-slate-50 p-5 rounded-2xl">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span class="text-sm font-semibold text-slate-900">Prévia da Notificação</span>
                  </div>
                  <div class="text-sm text-slate-800 space-y-1">
                    <div><span class="font-medium">Tipo:</span> {{ getTipoLabel(form.tipo) }}</div>
                    <div><span class="font-medium">Assunto:</span> {{ (form.assunto || getDefaultSubject(form.tipo)) }}</div>
                    <div><span class="font-medium">Destinatário:</span> {{ destinatarioLabel }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Inquilinos -->
          <div class="xl:col-span-1">
            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden sticky top-6">
              <!-- Header do Card -->
              <div class="bg-slate-50/80 backdrop-blur px-5 py-4 border-b border-slate-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-100 rounded-lg">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <h2 class="text-xl font-semibold text-slate-900">Lista de Inquilinos</h2>
                  </div>
                  <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {{ filteredTenants.length }} {{ filteredTenants.length === 1 ? 'inquilino' : 'inquilinos' }}
                  </span>
                </div>
              </div>

              <!-- Busca -->
              <div class="p-4 sm:p-6 border-b border-slate-100">
                <div class="space-y-4">
                  <div class="relative">
                    <input 
                      type="text" 
                      class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      [(ngModel)]="tenantSearchTerm" 
                      name="tenantSearch"
                      placeholder="Buscar inquilinos..."
                      (ngModelChange)="onTenantSearchChange()" />
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      class="px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      [(ngModel)]="tenantNameInput" 
                      name="tenantName"
                      placeholder="Nome" />
                    <input 
                      type="text" 
                      class="px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      [(ngModel)]="tenantEmailInput" 
                      name="tenantEmail"
                      placeholder="Email" />
                  </div>

                  <div class="flex gap-2">
                    <button 
                      class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                      (click)="searchTenants()" 
                      [disabled]="loading">
                      {{ loading ? 'Buscando...' : 'Aplicar Filtros' }}
                    </button>
                    <button 
                      class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                      (click)="clearTenantSearch()" 
                      [disabled]="!tenantSearchTerm && !tenantNameInput && !tenantEmailInput">
                      Limpar
                    </button>
                  </div>
                </div>
              </div>

              <!-- Lista -->
              <div class="p-4 max-h-96 overflow-y-auto">
                <div *ngIf="loading" class="flex items-center justify-center py-8">
                  <div class="flex items-center gap-3 text-slate-500">
                    <svg class="animate-spin h-5 w-5 text-slate-600" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Carregando inquilinos...</span>
                  </div>
                </div>

                <div *ngIf="error" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {{ error }}
                </div>

                <div *ngIf="tenants.length === 0 && !loading && !error" class="text-center py-8 text-slate-500">
                  <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <p>Nenhum inquilino encontrado</p>
                </div>

                <div class="space-y-3">
                  <div *ngFor="let t of filteredTenants" 
                       class="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
                       [class.border-slate-300]="selectedTenantId === t.id"
                       (click)="selectedTenantId = t.id">
                    <div class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <p class="text-slate-900 font-semibold truncate">{{ t.nome }}</p>
                        <p class="text-slate-600 text-sm truncate">{{ t.email }}</p>
                        <p *ngIf="t.telefone" class="text-slate-500 text-xs mt-1">{{ t.telefone }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <div *ngIf="selectedTenantId === t.id" class="w-2 h-2 bg-slate-600 rounded-full"></div>
                        <button class="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:border-slate-300 hover:text-slate-800 transition-colors duration-200 group-hover:border-slate-300">
                          Selecionar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificacoesComponent implements OnInit {
  tenants: Tenant[] = [];
  filteredTenants: Tenant[] = [];
  loading = false;
  error: string | null = null;
  tenantSearchTerm: string = '';
  tenantNameInput: string = '';
  tenantEmailInput: string = '';

  // Estado do formulário de envio
  TipoNotificacao = TipoNotificacao;
  form: { tipo: TipoNotificacao; assunto: string; mensagem: string } = {
    tipo: TipoNotificacao.GERAL,
    assunto: '',
    mensagem: ''
  };
  selectedTenantId: string | null = null;
  sendingSystem = false;
  sendingEmail = false;
  sendResult: string | null = null;
  sendError: string | null = null;

  private NOTIF_API_URL = `${environment.apiBaseUrl}/api/notificacao`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.token;
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Helpers de formulário
  isMensagemValida(): boolean {
    const len = (this.form.mensagem || '').trim().length;
    return len >= 1 && len <= 500;
  }

  isAssuntoValido(): boolean {
    const len = (this.form.assunto || '').trim().length;
    return len === 0 || (len >= 1 && len <= 200);
  }

  isFormValido(): boolean {
    return !!this.form.tipo && this.isMensagemValida() && this.isAssuntoValido();
  }

  resetForm(): void {
    this.form.assunto = '';
    this.form.mensagem = '';
    this.sendResult = null;
    this.sendError = null;
  }

  getDefaultSubject(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.PAGAMENTO_VENCIDO:
        return 'Pagamento vencido';
      case TipoNotificacao.PAGAMENTO_PROXIMO_VENCIMENTO:
        return 'Pagamento próximo do vencimento';
      case TipoNotificacao.PAGAMENTO_REALIZADO:
        return 'Pagamento realizado';
      case TipoNotificacao.CONTRATO_VENCIMENTO:
        return 'Contrato próximo do vencimento';
      case TipoNotificacao.GERAL:
      default:
        return 'Aviso geral';
    }
  }

  getTipoLabel(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.PAGAMENTO_VENCIDO:
        return 'Pagamento vencido';
      case TipoNotificacao.PAGAMENTO_PROXIMO_VENCIMENTO:
        return 'Pagamento próximo do vencimento';
      case TipoNotificacao.PAGAMENTO_REALIZADO:
        return 'Pagamento realizado';
      case TipoNotificacao.CONTRATO_VENCIMENTO:
        return 'Contrato próximo do vencimento';
      case TipoNotificacao.GERAL:
      default:
        return 'Geral';
    }
  }

  get destinatarioLabel(): string {
    if (this.selectedTenantId) {
      const t = this.tenants.find(tt => tt.id === this.selectedTenantId);
      return t ? `${t.nome} (${t.email})` : 'Inquilino selecionado';
    }
    return 'Todos os inquilinos';
  }

  get mensagemLength(): number { return (this.form.mensagem || '').length; }
  get assuntoLength(): number { return (this.form.assunto || '').length; }
  get mensagemProgress(): number {
    const len = (this.form.mensagem || '').length;
    return Math.min(100, Math.round((len / 500) * 100));
  }
  get assuntoProgress(): number {
    const len = (this.form.assunto || '').length;
    return Math.min(100, Math.round((len / 200) * 100));
  }

  // Métodos de envio (mantidos da versão original)
  sendSystemNotification(): void {
    if (!this.isFormValido()) {
      this.sendError = 'Formulário inválido. Verifique os campos.';
      this.sendResult = null;
      return;
    }

    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e: any) {
      this.sendError = e?.message || 'Erro de autenticação';
      this.sendResult = null;
      return;
    }

    const payload: EnviarPredefinidasPayload = {
      tipo: this.form.tipo,
      mensagem: this.form.mensagem.trim()
    };
    const assuntoTrim = (this.form.assunto || '').trim();
    if (assuntoTrim.length > 0) {
      payload.assunto = assuntoTrim;
    }
    if (this.selectedTenantId) {
      payload.inquilinoId = this.selectedTenantId;
    }

    this.sendingSystem = true;
    this.sendError = null;
    this.sendResult = null;

    const url = `${this.NOTIF_API_URL}/enviar-sistema`;
    this.http.post<{ sucesso?: boolean; message?: string }>(url, payload, { headers }).subscribe({
      next: (res) => {
        this.sendingSystem = false;
        this.sendResult = res?.message || 'Notificações no sistema enviadas com sucesso!';
      },
      error: (err) => {
        this.sendingSystem = false;
        if (err?.status === 403) {
          this.sendError = 'Você não tem permissão para enviar notificações.';
        } else {
          this.sendError = err?.error?.message || 'Erro ao enviar notificações no sistema.';
        }
      }
    });
  }

  sendEmailNotification(): void {
    if (!this.isFormValido()) {
      this.sendError = 'Formulário inválido. Verifique os campos.';
      this.sendResult = null;
      return;
    }

    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e: any) {
      this.sendError = e?.message || 'Erro de autenticação';
      this.sendResult = null;
      return;
    }

    const payload: EnviarPredefinidasPayload = {
      tipo: this.form.tipo,
      mensagem: this.form.mensagem.trim()
    };
    const assuntoTrim = (this.form.assunto || '').trim();
    if (assuntoTrim.length > 0) {
      payload.assunto = assuntoTrim;
    }
    if (this.selectedTenantId) {
      payload.inquilinoId = this.selectedTenantId;
    }

    this.sendingEmail = true;
    this.sendError = null;
    this.sendResult = null;

    const url = `${this.NOTIF_API_URL}/enviar-email`;
    this.http.post<{ sucesso?: boolean; message?: string }>(url, payload, { headers }).subscribe({
      next: (res) => {
        this.sendingEmail = false;
        this.sendResult = res?.message || 'Notificações por email enviadas com sucesso!';
      },
      error: (err) => {
        this.sendingEmail = false;
        if (err?.status === 403) {
          this.sendError = 'Você não tem permissão para enviar notificações por email.';
        } else {
          this.sendError = err?.error?.message || 'Erro ao enviar notificações por email.';
        }
      }
    });
  }

  onTenantSearchChange(): void {
    this.applyTenantFilter();
  }

  clearTenantSearch(): void {
    this.tenantSearchTerm = '';
    this.tenantNameInput = '';
    this.tenantEmailInput = '';
    this.applyTenantFilter();
  }

  searchTenants(): void {
    this.loadTenants();
  }

  private buildTenantSearchParams(): HttpParams {
    let params = new HttpParams();
    const nameRaw = (this.tenantNameInput || '').trim();
    const emailRaw = (this.tenantEmailInput || '').trim();
    const raw = (this.tenantSearchTerm || '').trim();

    if (nameRaw) {
      params = params.set('nome', nameRaw);
    }
    if (emailRaw) {
      params = params.set('email', emailRaw);
    }
    if (nameRaw || emailRaw) {
      return params;
    }

    if (!raw) return params;

    const lower = raw.toLowerCase();
    if (lower.startsWith('email:')) {
      const value = raw.slice(6).trim();
      if (value) params = params.set('email', value);
    } else if (lower.startsWith('nome:')) {
      const value = raw.slice(5).trim();
      if (value) params = params.set('nome', value);
    } else if (raw.includes('@')) {
      params = params.set('email', raw);
    } else {
      params = params.set('q', raw);
    }
    return params;
  }

  private applyTenantFilter(): void {
    const nameTerm = (this.tenantNameInput || '').trim().toLowerCase();
    const emailTerm = (this.tenantEmailInput || '').trim().toLowerCase();
    const term = (this.tenantSearchTerm || '').trim();

    if (nameTerm || emailTerm) {
      this.filteredTenants = this.tenants.filter(t =>
        (!nameTerm || (t.nome || '').toLowerCase().includes(nameTerm)) &&
        (!emailTerm || (t.email || '').toLowerCase().includes(emailTerm))
      );
      return;
    }

    if (!term) {
      this.filteredTenants = [...this.tenants];
      return;
    }

    const lower = term.toLowerCase();
    if (lower.startsWith('email:')) {
      const value = term.slice(6).trim().toLowerCase();
      this.filteredTenants = this.tenants.filter(t => (t.email || '').toLowerCase().includes(value));
      return;
    }
    if (lower.startsWith('nome:')) {
      const value = term.slice(5).trim().toLowerCase();
      this.filteredTenants = this.tenants.filter(t => (t.nome || '').toLowerCase().includes(value));
      return;
    }
    if (term.includes('@')) {
      const value = term.toLowerCase();
      this.filteredTenants = this.tenants.filter(t => (t.email || '').toLowerCase().includes(value));
      return;
    }
    const value = term.toLowerCase();
    this.filteredTenants = this.tenants.filter(t =>
      (t.nome || '').toLowerCase().includes(value) || (t.email || '').toLowerCase().includes(value)
    );
  }

  private loadTenants(): void {
    this.loading = true;
    this.error = null;

    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e: any) {
      this.loading = false;
      this.error = e?.message || 'Erro de autenticação';
      return;
    }

    const url = `${environment.apiBaseUrl}/api/usuario/inquilinos`;
    const params = this.buildTenantSearchParams();

    this.http.get<TenantsResponse | { sucesso?: boolean; inquilinos?: Tenant[] } | Tenant[]>(url, { headers, params })
      .subscribe({
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.tenants = response as Tenant[];
          } else if (response?.inquilinos) {
            this.tenants = response.inquilinos as Tenant[];
          } else {
            this.tenants = [];
          }
          this.applyTenantFilter();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar inquilinos:', err);
          this.error = err?.error?.message || 'Erro ao buscar inquilinos';
          this.loading = false;
        }
      });
  }
}

enum TipoNotificacao {
  PAGAMENTO_VENCIDO = 'PAGAMENTO_VENCIDO',
  PAGAMENTO_PROXIMO_VENCIMENTO = 'PAGAMENTO_PROXIMO_VENCIMENTO',
  PAGAMENTO_REALIZADO = 'PAGAMENTO_REALIZADO',
  CONTRATO_VENCIMENTO = 'CONTRATO_VENCIMENTO',
  GERAL = 'GERAL'
}