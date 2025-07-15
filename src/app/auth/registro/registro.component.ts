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

@Component({
  selector: 'app-register',
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 class="text-4xl font-bold text-yellow-400 mb-2 tracking-wider">
            Criar Conta
          </h2>
          <p class="text-gray-300 text-opacity-80">
            Preencha os dados para se registrar
          </p>
        </div>

        <form
          class="space-y-4"
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium text-gray-300 mb-1"
                >Nome</label
              >
              <input
                id="firstName"
                name="firstName"
                type="text"
                formControlName="firstName"
                required
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
                placeholder="Seu nome"
                [class.invalid]="
                  registerForm.get('firstName')?.invalid &&
                  registerForm.get('firstName')?.touched
                "
              />
              <div
                *ngIf="
                  registerForm.get('firstName')?.invalid &&
                  registerForm.get('firstName')?.touched
                "
                class="text-red-400 text-xs mt-1"
              >
                Nome é obrigatório
              </div>
            </div>

            <div>
              <label
                for="lastName"
                class="block text-sm font-medium text-gray-300 mb-1"
                >Sobrenome</label
              >
              <input
                id="lastName"
                name="lastName"
                type="text"
                formControlName="lastName"
                required
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
                placeholder="Seu sobrenome"
                [class.invalid]="
                  registerForm.get('lastName')?.invalid &&
                  registerForm.get('lastName')?.touched
                "
              />
              <div
                *ngIf="
                  registerForm.get('lastName')?.invalid &&
                  registerForm.get('lastName')?.touched
                "
                class="text-red-400 text-xs mt-1"
              >
                Sobrenome é obrigatório
              </div>
            </div>
          </div>

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
                registerForm.get('email')?.invalid &&
                registerForm.get('email')?.touched
              "
            />
            <div
              *ngIf="
                registerForm.get('email')?.invalid &&
                registerForm.get('email')?.touched
              "
              class="text-red-400 text-xs mt-1"
            >
              <span *ngIf="registerForm.get('email')?.errors?.['required']"
                >Email é obrigatório</span
              >
              <span *ngIf="registerForm.get('email')?.errors?.['email']"
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
                registerForm.get('password')?.invalid &&
                registerForm.get('password')?.touched
              "
            />
            <div
              *ngIf="
                registerForm.get('password')?.invalid &&
                registerForm.get('password')?.touched
              "
              class="text-red-400 text-xs mt-1"
            >
              <span *ngIf="registerForm.get('password')?.errors?.['required']"
                >Senha é obrigatória</span
              >
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']"
                >Mínimo 8 caracteres</span
              >
            </div>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-300 mb-1"
              >Confirmar Senha</label
            >
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              required
              class="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
              placeholder="••••••••"
              [class.invalid]="
                registerForm.get('confirmPassword')?.invalid &&
                registerForm.get('confirmPassword')?.touched
              "
            />
            <div
              *ngIf="
                registerForm.get('confirmPassword')?.invalid &&
                registerForm.get('confirmPassword')?.touched
              "
              class="text-red-400 text-xs mt-1"
            >
              <span
                *ngIf="registerForm.get('confirmPassword')?.errors?.['required']"
                >Confirmação é obrigatória</span
              >
              <span *ngIf="registerForm.hasError('passwordMismatch')"
                >As senhas não coincidem</span
              >
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              formControlName="terms"
              class="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-700 rounded bg-gray-800"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-300">
              Eu concordo com os
              <a
                href="#"
                class="text-yellow-400 hover:text-yellow-300 transition duration-300"
                >Termos de Serviço</a
              >
            </label>
          </div>
          <div
            *ngIf="
              registerForm.get('terms')?.invalid &&
              registerForm.get('terms')?.touched
            "
            class="text-red-400 text-xs mt-1"
          >
            Você deve aceitar os termos
          </div>

          <div class="pt-2">
            <button
              type="submit"
              [disabled]="!registerForm.valid"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-[1.02]"
            >
              Registrar
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Já tem uma conta?
            <a
              [routerLink]="['/login']"
              class="font-medium text-yellow-400 hover:text-yellow-300 transition duration-300"
              >Faça login</a
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
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;

      const userData = {
        nome: `${firstName} ${lastName}`,
        email,
        senha: password,
      };

      this.authservice.register(userData).subscribe({
        next: (user) => {
          console.log('Usuário registrado com sucesso:', user);
          this.router.navigate(['/dashboard']); // redireciona após sucesso
        },
        error: (err) => {
          alert(err.message || 'Erro ao registrar usuário');
          console.error('Erro no registro:', err);
        },
      });
    }
  }
}
