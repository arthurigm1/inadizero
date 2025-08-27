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
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4" [@fadeIn]>
      <!-- Background decorative elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 -right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-1/4 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl"></div>
        
        <!-- Grid pattern -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div class="max-w-5xl w-full flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-black/70 border border-yellow-500/30">
        <!-- Left side - Illustration -->
        <div class="md:w-1/2 bg-gradient-to-br from-black to-gray-900 p-8 flex flex-col justify-center items-center text-center relative">
          <!-- Decorative lines -->
          <div class="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <div class="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          
          <div class="mb-8 z-10">
            <div class="flex items-center justify-center mb-4">
              <div class="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <svg class="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">Portal do Inquilino</h1>
            <p class="text-yellow-500/90 font-medium">Acesso seguro às suas informações</p>
          </div>
          
          <div class="relative w-full max-w-xs mb-8">
            <!-- Building illustration with yellow accents -->
            <div class="relative z-10">
              <div class="h-48 w-64 mx-auto bg-gray-800 rounded-t-lg border border-yellow-500/30 shadow-lg">
                <div class="flex flex-col h-full p-2">
                  <!-- Windows with yellow lights -->
                  <div class="flex-1 grid grid-cols-4 gap-2 py-3">
                    <div *ngFor="let i of [1,2,3,4,5,6,7,8]" 
                         class="bg-yellow-500/20 rounded-sm border border-yellow-500/30 shadow-sm shadow-yellow-500/10"></div>
                  </div>
                  <!-- Door -->
                  <div class="h-16 w-12 mx-auto bg-yellow-500/40 rounded-t-md border border-yellow-500/30 shadow-inner"></div>
                </div>
              </div>
            </div>
            
            <!-- Reflection effect -->
            <div class="absolute -bottom-4 left-0 right-0 h-8 bg-yellow-500/10 rounded-full blur-md"></div>
          </div>
          
          <div class="text-yellow-500/80 text-sm">
            <div class="flex flex-col space-y-4 mb-4">
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Acesso seguro e criptografado</span>
              </div>
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <span>Suporte disponível 24/7</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right side - Login Form -->
        <div class="md:w-1/2 bg-gradient-to-b from-gray-900 to-black p-8 md:p-10 flex flex-col justify-center relative">
          <!-- Decorative lines -->
          <div class="absolute bottom-0 right-0 w-1 h-full bg-yellow-500"></div>
          <div class="absolute bottom-0 right-0 w-full h-1 bg-yellow-500"></div>
          
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-white">Acesse sua conta</h2>
            <p class="text-yellow-500/90 mt-2">Entre com suas credenciais para continuar</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="relative">
              <label for="email" class="block text-sm font-medium text-yellow-500 mb-2">
                Email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
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
                  class="appearance-none relative block w-full pl-10 pr-3 py-3 border border-yellow-500/30 placeholder-yellow-500/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800/70 backdrop-blur-sm transition-all duration-300"
                  placeholder="seu.email@exemplo.com"
                />
              </div>
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-1 text-yellow-300 text-sm">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">
                  Email é obrigatório
                </span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">
                  Email deve ter um formato válido
                </span>
              </div>
            </div>

            <div class="relative">
              <label for="senha" class="block text-sm font-medium text-yellow-500 mb-2">
                Senha
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  formControlName="senha"
                  required
                  class="appearance-none relative block w-full pl-10 pr-3 py-3 border border-yellow-500/30 placeholder-yellow-500/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800/70 backdrop-blur-sm transition-all duration-300"
                  placeholder="Sua senha"
                />
              </div>
              <div *ngIf="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched" class="mt-1 text-yellow-300 text-sm">
                <span *ngIf="loginForm.get('senha')?.errors?.['required']">
                  Senha é obrigatória
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-500/30 rounded bg-gray-800"
                />
                <label for="remember-me" class="ml-2 block text-sm text-yellow-500/90">
                  Lembrar-me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-yellow-500 hover:text-yellow-400 transition-colors duration-300">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-yellow-500/20"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-black group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                <span *ngIf="!isLoading">Acessar Portal</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Acessando...
                </span>
              </button>
            </div>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-yellow-500/80 text-sm">
              Precisa de ajuda? 
              <a href="#" class="font-medium text-yellow-500 hover:text-yellow-400 transition-colors duration-300">
                Contate nosso suporte
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Notification Dialog -->
      <div *ngIf="notification.show" 
           [@slideInOut]
           class="fixed top-4 right-4 z-50 max-w-sm w-full">
        <div class="rounded-lg shadow-2xl border backdrop-blur-sm"
             [ngClass]="{
               'bg-green-900/90 border-green-500/50': notification.type === 'success',
               'bg-red-900/90 border-red-500/50': notification.type === 'error',
               'bg-blue-900/90 border-blue-500/50': notification.type === 'info'
             }">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <!-- Success Icon -->
                <svg *ngIf="notification.type === 'success'" 
                     class="h-6 w-6 text-green-400" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor">
                  <path stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <!-- Error Icon -->
                <svg *ngIf="notification.type === 'error'" 
                     class="h-6 w-6 text-red-400" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor">
                  <path stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <!-- Info Icon -->
                <svg *ngIf="notification.type === 'info'" 
                     class="h-6 w-6 text-blue-400" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor">
                  <path stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium"
                   [ngClass]="{
                     'text-green-100': notification.type === 'success',
                     'text-red-100': notification.type === 'error',
                     'text-blue-100': notification.type === 'info'
                   }">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm"
                   [ngClass]="{
                     'text-green-200': notification.type === 'success',
                     'text-red-200': notification.type === 'error',
                     'text-blue-200': notification.type === 'info'
                   }">
                  {{ notification.message }}
                </p>
              </div>
              
              <div class="ml-4 flex-shrink-0 flex">
                <button (click)="hideNotification()"
                        class="rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2"
                        [ngClass]="{
                          'text-green-400 hover:text-green-300 focus:ring-green-500': notification.type === 'success',
                          'text-red-400 hover:text-red-300 focus:ring-red-500': notification.type === 'error',
                          'text-blue-400 hover:text-blue-300 focus:ring-blue-500': notification.type === 'info'
                        }">
                  <span class="sr-only">Fechar</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" 
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                          clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in-out')
      ]),
      transition('* => void', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))
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
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    this.notification.show = false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.hideNotification(); // Hide any existing notifications
      
      const { email, senha } = this.loginForm.value;

      this.tenantService.login({ email, senha }).subscribe({
        next: (tenant) => {
          this.isLoading = false;
          this.showNotification(
            'success',
            'Login realizado com sucesso!',
            'Redirecionando para o portal do inquilino...'
          );
          
          // Delay navigation to show success message
          setTimeout(() => {
            this.router.navigate(['/tenant/portal']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMessage = err.message || 'Erro ao fazer login. Verifique suas credenciais e tente novamente.';
          this.showNotification(
            'error',
            'Erro no login',
            errorMessage
          );
          console.error('Erro no login:', err);
        },
      });
    } else {
      this.showNotification(
        'error',
        'Formulário inválido',
        'Por favor, preencha todos os campos obrigatórios corretamente.'
      );
    }
  }
}