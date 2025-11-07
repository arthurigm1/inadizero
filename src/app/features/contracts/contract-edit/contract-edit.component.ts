import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContractService } from '../contract.service';
import { Contract, UpdateContractRequest, ContractStatus, StoreOption, TenantOption } from '../contract.interfaces';
import { PdfGeneratorService, ContractData } from '../../../services/pdf-generator.service';
import { StoreService, Tenant } from '../../stores/store.service';
import { finalize } from 'rxjs/operators';

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

              <!-- Dia de Vencimento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Dia de Vencimento *
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="31"
                  formControlName="dataVencimento"
                  placeholder="Ex: 10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="contractForm.get('dataVencimento')?.invalid && contractForm.get('dataVencimento')?.touched">
                <div *ngIf="contractForm.get('dataVencimento')?.invalid && contractForm.get('dataVencimento')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="contractForm.get('dataVencimento')?.errors?.['required']">Dia de vencimento é obrigatório</span>
                  <span *ngIf="contractForm.get('dataVencimento')?.errors?.['min']">Dia deve ser entre 1 e 31</span>
                  <span *ngIf="contractForm.get('dataVencimento')?.errors?.['max']">Dia deve ser entre 1 e 31</span>
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
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            
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

          <!-- Informações do Contrato -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações do Contrato</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Loja (Não Editável)</h4>
                <p class="text-sm text-gray-900">{{ contract?.loja?.nome || 'N/A' }} - Nº {{ contract?.loja?.numero || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Inquilino *
                </label>
                <select 
                  formControlName="inquilinoId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="contractForm.get('inquilinoId')?.invalid && contractForm.get('inquilinoId')?.touched">
                  <option value="">Selecione um inquilino</option>
                  <option *ngFor="let tenant of tenants" [value]="tenant.id">
                    {{ tenant.nome }} - {{ tenant.email }}
                  </option>
                </select>
                <div *ngIf="contractForm.get('inquilinoId')?.invalid && contractForm.get('inquilinoId')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="contractForm.get('inquilinoId')?.errors?.['required']">Inquilino é obrigatório</span>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Data de Início (Não Editável)</h4>
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
              type="button"
              (click)="generatePdf()"
              [disabled]="!contract || generatingPdf"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="generatingPdf" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando PDF...
              </span>
              <span *ngIf="!generatingPdf">📄 Gerar PDF</span>
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
  @Input() contractToEdit: Contract | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Contract>();
  
  contractForm: FormGroup | null = null;
  contract: Contract | null = null;
  loading = false;
  saving = false;
  generatingPdf = false;
  tenants: Tenant[] = [];

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private pdfGeneratorService: PdfGeneratorService,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    if (this.contractToEdit) {
      this.contract = this.contractToEdit;
      this.createForm();
      this.setupFormValidation();
      this.loadTenants();
    }
  }



  createForm() {
    if (!this.contract) return;
    
    this.contractForm = this.fb.group({
      valorAluguel: [this.contract.valorAluguel, [Validators.required, Validators.min(0.01)]],
      dataFim: [this.formatDateForInput(this.contract.dataFim), [Validators.required]],
      dataVencimento: [this.contract.dataVencimento || 1, [Validators.required, Validators.min(1), Validators.max(31)]],
      reajusteAnual: [this.contract.reajusteAnual],
      percentualReajuste: [this.contract.percentualReajuste || ''],
      clausulas: [this.contract.clausulas || ''],
      observacoes: [this.contract.observacoes || ''],
      status: [this.contract.status],
      inquilinoId: [this.contract.inquilino?.id || '', [Validators.required]]
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
    if (!this.contractForm || !this.contract || this.contractForm.invalid) {
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
      ativo: formValue.ativo,
      inquilinoId: formValue.inquilinoId
    };

    this.contractService.updateContract(this.contract.id, updateData)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe({
        next: (response) => {
          // Alguns backends podem retornar um envelope { contrato: Contract }
          const updated = (response as any)?.contrato ?? response;
          this.contract = updated as Contract;
          this.onSave.emit(this.contract);
        },
        error: (error) => {
          console.error('Erro ao atualizar contrato:', error);
          // TODO: Mostrar mensagem de erro para o usuário
        }
      });
  }

  generatePdf() {
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

  loadTenants() {
    this.storeService.getTenants().subscribe({
      next: (tenants: Tenant[]) => {
        this.tenants = tenants;
      },
      error: (error: any) => {
        console.error('❌ Erro ao carregar inquilinos:', error);
      }
    });
  }

  goBack() {
    this.onCancel.emit();
  }
}