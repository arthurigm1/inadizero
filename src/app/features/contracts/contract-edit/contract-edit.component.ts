import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { Contract, UpdateContractRequest, ContractStatus, StoreOption, TenantOption } from '../contract.interfaces';

@Component({
  selector: 'app-contract-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center mb-6">
        <button 
          (click)="goBack()"
          class="mr-4 text-gray-600 hover:text-gray-900">
          ← Voltar
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Editar Contrato</h1>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!loading && contractForm" class="max-w-4xl mx-auto">
        <form [formGroup]="contractForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Valores e Datas -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Valores e Período</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Valor do Aluguel -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Aluguel (R$) *
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  formControlName="valorAluguel"
                  placeholder="0,00"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="contractForm.get('valorAluguel')?.invalid && contractForm.get('valorAluguel')?.touched">
                <div *ngIf="contractForm.get('valorAluguel')?.invalid && contractForm.get('valorAluguel')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="contractForm.get('valorAluguel')?.errors?.['required']">Valor é obrigatório</span>
                  <span *ngIf="contractForm.get('valorAluguel')?.errors?.['min']">Valor deve ser maior que zero</span>
                </div>
              </div>

              <!-- Data de Fim -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim *
                </label>
                <input 
                  type="date" 
                  formControlName="dataFim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="contractForm.get('dataFim')?.invalid && contractForm.get('dataFim')?.touched">
                <div *ngIf="contractForm.get('dataFim')?.invalid && contractForm.get('dataFim')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="contractForm.get('dataFim')?.errors?.['required']">Data de fim é obrigatória</span>
                  <span *ngIf="contractForm.get('dataFim')?.errors?.['pastDate']">Data de fim não pode ser no passado</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reajuste -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Reajuste Anual</h3>
            
            <div class="space-y-4">
              <!-- Toggle Reajuste Anual -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="reajusteAnual"
                  formControlName="reajusteAnual"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="reajusteAnual" class="ml-2 block text-sm text-gray-900">
                  Aplicar reajuste anual
                </label>
              </div>

              <!-- Percentual de Reajuste -->
              <div *ngIf="contractForm.get('reajusteAnual')?.value">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Percentual de Reajuste (%) *
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  formControlName="percentualReajuste"
                  placeholder="0,00"
                  class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="contractForm.get('percentualReajuste')?.invalid && contractForm.get('percentualReajuste')?.touched">
                <div *ngIf="contractForm.get('percentualReajuste')?.invalid && contractForm.get('percentualReajuste')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="contractForm.get('percentualReajuste')?.errors?.['required']">Percentual é obrigatório quando reajuste anual está ativo</span>
                  <span *ngIf="contractForm.get('percentualReajuste')?.errors?.['min']">Percentual deve ser maior que zero</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status e Situação -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Status e Situação</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status do Contrato
                </label>
                <select 
                  formControlName="status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ATIVO">Ativo</option>
                  <option value="VENCIDO">Vencido</option>
                  <option value="RESCINDIDO">Rescindido</option>
                  <option value="SUSPENSO">Suspenso</option>
                </select>
              </div>

              <!-- Ativo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Situação
                </label>
                <select 
                  formControlName="ativo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option [value]="true">Ativo</option>
                  <option [value]="false">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Cláusulas e Observações -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalhes Adicionais</h3>
            
            <div class="space-y-6">
              <!-- Cláusulas -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cláusulas Especiais
                </label>
                <textarea 
                  formControlName="clausulas"
                  rows="4"
                  placeholder="Digite as cláusulas especiais do contrato..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </textarea>
              </div>

              <!-- Observações -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea 
                  formControlName="observacoes"
                  rows="3"
                  placeholder="Digite observações adicionais..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </textarea>
              </div>
            </div>
          </div>

          <!-- Informações Não Editáveis -->
          <div class="bg-gray-50 p-6 rounded-lg border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações do Contrato (Não Editáveis)</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Loja</h4>
                <p class="text-sm text-gray-900">{{ contract?.loja?.nome || 'N/A' }} - Nº {{ contract?.loja?.numero || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Inquilino</h4>
                <p class="text-sm text-gray-900">{{ contract?.inquilino?.nome || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Data de Início</h4>
                <p class="text-sm text-gray-900">{{ formatDate(contract?.dataInicio) }}</p>
              </div>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              (click)="goBack()"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="contractForm.invalid || saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="saving" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
              <span *ngIf="!saving">Salvar Alterações</span>
            </button>
          </div>
        </form>
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
  `
})
export class ContractEditComponent implements OnInit {
  contractForm: FormGroup | null = null;
  contract: Contract | null = null;
  loading = false;
  saving = false;
  contractId: string | null = null;

  constructor(
    private fb: FormBuilder,
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
        this.createForm();
        this.setupFormValidation();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contrato:', error);
        this.loading = false;
      }
    });
  }

  createForm() {
    if (!this.contract) return;
    
    this.contractForm = this.fb.group({
      valorAluguel: [this.contract.valorAluguel, [Validators.required, Validators.min(0.01)]],
      dataFim: [this.formatDateForInput(this.contract.dataFim), [Validators.required]],
      reajusteAnual: [this.contract.reajusteAnual],
      percentualReajuste: [this.contract.percentualReajuste || ''],
      clausulas: [this.contract.clausulas || ''],
      observacoes: [this.contract.observacoes || ''],
      status: [this.contract.status],
      ativo: [this.contract.ativo]
    });
  }

  setupFormValidation() {
    if (!this.contractForm) return;
    
    // Validação condicional para percentual de reajuste
    this.contractForm.get('reajusteAnual')?.valueChanges.subscribe(value => {
      const percentualControl = this.contractForm?.get('percentualReajuste');
      
      if (value) {
        percentualControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        percentualControl?.clearValidators();
        percentualControl?.setValue('');
      }
      
      percentualControl?.updateValueAndValidity();
    });

    // Validação de data fim não pode ser no passado
    this.contractForm.get('dataFim')?.valueChanges.subscribe(() => {
      this.validateFutureDate();
    });
  }

  validateFutureDate() {
    if (!this.contractForm) return;
    
    const dataFim = this.contractForm.get('dataFim')?.value;
    
    if (dataFim) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Reset time to compare only dates
      const fim = new Date(dataFim);
      
      if (fim < hoje) {
        this.contractForm.get('dataFim')?.setErrors({ pastDate: true });
      } else {
        const errors = this.contractForm.get('dataFim')?.errors;
        if (errors) {
          delete errors['pastDate'];
          if (Object.keys(errors).length === 0) {
            this.contractForm.get('dataFim')?.setErrors(null);
          }
        }
      }
    }
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  onSubmit() {
    if (!this.contractForm || !this.contractId || this.contractForm.invalid) {
      // Marcar todos os campos como touched para mostrar erros
      if (this.contractForm) {
        Object.keys(this.contractForm.controls).forEach(key => {
          this.contractForm?.get(key)?.markAsTouched();
        });
      }
      return;
    }

    this.saving = true;
    
    const formValue = this.contractForm.value;
    const updateData: UpdateContractRequest = {
      valorAluguel: parseFloat(formValue.valorAluguel),
      dataFim: formValue.dataFim,
      reajusteAnual: formValue.reajusteAnual,
      percentualReajuste: formValue.reajusteAnual ? parseFloat(formValue.percentualReajuste) : undefined,
      clausulas: formValue.clausulas || undefined,
      observacoes: formValue.observacoes || undefined,
      status: formValue.status as ContractStatus,
      ativo: formValue.ativo
    };

    this.contractService.updateContract(this.contractId, updateData).subscribe({
      next: (contract) => {
        console.log('Contrato atualizado com sucesso:', contract);
        this.router.navigate(['/contracts/details', contract.id]);
      },
      error: (error) => {
        console.error('Erro ao atualizar contrato:', error);
        this.saving = false;
        // TODO: Mostrar mensagem de erro para o usuário
      }
    });
  }

  goBack() {
    if (this.contractId) {
      this.router.navigate(['/contracts/details', this.contractId]);
    } else {
      this.router.navigate(['/contracts/list']);
    }
  }
}