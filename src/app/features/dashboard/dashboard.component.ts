import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { UsersComponent } from '../users/users.component';
import { StoresComponent } from '../stores/stores.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UsersComponent, StoresComponent, SettingsComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black" [@fadeIn]>
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-50 w-64 bg-black/90 backdrop-blur-xl border-r border-yellow-500/30 transform transition-transform duration-300 ease-in-out" 
           [class.translate-x-0]="sidebarOpen" 
           [class.-translate-x-full]="!sidebarOpen">
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center justify-center h-16 px-4 border-b border-yellow-500/30">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-white">InadiZero</span>
            </div>
          </div>
          
          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            <a (click)="navigateTo('dashboard')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'dashboard' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              Dashboard
            </a>
            
            <a (click)="navigateTo('users')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'users' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              Usuários
            </a>
            
            <a (click)="navigateTo('stores')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'stores' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clip-rule="evenodd"/>
                <path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
              </svg>
              Lojas
            </a>
            
            <a (click)="navigateTo('settings')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'settings' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg>
              Configurações
            </a>
          </nav>
          
          <!-- User Profile -->
          <div class="px-4 py-4 border-t border-yellow-500/30">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span class="text-xs font-bold text-black">AD</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">Admin</p>
                <p class="text-xs text-gray-400 truncate">admin&#64;inadizero.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="transition-all duration-300 ease-in-out" [class.ml-64]="sidebarOpen" [class.ml-0]="!sidebarOpen">
        <!-- Header -->
        <header class="bg-black/50 backdrop-blur-xl border-b border-yellow-500/30 sticky top-0 z-40">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button (click)="toggleSidebar()" class="p-2 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
                <h1 class="text-2xl font-bold text-white">{{ getSectionTitle() }}</h1>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <input type="text" placeholder="Buscar..." 
                         class="w-64 px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300">
                  <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                
                <button class="p-2 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200 relative">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Content Area -->
        <main class="p-6">
          <!-- Dashboard Content -->
          <div *ngIf="currentSection === 'dashboard'" [@slideIn]>
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <!-- Revenue Card -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105" [@cardHover]>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-yellow-400 text-sm font-medium">Receita Total</p>
                    <p class="text-3xl font-bold text-white mt-2">R$ 125.430</p>
                    <p class="text-green-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                      </svg>
                      +12.5%
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Properties Card -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105" [@cardHover]>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-yellow-400 text-sm font-medium">Propriedades</p>
                    <p class="text-3xl font-bold text-white mt-2">247</p>
                    <p class="text-blue-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                      85% ocupadas
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Tenants Card -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105" [@cardHover]>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-yellow-400 text-sm font-medium">Inquilinos</p>
                    <p class="text-3xl font-bold text-white mt-2">189</p>
                    <p class="text-red-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      15% inadimplentes
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Maintenance Card -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105" [@cardHover]>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-yellow-400 text-sm font-medium">Manutenções</p>
                    <p class="text-3xl font-bold text-white mt-2">23</p>
                    <p class="text-orange-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                      5 pendentes
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <!-- Revenue Chart -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4">Receita Mensal</h3>
                <div class="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <p class="text-gray-400">Gráfico de receita será implementado</p>
                  </div>
                </div>
              </div>
              
              <!-- Occupancy Chart -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4">Taxa de Ocupação</h3>
                <div class="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                    </svg>
                    <p class="text-gray-400">Gráfico de ocupação será implementado</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6">
              <h3 class="text-xl font-bold text-white mb-6">Atividades Recentes</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-white font-medium">Pagamento recebido</p>
                    <p class="text-gray-400 text-sm">João Silva - Loja 15A - R$ 2.500,00</p>
                  </div>
                  <span class="text-gray-400 text-sm">2 min atrás</span>
                </div>
                
                <div class="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-white font-medium">Novo inquilino cadastrado</p>
                    <p class="text-gray-400 text-sm">Maria Santos - Loja 23B</p>
                  </div>
                  <span class="text-gray-400 text-sm">15 min atrás</span>
                </div>
                
                <div class="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div class="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-white font-medium">Manutenção solicitada</p>
                    <p class="text-gray-400 text-sm">Loja 8C - Problema elétrico</p>
                  </div>
                  <span class="text-gray-400 text-sm">1 hora atrás</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Users Section -->
          <div *ngIf="currentSection === 'users'" [@slideIn]>
            <app-users></app-users>
          </div>
          
          <!-- Stores Section -->
          <div *ngIf="currentSection === 'stores'" [@slideIn]>
            <app-stores></app-stores>
          </div>
          
          <!-- Settings Section -->
          <div *ngIf="currentSection === 'settings'" [@slideIn]>
            <app-settings></app-settings>
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
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('cardHover', [
      state('default', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.05)' })),
      transition('default <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  sidebarOpen = true;
  currentSection = 'dashboard';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // TODO: Implementar carregamento de dados do dashboard
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateTo(section: string) {
    this.currentSection = section;
  }

  getSectionTitle(): string {
    switch (this.currentSection) {
      case 'dashboard': return 'Dashboard';
      case 'users': return 'Usuários';
      case 'stores': return 'Lojas';
      case 'settings': return 'Configurações';
      default: return 'Dashboard';
    }
  }
}