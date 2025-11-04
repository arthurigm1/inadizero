import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService } from '../tenant.service';
import { IPortalInquilinoData, ILojaInquilino, IFaturaInquilino, INotificacaoInquilino, StatusFatura } from '../tenant.interfaces';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { TenantInvoicesComponent } from '../components/tenant-invoices.component';
import { TenantContractsComponent } from '../components/tenant-contracts.component';
import { TenantStoresComponent } from '../components/tenant-stores.component';
import { TenantSettingsComponent } from '../components/tenant-settings.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tenant-portal',
  standalone: true,
  imports: [
    CommonModule, 
    TenantInvoicesComponent, 
    TenantContractsComponent, 
    TenantStoresComponent, 
    TenantSettingsComponent,
    HttpClientModule
  ],
  template: `
   <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-25 relative overflow-hidden" [@pageEnter]>
  
  <!-- Background Elements Sutil -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300/10 rounded-full blur-3xl"></div>
  </div>

  <!-- Header Simplificado -->
  <header class="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm" [@headerSlide]>
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <div>
          <h1 class="text-base sm:text-lg font-bold text-blue-900">Portal do Inquilino</h1>
        </div>
        
        <!-- User Menu -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Notifications Dropdown -->
          <div class="relative">
<button (click)="toggleNotificationsMenu()" class="relative p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
  </svg>
  <span *ngIf="unreadNotifications > 0" 
        class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
    {{ unreadNotifications }}
  </span>
</button>

            <!-- Dropdown de Notificações -->
            <div *ngIf="notificationsMenuOpen" class="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-blue-100 py-2 z-50">
              <div class="flex items-center justify-between px-3 py-2 border-b border-blue-50">
                <span class="text-sm font-semibold text-blue-900">Notificações</span>
                <div class="flex items-center gap-2">
                  <button (click)="openNotificationsPanel()" class="text-xs text-blue-600 hover:text-blue-800">Abrir painel</button>
                  <button (click)="markAllNotificationsAsRead()" class="text-xs text-blue-600 hover:text-blue-800">Marcar todas lidas</button>
                  <button (click)="closeNotificationsMenu()" class="text-xs text-gray-500 hover:text-gray-700">Fechar</button>
                </div>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div *ngFor="let n of portalData?.notificacoes" class="px-3 py-2 hover:bg-blue-50 flex items-start gap-2">
                  <div class="mt-0.5">
                    <span [ngClass]="n.lida ? 'bg-gray-300' : 'bg-blue-600'" class="inline-block w-2 h-2 rounded-full"></span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-blue-900 truncate">{{ n.tipo || 'Notificação' }}</p>
                    <p class="text-xs text-blue-700/80 truncate">{{ n.mensagem }}</p>
                    <p *ngIf="n.enviadaEm" class="text-[10px] text-blue-500 mt-0.5">{{ n.enviadaEm | date:'short' }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <button *ngIf="!n.lida" (click)="markNotificationAsRead(n.id)" class="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded">Marcar lida</button>
                  </div>
                </div>
                <div *ngIf="(portalData?.notificacoes?.length || 0) === 0" class="px-3 py-4 text-center text-sm text-blue-700">Sem notificações</div>
              </div>
            </div>
          </div>

          <!-- Profile -->
          <div class="relative group">
            <button class="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                {{ getInitials(portalData?.inquilino?.nome) }}
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-blue-900 truncate max-w-[120px] lg:max-w-none">
                  {{ portalData?.inquilino?.nome }}
                </p>
              </div>
              <svg class="w-4 h-4 text-blue-500 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <div class="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg border border-blue-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="px-3 sm:px-4 py-2 border-b border-blue-50">
                <p class="text-sm font-medium text-blue-900 truncate">{{ portalData?.inquilino?.nome }}</p>
                <p class="text-xs text-blue-600 truncate">{{ portalData?.inquilino?.email }}</p>
              </div>
              <div class="py-1">
                <a class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors">
                  <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span class="truncate">Meu Perfil</span>
                </a>
                <a class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors">
                  <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="truncate">Configurações</span>
                </a>
              </div>
              <div class="border-t border-blue-50 pt-1">
                <button (click)="logout()" 
                        class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
                  <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
    
    <!-- Navigation Tabs -->
    <nav class="mb-6 sm:mb-8" [@navSlide]>
      <div class="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1 sm:p-2 shadow-sm border border-blue-100">
        <button 
          *ngFor="let section of navigationSections"
          (click)="navigateToSection(section.id)"
          [class]="'flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-xl transition-all duration-300 flex-1 text-center justify-center min-w-0 ' + 
                   (isSectionActive(section.id) ? 
                    'bg-blue-600 text-white shadow-lg' : 
                    'text-blue-700 hover:bg-blue-50 hover:text-blue-900')"
        >
          <svg [class]="'w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ' + (isSectionActive(section.id) ? 'text-white' : 'text-blue-500')" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path *ngIf="section.id === 'dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            <path *ngIf="section.id === 'faturas'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            <path *ngIf="section.id === 'contratos'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            <path *ngIf="section.id === 'lojas'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            <path *ngIf="section.id === 'configuracoes'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          </svg>
          <span class="font-medium text-xs sm:text-sm truncate">{{ section.title }}</span>
        </button>
      </div>
    </nav>

    <!-- Toast de Notificações ao entrar -->
    <div *ngIf="showUnreadToast" class="fixed top-16 right-4 z-50" [@fadeIn]>
      <div class="bg-white shadow-xl border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 w-[320px]">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-blue-900 truncate">{{ unreadToastTitle || 'Você tem novas notificações' }}</p>
          <p class="text-xs text-blue-700/80 truncate">Você tem {{ unreadToastCount }} notificações não lidas</p>
          <div class="mt-2 flex items-center gap-3">
            <button (click)="openNotificationsFromToast()" class="text-xs text-blue-600 hover:text-blue-800 font-medium">Ver todas</button>
            <button (click)="markAllNotificationsAsRead()" class="text-xs text-blue-600 hover:text-blue-800">Marcar todas lidas</button>
          </div>
        </div>
        <button (click)="closeUnreadToast()" class="text-blue-400 hover:text-blue-600 ml-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Painel Lateral de Notificações Pendentes -->
    <div *ngIf="showNotificationsPanel" class="fixed inset-0 z-[60]" [@fadeIn]>
      <div class="absolute inset-0 bg-black/20" (click)="closeNotificationsPanel()"></div>
      <div class="absolute top-0 right-0 h-full w-[360px] sm:w-[420px] lg:w-[480px] bg-white shadow-2xl border-l border-blue-100" [@slideInRight]>
        <div class="px-4 py-3 border-b border-blue-50 flex items-center justify-between">
          <span class="text-sm font-semibold text-blue-900">Notificações Pendentes ({{ unreadNotifications }})</span>
          <div class="flex items-center gap-2">
            <button (click)="markAllNotificationsAsRead()" class="text-xs text-blue-600 hover:text-blue-800">Marcar todas lidas</button>
            <button (click)="closeNotificationsPanel()" class="text-xs text-gray-500 hover:text-gray-700">Fechar</button>
          </div>
        </div>
        <div class="overflow-y-auto h-[calc(100%-56px)]">
          <div *ngFor="let n of unreadNotificationsList" class="px-4 py-3 border-b border-blue-50 flex items-start gap-3">
            <div class="mt-0.5">
              <span class="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-blue-900 truncate">{{ n.tipo || 'Notificação' }}</p>
              <p class="text-xs text-blue-700/80 truncate">{{ n.mensagem }}</p>
              <p *ngIf="n.enviadaEm" class="text-[10px] text-blue-500 mt-0.5">{{ n.enviadaEm | date:'short' }}</p>
            </div>
            <div class="flex-shrink-0">
              <button (click)="markNotificationAsRead(n.id)" class="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded">Marcar lida</button>
            </div>
          </div>
          <div *ngIf="unreadNotifications === 0" class="px-4 py-6 text-center text-sm text-blue-700">Sem notificações pendentes</div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="flex justify-center items-center min-h-[300px] sm:min-h-[400px]" [@fadeIn]>
      <div class="text-center">
        <div class="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
        <p class="text-blue-700 font-medium text-sm sm:text-base">Carregando seu portal...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div *ngIf="!loading && portalData && isCurrentSection('dashboard')" class="space-y-6 sm:space-y-8" [@staggerIn]>
      
      <!-- Welcome Header -->
      <section class="text-center mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-2">
          Bem-vindo, {{ portalData.inquilino.nome ? portalData.inquilino.nome.split(' ')[0] : 'Usuário' }}!
        </h1>
        <p class="text-blue-600 text-sm sm:text-base lg:text-lg">Aqui está o resumo das suas informações</p>
      </section>

      <!-- Financial Overview Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div *ngFor="let card of financialCards; let i = index" 
             class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6 transform hover:scale-105 transition-all duration-300"
             [@cardStagger]="{value: '', params: {delay: i * 100}}">
          
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="min-w-0 flex-1">
              <p class="text-blue-600 text-xs sm:text-sm font-medium mb-1 truncate">{{ card.title }}</p>
              <p class="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 truncate">{{ card.value }}</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
                 [ngClass]="card.iconBg">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="card.title === 'Faturas Pendentes'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                <path *ngIf="card.title === 'Valor Total'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                <path *ngIf="card.title === 'Em Atraso'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                <path *ngIf="card.title === 'Progresso'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
          
          <p class="text-blue-500 text-xs sm:text-sm truncate">{{ card.subtitle }}</p>
          
          <!-- Progress Bar -->
          <div *ngIf="card.progress !== undefined" class="mt-3 sm:mt-4">
            <div class="w-full bg-blue-100 rounded-full h-1.5 sm:h-2">
              <div class="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-1000"
                   [style.width.%]="card.progress"></div>
            </div>
            <p class="text-blue-600 text-xs mt-1 sm:mt-2 text-right">{{ card.progress }}% concluído</p>
          </div>
        </div>
      </section>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        
        <!-- Left Column -->
        <div class="xl:col-span-2 space-y-6 sm:space-y-8">
          
          <!-- Stores Section -->
          <section class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden" [@slideInLeft]>
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  Minhas Lojas
                </h3>
                <span class="text-blue-100 text-xs sm:text-sm font-medium bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                  {{ portalData.lojas.length }} ativa(s)
                </span>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div *ngFor="let loja of portalData.lojas; let i = index" 
                     class="border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white"
                     [@staggerItem]="{value: '', params: {delay: i * 100}}">
                  
                  <div class="flex items-start justify-between mb-3 sm:mb-4">
                    <h4 class="font-bold text-blue-900 text-base sm:text-lg truncate flex-1 mr-2">{{ loja.nome }}</h4>
                    <span class="text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex-shrink-0"
                          [ngClass]="getStatusBadgeClass(loja.contrato.status)">
                      {{ loja.contrato.status }}
                    </span>
                  </div>
                  
                  <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div class="flex justify-between items-center py-1.5 sm:py-2 border-b border-blue-50">
                      <span class="text-blue-600">Número:</span>
                      <span class="font-semibold text-blue-900">#{{ loja.numero }}</span>
                    </div>
                    <div class="flex justify-between items-center py-1.5 sm:py-2 border-b border-blue-50">
                      <span class="text-blue-600">Aluguel Mensal:</span>
                      <span class="font-bold text-blue-900 text-sm">{{ loja.contrato.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="flex justify-between items-center py-1.5 sm:py-2">
                      <span class="text-blue-600">Vencimento:</span>
                      <span class="font-semibold text-blue-900">Dia {{ loja.contrato.dataVencimento }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-6 sm:space-y-8">
          
          <!-- Pending Invoices -->
          <section class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden" [@slideInRight]>
            <div class="bg-gradient-to-r from-orange-500 to-amber-500 px-4 sm:px-6 py-3 sm:py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Faturas Pendentes
                </h3>
                <span *ngIf="getAllPendingInvoices().length > 0" 
                      class="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-bold">
                  {{ getAllPendingInvoices().length }}
                </span>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <div class="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto">
                <div *ngFor="let fatura of getAllPendingInvoices(); let i = index" 
                     class="border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-orange-50 hover:shadow-md transition-all duration-300"
                     [@staggerItem]="{value: '', params: {delay: i * 50}}">
                  
                  <div class="flex justify-between items-start mb-2 sm:mb-3">
                    <div class="min-w-0 flex-1 mr-2">
                      <p class="font-bold text-blue-900 text-sm sm:text-base truncate">{{ fatura.loja.nome }}</p>
                      <p class="text-xs text-blue-600">Ref: {{ fatura.mesReferencia }}/{{ fatura.anoReferencia }}</p>
                    </div>
                    <span class="text-xs font-semibold px-2 py-1 rounded flex-shrink-0"
                          [ngClass]="getUrgencyClass(fatura.diasParaVencimento)">
                      {{ fatura.diasParaVencimento }} dias
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-blue-600">
                      Vence: {{ fatura.dataVencimento | date:'dd/MM/yyyy' }}
                    </span>
                    <span class="font-bold text-blue-900 text-sm">
                      {{ fatura.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}
                    </span>
                  </div>
                </div>
                
                <div *ngIf="getAllPendingInvoices().length === 0" class="text-center py-6 sm:py-8">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p class="text-blue-900 font-semibold text-sm sm:text-base">Todas as faturas em dia!</p>
                  <p class="text-blue-600 text-xs sm:text-sm mt-1">Parabéns pelo controle</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Atividade Recente removida conforme solicitado -->
        </div>
      </div>
    </div>

    <!-- Other Sections -->
    <div *ngIf="!loading && portalData && !isCurrentSection('dashboard')">
      <div *ngIf="isCurrentSection('faturas')">
        <app-tenant-invoices [portalData]="portalData"></app-tenant-invoices>
      </div>

      <div *ngIf="isCurrentSection('contratos')">
        <app-tenant-contracts [portalData]="portalData"></app-tenant-contracts>
      </div>

      <div *ngIf="isCurrentSection('lojas')">
        <app-tenant-stores [portalData]="portalData"></app-tenant-stores>
      </div>

      <div *ngIf="isCurrentSection('configuracoes')">
        <app-tenant-settings [portalData]="portalData"></app-tenant-settings>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="!loading && !portalData" class="text-center py-12 sm:py-16" [@fadeIn]>
      <div class="max-w-md mx-auto px-4">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h3 class="text-lg sm:text-xl font-bold text-blue-900 mb-2">Erro ao carregar</h3>
        <p class="text-blue-600 mb-4 sm:mb-6 text-sm sm:text-base">Não foi possível carregar suas informações.</p>
        <button 
          (click)="loadPortalData()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm sm:text-base"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  </div>
</div>
  `,
  animations: [
    trigger('pageEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('headerSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('400ms ease-out', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('navSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms 200ms ease-out', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('logoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms 200ms ease-out', 
                style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('60ms', [
            animate('400ms ease-out', 
                    style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardStagger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('400ms {{delay}}ms ease-out', 
                style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ], { params: { delay: 0 } })
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('500ms 300ms ease-out', 
                style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('500ms 400ms ease-out', 
                style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('300ms {{delay}}ms ease-out', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: 0 } })
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class TenantPortalComponent implements OnInit, OnDestroy {
  portalData: IPortalInquilinoData | null = null;
  loading = true;
  currentTime = new Date();
  
  currentSection: 'dashboard' | 'faturas' | 'contratos' | 'lojas' | 'configuracoes' = 'dashboard';
  
  // Estado do menu de notificações
  notificationsMenuOpen: boolean = false;
  
  // Painel lateral de notificações
  showNotificationsPanel: boolean = false;
  
  // Toast de notificações ao entrar
  showUnreadToast: boolean = false;
  unreadToastCount: number = 0;
  unreadToastTitle: string = '';
  
  // Cache para performance
  private _cachedFinancialCards: any[] = [];
  private _cachedPendingInvoices: IFaturaInquilino[] = [];
  private _lastPortalDataUpdate: number = 0;

  navigationSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'fas fa-chart-pie'
    },
    {
      id: 'faturas',
      title: 'Faturas',
      icon: 'fas fa-file-invoice-dollar'
    },
    {
      id: 'contratos',
      title: 'Contratos',
      icon: 'fas fa-file-contract'
    },
    {
      id: 'lojas',
      title: 'Lojas',
      icon: 'fas fa-store'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: 'fas fa-cog'
    }
  ];

  get financialCards() {
    if (!this.portalData) return [];
    
    // Cache para performance
    const currentDataHash = JSON.stringify(this.portalData.resumoFinanceiro);
    if (this._lastPortalDataUpdate === currentDataHash.length && this._cachedFinancialCards.length > 0) {
      return this._cachedFinancialCards;
    }
    
    const totalPendingInvoices = this.getAllPendingInvoices().length;
    const totalPaidInvoices = this.portalData.resumoFinanceiro.faturasPagas;
    const totalInvoices = totalPendingInvoices + totalPaidInvoices;
    const progressPercentage = totalInvoices > 0 ? (totalPaidInvoices / totalInvoices) * 100 : 0;

    this._cachedFinancialCards = [
      {
        title: 'Faturas Pendentes',
        value: totalPendingInvoices,
        subtitle: 'Aguardando pagamento',
        iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500'
      },
      {
        title: 'Valor Total',
        value: this.portalData.resumoFinanceiro.valorTotalPendente,
        subtitle: 'Saldo em aberto',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600'
      },
      {
        title: 'Em Atraso',
        value: this.portalData.resumoFinanceiro.faturasEmAtraso,
        subtitle: 'Requer atenção',
        iconBg: 'bg-gradient-to-br from-red-500 to-pink-500'
      },
      {
        title: 'Progresso',
        value: `${Math.round(progressPercentage)}%`,
        subtitle: 'Taxa de conclusão',
        iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
        progress: progressPercentage
      }
    ];
    
    this._lastPortalDataUpdate = currentDataHash.length;
    return this._cachedFinancialCards;
  }

  get unreadNotifications() {
    return this.portalData?.notificacoes.filter(n => !n.lida).length || 0;
  }

  get unreadNotificationsList(): INotificacaoInquilino[] {
    return (this.portalData?.notificacoes || []).filter(n => !n.lida);
  }

  toggleNotificationsMenu() {
    this.notificationsMenuOpen = !this.notificationsMenuOpen;
  }

  closeNotificationsMenu() {
    this.notificationsMenuOpen = false;
  }

  openNotificationsFromToast() {
    this.showNotificationsPanel = true;
    this.showUnreadToast = false;
  }

  closeUnreadToast() {
    this.showUnreadToast = false;
  }

  openNotificationsPanel() {
    this.showNotificationsPanel = true;
  }

  closeNotificationsPanel() {
    this.showNotificationsPanel = false;
  }

  constructor(
    private tenantService: TenantService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loadPortalData();
  }

  ngOnInit() {
    this.currentTime = new Date();
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngOnDestroy() {
    // Cleanup
  }

  loadPortalData(skipChargeRefresh: boolean = false) {
    this.loading = true;
    this.tenantService.getPortalData().subscribe({
      next: (data: IPortalInquilinoData) => {
        setTimeout(() => {
          this.portalData = data;
          this.loading = false;

          // Limpa cache
          this._cachedFinancialCards = [];
          this._cachedPendingInvoices = [];
          this._lastPortalDataUpdate = 0;

          // Após carregar os dados, chama atualização das cobranças EFI
          if (!skipChargeRefresh) {
            this.refreshChargesFromEfi();
          }

          // Abre painel lateral com notificações pendentes ao entrar
          const unread = this.unreadNotifications;
          if (unread > 0) {
            this.unreadToastCount = unread;
            const firstUnread = this.portalData?.notificacoes.find(n => !n.lida);
            this.unreadToastTitle = firstUnread?.tipo || 'Você tem novas notificações';
            this.showUnreadToast = false;
            this.showNotificationsPanel = true;
          }
        }, 600);
      },
      error: (err: any) => {
        console.error('Erro ao carregar dados:', err);
        this.loading = false;

        this._cachedFinancialCards = [];
        this._cachedPendingInvoices = [];
        this._lastPortalDataUpdate = 0;

        if (err.status === 401) {
          this.router.navigate(['/tenant/login']);
        }
      }
    });
  }

  markNotificationAsRead(id: string | number) {
    if (!id) return;
    this.tenantService.markNotificationAsRead(String(id)).subscribe({
      next: () => {
        if (this.portalData?.notificacoes) {
          this.portalData.notificacoes = this.portalData.notificacoes.map(n => {
            if (String(n.id) === String(id)) {
              return { ...n, lida: true } as INotificacaoInquilino;
            }
            return n;
          });
          // Fecha painel/menus se não houver mais não lidas
          if (this.unreadNotifications === 0) {
            this.closeUnreadToast();
            this.closeNotificationsPanel();
            this.closeNotificationsMenu();
          }
        }
      },
      error: (err) => {
        console.error('Erro ao marcar notificação como lida:', err);
      }
    });
  }

  markAllNotificationsAsRead() {
    this.tenantService.markAllNotificationsAsRead().subscribe({
      next: () => {
        if (this.portalData?.notificacoes) {
          this.portalData.notificacoes = this.portalData.notificacoes.map(n => ({ ...n, lida: true } as INotificacaoInquilino));
        }
        this.closeUnreadToast();
        this.closeNotificationsPanel();
        this.closeNotificationsMenu();
      },
      error: (err) => {
        console.error('Erro ao marcar todas notificações como lidas:', err);
      }
    });
  }

  getInitials(name?: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'ATIVO': 'bg-green-100 text-green-800',
      'PENDENTE': 'bg-amber-100 text-amber-800',
      'INATIVO': 'bg-red-100 text-red-800',
      'RENOVACAO': 'bg-blue-100 text-blue-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getUrgencyClass(dias: number | undefined): string {
    const diasValue = dias ?? 999;
    
    if (diasValue <= 3) {
      return 'bg-red-500 text-white';
    } else if (diasValue <= 7) {
      return 'bg-amber-500 text-white';
    } else {
      return 'bg-blue-500 text-white';
    }
  }

  getAllPendingInvoices(): IFaturaInquilino[] {
    if (!this.portalData) return [];
    
    const currentDataHash = JSON.stringify({
      pendentes: this.portalData.faturas.pendentes,
      emAtraso: this.portalData.faturas.emAtraso
    });
    
    if (this._lastPortalDataUpdate === currentDataHash.length && this._cachedPendingInvoices.length > 0) {
      return this._cachedPendingInvoices;
    }
    
    const allPendingInvoices = [
      ...this.portalData.faturas.pendentes,
      ...this.portalData.faturas.emAtraso
    ];
    
    this._cachedPendingInvoices = allPendingInvoices.sort((a, b) => {
      const dateA = new Date(a.dataVencimento).getTime();
      const dateB = new Date(b.dataVencimento).getTime();
      return dateA - dateB;
    });
    
    return this._cachedPendingInvoices;
  }

  logout() {
    this.tenantService.logout();
  }

  navigateToSection(sectionId: string) {
    this.currentSection = sectionId as 'dashboard' | 'faturas' | 'contratos' | 'lojas' | 'configuracoes';
  }

  isSectionActive(sectionId: string): boolean {
    return this.currentSection === sectionId;
  }

  isCurrentSection(section: 'dashboard' | 'faturas' | 'contratos' | 'lojas' | 'configuracoes'): boolean {
    return this.currentSection === section;
  }

  private refreshChargesFromEfi(): void {
    if (!this.portalData) return;
    const invoices = this.getAllPendingInvoices().filter(f => !!f.efiCobrancaId);
    const ids = Array.from(new Set(invoices.map(f => String(f.efiCobrancaId))));
    if (ids.length === 0) return;

    const requests = ids.map(id => this.http.get(`http://localhost:3010/api/efi/charge/${id}`));
    forkJoin(requests).subscribe({
      next: () => {
        // Recarrega os dados do portal após processar as cobranças
        this.loadPortalData(true);
      },
      error: () => {
        // Mesmo em erro, tentar atualizar para refletir estado atual
        this.loadPortalData(true);
      }
    });
  }
}