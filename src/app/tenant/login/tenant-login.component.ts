import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    <div class="min-h-screen flex" [@fadeIn]>
      <!-- Left Side - Image -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/40 z-10"></div>
        <img 
          src="assets/login/muie.png" 
          alt="Portal do Inquilino" 
          class="w-full h-full object-cover"
          [@imageSlide]
        >
        
        <!-- Overlay Content -->
        <div class="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <div [@textSlideUp]>
            <h1 class="text-4xl font-bold mb-4 leading-tight">
              Portal do Inquilino
            </h1>
            <p class="text-xl text-white/90 leading-relaxed">
              Acesse seu portal de gestão de aluguel com segurança e praticidade.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 bg-white relative">
        <!-- Top-right back button -->
        <div class="absolute top-4 right-6">
          <button type="button"
                  (click)="goHome()"
                  class="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="ml-2">Voltar para início</span>
          </button>
        </div>
        <div class="w-full max-w-md" [@formSlide]>
          
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6" [@iconBounce]>
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta
            </h2>
            <p class="text-gray-600">
              Entre com suas credenciais para acessar sua conta
            </p>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Email Field -->
            <div [@inputSlide]>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div class="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  formControlName="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:border-gray-400"
                  [class.border-red-300]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  [class.focus:ring-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  placeholder="seu.email@exemplo.com"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                   class="mt-2 text-sm text-red-600 flex items-center" [@errorSlide]>
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
            <div [@inputSlide]>
              <div class="flex items-center justify-between mb-2">
                <label for="senha" class="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <button type="button" (click)="openResetRequestModal()" class="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Esqueceu a senha?
                </button>
              </div>
              <div class="relative group">
                <input
                  id="senha"
                  name="senha"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="senha"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:border-gray-400 pr-12"
                  [class.border-red-300]="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched"
                  [class.focus:ring-red-500]="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched"
                  placeholder="Sua senha"
                >
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                </button>
              </div>
              <div *ngIf="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched" 
                   class="mt-2 text-sm text-red-600 flex items-center" [@errorSlide]>
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <span *ngIf="loginForm.get('senha')?.errors?.['required']">
                  Senha é obrigatória
                </span>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center" [@inputSlide]>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-150"
              >
              <label for="remember-me" class="ml-3 block text-sm text-gray-700">
                Manter conectado
              </label>
            </div>

            <!-- Submit Button -->
            <div [@buttonSlide]>
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isLoading ? 'Entrando...' : 'Entrar' }}</span>
              </button>
            </div>
          </form>

          <!-- Additional Links -->
          <div class="mt-8 text-center" [@linkSlide]>
            <p class="text-gray-600 text-sm">
              Novo no portal? 
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Solicite seu acesso
              </a>
            </p>
          </div>
        </div>
      </div>

      <!-- Mobile Header for smaller screens -->
      <div class="lg:hidden absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div class="flex items-center justify-center py-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-4m0 4h4"/>
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">Portal do Inquilino</span>
        </div>
      </div>

      <!-- Notification -->
      <div *ngIf="notification.show" 
           [@notificationSlide]
           class="fixed top-6 right-6 z-50 max-w-sm w-full">
        <div class="rounded-lg shadow-lg border-l-4 p-4 bg-white backdrop-blur-sm"
             [ngClass]="{
               'border-l-green-500': notification.type === 'success',
               'border-l-red-500': notification.type === 'error',
               'border-l-blue-500': notification.type === 'info'
             }">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg *ngIf="notification.type === 'success'" 
                   class="h-5 w-5 text-green-500" 
                   fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="notification.type === 'error'" 
                   class="h-5 w-5 text-red-500" 
                   fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="notification.type === 'info'" 
                   class="h-5 w-5 text-blue-500" 
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
                      class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors duration-200">
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reset Request Modal (email only) -->
      <div *ngIf="resetRequestModalOpen" class="fixed inset-0 z-50 flex items-center justify-center" [@modalFade]>
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="closeResetRequestModal()"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4" [@modalSlide]>
          <div class="px-6 pt-6 pb-4 border-b">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12V8a4 4 0 10-8 0v4M5 12h14l-1 8H6l-1-8z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Esqueci minha senha</h3>
                  <p class="text-sm text-gray-600">Informe seu email para receber o link</p>
                </div>
              </div>
              <button (click)="closeResetRequestModal()" class="text-gray-400 hover:text-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>

          <form [formGroup]="resetRequestForm" (ngSubmit)="onSubmitResetRequest()" class="px-6 py-4 space-y-5">
            <div>
              <label for="emailRecuperacao" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input id="emailRecuperacao" type="email" formControlName="email" placeholder="seu.email@exemplo.com"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400">
              <div *ngIf="resetRequestForm.get('email')?.invalid && resetRequestForm.get('email')?.touched" class="mt-2 text-sm text-red-600">
                Informe um email válido.
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" [disabled]="resetRequestForm.invalid || isRequestingReset" class="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                <svg *ngIf="isRequestingReset" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isRequestingReset ? 'Enviando...' : 'Enviar link de redefinição' }}</span>
              </button>
            </div>

            <div class="text-center pb-4">
              <p class="text-xs text-gray-500">Você receberá um email com instruções para redefinir sua senha.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('imageSlide', [
      transition(':enter', [
        style({ transform: 'scale(1.1)', opacity: 0 }),
        animate('800ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('textSlideUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('600ms 400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('formSlide', [
      transition(':enter', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('500ms 200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('iconBounce', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('400ms 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('inputSlide', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('buttonSlide', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms 100ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('linkSlide', [
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate('400ms 200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('errorSlide', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0, height: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0, height: 0 }))
      ])
    ]),
    trigger('notificationSlide', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('modalFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalSlide', [
      transition(':enter', [
        style({ transform: 'translateY(16px)', opacity: 0 }),
        animate('250ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(12px)', opacity: 0 }))
      ])
    ])
  ]
})
export class TenantLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  resetRequestModalOpen = false;
  resetRequestForm: FormGroup;
  isRequestingReset = false;
  notification: NotificationMessage = {
    type: 'info',
    title: '',
    message: '',
    show: false
  };

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });

    this.resetRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  showNotification(type: 'success' | 'error' | 'info', title: string, message: string) {
    this.notification = {
      type,
      title,
      message,
      show: true
    };
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      if (this.notification.show) {
        this.hideNotification();
      }
    }, 4000);
  }

  hideNotification() {
    this.notification.show = false;
  }

  openResetRequestModal() {
    this.resetRequestModalOpen = true;
  }

  closeResetRequestModal() {
    this.resetRequestModalOpen = false;
    this.resetRequestForm.reset();
  }

  onSubmitResetRequest() {
    if (this.resetRequestForm.invalid) {
      this.resetRequestForm.get('email')?.markAsTouched();
      return;
    }

    const { email } = this.resetRequestForm.value;
    const apiBaseUrl = 'http://localhost:3010/api';

    this.isRequestingReset = true;
    this.http.post(`${apiBaseUrl}/usuario/solicitar-redefinicao-senha`, { email }).subscribe({
      next: () => {
        this.isRequestingReset = false;
        this.showNotification('success', 'Verifique seu email', 'Se o email existir, enviamos o link de redefinição.');
        this.closeResetRequestModal();
      },
      error: (err) => {
        this.isRequestingReset = false;
        const rawMessage = (err?.error?.message || err?.message || '').toString();
        const message = rawMessage || 'Não foi possível enviar o email de redefinição.';
        this.showNotification('error', 'Erro ao enviar', message);
        console.error('Reset request error:', err);
      }
    });
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