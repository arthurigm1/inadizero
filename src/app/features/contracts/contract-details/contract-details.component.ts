import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContractService } from '../contract.service';
import { Contract, ContractStatus } from '../contract.interfaces';
import { ContractRescindModalComponent } from '../contract-rescind-modal/contract-rescind-modal.component';
import { ContractRenewModalComponent } from '../contract-renew-modal/contract-renew-modal.component';

@Component({
  selector: 'app-contract-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ContractRescindModalComponent, ContractRenewModalComponent],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button 
            (click)="goBack()"
            class="mr-4 text-gray-600 hover:text-gray-900">
            ← Voltar
          </button>
          <h1 class="text-2xl font-bold text-gray-900">Detalhes do Contrato</h1>
        </div>
        
        <div class="flex space-x-3" *ngIf="contract">
          <button 
            [routerLink]="['/contracts/edit', contract.id]"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Editar
          </button>
          <button 
            *ngIf="contract.status === 'ATIVO'"
            (click)="openRescindModal()"
            class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Rescindir
          </button>
          <button 
            *ngIf="contract.status === 'ATIVO'"
            (click)="openRenewModal()"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Renovar
          </button>
          <button 
            (click)="confirmDelete()"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Deletar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Contract Details -->
      <div *ngIf="!loading && contract" class="space-y-6">
        <!-- Status e Informações Gerais -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Informações Gerais</h3>
            <div class="flex items-center space-x-4">
              <span [class]="getStatusClass(contract.status)">
                {{ contract.status }}
              </span>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    [class]="contract.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ contract.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">ID do Contrato</h4>
              <p class="text-sm text-gray-900">{{ contract.id }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Data de Criação</h4>
              <p class="text-sm text-gray-900">{{ formatDateTime(contract.createdAt) }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Última Atualização</h4>
              <p class="text-sm text-gray-900">{{ formatDateTime(contract.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Loja e Inquilino -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Loja -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Loja</h3>
            <div class="space-y-3">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Nome</h4>
                <p class="text-sm text-gray-900">{{ contract.loja?.nome || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Número</h4>
                <p class="text-sm text-gray-900">{{ contract.loja?.numero || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">ID da Loja</h4>
                <p class="text-sm text-gray-900">{{ contract.lojaId }}</p>
              </div>
            </div>
          </div>

          <!-- Inquilino -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Inquilino</h3>
            <div class="space-y-3">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Nome</h4>
                <p class="text-sm text-gray-900">{{ contract.inquilino?.nome || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Email</h4>
                <p class="text-sm text-gray-900">{{ contract.inquilino?.email || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Telefone</h4>
                <p class="text-sm text-gray-900">{{ contract.inquilino?.telefone || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">ID do Inquilino</h4>
                <p class="text-sm text-gray-900">{{ contract.inquilinoId }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Valores e Período -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Valores e Período</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Valor do Aluguel</h4>
              <p class="text-lg font-semibold text-gray-900">
                {{ contract.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Data de Início</h4>
              <p class="text-sm text-gray-900">{{ formatDate(contract.dataInicio) }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Data de Fim</h4>
              <p class="text-sm text-gray-900">{{ formatDate(contract.dataFim) }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Duração</h4>
              <p class="text-sm text-gray-900">{{ getContractDuration() }}</p>
            </div>
          </div>
        </div>

        <!-- Reajuste -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Reajuste Anual</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Reajuste Ativo</h4>
              <p class="text-sm text-gray-900">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      [class]="contract.reajusteAnual ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ contract.reajusteAnual ? 'Sim' : 'Não' }}
                </span>
              </p>
            </div>
            <div *ngIf="contract.reajusteAnual">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Percentual de Reajuste</h4>
              <p class="text-sm text-gray-900">{{ contract.percentualReajuste }}%</p>
            </div>
          </div>
        </div>

        <!-- Cláusulas e Observações -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Cláusulas -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Cláusulas Especiais</h3>
            <div class="text-sm text-gray-900 whitespace-pre-wrap">
              {{ contract.clausulas || 'Nenhuma cláusula especial definida.' }}
            </div>
          </div>

          <!-- Observações -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
            <div class="text-sm text-gray-900 whitespace-pre-wrap">
              {{ contract.observacoes || 'Nenhuma observação registrada.' }}
            </div>
          </div>
        </div>

        <!-- Alertas -->
        <div *ngIf="getContractAlerts().length > 0" class="space-y-3">
          <div *ngFor="let alert of getContractAlerts()" 
               [class]="'p-4 rounded-lg border-l-4 ' + alert.class">
            <div class="flex">
              <div class="ml-3">
                <p class="text-sm font-medium" [class]="alert.textClass">
                  {{ alert.title }}
                </p>
                <p class="text-sm" [class]="alert.textClass">
                  {{ alert.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!loading && !contract" class="text-center py-12">
        <div class="text-gray-500 text-lg mb-4">Contrato não encontrado</div>
        <button 
          (click)="goBack()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Voltar à Lista
        </button>
      </div>
    </div>

    <!-- Modals -->
    <app-contract-rescind-modal
      [isOpen]="showRescindModal"
      [contractId]="contractId"
      [contractInfo]="contract"
      (closeEvent)="closeRescindModal()"
      (rescindSuccess)="onRescindSuccess()">
    </app-contract-rescind-modal>

    <app-contract-renew-modal
      [isOpen]="showRenewModal"
      [contractId]="contractId"
      [contractInfo]="contract"
      (closeEvent)="closeRenewModal()"
      (renewSuccess)="onRenewSuccess()">
    </app-contract-renew-modal>
  `
})
export class ContractDetailsComponent implements OnInit {
  contract: Contract | null = null;
  loading = false;
  contractId: string | null = null;
  showRescindModal = false;
  showRenewModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) {}

  ngOnInit() {
    this.contractId = this.route.snapshot.paramMap.get('id');
    if (this.contractId) {
      this.loadContract();
    }
  }

  loadContract() {
    if (!this.contractId) return;
    
    this.loading = true;
    this.contractService.getContractById(this.contractId).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contrato:', error);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  getStatusClass(status: ContractStatus): string {
    const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full';
    
    switch (status) {
      case ContractStatus.ATIVO:
        return `${baseClass} bg-green-100 text-green-800`;
      case ContractStatus.VENCIDO:
        return `${baseClass} bg-red-100 text-red-800`;
      case ContractStatus.RESCINDIDO:
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case ContractStatus.SUSPENSO:
        return `${baseClass} bg-gray-100 text-gray-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getContractDuration(): string {
    if (!this.contract) return 'N/A';
    
    const inicio = new Date(this.contract.dataInicio);
    const fim = new Date(this.contract.dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMonths > 0) {
      return `${diffMonths} mês${diffMonths > 1 ? 'es' : ''} (${diffDays} dias)`;
    }
    
    return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  }

  getContractAlerts(): Array<{title: string, message: string, class: string, textClass: string}> {
    if (!this.contract) return [];
    
    const alerts = [];
    const hoje = new Date();
    const dataFim = new Date(this.contract.dataFim);
    const diasParaVencimento = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    // Contrato vencido
    if (this.contract.status === ContractStatus.VENCIDO) {
      alerts.push({
        title: 'Contrato Vencido',
        message: `Este contrato venceu em ${this.formatDate(this.contract.dataFim)}.`,
        class: 'bg-red-50 border-red-400',
        textClass: 'text-red-800'
      });
    }
    
    // Contrato próximo ao vencimento
    else if (this.contract.status === ContractStatus.ATIVO && diasParaVencimento <= 30 && diasParaVencimento > 0) {
      alerts.push({
        title: 'Contrato Próximo ao Vencimento',
        message: `Este contrato vence em ${diasParaVencimento} dia${diasParaVencimento > 1 ? 's' : ''} (${this.formatDate(this.contract.dataFim)}).`,
        class: 'bg-yellow-50 border-yellow-400',
        textClass: 'text-yellow-800'
      });
    }
    
    // Contrato rescindido
    if (this.contract.status === ContractStatus.RESCINDIDO) {
      alerts.push({
        title: 'Contrato Rescindido',
        message: 'Este contrato foi rescindido.',
        class: 'bg-yellow-50 border-yellow-400',
        textClass: 'text-yellow-800'
      });
    }
    
    // Contrato suspenso
    if (this.contract.status === ContractStatus.SUSPENSO) {
      alerts.push({
        title: 'Contrato Suspenso',
        message: 'Este contrato está temporariamente suspenso.',
        class: 'bg-gray-50 border-gray-400',
        textClass: 'text-gray-800'
      });
    }
    
    return alerts;
  }

  openRescindModal() {
    this.showRescindModal = true;
  }

  closeRescindModal() {
    this.showRescindModal = false;
  }

  onRescindSuccess() {
    // Recarregar os dados do contrato após rescisão
    this.loadContract();
  }

  openRenewModal() {
    this.showRenewModal = true;
  }

  closeRenewModal() {
    this.showRenewModal = false;
  }

  onRenewSuccess() {
    // Recarregar os dados do contrato após renovação
    this.loadContract();
  }

  confirmDelete() {
    if (!this.contract) return;
    
    const confirmacao = confirm('Tem certeza que deseja deletar este contrato? Esta ação não pode ser desfeita.');
    
    if (confirmacao) {
      this.contractService.deleteContract(this.contract.id).subscribe({
        next: () => {
          console.log('Contrato deletado com sucesso');
          this.router.navigate(['/contracts/list']);
        },
        error: (error) => {
          console.error('Erro ao deletar contrato:', error);
          // TODO: Mostrar mensagem de erro para o usuário
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/contracts/list']);
  }
}