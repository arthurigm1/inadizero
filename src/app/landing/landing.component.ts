import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 text-white font-sans">
      <!-- Navigation -->
      <nav class="bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-800 shadow-lg sticky top-0 z-50 animate-fade-in-down">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-2">
              <span class="text-black font-extrabold text-3xl tracking-tight drop-shadow-lg">Inadi<span class="text-white bg-yellow-600 px-2 rounded-lg animate-pulse">Zero</span></span>
            </div>
            <div class="hidden md:block">
              <div class="flex items-center space-x-8">
                <a href="#features" class="text-white hover:text-yellow-200 transition font-semibold">Recursos</a>
                <a href="#how-it-works" class="text-white hover:text-yellow-200 transition font-semibold">Como Funciona</a>
                <a href="#pricing" class="text-white hover:text-yellow-200 transition font-semibold">Planos</a>
                <a href="#testimonials" class="text-white hover:text-yellow-200 transition font-semibold">Depoimentos</a>
                <a href="#contact" class="text-white hover:text-yellow-200 transition font-semibold">Contato</a>
              </div>
            </div>
            <div>
              <a
                routerLink="/login"
                class="bg-black bg-opacity-80 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 hover:text-black transition shadow-lg animate-bounce"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-yellow-900 via-black to-yellow-700 overflow-hidden">
        <div class="absolute inset-0 opacity-30 pointer-events-none animate-gradient-x">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="url(#grad1)" fill-opacity="1" d="M0,160L80,170.7C160,181,320,203,480,197.3C640,192,800,160,960,133.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#facc15" />
                <stop offset="100%" stop-color="#f59e42" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 animate-fade-in-up">
          <div class="text-center">
            <h1 class="text-5xl sm:text-7xl font-extrabold text-yellow-400 mb-6 animate-pulse drop-shadow-lg">
              Transforme Inadimplência em <span class="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 bg-clip-text text-transparent animate-gradient-x">Crescimento</span>
            </h1>
            <p class="text-xl sm:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto animate-fade-in">
              A solução inteligente para gestão e recuperação de créditos com tecnologia avançada e resultados comprovados.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up">
              <a
                routerLink="/register"
                class="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 transition text-lg shadow-xl animate-bounce"
              >
                Comece Grátis por 30 Dias
              </a>
              <a
                href="#demo"
                class="border-2 border-yellow-400 text-yellow-400 font-bold py-4 px-8 rounded-lg hover:bg-yellow-400 hover:text-black transition text-lg shadow-lg animate-fade-in"
              >
                Agendar Demonstração
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-gray-900 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div class="p-6">
              <div class="text-yellow-400 text-4xl font-bold">+85%</div>
              <div class="text-gray-300 mt-2">Taxa de Recuperação</div>
            </div>
            <div class="p-6">
              <div class="text-yellow-400 text-4xl font-bold">500+</div>
              <div class="text-gray-300 mt-2">Clientes Satisfeitos</div>
            </div>
            <div class="p-6">
              <div class="text-yellow-400 text-4xl font-bold">R$ 2Bi+</div>
              <div class="text-gray-300 mt-2">Em Créditos Recuperados</div>
            </div>
            <div class="p-6">
              <div class="text-yellow-400 text-4xl font-bold">24/7</div>
              <div class="text-gray-300 mt-2">Suporte Especializado</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-24 bg-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Tecnologia que Transforma</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Nossa plataforma oferece tudo que você precisa para transformar desafios financeiros em oportunidades
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <!-- Feature 1 -->
            <div class="bg-gray-900 p-8 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div class="text-yellow-400 text-4xl mb-6">🤖</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Inteligência Artificial</h3>
              <p class="text-gray-300">
                Análise preditiva e machine learning para identificar padrões de inadimplência e sugerir ações otimizadas.
              </p>
            </div>
            
            <!-- Feature 2 -->
            <div class="bg-gray-900 p-8 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div class="text-yellow-400 text-4xl mb-6">📊</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Dashboard Intuitivo</h3>
              <p class="text-gray-300">
                Visualização de dados em tempo real com KPIs essenciais para tomada de decisão estratégica.
              </p>
            </div>
            
            <!-- Feature 3 -->
            <div class="bg-gray-900 p-8 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div class="text-yellow-400 text-4xl mb-6">🔒</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Segurança de Dados</h3>
              <p class="text-gray-300">
                Infraestrutura robusta com criptografia de ponta a ponta e conformidade com LGPD.
              </p>
            </div>
            
            <!-- Feature 4 -->
            <div class="bg-gray-900 p-8 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div class="text-yellow-400 text-4xl mb-6">📱</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Aplicativo Móvel</h3>
              <p class="text-gray-300">
                Acompanhe seus resultados e receba alertas importantes diretamente no seu celular.
              </p>
            </div>
            
            <!-- Feature 5 -->
            <div class="bg-gray-900 p-8 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div class="text-yellow-400 text-4xl mb-6">🔄</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Integrações</h3>
              <p class="text-gray-300">
                Conecte-se facilmente com seus sistemas ERP, CRM e bancos para sincronização automática de dados.
              </p>
            </div>
            
            <!-- Feature 6 -->
            <div class="bg-gray-900 p-8 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div class="text-yellow-400 text-4xl mb-6">📑</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Relatórios Personalizados</h3>
              <p class="text-gray-300">
                Geração automática de relatórios detalhados para análise histórica e projeções futuras.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="py-24 bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Como Funciona</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Três passos simples para transformar sua gestão de inadimplência
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="bg-black p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-yellow-400 text-2xl font-bold border-2 border-yellow-400">1</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Integração</h3>
              <p class="text-gray-300">
                Conecte seus sistemas ou importe seus dados manualmente em poucos minutos.
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-black p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-yellow-400 text-2xl font-bold border-2 border-yellow-400">2</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Análise</h3>
              <p class="text-gray-300">
                Nossa IA classifica os casos por potencial de recuperação e sugere estratégias.
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-black p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-yellow-400 text-2xl font-bold border-2 border-yellow-400">3</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Ação</h3>
              <p class="text-gray-300">
                Execute as ações recomendadas e acompanhe os resultados em tempo real.
              </p>
            </div>
          </div>
          
          <div class="mt-16 text-center">
            <a
              href="#demo"
              class="inline-block border-2 border-yellow-400 text-yellow-400 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 hover:text-black transition"
            >
              Ver Demonstração Interativa
            </a>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="py-24 bg-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Planos que Se Adaptam</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Escolha a solução perfeita para o tamanho do seu negócio
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Basic Plan -->
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Básico</h3>
              <div class="text-4xl font-bold text-white mb-6">R$ 299<span class="text-lg text-gray-400">/mês</span></div>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Até 100 registros/mês
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Dashboard básico
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Relatórios mensais
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Suporte por e-mail
                </li>
              </ul>
              <a
                href="#contact"
                class="block text-center bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition"
              >
                Assinar Plano
              </a>
            </div>
            
            <!-- Professional Plan (Featured) -->
            <div class="bg-gray-900 p-8 rounded-xl border-2 border-yellow-400 transform scale-105">
              <div class="text-xs font-semibold text-yellow-400 mb-2">MAIS POPULAR</div>
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Profissional</h3>
              <div class="text-4xl font-bold text-white mb-6">R$ 799<span class="text-lg text-gray-400">/mês</span></div>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Até 500 registros/mês
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Dashboard avançado
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Análise preditiva
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Integrações API
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Suporte prioritário
                </li>
              </ul>
              <a
                routerLink="/register"
                class="block text-center bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition"
              >
                Começar Teste Grátis
              </a>
            </div>
            
            <!-- Enterprise Plan -->
            <div class="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 class="text-xl font-semibold text-yellow-400 mb-4">Empresarial</h3>
              <div class="text-4xl font-bold text-white mb-6">Sob Consulta</div>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Volume ilimitado
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Dashboard personalizado
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> IA customizada
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Integrações dedicadas
                </li>
                <li class="flex items-center text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Gerente de conta
                </li>
              </ul>
              <a
                href="#contact"
                class="block text-center bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition"
              >
                Fale com Vendas
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" class="py-24 bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">O que Nossos Clientes Dizem</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Empresas que já transformaram sua gestão de inadimplência
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Testimonial 1 -->
            <div class="bg-black p-8 rounded-xl">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xl">A</div>
                <div class="ml-4">
                  <h4 class="text-yellow-400 font-semibold">Ana Silva</h4>
                  <p class="text-gray-400 text-sm">Diretora Financeira - Empresa X</p>
                </div>
              </div>
              <p class="text-gray-300 italic">
                "O InadiZero reduziu nossa inadimplência em 60% no primeiro trimestre. A plataforma é intuitiva e o suporte é excepcional."
              </p>
              <div class="flex mt-4 text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <!-- Testimonial 2 -->
            <div class="bg-black p-8 rounded-xl">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xl">C</div>
                <div class="ml-4">
                  <h4 class="text-yellow-400 font-semibold">Carlos Mendes</h4>
                  <p class="text-gray-400 text-sm">CEO - Grupo Y</p>
                </div>
              </div>
              <p class="text-gray-300 italic">
                "A análise preditiva nos ajudou a identificar padrões que não víamos antes. Recuperamos R$ 2,5 milhões em 6 meses."
              </p>
              <div class="flex mt-4 text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <!-- Testimonial 3 -->
            <div class="bg-black p-8 rounded-xl">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xl">M</div>
                <div class="ml-4">
                  <h4 class="text-yellow-400 font-semibold">Mariana Oliveira</h4>
                  <p class="text-gray-400 text-sm">Gerente de Crédito - Empresa Z</p>
                </div>
              </div>
              <p class="text-gray-300 italic">
                "A integração com nosso ERP foi perfeita. Agora temos visibilidade completa do ciclo de cobrança em um só lugar."
              </p>
              <div class="flex mt-4 text-yellow-400">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section id="demo" class="py-24 bg-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl font-bold text-yellow-400 mb-6">Veja o InadiZero em Ação</h2>
              <p class="text-xl text-gray-300 mb-8">
                Agende uma demonstração personalizada e descubra como podemos transformar sua gestão de inadimplência.
              </p>
              <ul class="space-y-4 mb-10">
                <li class="flex items-start text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Demonstração ao vivo com um especialista
                </li>
                <li class="flex items-start text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Análise personalizada do seu cenário
                </li>
                <li class="flex items-start text-gray-300">
                  <span class="text-yellow-400 mr-2">✓</span> Proposta comercial sem compromisso
                </li>
              </ul>
              <a
                href="#contact"
                class="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition"
              >
                Agendar Demonstração
              </a>
            </div>
            <div class="bg-gray-900 p-8 rounded-xl">
              <div class="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg flex items-center justify-center">
                <div class="text-center p-8">
                  <div class="text-yellow-400 text-5xl mb-4">▶️</div>
                  <h3 class="text-xl font-semibold text-yellow-400">Demonstração Interativa</h3>
                  <p class="text-gray-300 mt-2">Veja como nossa plataforma funciona</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-24 bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Perguntas Frequentes</h2>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
              Tudo o que você precisa saber sobre o InadiZero
            </p>
          </div>
          
          <div class="max-w-3xl mx-auto space-y-6">
            <!-- FAQ Item 1 -->
            <div class="bg-black p-6 rounded-xl">
              <button class="flex justify-between items-center w-full text-left">
                <h3 class="text-lg font-semibold text-yellow-400">Quanto tempo leva para implementar?</h3>
                <span class="text-yellow-400 text-xl">+</span>
              </button>
              <div class="mt-4 text-gray-300">
                <p>A implementação básica pode ser feita em poucas horas. Para integrações complexas com sistemas legados, nosso time técnico pode levar de 2 a 5 dias úteis.</p>
              </div>
            </div>
            
            <!-- FAQ Item 2 -->
            <div class="bg-black p-6 rounded-xl">
              <button class="flex justify-between items-center w-full text-left">
                <h3 class="text-lg font-semibold text-yellow-400">Meus dados estão seguros?</h3>
                <span class="text-yellow-400 text-xl">+</span>
              </button>
              <div class="mt-4 text-gray-300">
                <p>Sim, utilizamos criptografia de ponta a ponta e seguimos rigorosos protocolos de segurança. Somos totalmente compatíveis com LGPD e oferecemos opções de hospedagem privada para clientes empresariais.</p>
              </div>
            </div>
            
            <!-- FAQ Item 3 -->
            <div class="bg-black p-6 rounded-xl">
              <button class="flex justify-between items-center w-full text-left">
                <h3 class="text-lg font-semibold text-yellow-400">Qual o tempo médio para ver resultados?</h3>
                <span class="text-yellow-400 text-xl">+</span>
              </button>
              <div class="mt-4 text-gray-300">
                <p>Nossos clientes costumam ver melhorias significativas nos primeiros 30-60 dias de uso. O tempo exato varia conforme o volume e perfil de inadimplência de cada empresa.</p>
              </div>
            </div>
            
            <!-- FAQ Item 4 -->
            <div class="bg-black p-6 rounded-xl">
              <button class="flex justify-between items-center w-full text-left">
                <h3 class="text-lg font-semibold text-yellow-400">Há treinamento incluído?</h3>
                <span class="text-yellow-400 text-xl">+</span>
              </button>
              <div class="mt-4 text-gray-300">
                <p>Sim, todos os planos incluem treinamento inicial online. Planos profissionais e empresariais incluem sessões adicionais de capacitação e materiais personalizados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-24 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-black mb-6">Pronto para Transformar sua Gestão?</h2>
          <p class="text-xl text-gray-900 mb-10 max-w-3xl mx-auto">
            Comece agora e reduza sua inadimplência com nossa tecnologia avançada
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a
              routerLink="/register"
              class="inline-block bg-black text-yellow-400 font-bold py-4 px-10 rounded-lg hover:bg-gray-900 transition text-lg shadow-lg"
            >
              Experimente Grátis
            </a>
            <a
              href="#contact"
              class="inline-block border-2 border-black text-black font-bold py-4 px-10 rounded-lg hover:bg-black hover:text-yellow-400 transition text-lg"
            >
              Fale com um Especialista
            </a>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="py-24 bg-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 class="text-3xl font-bold text-yellow-400 mb-6">Fale Conosco</h2>
              <p class="text-xl text-gray-300 mb-8">
                Tem dúvidas ou precisa de mais informações? Nossa equipe está pronta para ajudar.
              </p>
              
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="text-yellow-400 mr-4 mt-1">📍</div>
                  <div>
                    <h3 class="text-lg font-semibold text-yellow-400">Endereço</h3>
                    <p class="text-gray-300">Av. Paulista, 1000 - São Paulo/SP</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="text-yellow-400 mr-4 mt-1">✉️</div>
                  <div>
                    <h3 class="text-lg font-semibold text-yellow-400">Email</h3>
                    <p class="text-gray-300">contatoinadizero.com.br</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="text-yellow-400 mr-4 mt-1">📞</div>
                  <div>
                    <h3 class="text-lg font-semibold text-yellow-400">Telefone</h3>
                    <p class="text-gray-300">(11) 1234-5678</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-900 p-8 rounded-xl">
              <form>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label for="name" class="block text-gray-300 mb-2">Nome</label>
                    <input type="text" id="name" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  </div>
                  <div>
                    <label for="email" class="block text-gray-300 mb-2">Email</label>
                    <input type="email" id="email" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  </div>
                </div>
                
                <div class="mb-6">
                  <label for="subject" class="block text-gray-300 mb-2">Assunto</label>
                  <select id="subject" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <option value="">Selecione...</option>
                    <option value="demo">Agendar Demonstração</option>
                    <option value="sales">Falar com Vendas</option>
                    <option value="support">Suporte Técnico</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                
                <div class="mb-6">
                  <label for="message" class="block text-gray-300 mb-2">Mensagem</label>
                  <textarea id="message" rows="4" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                </div>
                
                <button type="submit" class="w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 class="text-yellow-400 font-bold text-2xl mb-4">InadiZero</h3>
              <p class="text-gray-300">
                A solução completa para gestão e recuperação de créditos com tecnologia de ponta.
              </p>
            </div>
            
            <div>
              <h4 class="text-yellow-400 font-semibold mb-4">Produto</h4>
              <ul class="space-y-2">
                <li><a href="#features" class="text-gray-300 hover:text-yellow-400 transition">Recursos</a></li>
                <li><a href="#pricing" class="text-gray-300 hover:text-yellow-400 transition">Planos</a></li>
                <li><a href="#demo" class="text-gray-300 hover:text-yellow-400 transition">Demonstração</a></li>
                <li><a href="#testimonials" class="text-gray-300 hover:text-yellow-400 transition">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-yellow-400 font-semibold mb-4">Empresa</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-300 hover:text-yellow-400 transition">Sobre Nós</a></li>
                <li><a href="#" class="text-gray-300 hover:text-yellow-400 transition">Carreiras</a></li>
                <li><a href="#" class="text-gray-300 hover:text-yellow-400 transition">Blog</a></li>
                <li><a href="#contact" class="text-gray-300 hover:text-yellow-400 transition">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-yellow-400 font-semibold mb-4">Legal</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-300 hover:text-yellow-400 transition">Termos de Uso</a></li>
                <li><a href="#" class="text-gray-300 hover:text-yellow-400 transition">Política de Privacidade</a></li>
                <li><a href="#" class="text-gray-300 hover:text-yellow-400 transition">LGPD</a></li>
                <li><a href="#" class="text-gray-300 hover:text-yellow-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 mb-4 md:mb-0">
              © 2023 InadiZero. Todos os direitos reservados.
            </p>
            <div class="flex space-x-6">
                            <a href="#" class="text-gray-400 hover:text-yellow-400 transition">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-yellow-400 transition">
                <span class="sr-only">LinkedIn</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-yellow-400 transition">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class LandingComponent {}