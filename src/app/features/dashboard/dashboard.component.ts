import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgApexchartsModule } from 'ng-apexcharts';

import { UsersComponent } from '../users/users.component';
import { StoresComponent } from '../stores/stores.component';
import { SettingsComponent } from '../settings/settings.component';
import { ContractsComponent } from '../contracts/contracts.component';
import { ContractDetailComponent } from '../contracts/contract-detail/contract-detail.component';
import { InvoicesComponent } from '../../features/invoices/invoices.component';
import { NotificacoesComponent } from './notifications/notifications.component';
import { InadimplentesComponent } from './inadimplentes/inadimplentes.component';
import { environment } from '../../../environments/environment';

// Interface para tipagem dos dados
interface AnalyticsData {
  caixa?: {
    entradas: number;
    aReceber: number;
  };
  inadimplencia?: {
    valorTotalEmAtraso: number;
    totalInadimplentes: number;
    topInadimplentes: Array<{ nome: string; totalEmAtraso: number }>;
  };
  resumo?: {
    receitaTotal: number;
    receitaMensal: number;
    propriedades: {
      total: number;
      taxaOcupacao: number;
    };
    inquilinos: {
      total: number;
      taxaInadimplencia: number;
    };
    pendencias: {
      faturasPendentes: number;
      valorPendentes: number;
    };
  };
  series?: {
    recebimentosPorMes: Array<{ mes: string; valor: number }>;
    aReceberPorMes: Array<{ mes: string; valor: number }>;
  };
  lojas?: {
    porStatus: Array<{ status: string; quantidade: number }>;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, NgApexchartsModule, UsersComponent, StoresComponent, SettingsComponent, ContractsComponent, ContractDetailComponent, InvoicesComponent, NotificacoesComponent, InadimplentesComponent],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" [@fadeIn]>
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl" 
         [class.translate-x-0]="sidebarOpen" 
         [class.-translate-x-full]="!sidebarOpen">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-20 px-4 border-b border-slate-200/80 bg-gradient-to-r from-blue-600 to-blue-700">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-white">InadiZero</span>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1">
          <a (click)="navigateTo('dashboard')" 
             class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
             [class]="currentSection === 'dashboard' ? 
             'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
             'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 [class]="currentSection === 'dashboard' ? 
                 'bg-white/20 text-white' : 
                 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            Dashboard
          </a>
          
          <a (click)="navigateTo('users')" 
             class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
             [class]="currentSection === 'users' ? 
             'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
             'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 [class]="currentSection === 'users' ? 
                 'bg-white/20 text-white' : 
                 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            Usuários
          </a>
          
          <a (click)="navigateTo('stores')" 
             class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
             [class]="currentSection === 'stores' ? 
             'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
             'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 [class]="currentSection === 'stores' ? 
                 'bg-white/20 text-white' : 
                 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clip-rule="evenodd"/>
                <path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
              </svg>
            </div>
            Lojas
          </a>
          
          <a (click)="navigateTo('contracts')" 
             class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
             [class]="currentSection === 'contracts' ? 
             'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
             'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 [class]="currentSection === 'contracts' ? 
                 'bg-white/20 text-white' : 
                 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clip-rule="evenodd"/>
                <path d="M6 6h8v2H6V6zM6 10h8v2H6v-2zM6 14h5v2H6v-2z"/>
              </svg>
            </div>
            Contratos
          </a>
          
          <a (click)="navigateTo('invoices')" 
             class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
             [class]="currentSection === 'invoices' ? 
             'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
             'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 [class]="currentSection === 'invoices' ? 
                 'bg-white/20 text-white' : 
                 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clip-rule="evenodd"/>
                <path d="M6 8h8v2H6V8zM6 12h8v2H6v-2z"/>
              </svg>
            </div>
            Faturas
          </a>
          
          <a (click)="navigateTo('inadimplentes')"
             class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
             [class]="currentSection === 'inadimplentes' ? 
             'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
             'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 [class]="currentSection === 'inadimplentes' ? 
                 'bg-white/20 text-white' : 
                 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12 8c-1.657 0-3 1.343-3 3v5H5a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2h-4v-5c0-1.657-1.343-3-3-3z"/>
              </svg>
            </div>
            Inadimplentes
          </a>

