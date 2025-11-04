import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPortalInquilinoData, IFaturaInquilino, StatusFatura } from '../tenant.interfaces';

// Interface para a resposta da API EFI
interface EfiFaturaResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    chargeId: number;
    barcode: string;
    pixQrcode: string;
    pixQrcodeImage: string;
    link: string;
    billetLink: string;
    pdfLink: string;
    expireAt: string;
    status: string;
    total: number;
    payment: string;
    createdAt: string;
    updatedAt: string;
  };
}

@Component({
  selector: 'app-tenant-invoices',
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 12h4M9 16h6" />
            </svg>
            Minhas Faturas
          </h2>
          <p class="text-blue-600/60 mt-1">Gerencie todas as suas faturas em um só lugar</p>
        </div>
        <div class="flex items-center space-x-2 text-sm text-blue-600/60">
          <svg class="w-3 h-3 text-blue-600/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke-width="2" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3" />
          </svg>
          <span>Atualizado agora</span>
        </div>
      </div>

      <!-- Resumo das Faturas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Pendentes</p>
              <p class="text-2xl font-bold text-amber-600">{{ getPendingInvoices().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="8" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Em Atraso</p>
              <p class="text-2xl font-bold text-red-600">{{ getOverdueInvoices().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l8 14H4L12 4z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v4" />
                <circle cx="12" cy="17" r="1" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-600/80">Pagas</p>
              <p class="text-2xl font-bold text-green-600">{{ getPaidInvoices().length }}</p>
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
              <p class="text-sm font-medium text-blue-600/80">Total</p>
              <p class="text-2xl font-bold text-blue-600">{{ getAllInvoices().length }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="6" y="3" width="12" height="18" rx="2" ry="2" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6M9 12h6M9 16h4" />
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
            Todas ({{ getAllInvoices().length }})
          </button>
          <button 
            (click)="setFilter('pending')"
            [class]="getFilterButtonClass('pending')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-clock mr-2"></i>
            Pendentes ({{ getPendingInvoices().length }})
          </button>
          <button 
            (click)="setFilter('overdue')"
            [class]="getFilterButtonClass('overdue')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Em Atraso ({{ getOverdueInvoices().length }})
          </button>
          <button 
            (click)="setFilter('paid')"
            [class]="getFilterButtonClass('paid')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-check-circle mr-2"></i>
            Pagas ({{ getPaidInvoices().length }})
          </button>
        </div>
      </div>

      <!-- Lista de Faturas -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">
            {{ getFilterTitle() }}
          </h3>
          
          <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            <div *ngFor="let fatura of getFilteredInvoices(); let i = index" 
                 class="group relative bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg p-4">
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="getStatusBadgeClass(fatura.status)">
                  {{ getStatusText(fatura.status) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <!-- Informações da Loja -->
                <div>
                  <p class="font-semibold text-blue-900">{{ fatura.loja.nome }}</p>
                  <p class="text-sm text-blue-600/60">{{ fatura.loja.numero }} - {{ fatura.loja.localizacao }}</p>
                </div>

                <!-- Período -->
                <div>
                  <p class="text-sm font-medium text-blue-600/80">Período</p>
                  <p class="font-semibold text-blue-900">{{ fatura.mesReferencia }}/{{ fatura.anoReferencia }}</p>
                </div>

                <!-- Valor -->
                <div>
                  <p class="text-sm font-medium text-blue-600/80">Valor</p>
                  <p class="font-bold text-lg text-blue-900">{{ fatura.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</p>
                </div>

                <!-- Vencimento -->
                <div>
                  <p class="text-sm font-medium text-blue-600/80">Vencimento</p>
                  <p class="font-semibold text-blue-900">{{ fatura.dataVencimento | date:'dd/MM/yyyy' }}</p>
                  <p *ngIf="fatura.diasParaVencimento !== undefined" 
                     class="text-xs"
                     [ngClass]="getUrgencyClass(fatura.diasParaVencimento)">
                    {{ getUrgencyText(fatura.diasParaVencimento) }}
                  </p>
                  <p *ngIf="fatura.diasEmAtraso !== undefined" 
                     class="text-xs text-red-600 font-medium">
                    {{ fatura.diasEmAtraso }} dias em atraso
                  </p>
                </div>
              </div>

              <!-- Ações -->
              <div class="mt-4 flex justify-end space-x-2">
                <button *ngIf="fatura.status !== 'PAGA'" 
                        (click)="pagarFatura(fatura)"
                        [disabled]="loadingFatura === fatura.id"
                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <div *ngIf="loadingFatura === fatura.id" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <svg *ngIf="loadingFatura !== fatura.id" class="w-4 h-4 mr-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18" />
                    <rect x="6" y="13" width="6" height="2" rx="1" ry="1" stroke-width="2" />
                  </svg>
                  {{ loadingFatura === fatura.id ? 'Processando...' : 'Pagar' }}
                </button>
                <button (click)="baixarFatura(fatura)"
                        [disabled]="loadingFatura === fatura.id"
                        class="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <div *ngIf="loadingFatura === fatura.id" class="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <i *ngIf="loadingFatura !== fatura.id" class="fas fa-download mr-2"></i>
                  {{ loadingFatura === fatura.id ? 'Processando...' : 'Baixar' }}
                </button>
              </div>
            </div>

            <!-- Estado vazio -->
            <div *ngIf="getFilteredInvoices().length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-file-invoice text-3xl text-blue-400"></i>
              </div>
              <p class="text-blue-900/60 font-semibold text-lg">Nenhuma fatura encontrada</p>
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
export class TenantInvoicesComponent {
  @Input() portalData: IPortalInquilinoData | null = null;
  
  loadingFatura: string | null = null;

  constructor(private http: HttpClient) {}
  
  currentFilter: string = 'all';

  // Métodos para obter faturas por categoria
  getAllInvoices(): IFaturaInquilino[] {
    if (!this.portalData) return [];
    return [
      ...this.portalData.faturas.pendentes,
      ...this.portalData.faturas.emAtraso,
      ...this.portalData.faturas.proximasVencer,
      ...this.portalData.faturas.pagas
    ];
  }

  getPendingInvoices(): IFaturaInquilino[] {
    if (!this.portalData) return [];
    return this.portalData.faturas.pendentes;
  }

  getOverdueInvoices(): IFaturaInquilino[] {
    if (!this.portalData) return [];
    return this.portalData.faturas.emAtraso;
  }

  getPaidInvoices(): IFaturaInquilino[] {
    if (!this.portalData) return [];
    return this.portalData.faturas.pagas;
  }

  // Métodos de filtro
  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  getFilteredInvoices(): IFaturaInquilino[] {
    switch (this.currentFilter) {
      case 'pending':
        return [...this.getPendingInvoices(), ...this.portalData?.faturas.proximasVencer || []];
      case 'overdue':
        return this.getOverdueInvoices();
      case 'paid':
        return this.getPaidInvoices();
      default:
        return this.getAllInvoices();
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
      case 'pending':
        return 'Faturas Pendentes';
      case 'overdue':
        return 'Faturas em Atraso';
      case 'paid':
        return 'Faturas Pagas';
      default:
        return 'Todas as Faturas';
    }
  }

  getEmptyStateMessage(): string {
    switch (this.currentFilter) {
      case 'pending':
        return 'Não há faturas pendentes no momento';
      case 'overdue':
        return 'Parabéns! Não há faturas em atraso';
      case 'paid':
        return 'Nenhuma fatura paga encontrada';
      default:
        return 'Nenhuma fatura disponível';
    }
  }

  // Métodos de estilo e formatação
  getStatusBadgeClass(status: StatusFatura): string {
    switch (status) {
      case StatusFatura.PAGA:
        return 'bg-green-100 text-green-800';
      case StatusFatura.PENDENTE:
        return 'bg-amber-100 text-amber-800';
      case StatusFatura.EM_ATRASO:
      case StatusFatura.VENCIDA:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: StatusFatura): string {
    switch (status) {
      case StatusFatura.PAGA:
        return 'Paga';
      case StatusFatura.PENDENTE:
        return 'Pendente';
      case StatusFatura.EM_ATRASO:
        return 'Em Atraso';
      case StatusFatura.VENCIDA:
        return 'Vencida';
      default:
        return 'Desconhecido';
    }
  }

  getUrgencyClass(dias: number): string {
    if (dias <= 3) {
      return 'text-red-600 font-semibold';
    } else if (dias <= 7) {
      return 'text-amber-600 font-medium';
    }
    return 'text-green-600';
  }

  getUrgencyText(dias: number): string {
    if (dias === 0) {
      return 'Vence hoje!';
    } else if (dias === 1) {
      return 'Vence amanhã';
    } else if (dias > 0) {
      return `${dias} dias para vencer`;
    }
    return '';
  }

  // Método para buscar dados da fatura EFI
  private buscarDadosEfi(efiCobrancaId: number) {
    const token = localStorage.getItem('tenantToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:3010/api/portal-inquilino/fatura-efi/${efiCobrancaId}`;
    return this.http.get<EfiFaturaResponse>(url, { headers: headers });
  }

  // Método para pagar fatura
  pagarFatura(fatura: IFaturaInquilino) {
    if (!fatura.efiCobrancaId) {
      alert('Erro: ID da cobrança EFI não encontrado');
      return;
    }

    this.loadingFatura = fatura.id;
    
    this.buscarDadosEfi(fatura.efiCobrancaId).subscribe({
      next: (response) => {
        this.loadingFatura = null;
        if (response.success && response.data.link) {
          // Redirecionar para o link de pagamento
          window.open(response.data.link, '_blank');
        } else {
          alert('Erro: Link de pagamento não encontrado');
        }
      },
      error: (error) => {
        this.loadingFatura = null;
        console.error('Erro ao buscar dados da fatura EFI:', error);
        alert('Erro ao processar pagamento. Tente novamente.');
      }
    });
  }

  // Método para baixar fatura
  baixarFatura(fatura: IFaturaInquilino) {
    if (!fatura.efiCobrancaId) {
      alert('Erro: ID da cobrança EFI não encontrado');
      return;
    }

    this.loadingFatura = fatura.id;
    
    this.buscarDadosEfi(fatura.efiCobrancaId).subscribe({
      next: (response) => {
        this.loadingFatura = null;
        if (response.success && response.data.pdfLink) {
          // Redirecionar para o link de download do PDF
          window.open(response.data.pdfLink, '_blank');
        } else {
          alert('Erro: Link de download não encontrado');
        }
      },
      error: (error) => {
        this.loadingFatura = null;
        console.error('Erro ao buscar dados da fatura EFI:', error);
        alert('Erro ao processar download. Tente novamente.');
      }
    });
  }
}