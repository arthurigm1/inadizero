import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AuthService } from '../../auth/auth.service';

import { UsersComponent } from '../users/users.component';
import { StoresComponent } from '../stores/stores.component';
import { SettingsComponent } from '../settings/settings.component';
import { ContractsComponent } from '../contracts/contracts.component';
import { ContractDetailComponent } from '../contracts/contract-detail/contract-detail.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UsersComponent, StoresComponent, SettingsComponent, ContractsComponent, ContractDetailComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" [@fadeIn]>
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white backdrop-blur-xl border-r border-blue-200 transform transition-transform duration-300 ease-in-out" 
           [class.translate-x-0]="sidebarOpen" 
           [class.-translate-x-full]="!sidebarOpen">
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center justify-center h-16 px-4 border-b border-blue-200">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-blue-800">InadiZero</span>
            </div>
          </div>
          
          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            <a (click)="navigateTo('dashboard')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'dashboard' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              Dashboard
            </a>
            
            <a (click)="navigateTo('users')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'users' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              Usuários
            </a>
            
            <a (click)="navigateTo('stores')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'stores' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clip-rule="evenodd"/>
                <path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
              </svg>
              Lojas
            </a>
            
            <a (click)="navigateTo('contracts')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'contracts' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clip-rule="evenodd"/>
                <path d="M6 6h8v2H6V6zM6 10h8v2H6v-2zM6 14h5v2H6v-2z"/>
              </svg>
              Contratos
            </a>
            
            <a (click)="navigateTo('settings')" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
               [class]="currentSection === 'settings' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg>
              Configurações
            </a>
          </nav>
          
          <!-- User Profile -->
          <div class="px-4 py-4 border-t border-blue-200">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span class="text-xs font-bold text-white">AD</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-blue-900 truncate">Admin</p>
                <p class="text-xs text-gray-500 truncate">admin&#64;inadizero.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="transition-all duration-300 ease-in-out" [class.ml-64]="sidebarOpen" [class.ml-0]="!sidebarOpen">
        <!-- Header -->
        <header class="bg-white backdrop-blur-xl border-b border-blue-200 sticky top-0 z-40">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button (click)="toggleSidebar()" class="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
                <h1 class="text-2xl font-bold text-blue-900">{{ getSectionTitle() }}</h1>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <input type="text" placeholder="Buscar..." 
                         class="w-64 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
                  <svg class="absolute right-3 top-2.5 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                
                <div class="relative">
                  <button (click)="toggleNotifications()" class="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span *ngIf="getUnreadCount() > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">{{ getUnreadCount() }}</span>
                  </button>
                  
                  <div *ngIf="showNotifications" class="absolute right-0 mt-2 w-80 bg-white border border-blue-200 rounded-xl shadow-xl z-50">
                    <div class="p-4 border-b border-blue-200">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-blue-900">Notificações</h3>
                        <button (click)="openNotificationDialog()" class="text-blue-600 hover:text-blue-800 text-sm">
                          Ver importantes
                        </button>
                      </div>
                    </div>
                    
                    <div class="max-h-96 overflow-y-auto">
                      <div *ngFor="let notification of notifications.slice(0, 5)" class="p-4 border-b border-blue-100 hover:bg-blue-50 transition-colors">
                        <div class="flex items-start space-x-3">
                          <div [class]="getNotificationBgColor(notification.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg [class]="getNotificationColor(notification.type)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getNotificationIcon(notification.type)"/>
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-blue-900 font-medium text-sm truncate">{{ notification.title }}</p>
                            <p class="text-gray-600 text-xs mt-1 line-clamp-2">{{ notification.message }}</p>
                            <p class="text-gray-400 text-xs mt-1">{{ notification.time }}</p>
                          </div>
                          <div *ngIf="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="p-4 border-t border-blue-200">
                      <button (click)="markAllAsRead()" class="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Marcar todas como lidas
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Logout Button -->
                <button (click)="logout()" class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200" title="Sair">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
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
              <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 transform hover:scale-105" [@cardHover]>
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
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Properties Card -->
              <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 transform hover:scale-105" [@cardHover]>
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
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Tenants Card -->
              <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 transform hover:scale-105" [@cardHover]>
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
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Maintenance Card -->
              <div class="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 transform hover:scale-105" [@cardHover]>
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
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="bg-white border border-blue-200 rounded-xl p-6">
                <h3 class="text-xl font-bold text-blue-900 mb-4">Receita Mensal</h3>
                <div class="h-64 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <p class="text-gray-500">Gráfico de receita será implementado</p>
                  </div>
                </div>
              </div>
              
              <!-- Occupancy Chart -->
              <div class="bg-white border border-blue-200 rounded-xl p-6">
                <h3 class="text-xl font-bold text-blue-900 mb-4">Taxa de Ocupação</h3>
                <div class="h-64 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                    </svg>
                    <p class="text-gray-500">Gráfico de ocupação será implementado</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="bg-white border border-blue-200 rounded-xl p-6">
              <h3 class="text-xl font-bold text-blue-900 mb-6">Atividades Recentes</h3>
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
            <app-contracts (contractSelected)="navigateToContractDetail($event)"></app-contracts>
          </div>

          <!-- Contract Detail Section -->
          <div *ngIf="currentSection === 'contract-detail'" [@slideIn]>
            <app-contract-detail 
              [contractId]="selectedContractId" 
              (backToList)="navigateBackToContracts()"
              (editContractEvent)="handleEditContract($event)">
            </app-contract-detail>
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
  showNotifications = false;
  showNotificationDialog = false;
  selectedContractId: string | null = null;
  
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

  constructor(private router: Router, private authService: AuthService) {}
  
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
      message: 'Problema elétrico crítico na Loja 8C. Inquilino reportou queda de energia. Técnico deve be acionado imediatamente.',
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
  }

  private calculateDashboardStats(): void {
    // Set mock data for dashboard statistics
    this.dashboardStats.totalRevenue = 125000;
    this.dashboardStats.totalProperties = 45;
    this.dashboardStats.occupancyRate = 87;
    this.dashboardStats.totalTenants = 39;
    this.dashboardStats.defaultRate = 5;
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
      case 'contract-detail': return 'Detalhes do Contrato';
      case 'settings': return 'Configurações';
      default: return 'Dashboard';
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  logout() {
    this.authService.logout();
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
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  }

  getNotificationBgColor(type: string): string {
    switch (type) {
      case 'error': return 'bg-red-100';
      case 'warning': return 'bg-yellow-100';
      case 'success': return 'bg-green-100';
      case 'info': return 'bg-blue-100';
      default: return 'bg-gray-100';
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
    // Navigate back to contracts section and trigger edit mode
    this.currentSection = 'contracts';
    // The contracts component will handle the edit modal display
    // We need to pass the contract to edit to the contracts component
    setTimeout(() => {
      // Use a small delay to ensure the contracts component is rendered
      const contractsComponent = document.querySelector('app-contracts') as any;
      if (contractsComponent && contractsComponent.editContract) {
        contractsComponent.editContract(contract);
      }
    }, 100);
  }
}