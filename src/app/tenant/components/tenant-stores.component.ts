import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPortalInquilinoData, ILojaInquilino } from '../tenant.interfaces';

@Component({
  selector: 'app-tenant-stores',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header da Seção -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent flex items-center">
            <svg class="w-6 h-6 mr-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <rect x="4" y="10" width="16" height="10" rx="2" ry="2" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18l-2 3H5L3 7z" />
            </svg>
            Minhas Lojas
          </h2>
          <p class="text-blue-600/60 mt-1">Gerencie todas as suas lojas e espaços comerciais</p>
        </div>
        <div class="flex items-center space-x-2 text-sm text-blue-600/60">
          <svg class="w-3 h-3 text-blue-600/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke-width="2" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3" />
          </svg>
          <span>Atualizado agora</span>
        </div>
      </div>

      <!-- Resumo das Lojas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Total de Lojas</p>
              <p class="text-2xl font-bold text-blue-600">{{ getStores().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="4" y="10" width="16" height="10" rx="2" ry="2" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18l-2 3H5L3 7z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Área Total</p>
              <p class="text-2xl font-bold text-green-600">{{ getTotalArea() }} m²</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="4" y="6" width="16" height="4" rx="1" ry="1" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 10v4M10 10v4M14 10v4M18 10v4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Valor Total Mensal</p>
              <p class="text-2xl font-bold text-purple-600">{{ getTotalMonthlyValue() | currency:'BRL':'symbol':'1.0-0' }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke-width="2" />
                <circle cx="12" cy="12" r="3" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Categorias</p>
              <p class="text-2xl font-bold text-amber-600">{{ getUniqueCategories().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h8l4 4-8 8-4-4V7z" />
                <circle cx="9.5" cy="11.5" r="1.5" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <div class="flex flex-wrap gap-3">
          <button 
            (click)="setFilter('all')"
            [class]="getFilterButtonClass('all')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-list mr-2"></i>
            Todas ({{ getStores().length }})
          </button>
          <button 
            *ngFor="let categoria of getUniqueCategories()"
            (click)="setFilter(categoria)"
            [class]="getFilterButtonClass(categoria)"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-tag mr-2"></i>
            {{ categoria }} ({{ getStoresByCategory(categoria).length }})
          </button>
        </div>
      </div>

      <!-- Lista de Lojas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div *ngFor="let loja of getFilteredStores(); let i = index" 
             class="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:border-blue-200 transition-all duration-300 hover:shadow-xl overflow-hidden">
          
          <!-- Header do Card -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold">{{ loja.nome }}</h3>
                <p class="text-blue-100 text-sm">Loja {{ loja.numero }}</p>
              </div>
              <div class="text-right">
                <span class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  {{ loja.categoria }}
                </span>
              </div>
            </div>
          </div>

          <!-- Conteúdo do Card -->
          <div class="p-6 space-y-4">
            <!-- Informações Básicas -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex items-center text-sm text-blue-600/60">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s-6-5.373-6-10a6 6 0 1112 0c0 4.627-6 10-6 10z" />
                    <circle cx="12" cy="11" r="3" stroke-width="2" />
                  </svg>
                  <span>{{ loja.localizacao }}</span>
                </div>
                <div class="flex items-center text-sm text-blue-600/60">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <rect x="4" y="6" width="16" height="4" rx="1" ry="1" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 10v4M10 10v4M14 10v4M18 10v4" />
                  </svg>
                  <span>{{ loja.area }} m²</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center text-sm text-blue-600/60">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <rect x="4" y="6" width="16" height="14" rx="2" ry="2" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3v4M16 3v4M4 10h16" />
                  </svg>
                  <span>Desde {{ loja.contrato.dataInicio | date:'MM/yyyy' }}</span>
                </div>
                <div class="flex items-center text-sm text-blue-600/60">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <circle cx="12" cy="12" r="8" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3" />
                  </svg>
                  <span>{{ getContractTimeRemaining(loja) }}</span>
                </div>
              </div>
            </div>

            <!-- Informações Financeiras -->
            <div class="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-4">
              <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke-width="2" />
                  <circle cx="12" cy="12" r="3" stroke-width="2" />
                </svg>
                Informações Financeiras
              </h4>
              
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-blue-600/70">Aluguel:</span>
                  <span class="font-semibold text-blue-900">{{ loja.contrato.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-blue-600/70">IPTU:</span>
                    <span class="font-semibold text-blue-900">{{ 0 | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-blue-600/70">Condomínio:</span>
                    <span class="font-semibold text-blue-900">{{ 0 | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                <div class="flex justify-between border-t border-blue-200 pt-2">
                  <span class="text-blue-600/70 font-medium">Total:</span>
                  <span class="font-bold text-blue-900">{{ loja.contrato.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <!-- Status do Contrato -->
            <div class="flex items-center justify-between p-3 rounded-lg"
                 [ngClass]="getContractStatusClass(loja)">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <rect x="6" y="3" width="12" height="18" rx="2" ry="2" stroke-width="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6M9 12h6M9 16h4" />
                </svg>
                <span class="font-medium">{{ getContractStatus(loja) }}</span>
              </div>
              <span class="text-sm">{{ getContractExpiryDate(loja) }}</span>
            </div>

            <!-- Ações -->
            <div class="flex justify-between space-x-2 pt-2">
              <div class="flex space-x-2">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-eye mr-1"></i>
                  Detalhes
                </button>
                <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-file-invoice mr-1"></i>
                  Faturas
                </button>
              </div>
              <div class="flex space-x-2">
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-download mr-1"></i>
                  Contrato
                </button>
                <button *ngIf="isNearExpiry(loja)" 
                        class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-redo mr-1"></i>
                  Renovar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div *ngIf="getFilteredStores().length === 0" class="col-span-full text-center py-12">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <rect x="4" y="10" width="16" height="10" rx="2" ry="2" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18l-2 3H5L3 7z" />
            </svg>
          </div>
          <p class="text-blue-900/60 font-semibold text-lg">Nenhuma loja encontrada</p>
          <p class="text-blue-900/40 text-sm mt-2">{{ getEmptyStateMessage() }}</p>
        </div>
      </div>

      <!-- Estatísticas por Categoria -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="8" stroke-width="2" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12L12 4M12 12L18 12" />
          </svg>
          Estatísticas por Categoria
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div *ngFor="let categoria of getUniqueCategories()" 
               class="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-blue-900">{{ categoria }}</h4>
              <span class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {{ getStoresByCategory(categoria).length }}
              </span>
            </div>
            
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-600/70">Área Total:</span>
                <span class="font-medium text-blue-900">{{ getTotalAreaByCategory(categoria) }} m²</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-600/70">Valor Mensal:</span>
                <span class="font-medium text-blue-900">{{ getTotalValueByCategory(categoria) | currency:'BRL':'symbol':'1.0-0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
export class TenantStoresComponent {
  @Input() portalData: IPortalInquilinoData | null = null;
  
  currentFilter: string = 'all';

  // Métodos para obter lojas
  getStores(): ILojaInquilino[] {
    if (!this.portalData) return [];
    return this.portalData.lojas;
  }

  getUniqueCategories(): string[] {
    const categories = this.getStores().map(loja => loja.categoria || 'Sem categoria');
    return [...new Set(categories)];
  }

  getStoresByCategory(categoria: string): ILojaInquilino[] {
    return this.getStores().filter(loja => (loja.categoria || 'Sem categoria') === categoria);
  }

  // Métodos de filtro
  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  getFilteredStores(): ILojaInquilino[] {
    if (this.currentFilter === 'all') {
      return this.getStores();
    }
    return this.getStoresByCategory(this.currentFilter);
  }

  getFilterButtonClass(filter: string): string {
    const baseClass = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
    if (this.currentFilter === filter) {
      return `${baseClass} bg-blue-600 text-white shadow-lg`;
    }
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  getEmptyStateMessage(): string {
    if (this.currentFilter === 'all') {
      return 'Nenhuma loja disponível';
    }
    return `Nenhuma loja da categoria "${this.currentFilter}" encontrada`;
  }

  // Métodos de cálculo
  getTotalArea(): number {
    return this.getStores().reduce((total, loja) => total + (loja.area || 0), 0);
  }

  getTotalMonthlyValue(): number {
    return this.getStores().reduce((total, loja) => 
      total + loja.contrato.valorAluguel, 0);
  }

  getTotalMonthlyValueForStore(loja: ILojaInquilino): number {
    return loja.contrato.valorAluguel;
  }

  getCategoryStats() {
    const categories = this.getUniqueCategories();
    return categories.map(categoria => ({
      name: categoria,
      count: this.getStoresByCategory(categoria).length,
      area: this.getTotalAreaByCategory(categoria),
      value: this.getStoresByCategory(categoria).reduce((total, loja) => 
        total + loja.contrato.valorAluguel, 0)
    }));
  }

  getTotalAreaByCategory(categoria: string): number {
    return this.getStoresByCategory(categoria).reduce((total, loja) => total + (loja.area || 0), 0);
  }

  getTotalValueByCategory(categoria: string): number {
    return this.getStoresByCategory(categoria).reduce((total, loja) => 
      total + loja.contrato.valorAluguel, 0);
  }

  // Métodos de contrato
  getContractTimeRemaining(loja: ILojaInquilino): string {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    
    if (diffTime <= 0) {
      return 'Vencido';
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} ano${years > 1 ? 's' : ''} restante${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mês${months > 1 ? 'es' : ''} restante${months > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} restante${diffDays > 1 ? 's' : ''}`;
    }
  }

  isNearExpiry(loja: ILojaInquilino): boolean {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 90 && diffDays > 0;
  }

  getContractStatus(loja: ILojaInquilino): string {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    
    if (fim < hoje) {
      return 'Contrato Vencido';
    } else if (this.isNearExpiry(loja)) {
      return 'Próximo ao Vencimento';
    }
    return 'Contrato Ativo';
  }

  getContractStatusClass(loja: ILojaInquilino): string {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    
    if (fim < hoje) {
      return 'bg-red-100 text-red-800';
    } else if (this.isNearExpiry(loja)) {
      return 'bg-amber-100 text-amber-800';
    }
    return 'bg-green-100 text-green-800';
  }

  getContractExpiryDate(loja: ILojaInquilino): string {
    const fim = new Date(loja.contrato.dataFim);
    return `Vence em ${fim.toLocaleDateString('pt-BR')}`;
  }
}