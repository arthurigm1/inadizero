import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPortalInquilinoData, ILojaInquilino } from '../tenant.interfaces';

@Component({
  selector: 'app-tenant-contracts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header da Seção -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent flex items-center">
            <i class="fas fa-file-contract mr-3 text-blue-600"></i>
            Meus Contratos
          </h2>
          <p class="text-blue-600/60 mt-1">Visualize e gerencie todos os seus contratos de locação</p>
        </div>
        <div class="flex items-center space-x-2 text-sm text-blue-600/60">
          <i class="fas fa-sync-alt text-xs"></i>
          <span>Atualizado agora</span>
        </div>
      </div>

      <!-- Resumo dos Contratos -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Total de Contratos</p>
              <p class="text-2xl font-bold text-blue-600">{{ getActiveContracts().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-file-contract text-white"></i>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Contratos Ativos</p>
              <p class="text-2xl font-bold text-green-600">{{ getActiveContracts().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-check-circle text-white"></i>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Próximos Vencimentos</p>
              <p class="text-2xl font-bold text-amber-600">{{ getContractsNearExpiry().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-calendar-alt text-white"></i>
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
              <i class="fas fa-dollar-sign text-white"></i>
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
            Todos ({{ getActiveContracts().length }})
          </button>
          <button 
            (click)="setFilter('active')"
            [class]="getFilterButtonClass('active')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-check-circle mr-2"></i>
            Ativos ({{ getActiveContracts().length }})
          </button>
          <button 
            (click)="setFilter('expiring')"
            [class]="getFilterButtonClass('expiring')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-calendar-alt mr-2"></i>
            Próximos ao Vencimento ({{ getContractsNearExpiry().length }})
          </button>
        </div>
      </div>

      <!-- Lista de Contratos -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">
            {{ getFilterTitle() }}
          </h3>
          
          <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            <div *ngFor="let loja of getFilteredContracts(); let i = index" 
                 class="group relative bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg p-6">
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="getStatusBadgeClass(loja)">
                  {{ getContractStatus(loja) }}
                </span>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Informações da Loja -->
                <div class="space-y-3">
                  <div>
                    <h4 class="font-bold text-lg text-blue-900">{{ loja.nome }}</h4>
                    <p class="text-blue-600/70 font-medium">Loja {{ loja.numero }}</p>
                  </div>
                  
                  <div class="space-y-2">
                    <div class="flex items-center text-sm text-blue-600/60">
                      <i class="fas fa-map-marker-alt w-4 mr-2"></i>
                      <span>{{ loja.localizacao }}</span>
                    </div>
                    <div class="flex items-center text-sm text-blue-600/60">
                      <i class="fas fa-ruler-combined w-4 mr-2"></i>
                      <span>{{ loja.area }} m²</span>
                    </div>
                    <div class="flex items-center text-sm text-blue-600/60">
                      <i class="fas fa-tag w-4 mr-2"></i>
                      <span>{{ loja.categoria }}</span>
                    </div>
                  </div>
                </div>

                <!-- Informações do Contrato -->
                <div class="space-y-3">
                  <h5 class="font-semibold text-blue-900">Detalhes do Contrato</h5>
                  
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-blue-600/60">Início:</span>
                      <span class="text-sm font-medium text-blue-900">{{ loja.contrato.dataInicio | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-blue-600/60">Vencimento:</span>
                      <span class="text-sm font-medium text-blue-900">{{ loja.contrato.dataFim | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-blue-600/60">Duração:</span>
                      <span class="text-sm font-medium text-blue-900">{{ getContractDuration(loja) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-blue-600/60">Tempo Restante:</span>
                      <span class="text-sm font-medium" [ngClass]="getTimeRemainingClass(loja)">
                        {{ getTimeRemaining(loja) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Informações Financeiras -->
                <div class="space-y-3">
                  <h5 class="font-semibold text-blue-900">Informações Financeiras</h5>
                  
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-blue-600/60">Aluguel:</span>
                      <span class="text-sm font-medium text-blue-900">{{ loja.contrato.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-blue-600/60">IPTU:</span>
                      <span class="text-sm font-medium text-blue-900">{{ 0 | currency:'BRL':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-blue-600/60">Condomínio:</span>
                      <span class="text-sm font-medium text-blue-900">{{ 0 | currency:'BRL':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="border-t border-blue-100 pt-2 mt-2">
                      <div class="flex justify-between">
                        <span class="text-sm font-medium text-blue-600/80">Total Mensal:</span>
                        <span class="text-lg font-bold text-blue-900">{{ getTotalMonthlyValueForStore(loja) | currency:'BRL':'symbol':'1.2-2' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="mt-6 flex justify-end space-x-3">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-eye mr-2"></i>
                  Ver Contrato
                </button>
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-download mr-2"></i>
                  Baixar PDF
                </button>
                <button *ngIf="isNearExpiry(loja)" 
                        class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-redo mr-2"></i>
                  Renovar
                </button>
              </div>
            </div>

            <!-- Estado vazio -->
            <div *ngIf="getFilteredContracts().length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-file-contract text-3xl text-blue-400"></i>
              </div>
              <p class="text-blue-900/60 font-semibold text-lg">Nenhum contrato encontrado</p>
              <p class="text-blue-900/40 text-sm mt-2">{{ getEmptyStateMessage() }}</p>
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
export class TenantContractsComponent {
  @Input() portalData: IPortalInquilinoData | null = null;
  
  currentFilter: string = 'all';

  // Métodos para obter contratos
  getActiveContracts(): ILojaInquilino[] {
    if (!this.portalData) return [];
    return this.portalData.lojas;
  }

  getContractsNearExpiry(): ILojaInquilino[] {
    return this.getActiveContracts().filter(loja => this.isNearExpiry(loja));
  }

  // Métodos de filtro
  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  getFilteredContracts(): ILojaInquilino[] {
    switch (this.currentFilter) {
      case 'active':
        return this.getActiveContracts();
      case 'expiring':
        return this.getContractsNearExpiry();
      default:
        return this.getActiveContracts();
    }
  }

  getFilterButtonClass(filter: string): string {
    const baseClass = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
    if (this.currentFilter === filter) {
      return `${baseClass} bg-blue-600 text-white shadow-lg`;
    }
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  getFilterTitle(): string {
    switch (this.currentFilter) {
      case 'active':
        return 'Contratos Ativos';
      case 'expiring':
        return 'Contratos Próximos ao Vencimento';
      default:
        return 'Todos os Contratos';
    }
  }

  getEmptyStateMessage(): string {
    switch (this.currentFilter) {
      case 'active':
        return 'Nenhum contrato ativo encontrado';
      case 'expiring':
        return 'Nenhum contrato próximo ao vencimento';
      default:
        return 'Nenhum contrato disponível';
    }
  }

  // Métodos de cálculo e formatação
  getTotalMonthlyValue(): number {
    return this.getActiveContracts().reduce((total, loja) => 
      total + this.getTotalMonthlyValueForStore(loja), 0);
  }

  getTotalMonthlyValueForStore(loja: ILojaInquilino): number {
    return loja.contrato.valorAluguel;
  }

  getContractDuration(loja: ILojaInquilino): string {
    const inicio = new Date(loja.contrato.dataInicio);
    const fim = new Date(loja.contrato.dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return months > 0 ? `${years} ano${years > 1 ? 's' : ''} e ${months} mês${months > 1 ? 'es' : ''}` : `${years} ano${years > 1 ? 's' : ''}`;
    }
    return `${months} mês${months > 1 ? 'es' : ''}`;
  }

  getTimeRemaining(loja: ILojaInquilino): string {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    
    if (diffTime <= 0) {
      return 'Vencido';
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    if (years > 0) {
      return `${years} ano${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mês${months > 1 ? 'es' : ''}`;
    } else {
      return `${days} dia${days > 1 ? 's' : ''}`;
    }
  }

  getTimeRemainingClass(loja: ILojaInquilino): string {
    if (this.isNearExpiry(loja)) {
      return 'text-amber-600 font-semibold';
    }
    return 'text-green-600';
  }

  isNearExpiry(loja: ILojaInquilino): boolean {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 90 && diffDays > 0; // Próximo ao vencimento se restam 90 dias ou menos
  }

  getContractStatus(loja: ILojaInquilino): string {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    
    if (fim < hoje) {
      return 'Vencido';
    } else if (this.isNearExpiry(loja)) {
      return 'Próximo ao Vencimento';
    }
    return 'Ativo';
  }

  getStatusBadgeClass(loja: ILojaInquilino): string {
    const hoje = new Date();
    const fim = new Date(loja.contrato.dataFim);
    
    if (fim < hoje) {
      return 'bg-red-100 text-red-800';
    } else if (this.isNearExpiry(loja)) {
      return 'bg-amber-100 text-amber-800';
    }
    return 'bg-green-100 text-green-800';
  }
}