import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService, Tenant } from '../tenant.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-tenant-portal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" [@fadeIn]>
      <!-- Header -->
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-900">Portal do Inquilino</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Olá, {{ tenant?.nome }}</span>
              <button
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div *ngIf="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!loading && tenant" class="px-4 py-6 sm:px-0">
          <!-- Informações Pessoais -->
          <div class="bg-white overflow-hidden shadow-xl rounded-lg mb-6" [@slideIn]>
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                <i class="fas fa-user mr-2 text-blue-600"></i>
                Informações Pessoais
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500">Nome Completo</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.nome }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Email</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.email }}</p>
                </div>
                <div *ngIf="tenant.telefone">
                  <label class="block text-sm font-medium text-gray-500">Telefone</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.telefone }}</p>
                </div>
                <div *ngIf="tenant.cpf">
                  <label class="block text-sm font-medium text-gray-500">CPF</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.cpf }}</p>
                </div>
                <div *ngIf="tenant.endereco" class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500">Endereço</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.endereco }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações do Imóvel -->
          <div *ngIf="tenant.imovel" class="bg-white overflow-hidden shadow-xl rounded-lg mb-6" [@slideIn]>
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                <i class="fas fa-home mr-2 text-green-600"></i>
                Informações do Imóvel
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500">Endereço do Imóvel</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.imovel.endereco }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Tipo</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.imovel.tipo }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Valor do Aluguel</label>
                  <p class="mt-1 text-sm text-gray-900 font-semibold text-green-600">
                    {{ tenant.imovel.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações do Contrato -->
          <div *ngIf="tenant.contrato" class="bg-white overflow-hidden shadow-xl rounded-lg mb-6" [@slideIn]>
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                <i class="fas fa-file-contract mr-2 text-purple-600"></i>
                Informações do Contrato
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500">Data de Início</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.contrato.dataInicio | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Data de Fim</label>
                  <p class="mt-1 text-sm text-gray-900">{{ tenant.contrato.dataFim | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Valor do Aluguel</label>
                  <p class="mt-1 text-sm text-gray-900 font-semibold text-green-600">
                    {{ tenant.contrato.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Status</label>
                  <span class="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-800': tenant.contrato.status === 'ativo',
                          'bg-yellow-100 text-yellow-800': tenant.contrato.status === 'pendente',
                          'bg-red-100 text-red-800': tenant.contrato.status === 'inativo'
                        }">
                    {{ tenant.contrato.status | titlecase }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações Rápidas -->
          <div class="bg-white overflow-hidden shadow-xl rounded-lg" [@slideIn]>
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                <i class="fas fa-tools mr-2 text-orange-600"></i>
                Ações Rápidas
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <i class="fas fa-file-invoice mr-2"></i>
                  Ver Boletos
                </button>
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <i class="fas fa-wrench mr-2"></i>
                  Solicitar Manutenção
                </button>
                <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <i class="fas fa-phone mr-2"></i>
                  Contato
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !tenant" class="text-center py-12">
          <p class="text-gray-500">Erro ao carregar informações do inquilino.</p>
          <button 
            (click)="loadTenantInfo()"
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </main>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TenantPortalComponent implements OnInit {
  tenant: Tenant | null = null;
  loading = true;

  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTenantInfo();
  }

  loadTenantInfo() {
    this.loading = true;
    
    // Primeiro tenta pegar do serviço (localStorage)
    this.tenant = this.tenantService.getCurrentTenant();
    
    if (this.tenant) {
      this.loading = false;
    } else {
      // Se não tem no localStorage, tenta buscar do servidor
      this.tenantService.getTenantInfo().subscribe({
        next: (tenant: Tenant) => {
          this.tenant = tenant;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erro ao carregar informações:', err);
          this.loading = false;
          // Se não conseguir carregar, redireciona para login
          this.router.navigate(['/tenant/login']);
        }
      });
    }
  }

  logout() {
    this.tenantService.logout();
  }
}