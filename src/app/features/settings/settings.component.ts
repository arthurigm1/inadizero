import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      <!-- Header -->
      <div class="mb-8" [@fadeIn]>
        <h1 class="text-4xl font-bold text-blue-800 mb-2">Configurações do Sistema</h1>
        <p class="text-gray-600">Gerencie as configurações e preferências do sistema</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- General Settings -->
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200" [@slideIn]>
          <h2 class="text-2xl font-bold text-blue-700 mb-6 flex items-center">
            <i class="fas fa-cog mr-3"></i>
            Configurações Gerais
          </h2>
          
          <div class="space-y-6">
            <!-- Company Info -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
              <input 
                type="text" 
                [(ngModel)]="settings.companyName"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="Digite o nome da empresa"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email de Contato</label>
              <input 
                type="email" 
                [(ngModel)]="settings.contactEmail"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="contato&#64;empresa.com"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input 
                type="tel" 
                [(ngModel)]="settings.phone"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="(11) 99999-9999"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
              <textarea 
                [(ngModel)]="settings.address"
                rows="3"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="Digite o endereço completo"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- System Preferences -->
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200" [@slideIn]>
          <h2 class="text-2xl font-bold text-blue-700 mb-6 flex items-center">
            <i class="fas fa-sliders-h mr-3"></i>
            Preferências do Sistema
          </h2>
          
          <div class="space-y-6">
            <!-- Currency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Moeda Padrão</label>
              <select 
                [(ngModel)]="settings.defaultCurrency"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar Americano ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            
            <!-- Timezone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fuso Horário</label>
              <select 
                [(ngModel)]="settings.timezone"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                <option value="America/New_York">Nova York (GMT-5)</option>
                <option value="Europe/London">Londres (GMT+0)</option>
              </select>
            </div>
            
            <!-- Date Format -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Formato de Data</label>
              <select 
                [(ngModel)]="settings.dateFormat"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                <option value="YYYY-MM-DD">AAAA-MM-DD</option>
              </select>
            </div>
            
            <!-- Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
              <select 
                [(ngModel)]="settings.language"
                class="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200" [@fadeIn]>
          <h2 class="text-2xl font-bold text-blue-700 mb-6 flex items-center">
            <i class="fas fa-bell mr-3"></i>
            Notificações
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 class="text-blue-900 font-semibold">Notificações por Email</h3>
                <p class="text-gray-600 text-sm">Receber notificações importantes por email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.emailNotifications"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 class="text-blue-900 font-semibold">Notificações Push</h3>
                <p class="text-gray-600 text-sm">Receber notificações no navegador</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.pushNotifications"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 class="text-blue-900 font-semibold">Relatórios Automáticos</h3>
                <p class="text-gray-600 text-sm">Enviar relatórios mensais automaticamente</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.automaticReports"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="bg-white backdrop-blur-sm rounded-xl p-6 border border-blue-200" [@fadeIn]>
          <h2 class="text-2xl font-bold text-blue-700 mb-6 flex items-center">
            <i class="fas fa-shield-alt mr-3"></i>
            Segurança
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 class="text-blue-900 font-semibold">Autenticação de Dois Fatores</h3>
                <p class="text-gray-600 text-sm">Adicionar camada extra de segurança</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.twoFactorAuth"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 class="text-blue-900 font-semibold">Backup Automático</h3>
                <p class="text-gray-600 text-sm">Fazer backup dos dados automaticamente</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.autoBackup"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div class="p-4 bg-blue-50 rounded-lg">
              <h3 class="text-blue-900 font-semibold mb-2">Sessão de Login</h3>
              <p class="text-gray-600 text-sm mb-3">Tempo limite para sessões inativas</p>
              <select 
                [(ngModel)]="settings.sessionTimeout"
                class="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-900 focus:outline-none focus:border-blue-500"
              >
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="480">8 horas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-8 flex justify-end" [@slideIn]>
        <button 
          (click)="saveSettings()"
          class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <i class="fas fa-save mr-2"></i>
          Salvar Configurações
        </button>
      </div>
    </div>
  `
})
export class SettingsComponent {
  settings = {
    companyName: 'Inadizero Gestão Imobiliária',
    contactEmail: 'contato&#64;inadizero.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Empresas, 123\nCentro - São Paulo/SP\nCEP: 01000-000',
    defaultCurrency: 'BRL',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    language: 'pt-BR',
    emailNotifications: true,
    pushNotifications: true,
    automaticReports: false,
    twoFactorAuth: false,
    autoBackup: true,
    sessionTimeout: '60'
  };

  saveSettings() {
    // Aqui você implementaria a lógica para salvar as configurações
    console.log('Configurações salvas:', this.settings);
    
    // Simular salvamento com feedback visual
    const button = event?.target as HTMLButtonElement;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-2"></i>Salvo!';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 2000);
  }
}