          <a (click)="navigateTo('notifications')"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
              [class]="currentSection === 'notifications' ? 
              'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
              'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
             <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                  [class]="currentSection === 'notifications' ? 
                  'bg-white/20 text-white' : 
                  'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
               <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
               </svg>
             </div>
             Notificações
           </a>
          
          <a (click)="navigateTo('settings')" 
             class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
             [class]="currentSection === 'settings' ? 
             'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 
             'text-slate-600 hover:bg-slate-100 hover:text-blue-600'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 [class]="currentSection === 'settings' ? 
                 'bg-white/20 text-white' : 
                 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg>
            </div>
            Configurações
          </a>
        </nav>
        
        <!-- User Profile -->
        <div class="px-4 py-4 border-t border-slate-200/80 bg-slate-50/50">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-sm font-bold text-white">AD</span>
            </div>
            <div class="flex-0 min-w-0">
              <p class="text-sm font-semibold text-slate-900 truncate">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" *ngIf="sidebarOpen" (click)="toggleSidebar()"></div>
    
    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out lg:ml-64">
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
        <div class="px-4 sm:px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button (click)="toggleSidebar()" class="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-all duration-200 lg:hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900">{{ getSectionTitle() }}</h1>
            </div>
            
            <!-- Logout Button -->
            <button (click)="logout()" class="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200" title="Sair">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Content Area -->
      <main class="p-4 sm:p-6">
        <!-- Dashboard Content -->
        <div *ngIf="currentSection === 'dashboard'" [@slideIn]>
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <!-- Revenue Card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-sm" [@cardHover]>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-slate-600 text-sm font-medium mb-1">Receita Total</p>
                  <p class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{{formatCurrency(dashboardStats.totalRevenue)}}</p>
                  <p class="text-emerald-600 text-sm flex items-center font-medium">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Mensal: {{ formatCurrency(dashboardStats.monthlyRevenue) }}
                  </p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Properties Card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-sm" [@cardHover]>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-slate-600 text-sm font-medium mb-1">Propriedades</p>
                  <p class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{{dashboardStats.totalProperties}}</p>
                  <p class="text-blue-600 text-sm flex items-center font-medium">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    {{dashboardStats.occupancyRate}}% ocupadas
                  </p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Tenants Card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-sm" [@cardHover]>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-slate-600 text-sm font-medium mb-1">Inquilinos</p>
                  <p class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{{dashboardStats.totalTenants}}</p>
                  <p class="text-rose-600 text-sm flex items-center font-medium">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    {{dashboardStats.defaultRate}}% inadimplentes
                  </p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Pendências Card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-sm" [@cardHover]>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-slate-600 text-sm font-medium mb-1">Pendências</p>
                  <p class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{{dashboardStats.pendingInvoices}}</p>
                  <p class="text-amber-600 text-sm flex items-center font-medium">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    Em aberto: {{ formatCurrency(dashboardStats.pendingValue) }}
                  </p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Analytics Section -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6 sm:mb-8 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 mb-6">
              <div class="w-full sm:w-auto">
                <label class="block text-sm font-medium text-slate-700 mb-2">Período de Análise</label>
                <div class="flex flex-col sm:flex-row gap-3">
                  <div class="relative">
                    <input type="date" [(ngModel)]="inicio" 
                           class="w-full sm:w-48 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                  <div class="relative">
                    <input type="date" [(ngModel)]="fim" 
                           class="w-full sm:w-48 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex gap-2">
                  <button (click)="setQuickRange('30d')" 
                          class="px-4 py-3 text-sm bg-slate-100 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-200 transition font-medium">
                    Últimos 30d
                  </button>
                  <button (click)="setQuickRange('90d')" 
                          class="px-4 py-3 text-sm bg-slate-100 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-200 transition font-medium">
                    Últimos 90d
                  </button>
                  <button (click)="setQuickRange('ytd')" 
                          class="px-4 py-3 text-sm bg-slate-100 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-200 transition font-medium">
                    Ano atual
                  </button>
                </div>
                
                <button (click)="loadAnalytics()" 
                        class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-500/25 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"/>
                  </svg>
                  Aplicar Filtros
                </button>
                
                <button (click)="exportPdf()" 
                        class="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium shadow-lg shadow-emerald-500/25 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Exportar PDF
                </button>
              </div>
              
