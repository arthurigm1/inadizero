import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPortalInquilinoData } from '../tenant.interfaces';
import { TenantService } from '../tenant.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tenant-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header da Seção -->
      <div class="flex items-center justify-between">
        <div>
          <h2
            class="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent flex items-center"
          >
            <i class="fas fa-cog mr-3 text-blue-600"></i>
            Configurações da Conta
          </h2>
          <p class="text-blue-600/60 mt-1">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        <div class="flex items-center space-x-2 text-sm text-blue-600/60">
          <i class="fas fa-shield-alt text-xs"></i>
          <span>Suas informações estão seguras</span>
        </div>
      </div>

      <!-- Navegação das Configurações -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4"
      >
        <div class="flex flex-wrap gap-3">
          <button
            (click)="setActiveTab('profile')"
            [class]="getTabButtonClass('profile')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            <i class="fas fa-user mr-2"></i>
            Perfil
          </button>
          <button
            (click)="setActiveTab('security')"
            [class]="getTabButtonClass('security')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            <i class="fas fa-lock mr-2"></i>
            Segurança
          </button>
        </div>
      </div>

      <!-- Conteúdo das Abas -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden"
      >
        <!-- Aba Perfil -->
        <div *ngIf="activeTab === 'profile'" class="p-6">
          <h3
            class="text-lg font-semibold text-blue-900 mb-6 flex items-center"
          >
            <i class="fas fa-user mr-2"></i>
            Informações do Perfil
          </h3>

          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2"
                  >Nome Completo</label
                >
                <input
                  type="text"
                  [(ngModel)]="profileData.nomeCompleto"
                  name="nomeCompleto"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2"
                  >Email</label
                >
                <input
                  type="email"
                  [(ngModel)]="profileData.email"
                  name="email"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu email"
                />
              </div>

              <!-- Telefone -->
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2"
                  >Telefone</label
                >
                <input
                  type="tel"
                  [(ngModel)]="profileData.telefone"
                  name="telefone"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <!-- CPF/CNPJ -->
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2"
                  >CPF/CNPJ</label
                >
                <input
                  type="text"
                  [(ngModel)]="profileData.documento"
                  name="documento"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div
              class="flex justify-end space-x-3 pt-4 border-t border-blue-100"
            >
              <button
                type="button"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <i class="fas fa-save mr-2"></i>
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        <!-- Aba Segurança -->
        <div *ngIf="activeTab === 'security'" class="p-6">
          <h3
            class="text-lg font-semibold text-blue-900 mb-6 flex items-center"
          >
            <i class="fas fa-lock mr-2"></i>
            Segurança da Conta
          </h3>

          <div class="space-y-6">
            <!-- Alterar Senha -->
            <div
              class="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-6"
            >
              <h4 class="font-semibold text-blue-900 mb-4">Alterar Senha</h4>
              <form class="space-y-4" (ngSubmit)="onChangePassword()">
                <div>
                  <label class="block text-sm font-medium text-blue-900 mb-2"
                    >Senha Atual</label
                  >
                  <div class="relative">
                    <input
                      [type]="showSenhaAtual ? 'text' : 'password'"
                      [(ngModel)]="securityData.senhaAtual"
                      name="senhaAtual"
                      class="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      (click)="showSenhaAtual = !showSenhaAtual"
                      class="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-blue-700 hover:text-blue-800 px-2 py-1 rounded-md"
                      aria-label="Mostrar/ocultar senha"
                    >
                      <i [ngClass]="showSenhaAtual ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      <span class="ml-1 text-xs">{{ showSenhaAtual ? 'Ocultar' : 'Mostrar' }}</span>
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-blue-900 mb-2"
                      >Nova Senha</label
                    >
                    <div class="relative">
                      <input
                        [type]="showNovaSenha ? 'text' : 'password'"
                        [(ngModel)]="securityData.novaSenha"
                        name="novaSenha"
                        class="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Digite a nova senha"
                      />
                      <button
                        type="button"
                        (click)="showNovaSenha = !showNovaSenha"
                        class="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-blue-700 hover:text-blue-800 px-2 py-1 rounded-md"
                        aria-label="Mostrar/ocultar senha"
                      >
                        <i [ngClass]="showNovaSenha ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        <span class="ml-1 text-xs">{{ showNovaSenha ? 'Ocultar' : 'Mostrar' }}</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-900 mb-2"
                      >Confirmar Nova Senha</label
                    >
                    <div class="relative">
                      <input
                        [type]="showConfirmarSenha ? 'text' : 'password'"
                        [(ngModel)]="securityData.confirmarSenha"
                        name="confirmarSenha"
                        class="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirme a nova senha"
                      />
                      <button
                        type="button"
                        (click)="showConfirmarSenha = !showConfirmarSenha"
                        class="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-blue-700 hover:text-blue-800 px-2 py-1 rounded-md"
                        aria-label="Mostrar/ocultar senha"
                      >
                        <i [ngClass]="showConfirmarSenha ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        <span class="ml-1 text-xs">{{ showConfirmarSenha ? 'Ocultar' : 'Mostrar' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  [disabled]="isChangingPassword"
                  class="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  <i class="fas fa-key mr-2"></i>
                  {{ isChangingPassword ? 'Alterando...' : 'Alterar Senha' }}
                </button>
                <div *ngIf="passwordMessage" class="mt-3 text-sm" [ngClass]="passwordSuccess ? 'text-green-700' : 'text-red-700'">
                  {{ passwordMessage }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      input:focus,
      select:focus {
        outline: none;
      }
    `,
  ],
})
export class TenantSettingsComponent {
  @Input() portalData: IPortalInquilinoData | null = null;

  activeTab: string = 'profile';
  isChangingPassword: boolean = false;
  passwordMessage: string | null = null;
  passwordSuccess: boolean | null = null;
  showSenhaAtual: boolean = false;
  showNovaSenha: boolean = false;
  showConfirmarSenha: boolean = false;

  // Dados do formulário
  profileData = {
    nomeCompleto: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    documento: '123.456.789-00',
  };

  securityData = {
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    twoFactorEnabled: false,
  };

  notificationData = {
    emailFaturasVencendo: true,
    emailFaturasAtraso: true,
    emailContratosVencendo: true,
    pushEnabled: false,
    resumoSemanal: 'segunda',
  };

  preferencesData = {
    tema: 'claro',
    idioma: 'pt-BR',
    allowAnalytics: true,
  };

  // Métodos de navegação
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTabButtonClass(tab: string): string {
    const baseClass =
      'px-4 py-2 rounded-lg font-medium transition-all duration-200';
    if (this.activeTab === tab) {
      return `${baseClass} bg-blue-600 text-white shadow-lg`;
    }
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  // Métodos utilitários
  getInitials(): string {
    const names = this.profileData.nomeCompleto.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0] ? names[0][0].toUpperCase() : 'U';
  }

  constructor(private tenantService: TenantService) {}

  onChangePassword() {
    this.passwordMessage = null;
    this.passwordSuccess = null;
    const { senhaAtual, novaSenha, confirmarSenha } = this.securityData;

    if (!senhaAtual || !novaSenha) {
      this.passwordMessage = 'Preencha a senha atual e a nova senha.';
      this.passwordSuccess = false;
      return;
    }

    if (novaSenha !== confirmarSenha) {
      this.passwordMessage = 'A confirmação da nova senha não confere.';
      this.passwordSuccess = false;
      return;
    }

    this.isChangingPassword = true;
    this.tenantService
      .changePassword(senhaAtual, novaSenha)
      .pipe(finalize(() => (this.isChangingPassword = false)))
      .subscribe({
      next: (res) => {
        this.passwordMessage = res?.mensagem || 'Senha alterada com sucesso!';
        this.passwordSuccess = true;
        // Limpar campos
        this.securityData.senhaAtual = '';
        this.securityData.novaSenha = '';
        this.securityData.confirmarSenha = '';
      },
      error: (err) => {
        this.passwordMessage = err?.message || 'Falha ao alterar a senha. Tente novamente.';
        this.passwordSuccess = false;
      },
    });
  }
}
