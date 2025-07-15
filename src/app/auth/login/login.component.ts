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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-yellow-900"
    >
      <div
        @fadeIn
        class="w-full max-w-md px-8 py-12 bg-black bg-opacity-80 rounded-2xl shadow-2xl border border-yellow-500 border-opacity-30 transform transition-all duration-500 hover:shadow-yellow-500/50 hover:border-opacity-50"
      >
        <div class="text-center mb-10">
          <div class="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
          </div>
          <h2 class="text-4xl font-bold text-yellow-400 mb-2 tracking-wider">
            InadiZero
          </h2>
          <p class="text-gray-300 text-opacity-80">
            Sistema de Gestão de Aluguéis Comerciais
          </p>
        </div>

        <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-300 mb-1"
                >Email</label
              >
              <input
                id="email"
                name="email"
                type="email"
                formControlName="email"
                required
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
                placeholder="seu@email.com"
                [class.invalid]="
                  loginForm.get('email')?.invalid &&
                  loginForm.get('email')?.touched
                "
              />
              <div
                *ngIf="
                  loginForm.get('email')?.invalid &&
                  loginForm.get('email')?.touched
                "
                class="text-red-400 text-xs mt-1"
              >
                <span *ngIf="loginForm.get('email')?.errors?.['required']"
                  >Email é obrigatório</span
                >
                <span *ngIf="loginForm.get('email')?.errors?.['email']"
                  >Email inválido</span
                >
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-300 mb-1"
                >Senha</label
              >
              <input
                id="password"
                name="password"
                type="password"
                formControlName="password"
                required
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
                placeholder="••••••••"
                [class.invalid]="
                  loginForm.get('password')?.invalid &&
                  loginForm.get('password')?.touched
                "
              />
              <div
                *ngIf="
                  loginForm.get('password')?.invalid &&
                  loginForm.get('password')?.touched
                "
                class="text-red-400 text-xs mt-1"
              >
                <span *ngIf="loginForm.get('password')?.errors?.['required']"
                  >Senha é obrigatória</span
                >
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']"
                  >Mínimo 6 caracteres</span
                >
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-700 rounded bg-gray-800"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-300"
                >Lembrar-me</label
              >
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-yellow-400 hover:text-yellow-300 transition duration-300"
                >Esqueceu sua senha?</a
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="!loginForm.valid"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-[1.02]"
            >
              Entrar
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Novo no sistema?
            <a
              [routerLink]="['/registro']"
              class="font-medium text-yellow-400 hover:text-yellow-300 transition duration-300"
              >Crie uma conta</a
            >
          </p>
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
  ],
})
// ... (imports anteriores)
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;

        // Redireciona baseado no role
        if (this.authService.hasRole('visitante')) {
          this.router.navigate(['/dashboard-limited']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Erro ao fazer login';
        this.snackBar.open(
          this.errorMessage ?? 'Erro ao fazer login',
          'Fechar',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
  }
}
