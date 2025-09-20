import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContractService } from '../contract.service';
import { RescindContractRequest } from '../contract.interfaces';

@Component({
  selector: 'app-contract-rescind-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Rescindir Contrato</h3>
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
        <form [formGroup]="rescindForm" (ngSubmit)="onSubmit()">
          <div class="px-6 py-4">
            <!-- Warning -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">Atenção</h3>
                  <div class="mt-2 text-sm text-yellow-700">
                    <p>Esta ação irá rescindir o contrato permanentemente. Esta operação não pode ser desfeita.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contract Info -->
            <div class="bg-gray-50 rounded-md p-4 mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Informações do Contrato</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-medium">Loja:</span> {{ contractInfo?.loja?.nome }} - Nº {{ contractInfo?.loja?.numero }}</p>
                <p><span class="font-medium">Inquilino:</span> {{ contractInfo?.inquilino?.nome }}</p>
                <p><span class="font-medium">Valor:</span> {{ formatCurrency(contractInfo?.valorAluguel) }}</p>
                <p><span class="font-medium">Período:</span> {{ formatDate(contractInfo?.dataInicio) }} até {{ formatDate(contractInfo?.dataFim) }}</p>
              </div>
            </div>

            <!-- Observações -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Motivo da Rescisão *
              </label>
              <textarea 
                formControlName="observacoes"
                rows="4"
                placeholder="Descreva o motivo da rescisão do contrato..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                [class.border-red-500]="rescindForm.get('observacoes')?.invalid && rescindForm.get('observacoes')?.touched">
              </textarea>
              <div *ngIf="rescindForm.get('observacoes')?.invalid && rescindForm.get('observacoes')?.touched" 
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="rescindForm.get('observacoes')?.errors?.['required']">Motivo da rescisão é obrigatório</span>
                <span *ngIf="rescindForm.get('observacoes')?.errors?.['minlength']">Motivo deve ter pelo menos 10 caracteres</span>
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
              [disabled]="rescindForm.invalid || processing"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="processing" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rescindindo...
              </span>
              <span *ngIf="!processing">Confirmar Rescisão</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ContractRescindModalComponent {
  @Input() isOpen = false;
  @Input() contractId: string | null = null;
  @Input() contractInfo: any = null;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() rescindSuccess = new EventEmitter<void>();

  rescindForm: FormGroup;
  processing = false;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService
  ) {
    this.rescindForm = this.fb.group({
      observacoes: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  closeModal() {
    this.rescindForm.reset();
    this.closeEvent.emit();
  }

  onSubmit() {
    if (!this.contractId || this.rescindForm.invalid) {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.rescindForm.controls).forEach(key => {
        this.rescindForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processing = true;
    
    const rescindData: RescindContractRequest = {
      observacoes: this.rescindForm.value.observacoes
    };

    this.contractService.rescindContract(this.contractId, rescindData).subscribe({
      next: (contract) => {
        console.log('Contrato rescindido com sucesso:', contract);
        this.processing = false;
        this.rescindSuccess.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Erro ao rescindir contrato:', error);
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