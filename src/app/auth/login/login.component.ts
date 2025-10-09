import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../auth.service';
import { DialogService } from '../../services/dialog.service';
import { DialogComponent } from '../../core/components/dialog/dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DialogComponent],
  template: `
    <div class="min-h-screen flex bg-white relative overflow-hidden">
      <!-- Left Side - Image Section -->
      <div class="hidden lg:flex lg:flex-1 lg:relative">
        <!-- Background Image -->
        <div class="absolute inset-0">
          <img 
            src="assets/login/iandi.jpg" 
            alt="Login Background" 
            class="w-full h-full object-cover"
          />
          <!-- Overlay Gradient -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-indigo-500/60 mix-blend-multiply"></div>
        </div>
        
        <!-- Content Over Image -->
        <div class="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <!-- Logo/Brand -->
          <div class="flex items-center space-x-3">

            <div>
              <h1 class="text-2xl font-bold">InadiZero</h1>
            </div>
          </div>



          <!-- Footer on Image -->
          <div class="text-blue-100 text-sm">
            <p>© 2025 InadiZero. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:flex-none">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <!-- Mobile Logo -->
          <div class="lg:hidden flex justify-center mb-8">
            <div class="flex items-center space-x-3">
              <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">InadiZero</h1>
                <p class="text-gray-600 text-sm">Gestão de Aluguéis</p>
              </div>
            </div>
          </div>

          <!-- Form Container -->
          <div
            @formAnimation
            class=""
          >
            <!-- Header -->
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold bg-blue-500 bg-clip-text text-transparent">
                Portal do Administrador
              </h2>
              <p class="text-gray-600 mt-2">
                Entre em sua conta para continuar
              </p>
            </div>

            <!-- Login Form -->
            <form
              class="space-y-6"
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
            >
              <!-- Email Field -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="seu@email.com"
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    [class.border-red-300]="emailField?.invalid && emailField?.touched"
                    [class.border-green-500]="emailField?.valid && emailField?.touched"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg *ngIf="emailField?.valid && emailField?.touched" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div *ngIf="showFieldError('email')" class="text-red-500 text-xs flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <span>
                    {{ emailField?.errors?.['required'] ? 'Email é obrigatório' : 
                       emailField?.errors?.['email'] ? 'Email inválido' : '' }}
                  </span>
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <a
                    href="#"
                    class="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="••••••••"
                    class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    [class.border-red-300]="passwordField?.invalid && passwordField?.touched"
                    [class.border-green-500]="passwordField?.valid && passwordField?.touched"
                  />
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      <path *ngIf="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
                <div *ngIf="showFieldError('password')" class="text-red-500 text-xs flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <span>
                    {{ passwordField?.errors?.['required'] ? 'Senha é obrigatória' : 
                       passwordField?.errors?.['minlength'] ? 'Mínimo 6 caracteres' : '' }}
                  </span>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  formControlName="rememberMe"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Manter conectado
                </label>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="!loginForm.valid || loading"
                  class="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-900 to-indigo-400 hover:from-blue-900 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <svg *ngIf="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ loading ? 'Entrando...' : 'Entrar na Conta' }}</span>
                </button>
              </div>
            </form>

            <!-- Register Link -->
            <div class="mt-8 text-center border-t border-gray-200 pt-6">
              <p class="text-gray-600 text-sm">
                Novo no sistema?
                <a
                  [routerLink]="['/registro']"
                  class="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-300"
                >
                  Criar conta
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <!-- Dialog Component -->
      <app-dialog></app-dialog>
    `,
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', 
                style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit() {}

  // Getters para facilitar o acesso aos campos
  get emailField() {
    return this.loginForm.get('email');
  }

  get passwordField() {
    return this.loginForm.get('password');
  }

  showFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.dialogService.showWarning(
        'Formulário Inválido',
        'Por favor, preencha todos os campos obrigatórios corretamente.'
      );
      return;
    }

    this.loading = true;

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        this.dialogService.showSuccess(
          'Login realizado com sucesso!',
          'Bem-vindo de volta! Você será redirecionado em instantes.',
          3000
        );
        
        // Redirecionar após um pequeno delay para mostrar o dialog
        setTimeout(() => {
          // Redireciona baseado no role
          if (this.authService.hasRole('visitante')) {
            this.router.navigate(['/dashboard-limited']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
        
        if (err.status === 401) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (err.status === 404) {
          errorMessage = 'Usuário não encontrado. Verifique o email informado.';
        } else if (err.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.dialogService.showError(
          'Erro no Login',
          errorMessage
        );
      },
    });
  }
}