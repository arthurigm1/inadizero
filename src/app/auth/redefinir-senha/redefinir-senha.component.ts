import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-md">
        <!-- Brand/Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V9a7 7 0 10-14 0v12h14z"/>
            </svg>
          </div>
          <h1 class="mt-3 text-2xl font-bold text-white">Redefinir senha</h1>
          <p class="text-white/80 text-sm">Defina uma nova senha para acessar sua conta</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Nova Senha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="novaSenha">Nova senha</label>
              <div class="relative">
                <input
                  id="novaSenha"
                  [type]="showNewPassword ? 'text' : 'password'"
                  formControlName="novaSenha"
                  placeholder="••••••••"
                  class="w-full border border-gray-300 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="button" (click)="toggleNewPassword()" class="absolute inset-y-0 right-0 pr-3 text-gray-400 hover:text-gray-600">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path *ngIf="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path *ngIf="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    <path *ngIf="showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59"/>
                  </svg>
                </button>
              </div>
              <div class="text-xs text-gray-500 mt-1">Mínimo de 8 caracteres. Use letras e números para mais segurança.</div>
              <div class="text-xs text-red-600 mt-1" *ngIf="resetForm.get('novaSenha')?.touched && resetForm.get('novaSenha')?.invalid">
                <span *ngIf="resetForm.get('novaSenha')?.errors?.['required']">Senha é obrigatória.</span>
                <span *ngIf="resetForm.get('novaSenha')?.errors?.['minlength']">Mínimo de 8 caracteres.</span>
              </div>
            </div>

            <!-- Confirmar Senha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="confirmarSenha">Confirmar senha</label>
              <div class="relative">
                <input
                  id="confirmarSenha"
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  formControlName="confirmarSenha"
                  placeholder="••••••••"
                  class="w-full border border-gray-300 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="button" (click)="toggleConfirmPassword()" class="absolute inset-y-0 right-0 pr-3 text-gray-400 hover:text-gray-600">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path *ngIf="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path *ngIf="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    <path *ngIf="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59"/>
                  </svg>
                </button>
              </div>
              <div class="text-xs text-red-600 mt-1" *ngIf="resetForm.get('confirmarSenha')?.touched && resetForm.get('confirmarSenha')?.invalid">
                <span *ngIf="resetForm.get('confirmarSenha')?.errors?.['required']">Confirmação é obrigatória.</span>
                <span *ngIf="resetForm.errors?.['passwordMismatch']">As senhas não coincidem.</span>
              </div>
            </div>

            <!-- Alerts -->
            <div *ngIf="errorMessage" class="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
              <svg class="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
            <div *ngIf="successMessage" class="flex items-start gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
              <svg class="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="resetForm.invalid || loading"
              class="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              <svg *ngIf="loading" class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>{{ loading ? 'Enviando...' : 'Redefinir senha' }}</span>
            </button>
          </form>

          <div class="mt-5 text-center">
            <a routerLink="/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">Voltar para login</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RedefinirSenhaComponent {
  resetForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  token: string | null = null;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        novaSenha: ['', [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );

    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
    });
  }

  passwordsMatch = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const senha = group.get('novaSenha')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    if (!senha || !confirmar) return null;
    return senha === confirmar ? null : { passwordMismatch: true };
  };

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    if (!this.token) {
      this.errorMessage = 'Token ausente ou inválido. Utilize o link enviado.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const novaSenha = this.resetForm.value['novaSenha'];
    const url = 'http://localhost:3010/api/usuario/validar-redefinicao-senha';

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${this.token}`);

    const body = {
      novaSenha,
      token: this.token,
    };

    this.http.post(url, body, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Senha redefinida com sucesso! Redirecionando para o login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 401 || err?.status === 403) {
          this.errorMessage = 'Acesso negado. Token inválido ou expirado.';
        } else {
          this.errorMessage = 'Erro ao redefinir senha. Tente novamente mais tarde.';
        }
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}