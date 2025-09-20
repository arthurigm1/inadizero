import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { StoreService, Store, UpdateStoreData, Tenant } from '../store.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-store-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <!-- Header with Back Button -->
      <div class="mb-8" [@fadeIn]>
        <button 
          (click)="goBack()"
          class="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <i class="fas fa-arrow-left mr-2"></i>
          Voltar para Lista de Lojas
        </button>
        <h1 class="text-4xl font-bold text-blue-800 mb-2">Detalhes da Loja</h1>
        <p class="text-gray-600">Visualize e gerencie informações da loja</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12" [@fadeIn]>
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-blue-600">Carregando detalhes da loja...</span>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="bg-red-100 border border-red-400 rounded-xl p-4 mb-6" [@fadeIn]>
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i>
          <span class="text-red-700">{{ error }}</span>
          <button 
            (click)="loadStoreDetails()" 
            class="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fas fa-redo mr-2"></i>
            Tentar Novamente
          </button>
        </div>
      </div>

      <!-- Store Details Content -->
      <div *ngIf="!loading && !error && store" class="space-y-6" [@fadeIn]>
        <!-- Store Info Card -->
        <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-bold text-blue-900 mb-2">{{ store.nome }}</h2>
              <p class="text-blue-600">Loja #{{ store.numero }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <span [ngClass]="{
                'bg-green-500': store.status === 'OCUPADA',
                'bg-red-500': store.status === 'VAGA',
                'bg-yellow-500': store.status === 'MANUTENCAO'
              }" class="px-4 py-2 rounded-full text-sm font-semibold text-white">
                {{ getStatusLabel(store.status) }}
              </span>
              <button 
                (click)="openEditModal()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <i class="fas fa-edit mr-2"></i>
                Editar Loja
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-blue-700 mb-3">Informações Básicas</h3>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-600">Nome:</span>
                  <span class="text-blue-900 ml-2">{{ store.nome }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Número:</span>
                  <span class="text-blue-900 ml-2">#{{ store.numero }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Localização:</span>
                  <span class="text-blue-900 ml-2">{{ store.localizacao }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Status:</span>
                  <span class="text-blue-900 ml-2">{{ getStatusLabel(store.status) }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Criado em:</span>
                  <span class="text-blue-900 ml-2">{{ store.criadoEm | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-blue-700 mb-3">Inquilino</h3>
              
              <!-- Informações do Usuário (quando há usuário vinculado) -->
              <div *ngIf="store.usuario" class="space-y-3 mb-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 class="text-sm font-medium text-blue-700 mb-2">Usuário Vinculado</h4>
                  <div class="space-y-2">
                    <div>
                      <span class="text-gray-600">Nome:</span>
                      <span class="text-blue-900 ml-2">{{ store.usuario.nome }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Email:</span>
                      <span class="text-blue-900 ml-2">{{ store.usuario.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Informações do Inquilino -->
              <div *ngIf="store.inquilino" class="space-y-3">
                <div>
                  <span class="text-gray-600">Nome do Inquilino:</span>
                  <span class="text-blue-900 ml-2">{{ store.inquilino.nome }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Email do Inquilino:</span>
                  <span class="text-blue-900 ml-2">{{ store.inquilino.email }}</span>
                </div>
                <div *ngIf="store.inquilino.telefone">
                  <span class="text-gray-600">Telefone:</span>
                  <span class="text-blue-900 ml-2">{{ store.inquilino.telefone }}</span>
                </div>
                <div class="mt-4">
                  <button 
                    (click)="confirmUnlinkTenant()"
                    [disabled]="unlinkingTenant"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                    <i class="fas fa-user-times mr-2"></i>
                    <span *ngIf="!unlinkingTenant">Desvincular Inquilino</span>
                    <span *ngIf="unlinkingTenant">Desvinculando...</span>
                  </button>
                </div>
              </div>
              
              <div *ngIf="!store.inquilino && !store.usuario" class="text-blue-600">
                <p class="mb-4">Nenhum inquilino vinculado</p>
                <button 
                  (click)="openTenantModal()"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-user-plus mr-2"></i>
                    Vincular Inquilino
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Contracts Section -->
        <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-6">
          <h3 class="text-lg font-semibold text-blue-700 mb-4">Contratos</h3>
          <div *ngIf="store.contratos && store.contratos.length > 0; else noContracts">
            <div class="space-y-3">
              <div *ngFor="let contrato of store.contratos" class="bg-blue-50 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-blue-900 font-medium">Contrato #{{ contrato.id }}</p>
                    <p class="text-blue-600 text-sm">Valor: R$ {{ contrato.valor | number:'1.2-2' }}</p>
                  </div>
                  <span class="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noContracts>
            <p class="text-blue-600">Nenhum contrato encontrado para esta loja.</p>
          </ng-template>
        </div>
      </div>

      <!-- Edit Modal -->
      <div *ngIf="showEditModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" [@fadeIn]>
        <div class="bg-white backdrop-blur-sm rounded-xl border border-blue-200 p-8 w-full max-w-lg mx-4 shadow-2xl">
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
              <div class="bg-blue-100 p-3 rounded-lg mr-4">
                <i class="fas fa-edit text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-blue-900">Editar Loja</h3>
                <p class="text-blue-600 text-sm">Atualize as informações da loja</p>
              </div>
            </div>
            <button 
              (click)="closeEditModal()"
              class="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form [formGroup]="editForm" (ngSubmit)="onSubmitEdit()" class="space-y-6">
            <!-- Nome -->
            <div>
              <label for="editNome" class="block text-sm font-semibold text-blue-700 mb-2">
                <i class="fas fa-store text-blue-600 mr-2"></i>
                Nome da Loja
              </label>
              <input 
                type="text" 
                id="editNome" 
                formControlName="nome"
                class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="Digite o nome da loja">
            </div>

            <!-- Número -->
            <div>
              <label for="editNumero" class="block text-sm font-semibold text-blue-700 mb-2">
                <i class="fas fa-hashtag text-blue-600 mr-2"></i>
                Número da Loja
              </label>
              <input 
                type="text" 
                id="editNumero" 
                formControlName="numero"
                class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="Digite o número da loja">
            </div>

            <!-- Localização -->
            <div>
              <label for="editLocalizacao" class="block text-sm font-semibold text-blue-700 mb-2">
                <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
                Localização
              </label>
              <input 
                type="text" 
                id="editLocalizacao" 
                formControlName="localizacao"
                class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="Digite a localização da loja">
            </div>

            <!-- Status -->
            <div>
              <label for="editStatus" class="block text-sm font-semibold text-blue-700 mb-2">
                <i class="fas fa-toggle-on text-blue-600 mr-2"></i>
                Status da Loja
              </label>
              <select 
                id="editStatus" 
                formControlName="status"
                class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
                <option value="VAGA" class="bg-white">Vaga</option>
                <option value="OCUPADA" class="bg-white">Ocupada</option>
                <option value="MANUTENCAO" class="bg-white">Manutenção</option>
              </select>
            </div>

            <!-- Error Message -->
            <div *ngIf="editError" class="bg-red-100 border border-red-400 rounded-lg p-4">
              <div class="flex items-center text-red-700">
                <i class="fas fa-exclamation-triangle mr-3"></i>
                <span>{{ editError }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 pt-4">
              <button 
                type="button" 
                (click)="closeEditModal()"
                class="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-gray-300">
                <i class="fas fa-times mr-2"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="editing || editForm.invalid"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-lg">
                <i class="fas fa-save mr-2" *ngIf="!editing"></i>
                <i class="fas fa-spinner fa-spin mr-2" *ngIf="editing"></i>
                <span *ngIf="!editing">Salvar Alterações</span>
                <span *ngIf="editing">Salvando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tenant Modal -->
      <div *ngIf="showTenantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-blue-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-blue-900">Vincular Inquilino</h3>
            <button 
              (click)="closeTenantModal()"
              class="text-blue-600 hover:text-blue-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="mb-4">
            <label for="tenantSelect" class="block text-sm font-medium text-blue-700 mb-1">Selecionar Inquilino</label>
            <select 
              id="tenantSelect" 
              [(ngModel)]="selectedTenantId"
              class="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900">
              <option value="">Selecione um inquilino</option>
              <option *ngFor="let tenant of availableTenants" [value]="tenant.id">
                {{ tenant.nome }} - {{ tenant.email }}
              </option>
            </select>
          </div>

          <div *ngIf="tenantError" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ tenantError }}
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              (click)="closeTenantModal()"
              class="px-4 py-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
              Cancelar
            </button>
            <button 
              (click)="assignTenant()"
              [disabled]="assigningTenant || !selectedTenantId"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              <span *ngIf="!assigningTenant">Vincular</span>
              <span *ngIf="assigningTenant">Vinculando...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StoreDetailsComponent implements OnInit {
  store: Store | null = null;
  loading = false;
  error: string | null = null;
  storeId: string = '';

  // Edit modal properties
  showEditModal = false;
  editForm: FormGroup;
  editing = false;
  editError: string | null = null;

  // Tenant modal properties
  showTenantModal = false;
  availableTenants: Tenant[] = [];
  selectedTenantId: string = '';
  assigningTenant = false;
  unlinkingTenant = false;
  tenantError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      numero: ['', [Validators.required]],
      localizacao: ['', [Validators.required]],
      status: ['VAGA', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.loadStoreDetails();
      }
    });
  }

  loadStoreDetails(): void {
    this.loading = true;
    this.error = null;

    this.storeService.getStoreById(this.storeId).subscribe({
      next: (store) => {
        this.store = store;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Erro ao carregar detalhes da loja';
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'OCUPADA': return 'Ocupada';
      case 'VAGA': return 'Vaga';
      case 'MANUTENCAO': return 'Manutenção';
      default: return status;
    }
  }

  goBack(): void {
    this.router.navigate(['/stores']);
  }

  // Edit functionality
  openEditModal(): void {
    if (!this.store) return;
    
    this.showEditModal = true;
    this.editForm.patchValue({
      nome: this.store.nome,
      numero: this.store.numero,
      localizacao: this.store.localizacao,
      status: this.store.status
    });
    this.editError = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
    this.editError = null;
    this.editing = false;
  }

  onSubmitEdit(): void {
    if (this.editForm.valid && !this.editing && this.store) {
      this.editing = true;
      this.editError = null;

      const formData = this.editForm.value;
      const updateData: UpdateStoreData = {
        nome: formData.nome,
        numero: formData.numero,
        localizacao: formData.localizacao,
        status: formData.status
      };

      this.storeService.updateStore(this.store.id, updateData).subscribe({
        next: (updatedStore) => {
          this.store = updatedStore;
          this.editing = false;
          this.closeEditModal();
        },
        error: (error) => {
          this.editError = error.message;
          this.editing = false;
        }
      });
    }
  }

  // Tenant functionality
  openTenantModal(): void {
    this.showTenantModal = true;
    this.loadAvailableTenants();
    this.tenantError = null;
  }

  closeTenantModal(): void {
    this.showTenantModal = false;
    this.selectedTenantId = '';
    this.tenantError = null;
    this.assigningTenant = false;
  }

  loadAvailableTenants(): void {
    this.storeService.getTenants().subscribe({
      next: (tenants: Tenant[]) => {
        this.availableTenants = tenants || [];
      },
      error: (error) => {
        this.tenantError = 'Erro ao carregar inquilinos disponíveis';
      }
    });
  }

  assignTenant(): void {
    if (!this.selectedTenantId || !this.store) {
      return;
    }

    this.assigningTenant = true;
    this.tenantError = null;

    const updateData = {
      vincularInquilino: {
        inquilinoId: this.selectedTenantId
      }
    };

    this.storeService.updateStore(this.store.id, updateData).subscribe({
      next: () => {
        this.assigningTenant = false;
        this.closeTenantModal();
        this.loadStoreDetails(); // Reload to show updated data
      },
      error: (error) => {
        this.tenantError = error.message;
        this.assigningTenant = false;
      }
    });
  }

  confirmUnlinkTenant(): void {
    if (!this.store || !this.store.inquilino) {
      return;
    }

    const confirmed = confirm(`Tem certeza que deseja desvincular o inquilino ${this.store.inquilino.nome} desta loja?`);
    if (confirmed) {
      this.unlinkTenant();
    }
  }

  unlinkTenant(): void {
    if (!this.store) {
      return;
    }

    this.unlinkingTenant = true;
    this.error = null;

    this.storeService.unlinkTenant(this.store.id).subscribe({
      next: () => {
        this.unlinkingTenant = false;
        this.loadStoreDetails(); // Reload to show updated data
      },
      error: (error) => {
        this.unlinkingTenant = false;
        this.error = error.message;
      }
    });
  }
}