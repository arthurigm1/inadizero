import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ContractService } from '../contract.service';
import { Contract } from '../contract.interfaces';
import { PdfGeneratorService, ContractData } from '../../../services/pdf-generator.service';
import { ContractEditModalComponent } from '../contract-edit-modal/contract-edit-modal.component';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [CommonModule, ContractEditModalComponent],
  template: `
    <div class="min-h-screen" [@fadeIn]>
      <!-- Header -->
      <div class=" p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button (click)="goBack()" 
                    class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <p class="text-gray-600 mt-1" *ngIf="contract">Contrato #{{contract.id.substring(0, 8)}}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3" *ngIf="contract">
            <button (click)="downloadPdf()" 
                    [disabled]="generatingPdf"
                    class="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <svg *ngIf="!generatingPdf" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <svg *ngIf="generatingPdf" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{generatingPdf ? 'Gerando...' : 'Baixar PDF'}}</span>
            </button>
            <button (click)="editContract()" 
                    class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>Editar</span>
            </button>
            <span [class]="getStatusClass(contract.status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{getStatusText(contract.status)}}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="p-6">
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="text-lg font-semibold text-red-900 mb-2">Erro ao carregar contrato</h3>
          <p class="text-red-700">{{error}}</p>
          <button (click)="loadContract(contractId!)" 
                  class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            Tentar novamente
          </button>
        </div>
      </div>

      <!-- Contract Details -->
      <div *ngIf="contract && !loading" class="p-6 space-y-6" [@slideIn]>
        <!-- Main Info Card -->
        <div class="bg-white border border-blue-200 rounded-xl p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold text-blue-900 mb-6">Informações Gerais</h2>
                <div class="space-y-4">
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">ID do Contrato:</span>
                    <span class="text-blue-900 font-semibold">#{{contract.id.substring(0, 8)}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Status:</span>
                    <span [class]="getStatusClass(contract.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                      {{getStatusText(contract.status)}}
                    </span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Valor do Aluguel:</span>
                    <span class="text-2xl font-bold text-green-600">{{formatCurrency(contract.valorAluguel)}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Dia de Vencimento:</span>
                    <span class="text-blue-900 font-semibold">{{contract.dataVencimento}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Reajuste Anual:</span>
                    <span class="text-blue-900 font-semibold">{{contract.reajusteAnual ? 'Sim' : 'Não'}}</span>
                  </div>
                  <div *ngIf="contract.percentualReajuste" class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Percentual de Reajuste:</span>
                    <span class="text-blue-900 font-semibold">{{contract.percentualReajuste}}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold text-blue-900 mb-6">Período do Contrato</h2>
                <div class="space-y-4">
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Data de Início:</span>
                    <span class="text-blue-900 font-semibold">{{formatDate(contract.dataInicio)}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Data de Fim:</span>
                    <span class="text-blue-900 font-semibold">{{formatDate(contract.dataFim)}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Duração:</span>
                    <span class="text-blue-900 font-semibold">{{getContractDuration()}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Criado em:</span>
                    <span class="text-gray-500">{{formatDateTime(contract.criadoEm)}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Atualizado em:</span>
                    <span class="text-gray-500">{{formatDateTime(contract.atualizadoEm)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Store and Tenant Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Store Info -->
          <div class="bg-white border border-blue-200 rounded-xl p-6" *ngIf="contract.loja">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-blue-900">Informações da Loja</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Nome:</span>
                <span class="text-blue-900 font-semibold">{{contract.loja.nome}}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Número:</span>
                <span class="text-blue-900 font-semibold">{{contract.loja.numero}}</span>
              </div>
              <div *ngIf="contract.loja.localizacao" class="flex items-center justify-between">
                <span class="text-gray-600">Localização:</span>
                <span class="text-blue-900 font-semibold">{{contract.loja.localizacao}}</span>
              </div>
            </div>
          </div>

          <!-- Tenant Info -->
          <div class="bg-white border border-blue-200 rounded-xl p-6" *ngIf="contract.inquilino">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-blue-900">Informações do Inquilino</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Nome:</span>
                <span class="text-blue-900 font-semibold">{{contract.inquilino.nome}}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Email:</span>
                <span class="text-blue-900 font-semibold">{{contract.inquilino.email}}</span>
              </div>
              <div *ngIf="contract.inquilino.telefone" class="flex items-center justify-between">
                <span class="text-gray-600">Telefone:</span>
                <span class="text-blue-900 font-semibold">{{contract.inquilino.telefone}}</span>
              </div>
              <div *ngIf="contract.inquilino.cpf" class="flex items-center justify-between">
                <span class="text-gray-600">CPF:</span>
                <span class="text-blue-900 font-semibold">{{contract.inquilino.cpf}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div *ngIf="contract.observacoes || contract.clausulas" class="bg-white border border-blue-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-6">Informações Adicionais</h3>
          <div class="space-y-4">
            <div *ngIf="contract.observacoes">
              <h4 class="font-medium text-gray-700 mb-2">Observações:</h4>
              <p class="text-gray-600 bg-gray-50 p-4 rounded-lg">{{contract.observacoes}}</p>
            </div>
            <div *ngIf="contract.clausulas">
              <h4 class="font-medium text-gray-700 mb-2">Cláusulas:</h4>
              <p class="text-gray-600 bg-gray-50 p-4 rounded-lg">{{contract.clausulas}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Contract Modal -->
    <app-contract-edit-modal
      [isVisible]="showEditModal"
      [contractToEdit]="contract"
      (onCancel)="closeEditModal()"
      (onSave)="onContractSaved($event)">
    </app-contract-edit-modal>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ContractDetailComponent implements OnInit, OnChanges {
  @Input() contractId: string | null = null;
  @Output() backToList = new EventEmitter<void>();
  @Output() editContractEvent = new EventEmitter<Contract>();
  
  contract: Contract | null = null;
  loading = true;
  error: string | null = null;
  generatingPdf = false;
  showEditModal = false;

  constructor(
    private contractService: ContractService,
    private pdfGeneratorService: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    if (this.contractId) {
      this.loadContract(this.contractId);
    } else {
      this.error = 'ID do contrato não encontrado';
      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contractId'] && changes['contractId'].currentValue) {
      this.loadContract(changes['contractId'].currentValue);
    }
  }

  loadContract(contractId: string): void {
    if (!contractId) return;

    this.loading = true;
    this.error = null;

    this.contractService.getContractById(contractId).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contrato:', error);
        this.error = 'Erro ao carregar os dados do contrato';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.backToList.emit();
  }

  editContract(): void {
    if (this.contract) {
      this.showEditModal = true;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onContractSaved(updatedContract: Contract): void {
    this.showEditModal = false;
    // Primeiro atualizar o contrato local com os dados recebidos
    this.contract = updatedContract;
    // Em seguida, recarregar os dados completos do servidor para garantir que tudo está atualizado
    if (updatedContract.id) {
      this.loadContract(updatedContract.id);
    }
  }

  downloadPdf(): void {
    if (!this.contract) return;

    this.generatingPdf = true;

    const contractData: ContractData = {
      id: this.contract.id,
      loja: this.contract.loja,
      inquilino: this.contract.inquilino,
      valorAluguel: this.contract.valorAluguel,
      dataInicio: this.contract.dataInicio,
      dataFim: this.contract.dataFim,
      reajusteAnual: this.contract.reajusteAnual,
      percentualReajuste: this.contract.percentualReajuste,
      clausulas: this.contract.clausulas,
      observacoes: this.contract.observacoes,
      status: this.contract.status,
    };

    this.pdfGeneratorService.generateContractPdf(contractData).subscribe({
      next: (blob: Blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contrato-${this.contract?.loja?.numero}-${this.contract?.inquilino?.nome?.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.generatingPdf = false;
      },
      error: (error: any) => {
        console.error('Erro ao gerar PDF:', error);
        this.generatingPdf = false;
        // TODO: Show error message to user
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'VENCIDO':
        return 'bg-red-100 text-red-800';
      case 'RESCINDIDO':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENSO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ATIVO':
        return 'Ativo';
      case 'VENCIDO':
        return 'Vencido';
      case 'RESCINDIDO':
        return 'Rescindido';
      case 'SUSPENSO':
        return 'Suspenso';
      default:
        return status;
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

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  getContractDuration(): string {
    if (!this.contract) return '';
    
    const start = new Date(this.contract.dataInicio);
    const end = new Date(this.contract.dataFim);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMonths > 0) {
      return `${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`;
    } else {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    }
  }
}