import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService } from '../tenant.service';
import { IPortalInquilinoData, ILojaInquilino, IFaturaInquilino, INotificacaoInquilino, StatusFatura } from '../tenant.interfaces';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-tenant-portal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30" [@fadeIn]>
      <!-- Header Elegante -->
      <header class="bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100/50 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <i class="fas fa-building text-white text-lg"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Portal do Inquilino
                </h1>
                <p class="text-xs text-blue-600/70 font-medium">Gestão simplificada</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-blue-900">{{ portalData?.inquilino?.nome }}</p>
                <p class="text-xs text-blue-600/60">{{ portalData?.inquilino?.email }}</p>
              </div>
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {{ getInitials(portalData?.inquilino?.nome) }}
              </div>
              <button
                (click)="logout()"
                class="group bg-white border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                <i class="fas fa-sign-out-alt text-blue-600 group-hover:text-blue-700 transition-colors"></i>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center items-center h-96">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-blue-700/80 font-medium">Carregando seu portal...</p>
          </div>
        </div>

        <!-- Content -->
        <div *ngIf="!loading && portalData" class="space-y-8" [@staggerIn]>
          <!-- Resumo Financeiro -->
          <section>
            <h2 class="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <i class="fas fa-chart-line mr-3 text-blue-600"></i>
              Resumo Financeiro
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div *ngFor="let card of financialCards; let i = index" 
                   class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-50/50"
                   [@slideIn]="{value: '', params: {delay: i * 100}}">
                <div class="p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-blue-600/80 mb-1">{{ card.title }}</p>
                      <p class="text-2xl font-bold text-blue-900">{{ card.value }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner"
                         [ngClass]="card.iconBg">
                      <i [class]="card.icon" class="text-lg text-white"></i>
                    </div>
                  </div>
                  <div class="mt-3 pt-3 border-t border-blue-50">
                    <p class="text-xs text-blue-600/60" [innerHTML]="card.subtitle"></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Grid Principal -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <!-- Coluna Esquerda -->
            <div class="xl:col-span-2 space-y-8">
              <!-- Informações Pessoais -->
              <section class="bg-white rounded-2xl shadow-lg border border-blue-50/50 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h3 class="text-lg font-semibold text-white flex items-center">
                    <i class="fas fa-user-circle mr-3"></i>
                    Informações Pessoais
                  </h3>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-blue-900/60 mb-1">Nome Completo</label>
                        <p class="text-blue-900 font-medium">{{ portalData.inquilino.nome }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-blue-900/60 mb-1">Email</label>
                        <p class="text-blue-900 font-medium">{{ portalData.inquilino.email }}</p>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <div *ngIf="portalData.inquilino.telefone">
                        <label class="block text-sm font-medium text-blue-900/60 mb-1">Telefone</label>
                        <p class="text-blue-900 font-medium">{{ portalData.inquilino.telefone }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-blue-900/60 mb-1">Status</label>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <i class="fas fa-check-circle mr-1"></i>
                          Ativo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Lojas -->
              <section class="bg-white rounded-2xl shadow-lg border border-blue-50/50 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h3 class="text-lg font-semibold text-white flex items-center">
                    <i class="fas fa-store mr-3"></i>
                    Minhas Lojas
                  </h3>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div *ngFor="let loja of portalData.lojas" 
                         class="border border-blue-100 rounded-xl p-5 hover:border-blue-200 transition-colors duration-200 bg-blue-50/20">
                      <div class="flex items-start justify-between mb-3">
                        <h4 class="font-semibold text-blue-900">{{ loja.nome }}</h4>
                        <span class="text-xs font-medium px-2 py-1 rounded-full"
                              [ngClass]="getStatusBadgeClass(loja.contrato.status)">
                          {{ loja.contrato.status }}
                        </span>
                      </div>
                      
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-blue-900/60">Número:</span>
                          <span class="font-medium text-blue-900">#{{ loja.numero }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-blue-900/60">Aluguel:</span>
                          <span class="font-medium text-blue-900">{{ loja.contrato.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-blue-900/60">Vencimento:</span>
                          <span class="font-medium text-blue-900">Dia {{ loja.contrato.dataVencimento }}</span>
                        </div>
                      </div>
                      
                      <div class="mt-4 pt-3 border-t border-blue-100">
                        <p class="text-xs text-blue-900/50 text-center">
                          Vigência: {{ loja.contrato.dataInicio | date:'dd/MM/yyyy' }} - {{ loja.contrato.dataFim | date:'dd/MM/yyyy' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Coluna Direita -->
            <div class="space-y-8">
              <!-- Faturas Pendentes -->
              <section class="bg-white rounded-2xl shadow-lg border border-blue-50/50 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                  <h3 class="text-lg font-semibold text-white flex items-center">
                    <i class="fas fa-clock mr-3"></i>
                    Faturas Pendentes
                  </h3>
                </div>
                <div class="p-6">
                  <div class="space-y-4 max-h-96 overflow-y-auto">
                    <div *ngFor="let fatura of portalData.faturas.pendentes" 
                         class="border border-amber-100 rounded-xl p-4 bg-amber-50/30 hover:bg-amber-50/50 transition-colors duration-200">
                      <div class="flex justify-between items-start mb-2">
                        <div>
                          <p class="font-semibold text-blue-900">{{ fatura.loja.nome }}</p>
                          <p class="text-sm text-blue-900/60">Ref: {{ fatura.mesReferencia }}/{{ fatura.anoReferencia }}</p>
                        </div>
                        <span class="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                          {{ fatura.diasParaVencimento }} dias
                        </span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-blue-900/60">Vence: {{ fatura.dataVencimento | date:'dd/MM/yyyy' }}</span>
                        <span class="font-bold text-blue-900">{{ fatura.valorAluguel | currency:'BRL':'symbol':'1.2-2' }}</span>
                      </div>
                    </div>
                    <div *ngIf="portalData.faturas.pendentes.length === 0" class="text-center py-8">
                      <i class="fas fa-check-circle text-3xl text-green-400 mb-3"></i>
                      <p class="text-blue-900/60 font-medium">Todas as faturas em dia!</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Notificações -->
              <section class="bg-white rounded-2xl shadow-lg border border-blue-50/50 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                  <h3 class="text-lg font-semibold text-white flex items-center">
                    <i class="fas fa-bell mr-3"></i>
                    Notificações
                    <span *ngIf="unreadNotifications > 0" 
                          class="ml-2 bg-white text-purple-600 rounded-full text-xs px-2 py-1 font-bold">
                      {{ unreadNotifications }}
                    </span>
                  </h3>
                </div>
                <div class="p-6">
                  <div class="space-y-4 max-h-96 overflow-y-auto">
                    <div *ngFor="let notificacao of portalData.notificacoes" 
                         class="border rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                         [ngClass]="{
                           'border-purple-100 bg-purple-50/30': !notificacao.lida,
                           'border-blue-100 bg-white': notificacao.lida
                         }">
                      <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-medium" 
                           [ngClass]="{'text-purple-900': !notificacao.lida, 'text-blue-900/70': notificacao.lida}">
                          {{ notificacao.mensagem }}
                        </p>
                        <i *ngIf="!notificacao.lida" class="fas fa-circle text-xs text-purple-500 ml-2 mt-1"></i>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-xs" 
                              [ngClass]="{'text-purple-600/80': !notificacao.lida, 'text-blue-900/50': notificacao.lida}">
                          {{ notificacao.enviadaEm | date:'dd/MM/yyyy HH:mm' }}
                        </span>
                        <span class="text-xs font-medium px-2 py-1 rounded-full"
                              [ngClass]="{
                                'bg-purple-100 text-purple-800': !notificacao.lida,
                                'bg-blue-100 text-blue-800': notificacao.lida
                              }">
                          {{ notificacao.tipo }}
                        </span>
                      </div>
                    </div>
                    <div *ngIf="portalData.notificacoes.length === 0" class="text-center py-8">
                      <i class="fas fa-bell-slash text-3xl text-blue-300 mb-3"></i>
                      <p class="text-blue-900/60 font-medium">Nenhuma notificação</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Ações Rápidas -->
          <section class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl overflow-hidden">
            <div class="p-8 text-center">
              <h3 class="text-xl font-semibold text-white mb-6 flex items-center justify-center">
                <i class="fas fa-rocket mr-3"></i>
                Ações Rápidas
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <button class="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/30">
                  <i class="fas fa-file-invoice text-xl mb-2 group-hover:scale-110 transition-transform"></i>
                  <p class="font-semibold">Ver Boletos</p>
                  <p class="text-white/70 text-sm mt-1">Acesse suas faturas</p>
                </button>
                <button class="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/30">
                  <i class="fas fa-wrench text-xl mb-2 group-hover:scale-110 transition-transform"></i>
                  <p class="font-semibold">Manutenção</p>
                  <p class="text-white/70 text-sm mt-1">Solicite serviços</p>
                </button>
                <button class="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/30">
                  <i class="fas fa-headset text-xl mb-2 group-hover:scale-110 transition-transform"></i>
                  <p class="font-semibold">Suporte</p>
                  <p class="text-white/70 text-sm mt-1">Fale conosco</p>
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Error State -->
        <div *ngIf="!loading && !portalData" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <i class="fas fa-exclamation-triangle text-5xl text-blue-400 mb-4"></i>
            <h3 class="text-lg font-semibold text-blue-900 mb-2">Erro ao carregar o portal</h3>
            <p class="text-blue-900/60 mb-6">Não foi possível carregar suas informações no momento.</p>
            <button 
              (click)="loadPortalData()"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <i class="fas fa-redo mr-2"></i>
              Tentar Novamente
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
            style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class TenantPortalComponent implements OnInit {
  portalData: IPortalInquilinoData | null = null;
  loading = true;

  get financialCards() {
    if (!this.portalData) return [];
    
    return [
      {
        title: 'Faturas Pendentes',
        value: this.portalData.resumoFinanceiro.totalFaturasPendentes,
        icon: 'fas fa-file-invoice-dollar',
        iconBg: 'bg-blue-500',
        subtitle: 'Aguardando pagamento'
      },
      {
        title: 'Valor Pendente',
        value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.portalData.resumoFinanceiro.valorTotalPendente),
        icon: 'fas fa-dollar-sign',
        iconBg: 'bg-green-500',
        subtitle: 'Total em aberto'
      },
      {
        title: 'Em Atraso',
        value: this.portalData.resumoFinanceiro.faturasEmAtraso,
        icon: 'fas fa-exclamation-triangle',
        iconBg: 'bg-amber-500',
        subtitle: 'Pagamentos vencidos'
      },
      {
        title: 'Faturas Pagas',
        value: this.portalData.resumoFinanceiro.faturasPagas,
        icon: 'fas fa-check-circle',
        iconBg: 'bg-emerald-500',
        subtitle: 'Pagamentos realizados'
      }
    ];
  }

  get unreadNotifications() {
    return this.portalData?.notificacoes.filter(n => !n.lida).length || 0;
  }

  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPortalData();
  }

  loadPortalData() {
    this.loading = true;
    
    this.tenantService.getPortalData().subscribe({
      next: (data: IPortalInquilinoData) => {
        this.portalData = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar dados do portal:', err);
        this.loading = false;
        if (err.status === 401) {
          this.router.navigate(['/tenant/login']);
        }
      }
    });
  }

  getInitials(name?: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'ATIVO': 'bg-emerald-100 text-emerald-800',
      'PENDENTE': 'bg-amber-100 text-amber-800',
      'INATIVO': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  logout() {
    this.tenantService.logout();
  }
}