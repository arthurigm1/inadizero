import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContractService } from '../contract.service';
import { ContractRenewRequest } from '../contract.interfaces';

@Component({
  selector: 'app-contract-renew-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Renovar Contrato</h3>
            <button 
              (click)="closeModal()"
              class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <form [formGroup]="renewForm" (ngSubmit)="onSubmit()">
          <div class="px-6 py-4">
            <!-- Contract Info -->
            <div class="bg-gray-50 rounded-md p-4 mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Informações do Contrato Atual</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-medium">Loja:</span> {{ contractInfo?.loja?.nome }} - Nº {{ contractInfo?.loja?.numero }}</p>
                <p><span class="font-medium">Inquilino:</span> {{ contractInfo?.inquilino?.nome }}</p>
                <p><span class="font-medium">Valor Atual:</span> {{ formatCurrency(contractInfo?.valorAluguel) }}</p>
                <p><span class="font-medium">Data de Fim Atual:</span> {{ formatDate(contractInfo?.dataFim) }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <!-- Nova Data de Fim -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nova Data de Fim *
                </label>
                <input 
                  type="date" 
                  formControlName="novaDataFim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  [class.border-red-500]="renewForm.get('novaDataFim')?.invalid && renewForm.get('novaDataFim')?.touched">
                <div *ngIf="renewForm.get('novaDataFim')?.invalid && renewForm.get('novaDataFim')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="renewForm.get('novaDataFim')?.errors?.['required']">Nova data de fim é obrigatória</span>
                  <span *ngIf="renewForm.get('novaDataFim')?.errors?.['pastDate']">Nova data deve ser futura</span>
                  <span *ngIf="renewForm.get('novaDataFim')?.errors?.['beforeCurrentEnd']">Nova data deve ser posterior à data de fim atual</span>
                </div>
              </div>

              <!-- Novo Valor (Opcional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Novo Valor do Aluguel (R$)
                  <span class="text-gray-500 font-normal">(opcional - deixe em branco para manter o valor atual)</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  formControlName="novoValor"
                  placeholder="{{ formatCurrency(contractInfo?.valorAluguel) }}"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  [class.border-red-500]="renewForm.get('novoValor')?.invalid && renewForm.get('novoValor')?.touched">
                <div *ngIf="renewForm.get('novoValor')?.invalid && renewForm.get('novoValor')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="renewForm.get('novoValor')?.errors?.['min']">Valor deve ser maior que zero</span>
                </div>
              </div>

              <!-- Preview da Renovação -->
              <div *ngIf="renewForm.get('novaDataFim')?.value" class="bg-green-50 border border-green-200 rounded-md p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">Preview da Renovação</h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p><strong>Período Estendido:</strong> {{ calculateExtensionPeriod() }}</p>
                      <p *ngIf="renewForm.get('novoValor')?.value">
                        <strong>Novo Valor:</strong> {{ formatCurrency(renewForm.get('novoValor')?.value) }}
                        <span class="text-green-600">
                          ({{ calculateValueChange() }})
                        </span>
                      </p>
                      <p *ngIf="!renewForm.get('novoValor')?.value">
                        <strong>Valor:</strong> Mantém o valor atual de {{ formatCurrency(contractInfo?.valorAluguel) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="renewForm.invalid || processing"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="processing" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Renovando...
              </span>
              <span *ngIf="!processing">Confirmar Renovação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ContractRenewModalComponent {
  @Input() isOpen = false;
  @Input() contractId: string | null = null;
  @Input() contractInfo: any = null;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() renewSuccess = new EventEmitter<void>();

  renewForm: FormGroup;
  processing = false;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService
  ) {
    this.renewForm = this.fb.group({
      novaDataFim: ['', [Validators.required]],
      novoValor: ['', [Validators.min(0.01)]]
    });

    this.setupFormValidation();
  }

  setupFormValidation() {
    // Validação de data futura e posterior à data atual de fim
    this.renewForm.get('novaDataFim')?.valueChanges.subscribe(() => {
      this.validateNewEndDate();
    });
  }

  validateNewEndDate() {
    const novaDataFim = this.renewForm.get('novaDataFim')?.value;
    
    if (novaDataFim) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const novaData = new Date(novaDataFim);
      
      // Verificar se é data futura
      if (novaData <= hoje) {
        this.renewForm.get('novaDataFim')?.setErrors({ pastDate: true });
        return;
      }
      
      // Verificar se é posterior à data de fim atual
      if (this.contractInfo?.dataFim) {
        const dataFimAtual = new Date(this.contractInfo.dataFim);
        if (novaData <= dataFimAtual) {
          this.renewForm.get('novaDataFim')?.setErrors({ beforeCurrentEnd: true });
          return;
        }
      }
      
      // Limpar erros se passou nas validações
      const errors = this.renewForm.get('novaDataFim')?.errors;
      if (errors) {
        delete errors['pastDate'];
        delete errors['beforeCurrentEnd'];
        if (Object.keys(errors).length === 0) {
          this.renewForm.get('novaDataFim')?.setErrors(null);
        }
      }
    }
  }

  calculateExtensionPeriod(): string {
    const novaDataFim = this.renewForm.get('novaDataFim')?.value;
    if (!novaDataFim || !this.contractInfo?.dataFim) return '';
    
    const dataFimAtual = new Date(this.contractInfo.dataFim);
    const novaData = new Date(novaDataFim);
    
    const diffTime = novaData.getTime() - dataFimAtual.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.round(diffDays / 30);
    
    if (diffMonths >= 12) {
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      if (remainingMonths === 0) {
        return `${years} ano${years > 1 ? 's' : ''}`;
      } else {
        return `${years} ano${years > 1 ? 's' : ''} e ${remainingMonths} mês${remainingMonths > 1 ? 'es' : ''}`;
      }
    } else if (diffMonths >= 1) {
      return `${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`;
    } else {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    }
  }

  calculateValueChange(): string {
    const novoValor = this.renewForm.get('novoValor')?.value;
    if (!novoValor || !this.contractInfo?.valorAluguel) return '';
    
    const valorAtual = this.contractInfo.valorAluguel;
    const diferenca = novoValor - valorAtual;
    const percentual = ((diferenca / valorAtual) * 100).toFixed(1);
    
    if (diferenca > 0) {
      return `+${this.formatCurrency(diferenca)} (+${percentual}%)`;
    } else if (diferenca < 0) {
      return `${this.formatCurrency(diferenca)} (${percentual}%)`;
    } else {
      return 'sem alteração';
    }
  }

  closeModal() {
    this.renewForm.reset();
    this.closeEvent.emit();
  }

  onSubmit() {
    if (!this.contractId || this.renewForm.invalid) {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.renewForm.controls).forEach(key => {
        this.renewForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processing = true;
    
    const formValue = this.renewForm.value;
    const renewData: ContractRenewRequest = {
      novaDataFim: formValue.novaDataFim,
      novoValor: formValue.novoValor ? parseFloat(formValue.novoValor) : undefined
    };

    this.contractService.renewContract(this.contractId, renewData).subscribe({
      next: (contract) => {
        console.log('Contrato renovado com sucesso:', contract);
        this.processing = false;
        this.renewSuccess.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Erro ao renovar contrato:', error);
        this.processing = false;
        // TODO: Mostrar mensagem de erro para o usuário
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatCurrency(value?: number): string {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}