import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CommonModule],
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
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 p-6">
      <!-- Header -->
      <div class="mb-8" [@fadeIn]>
        <h1 class="text-4xl font-bold text-yellow-400 mb-2">Gerenciamento de Lojas</h1>
        <p class="text-gray-300">Visualize e gerencie todas as propriedades</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" [@slideIn]>
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Total de Lojas</p>
              <p class="text-2xl font-bold text-white">{{ stores.length }}</p>
            </div>
            <div class="bg-blue-500/20 p-3 rounded-lg">
              <i class="fas fa-store text-blue-400 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Lojas Ocupadas</p>
              <p class="text-2xl font-bold text-white">{{ getOccupiedStores() }}</p>
            </div>
            <div class="bg-green-500/20 p-3 rounded-lg">
              <i class="fas fa-check-circle text-green-400 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Lojas Vagas</p>
              <p class="text-2xl font-bold text-white">{{ getVacantStores() }}</p>
            </div>
            <div class="bg-red-500/20 p-3 rounded-lg">
              <i class="fas fa-times-circle text-red-400 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Receita Mensal</p>
              <p class="text-2xl font-bold text-white">{{ getTotalRevenue() | currency:'BRL':'symbol':'1.0-0' }}</p>
            </div>
            <div class="bg-yellow-500/20 p-3 rounded-lg">
              <i class="fas fa-dollar-sign text-yellow-400 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center" [@slideIn]>
        <div class="flex flex-col sm:flex-row gap-4">
          <button class="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            <i class="fas fa-plus mr-2"></i>
            Nova Loja
          </button>
          <button class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            <i class="fas fa-map mr-2"></i>
            Visualizar Mapa
          </button>
        </div>
        
        <div class="flex gap-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Buscar lojas..."
              class="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <select class="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500">
            <option value="all">Todas as lojas</option>
            <option value="occupied">Ocupadas</option>
            <option value="vacant">Vagas</option>
            <option value="maintenance">Em Manutenção</option>
          </select>
        </div>
      </div>

      <!-- Stores Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" [@fadeIn]>
        <div *ngFor="let store of stores" 
             class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
             [@cardHover]>
          
          <!-- Store Image -->
          <div class="h-48 bg-gradient-to-br from-gray-700 to-gray-800 relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <i class="fas fa-store text-6xl text-gray-500"></i>
            </div>
            <div class="absolute top-4 right-4">
              <span [ngClass]="{
                'bg-green-500': store.status === 'occupied',
                'bg-red-500': store.status === 'vacant',
                'bg-yellow-500': store.status === 'maintenance'
              }" class="px-3 py-1 rounded-full text-xs font-semibold text-white">
                {{ store.status === 'occupied' ? 'Ocupada' : store.status === 'vacant' ? 'Vaga' : 'Manutenção' }}
              </span>
            </div>
          </div>
          
          <!-- Store Info -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-white">{{ store.name }}</h3>
              <span class="text-yellow-400 font-bold text-lg">{{ store.rent | currency:'BRL':'symbol':'1.0-0' }}</span>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center text-gray-300">
                <i class="fas fa-ruler-combined w-5 text-gray-400 mr-3"></i>
                <span>{{ store.area }} m²</span>
              </div>
              
              <div class="flex items-center text-gray-300" *ngIf="store.tenant">
                <i class="fas fa-user w-5 text-gray-400 mr-3"></i>
                <span>{{ store.tenant }}</span>
              </div>
              
              <div class="flex items-center text-gray-300" *ngIf="store.dueDate">
                <i class="fas fa-calendar w-5 text-gray-400 mr-3"></i>
                <span>Vence em {{ store.dueDate }}</span>
              </div>
              
              <div class="flex items-center text-gray-300">
                <i class="fas fa-map-marker-alt w-5 text-gray-400 mr-3"></i>
                <span>{{ store.location }}</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-6 flex gap-2">
              <button class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                <i class="fas fa-edit mr-2"></i>
                Editar
              </button>
              <button class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <i class="fas fa-eye"></i>
              </button>
              <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex flex-col sm:flex-row justify-between items-center" [@slideIn]>
        <div class="text-sm text-gray-400 mb-4 sm:mb-0">
          Mostrando 1 a {{ stores.length }} de {{ stores.length }} lojas
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50" disabled>
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold">1</button>
          <button class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class StoresComponent {
  stores = [
    {
      id: 1,
      name: 'Loja A1',
      area: 45,
      rent: 2500,
      status: 'occupied',
      tenant: 'Padaria do João',
      dueDate: '15/02/2024',
      location: 'Térreo - Ala Norte'
    },
    {
      id: 2,
      name: 'Loja B2',
      area: 60,
      rent: 3200,
      status: 'occupied',
      tenant: 'Farmácia Central',
      dueDate: '20/02/2024',
      location: '1º Andar - Ala Sul'
    },
    {
      id: 3,
      name: 'Loja C3',
      area: 35,
      rent: 1800,
      status: 'vacant',
      tenant: null,
      dueDate: null,
      location: 'Térreo - Ala Central'
    },
    {
      id: 4,
      name: 'Loja D4',
      area: 80,
      rent: 4500,
      status: 'occupied',
      tenant: 'Restaurante Sabor',
      dueDate: '10/03/2024',
      location: '2º Andar - Ala Norte'
    },
    {
      id: 5,
      name: 'Loja E5',
      area: 25,
      rent: 1200,
      status: 'maintenance',
      tenant: null,
      dueDate: null,
      location: 'Térreo - Ala Oeste'
    },
    {
      id: 6,
      name: 'Loja F6',
      area: 55,
      rent: 2800,
      status: 'vacant',
      tenant: null,
      dueDate: null,
      location: '1º Andar - Ala Central'
    }
  ];

  getOccupiedStores(): number {
    return this.stores.filter(store => store.status === 'occupied').length;
  }

  getVacantStores(): number {
    return this.stores.filter(store => store.status === 'vacant').length;
  }

  getTotalRevenue(): number {
    return this.stores
      .filter(store => store.status === 'occupied')
      .reduce((total, store) => total + store.rent, 0);
  }
}