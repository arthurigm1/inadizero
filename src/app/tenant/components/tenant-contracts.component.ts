import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPortalInquilinoData, ILojaInquilino } from '../tenant.interfaces';
import { PdfGeneratorService, ContractData } from '../../services/pdf-generator.service';

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
            <svg class="w-6 h-6 mr-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3v6h6" />
            </svg>
            Meus Contratos
          </h2>
          <p class="text-blue-600/60 mt-1">Visualize e gerencie todos os seus contratos de locação</p>
        </div>
        <div class="flex items-center space-x-2 text-sm text-blue-600/60">
          <svg class="w-3 h-3 text-blue-600/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke-width="2" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3" />
          </svg>
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
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="6" y="3" width="12" height="18" rx="2" ry="2" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6M9 12h6M9 16h4" />
              </svg>
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
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2m0 0l4-4m-4 4L9 10" />
                <circle cx="12" cy="12" r="8" stroke-width="2" />
              </svg>
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
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="4" y="6" width="16" height="14" rx="2" ry="2" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3v4M16 3v4M4 10h16" />
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
                    <div class="flex items-center text-sm text-blue-600/60">
                      <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h8l4 4-8 8-4-4V7z" />
                        <circle cx="9.5" cy="11.5" r="1.5" stroke-width="2" />
                      </svg>
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
                <button (click)="openContractModal(loja)" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-eye mr-2"></i>
                  Ver Contrato
                </button>
                <button (click)="downloadContractPdf(loja)" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-download mr-2"></i>
                  Baixar PDF
                </button>
                <button *ngIf="isNearExpiry(loja)" 
                        class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <svg class="w-4 h-4 mr-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h10l-2-2m2 2-2 2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 17H10l2 2m-2-2 2-2" />
                  </svg>
                  Renovar
                </button>
              </div>
            </div>

            <!-- Estado vazio -->
            <div *ngIf="getFilteredContracts().length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <rect x="6" y="3" width="12" height="18" rx="2" ry="2" stroke-width="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6M9 12h6M9 16h4" />
                </svg>
              </div>
              <p class="text-blue-900/60 font-semibold text-lg">Nenhum contrato encontrado</p>
              <p class="text-blue-900/40 text-sm mt-2">{{ getEmptyStateMessage() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Visualização de Contrato -->
    <div *ngIf="showContractModal && selectedLoja" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-blue-100">
        <div class="flex items-center justify-between px-6 py-4 border-b border-blue-100">
          <h3 class="text-xl font-bold text-blue-900">Detalhes do Contrato - Loja {{ selectedLoja?.numero }}</h3>
          <button (click)="closeContractModal()" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-blue-600/60">Loja</p>
              <p class="font-medium text-blue-900">{{ selectedLoja?.nome }} ({{ selectedLoja?.numero }})</p>
            </div>
            <div>
              <p class="text-sm text-blue-600/60">Localização</p>
              <p class="font-medium text-blue-900">{{ selectedLoja?.localizacao }}</p>
            </div>
            <div>
              <p class="text-sm text-blue-600/60">Área</p>
              <p class="font-medium text-blue-900">{{ selectedLoja?.area }} m²</p>
            </div>
            <div>
              <p class="text-sm text-blue-600/60">Categoria</p>
              <p class="font-medium text-blue-900">{{ selectedLoja?.categoria }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-blue-600/60">Início</p>
              <p class="font-medium text-blue-900">{{ selectedLoja?.contrato?.dataInicio | date:'dd/MM/yyyy' }}</p>
            </div>
            <div>
              <p class="text-sm text-blue-600/60">Fim</p>
              <p class="font-medium text-blue-900">{{ selectedLoja?.contrato?.dataFim | date:'dd/MM/yyyy' }}</p>
            </div>
            <div>
              <p class="text-sm text-blue-600/60">Aluguel</p>
              <p class="font-medium text-blue-900">{{ selectedLoja?.contrato?.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</p>
            </div>
            <div>
              <p class="text-sm text-blue-600/60">Status</p>
              <p class="font-medium" [ngClass]="getStatusBadgeClass(selectedLoja!)">{{ getContractStatus(selectedLoja!) }}</p>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-blue-100 flex justify-end gap-3">
          <button (click)="downloadContractPdf(selectedLoja!)" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            <i class="fas fa-download mr-2"></i>
            Baixar PDF
          </button>
          <button (click)="closeContractModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">Fechar</button>
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
  selectedLoja: ILojaInquilino | null = null;
  showContractModal = false;

  constructor(private pdfService: PdfGeneratorService) {}
  
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

  // Ações dos botões
  openContractModal(loja: ILojaInquilino) {
    this.selectedLoja = loja;
    this.showContractModal = true;
  }

  closeContractModal() {
    this.showContractModal = false;
    this.selectedLoja = null;
  }

  downloadContractPdf(loja: ILojaInquilino) {
    const data: ContractData = {
      id: (loja as any)?.contrato?.id || (loja as any)?.id || `${loja.numero}`,
      loja,
      inquilino: (this.portalData as any)?.inquilino || (loja as any)?.contrato?.inquilino || {},
      valorAluguel: loja.contrato.valorAluguel,
      dataInicio: String(loja.contrato.dataInicio),
      dataFim: String(loja.contrato.dataFim),
      reajusteAnual: Boolean((loja as any)?.contrato?.reajusteAnual),
      percentualReajuste: Number((loja as any)?.contrato?.percentualReajuste || 0),
      clausulas: (loja as any)?.contrato?.clausulas || '',
      observacoes: (loja as any)?.contrato?.observacoes || '',
      status: this.getContractStatus(loja)
    };

    this.pdfService.generateContractPdf(data).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrato_loja_${loja.numero}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Falha ao gerar PDF do contrato', err);
        alert('Não foi possível gerar o PDF do contrato.');
      }
    });
  }
}