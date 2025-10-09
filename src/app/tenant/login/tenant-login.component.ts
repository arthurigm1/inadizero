import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { TenantService } from '../tenant.service';

interface NotificationMessage {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  show: boolean;
}

@Component({
  selector: 'app-tenant-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4" [@pageTransition]>
      <!-- Main Container -->
      <div class="max-w-6xl w-full flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
        
        <!-- Left Side - Brand & Information -->
        <div class="lg:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 text-white relative overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full opacity-5"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 h-full flex flex-col justify-between">
            <!-- Header -->
            <div>
              <div class="flex items-center mb-8">
                <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm1.5 5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="ml-3 text-xl font-bold">PortalImóveis</span>
              </div>

              <h1 class="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Portal do <br>Inquilino
              </h1>
              <p class="text-blue-100 text-lg leading-relaxed">
                Acesso seguro ao seu portal de gestão de aluguel e comunicação com a administração.
              </p>
            </div>

            <!-- Features List -->
            <div class="space-y-4 mt-8">
              <div class="flex items-center" [@staggerItem]>
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-blue-100">Acesso 24/7 às suas informações</span>
              </div>

              <div class="flex items-center" [@staggerItem]>
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-blue-100">Comunicação direta e segura</span>
              </div>

              <div class="flex items-center" [@staggerItem]>
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                </div>
                <span class="text-blue-100">Gestão simplificada de documentos</span>
              </div>
            </div>

            <!-- Bottom Text -->
            <div class="mt-8 pt-6 border-t border-white/20">
              <p class="text-blue-100 text-sm">
                Precisa de ajuda? 
                <a href="#" class="text-white font-semibold hover:underline transition-colors">
                  Contate nosso suporte
                </a>
              </p>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="lg:w-3/5 p-8 lg:p-12 bg-white">
          <div class="max-w-md mx-auto">
            <!-- Form Header -->
            <div class="text-center mb-8">
              <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Acesse sua conta
              </h2>
              <p class="text-gray-600">
                Entre com suas credenciais para acessar o portal
              </p>
            </div>

            <!-- Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    formControlName="email"
                    required
                    class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white"
                    placeholder="seu.email@exemplo.com"
                    [class.border-red-300]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                    [class.focus:border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  >
                </div>
                <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                     class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <span *ngIf="loginForm.get('email')?.errors?.['required']">
                    Email é obrigatório
                  </span>
                  <span *ngIf="loginForm.get('email')?.errors?.['email']">
                    Digite um email válido
                  </span>
                </div>
              </div>

              <!-- Password Field -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label for="senha" class="block text-sm font-semibold text-gray-700">
                    Senha
                  </label>
                  <a href="#" class="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    formControlName="senha"
                    required
                    class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white"
                    placeholder="Sua senha"
                    [class.border-red-300]="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched"
                    [class.focus:border-red-500]="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched"
                  >
                </div>
                <div *ngIf="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched" 
                     class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <span *ngIf="loginForm.get('senha')?.errors?.['required']">
                    Senha é obrigatória
                  </span>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Manter conectado
                </label>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="loginForm.invalid || isLoading"
                  class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isLoading ? 'Acessando...' : 'Acessar Portal' }}</span>
                </button>
              </div>
            </form>

            <!-- Additional Links -->
            <div class="mt-8 text-center">
              <p class="text-gray-600 text-sm">
                Novo no portal? 
                <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Solicite seu acesso
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification -->
      <div *ngIf="notification.show" 
           [@notificationSlide]
           class="fixed top-4 right-4 z-50 max-w-sm w-full">
        <div class="rounded-lg shadow-lg border-l-4 p-4 bg-white"
             [ngClass]="{
               'border-l-green-500': notification.type === 'success',
               'border-l-red-500': notification.type === 'error',
               'border-l-blue-500': notification.type === 'info'
             }">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg *ngIf="notification.type === 'success'" 
                   class="h-6 w-6 text-green-500" 
                   fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="notification.type === 'error'" 
                   class="h-6 w-6 text-red-500" 
                   fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="notification.type === 'info'" 
                   class="h-6 w-6 text-blue-500" 
                   fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
            </div>
            
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p class="mt-1 text-sm text-gray-600">
                {{ notification.message }}
              </p>
            </div>
            
            <div class="ml-4 flex-shrink-0">
              <button (click)="hideNotification()"
                      class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('pageTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('staggerItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms 200ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('notificationSlide', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
  ],
})
export class TenantLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  notification: NotificationMessage = {
    type: 'info',
    title: '',
    message: '',
    show: false
  };

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  showNotification(type: 'success' | 'error' | 'info', title: string, message: string) {
    this.notification = {
      type,
      title,
      message,
      show: true
    };
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (this.notification.show) {
        this.hideNotification();
      }
    }, 5000);
  }

  hideNotification() {
    this.notification.show = false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.hideNotification();
      
      const { email, senha } = this.loginForm.value;

      this.tenantService.login({ email, senha }).subscribe({
        next: (tenant) => {
          this.isLoading = false;
          this.showNotification(
            'success',
            'Login realizado com sucesso!',
            'Redirecionando para o portal...'
          );
          
          setTimeout(() => {
            this.router.navigate(['/tenant/portal']);
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMessage = err.message || 'Erro ao fazer login. Verifique suas credenciais.';
          this.showNotification(
            'error',
            'Erro no login',
            errorMessage
          );
          console.error('Login error:', err);
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      
      this.showNotification(
        'error',
        'Formulário incompleto',
        'Preencha todos os campos obrigatórios corretamente.'
      );
    }
  }
}