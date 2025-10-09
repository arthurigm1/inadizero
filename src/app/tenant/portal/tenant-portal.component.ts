import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService } from '../tenant.service';
import { IPortalInquilinoData, ILojaInquilino, IFaturaInquilino, INotificacaoInquilino, StatusFatura } from '../tenant.interfaces';
import { trigger, transition, style, animate, stagger, query, keyframes, state } from '@angular/animations';
import { TenantInvoicesComponent } from '../components/tenant-invoices.component';
import { TenantContractsComponent } from '../components/tenant-contracts.component';
import { TenantStoresComponent } from '../components/tenant-stores.component';
import { TenantSettingsComponent } from '../components/tenant-settings.component';

@Component({
  selector: 'app-tenant-portal',
  standalone: true,
  imports: [
    CommonModule, 
    TenantInvoicesComponent, 
    TenantContractsComponent, 
    TenantStoresComponent, 
    TenantSettingsComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 relative overflow-hidden" [@pageEnter]>
      
      <!-- Background Elements Melhorados -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Gradientes sutis -->
        <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/5 rounded-full blur-3xl"></div>
        
        <!-- Padrão de grid sutil -->
        <div class="absolute inset-0 opacity-[0.03]">
          <div class="absolute inset-0" style="
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
          "></div>
        </div>
      </div>

      <!-- Header Profissional Aprimorado -->
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm" [@headerSlide]>
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex items-center justify-between h-20">
            <!-- Logo e Marca -->
            <div class="flex items-center space-x-4" [@logoAnimation]>
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                  <i class="fas fa-building text-white text-lg"></i>
                </div>
              </div>
              <div class="flex flex-col">
                <h1 class="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Portal do Inquilino
                </h1>
                <p class="text-xs text-slate-500 font-medium">Sistema de Gestão</p>
              </div>
            </div>
            
            <!-- Estatísticas Rápidas -->
            <div class="hidden md:flex items-center space-x-8">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-slate-600 font-medium">Online</span>
              </div>
              <div class="h-6 w-px bg-slate-300/60"></div>
              <div class="text-center" *ngIf="portalData">
                <p class="text-xs text-slate-500 font-medium">Faturas Pendentes</p>
                <p class="text-sm font-bold text-slate-900">{{ portalData.resumoFinanceiro.totalFaturasPendentes }}</p>
              </div>
              <div class="text-center" *ngIf="portalData">
                <p class="text-xs text-slate-500 font-medium">Valor Total</p>
                <p class="text-sm font-bold text-slate-900">
                  {{ portalData.resumoFinanceiro.valorTotalPendente | currency:'BRL':'symbol':'1.2-2' }}
                </p>
              </div>
            </div>

            <!-- Menu do Usuário -->
            <div class="flex items-center space-x-3">
              <!-- Notificações -->
              <button class="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group">
                <i class="fas fa-bell text-lg group-hover:scale-110 transition-transform"></i>
                <span *ngIf="unreadNotifications > 0" 
                      class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {{ unreadNotifications }}
                </span>
              </button>

              <!-- Perfil do Usuário -->
              <div class="relative group">
                <button class="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {{ getInitials(portalData?.inquilino?.nome) }}
                  </div>
                  <div class="hidden lg:block text-left">
                    <p class="text-sm font-semibold text-slate-900">{{ portalData?.inquilino?.nome }}</p>
                    <p class="text-xs text-slate-500">Inquilino</p>
                  </div>
                  <i class="fas fa-chevron-down text-slate-400 text-xs transform group-hover:rotate-180 transition-transform"></i>
                </button>

                <!-- Dropdown Menu -->
                <div class="absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div class="px-5 py-4 border-b border-slate-200/60">
                    <p class="text-sm font-semibold text-slate-900">{{ portalData?.inquilino?.nome }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ portalData?.inquilino?.email }}</p>
                  </div>
                  <div class="py-2">
                    <a class="flex items-center space-x-3 px-5 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mx-2">
                      <i class="fas fa-user text-blue-500 w-5"></i>
                      <span>Meu Perfil</span>
                    </a>
                    <a class="flex items-center space-x-3 px-5 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mx-2">
                      <i class="fas fa-cog text-blue-500 w-5"></i>
                      <span>Configurações</span>
                    </a>
                    <a class="flex items-center space-x-3 px-5 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mx-2">
                      <i class="fas fa-question-circle text-blue-500 w-5"></i>
                      <span>Ajuda & Suporte</span>
                    </a>
                  </div>
                  <div class="border-t border-slate-200/60 pt-2">
                    <button (click)="logout()" 
                            class="flex items-center space-x-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-all duration-200 rounded-lg mx-2">
                      <i class="fas fa-sign-out-alt text-red-500 w-5"></i>
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Barra de Navegação Horizontal -->
      <nav class="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 sticky top-20 z-40" [@navSlide]>
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex items-center space-x-1 py-4 overflow-x-auto">
            <button 
              *ngFor="let section of navigationSections; let i = index"
              (click)="navigateToSection(section.id)"
              [class]="'flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-300 whitespace-nowrap transform hover:scale-105 ' + 
                       (isSectionActive(section.id) ? 
                        'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' : 
                        'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-md border border-transparent hover:border-slate-200')"
              [@cardStagger]="{value: '', params: {delay: i * 80}}"
            >
              <i [class]="section.icon + ' text-sm ' + 
                         (isSectionActive(section.id) ? 'text-white' : 'text-slate-500 group-hover:text-blue-500')"></i>
              <div class="text-left">
                <p class="font-semibold text-sm">{{ section.title }}</p>
                <p class="text-xs opacity-90">{{ section.description }}</p>
              </div>
              <i *ngIf="isSectionActive(section.id)" class="fas fa-chevron-right text-white text-xs ml-2"></i>
            </button>
          </div>
        </div>
      </nav>

      <!-- Banner de Estatísticas Rápidas -->
      <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg" *ngIf="portalData">
        <div class="max-w-7xl mx-auto px-6 py-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div class="text-center md:text-left">
              <p class="text-sm text-blue-100 mb-1">Valor Total Pendente</p>
              <p class="text-2xl font-bold">{{ portalData.resumoFinanceiro.valorTotalPendente | currency:'BRL':'symbol':'1.2-2' }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-blue-100 mb-1">Faturas Pendentes</p>
              <p class="text-2xl font-bold">{{ portalData.resumoFinanceiro.totalFaturasPendentes }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-blue-100 mb-1">Em Atraso</p>
              <p class="text-2xl font-bold">{{ portalData.resumoFinanceiro.faturasEmAtraso }}</p>
            </div>
            <div class="text-center md:text-right">
              <button (click)="navigateToSection('faturas')" 
                      class="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Ver Todas as Faturas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <main class="max-w-7xl mx-auto px-6 py-8">
        <!-- Estado de Carregamento -->
        <div *ngIf="loading" class="flex justify-center items-center min-h-[500px]" [@fadeIn]>
          <div class="text-center">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto mb-6" style="animation-delay: -0.5s;"></div>
            </div>
            <p class="text-blue-700 font-semibold text-lg mb-2">Carregando seu portal...</p>
            <p class="text-blue-600/60 text-sm">Preparando todas as funcionalidades</p>
          </div>
        </div>

        <!-- Conteúdo do Dashboard -->
        <div *ngIf="!loading && portalData && isCurrentSection('dashboard')" class="space-y-8" [@staggerIn]>
          
          <!-- Cabeçalho de Boas-Vindas -->
          <section class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 transform hover:shadow-2xl transition-all duration-500">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  Bem-vindo de volta, {{ portalData.inquilino.nome ? portalData.inquilino.nome.split(' ')[0] : 'Usuário' }}! 👋
                </h2>
                <p class="text-slate-600 text-lg">Aqui está o seu resumo financeiro de hoje</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-slate-500">Última atualização</p>
                <p class="text-sm font-semibold text-slate-900">{{ currentTime | date:'HH:mm' }}</p>
              </div>
            </div>
          </section>

          <!-- Grid de Métricas Financeiras -->
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let card of financialCards; let i = index" 
                 class="group relative"
                 [@cardStagger]="{value: '', params: {delay: i * 100}}">
              
              <!-- Efeito de brilho no hover -->
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              
              <div class="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-white/60 overflow-hidden">
                <!-- Barra superior colorida -->
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-slate-600 mb-2 flex items-center">
                        <i [class]="card.icon" class="mr-2 text-blue-500"></i>
                        {{ card.title }}
                      </p>
                      <p class="text-2xl font-bold text-slate-900 mb-1">{{ card.value }}</p>
                      <p class="text-xs text-slate-500 font-medium">{{ card.subtitle }}</p>
                    </div>
                    
                    <div class="relative">
                      <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transform group-hover:scale-110 transition-transform duration-300"
                           [ngClass]="card.iconBg">
                        <i [class]="card.icon" class="text-white text-sm"></i>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Barra de progresso -->
                  <div *ngIf="card.progress !== undefined" class="mt-4">
                    <div class="w-full bg-slate-100 rounded-full h-2">
                      <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                           [style.width.%]="card.progress"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Layout de Duas Colunas -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            <!-- Coluna Esquerda -->
            <div class="xl:col-span-2 space-y-8">
              
              <!-- Seção de Lojas -->
              <section class="group" [@slideInLeft]>
                <div class="relative">
                  <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div class="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-4">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white flex items-center">
                          <i class="fas fa-store mr-3"></i>
                          Minhas Lojas
                        </h3>
                        <span class="text-blue-100 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                          {{ portalData.lojas.length }} ativa(s)
                        </span>
                      </div>
                    </div>
                    <div class="p-6">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div *ngFor="let loja of portalData.lojas; let i = index" 
                             class="group/loja relative"
                             [@staggerItem]="{value: '', params: {delay: i * 100}}">
                          
                          <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-0 group-hover/loja:opacity-20 transition duration-500"></div>
                          
                          <div class="relative bg-gradient-to-br from-white to-blue-50/50 border border-blue-100 rounded-2xl p-6 hover:border-blue-200 transition-all duration-500 group-hover/loja:shadow-xl overflow-hidden">
                            
                            <!-- Elemento decorativo no canto -->
                            <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
                            
                            <div class="flex items-start justify-between mb-4">
                              <h4 class="font-bold text-slate-900 text-lg">{{ loja.nome }}</h4>
                              <span class="text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm transform group-hover/loja:scale-110 transition-transform duration-300"
                                    [ngClass]="getStatusBadgeClass(loja.contrato.status)">
                                {{ loja.contrato.status }}
                              </span>
                            </div>
                            
                            <div class="space-y-3 text-sm">
                              <div class="flex justify-between items-center py-2 border-b border-blue-50">
                                <span class="text-slate-600 flex items-center">
                                  <i class="fas fa-hashtag text-blue-500 mr-2 text-xs"></i>
                                  Número:
                                </span>
                                <span class="font-semibold text-slate-900">#{{ loja.numero }}</span>
                              </div>
                              <div class="flex justify-between items-center py-2 border-b border-blue-50">
                                <span class="text-slate-600 flex items-center">
                                  <i class="fas fa-money-bill-wave text-blue-500 mr-2 text-xs"></i>
                                  Aluguel Mensal:
                                </span>
                                <span class="font-bold text-slate-900 text-lg">{{ loja.contrato.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</span>
                              </div>
                              <div class="flex justify-between items-center py-2">
                                <span class="text-slate-600 flex items-center">
                                  <i class="fas fa-calendar-day text-blue-500 mr-2 text-xs"></i>
                                  Vencimento:
                                </span>
                                <span class="font-semibold text-slate-900">Dia {{ loja.contrato.dataVencimento }}</span>
                              </div>
                            </div>
                            
                            <div class="mt-4 pt-4 border-t border-blue-100">
                              <p class="text-xs text-slate-500 text-center font-medium">
                                <i class="fas fa-clock mr-1"></i>
                                Vigência: {{ loja.contrato.dataInicio | date:'dd/MM/yyyy' }} - {{ loja.contrato.dataFim | date:'dd/MM/yyyy' }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Coluna Direita -->
            <div class="space-y-8">
              
              <!-- Faturas Pendentes -->
              <section class="group" [@slideInRight]>
                <div class="relative">
                  <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div class="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
                    <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-6 py-4">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white flex items-center">
                          <i class="fas fa-clock mr-3"></i>
                          Faturas Pendentes
                        </h3>
                        <span *ngIf="getAllPendingInvoices().length > 0" 
                              class="bg-white/20 text-white text-sm px-3 py-1 rounded-full font-bold">
                          {{ getAllPendingInvoices().length }}
                        </span>
                      </div>
                    </div>
                    <div class="p-6">
                      <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                        <div *ngFor="let fatura of getAllPendingInvoices(); let i = index" 
                             class="group/fatura relative"
                             [@staggerItem]="{value: '', params: {delay: i * 50}}">
                          
                          <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 hover:border-amber-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                            <div class="flex justify-between items-start mb-3">
                              <div>
                                <p class="font-bold text-slate-900 text-lg">{{ fatura.loja.nome }}</p>
                                <p class="text-sm text-slate-600">Referência: {{ fatura.mesReferencia }}/{{ fatura.anoReferencia }}</p>
                              </div>
                              <span class="text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                                    [ngClass]="getUrgencyClass(fatura.diasParaVencimento)">
                                <i class="fas fa-clock mr-1"></i>
                                {{ fatura.diasParaVencimento }} dias
                              </span>
                            </div>
                            <div class="flex justify-between items-center mb-4">
                              <span class="text-sm text-slate-600 font-medium">
                                Vence: {{ fatura.dataVencimento | date:'dd/MM/yyyy' }}
                              </span>
                              <span class="font-bold text-slate-900 text-xl">
                                {{ fatura.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}
                              </span>
                            </div>
                            <div class="flex space-x-2">
                              <button class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md">
                                <i class="fas fa-credit-card mr-2"></i>
                                Pagar Agora
                              </button>
                              <button class="w-12 h-12 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center">
                                <i class="fas fa-ellipsis-h"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div *ngIf="getAllPendingInvoices().length === 0" class="text-center py-12">
                          <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check-circle text-3xl text-green-500"></i>
                          </div>
                          <p class="text-slate-900 font-semibold text-lg">Todas as faturas em dia!</p>
                          <p class="text-slate-600 text-sm mt-2">Parabéns pelo controle financeiro</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Atividade Recente -->
              <section class="group" [@slideInRight]>
                <div class="relative">
                  <div class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div class="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
                    <div class="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 px-6 py-4">
                      <h3 class="text-lg font-semibold text-white flex items-center">
                        <i class="fas fa-bell mr-3"></i>
                        Atividade Recente
                      </h3>
                    </div>
                    <div class="p-6">
                      <div class="space-y-4">
                        <div *ngFor="let notificacao of portalData.notificacoes.slice(0, 4); let i = index" 
                             class="flex items-start space-x-3 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                             [@staggerItem]="{value: '', params: {delay: i * 50}}"
                             [ngClass]="{'bg-purple-50/50 border border-purple-100': !notificacao.lida, 'bg-white border border-slate-100': notificacao.lida}">
                          
                          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                               [ngClass]="{'bg-purple-100 text-purple-600 shadow-sm': !notificacao.lida, 'bg-slate-100 text-slate-400': notificacao.lida}">
                            <i class="fas fa-bell text-sm"></i>
                          </div>
                          
                          <div class="flex-1 min-w-0">
                            <p class="text-sm text-slate-900 mb-1" 
                               [class]="{'font-semibold': !notificacao.lida, 'font-medium': notificacao.lida}">
                              {{ notificacao.mensagem }}
                            </p>
                            <p class="text-xs text-slate-500">
                              {{ notificacao.enviadaEm | date:'dd/MM/yyyy • HH:mm' }}
                            </p>
                          </div>
                          
                          <i *ngIf="!notificacao.lida" class="fas fa-circle text-xs text-purple-500 mt-1.5 flex-shrink-0 animate-pulse"></i>
                        </div>
                        
                        <div *ngIf="portalData.notificacoes.length === 0" class="text-center py-8">
                          <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-bell-slash text-2xl text-blue-400"></i>
                          </div>
                          <p class="text-slate-900 font-semibold">Nenhuma notificação</p>
                          <p class="text-slate-600 text-sm mt-1">Tudo tranquilo por aqui</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <!-- Outras Seções -->
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

        <!-- Estado de Erro -->
        <div *ngIf="!loading && !portalData" class="text-center py-20" [@fadeIn]>
          <div class="max-w-md mx-auto">
            <div class="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-exclamation-triangle text-3xl text-slate-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Erro ao carregar</h3>
            <p class="text-slate-600 text-lg mb-8">Não foi possível carregar suas informações no momento.</p>
            <button 
              (click)="loadPortalData()"
              class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg"
            >
              <i class="fas fa-redo mr-3 group-hover:rotate-180 transition-transform duration-500"></i>
              Tentar Novamente
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  animations: [
    trigger('pageEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('headerSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('navSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms 200ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('logoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) rotate(-10deg)' }),
        animate('500ms 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
                style({ opacity: 1, transform: 'scale(1) rotate(0deg)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('80ms', [
            animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
                    style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardStagger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate('500ms {{delay}}ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ], { params: { delay: 0 } })
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms 300ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('600ms 400ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms {{delay}}ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: 0 } })
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(59, 130, 246, 0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(59, 130, 246, 0.3);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(59, 130, 246, 0.5);
    }
  `]
})
export class TenantPortalComponent implements OnInit, OnDestroy {
  portalData: IPortalInquilinoData | null = null;
  loading = true;
  currentTime = new Date();
  
  currentSection: 'dashboard' | 'faturas' | 'contratos' | 'lojas' | 'configuracoes' = 'dashboard';

  navigationSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'fas fa-chart-pie',
      description: 'Visão geral & analytics'
    },
    {
      id: 'faturas',
      title: 'Faturas',
      icon: 'fas fa-file-invoice-dollar',
      description: 'Cobranças & pagamentos'
    },
    {
      id: 'contratos',
      title: 'Contratos',
      icon: 'fas fa-file-contract',
      description: 'Contratos de locação'
    },
    {
      id: 'lojas',
      title: 'Lojas',
      icon: 'fas fa-store',
      description: 'Gerenciar unidades'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: 'fas fa-cog',
      description: 'Preferências da conta'
    }
  ];

  get financialCards() {
    if (!this.portalData) return [];
    
    const totalPendingInvoices = this.getAllPendingInvoices().length;
    const totalPaidInvoices = this.portalData.resumoFinanceiro.faturasPagas;
    const totalInvoices = totalPendingInvoices + totalPaidInvoices;
    const progressPercentage = totalInvoices > 0 ? (totalPaidInvoices / totalInvoices) * 100 : 0;

    return [
      {
        title: 'Faturas Pendentes',
        value: totalPendingInvoices,
        icon: 'fas fa-file-invoice',
        subtitle: 'Aguardando pagamento',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
        progress: undefined
      },
      {
        title: 'Valor Total',
        value: this.portalData.resumoFinanceiro.valorTotalPendente,
        icon: 'fas fa-money-bill-wave',
        subtitle: 'Saldo em aberto',
        iconBg: 'bg-gradient-to-br from-red-500 to-pink-500',
        progress: undefined
      },
      {
        title: 'Em Atraso',
        value: this.portalData.resumoFinanceiro.faturasEmAtraso,
        icon: 'fas fa-exclamation-triangle',
        subtitle: 'Requer atenção',
        iconBg: 'bg-gradient-to-br from-red-600 to-rose-600',
        progress: undefined
      },
      {
        title: 'Progresso',
        value: `${Math.round(progressPercentage)}%`,
        icon: 'fas fa-chart-line',
        subtitle: 'Taxa de conclusão',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
        progress: progressPercentage
      }
    ];
  }

  get unreadNotifications() {
    return this.portalData?.notificacoes.filter(n => !n.lida).length || 0;
  }

  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPortalData();
    // Atualizar hora a cada minuto
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngOnDestroy() {
    // Cleanup de intervals se necessário
  }

  loadPortalData() {
    this.loading = true;
    
    this.tenantService.getPortalData().subscribe({
      next: (data: IPortalInquilinoData) => {
        setTimeout(() => {
          this.portalData = data;
          this.loading = false;
        }, 800); // Simular loading para melhor UX
      },
      error: (err: any) => {
        console.error('Erro ao carregar dados do portal:', err);
        this.loading = false;
        if (err.status === 401) {
          this.router.navigate(['/tenant/login']);
        }
      }
    });
  }

  getInitials(name?: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'ATIVO': 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200',
      'PENDENTE': 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200',
      'INATIVO': 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200',
      'RENOVACAO': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
    };
    return classes[status as keyof typeof classes] || 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border border-slate-200';
  }

  getUrgencyClass(dias: number | undefined): string {
    const diasValue = dias ?? 999;
    
    if (diasValue <= 3) {
      return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg';
    } else if (diasValue <= 7) {
      return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md';
    } else {
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm';
    }
  }

  getAllPendingInvoices(): IFaturaInquilino[] {
    if (!this.portalData) return [];
    
    const allPendingInvoices = [
      ...this.portalData.faturas.pendentes,
      ...this.portalData.faturas.emAtraso
    ];
    
    return allPendingInvoices.sort((a, b) => {
      const dateA = new Date(a.dataVencimento).getTime();
      const dateB = new Date(b.dataVencimento).getTime();
      return dateA - dateB;
    });
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
}