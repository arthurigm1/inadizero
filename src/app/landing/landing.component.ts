import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import AOS from 'aos';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div
      class="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden"
    >
      <!-- Seção unificada Nav + Hero -->
      <section
        class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden min-h-screen sm:h-[90vh]"
      >
        <!-- Efeito de gradiente de fundo -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-transparent to-blue-900/40"
        ></div>

        <!-- Partículas animadas de fundo -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            *ngFor="let particle of particles"
            class="absolute rounded-full bg-blue-200/20"
            [style.left]="particle.x + '%'"
            [style.top]="particle.y + '%'"
            [style.width]="particle.size + 'px'"
            [style.height]="particle.size + 'px'"
            [style.animation]="
              'float ' +
              particle.duration +
              's infinite ease-in-out ' +
              particle.delay +
              's'
            "
          ></div>
        </div>

        <!-- Barra de Navegação -->
        <nav class="relative z-30">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16 sm:h-20">
              <!-- Logo -->
              <div class="flex items-center gap-2">
                <span
                  class="text-white font-bold text-xl sm:text-2xl tracking-tight"
                >
                  Inadi<span class="text-blue-200">Zero</span>
                </span>
              </div>

              <!-- Botão do menu mobile -->
              <div class="md:hidden flex items-center">
                <button
                  (click)="toggleMenu()"
                  class="text-white hover:text-blue-200 focus:outline-none transition-colors duration-200 p-2"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="
                        isMenuOpen
                          ? 'M6 18L18 6M6 6l12 12'
                          : 'M4 6h16M4 12h16M4 18h16'
                      "
                    />
                  </svg>
                </button>
              </div>

              <!-- Menu Desktop -->
              <div class="hidden md:block">
                <div class="flex items-center space-x-8">
                  <a
                    (click)="scrollTo('features')"
                    class="text-white hover:text-blue-200 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Recursos
                  </a>
                  <a
                    (click)="scrollTo('solutions')"
                    class="text-white hover:text-blue-200 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Soluções
                  </a>
                  <a
                    (click)="scrollTo('pricing')"
                    class="text-white hover:text-blue-200 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Planos
                  </a>
                  <a
                    (click)="scrollTo('testimonials')"
                    class="text-white hover:text-blue-200 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Clientes
                  </a>
                  <a
                    (click)="scrollTo('faq')"
                    class="text-white hover:text-blue-200 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    FAQ
                  </a>
                  <a
                    (click)="scrollTo('contact')"
                    class="text-white hover:text-blue-200 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Contato
                  </a>
                </div>
              </div>

              <!-- Botões de ação -->
              <div class="hidden md:flex items-center gap-4">
                <a
                  routerLink="/login"
                  class="text-white font-medium hover:text-blue-200 transition-all duration-300 relative group"
                >
                  Entrar
                  <span
                    class="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                  ></span>
                </a>
                <a
                  routerLink="/tenant/login"
                  class="text-white font-medium hover:text-blue-200 transition-all duration-300 relative group"
                >
                  Portal do Inquilino
                  <span
                    class="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                  ></span>
                </a>
                <a
                  routerLink="/registro"
                  class="bg-gradient-to-r from-white to-blue-50 text-blue-700 font-bold py-3 px-8 rounded-lg hover:from-blue-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Começar
                </a>
              </div>
            </div>
          </div>

          <!-- Menu Mobile -->
          <div
            *ngIf="isMenuOpen"
            class="md:hidden bg-blue-900/95 backdrop-blur-sm px-4 pb-4 border-t border-blue-700/50 animate-slide-down"
          >
            <div class="flex flex-col space-y-4 py-4">
              <a
                (click)="scrollTo('features'); toggleMenu()"
                class="text-white hover:text-blue-200 transition font-medium cursor-pointer py-2 px-3 rounded-md hover:bg-blue-800/50"
              >
                Recursos
              </a>
              <a
                (click)="scrollTo('solutions'); toggleMenu()"
                class="text-white hover:text-blue-200 transition font-medium cursor-pointer py-2 px-3 rounded-md hover:bg-blue-800/50"
              >
                Soluções
              </a>
              <a
                (click)="scrollTo('pricing'); toggleMenu()"
                class="text-white hover:text-blue-200 transition font-medium cursor-pointer py-2 px-3 rounded-md hover:bg-blue-800/50"
              >
                Planos
              </a>
              <a
                (click)="scrollTo('testimonials'); toggleMenu()"
                class="text-white hover:text-blue-200 transition font-medium cursor-pointer py-2 px-3 rounded-md hover:bg-blue-800/50"
              >
                Clientes
              </a>
              <a
                (click)="scrollTo('faq'); toggleMenu()"
                class="text-white hover:text-blue-200 transition font-medium cursor-pointer py-2 px-3 rounded-md hover:bg-blue-800/50"
              >
                FAQ
              </a>
              <a
                (click)="scrollTo('contact'); toggleMenu()"
                class="text-white hover:text-blue-200 transition font-medium cursor-pointer py-2 px-3 rounded-md hover:bg-blue-800/50"
              >
                Contato
              </a>
              <div
                class="pt-4 border-t border-blue-700/50 flex flex-col space-y-3"
              >
                <a
                  routerLink="/login"
                  class="bg-transparent border border-white text-white font-medium py-3 px-6 rounded-md hover:bg-white hover:text-blue-700 transition text-center"
                >
                  Entrar
                </a>
                <a
                  routerLink="/tenant/login"
                  class="bg-transparent border border-blue-200 text-blue-200 font-medium py-3 px-6 rounded-md hover:bg-blue-200 hover:text-blue-900 transition text-center"
                >
                  Portal do Inquilino
                </a>
                <a
                  routerLink="/registro"
                  class="bg-white text-blue-700 font-bold py-3 px-6 rounded-md hover:bg-blue-50 transition text-center shadow-lg"
                >
                  Começar
                </a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Conteúdo Principal Hero -->
        <div
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-16 relative z-5"
        >
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center min-h-[calc(100vh-8rem)] sm:min-h-0"
          >
            <!-- Texto e CTA -->
            <div
              class="animate-fade-in-up text-center lg:text-left order-2 lg:order-1"
            >
              <h1
                class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight"
              >
                <span class="text-white">Sistema de gestão</span> para seu
                negócio
                <span
                  class="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-200"
                >
                  grátis por 30 dias
                </span>
              </h1>

              <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <p
                  class="flex items-center justify-center lg:justify-start text-base sm:text-lg md:text-xl text-white gap-2 sm:gap-3"
                >
                  <svg
                    class="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Imóveis ilimitados
                </p>
                <p
                  class="flex items-center justify-center lg:justify-start text-base sm:text-lg md:text-xl text-white gap-2 sm:gap-3"
                >
                  <svg
                    class="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Emissão de boletos
                </p>
                <p
                  class="flex items-center justify-center lg:justify-start text-base sm:text-lg md:text-xl text-white gap-2 sm:gap-3"
                >
                  <svg
                    class="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Controle de repasses
                </p>
              </div>

              <div
                class="flex flex-col items-center lg:items-start gap-3 sm:gap-4"
              >
                <a
                  routerLink="/register"
                  class="w-full sm:w-auto bg-white text-blue-700 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-md hover:bg-blue-50 transition text-center shadow-lg transform hover:scale-105 hover:shadow-blue-500/30 text-base sm:text-lg"
                >
                  Criar conta 100% gratuita
                </a>
                <p class="text-xs sm:text-sm text-blue-200">
                  *Não é necessário cartão de crédito
                </p>
              </div>
            </div>

            <div class="relative group order-1 lg:order-2">
              <!-- Container da imagem otimizado para mobile -->
              <div
                class="relative w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto lg:mx-0 lg:w-[110%] xl:w-[120%] transform lg:translate-x-4 xl:translate-x-8 transition duration-500 group-hover:scale-[1.02]"
              >
                <img
                  src="assets/landingpage/celular.png"
                  alt="Landing Page"
                  class="w-full h-auto rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador de scroll -->
        <div
          class="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-blue-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      <!-- Stats Section -->
      <section
        class="bg-gradient-to-r from-white to-blue-50 text-blue-700 py-8 sm:py-12 md:py-16 animate-fade-in"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 text-center"
          >
            <div
              class="p-3 sm:p-4 md:p-6 transform hover:scale-105 transition duration-300 bg-white/70 rounded-xl shadow-sm"
            >
              <div class="text-xl sm:text-2xl md:text-4xl font-bold">+95%</div>
              <div
                class="mt-1 md:mt-2 text-xs sm:text-sm md:text-base font-medium leading-tight"
              >
                Ocupação Média
              </div>
            </div>
            <div
              class="p-3 sm:p-4 md:p-6 transform hover:scale-105 transition duration-300 bg-white/70 rounded-xl shadow-sm"
            >
              <div class="text-xl sm:text-2xl md:text-4xl font-bold">
                R$ 500M+
              </div>
              <div
                class="mt-1 md:mt-2 text-xs sm:text-sm md:text-base font-medium leading-tight"
              >
                Em Contratos
              </div>
            </div>
            <div
              class="p-3 sm:p-4 md:p-6 transform hover:scale-105 transition duration-300 bg-white/70 rounded-xl shadow-sm"
            >
              <div class="text-xl sm:text-2xl md:text-4xl font-bold">1.2K+</div>
              <div
                class="mt-1 md:mt-2 text-xs sm:text-sm md:text-base font-medium leading-tight"
              >
                Lojas Gerenciadas
              </div>
            </div>
            <div
              class="p-3 sm:p-4 md:p-6 transform hover:scale-105 transition duration-300 bg-white/70 rounded-xl shadow-sm"
            >
              <div class="text-xl sm:text-2xl md:text-4xl font-bold">24/7</div>
              <div
                class="mt-1 md:mt-2 text-xs sm:text-sm md:text-base font-medium leading-tight"
              >
                Suporte Especializado
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section
        id="features"
        class="py-12 sm:py-16 md:py-24 bg-slate-900 overflow-hidden"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-10 sm:mb-16 md:mb-20" data-aos="fade-up">
            <div class="max-w-2xl mx-auto">
              <!-- Container adicional para melhor controle -->
              <h2
                class="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-200 mb-3 sm:mb-4 relative inline-block"
              >
                <span class="relative z-10">Recursos Exclusivos</span>
                <span
                  class="absolute -bottom-1 left-0 w-full h-1 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"
                ></span>
              </h2>
              <p
                class="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Tecnologia avançada para gestão inteligente de shopping
                centers<br class="hidden sm:block" />
                e centros comerciais
              </p>
            </div>
          </div>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
          >
            <!-- Feature 1 -->
            <div
              class="feature-card bg-gradient-to-br from-slate-800 to-slate-900 p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/10"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <div
                class="icon-container w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-blue-200 transform transition-transform duration-500 group-hover:rotate-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3
                class="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-blue-200 transition-colors duration-300"
              >
                Gestão de Contratos
              </h3>
              <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
                Controle completo de contratos com alertas inteligentes para
                vencimentos, reajustes automáticos e histórico de renovações.
              </p>
              <div class="mt-4 sm:mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-200 rounded-full"
                >
                  Automatizado
                </span>
              </div>
            </div>

            <!-- Feature 2 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-5 sm:p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/10"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div
                class="icon-container w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-blue-200 transform transition-transform duration-500 group-hover:rotate-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                class="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-blue-200 transition-colors duration-300"
              >
                Cobrança Automatizada
              </h3>
              <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
                Sistema completo de cobrança com emissão de boletos,
                notificações personalizadas e acompanhamento de pagamentos em
                tempo real.
              </p>
              <div class="mt-4 sm:mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-200 rounded-full"
                >
                  Integração bancária
                </span>
              </div>
            </div>

            <!-- Feature 3 - Integração PIX (nova) -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-5 sm:p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/10"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <div
                class="icon-container w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-blue-200 transform transition-transform duration-500 group-hover:rotate-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300"
              >
                Integração PIX
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Receba pagamentos instantâneos via PIX com geração automática de
                QR Codes e conciliação financeira integrada.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-200 rounded-full"
                >
                  Pagamentos instantâneos
                </span>
              </div>
            </div>

            <!-- Feature 4 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/10"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div
                class="icon-container w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-200 transform transition-transform duration-500 group-hover:rotate-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300"
              >
                Dashboard Analítico
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Painel com métricas em tempo real, gráficos interativos e
                relatórios personalizados para tomada de decisão estratégica.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-200 rounded-full"
                >
                  Business Intelligence
                </span>
              </div>
            </div>

            <!-- Feature 5 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/10"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <div
                class="icon-container w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-200 transform transition-transform duration-500 group-hover:rotate-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300"
              >
                Gestão de Inquilinos
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Portal completo para inquilinos com acesso a documentos,
                histórico de pagamentos e comunicação direta com a
                administração.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-200 rounded-full"
                >
                  Portal do cliente
                </span>
              </div>
            </div>

            <!-- Feature 6 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/10"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div
                class="icon-container w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-200 transform transition-transform duration-500 group-hover:rotate-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300"
              >
                Segurança Avançada
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Proteção de dados com criptografia de ponta, backup automático e
                conformidade com LGPD para máxima segurança das informações.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-200 rounded-full"
                >
                  LGPD Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Solutions Section - Redesigned -->
      <section
        id="solutions"
        class="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
      >
        <!-- Background Effects -->
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"
        ></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Header -->
          <div class="text-center mb-16" data-aos="fade-up">
            <span
              class="inline-block px-4 py-1.5 rounded-full bg-blue-400/10 text-blue-300 font-medium text-sm tracking-wider mb-6"
            >
              SOLUÇÕES COMPLETAS
            </span>
            <h2
              class="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white"
            >
              Transforme seu
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500"
              >
                negócio
              </span>
            </h2>
            <p class="text-lg md:text-xl text-gray-300  text-center px-4">
              Soluções personalizadas para cada tipo de empreendimento, desde
              pequenos comércios até grandes redes de shopping centers
            </p>
          </div>

          <!-- Solutions Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <!-- Solution 1 -->
            <div class="group relative" data-aos="fade-up" data-aos-delay="100">
              <div
                class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover:border-blue-400/30 group-hover:shadow-blue-400/10 group-hover:scale-[1.02]"
              ></div>
              <div class="relative p-8 md:p-10 h-full flex flex-col">
                <div
                  class="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform duration-500"
                >
                  <svg
                    class="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">
                  Shopping Centers
                </h3>
                <p class="text-gray-300 mb-6 leading-relaxed flex-grow">
                  Gestão completa para shopping centers com controle de lojas,
                  repasses, campanhas promocionais e análise de performance por
                  segmento.
                </p>
                <div class="mt-auto pt-4">
                  <a
                    href="#"
                    class="inline-flex items-center text-blue-400 font-medium group-hover:text-white transition-colors duration-300 relative"
                  >
                    Saiba mais
                    <svg
                      class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"
                    ></span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Solution 2 -->
            <div class="group relative" data-aos="fade-up" data-aos-delay="200">
              <div
                class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover:border-blue-400/30 group-hover:shadow-blue-400/10 group-hover:scale-[1.02]"
              ></div>
              <div class="relative p-8 md:p-10 h-full flex flex-col">
                <div
                  class="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform duration-500"
                >
                  <svg
                    class="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11"
                    />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">
                  Centros Comerciais
                </h3>
                <p class="text-gray-300 mb-6 leading-relaxed flex-grow">
                  Solução ideal para centros comerciais e galerias com gestão
                  simplificada de contratos, cobrança automatizada e relatórios
                  financeiros.
                </p>
                <div class="mt-auto pt-4">
                  <a
                    href="#"
                    class="inline-flex items-center text-blue-400 font-medium group-hover:text-white transition-colors duration-300 relative"
                  >
                    Saiba mais
                    <svg
                      class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"
                    ></span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Solution 3 -->
            <div class="group relative" data-aos="fade-up" data-aos-delay="300">
              <div
                class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover:border-blue-400/30 group-hover:shadow-blue-400/10 group-hover:scale-[1.02]"
              ></div>
              <div class="relative p-8 md:p-10 h-full flex flex-col">
                <div
                  class="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform duration-500"
                >
                  <svg
                    class="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">
                  Redes Empresariais
                </h3>
                <p class="text-gray-300 mb-6 leading-relaxed flex-grow">
                  Gestão centralizada para redes com múltiplas unidades,
                  dashboards consolidados e controle de performance por região
                  ou filial.
                </p>
                <div class="mt-auto pt-4">
                  <a
                    href="#"
                    class="inline-flex items-center text-blue-400 font-medium group-hover:text-white transition-colors duration-300 relative"
                  >
                    Saiba mais
                    <svg
                      class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"
                    ></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <!-- Pricing Section -->
      <section
        id="pricing"
        class="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-gray-900 to-black"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 sm:mb-20" data-aos="fade-up">
            <h2
              class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
            >
              Planos que se adaptam ao seu negócio
            </h2>
            <p class="text-lg sm:text-xl text-gray-300  ">
              Escolha o plano ideal para o tamanho do seu empreendimento. Todos
              incluem suporte técnico especializado.
            </p>
          </div>

          <div
            class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
          >
            <!-- Basic Plan -->
            <div
              class="bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-3 flex flex-col"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div class="p-8 flex-1">
                <div class="flex justify-between items-start mb-6">
                  <h3 class="text-xl font-bold text-blue-400">Básico</h3>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300"
                  >
                    Popular
                  </span>
                </div>

                <div class="mb-8">
                  <div class="flex items-baseline">
                    <span class="text-4xl font-bold text-white">R$ 97</span>
                    <span class="text-gray-400 ml-2">/mês</span>
                  </div>
                  <p class="text-sm text-gray-400 mt-2">
                    Ideal para pequenos comércios
                  </p>
                </div>

                <ul class="space-y-4 mb-8">
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300">Integrações customizadas</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300">Suporte 24/7</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300">Até 5 usuários</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300">Relatórios básicos</span>
                  </li>
                </ul>
              </div>

              <div class="p-8 pt-0">
                <a
                  href="/register"
                  class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 text-center block"
                >
                  Começar Agora
                </a>
              </div>
            </div>

            <!-- Professional Plan -->
            <div
              class="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border-2 border-blue-500 shadow-2xl shadow-blue-500/20 transform -translate-y-2 flex flex-col relative"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <div
                class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-600 text-white shadow-lg"
                >
                  Mais Popular
                </span>
              </div>

              <div class="p-8 flex-1 pt-12">
                <h3 class="text-xl font-bold text-white mb-6">Profissional</h3>

                <div class="mb-8">
                  <div class="flex items-baseline">
                    <span class="text-4xl font-bold text-white">R$ 197</span>
                    <span class="text-gray-400 ml-2">/mês</span>
                  </div>
                  <p class="text-sm text-gray-400 mt-2">
                    Perfeito para negócios em crescimento
                  </p>
                </div>

                <ul class="space-y-4 mb-8">
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-white"
                      >Todas as funcionalidades do Básico</span
                    >
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-white">Até 20 usuários</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-white">Relatórios avançados</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-white">API personalizada</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-white">Treinamento da equipe</span>
                  </li>
                </ul>
              </div>

              <div class="p-8 pt-0">
                <a
                  href="/register"
                  class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 text-center block"
                >
                  Experimente Grátis
                </a>
              </div>
            </div>

            <!-- Enterprise Plan -->
            <div
              class="bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-3 flex flex-col"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div class="p-8 flex-1">
                <h3 class="text-xl font-bold text-purple-400 mb-6">
                  Empresarial
                </h3>

                <div class="mb-8">
                  <div class="flex items-baseline">
                    <span class="text-4xl font-bold text-white">R$ 497</span>
                    <span class="text-gray-400 ml-2">/mês</span>
                  </div>
                  <p class="text-sm text-gray-400 mt-2">
                    Para grandes corporações
                  </p>
                </div>

                <ul class="space-y-4 mb-8">
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300"
                      >Todas as funcionalidades do Profissional</span
                    >
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300">Usuários ilimitados</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300">Suporte prioritário</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300">Consultoria especializada</span>
                  </li>
                  <li class="flex items-start">
                    <svg
                      class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-300"
                      >SLA 99.9% de disponibilidade</span
                    >
                  </li>
                </ul>
              </div>

              <div class="p-8 pt-0">
                <a
                  href="/contact"
                  class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 text-center block"
                >
                  Fale Conosco
                </a>
              </div>
            </div>
          </div>

          <div class="text-center mt-12">
            <p class="text-gray-400 text-sm">
              Todos os planos incluem atualizações gratuitas e 14 dias de
              garantia.
              <a
                href="#"
                class="text-blue-400 hover:text-blue-300 underline ml-1"
                >Ver termos completos</a
              >
            </p>
          </div>
        </div>
      </section>
      <!-- Testimonials Section -->
      <section
        id="testimonials"
        class="py-12 sm:py-16 md:py-24 bg-gray-900 animate-fade-in"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-10 sm:mb-16" data-aos="fade-up">
            <h2
              class="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-200 mb-3 sm:mb-4"
            >
              O que Nossos Clientes Dizem
            </h2>
            <p
              class="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed"
            >
              Centros comerciais que transformaram sua gestão com o InadiZero
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <!-- Testimonial 1 -->
            <div
              class="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-xl border border-slate-700 hover:border-blue-500 transition transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div class="flex items-center mb-4 sm:mb-6">
                <div class="flex -space-x-2">
                  <img
                    class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500"
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt=""
                  />
                </div>
                <div class="ml-3 sm:ml-4">
                  <h4 class="font-semibold text-white text-sm sm:text-base">
                    Carlos Mendes
                  </h4>
                  <p class="text-xs sm:text-sm text-gray-400">
                    Shopping Vale Sul
                  </p>
                </div>
              </div>
              <p
                class="text-gray-300 italic mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed"
              >
                "O InadiZero revolucionou nossa gestão de contratos. Reduzimos o
                tempo de administração em 60% e aumentamos nossa ocupação para
                98%."
              </p>
              <div class="flex text-blue-400 text-sm sm:text-base">★★★★★</div>
            </div>

            <!-- Testimonial 2 -->
            <div
              class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div class="flex items-center mb-6">
                <div class="flex -space-x-2">
                  <img
                    class="w-12 h-12 rounded-full border-2 border-blue-500"
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white">Ana Lúcia Santos</h4>
                  <p class="text-sm text-gray-400">Galeria Central</p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-6">
                "A cobrança automatizada foi um divisor de águas. Nunca mais
                tive problemas com pagamentos atrasados e a satisfação dos
                inquilinos melhorou muito."
              </p>
              <div class="flex text-blue-400">★★★★★</div>
            </div>

            <!-- Testimonial 3 -->
            <div
              class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div class="flex items-center mb-6">
                <div class="flex -space-x-2">
                  <img
                    class="w-12 h-12 rounded-full border-2 border-blue-500"
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white">Roberto Ferreira</h4>
                  <p class="text-sm text-gray-400">Outlet Premium</p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-6">
                "O dashboard analítico nos deu insights que aumentaram nosso
                faturamento em 35%. Agora tomamos decisões baseadas em dados
                reais."
              </p>
              <div class="flex text-blue-400">★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="py-16 md:py-24 bg-black">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="text-4xl font-bold text-blue-200 mb-4">
              Perguntas Frequentes
            </h2>
            <p class="text-xl text-gray-300">
              Tire suas dúvidas sobre o InadiZero
            </p>
          </div>

          <div class="space-y-6" data-aos="fade-up" data-aos-delay="100">
            <!-- FAQ Item 1 -->
            <div
              class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                (click)="toggleFaq(0)"
                class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors duration-200"
              >
                <span class="text-lg font-semibold text-white">
                  Como funciona o período de teste gratuito?
                </span>
                <svg
                  class="w-5 h-5 text-blue-400 transform transition-transform duration-200"
                  [class.rotate-180]="faqOpen[0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                class="px-6 pb-4 text-gray-300 leading-relaxed"
                [class.hidden]="!faqOpen[0]"
              >
                Você tem 30 dias para testar todas as funcionalidades do
                InadiZero sem qualquer custo. Não é necessário cartão de crédito
                para começar. Durante este período, você terá acesso completo ao
                sistema e suporte técnico.
              </div>
            </div>

            <!-- FAQ Item 2 -->
            <div
              class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                (click)="toggleFaq(1)"
                class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors duration-200"
              >
                <span class="text-lg font-semibold text-white">
                  É possível migrar dados de outros sistemas?
                </span>
                <svg
                  class="w-5 h-5 text-blue-400 transform transition-transform duration-200"
                  [class.rotate-180]="faqOpen[1]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                class="px-6 pb-4 text-gray-300 leading-relaxed"
                [class.hidden]="!faqOpen[1]"
              >
                Sim! Nossa equipe técnica oferece migração gratuita de dados de
                planilhas Excel, sistemas legados e outras plataformas. O
                processo é seguro e não interfere na operação do seu negócio.
              </div>
            </div>

            <!-- FAQ Item 3 -->
            <div
              class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                (click)="toggleFaq(2)"
                class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors duration-200"
              >
                <span class="text-lg font-semibold text-white">
                  O sistema funciona em dispositivos móveis?
                </span>
                <svg
                  class="w-5 h-5 text-blue-400 transform transition-transform duration-200"
                  [class.rotate-180]="faqOpen[2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                class="px-6 pb-4 text-gray-300 leading-relaxed"
                [class.hidden]="!faqOpen[2]"
              >
                Absolutamente! O InadiZero é totalmente responsivo e funciona
                perfeitamente em smartphones, tablets e computadores. Você pode
                gerenciar seu negócio de qualquer lugar.
              </div>
            </div>

            <!-- FAQ Item 4 -->
            <div
              class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                (click)="toggleFaq(3)"
                class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors duration-200"
              >
                <span class="text-lg font-semibold text-white">
                  Quais bancos são suportados para integração?
                </span>
                <svg
                  class="w-5 h-5 text-blue-400 transform transition-transform duration-200"
                  [class.rotate-180]="faqOpen[3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                class="px-6 pb-4 text-gray-300 leading-relaxed"
                [class.hidden]="!faqOpen[3]"
              >
                Trabalhamos com os principais bancos do Brasil: Banco do Brasil,
                Bradesco, Itaú, Santander, Caixa Econômica Federal, Sicoob,
                Sicredi e muitos outros. Também suportamos PIX para todos os
                bancos.
              </div>
            </div>

            <!-- FAQ Item 5 -->
            <div
              class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                (click)="toggleFaq(4)"
                class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors duration-200"
              >
                <span class="text-lg font-semibold text-white">
                  Como funciona o suporte técnico?
                </span>
                <svg
                  class="w-5 h-5 text-blue-400 transform transition-transform duration-200"
                  [class.rotate-180]="faqOpen[4]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                class="px-6 pb-4 text-gray-300 leading-relaxed"
                [class.hidden]="!faqOpen[4]"
              >
                Oferecemos suporte via chat, email e telefone. Clientes do plano
                Profissional têm suporte prioritário, e clientes Enterprise
                contam com suporte 24/7 com gerente de conta dedicado.
              </div>
            </div>

            <!-- FAQ Item 6 -->
            <div
              class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
            >
              <button
                (click)="toggleFaq(5)"
                class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-700 transition-colors duration-200"
              >
                <span class="text-lg font-semibold text-white">
                  Os dados ficam seguros na nuvem?
                </span>
                <svg
                  class="w-5 h-5 text-blue-400 transform transition-transform duration-200"
                  [class.rotate-180]="faqOpen[5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                class="px-6 pb-4 text-slate-300 leading-relaxed"
                [class.hidden]="!faqOpen[5]"
              >
                Sim! Utilizamos criptografia de ponta, backup automático diário
                e infraestrutura AWS com certificações de segurança
                internacionais. Somos 100% compatíveis com a LGPD.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="py-16 md:py-24 bg-gray-900 animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center"
          >
            <div>
              <h2 class="text-3xl font-bold text-blue-400 mb-6">
                Fale Conosco
              </h2>
              <p class="text-lg md:text-xl text-gray-300 mb-8">
                Pronto para transformar a gestão do seu shopping? Nossa equipe
                está aqui para ajudar.
              </p>
              <div class="space-y-4 md:space-y-6 mb-8 md:mb-10">
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 text-blue-500 mt-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-base md:text-lg font-medium text-white">
                      Email
                    </h3>
                    <p class="text-gray-400 text-sm md:text-base">
                      contatoinadizero.com.br
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 text-blue-500 mt-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-base md:text-lg font-medium text-white">
                      Telefone
                    </h3>
                    <p class="text-gray-400 text-sm md:text-base">
                      (11) 4004-4004
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 text-blue-500 mt-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-base md:text-lg font-medium text-white">
                      Escritório
                    </h3>
                    <p class="text-gray-400 text-sm md:text-base">
                      Av. Paulista, 1000 - São Paulo/SP
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex space-x-4">
                <a
                  href="#"
                  class="text-gray-400 hover:text-blue-500 transition"
                >
                  <span class="sr-only">Facebook</span>
                  <svg
                    class="h-5 w-5 md:h-6 md:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-blue-500 transition"
                >
                  <span class="sr-only">LinkedIn</span>
                  <svg
                    class="h-5 w-5 md:h-6 md:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-blue-500 transition"
                >
                  <span class="sr-only">Instagram</span>
                  <svg
                    class="h-5 w-5 md:h-6 md:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.917-.01-3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div
              class="bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-700"
            >
              <form class="space-y-4 md:space-y-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-300"
                    >Nome</label
                  >
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-300"
                    >Email</label
                  >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-300"
                    >Telefone</label
                  >
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    for="message"
                    class="block text-sm font-medium text-gray-300"
                    >Mensagem</label
                  >
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    class="w-full bg-blue-500 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-blue-600 transition shadow-lg transform hover:scale-[1.02] hover:shadow-blue-500/30"
                  >
                    Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer
        class="bg-gray-900 border-t border-gray-800 py-12 animate-fade-in"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-blue-400 mb-4">
                InadiZero
              </h3>
              <p class="text-gray-400 text-sm md:text-base">
                A plataforma de gestão mais completa para shoppings e centros
                comerciais.
              </p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Produto</h3>
              <ul class="space-y-2">
                <li>
                  <a
                    href="#features"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Recursos</a
                  >
                </li>
                <li>
                  <a
                    href="#solutions"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Soluções</a
                  >
                </li>
                <li>
                  <a
                    href="#pricing"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Planos</a
                  >
                </li>
                <li>
                  <a
                    href="#faq"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >FAQ</a
                  >
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Empresa</h3>
              <ul class="space-y-2">
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Sobre Nós</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Carreiras</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Blog</a
                  >
                </li>
                <li>
                  <a
                    href="#contact"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Contato</a
                  >
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul class="space-y-2">
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Termos de Uso</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Política de Privacidade</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-blue-400 transition text-sm md:text-base"
                    >Cookies</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div
            class="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
          >
            <p class="text-gray-400 text-xs md:text-sm">
              © 2023 InadiZero. Todos os direitos reservados.
            </p>
            <div class="mt-4 md:mt-0">
              <a
                href="#"
                class="text-gray-400 hover:text-blue-400 text-xs md:text-sm transition mr-4"
                >Termos</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-blue-400 text-xs md:text-sm transition mr-4"
                >Privacidade</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-blue-400 text-xs md:text-sm transition"
                >Cookies</a
              >
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Estilos CSS para animações -->
    <style>
      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 1s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fadeIn 1s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .perspective-1000 {
        perspective: 1000px;
      }

      .rotate-y-12 {
        transform: rotateY(12deg);
      }

      .-rotate-y-6 {
        transform: rotateY(-6deg);
      }

      .rotate-x-8 {
        transform: rotateX(8deg);
      }
    </style>
  `,
})
export class LandingComponent implements AfterViewInit {
  isMenuOpen = false;
  faqOpen: boolean[] = [false, false, false, false, false, false];
  particles = Array.from({ length: 15 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
  }));

  ngAfterViewInit(): void {
    this.initAOS();
  }

  private initAOS(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 100,
    });

    AOS.refresh();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleFaq(index: number) {
    this.faqOpen[index] = !this.faqOpen[index];
  }

  scrollTo(id: string) {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }
}