              <div class="flex items-center gap-4">
                <div *ngIf="loadingAnalytics" class="flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Carregando dados...
                </div>
                <div *ngIf="errorAnalytics" class="text-rose-600 text-sm font-medium bg-rose-50 px-3 py-2 rounded-lg">
                  {{ errorAnalytics }}
                </div>
              </div>
            </div>

            <!-- KPIs -->
            <div *ngIf="!loadingAnalytics; else kpiSkeleton" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-xs text-blue-600 font-medium mb-1">Entradas no período</p>
                <p class="text-lg font-bold text-slate-900">{{ analytics?.caixa?.entradas ? formatCurrency(analytics?.caixa?.entradas || 0) : '-' }}</p>
              </div>
              <div class="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 text-center">
                <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <p class="text-xs text-amber-600 font-medium mb-1">A receber no período</p>
                <p class="text-lg font-bold text-slate-900">{{ analytics?.caixa?.aReceber ? formatCurrency(analytics?.caixa?.aReceber || 0) : '-' }}</p>
              </div>
              <div class="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-5 text-center">
                <div class="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <p class="text-xs text-rose-600 font-medium mb-1">Total atrasado</p>
                <p class="text-lg font-bold text-slate-900">{{ analytics?.inadimplencia?.valorTotalEmAtraso ? formatCurrency(analytics?.inadimplencia?.valorTotalEmAtraso || 0) : '-' }}</p>
              </div>
              <div class="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5 text-center">
                <div class="w-10 h-10 bg-slate-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <p class="text-xs text-slate-600 font-medium mb-1">Inquilinos inadimplentes</p>
                <p class="text-lg font-bold text-slate-900">{{ analytics?.inadimplencia?.totalInadimplentes ?? '-' }}</p>
              </div>
            </div>
            <ng-template #kpiSkeleton>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div *ngFor="let i of [1,2,3,4]" class="bg-slate-100 border border-slate-200 rounded-xl p-5 animate-pulse">
                  <div class="w-10 h-10 bg-slate-300 rounded-lg mx-auto mb-3"></div>
                  <div class="h-3 bg-slate-300 rounded w-3/4 mx-auto mb-2"></div>
                  <div class="h-4 bg-slate-300 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </ng-template>

            <!-- Charts -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <!-- Gráficos principais (linhas lado a lado) -->
              <div class="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recebimentos por mês -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-slate-900">Recebimentos por Mês</h3>
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  </div>
                  <apx-chart
                    [series]="lineRecebChartOptions.series"
                    [chart]="lineRecebChartOptions.chart"
                    [xaxis]="lineRecebChartOptions.xaxis"
                    [yaxis]="lineRecebChartOptions.yaxis"
                    [dataLabels]="lineRecebChartOptions.dataLabels"
                    [stroke]="lineRecebChartOptions.stroke"
                    [fill]="lineRecebChartOptions.fill"
                    [colors]="lineRecebChartOptions.colors"
                    [grid]="lineRecebChartOptions.grid"
                    [tooltip]="lineRecebChartOptions.tooltip"
                  ></apx-chart>
                </div>

                <!-- A receber por mês -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-slate-900">A Receber por Mês</h3>
                    <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                    </div>
                  </div>
                  <apx-chart
                    [series]="aReceberChartOptions.series"
                    [chart]="aReceberChartOptions.chart"
                    [xaxis]="aReceberChartOptions.xaxis"
                    [yaxis]="aReceberChartOptions.yaxis"
                    [dataLabels]="aReceberChartOptions.dataLabels"
                    [stroke]="aReceberChartOptions.stroke"
                    [fill]="aReceberChartOptions.fill"
                    [colors]="aReceberChartOptions.colors"
                    [grid]="aReceberChartOptions.grid"
                    [tooltip]="aReceberChartOptions.tooltip"
                  ></apx-chart>
                </div>
              </div>

              <!-- Gráfico de Status das Lojas -->
              <div class="space-y-6">
                <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-slate-900">Status das Lojas</h3>
                    <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                  </div>
                  <apx-chart
                    [series]="occDonutChartOptions.series"
                    [chart]="occDonutChartOptions.chart"
                    [labels]="occDonutChartOptions.labels"
                    [colors]="occDonutChartOptions.colors"
                    [legend]="occDonutChartOptions.legend"
                    [tooltip]="occDonutChartOptions.tooltip"
                    [plotOptions]="occDonutChartOptions.plotOptions"
                  ></apx-chart>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Outras seções -->
        <div *ngIf="currentSection === 'users'" [@slideIn]>
          <app-users></app-users>
        </div>
        
