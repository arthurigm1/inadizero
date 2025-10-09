import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';
import { AuthService, Empresa } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-300 relative overflow-hidden"
    >
      <!-- Enhanced Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 2000ms;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style="animation-delay: 4000ms;"></div>
        
        <!-- Animated Grid -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px; transform: perspective(500px) rotateX(60deg);"></div>
        </div>
      </div>

      <!-- Enhanced Floating Particles -->
      <div class="absolute inset-0">
        <div *ngFor="let particle of particles" 
             [style.left]="particle.left"
             [style.top]="particle.top"
             [style.animationDelay]="particle.delay"
             [style.animationDuration]="particle.duration"
             class="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-float-slow"></div>
      </div>

      <!-- Main Card -->
      <div
        @formAnimation
        class="w-full max-w-2xl px-8 py-12 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-700 hover:shadow-3xl hover:shadow-blue-500/30 relative z-10 mx-4"
      >
        <!-- Glow Effect -->
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        
        <!-- Header Section -->
        <div class="text-center mb-12 relative">
          <!-- Animated Logo Container -->
          <div class="flex justify-center mb-6" @logoAnimation>
            <div class="relative">
              <!-- Outer Glow -->
              <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <!-- Middle Glow -->
              <div class="absolute inset-0 bg-blue-400 rounded-2xl blur-lg opacity-30 animate-pulse" style="animation-delay: 1000ms;"></div>
            </div>
          </div>
          
          <!-- Text Content -->
          <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight" @textGlow>
            Comece Sua Jornada
          </h2>
          <p class="text-gray-600 text-lg font-light" @textAnimation>
            Cadastre-se e desbloqueie todo o potencial da nossa plataforma
          </p>
        </div>

        <!-- Enhanced Progress Steps -->
          <div class="mb-10" @progressAnimation>
            <div class="flex items-center justify-between">
              <div *ngFor="let step of steps; let i = index" class="flex items-center">
                <!-- Step Circle -->
                <div class="flex flex-col items-center">
                  <div 
                    [class]="getStepClass(i)" 
                    class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 cursor-pointer relative group"
                    (click)="goToStep(i + 1)"
                  >
                    <!-- Step Number (hidden when completed) -->
                    <span *ngIf="currentStep <= i + 1" class="text-sm font-bold z-20 relative">{{ i + 1 }}</span>
                    
                    <!-- Success Check (replaces number when completed) -->
                    <svg 
                      *ngIf="currentStep > i + 1" 
                      class="w-5 h-5 text-white z-20 relative" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>

                    <!-- Hover Tooltip -->
                    <div class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-30">
                      <div class="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap">
                        {{ step }}
                      </div>
                      <div class="w-2 h-2 bg-gray-900 rotate-45 absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  <span class="text-xs mt-2 text-gray-500 font-medium hidden sm:block transition-colors duration-300" 
                        [class.text-blue-600]="currentStep === i + 1"
                        [class.font-semibold]="currentStep === i + 1">
                    {{ step }}
                  </span>
                </div>
                
                <!-- Connection Line -->
                <div 
                  *ngIf="i < steps.length - 1" 
                  [class]="currentStep > i + 1 ? 'bg-gradient-to-r from-blue-400 to-indigo-200' : 'bg-gray-300'"
                  class="w-24 h-2 mx-4 rounded-full transition-all duration-500 transform hover:scale-y-125"
                ></div>
              </div>
            </div>
          </div>

        <!-- Form Container -->
        <form
          class="space-y-8"
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
        >
          <!-- Step 1: Personal Info -->
          <div @stepTransition *ngIf="currentStep === 1" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3" @staggerItem>
                <label class="flex items-center text-sm font-semibold text-gray-700">
                  <span>Nome</span>
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div class="relative group">
                  <input
                    type="text"
                    formControlName="firstName"
                    placeholder="Seu nome"
                    class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300 shadow-sm"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 transition-transform duration-300 transform scale-0 group-hover:scale-100">
                    <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div *ngIf="showFieldError('firstName')" class="text-red-500 text-xs font-medium animate-fadeIn">
                  Nome é obrigatório
                </div>
              </div>

              <div class="space-y-3" @staggerItem>
                <label class="flex items-center text-sm font-semibold text-gray-700">
                  <span>Sobrenome</span>
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div class="relative group">
                  <input
                    type="text"
                    formControlName="lastName"
                    placeholder="Seu sobrenome"
                    class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300 shadow-sm"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 transition-transform duration-300 transform scale-0 group-hover:scale-100">
                    <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div *ngIf="showFieldError('lastName')" class="text-red-500 text-xs font-medium animate-fadeIn">
                  Sobrenome é obrigatório
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Contact Info -->
          <div @stepTransition *ngIf="currentStep === 2" class="space-y-6">
            <div class="space-y-3" @staggerItem>
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <span>Email</span>
                <span class="text-red-500 ml-1">*</span>
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
                  class="w-full pl-10 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300 shadow-sm"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg *ngIf="registerForm.get('email')?.valid" class="h-5 w-5 text-green-500 animate-bounceIn" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div *ngIf="showFieldError('email')" class="text-red-500 text-xs font-medium animate-fadeIn">
                <span *ngIf="registerForm.get('email')?.errors?.['required']">Email é obrigatório</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Email inválido</span>
              </div>
            </div>

            <div class="space-y-3" @staggerItem>
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <span>Empresa</span>
                <span class="text-red-500 ml-1">*</span>
              </label>
              <div class="relative group">
                <select
                  formControlName="empresa"
                  class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Selecione uma empresa</option>
                  <option *ngFor="let empresa of empresas" [value]="empresa.id">
                    {{ empresa.nome }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 transition-transform duration-300 group-focus-within:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
              <div *ngIf="loadingEmpresas" class="text-blue-500 text-xs font-medium flex items-center animate-pulse">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando empresas...
              </div>
              <div *ngIf="showFieldError('empresa')" class="text-red-500 text-xs font-medium animate-fadeIn">
                Empresa é obrigatória
              </div>
            </div>
          </div>

          <!-- Step 3: Security -->
          <div @stepTransition *ngIf="currentStep === 3" class="space-y-6">
            <div class="space-y-3" @staggerItem>
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <span>Senha</span>
                <span class="text-red-500 ml-1">*</span>
              </label>
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
                  class="w-full pl-10 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300 shadow-sm"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    <path *ngIf="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              
              <!-- Enhanced Password Strength Meter -->
              <div *ngIf="registerForm.get('password')?.value" class="mt-4 space-y-2">
                <div class="flex justify-between text-xs font-medium text-gray-500">
                  <span>Força da senha:</span>
                  <span [class]="getPasswordStrengthTextClass()">{{ getPasswordStrengthText() }}</span>
                </div>
                <div class="flex space-x-1">
                  <div *ngFor="let segment of [1,2,3,4]" 
                       [class]="getPasswordStrengthClass(segment)"
                       class="h-2 flex-1 rounded-full transition-all duration-500 transform hover:scale-y-125">
                  </div>
                </div>
                <ul class="text-xs text-gray-500 space-y-1 mt-2">
                  <li [class]="getPasswordRequirementClass('length')" class="flex items-center transition-all duration-300">
                    <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path *ngIf="isPasswordRequirementMet('length')" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      <circle *ngIf="!isPasswordRequirementMet('length')" cx="10" cy="10" r="1.5"/>
                    </svg>
                    Mínimo 8 caracteres
                  </li>
                  <li [class]="getPasswordRequirementClass('complexity')" class="flex items-center transition-all duration-300">
                    <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path *ngIf="isPasswordRequirementMet('complexity')" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      <circle *ngIf="!isPasswordRequirementMet('complexity')" cx="10" cy="10" r="1.5"/>
                    </svg>
                    Letras maiúsculas, minúsculas e números
                  </li>
                </ul>
              </div>
              
              <div *ngIf="showFieldError('password')" class="text-red-500 text-xs font-medium animate-fadeIn">
                <span *ngIf="registerForm.get('password')?.errors?.['required']">Senha é obrigatória</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Mínimo 8 caracteres</span>
              </div>
            </div>

            <div class="space-y-3" @staggerItem>
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <span>Confirmar Senha</span>
                <span class="text-red-500 ml-1">*</span>
              </label>
              <div class="relative group">
                <input
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  placeholder="••••••••"
                  class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300 shadow-sm"
                />
                <button
                  type="button"
                  (click)="toggleConfirmPasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path *ngIf="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path *ngIf="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    <path *ngIf="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              <div *ngIf="showFieldError('confirmPassword')" class="text-red-500 text-xs font-medium animate-fadeIn">
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Confirmação é obrigatória</span>
                <span *ngIf="registerForm.hasError('passwordMismatch')">As senhas não coincidem</span>
              </div>
            </div>
          </div>

          <!-- Step 4: Terms & Submit -->
          <div @stepTransition *ngIf="currentStep === 4" class="space-y-6">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 transition-all duration-500 hover:shadow-lg hover:border-blue-300" @staggerItem>
              <div class="flex items-start space-x-4">
                <div class="relative">
                  <input
                    id="terms"
                    type="checkbox"
                    formControlName="terms"
                    class="w-6 h-6 text-blue-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all duration-300 cursor-pointer"
                  />
                </div>
                <div class="flex-1">
                  <label for="terms" class="block text-sm font-semibold text-gray-800 cursor-pointer select-none">
                    Aceito os Termos de Serviço e Política de Privacidade
                  </label>
                  <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                    Ao criar uma conta, você concorda com nossos 
                    <a href="#" class="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 underline">Termos de Serviço</a>, 
                    <a href="#" class="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 underline">Política de Privacidade</a> 
                    e <a href="#" class="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 underline">Política de Cookies</a>.
                  </p>
                </div>
              </div>
              <div *ngIf="showFieldError('terms')" class="text-red-500 text-xs font-medium mt-3 animate-fadeIn flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                Você deve aceitar os termos para continuar
              </div>
            </div>

            <!-- Enhanced Submit Button -->
            <div class="pt-4" @staggerItem>
              <button
                type="submit"
                [disabled]="!registerForm.valid || isLoading"
                class="w-full flex justify-center items-center py-5 px-6 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
              >
                <!-- Button Shine Effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <!-- Loading/Content -->
                <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="relative">{{ isLoading ? 'Criando conta...' : 'Criar Minha Conta' }}</span>
                <svg *ngIf="!isLoading" class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between pt-6 border-t border-gray-200">
            <button
              *ngIf="currentStep > 1"
              type="button"
              (click)="previousStep()"
              class="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-semibold flex items-center group cursor-pointer"
            >
              <svg class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span>Voltar</span>
            </button>
            
            <!-- Placeholder for alignment when no back button -->
            <div *ngIf="currentStep === 1"></div>
            
            <button
              type="button"
              (click)="nextStep()"
              *ngIf="currentStep < 4"
              class="px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-300 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-semibold flex items-center group shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Continuar</span>
              <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </form>

        <!-- Enhanced Login Link -->
        <div class="mt-12 text-center border-t border-gray-200 pt-8" @fadeIn>
          <p class="text-gray-600 font-medium">
            Já tem uma conta?
            <a
              [routerLink]="['/login']"
              class="font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 ml-1 relative group"
            >
              Fazer Login
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate('800ms cubic-bezier(0.35, 0, 0.25, 1)', 
                style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ]),
    trigger('logoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0) rotate(-180deg)' }),
        animate('800ms 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
                style({ opacity: 1, transform: 'scale(1) rotate(0deg)' }))
      ])
    ]),
    trigger('textGlow', [
      transition(':enter', [
        style({ opacity: 0, backgroundSize: '0% 100%' }),
        animate('1000ms 500ms ease-out', 
                style({ opacity: 1, backgroundSize: '100% 100%' }))
      ])
    ]),
    trigger('textAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms 700ms cubic-bezier(0.35, 0, 0.25, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('progressAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms 900ms cubic-bezier(0.35, 0, 0.25, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('stepTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('500ms 200ms cubic-bezier(0.35, 0, 0.25, 1)', 
                style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', 
                style({ opacity: 0, transform: 'translateX(-40px)' }))
      ])
    ]),
    trigger('staggerItem', [
      transition(':enter', [
        query('*', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', 
                    style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 1200ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  styles: [`
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes bounceIn {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    @keyframes tilt {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(0.5deg); }
      75% { transform: rotate(-0.5deg); }
    }
    .animate-float-slow {
      animation: float-slow 6s ease-in-out infinite;
    }
    .animate-bounceIn {
      animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    .animate-tilt {
      animation: tilt 10s ease-in-out infinite;
    }
    .animate-pulse-slow {
      animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  empresas: Empresa[] = [];
  loadingEmpresas = false;
  isLoading = false;
  currentStep = 1;
  steps = ['Informações Pessoais', 'Contato', 'Segurança', 'Confirmação'];
  
  showPassword = false;
  showConfirmPassword = false;
  
  particles = Array.from({ length: 15 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${15 + Math.random() * 10}s`
  }));

  private formSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit() {
    this.loadEmpresas();
    this.setupFormValidation();
  }

  ngOnDestroy() {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
        confirmPassword: ['', Validators.required],
        empresa: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  setupFormValidation() {
    // Removed auto-advance functionality to prevent unwanted step changes while typing
    this.formSub = this.registerForm.statusChanges.subscribe(() => {
      // Just observe form changes without auto-advancing
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    
    const errors: ValidationErrors = {};
    
    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumbers) errors['missingNumbers'] = true;
    
    return Object.keys(errors).length ? errors : null;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  loadEmpresas() {
    this.loadingEmpresas = true;
    this.authService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.loadingEmpresas = false;
      },
      error: (err) => {
        console.error('Erro ao carregar empresas:', err);
        this.loadingEmpresas = false;
      },
    });
  }

  // Step Management
  nextStep() {
    if (this.currentStep < 4 && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    // Allow navigation to any step from 1 to 4
    if (step >= 1 && step <= 4) {
      this.currentStep = step;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.registerForm.get('firstName')?.valid && 
               !!this.registerForm.get('lastName')?.valid;
      case 2:
        return !!this.registerForm.get('email')?.valid && 
               !!this.registerForm.get('empresa')?.valid;
      case 3:
        return !!(this.registerForm.get('password')?.valid && 
               this.registerForm.get('confirmPassword')?.valid) &&
               !this.registerForm.hasError('passwordMismatch');
      case 4:
        return this.registerForm.get('terms')?.valid ?? false;
      default:
        return false;
    }
  }
  getStepClass(stepIndex: number): string {
    if (this.currentStep > stepIndex + 1) {
      return 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg';
    } else if (this.currentStep === stepIndex + 1) {
      return 'bg-gradient-to-br from-blue-500 to-indigo-300 text-white shadow-lg ring-4 ring-blue-200';
    } else {
      return 'bg-gray-200 text-gray-500';
    }
  }

  // Password Strength
  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 4);
  }

  getPasswordStrengthClass(segment: number): string {
    const strength = this.getPasswordStrength();
    if (segment <= strength) {
      switch (strength) {
        case 1: return 'bg-red-500';
        case 2: return 'bg-orange-500';
        case 3: return 'bg-yellow-500';
        case 4: return 'bg-green-500';
        default: return 'bg-gray-300';
      }
    }
    return 'bg-gray-200';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'Muito fraca';
      case 1: return 'Fraca';
      case 2: return 'Moderada';
      case 3: return 'Forte';
      case 4: return 'Muito forte';
      default: return '';
    }
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'text-red-500';
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-green-500';
      default: return 'text-gray-500';
    }
  }

  isPasswordRequirementMet(type: 'length' | 'complexity'): boolean {
    const password = this.registerForm.get('password')?.value;
    if (!password) return false;

    switch (type) {
      case 'length':
        return password.length >= 8;
      case 'complexity':
        return /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
      default:
        return false;
    }
  }

  getPasswordRequirementClass(type: 'length' | 'complexity'): string {
    const isMet = this.isPasswordRequirementMet(type);
    return isMet ? 'text-green-600' : 'text-gray-500';
  }

  // UI Helpers
  showFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { firstName, lastName, email, password, empresa } = this.registerForm.value;

      const userData = {
        nome: `${firstName} ${lastName}`,
        email,
        senha: password,
        empresaId: empresa,
      };

      this.authService.register(userData).subscribe({
        next: (user) => {
          this.isLoading = false;
          console.log('Usuário registrado com sucesso:', user);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          alert(err.message || 'Erro ao registrar usuário');
          console.error('Erro no registro:', err);
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}