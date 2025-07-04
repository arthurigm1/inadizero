import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-900 text-white font-sans">
      <!-- Navigation -->
      <nav class="bg-black shadow-lg sticky top-0 z-50 border-b border-yellow-500/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 font-bold text-2xl tracking-tight">Inadi<span class="text-white">Zero</span></span>
            </div>
            <div class="hidden md:block">
              <div class="flex items-center space-x-8">
                <a href="#features" class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105">Recursos</a>
                <a href="#solutions" class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105">Soluções</a>
                <a href="#pricing" class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105">Planos</a>
                <a href="#testimonials" class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105">Clientes</a>
                <a href="#contact" class="text-gray-300 hover:text-yellow-400 transition font-medium hover:scale-105">Contato</a>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <a
                routerLink="/login"
                class="text-yellow-400 font-medium hover:text-yellow-300 transition hover:scale-105"
              >
                Entrar
              </a>
              <a
                routerLink="/register"
                class="bg-yellow-500 text-black font-medium py-2 px-6 rounded-md hover:bg-yellow-400 transition hover:scale-105 shadow-lg transform hover:shadow-yellow-500/30"
              >
                Começar
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-black via-gray-900 to-yellow-900 overflow-hidden">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 animate-fade-in">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="animate-slide-in-left">
              <h1 class="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                <span class="text-yellow-400">Gestão Poderosa</span> para Seu Shopping
              </h1>
              <p class="text-xl text-gray-300 mb-10 max-w-lg">
                Controle total sobre locações, contratos e finanças dos seus espaços comerciais com nossa plataforma inteligente.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a
                  routerLink="/register"
                  class="bg-yellow-500 text-black font-medium py-4 px-8 rounded-md hover:bg-yellow-400 transition text-center shadow-lg transform hover:scale-105 hover:shadow-yellow-500/30 animate-pulse"
                >
                  Experimente Grátis
                </a>
                <a
                  href="#demo"
                  class="border-2 border-yellow-500 text-yellow-400 font-medium py-4 px-8 rounded-md hover:bg-yellow-500/10 transition text-center transform hover:scale-105"
                >
                  Ver Demonstração
                </a>
              </div>
              <div class="mt-8 flex items-center animate-fade-in">
                <div class="flex -space-x-2">
                  <img class="w-10 h-10 rounded-full border-2 border-yellow-500" src="https://randomuser.me/api/portraits/women/12.jpg" alt="">
                  <img class="w-10 h-10 rounded-full border-2 border-yellow-500" src="https://randomuser.me/api/portraits/men/32.jpg" alt="">
                  <img class="w-10 h-10 rounded-full border-2 border-yellow-500" src="https://randomuser.me/api/portraits/women/45.jpg" alt="">
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-300">Confiança de mais de <span class="font-medium text-yellow-400">500 gestores</span></p>
                  <div class="flex mt-1 text-yellow-400">
                    ★★★★★ <span class="text-gray-400 ml-2">5.0/5.0</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="animate-slide-in-right">
              <div class="relative">
                <div class="absolute -inset-2 bg-yellow-500 rounded-xl blur opacity-75 animate-pulse"></div>
                <div class="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                       alt="Dashboard InadiZero" class="w-full h-auto">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-16 animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div class="p-6 transform hover:scale-110 transition">
              <div class="text-4xl font-bold">+95%</div>
              <div class="mt-2 font-medium">Ocupação Média</div>
            </div>
            <div class="p-6 transform hover:scale-110 transition">
              <div class="text-4xl font-bold">R$ 500M+</div>
              <div class="mt-2 font-medium">Em Contratos</div>
            </div>
            <div class="p-6 transform hover:scale-110 transition">
              <div class="text-4xl font-bold">1.2K+</div>
              <div class="mt-2 font-medium">Lojas Gerenciadas</div>
            </div>
            <div class="p-6 transform hover:scale-110 transition">
              <div class="text-4xl font-bold">24/7</div>
              <div class="mt-2 font-medium">Suporte Especializado</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-24 bg-gray-900 animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Recursos Exclusivos</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Tudo que você precisa para administrar seu shopping ou centro comercial com eficiência
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-14 h-14 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Gestão de Contratos</h3>
              <p class="text-gray-300">
                Crie, renove e gerencie contratos de locação com alertas automáticos para vencimentos e reajustes.
              </p>
            </div>
            
            <!-- Feature 2 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-14 h-14 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Cobrança Automatizada</h3>
              <p class="text-gray-300">
                Emissão de boletos, notificações e acompanhamento de pagamentos com integração bancária.
              </p>
            </div>
            
            <!-- Feature 3 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-14 h-14 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Dashboard Analítico</h3>
              <p class="text-gray-300">
                Visualização em tempo real de ocupação, faturamento e performance de lojas.
              </p>
            </div>
            
            <!-- Feature 4 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-14 h-14 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Mapa de Ocupação</h3>
              <p class="text-gray-300">
                Visualização gráfica da disposição das lojas com filtros por segmento, tamanho e valor.
              </p>
            </div>
            
            <!-- Feature 5 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-14 h-14 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Portal do Lojista</h3>
              <p class="text-gray-300">
                Área exclusiva para lojistas acessarem contratos, boletos e comunicados.
              </p>
            </div>
            
            <!-- Feature 6 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-14 h-14 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Aplicativo Móvel</h3>
              <p class="text-gray-300">
                Acompanhe seu shopping de qualquer lugar com notificações em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Solutions Section -->
      <section id="solutions" class="py-24 bg-black animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Soluções para Cada Necessidade</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Adaptamos nossa plataforma para diferentes tipos de centros comerciais
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 mx-auto text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4 text-center">Shoppings Centers</h3>
              <p class="text-gray-300 text-center">
                Gestão completa para grandes shoppings com múltiplas torres e centenas de lojas.
              </p>
            </div>
            
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 mx-auto text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4 text-center">Galeria Comerciais</h3>
              <p class="text-gray-300 text-center">
                Solução ideal para galerias e pequenos centros com gestão simplificada.
              </p>
            </div>
            
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 mx-auto text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4 text-center">Outlets</h3>
              <p class="text-gray-300 text-center">
                Controle especializado para outlets com gestão de promoções e temporadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section id="demo" class="py-24 bg-gray-900 animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="order-2 lg:order-1 animate-slide-in-left">
              <div class="relative">
                <div class="absolute -inset-2 bg-yellow-500 rounded-xl blur opacity-75 animate-pulse"></div>
                <div class="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                  <div class="aspect-w-16 aspect-h-9 bg-gray-700 flex items-center justify-center">
                    <div class="text-center p-8">
                      <div class="text-yellow-500 text-5xl mb-4 animate-pulse">▶</div>
                      <h3 class="text-xl font-semibold text-white">Demonstração Interativa</h3>
                      <p class="text-gray-400 mt-2">Veja nossa plataforma em ação</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-1 lg:order-2 animate-slide-in-right">
              <h2 class="text-3xl font-bold text-yellow-400 mb-6">Veja o InadiZero em Ação</h2>
              <p class="text-xl text-gray-300 mb-8">
                Agende uma demonstração personalizada e descubra como podemos transformar a gestão do seu centro comercial.
              </p>
              <ul class="space-y-4 mb-10">
                <li class="flex items-start text-gray-300">
                  <svg class="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Demonstração ao vivo com um especialista</span>
                </li>
                <li class="flex items-start text-gray-300">
                  <svg class="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Análise personalizada do seu cenário</span>
                </li>
                <li class="flex items-start text-gray-300">
                  <svg class="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Proposta comercial sem compromisso</span>
                </li>
              </ul>
              <a
                href="#contact"
                class="inline-block bg-yellow-500 text-black font-medium py-3 px-8 rounded-md hover:bg-yellow-400 transition shadow-lg transform hover:scale-105 hover:shadow-yellow-500/30"
              >
                Agendar Demonstração
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="py-24 bg-black animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Planos Flexíveis</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Escolha o plano ideal para o tamanho do seu centro comercial
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <!-- Basic Plan -->
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Básico</h3>
              <div class="text-4xl font-bold text-white mb-6">R$ 499<span class="text-lg text-gray-400">/mês</span></div>
              <p class="text-gray-400 mb-6">Ideal para galerias e pequenos centros</p>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Até 20 lojas
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Gestão de contratos
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Cobrança básica
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte por e-mail
                </li>
              </ul>
              <a
                routerLink="/register"
                class="block text-center bg-gray-800 text-white font-medium py-3 px-6 rounded-md hover:bg-gray-700 transition"
              >
                Começar Teste
              </a>
            </div>
            
            <!-- Professional Plan (Featured) -->
            <div class="bg-gray-900 p-8 rounded-xl border-2 border-yellow-500 shadow-xl relative transform hover:-translate-y-2">
              <div class="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-semibold px-3 py-1 transform translate-x-2 -translate-y-2 rounded">
                MAIS POPULAR
              </div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Profissional</h3>
              <div class="text-4xl font-bold text-white mb-6">R$ 1.299<span class="text-lg text-gray-400">/mês</span></div>
              <p class="text-gray-400 mb-6">Para shoppings médios e redes</p>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Até 100 lojas
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Gestão avançada
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Portal do lojista
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Analytics completo
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte prioritário
                </li>
              </ul>
              <a
                routerLink="/register"
                class="block text-center bg-yellow-500 text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-400 transition shadow-lg transform hover:scale-105 hover:shadow-yellow-500/30"
              >
                Começar Teste
              </a>
            </div>
            
                       <!-- Enterprise Plan -->
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition transform hover:-translate-y-2">
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Empresarial</h3>
              <div class="text-4xl font-bold text-white mb-6">Personalizado</div>
              <p class="text-gray-400 mb-6">Para grandes redes e shoppings</p>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Lojas ilimitadas
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Multi-shoppings
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Integrações customizadas
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Treinamento dedicado
                </li>
                <li class="flex items-center text-gray-300">
                  <svg class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte 24/7
                </li>
              </ul>
              <a
                href="#contact"
                class="block text-center bg-gray-800 text-white font-medium py-3 px-6 rounded-md hover:bg-gray-700 transition"
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" class="py-24 bg-gray-900 animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">O que Nossos Clientes Dizem</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Centros comerciais que transformaram sua gestão com o InadiZero
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Testimonial 1 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition transform hover:-translate-y-2">
              <div class="flex items-center mb-6">
                <div class="flex -space-x-2">
                  <img class="w-12 h-12 rounded-full border-2 border-yellow-500" src="https://randomuser.me/api/portraits/men/32.jpg" alt="">
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white">Carlos Mendes</h4>
                  <p class="text-sm text-gray-400">Shopping Vale Sul</p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-6">
                "O InadiZero revolucionou nossa gestão de contratos. Reduzimos o tempo de administração em 60% e aumentamos nossa ocupação para 98%."
              </p>
              <div class="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <!-- Testimonial 2 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition transform hover:-translate-y-2">
              <div class="flex items-center mb-6">
                <div class="flex -space-x-2">
                  <img class="w-12 h-12 rounded-full border-2 border-yellow-500" src="https://randomuser.me/api/portraits/women/44.jpg" alt="">
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white">Ana Lúcia Santos</h4>
                  <p class="text-sm text-gray-400">Galeria Central</p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-6">
                "A cobrança automatizada foi um divisor de águas. Nunca mais tive problemas com pagamentos atrasados e a satisfação dos lojistas melhorou muito."
              </p>
              <div class="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <!-- Testimonial 3 -->
            <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition transform hover:-translate-y-2">
              <div class="flex items-center mb-6">
                <div class="flex -space-x-2">
                  <img class="w-12 h-12 rounded-full border-2 border-yellow-500" src="https://randomuser.me/api/portraits/men/75.jpg" alt="">
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-white">Roberto Ferreira</h4>
                  <p class="text-sm text-gray-400">Outlet Premium</p>
                </div>
              </div>
              <p class="text-gray-300 italic mb-6">
                "O dashboard analítico nos deu insights que aumentaram nosso faturamento em 35%. Agora tomamos decisões baseadas em dados reais."
              </p>
              <div class="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="py-24 bg-black animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl font-bold text-yellow-400 mb-6">Fale Conosco</h2>
              <p class="text-xl text-gray-300 mb-8">
                Pronto para transformar a gestão do seu shopping? Nossa equipe está aqui para ajudar.
              </p>
              <div class="space-y-6 mb-10">
                <div class="flex items-start">
                  <div class="flex-shrink-0 h-6 w-6 text-yellow-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-white">Email</h3>
                    <p class="text-gray-400">contatoinadizero.com.br</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex-shrink-0 h-6 w-6 text-yellow-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-white">Telefone</h3>
                    <p class="text-gray-400">(11) 4004-4004</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex-shrink-0 h-6 w-6 text-yellow-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-white">Escritório</h3>
                    <p class="text-gray-400">Av. Paulista, 1000 - São Paulo/SP</p>
                  </div>
                </div>
              </div>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-yellow-500 transition">
                  <span class="sr-only">Facebook</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-yellow-500 transition">
                  <span class="sr-only">LinkedIn</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-yellow-500 transition">
                  <span class="sr-only">Instagram</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <form class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-300">Nome</label>
                  <input type="text" id="name" name="name" required class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
                  <input type="email" id="email" name="email" required class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-300">Telefone</label>
                  <input type="tel" id="phone" name="phone" class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                </div>
                <div>
                  <label for="message" class="block text-sm font-medium text-gray-300">Mensagem</label>
                  <textarea id="message" name="message" rows="4" required class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"></textarea>
                </div>
                <div>
                  <button type="submit" class="w-full bg-yellow-500 text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-400 transition shadow-lg transform hover:scale-105 hover:shadow-yellow-500/30">
                    Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 border-t border-gray-800 py-12 animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-yellow-400 mb-4">InadiZero</h3>
              <p class="text-gray-400">
                A plataforma de gestão mais completa para shoppings e centros comerciais.
              </p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Produto</h3>
              <ul class="space-y-2">
                <li><a href="#features" class="text-gray-400 hover:text-yellow-400 transition">Recursos</a></li>
                <li><a href="#solutions" class="text-gray-400 hover:text-yellow-400 transition">Soluções</a></li>
                <li><a href="#pricing" class="text-gray-400 hover:text-yellow-400 transition">Planos</a></li>
                <li><a href="#demo" class="text-gray-400 hover:text-yellow-400 transition">Demonstração</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Empresa</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-yellow-400 transition">Sobre Nós</a></li>
                <li><a href="#" class="text-gray-400 hover:text-yellow-400 transition">Carreiras</a></li>
                <li><a href="#" class="text-gray-400 hover:text-yellow-400 transition">Blog</a></li>
                <li><a href="#contact" class="text-gray-400 hover:text-yellow-400 transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-yellow-400 transition">Termos de Uso</a></li>
                <li><a href="#" class="text-gray-400 hover:text-yellow-400 transition">Política de Privacidade</a></li>
                <li><a href="#" class="text-gray-400 hover:text-yellow-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div class="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">
              © 2023 InadiZero. Todos os direitos reservados.
            </p>
            <div class="mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-yellow-400 text-sm transition mr-4">Termos</a>
              <a href="#" class="text-gray-400 hover:text-yellow-400 text-sm transition mr-4">Privacidade</a>
              <a href="#" class="text-gray-400 hover:text-yellow-400 text-sm transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class LandingComponent {}