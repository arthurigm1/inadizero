import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPortalInquilinoData } from '../tenant.interfaces';

@Component({
  selector: 'app-tenant-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header da Seção -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent flex items-center">
            <i class="fas fa-cog mr-3 text-blue-600"></i>
            Configurações da Conta
          </h2>
          <p class="text-blue-600/60 mt-1">Gerencie suas informações pessoais e preferências</p>
        </div>
        <div class="flex items-center space-x-2 text-sm text-blue-600/60">
          <i class="fas fa-shield-alt text-xs"></i>
          <span>Suas informações estão seguras</span>
        </div>
      </div>

      <!-- Navegação das Configurações -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <div class="flex flex-wrap gap-3">
          <button 
            (click)="setActiveTab('profile')"
            [class]="getTabButtonClass('profile')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-user mr-2"></i>
            Perfil
          </button>
          <button 
            (click)="setActiveTab('security')"
            [class]="getTabButtonClass('security')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-lock mr-2"></i>
            Segurança
          </button>
          <button 
            (click)="setActiveTab('notifications')"
            [class]="getTabButtonClass('notifications')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-bell mr-2"></i>
            Notificações
          </button>
          <button 
            (click)="setActiveTab('preferences')"
            [class]="getTabButtonClass('preferences')"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <i class="fas fa-sliders-h mr-2"></i>
            Preferências
          </button>
        </div>
      </div>

      <!-- Conteúdo das Abas -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
        
        <!-- Aba Perfil -->
        <div *ngIf="activeTab === 'profile'" class="p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-6 flex items-center">
            <i class="fas fa-user mr-2"></i>
            Informações do Perfil
          </h3>
          
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Foto do Perfil -->
              <div class="md:col-span-2 flex items-center space-x-6">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {{ getInitials() }}
                </div>
                <div>
                  <h4 class="font-semibold text-blue-900">Foto do Perfil</h4>
                  <p class="text-sm text-blue-600/60 mb-3">Escolha uma foto para seu perfil</p>
                  <button type="button" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <i class="fas fa-camera mr-2"></i>
                    Alterar Foto
                  </button>
                </div>
              </div>

              <!-- Nome Completo -->
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  [(ngModel)]="profileData.nomeCompleto"
                  name="nomeCompleto"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu nome completo">
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2">Email</label>
                <input 
                  type="email" 
                  [(ngModel)]="profileData.email"
                  name="email"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu email">
              </div>

              <!-- Telefone -->
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2">Telefone</label>
                <input 
                  type="tel" 
                  [(ngModel)]="profileData.telefone"
                  name="telefone"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="(11) 99999-9999">
              </div>

              <!-- CPF/CNPJ -->
              <div>
                <label class="block text-sm font-medium text-blue-900 mb-2">CPF/CNPJ</label>
                <input 
                  type="text" 
                  [(ngModel)]="profileData.documento"
                  name="documento"
                  class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="000.000.000-00">
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t border-blue-100">
              <button type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Cancelar
              </button>
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <i class="fas fa-save mr-2"></i>
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        <!-- Aba Segurança -->
        <div *ngIf="activeTab === 'security'" class="p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-6 flex items-center">
            <i class="fas fa-lock mr-2"></i>
            Segurança da Conta
          </h3>
          
          <div class="space-y-6">
            <!-- Alterar Senha -->
            <div class="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-6">
              <h4 class="font-semibold text-blue-900 mb-4">Alterar Senha</h4>
              <form class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-blue-900 mb-2">Senha Atual</label>
                  <input 
                    type="password" 
                    [(ngModel)]="securityData.senhaAtual"
                    name="senhaAtual"
                    class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite sua senha atual">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-blue-900 mb-2">Nova Senha</label>
                    <input 
                      type="password" 
                      [(ngModel)]="securityData.novaSenha"
                      name="novaSenha"
                      class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite a nova senha">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-900 mb-2">Confirmar Nova Senha</label>
                    <input 
                      type="password" 
                      [(ngModel)]="securityData.confirmarSenha"
                      name="confirmarSenha"
                      class="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirme a nova senha">
                  </div>
                </div>
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                  <i class="fas fa-key mr-2"></i>
                  Alterar Senha
                </button>
              </form>
            </div>

            <!-- Autenticação de Dois Fatores -->
            <div class="bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="font-semibold text-green-900">Autenticação de Dois Fatores</h4>
                  <p class="text-sm text-green-700/70">Adicione uma camada extra de segurança à sua conta</p>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="securityData.twoFactorEnabled"
                    name="twoFactorEnabled"
                    class="w-5 h-5 text-green-600 border-green-300 rounded focus:ring-green-500">
                  <label class="ml-2 text-sm font-medium text-green-900">Ativar</label>
                </div>
              </div>
              <div *ngIf="securityData.twoFactorEnabled" class="space-y-3">
                <p class="text-sm text-green-700">Configure seu aplicativo autenticador:</p>
                <div class="flex space-x-3">
                  <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <i class="fas fa-qrcode mr-2"></i>
                    Mostrar QR Code
                  </button>
                  <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <i class="fas fa-key mr-2"></i>
                    Chave Manual
                  </button>
                </div>
              </div>
            </div>

            <!-- Sessões Ativas -->
            <div class="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg p-6">
              <h4 class="font-semibold text-amber-900 mb-4">Sessões Ativas</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                  <div class="flex items-center">
                    <i class="fas fa-desktop text-amber-600 mr-3"></i>
                    <div>
                      <p class="font-medium text-amber-900">Computador - Windows</p>
                      <p class="text-sm text-amber-700/70">Última atividade: agora</p>
                    </div>
                  </div>
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Atual</span>
                </div>
                <button class="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  Encerrar Todas as Outras Sessões
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Notificações -->
        <div *ngIf="activeTab === 'notifications'" class="p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-6 flex items-center">
            <i class="fas fa-bell mr-2"></i>
            Preferências de Notificação
          </h3>
          
          <div class="space-y-6">
            <!-- Notificações por Email -->
            <div class="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-6">
              <h4 class="font-semibold text-blue-900 mb-4">Notificações por Email</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-blue-900">Faturas Vencendo</p>
                    <p class="text-sm text-blue-600/70">Receba lembretes antes do vencimento</p>
                  </div>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationData.emailFaturasVencendo"
                    name="emailFaturasVencendo"
                    class="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500">
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-blue-900">Faturas em Atraso</p>
                    <p class="text-sm text-blue-600/70">Notificações sobre faturas em atraso</p>
                  </div>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationData.emailFaturasAtraso"
                    name="emailFaturasAtraso"
                    class="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500">
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-blue-900">Contratos Vencendo</p>
                    <p class="text-sm text-blue-600/70">Avisos sobre renovação de contratos</p>
                  </div>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationData.emailContratosVencendo"
                    name="emailContratosVencendo"
                    class="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500">
                </div>
              </div>
            </div>

            <!-- Notificações Push -->
            <div class="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg p-6">
              <h4 class="font-semibold text-purple-900 mb-4">Notificações Push</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-purple-900">Ativar Notificações Push</p>
                    <p class="text-sm text-purple-600/70">Receba notificações no navegador</p>
                  </div>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationData.pushEnabled"
                    name="pushEnabled"
                    class="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500">
                </div>
              </div>
            </div>

            <!-- Frequência de Notificações -->
            <div class="bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg p-6">
              <h4 class="font-semibold text-green-900 mb-4">Frequência de Notificações</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-green-900 mb-2">Resumo Semanal</label>
                  <select 
                    [(ngModel)]="notificationData.resumoSemanal"
                    name="resumoSemanal"
                    class="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200">
                    <option value="segunda">Segunda-feira</option>
                    <option value="sexta">Sexta-feira</option>
                    <option value="desabilitado">Desabilitado</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4 border-t border-blue-100">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <i class="fas fa-save mr-2"></i>
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>

        <!-- Aba Preferências -->
        <div *ngIf="activeTab === 'preferences'" class="p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-6 flex items-center">
            <i class="fas fa-sliders-h mr-2"></i>
            Preferências do Sistema
          </h3>
          
          <div class="space-y-6">
            <!-- Aparência -->
            <div class="bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-lg p-6">
              <h4 class="font-semibold text-indigo-900 mb-4">Aparência</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-indigo-900 mb-2">Tema</label>
                  <select 
                    [(ngModel)]="preferencesData.tema"
                    name="tema"
                    class="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
                    <option value="claro">Claro</option>
                    <option value="escuro">Escuro</option>
                    <option value="automatico">Automático</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-indigo-900 mb-2">Idioma</label>
                  <select 
                    [(ngModel)]="preferencesData.idioma"
                    name="idioma"
                    class="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Dados e Privacidade -->
            <div class="bg-gradient-to-r from-red-50 to-red-100/50 rounded-lg p-6">
              <h4 class="font-semibold text-red-900 mb-4">Dados e Privacidade</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-red-900">Permitir Cookies de Analytics</p>
                    <p class="text-sm text-red-600/70">Ajuda a melhorar a experiência do usuário</p>
                  </div>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="preferencesData.allowAnalytics"
                    name="allowAnalytics"
                    class="w-5 h-5 text-red-600 border-red-300 rounded focus:ring-red-500">
                </div>
                <div class="pt-4 border-t border-red-200">
                  <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <i class="fas fa-download mr-2"></i>
                    Baixar Meus Dados
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4 border-t border-blue-100">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <i class="fas fa-save mr-2"></i>
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input:focus, select:focus {
      outline: none;
    }
  `]
})
export class TenantSettingsComponent {
  @Input() portalData: IPortalInquilinoData | null = null;
  
  activeTab: string = 'profile';

  // Dados do formulário
  profileData = {
    nomeCompleto: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    documento: '123.456.789-00'
  };

  securityData = {
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    twoFactorEnabled: false
  };

  notificationData = {
    emailFaturasVencendo: true,
    emailFaturasAtraso: true,
    emailContratosVencendo: true,
    pushEnabled: false,
    resumoSemanal: 'segunda'
  };

  preferencesData = {
    tema: 'claro',
    idioma: 'pt-BR',
    allowAnalytics: true
  };

  // Métodos de navegação
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTabButtonClass(tab: string): string {
    const baseClass = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
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
}