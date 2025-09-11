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
      <section class="relative bg-black overflow-hidden h-[90vh]">
        <!-- Efeito de gradiente de fundo -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-black"
        ></div>

        <!-- Partículas animadas de fundo -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            *ngFor="let particle of particles"
            class="absolute rounded-full bg-yellow-400/20"
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
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
              <!-- Logo -->
              <div class="flex items-center gap-2">
                <span class="text-yellow-400 font-bold text-2xl tracking-tight">
                  Inadi<span class="text-white">Zero</span>
                </span>
              </div>

              <!-- Botão do menu mobile -->
              <div class="md:hidden flex items-center">
                <button
                  (click)="toggleMenu()"
                  class="text-gray-300 hover:text-yellow-400 focus:outline-none"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <!-- Menu Desktop -->
              <div class="hidden md:block">
                <div class="flex items-center space-x-8">
                  <a
                    (click)="scrollTo('features')"
                    class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Recursos
                  </a>
                  <a
                    (click)="scrollTo('solutions')"
                    class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Soluções
                  </a>
                  <a
                    (click)="scrollTo('pricing')"
                    class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Planos
                  </a>
                  <a
                    (click)="scrollTo('testimonials')"
                    class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Clientes
                  </a>
                  <a
                    (click)="scrollTo('contact')"
                    class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105 cursor-pointer"
                  >
                    Contato
                  </a>
                </div>
              </div>

              <!-- Botões de ação -->
              <div class="hidden md:flex items-center gap-4">
                <a
                  routerLink="/login"
                  class="text-yellow-400 font-medium hover:text-yellow-300 transition-all duration-300 relative group"
                >
                  Entrar
                  <span
                    class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"
                  ></span>
                </a>
                <a
                  routerLink="/tenant/login"
                  class="text-yellow-400 font-medium hover:text-yellow-400 transition-all duration-300 relative group"
                >
                  Portal do Inquilino
                  <span
                    class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"
                  ></span>
                </a>
                <a
                  routerLink="/register"
                  class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-8 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                >
                  Começar
                </a>
              </div>
            </div>
          </div>

          <!-- Menu Mobile -->
          <div
            *ngIf="isMenuOpen"
            class="md:hidden bg-gray-900 px-4 pb-4 border-t border-gray-800"
          >
            <div class="flex flex-col space-y-4 py-4">
              <a
                (click)="scrollTo('features'); toggleMenu()"
                class="text-gray-300 hover:text-yellow-400 transition font-medium cursor-pointer"
              >
                Recursos
              </a>
              <a
                (click)="scrollTo('solutions'); toggleMenu()"
                class="text-gray-300 hover:text-yellow-400 transition font-medium cursor-pointer"
              >
                Soluções
              </a>
              <a
                (click)="scrollTo('pricing'); toggleMenu()"
                class="text-gray-300 hover:text-yellow-400 transition font-medium cursor-pointer"
              >
                Planos
              </a>
              <a
                (click)="scrollTo('testimonials'); toggleMenu()"
                class="text-gray-300 hover:text-yellow-400 transition font-medium cursor-pointer"
              >
                Clientes
              </a>
              <a
                (click)="scrollTo('contact'); toggleMenu()"
                class="text-gray-300 hover:text-yellow-400 transition font-medium cursor-pointer"
              >
                Contato
              </a>
              <div
                class="pt-4 border-t border-gray-800 flex flex-col space-y-3"
              >
                <a
                  routerLink="/login"
                  class="bg-yellow-500 text-black font-medium py-2 px-6 rounded-md hover:bg-yellow-400 transition text-center shadow-lg transform hover:shadow-yellow-500/30"
                >
                  Portal do Inquilino
                </a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Conteúdo Principal Hero -->
        <div
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <!-- Texto e CTA -->
            <div class="animate-fade-in-up text-center lg:text-left">
              <h1
                class="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight"
              >
                <span class="text-yellow-400">Sistema de gestão</span> para seu
                negócio
                <span
                  class="block mt-2 text-3xl sm:text-4xl md:text-5xl text-yellow-400"
                >
                  grátis por 30 dias
                </span>
              </h1>

              <div class="space-y-4 mb-8">
                <p
                  class="flex items-center text-lg md:text-xl text-white gap-2"
                >
                  <svg
                    class="w-6 h-6 text-yellow-400"
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
                  class="flex items-center text-lg md:text-xl text-white gap-2"
                >
                  <svg
                    class="w-6 h-6 text-yellow-400"
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
                  class="flex items-center text-lg md:text-xl text-white gap-2"
                >
                  <svg
                    class="w-6 h-6 text-yellow-400"
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

              <div class="flex flex-col items-center lg:items-start gap-4">
                <a
                  routerLink="/register"
                  class="w-full sm:w-auto bg-yellow-500 text-black font-medium py-4 px-8 rounded-md hover:bg-yellow-400 transition text-center shadow-lg transform hover:scale-105 hover:shadow-yellow-500/30 text-lg"
                >
                  Criar conta 100% gratuita
                </a>
                <p class="text-sm text-gray-300">
                  *Não é necessário cartão de crédito
                </p>
              </div>
            </div>

            <div class="relative group">
              <!-- Container da imagem aumentada -->
              <div
                class="relative w-full max-w-2xl lg:max-w-none mx-auto lg:mx-0 lg:w-[110%] xl:w-[130%] transform lg:translate-x-8 xl:translate-x-16 transition duration-500 group-hover:scale-[1.02]"
              >
                <img
                  src="assets/landingpage/landingpage2.png"
                  alt="Landing Page"
                  class="w-full h-auto rounded-xl shadow-2xl "
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador de scroll -->
        <div
          class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20"
        >
          <svg
            class="w-6 h-6 text-yellow-400"
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
        class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-12 md:py-16 animate-fade-in"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center"
          >
            <div class="p-4 md:p-6 transform hover:scale-110 transition">
              <div class="text-2xl md:text-4xl font-bold">+95%</div>
              <div class="mt-1 md:mt-2 text-sm md:text-base font-medium">
                Ocupação Média
              </div>
            </div>
            <div class="p-4 md:p-6 transform hover:scale-110 transition">
              <div class="text-2xl md:text-4xl font-bold">R$ 500M+</div>
              <div class="mt-1 md:mt-2 text-sm md:text-base font-medium">
                Em Contratos
              </div>
            </div>
            <div class="p-4 md:p-6 transform hover:scale-110 transition">
              <div class="text-2xl md:text-4xl font-bold">1.2K+</div>
              <div class="mt-1 md:mt-2 text-sm md:text-base font-medium">
                Lojas Gerenciadas
              </div>
            </div>
            <div class="p-4 md:p-6 transform hover:scale-110 transition">
              <div class="text-2xl md:text-4xl font-bold">24/7</div>
              <div class="mt-1 md:mt-2 text-sm md:text-base font-medium">
                Suporte Especializado
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-16 md:py-24 bg-black overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 md:mb-20" data-aos="fade-up">
            <div class="max-w-2xl mx-auto">
              <!-- Container adicional para melhor controle -->
              <h2
                class="text-4xl font-bold text-yellow-400 mb-4 relative inline-block"
              >
                <span class="relative z-10">Recursos Exclusivos</span>
                <span
                  class="absolute -bottom-1 left-0 w-full h-1 bg-yellow-500 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"
                ></span>
              </h2>
              <p
                class="text-xl text-gray-300 leading-relaxed"
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
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            <!-- Feature 1 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <div
                class="icon-container w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400 transform transition-transform duration-500 group-hover:rotate-6"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300"
              >
                Gestão de Contratos
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Controle completo de contratos com alertas inteligentes para
                vencimentos, reajustes automáticos e histórico de renovações.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full"
                >
                  Automatizado
                </span>
              </div>
            </div>

            <!-- Feature 2 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div
                class="icon-container w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400 transform transition-transform duration-500 group-hover:rotate-6"
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300"
              >
                Cobrança Automatizada
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Sistema completo de cobrança com emissão de boletos,
                notificações personalizadas e acompanhamento de pagamentos em
                tempo real.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full"
                >
                  Integração bancária
                </span>
              </div>
            </div>

            <!-- Feature 3 - Integração PIX (nova) -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <div
                class="icon-container w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400 transform transition-transform duration-500 group-hover:rotate-6"
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300"
              >
                Integração PIX
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Receba pagamentos instantâneos via PIX com geração automática de
                QR Codes e conciliação financeira integrada.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full"
                >
                  Pagamentos instantâneos
                </span>
              </div>
            </div>

            <!-- Feature 4 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div
                class="icon-container w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400 transform transition-transform duration-500 group-hover:rotate-6"
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
                class="text-2xl font-semibold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300"
              >
                Dashboard Analítico
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Painel com métricas em tempo real, gráficos interativos e
                relatórios personalizados para tomada de decisão estratégica.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full"
                >
                  Business Intelligence
                </span>
              </div>
            </div>

            <!-- Feature 5 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <div
                class="icon-container w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400 transform transition-transform duration-500 group-hover:rotate-6"
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
                class="text-2xl font-semibold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300"
              >
                Portal do Lojista
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Plataforma self-service para lojistas com acesso a documentos
                financeiros, contratos e comunicação direta.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full"
                >
                  Autoatendimento
                </span>
              </div>
            </div>

            <!-- Feature 6 -->
            <div
              class="feature-card bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div
                class="icon-container w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400 transform transition-transform duration-500 group-hover:rotate-6"
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300"
              >
                Aplicativo Móvel
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Controle total na palma da sua mão com notificações push,
                alertas personalizados e acesso a todos os recursos.
              </p>
              <div class="mt-6">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full"
                >
                  iOS & Android
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- CTA Section -->
      <section
        class="relative py-10 md:py-15 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
      >
        <!-- Elementos decorativos de fundo -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="absolute top-1/4 -left-20 w-64 h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"
          ></div>
          <div
            class="absolute bottom-1/4 -right-20 w-72 h-72 bg-yellow-300 rounded-full opacity-10 blur-3xl"
          ></div>
        </div>

        <div class="relative max-w-4xl mx-auto px-6 sm:px-8">
          <div class="flex flex-col items-center text-center space-y-8">
            <!-- Título -->
            <div class="w-full" data-aos="fade-up">
              <h2
                class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
              >
                <span class="block"
                  >Pronto para Transformar
                  <span class=" text-yellow-900 mt-2 md:mt-3"
                    >seu Shopping Center?</span
                  ></span
                >
              </h2>
            </div>

            <!-- Descrição -->
            <div
              class="w-full max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <p class="text-lg md:text-xl text-black leading-relaxed">
                Comece sua jornada com o InadiZero hoje mesmo e experimente a
                revolução na gestão comercial.
              </p>
            </div>

            <!-- Botões -->
            <div
              class="w-full flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 pt-2"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <a
                routerLink="/register"
                class="w-full sm:w-auto flex justify-center items-center bg-black text-yellow-400 font-semibold py-3 px-8 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                Experimente Grátis
              </a>

              <a
                href="#demo"
                class="w-full sm:w-auto flex justify-center items-center bg-white text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                Agendar Demonstração
              </a>
            </div>

            <!-- Rodapé -->
            <div class="w-full pt-4" data-aos="fade-up" data-aos-delay="200">
              <div
                class="inline-flex items-center justify-center gap-2 text-yellow-900/80 font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Suporte dedicado para sua equipe</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Solutions Section - Redesigned -->
      <section
        id="solutions"
        class="py-20 md:py-32 bg-gray-900 relative overflow-hidden"
      >
        <!-- Efeito de background decorativo -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent"
            style="background-size: 80% 80%; background-position: -20% -20%;"
          ></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center mb-20">
            <span
              class="inline-block px-4 py-1.5 rounded-full bg-yellow-400/10 text-yellow-300 font-medium text-sm tracking-wider mb-6"
            >
              NOSSAS SOLUÇÕES
            </span>
            <h2
              class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Tecnologia Sob Medida para
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500"
                >Seu Negócio</span
              >
            </h2>
            <div class="max-w-2xl mx-auto">
              <p class="text-xl text-gray-300/80 leading-relaxed">
                Sistemas inteligentes adaptados para cada formato de shopping,
                com tecnologia de ponta e design intuitivo.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Card 1 - Shoppings Centers -->
            <div class="group perspective-1000">
              <div
                class="relative h-full transform transition-all duration-700 group-hover:rotate-y-12"
              >
                <div
                  class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover:border-yellow-400/30 group-hover:shadow-yellow-400/10"
                ></div>

                <div class="relative p-8 h-full flex flex-col">
                  <div
                    class="w-20 h-20 rounded-xl bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 flex items-center justify-center mb-8 text-yellow-400 group-hover:scale-110 transition-transform duration-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                      />
                    </svg>
                  </div>

                  <h3 class="text-2xl font-bold text-white mb-4 tracking-tight">
                    Shoppings Centers
                  </h3>

                  <p class="text-gray-300/80 mb-8 flex-grow leading-relaxed">
                    Gestão completa para grandes empreendimentos com múltiplas
                    torres, centenas de lojas e fluxos complexos.
                  </p>

                  <div class="mt-auto">
                    <a
                      href="#"
                      class="inline-flex items-center text-yellow-400 font-medium group-hover:text-white transition-colors duration-300"
                    >
                      <span class="relative">
                        <span
                          class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"
                        ></span>
                        Explorar solução
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 2 - Galerias Comerciais -->
            <div class="group perspective-1000">
              <div
                class="relative h-full transform transition-all duration-700 group-hover:-rotate-y-6"
              >
                <div
                  class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover:border-yellow-400/30 group-hover:shadow-yellow-400/10"
                ></div>

                <div class="relative p-8 h-full flex flex-col">
                  <div
                    class="w-20 h-20 rounded-xl bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 flex items-center justify-center mb-8 text-yellow-400 group-hover:scale-110 transition-transform duration-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                      />
                    </svg>
                  </div>

                  <h3 class="text-2xl font-bold text-white mb-4 tracking-tight">
                    Galerias Comerciais
                  </h3>

                  <p class="text-gray-300/80 mb-8 flex-grow leading-relaxed">
                    Solução ideal para galerias e pequenos centros com gestão
                    simplificada e relatórios inteligentes.
                  </p>

                  <div class="mt-auto">
                    <a
                      href="#"
                      class="inline-flex items-center text-yellow-400 font-medium group-hover:text-white transition-colors duration-300"
                    >
                      <span class="relative">
                        <span
                          class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"
                        ></span>
                        Explorar solução
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 3 - Outlets -->
            <div class="group perspective-1000">
              <div
                class="relative h-full transform transition-all duration-700 group-hover:rotate-x-8"
              >
                <div
                  class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover:border-yellow-400/30 group-hover:shadow-yellow-400/10"
                ></div>

                <div class="relative p-8 h-full flex flex-col">
                  <div
                    class="w-20 h-20 rounded-xl bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 flex items-center justify-center mb-8 text-yellow-400 group-hover:scale-110 transition-transform duration-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>

                  <h3 class="text-2xl font-bold text-white mb-4 tracking-tight">
                    Outlets
                  </h3>

                  <p class="text-gray-300/80 mb-8 flex-grow leading-relaxed">
                    Controle especializado para outlets com gestão de promoções,
                    temporadas e liquidações estratégicas.
                  </p>

                  <div class="mt-auto">
                    <a
                      href="#"
                      class="inline-flex items-center text-yellow-400 font-medium group-hover:text-white transition-colors duration-300"
                    >
                      <span class="relative">
                        <span
                          class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"
                        ></span>
                        Explorar solução
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section id="demo" class="py-16 md:py-24 bg-black animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center"
          >
            <div class="order-2 lg:order-1">
              <div class="relative group">
                <div
                  class="absolute -inset-2 bg-yellow-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"
                ></div>
                <div
                  class="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 transform group-hover:scale-[1.02] transition duration-500"
                >
                  <div
                    class="aspect-w-16 aspect-h-9 bg-gray-700 flex items-center justify-center"
                  >
                    <div class="text-center p-8">
                      <div class="text-yellow-500 text-5xl mb-4 animate-pulse">
                        ▶
                      </div>
                      <h3 class="text-xl font-semibold text-white">
                        Demonstração Interativa
                      </h3>
                      <p class="text-gray-400 mt-2">
                        Veja nossa plataforma em ação
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-1 lg:order-2">
              <h2 class="text-3xl font-bold text-yellow-400 mb-6">
                Veja o InadiZero em Ação
              </h2>
              <p class="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
                Agende uma demonstração personalizada e descubra como podemos
                transformar a gestão do seu centro comercial.
              </p>
              <ul class="space-y-3 md:space-y-4 mb-8 md:mb-10">
                <li class="flex items-start text-gray-300">
                  <svg
                    class="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span class="text-sm md:text-base"
                    >Demonstração ao vivo com um especialista</span
                  >
                </li>
                <li class="flex items-start text-gray-300">
                  <svg
                    class="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span class="text-sm md:text-base"
                    >Análise personalizada do seu cenário</span
                  >
                </li>
                <li class="flex items-start text-gray-300">
                  <svg
                    class="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span class="text-sm md:text-base"
                    >Proposta comercial sem compromisso</span
                  >
                </li>
              </ul>
              <a
                href="#contact"
                class="inline-block bg-yellow-500 text-black font-medium py-3 px-6 md:px-8 rounded-md hover:bg-yellow-400 transition shadow-lg transform hover:scale-105 hover:shadow-yellow-500/30"
              >
                Agendar Demonstração
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="py-16 md:py-24 bg-gray-900 animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">
              Planos Flexíveis
            </h2>
            <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Escolha o plano ideal para o tamanho do seu centro comercial
            </p>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          >
            <!-- Basic Plan -->
            <div
              class="bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2"
            >
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Básico</h3>
              <div
                class="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6"
              >
                R$ 499<span class="text-sm md:text-lg text-gray-400">/mês</span>
              </div>
              <p class="text-gray-400 mb-6 text-sm md:text-base">
                Ideal para galerias e pequenos centros
              </p>
              <ul class="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Até 20 lojas
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Gestão de contratos
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Cobrança básica
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Suporte por e-mail
                </li>
              </ul>
              <a
                routerLink="/register"
                class="block text-center bg-gray-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-gray-600 transition"
              >
                Começar Teste
              </a>
            </div>

            <!-- Professional Plan (Featured) -->
            <div
              class="bg-gray-800 p-6 md:p-8 rounded-xl border-2 border-yellow-500 shadow-xl relative transform hover:-translate-y-2"
            >
              <div
                class="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 md:px-3 md:py-1 transform translate-x-2 -translate-y-2 rounded"
              >
                MAIS POPULAR
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">
                Profissional
              </h3>
              <div
                class="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6"
              >
                R$ 1.299<span class="text-sm md:text-lg text-gray-400"
                  >/mês</span
                >
              </div>
              <p class="text-gray-400 mb-6 text-sm md:text-base">
                Para shoppings médios e redes
              </p>
              <ul class="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Até 100 lojas
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Gestão avançada
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Portal do lojista
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Analytics completo
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Suporte prioritário
                </li>
              </ul>
              <a
                routerLink="/register"
                class="block text-center bg-yellow-500 text-black font-medium py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-yellow-400 transition shadow-lg transform hover:scale-105 hover:shadow-yellow-500/30"
              >
                Começar Teste
              </a>
            </div>

            <!-- Enterprise Plan -->
            <div
              class="bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2"
            >
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">
                Empresarial
              </h3>
              <div
                class="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6"
              >
                Personalizado
              </div>
              <p class="text-gray-400 mb-6 text-sm md:text-base">
                Para grandes redes e shoppings
              </p>
              <ul class="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Lojas ilimitadas
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Multi-shoppings
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Integrações customizadas
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Treinamento dedicado
                </li>
                <li
                  class="flex items-center text-gray-300 text-sm md:text-base"
                >
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Suporte 24/7
                </li>
              </ul>
              <a
                href="#contact"
                class="block text-center bg-gray-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-gray-600 transition"
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section
        id="testimonials"
        class="py-16 md:py-24 bg-black animate-fade-in"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">
              O que Nossos Clientes Dizem
            </h2>
            <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Centros comerciais que transformaram sua gestão com o InadiZero
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <!-- Testimonial 1 -->
            <div
              class="bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition transform hover:-translate-y-2"
            >
              <div class="flex items-center mb-4 md:mb-6">
                <div class="flex -space-x-2">
                  <img
                    class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-yellow-500"
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white text-sm md:text-base">
                    Carlos Mendes
                  </h4>
                  <p class="text-xs md:text-sm text-gray-400">
                    Shopping Vale Sul
                  </p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-4 md:mb-6 text-sm md:text-base">
                "O InadiZero revolucionou nossa gestão de contratos. Reduzimos o
                tempo de administração em 60% e aumentamos nossa ocupação para
                98%."
              </p>
              <div class="flex text-yellow-400 text-sm md:text-base">★★★★★</div>
            </div>

            <!-- Testimonial 2 -->
            <div
              class="bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition transform hover:-translate-y-2"
            >
              <div class="flex items-center mb-4 md:mb-6">
                <div class="flex -space-x-2">
                  <img
                    class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-yellow-500"
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white text-sm md:text-base">
                    Ana Lúcia Santos
                  </h4>
                  <p class="text-xs md:text-sm text-gray-400">
                    Galeria Central
                  </p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-4 md:mb-6 text-sm md:text-base">
                "A cobrança automatizada foi um divisor de águas. Nunca mais
                tive problemas com pagamentos atrasados e a satisfação dos
                lojistas melhorou muito."
              </p>
              <div class="flex text-yellow-400 text-sm md:text-base">★★★★★</div>
            </div>

            <!-- Testimonial 3 -->
            <div
              class="bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition transform hover:-translate-y-2"
            >
              <div class="flex items-center mb-4 md:mb-6">
                <div class="flex -space-x-2">
                  <img
                    class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-yellow-500"
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white text-sm md:text-base">
                    Roberto Ferreira
                  </h4>
                  <p class="text-xs md:text-sm text-gray-400">Outlet Premium</p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-4 md:mb-6 text-sm md:text-base">
                "O dashboard analítico nos deu insights que aumentaram nosso
                faturamento em 35%. Agora tomamos decisões baseadas em dados
                reais."
              </p>
              <div class="flex text-yellow-400 text-sm md:text-base">★★★★★</div>
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
              <h2 class="text-3xl font-bold text-yellow-400 mb-6">
                Fale Conosco
              </h2>
              <p class="text-lg md:text-xl text-gray-300 mb-8">
                Pronto para transformar a gestão do seu shopping? Nossa equipe
                está aqui para ajudar.
              </p>
              <div class="space-y-4 md:space-y-6 mb-8 md:mb-10">
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 text-yellow-500 mt-1"
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
                    class="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 text-yellow-500 mt-1"
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
                    class="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 text-yellow-500 mt-1"
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
                  class="text-gray-400 hover:text-yellow-500 transition"
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
                  class="text-gray-400 hover:text-yellow-500 transition"
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
                  class="text-gray-400 hover:text-yellow-500 transition"
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
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 md:py-3 px-3 md:px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    class="w-full bg-yellow-500 text-black font-medium py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-yellow-400 transition shadow-lg transform hover:scale-[1.02] hover:shadow-yellow-500/30"
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
              <h3 class="text-lg font-semibold text-yellow-400 mb-4">
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
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Recursos</a
                  >
                </li>
                <li>
                  <a
                    href="#solutions"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Soluções</a
                  >
                </li>
                <li>
                  <a
                    href="#pricing"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Planos</a
                  >
                </li>
                <li>
                  <a
                    href="#demo"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Demonstração</a
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
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Sobre Nós</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Carreiras</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Blog</a
                  >
                </li>
                <li>
                  <a
                    href="#contact"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
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
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Termos de Uso</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
                    >Política de Privacidade</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-yellow-400 transition text-sm md:text-base"
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
                class="text-gray-400 hover:text-yellow-400 text-xs md:text-sm transition mr-4"
                >Termos</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-yellow-400 text-xs md:text-sm transition mr-4"
                >Privacidade</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-yellow-400 text-xs md:text-sm transition"
                >Cookies</a
              >
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent implements AfterViewInit {
  isMenuOpen = false;
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
      duration: 800, // Duração da animação em ms
      easing: 'ease-in-out', // Tipo de easing
      once: true, // Se as animações devem acontecer apenas uma vez
      offset: 100, // Distância em px do elemento ao bottom da viewport
      delay: 100, // Atraso entre as animações em ms
    });

    // Recarregar AOS quando o conteúdo for carregado dinamicamente
    AOS.refresh();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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