        <div *ngIf="currentSection === 'stores'" [@slideIn]>
          <app-stores></app-stores>
        </div>
        
        <div *ngIf="currentSection === 'contracts'" [@slideIn]>
          <app-contracts (contractSelected)="navigateToContractDetail($event)"></app-contracts>
        </div>

        <div *ngIf="currentSection === 'contract-detail'" [@slideIn]>
          <app-contract-detail 
            [contractId]="selectedContractId" 
            (backToList)="navigateBackToContracts()"
            (editContractEvent)="handleEditContract($event)">
          </app-contract-detail>
        </div>

        <div *ngIf="currentSection === 'invoices'" [@slideIn]>
          <app-invoices></app-invoices>
        </div>

        <div *ngIf="currentSection === 'settings'" [@slideIn]>
          <app-settings></app-settings>
        </div>
        
        <div *ngIf="currentSection === 'notifications'" [@slideIn]>
          <app-notificacoes></app-notificacoes>
        </div>
        
        <div *ngIf="currentSection === 'inadimplentes'" [@slideIn]>
          <app-inadimplentes></app-inadimplentes>
        </div>
      </main>
    </div>
  </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('cardHover', [
      state('default', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.02)' })),
      transition('default <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  sidebarOpen = true;
  currentSection = 'dashboard';
  showNotifications = false;
  showNotificationDialog = false;
  selectedContractId: string | null = null;
  
  // Dashboard statistics
  dashboardStats = {
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalProperties: 0,
    occupancyRate: 0,
    totalTenants: 0,
    defaultRate: 0,
    pendingInvoices: 0,
    pendingValue: 0
  };

  // Removido: dados mock de atividades recentes

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  // Analytics state
  inicio: string = '';
  fim: string = '';
  analytics: AnalyticsData | null = null;
  loadingAnalytics = false;
  errorAnalytics: string | null = null;

  // Charts data and options - Versão mais profissional
  lineRecebChartOptions: any = {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent'
    },
    series: [{ name: 'Recebimentos', data: [] }],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        columnWidth: '55%'
      }
    },
    fill: { type: 'solid', opacity: 0.85 },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' },
        formatter: (val: number) => this.formatCurrency(val)
      }
    },
    colors: ['#3b82f6'],
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => this.formatCurrency(val)
      }
    },
    noData: {
      text: 'Sem dados no período',
      style: {
        color: '#64748b',
        fontSize: '14px'
      }
    }
  };

  aReceberChartOptions: any = {
    chart: {
      type: 'line',
      height: 280,
      toolbar: { show: false },
      animations: { enabled: true },
      zoom: { enabled: false },
      background: 'transparent'
    },
    series: [{ name: 'A Receber', data: [] }],
    stroke: { curve: 'smooth', width: 4 },
    markers: { size: 3 },
    fill: { type: 'solid', opacity: 0.15 },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#000000ff', fontSize: '12px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' },
        formatter: (val: number) => this.formatCurrency(val)
      }
    },
    dataLabels: { enabled: false },
    colors: ['#f50b0bff'],
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => this.formatCurrency(val)
      }
    },
    noData: {
      text: 'Sem dados no período',
      style: {
        color: '#64748b',
        fontSize: '14px'
      }
    }
  };

  barTopChartOptions: any = {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      background: 'transparent'
    },
    series: [{ name: 'Valor em atraso', data: [] }],
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#64748b', fontSize: '11px' },
        rotate: -45
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' },
        formatter: (val: number) => this.formatCurrency(val)
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        columnWidth: '60%'
      }
    },
    colors: ['#ef4444'],
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => this.formatCurrency(val)
      }
    },
    noData: {
      text: 'Sem dados de inadimplência',
      style: {
        color: '#64748b',
        fontSize: '14px'
      }
    }
  };

  occDonutChartOptions: any = {
    chart: {
      type: 'donut',
      height: 280,
      toolbar: { show: false },
      background: 'transparent'
    },
    series: [0, 0, 0],
    labels: ['Ocupadas', 'Vagas', 'Inativas'],
    colors: ['#10b981', '#3b82f6', '#64748b'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        width: 8,
        height: 8,
        radius: 4
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} lojas`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              color: '#64748b'
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#0f172a'
            },
            total: {
              show: true,
              label: 'Total',
              color: '#64748b',
              formatter: (w: any) => w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    noData: {
      text: 'Sem dados de ocupação',
      style: {
        color: '#64748b',
        fontSize: '14px'
      }
    }
  };

  notifications: any[] = [];

  ngOnInit(): void {
    const today = new Date();
    const start30d = new Date();
    start30d.setDate(today.getDate() - 30);
    this.inicio = this.toInputDate(start30d);
    this.fim = this.toInputDate(today);
    this.loadAnalytics();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateTo(section: string) {
    this.currentSection = section;
  }

  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'users': 'Usuários',
      'stores': 'Lojas',
      'contracts': 'Contratos',
      'contract-detail': 'Detalhes do Contrato',
      'invoices': 'Faturas',
      'settings': 'Configurações',
      'notifications': 'Notificações',
      'inadimplentes': 'Inadimplentes'
    };
    return titles[this.currentSection] || 'Dashboard';
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  logout() {
    this.authService.logout();
  }

  private toInputDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  private formatMonthLabel(mesStr: string): string {
    const [y, m] = mesStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  }

  loadAnalytics() {
    const token = this.authService.token;
    if (!token) {
      this.errorAnalytics = 'Sessão expirada. Faça login novamente.';
      return;
    }

    this.loadingAnalytics = true;
    this.errorAnalytics = null;

    const baseUrl = `${environment.apiBaseUrl}/api/empresa/analytics`;
    const params = new URLSearchParams();
    if (this.inicio) params.append('inicio', this.inicio);
    if (this.fim) params.append('fim', this.fim);
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        const payload = (data && typeof data === 'object' && 'analytics' in data) ? data.analytics : data;
        this.analytics = payload;

        // Atualizar estatísticas do dashboard
        this.updateDashboardStats(payload);

        // Atualizar gráficos
        this.updateCharts(payload);

        this.loadingAnalytics = false;
      },
      error: (err) => {
        console.error('Erro ao carregar analytics:', err);
        this.errorAnalytics = err?.error?.message || 'Erro ao carregar dados analíticos';
        this.loadingAnalytics = false;
      }
    });
  }

  private updateDashboardStats(payload: AnalyticsData) {
    this.dashboardStats.totalRevenue = payload?.resumo?.receitaTotal || 0;
    this.dashboardStats.monthlyRevenue = payload?.resumo?.receitaMensal || 0;
    
    const prop: { total: number; taxaOcupacao: number } = payload?.resumo?.propriedades ?? { total: 0, taxaOcupacao: 0 };
    this.dashboardStats.totalProperties = prop.total || 0;
    this.dashboardStats.occupancyRate = Math.round(((prop.taxaOcupacao || 0) * 100));
    
    const inq: { total: number; taxaInadimplencia: number } = payload?.resumo?.inquilinos ?? { total: 0, taxaInadimplencia: 0 };
    this.dashboardStats.totalTenants = inq.total || 0;
    this.dashboardStats.defaultRate = Math.round(((inq.taxaInadimplencia || 0) * 100));
    
    const pend: { faturasPendentes: number; valorPendentes: number } = payload?.resumo?.pendencias ?? { faturasPendentes: 0, valorPendentes: 0 };
    this.dashboardStats.pendingInvoices = pend.faturasPendentes || 0;
    this.dashboardStats.pendingValue = pend.valorPendentes || 0;
  }

  private updateCharts(payload: AnalyticsData) {
    // Gráfico de recebimentos
    let recebSeries = (payload.series?.recebimentosPorMes || []) as Array<{ mes: string; valor: number }>;
    recebSeries = recebSeries.slice(-6);
    const recebCats = recebSeries.map(x => this.formatMonthLabel(x.mes));
    const recebVals = recebSeries.map(x => Number(x.valor) || 0);
    
    this.lineRecebChartOptions = {
      ...this.lineRecebChartOptions,
      xaxis: { ...this.lineRecebChartOptions.xaxis, categories: recebCats },
      series: [{ name: 'Recebimentos', data: recebVals }]
    };

    // Gráfico a receber
    let aRecSeries = (payload.series?.aReceberPorMes || []) as Array<{ mes: string; valor: number }>;
    aRecSeries = aRecSeries.slice(-6);
    const aRecCats = aRecSeries.map(x => this.formatMonthLabel(x.mes));
    const aRecVals = aRecSeries.map(x => Number(x.valor) || 0);
    
    this.aReceberChartOptions = {
      ...this.aReceberChartOptions,
      xaxis: { ...this.aReceberChartOptions.xaxis, categories: aRecCats },
      series: [{ name: 'A Receber', data: aRecVals }]
    };

    // Top inadimplentes
    const top = (payload.inadimplencia?.topInadimplentes || []) as Array<{ nome: string; totalEmAtraso: number }>;
    this.barTopChartOptions = {
      ...this.barTopChartOptions,
      xaxis: { ...this.barTopChartOptions.xaxis, categories: top.map(x => x.nome) },
      series: [{ name: 'Valor em atraso', data: top.map(x => x.totalEmAtraso || 0) }]
    };

    // Status das lojas
    const porStatus = (payload.lojas?.porStatus || []) as Array<{ status: string; quantidade: number }>;
    const statusMap = porStatus.reduce((acc, cur) => {
      acc[cur.status] = cur.quantidade || 0;
      return acc;
    }, {} as Record<string, number>);
    
    this.occDonutChartOptions.series = [
      statusMap['OCUPADA'] || 0,
      statusMap['VAGA'] || 0,
      statusMap['INATIVA'] || 0
    ];
  }

  setQuickRange(range: '30d' | '90d' | 'ytd') {
    const today = new Date();
    let start: Date;
    
    if (range === '30d') {
      start = new Date(today);
      start.setDate(start.getDate() - 30);
    } else if (range === '90d') {
      start = new Date(today);
      start.setDate(start.getDate() - 90);
    } else {
      start = new Date(today.getFullYear(), 0, 1);
    }
    
    this.inicio = this.toInputDate(start);
    this.fim = this.toInputDate(today);
    this.loadAnalytics();
  }

  exportPdf() {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Cores para o PDF
      const primaryColor: [number, number, number] = [59, 130, 246]; // blue-500
      const secondaryColor: [number, number, number] = [100, 116, 139]; // slate-500
      const successColor: [number, number, number] = [16, 185, 129]; // emerald-500
      const warningColor: [number, number, number] = [245, 158, 11]; // amber-500
      const dangerColor: [number, number, number] = [239, 68, 68]; // red-500

      // Header do PDF
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Relatório Analytics - InadiZero', 105, 20, { align: 'center' });
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Período: ${this.formatPdfDate(this.inicio)} até ${this.formatPdfDate(this.fim)}`, 105, 30, { align: 'center' });

      let y = 50;

      // Resumo Executivo
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RESUMO EXECUTIVO', 20, y);
      y += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const summaryData = [
        ['Receita Total:', this.formatCurrency(this.dashboardStats.totalRevenue)],
        ['Receita Mensal:', this.formatCurrency(this.dashboardStats.monthlyRevenue)],
        ['Propriedades:', `${this.dashboardStats.totalProperties} (${this.dashboardStats.occupancyRate}% ocupadas)`],
        ['Inquilinos:', `${this.dashboardStats.totalTenants} (${this.dashboardStats.defaultRate}% inadimplentes)`],
        ['Pendências:', `${this.dashboardStats.pendingInvoices} (${this.formatCurrency(this.dashboardStats.pendingValue)})`]
      ];

      summaryData.forEach(([label, value]) => {
        pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        pdf.text(label, 25, y);
        pdf.setTextColor(15, 23, 42);
        pdf.text(value, 80, y);
        y += 6;
      });

      y += 10;

      // KPIs Principais
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INDICADORES PRINCIPAIS', 20, y);
      y += 15;

      const kpis = [
        { label: 'Entradas no Período', value: this.analytics?.caixa?.entradas ? this.formatCurrency(this.analytics.caixa.entradas) : '-', color: successColor },
        { label: 'A Receber no Período', value: this.analytics?.caixa?.aReceber ? this.formatCurrency(this.analytics.caixa.aReceber) : '-', color: warningColor },
        { label: 'Total em Atraso', value: this.analytics?.inadimplencia?.valorTotalEmAtraso ? this.formatCurrency(this.analytics.inadimplencia.valorTotalEmAtraso) : '-', color: dangerColor },
        { label: 'Inquilinos Inadimplentes', value: this.analytics?.inadimplencia?.totalInadimplentes?.toString() || '-', color: secondaryColor }
      ];

      kpis.forEach((kpi, index) => {
        const x = 20 + (index % 2) * 95;
        const currentY = y + Math.floor(index / 2) * 25;
        pdf.setDrawColor(kpi.color[0], kpi.color[1], kpi.color[2]);
        const fillCol: [number, number, number] = [
          Math.min(kpi.color[0] + 40, 255),
          Math.min(kpi.color[1] + 40, 255),
          Math.min(kpi.color[2] + 40, 255)
        ];
        pdf.setFillColor(fillCol[0], fillCol[1], fillCol[2]);
        pdf.roundedRect(x, currentY, 85, 20, 3, 3, 'FD');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(kpi.label, x + 5, currentY + 8);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(kpi.value, x + 5, currentY + 15);
      });

      y += 60;

      // Top Inadimplentes
      const topInadimplentes = this.analytics?.inadimplencia?.topInadimplentes || [];
      if (topInadimplentes.length > 0) {
        pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TOP INADIMPLENTES', 20, y);
        y += 10;

        const tableData = topInadimplentes.map(inad => [
          inad.nome,
          this.formatCurrency(inad.totalEmAtraso)
        ]);

        autoTable(pdf, {
          startY: y,
          head: [['Inquilino', 'Valor em Atraso']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold'
          },
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          margin: { left: 20, right: 20 }
        });

        y = (pdf as any).lastAutoTable.finalY + 10;
      }

      // Status das Lojas
      const statusLojas = this.occDonutChartOptions.series as number[];
      if (statusLojas.some(val => val > 0)) {
        pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('DISTRIBUIÇÃO DAS LOJAS', 20, y);
        y += 10;

        const statusData = [
          ['Ocupadas', statusLojas[0] || 0],
          ['Vagas', statusLojas[1] || 0],
          ['Inativas', statusLojas[2] || 0]
        ];

        autoTable(pdf, {
          startY: y,
          head: [['Status', 'Quantidade']],
          body: statusData,
          theme: 'grid',
          headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold'
          },
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          margin: { left: 20, right: 20 }
        });
      }

      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        pdf.text(
          `Página ${i} de ${pageCount} • Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
          105,
          290,
          { align: 'center' }
        );
      }

      const fileName = `relatorio_analytics_${this.inicio}_${this.fim}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
    }
  }

  private formatPdfDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  // Restante dos métodos mantidos...
  openNotificationDialog() {
    this.showNotificationDialog = true;
    this.showNotifications = false;
  }

  closeNotificationDialog() {
    this.showNotificationDialog = false;
  }

  markAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.showNotifications = false;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getImportantNotifications() {
    return this.notifications.filter(n => n.important && !n.read);
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'error': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
      'warning': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
      'success': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'info': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[type] || 'M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z';
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      'error': 'text-red-500',
      'warning': 'text-yellow-500',
      'success': 'text-green-500',
      'info': 'text-blue-500'
    };
    return colors[type] || 'text-gray-500';
  }

  getNotificationBgColor(type: string): string {
    const colors: { [key: string]: string } = {
      'error': 'bg-red-100',
      'warning': 'bg-yellow-100',
      'success': 'bg-green-100',
      'info': 'bg-blue-100'
    };
    return colors[type] || 'bg-gray-100';
  }


  navigateToContracts() {
    this.currentSection = 'contracts';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  navigateToContractDetail(contractId: string) {
    this.selectedContractId = contractId;
    this.currentSection = 'contract-detail';
  }

  navigateBackToContracts() {
    this.selectedContractId = null;
    this.currentSection = 'contracts';
  }

  handleEditContract(contract: any) {
    this.currentSection = 'contracts';
    setTimeout(() => {
      const contractsComponent = document.querySelector('app-contracts') as any;
      if (contractsComponent && contractsComponent.editContract) {
        contractsComponent.editContract(contract);
      }
    }, 100);
  }
}
