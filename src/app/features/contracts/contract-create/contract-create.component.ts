import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { CreateContractRequest, StoreOption, TenantOption } from '../contract.interfaces';

@Component({
  selector: 'app-contract-create',
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
        <h1 class="text-2xl font-bold text-gray-900">Criar Novo Contrato</h1>
      </div>

      <div class="max-w-4xl mx-auto">
        <form [formGroup]="contractForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Informações Básicas -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Loja -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Loja *
                </label>
                <select 
                  formControlName="lojaId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="contractForm.get('lojaId')?.invalid && contractForm.get('lojaId')?.touched">
                  <option value="">Selecione uma loja</option>
                  <option *ngFor="let store of stores" [value]="store.id">
                    {{ store.nome }} - Nº {{ store.numero }}
                  </option>
                </select>
                <div *ngIf="contractForm.get('lojaId')?.invalid && contractForm.get('lojaId')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Loja é obrigatória
                </div>
              </div>

              <!-- Inquilino -->
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
                  Inquilino é obrigatório
                </div>
              </div>
            </div>
          </div>

          <!-- Valores e Datas -->
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Valores e Período</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <!-- Data de Início -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input 
                  type="date" 
                  formControlName="dataInicio"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="contractForm.get('dataInicio')?.invalid && contractForm.get('dataInicio')?.touched">
                <div *ngIf="contractForm.get('dataInicio')?.invalid && contractForm.get('dataInicio')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Data de início é obrigatória
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
                  <span *ngIf="contractForm.get('dataFim')?.errors?.['dateRange']">Data de fim deve ser posterior à data de início</span>
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
              [disabled]="contractForm.invalid || loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </span>
              <span *ngIf="!loading">Criar Contrato</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ContractCreateComponent implements OnInit {
  contractForm: FormGroup;
  stores: StoreOption[] = [];
  tenants: TenantOption[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private router: Router
  ) {
    this.contractForm = this.createForm();
  }

  ngOnInit() {
    this.loadStores();
    this.loadTenants();
    this.setupFormValidation();
  }

  createForm(): FormGroup {
    return this.fb.group({
      lojaId: ['', [Validators.required]],
      inquilinoId: ['', [Validators.required]],
      valorAluguel: ['', [Validators.required, Validators.min(0.01)]],
      dataInicio: ['', [Validators.required]],
      dataFim: ['', [Validators.required]],
      reajusteAnual: [false],
      percentualReajuste: [''],
      clausulas: [''],
      observacoes: ['']
    });
  }

  setupFormValidation() {
    // Validação condicional para percentual de reajuste
    this.contractForm.get('reajusteAnual')?.valueChanges.subscribe(value => {
      const percentualControl = this.contractForm.get('percentualReajuste');
      
      if (value) {
        percentualControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        percentualControl?.clearValidators();
        percentualControl?.setValue('');
      }
      
      percentualControl?.updateValueAndValidity();
    });

    // Validação de data fim posterior à data início
    this.contractForm.get('dataFim')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });

    this.contractForm.get('dataInicio')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });
  }

  validateDateRange() {
    const dataInicio = this.contractForm.get('dataInicio')?.value;
    const dataFim = this.contractForm.get('dataFim')?.value;
    
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      
      if (fim <= inicio) {
        this.contractForm.get('dataFim')?.setErrors({ dateRange: true });
      } else {
        const errors = this.contractForm.get('dataFim')?.errors;
        if (errors) {
          delete errors['dateRange'];
          if (Object.keys(errors).length === 0) {
            this.contractForm.get('dataFim')?.setErrors(null);
          }
        }
      }
    }
  }

  loadStores() {
    this.contractService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
      },
      error: (error) => {
        console.error('Erro ao carregar lojas:', error);
      }
    });
  }

  loadTenants() {
    this.contractService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      },
      error: (error) => {
        console.error('Erro ao carregar inquilinos:', error);
      }
    });
  }

  onSubmit() {
    if (this.contractForm.valid) {
      this.loading = true;
      
      const formValue = this.contractForm.value;
      const contractData: CreateContractRequest = {
        lojaId: formValue.lojaId,
        inquilinoId: formValue.inquilinoId,
        valorAluguel: parseFloat(formValue.valorAluguel),
        dataInicio: formValue.dataInicio,
        dataFim: formValue.dataFim,
        reajusteAnual: formValue.reajusteAnual,
        percentualReajuste: formValue.reajusteAnual ? parseFloat(formValue.percentualReajuste) : undefined,
        clausulas: formValue.clausulas || undefined,
        observacoes: formValue.observacoes || undefined
      };

      this.contractService.createContract(contractData).subscribe({
        next: (contract) => {
          console.log('Contrato criado com sucesso:', contract);
          this.router.navigate(['/contracts/details', contract.id]);
        },
        error: (error) => {
          console.error('Erro ao criar contrato:', error);
          this.loading = false;
          // TODO: Mostrar mensagem de erro para o usuário
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.contractForm.controls).forEach(key => {
        this.contractForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/contracts/list']);
  }
}