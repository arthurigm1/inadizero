import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../auth.service';
// Removidos imports do Angular Material para evitar erro NG0203

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8"
    >
      <!-- Container Principal -->
      <div
        @slideInUp
        class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
      >
        <!-- Header com Gradiente -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
          <div class="flex justify-center mb-3">
            <div class="p-3 bg-white bg-opacity-20 rounded-2xl">
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
          </div>
          <h1 class="text-2xl font-bold text-white mb-1">InadiZero</h1>
          <p class="text-blue-100 text-sm font-medium">
            Sistema de Gestão de Aluguéis Comerciais
          </p>
        </div>

        <!-- Conteúdo do Formulário -->
        <div class="px-8 py-8">
          <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="space-y-5">
              <!-- Campo Email -->
              <div>
                <label
                  for="email"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <div class="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    formControlName="email"
                    required
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="seu@email.com"
                    [class.border-red-500]="emailField?.invalid && emailField?.touched"
                    [class.border-green-500]="emailField?.valid && emailField?.touched"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      *ngIf="emailField?.valid && emailField?.touched"
                      class="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div
                  *ngIf="emailField?.invalid && emailField?.touched"
                  class="text-red-600 text-xs mt-2 flex items-center space-x-1"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {{ emailField?.errors?.['required'] ? 'Email é obrigatório' : 
                       emailField?.errors?.['email'] ? 'Email inválido' : '' }}
                  </span>
                </div>
              </div>

              <!-- Campo Senha -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label
                    for="password"
                    class="block text-sm font-semibold text-gray-700"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    class="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div class="relative">
                  <input
                    id="password"
                    name="password"
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="password"
                    required
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                    placeholder="••••••••"
                    [class.border-red-500]="passwordField?.invalid && passwordField?.touched"
                    [class.border-green-500]="passwordField?.valid && passwordField?.touched"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                    (click)="togglePasswordVisibility()"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        *ngIf="!showPassword"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        *ngIf="!showPassword"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <path
                        *ngIf="showPassword"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  *ngIf="passwordField?.invalid && passwordField?.touched"
                  class="text-red-600 text-xs mt-2 flex items-center space-x-1"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {{ passwordField?.errors?.['required'] ? 'Senha é obrigatória' : 
                       passwordField?.errors?.['minlength'] ? 'Mínimo 6 caracteres' : '' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Checkbox Lembrar-me -->
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

            <!-- Botão de Submit -->
            <div>
              <button
                type="submit"
                [disabled]="!loginForm.valid || loading"
                class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div
                  *ngIf="loading"
                  class="mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
                <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
              </button>
            </div>
          </form>

          <!-- Link para Registro -->
          <div class="mt-6 text-center">
            <p class="text-gray-600 text-sm">
              Novo no sistema?
              <a
                [routerLink]="['/registro']"
                class="font-semibold text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Criar conta
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p class="text-xs text-gray-500 text-center">
            © 2024 InadiZero. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate(
          '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  // Getters para facilitar o acesso aos campos
  get emailField() {
    return this.loginForm.get('email');
  }

  get passwordField() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      // Marca todos os campos como touched para mostrar os erros
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        
        // Feedback visual de sucesso via console
        console.log('Login realizado com sucesso!');

        // Redireciona baseado no role
        if (this.authService.hasRole('visitante')) {
          this.router.navigate(['/dashboard-limited']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.message || 'Erro ao fazer login. Verifique suas credenciais.';
        
        // Feedback de erro via console
        console.error('Erro no login:', errorMessage);
        alert(errorMessage); // Usando alert simples como alternativa
      },
    });
  }
}