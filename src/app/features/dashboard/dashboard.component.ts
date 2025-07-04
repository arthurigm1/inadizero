import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Card de Inadimplência -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Taxa de Inadimplência</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">15%</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <span class="sr-only">Aumentou</span>
                      2%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-700 hover:text-blue-900">Ver detalhes</a>
            </div>
          </div>
        </div>

        <!-- Card de Contratos -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Contratos Vencendo</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">8</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-yellow-600">
                      Próximos 30 dias
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-700 hover:text-blue-900">Ver todos</a>
            </div>
          </div>
        </div>

        <!-- Card de Ocupação -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Taxa de Ocupação</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">85%</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span class="sr-only">Aumentou</span>
                      5%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-700 hover:text-blue-900">Ver lojas</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Faturamento -->
      <div class="mt-8">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Faturamento Mensal</h3>
          <!-- TODO: Implementar gráfico com biblioteca de charts -->
          <div class="mt-4 h-64 bg-gray-100 rounded flex items-center justify-center">
            <p class="text-gray-500">Gráfico será implementado aqui</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // TODO: Implementar carregamento de dados do dashboard
  }
}