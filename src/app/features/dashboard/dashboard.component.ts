import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ContractService } from '../contracts/contract.service';
import { Contract, ContractStats, StoreOption, TenantOption, CreateContractRequest, ContractStatus } from '../contracts/contract.interfaces';
import { UsersComponent } from '../users/users.component';
import { StoresComponent } from '../stores/stores.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UsersComponent, StoresComponent, SettingsComponent],
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
            
            <a (click)="navigateTo('contracts')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'contracts' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clip-rule="evenodd"/>
                <path d="M6 6h8v2H6V6zM6 10h8v2H6v-2zM6 14h5v2H6v-2z"/>
              </svg>
              Contratos
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
                
                <div class="relative">
                  <button (click)="toggleNotifications()" class="p-2 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200 relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span *ngIf="getUnreadCount() > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">{{ getUnreadCount() }}</span>
                  </button>
                  
                  <div *ngIf="showNotifications" class="absolute right-0 mt-2 w-80 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl shadow-xl z-50">
                    <div class="p-4 border-b border-gray-700">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white">Notificações</h3>
                        <button (click)="openNotificationDialog()" class="text-yellow-400 hover:text-yellow-300 text-sm">
                          Ver importantes
                        </button>
                      </div>
                    </div>
                    
                    <div class="max-h-96 overflow-y-auto">
                      <div *ngFor="let notification of notifications.slice(0, 5)" class="p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <div class="flex items-start space-x-3">
                          <div [class]="getNotificationBgColor(notification.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg [class]="getNotificationColor(notification.type)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getNotificationIcon(notification.type)"/>
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-white font-medium text-sm truncate">{{ notification.title }}</p>
                            <p class="text-gray-400 text-xs mt-1 line-clamp-2">{{ notification.message }}</p>
                            <p class="text-gray-500 text-xs mt-1">{{ notification.time }}</p>
                          </div>
                          <div *ngIf="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="p-4 border-t border-gray-700">
                      <button (click)="markAllAsRead()" class="w-full text-center text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                        Marcar todas como lidas
                      </button>
                    </div>
                  </div>
                </div>
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
                    <p class="text-3xl font-bold text-white mt-2">{{formatCurrency(dashboardStats.totalRevenue)}}</p>
                    <p class="text-green-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Receita mensal
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
                    <p class="text-3xl font-bold text-white mt-2">{{dashboardStats.totalProperties}}</p>
                    <p class="text-blue-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                      {{dashboardStats.occupancyRate}}% ocupadas
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
                    <p class="text-3xl font-bold text-white mt-2">{{dashboardStats.totalTenants}}</p>
                    <p class="text-red-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{dashboardStats.defaultRate}}% inadimplentes
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
                    <p class="text-3xl font-bold text-white mt-2">{{dashboardStats.maintenanceRequests}}</p>
                    <p class="text-orange-400 text-sm mt-1 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                      {{dashboardStats.pendingMaintenance}} pendentes
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
                <div *ngFor="let activity of recentActivities" class="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                       [class]="'bg-' + activity.color + '-500/20'">
                    <svg class="w-5 h-5" [class]="'text-' + activity.color + '-400'" fill="currentColor" viewBox="0 0 20 20">
                      <path *ngIf="activity.icon === 'check'" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      <path *ngIf="activity.icon === 'user'" d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"/>
                      <path *ngIf="activity.icon === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-white font-medium">{{activity.title}}</p>
                    <p class="text-gray-400 text-sm">{{activity.description}}</p>
                  </div>
                  <span class="text-gray-400 text-sm">{{activity.time}}</span>
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
          
          <!-- Contracts Section -->
          <div *ngIf="currentSection === 'contracts'" [@slideIn]>
            <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-white">Gestão de Contratos</h2>
                <button (click)="navigateTo('contract-management')" class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors">
                   Gerenciar Contratos
                 </button>
              </div>
              <p class="text-gray-400 mb-4">Acesse o módulo completo de contratos para gerenciar todos os aspectos dos seus contratos de locação.</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-800/50 p-4 rounded-lg">
                  <h3 class="text-white font-semibold mb-2">Contratos Ativos</h3>
                  <p class="text-2xl font-bold text-green-400">156</p>
                </div>
                <div class="bg-gray-800/50 p-4 rounded-lg">
                  <h3 class="text-white font-semibold mb-2">Vencendo em 30 dias</h3>
                  <p class="text-2xl font-bold text-yellow-400">12</p>
                </div>
                <div class="bg-gray-800/50 p-4 rounded-lg">
                  <h3 class="text-white font-semibold mb-2">Vencidos</h3>
                  <p class="text-2xl font-bold text-red-400">3</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contract Management Section -->
          <div *ngIf="currentSection === 'contract-management'" [@slideIn]>
            <div class="space-y-6">
              <!-- Header with Actions -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold text-white">Gestão Completa de Contratos</h2>
                  <div class="flex space-x-3">
                    <button (click)="openCreateContractModal()" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      + Novo Contrato
                    </button>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      📊 Relatórios
                    </button>
                  </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div class="bg-gray-800/50 p-4 rounded-lg">
                    <h3 class="text-white font-semibold mb-2">Total de Contratos</h3>
                    <p class="text-2xl font-bold text-blue-400">{{(contractStats?.totalAtivos || 0) + (contractStats?.totalVencidos || 0) + (contractStats?.totalRescindidos || 0) + (contractStats?.totalSuspensos || 0)}}</p>
                  </div>
                  <div class="bg-gray-800/50 p-4 rounded-lg">
                    <h3 class="text-white font-semibold mb-2">Contratos Ativos</h3>
                    <p class="text-2xl font-bold text-green-400">{{contractStats?.totalAtivos || 0}}</p>
                  </div>
                  <div class="bg-gray-800/50 p-4 rounded-lg">
                    <h3 class="text-white font-semibold mb-2">Vencendo em 30 dias</h3>
                    <p class="text-2xl font-bold text-yellow-400">{{contractStats?.vencendoEm30Dias || 0}}</p>
                  </div>
                  <div class="bg-gray-800/50 p-4 rounded-lg">
                    <h3 class="text-white font-semibold mb-2">Vencidos</h3>
                    <p class="text-2xl font-bold text-red-400">{{contractStats?.totalVencidos || 0}}</p>
                  </div>
                </div>
                
                <!-- Search and Filters -->
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex-1">
                    <input type="text" placeholder="Buscar contratos..." [(ngModel)]="contractSearchTerm"
                           class="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  </div>
                  <select [(ngModel)]="contractStatusFilter" class="px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativo</option>
                    <option value="expiring">Vencendo</option>
                    <option value="expired">Vencido</option>
                  </select>
                  <select [(ngModel)]="contractStoreFilter" class="px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    <option value="all">Todas as Lojas</option>
                    <option value="Loja 15A">Loja 15A</option>
                    <option value="Loja 23B">Loja 23B</option>
                    <option value="Loja 8C">Loja 8C</option>
                    <option value="Loja 7A">Loja 7A</option>
                    <option value="Loja 12D">Loja 12D</option>
                  </select>
                </div>
              </div>
              
              <!-- Contracts List -->
              <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4">Lista de Contratos</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="border-b border-gray-700">
                        <th class="pb-3 text-gray-300 font-medium">Inquilino</th>
                        <th class="pb-3 text-gray-300 font-medium">Loja</th>
                        <th class="pb-3 text-gray-300 font-medium">Valor</th>
                        <th class="pb-3 text-gray-300 font-medium">Vencimento</th>
                        <th class="pb-3 text-gray-300 font-medium">Status</th>
                        <th class="pb-3 text-gray-300 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody class="space-y-2">
                      <tr *ngFor="let contract of getFilteredContracts()" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td class="py-4 text-white">{{contract.inquilino?.nome}}</td>
                        <td class="py-4 text-gray-300">{{contract.loja?.nome}} - {{contract.loja?.numero}}</td>
                        <td class="py-4 text-green-400 font-semibold">{{formatCurrency(contract.valorAluguel)}}</td>
                        <td class="py-4" [class.text-red-400]="contract.status === ContractStatus.VENCIDO" [class.text-gray-300]="contract.status === ContractStatus.ATIVO">{{formatDate(contract.dataFim)}}</td>
                        <td class="py-4">
                          <span [class]="getStatusClass(contract.status)">{{getStatusText(contract.status)}}</span>
                        </td>
                        <td class="py-4">
                          <div class="flex space-x-2">
                            <button (click)="viewContract(contract)" class="text-blue-400 hover:text-blue-300 text-sm">Ver</button>
                            <button (click)="editContract(contract)" class="text-yellow-400 hover:text-yellow-300 text-sm">Editar</button>
                            <button *ngIf="contract.status === ContractStatus.ATIVO" (click)="renewContract(contract)" class="text-green-400 hover:text-green-300 text-sm">Renovar</button>
                            <button *ngIf="contract.status === ContractStatus.VENCIDO" (click)="rescindContract(contract)" class="text-red-400 hover:text-red-300 text-sm">Rescindir</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Pagination -->
                <div class="flex items-center justify-between mt-6">
                  <p class="text-gray-400 text-sm">Mostrando 1-5 de 171 contratos</p>
                  <div class="flex space-x-2">
                    <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">Anterior</button>
                    <button class="px-3 py-1 bg-yellow-500 text-black rounded font-medium">1</button>
                    <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">2</button>
                    <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">3</button>
                    <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">Próximo</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Settings Section -->
          <div *ngIf="currentSection === 'settings'" [@slideIn]>
            <app-settings></app-settings>
          </div>
        </main>
      </div>
      
      <!-- Create Contract Modal -->
      <div *ngIf="showCreateContractModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6 w-full max-w-md mx-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">Novo Contrato</h3>
            <button (click)="closeCreateContractModal()" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <form (ngSubmit)="createContract()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nome do Inquilino</label>
              <select [(ngModel)]="newContract.inquilinoId" name="inquilinoId" required
                      class="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option value="">Selecione um inquilino</option>
                <option *ngFor="let tenant of tenants" [value]="tenant.id">{{tenant.nome}}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Loja</label>
              <select [(ngModel)]="newContract.lojaId" name="lojaId" required
                      class="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option value="">Selecione uma loja</option>
                <option *ngFor="let store of stores" [value]="store.id">{{store.nome}} - {{store.numero}}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Valor Mensal (R$)</label>
              <input type="number" [(ngModel)]="newContract.valorAluguel" name="valorAluguel" required min="0" step="0.01"
                     class="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Data de Início</label>
              <input type="date" [(ngModel)]="newContract.dataInicio" name="dataInicio" required
                     class="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Data de Fim</label>
              <input type="date" [(ngModel)]="newContract.dataFim" name="dataFim" required
                     class="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Cláusulas</label>
              <input type="text" [(ngModel)]="newContract.clausulas" name="clausulas" placeholder="Cláusulas do contrato"
                     class="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Observações</label>
              <input type="tel" [(ngModel)]="newContract.observacoes" name="observacoes"
                     class="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            </div>
            
            <div class="flex space-x-3 pt-4">
              <button type="button" (click)="closeCreateContractModal()" 
                      class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                Cancelar
              </button>
              <button type="submit" 
                      class="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                Criar Contrato
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Contract Details Modal -->
      <div *ngIf="showContractDetails && selectedContract" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">Detalhes do Contrato</h3>
            <button (click)="closeContractDetails()" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Inquilino</label>
                <p class="text-white font-semibold">{{selectedContract.inquilino?.nome}}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Loja</label>
                <p class="text-white font-semibold">{{selectedContract.loja?.nome}} - {{selectedContract.loja?.numero}}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Valor Mensal</label>
                <p class="text-green-400 font-bold text-lg">{{formatCurrency(selectedContract.valorAluguel)}}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <span [class]="getStatusClass(selectedContract.status)">{{getStatusText(selectedContract.status)}}</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Data de Início</label>
                <p class="text-white">{{formatDate(selectedContract.dataInicio)}}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Data de Vencimento</label>
                <p class="text-white">{{formatDate(selectedContract.dataFim)}}</p>
              </div>
              
              <div *ngIf="selectedContract.inquilino?.email">
                <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <p class="text-white">{{selectedContract.inquilino?.email}}</p>
              </div>
              
              <div *ngIf="selectedContract.inquilino?.telefone">
                <label class="block text-sm font-medium text-gray-400 mb-1">Telefone</label>
                <p class="text-white">{{selectedContract.inquilino?.telefone}}</p>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3 pt-6 mt-6 border-t border-gray-700">
            <button (click)="editContract(selectedContract)" 
                    class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors">
              Editar Contrato
            </button>
            <button *ngIf="selectedContract.status === ContractStatus.ATIVO" 
                    (click)="renewContract(selectedContract)" 
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
              Renovar Contrato
            </button>
            <button *ngIf="selectedContract.status === ContractStatus.VENCIDO" 
                    (click)="rescindContract(selectedContract)" 
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
              Rescindir Contrato
            </button>
          </div>
        </div>
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
  showNotifications = false;
  showNotificationDialog = false;
  
  // Expose ContractStatus enum to template
  ContractStatus = ContractStatus;
  
  // Contract Management State
  showCreateContractModal = false;
  showContractDetails = false;
  selectedContract: Contract | null = null;
  contractSearchTerm = '';
  contractStatusFilter = 'all';
  contractStoreFilter = 'all';
  
  contracts: Contract[] = [];
  contractStats: ContractStats | null = null;
  stores: StoreOption[] = [];
  tenants: TenantOption[] = [];
  loading = false;

  // Dashboard statistics
  dashboardStats = {
    totalRevenue: 0,
    totalProperties: 0,
    occupancyRate: 0,
    totalTenants: 0,
    defaultRate: 0,
    maintenanceRequests: 0,
    pendingMaintenance: 0
  };

  recentActivities = [
    {
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'Aguardando dados do backend',
      time: 'Carregando...',
      icon: 'check',
      color: 'green'
    },
    {
      type: 'tenant',
      title: 'Novo inquilino cadastrado',
      description: 'Aguardando dados do backend',
      time: 'Carregando...',
      icon: 'user',
      color: 'blue'
    },
    {
      type: 'maintenance',
      title: 'Manutenção solicitada',
      description: 'Aguardando dados do backend',
      time: 'Carregando...',
      icon: 'warning',
      color: 'orange'
    }
  ];
  
  newContract: CreateContractRequest = {
    lojaId: '',
    inquilinoId: '',
    valorAluguel: 0,
    dataInicio: '',
    dataFim: '',
    reajusteAnual: false,
    percentualReajuste: 0,
    clausulas: '',
    observacoes: ''
  };

  constructor(private router: Router, private contractService: ContractService) {}
  
  notifications = [
    {
      id: 1,
      title: 'Pagamento em Atraso - Crítico',
      message: 'João Silva (Loja 15A) está com pagamento em atraso há 5 dias. Valor: R$ 2.500,00. Ação imediata necessária para evitar inadimplência.',
      type: 'error',
      important: true,
      time: '2 min atrás',
      read: false
    },
    {
      id: 2,
      title: 'Manutenção Urgente Solicitada',
      message: 'Problema elétrico crítico na Loja 8C. Inquilino reportou queda de energia. Técnico deve ser acionado imediatamente.',
      type: 'warning',
      important: true,
      time: '15 min atrás',
      read: false
    },
    {
      id: 3,
      title: 'Vencimento de Contrato Próximo',
      message: 'Contrato da Loja 12A (Maria Santos) vence em 7 dias. Necessário contato para renovação ou desocupação.',
      type: 'warning',
      important: true,
      time: '1 hora atrás',
      read: false
    },
    {
      id: 4,
      title: 'Novo Contrato Assinado',
      message: 'Carlos Oliveira assinou contrato para Loja 23B. Início: 01/02/2024. Valor: R$ 3.200,00/mês.',
      type: 'success',
      important: false,
      time: '2 horas atrás',
      read: false
    },
    {
      id: 5,
      title: 'Pagamento Recebido',
      message: 'Ana Costa (Loja 7A) efetuou pagamento de R$ 1.800,00 via PIX.',
      type: 'success',
      important: false,
      time: '3 horas atrás',
      read: true
    },
    {
      id: 6,
      title: 'Solicitação de Reparo',
      message: 'Loja 19C solicitou reparo no ar-condicionado. Prioridade: Média.',
      type: 'info',
      important: false,
      time: '4 horas atrás',
      read: true
    }
  ];

  ngOnInit(): void {
    this.simulateNewNotifications();
    
    // Load real contract data from backend
    this.loadContractData();
  }

  private loadContractData(): void {
    this.loading = true;
    
    // Load contracts
    this.contractService.getCompanyContracts().subscribe({
      next: (response: any) => {
        this.contracts = response.contratos;
        this.loading = false;
        this.calculateDashboardStats();
      },
      error: (error: any) => {
        console.error('Erro ao carregar contratos:', error);
        this.loading = false;
      }
    });
    
    // Load contract statistics
    this.contractService.getContractStats().subscribe({
      next: (stats: ContractStats) => {
        this.contractStats = stats;
      },
      error: (error: any) => {
        console.error('Erro ao carregar estatísticas de contratos:', error);
      }
    });
    
    // Load stores for dropdown
    this.contractService.getStores().subscribe({
      next: (stores: StoreOption[]) => {
        this.stores = stores;
        this.calculateDashboardStats();
      },
      error: (error: any) => {
        console.error('Erro ao carregar lojas:', error);
      }
    });
    
    // Load tenants for dropdown
    this.contractService.getTenants().subscribe({
      next: (tenants: TenantOption[]) => {
        this.tenants = tenants;
        this.calculateDashboardStats();
      },
      error: (error: any) => {
        console.error('Erro ao carregar inquilinos:', error);
      }
    });
  }

  private calculateDashboardStats(): void {
    if (this.contracts.length > 0) {
      // Calculate total revenue from active contracts
      this.dashboardStats.totalRevenue = this.contracts
        .filter(contract => contract.status === ContractStatus.ATIVO)
        .reduce((total, contract) => total + contract.valorAluguel, 0);

      // Calculate occupancy rate (active contracts / total stores)
      if (this.stores.length > 0) {
        const activeContracts = this.contracts.filter(contract => contract.status === ContractStatus.ATIVO).length;
        this.dashboardStats.occupancyRate = Math.round((activeContracts / this.stores.length) * 100);
      }

      // Calculate default rate (overdue contracts / total contracts)
      const overdueContracts = this.contracts.filter(contract => contract.status === ContractStatus.VENCIDO).length;
      this.dashboardStats.defaultRate = this.contracts.length > 0 ? 
        Math.round((overdueContracts / this.contracts.length) * 100) : 0;
    }

    // Set total properties and tenants
    this.dashboardStats.totalProperties = this.stores.length;
    this.dashboardStats.totalTenants = this.tenants.length;

    // Keep maintenance data as mock for now
    this.dashboardStats.maintenanceRequests = 23;
    this.dashboardStats.pendingMaintenance = 8;
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
      case 'contracts': return 'Contratos';
      case 'contract-management': return 'Gestão de Contratos';
      case 'settings': return 'Configurações';
      default: return 'Dashboard';
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

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
    switch (type) {
      case 'error': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'warning': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'success': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default: return 'M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }

  getNotificationBgColor(type: string): string {
    switch (type) {
      case 'error': return 'bg-red-500/20';
      case 'warning': return 'bg-yellow-500/20';
      case 'success': return 'bg-green-500/20';
      case 'info': return 'bg-blue-500/20';
      default: return 'bg-gray-500/20';
    }
  }

  private simulateNewNotifications() {
    setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          title: 'Nova Notificação',
          message: 'Uma nova atividade foi registrada no sistema.',
          type: 'info',
          important: Math.random() > 0.8,
          time: 'Agora',
          read: false
        };
        this.notifications.unshift(newNotification);
        
        if (this.notifications.length > 20) {
          this.notifications = this.notifications.slice(0, 20);
        }
      }
    }, 30000);
  }
  
  // Contract Management Methods
  openCreateContractModal() {
    this.showCreateContractModal = true;
    this.newContract = {
      lojaId: '',
      inquilinoId: '',
      valorAluguel: 0,
      dataInicio: '',
      dataFim: '',
      reajusteAnual: false,
      percentualReajuste: 0,
      clausulas: '',
      observacoes: ''
    };
  }
  
  closeCreateContractModal() {
    this.showCreateContractModal = false;
  }
  
  createContract() {
    if (this.newContract.lojaId && this.newContract.inquilinoId && this.newContract.valorAluguel > 0) {
      this.loading = true;
      
      this.contractService.createContract(this.newContract).subscribe({
        next: (response) => {
          console.log('Contrato criado com sucesso:', response);
          this.closeCreateContractModal();
          this.loadContractData(); // Recarrega os dados
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao criar contrato:', error);
          this.loading = false;
        }
      });
    }
  }
  
  viewContract(contract: any) {
    this.selectedContract = contract;
    this.showContractDetails = true;
  }
  
  closeContractDetails() {
    this.showContractDetails = false;
    this.selectedContract = null;
  }
  
  editContract(contract: Contract) {
    // Para edição, você pode implementar um modal de edição ou navegar para uma página específica
    console.log('Edit contract:', contract);
    // Exemplo: abrir modal de edição ou navegar para página de edição
    // this.router.navigate(['/contracts/edit', contract.id]);
  }
  
  renewContract(contract: Contract) {
    if (confirm('Deseja renovar este contrato?')) {
      this.loading = true;
      
      const renewData = {
        novaDataFim: '', // Será definida pelo backend
        observacoes: 'Renovação automática'
      };
      
      this.contractService.renewContract(contract.id, renewData).subscribe({
        next: (response) => {
          console.log('Contrato renovado com sucesso:', response);
          this.loadContractData(); // Recarrega os dados
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao renovar contrato:', error);
          this.loading = false;
        }
      });
    }
  }
  
  rescindContract(contract: Contract) {
    if (confirm('Deseja rescindir este contrato? Esta ação não pode ser desfeita.')) {
      this.loading = true;
      
      this.contractService.deleteContract(contract.id).subscribe({
        next: (response) => {
          console.log('Contrato rescindido com sucesso:', response);
          this.closeContractDetails();
          this.loadContractData(); // Recarrega os dados
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao rescindir contrato:', error);
          this.loading = false;
        }
      });
    }
  }
  
  getFilteredContracts() {
    return this.contracts.filter(contract => {
      const matchesSearch = (contract.inquilino?.nome || '').toLowerCase().includes(this.contractSearchTerm.toLowerCase()) ||
                           (contract.loja?.nome || '').toLowerCase().includes(this.contractSearchTerm.toLowerCase()) ||
                           (contract.loja?.numero || '').toLowerCase().includes(this.contractSearchTerm.toLowerCase());
      const matchesStatus = this.contractStatusFilter === 'all' || contract.status === this.contractStatusFilter;
      const matchesStore = this.contractStoreFilter === 'all' || contract.loja?.id === this.contractStoreFilter;
      
      return matchesSearch && matchesStatus && matchesStore;
    });
  }
  
  getStatusClass(status: ContractStatus): string {
    switch (status) {
      case ContractStatus.ATIVO: return 'px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium';
      case ContractStatus.VENCIDO: return 'px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium';
      case ContractStatus.RESCINDIDO: return 'px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium';
      case ContractStatus.SUSPENSO: return 'px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium';
      default: return 'px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium';
    }
  }
  
  getStatusText(status: ContractStatus): string {
    switch (status) {
      case ContractStatus.ATIVO: return 'Ativo';
      case ContractStatus.VENCIDO: return 'Vencido';
      case ContractStatus.RESCINDIDO: return 'Rescindido';
      case ContractStatus.SUSPENSO: return 'Suspenso';
      default: return 'Desconhecido';
    }
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
}