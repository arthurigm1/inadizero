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
import { TenantService } from '../tenant.service';


@Component({
  selector: 'app-tenant-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4" [@fadeIn]>
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-white">
            Portal do Inquilino
          </h2>
          <p class="mt-2 text-sm text-blue-200">
            Acesse suas informações
          </p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                formControlName="email"
                required
                class="appearance-none relative block w-full px-3 py-3 border border-white/30 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                placeholder="Digite seu email"
              />
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-1 text-red-300 text-sm">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">
                  Email é obrigatório
                </span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">
                  Email deve ter um formato válido
                </span>
              </div>
            </div>

            <div>
              <label for="senha" class="block text-sm font-medium text-white mb-2">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="senha"
                formControlName="senha"
                required
                class="appearance-none relative block w-full px-3 py-3 border border-white/30 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                placeholder="Digite sua senha"
              />
              <div *ngIf="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched" class="mt-1 text-red-300 text-sm">
                <span *ngIf="loginForm.get('senha')?.errors?.['required']">
                  Senha é obrigatória
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                <span *ngIf="!isLoading">Entrar</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              </button>
            </div>
          </form>
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
export class TenantLoginComponent {
  loginForm: FormGroup;
  isLoading = false;

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

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, senha } = this.loginForm.value;

      this.tenantService.login({ email, senha }).subscribe({
        next: (tenant) => {
          console.log('Inquilino logado com sucesso:', tenant);
          this.router.navigate(['/tenant/portal']);
        },
        error: (err) => {
          this.isLoading = false;
          alert(err.message || 'Erro ao fazer login');
          console.error('Erro no login:', err);
        },
      });
    }
  }
}