import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 p-6">
      <!-- Header -->
      <div class="mb-8" [@fadeIn]>
        <h1 class="text-4xl font-bold text-yellow-400 mb-2">Gerenciamento de Usuários</h1>
        <p class="text-gray-300">Gerencie todos os usuários do sistema</p>
      </div>

      <!-- Actions Bar -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center" [@slideIn]>
        <div class="flex flex-col sm:flex-row gap-4">
          <button class="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            <i class="fas fa-plus mr-2"></i>
            Novo Usuário
          </button>
          <button class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            <i class="fas fa-download mr-2"></i>
            Exportar
          </button>
        </div>
        
        <div class="flex gap-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Buscar usuários..."
              class="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <select class="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500">
            <option value="all">Todos os tipos</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="user">Usuário</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl" [@fadeIn]>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-900/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  <input type="checkbox" class="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500">
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Usuário</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Último Acesso</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700/50">
              <tr *ngFor="let user of users" class="hover:bg-gray-700/30 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" class="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold mr-4">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-white">{{ user.name }}</div>
                      <div class="text-sm text-gray-400">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-red-900/50 text-red-300 border-red-500/50': user.type === 'admin',
                    'bg-blue-900/50 text-blue-300 border-blue-500/50': user.type === 'manager',
                    'bg-green-900/50 text-green-300 border-green-500/50': user.type === 'user'
                  }" class="inline-flex px-3 py-1 text-xs font-semibold rounded-full border">
                    {{ user.type === 'admin' ? 'Administrador' : user.type === 'manager' ? 'Gerente' : 'Usuário' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-green-900/50 text-green-300 border-green-500/50': user.status === 'active',
                    'bg-red-900/50 text-red-300 border-red-500/50': user.status === 'inactive',
                    'bg-yellow-900/50 text-yellow-300 border-yellow-500/50': user.status === 'pending'
                  }" class="inline-flex px-3 py-1 text-xs font-semibold rounded-full border">
                    {{ user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Pendente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ user.lastAccess }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button class="text-yellow-400 hover:text-yellow-300 transition-colors duration-200" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-blue-400 hover:text-blue-300 transition-colors duration-200" title="Visualizar">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300 transition-colors duration-200" title="Excluir">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex flex-col sm:flex-row justify-between items-center" [@slideIn]>
        <div class="text-sm text-gray-400 mb-4 sm:mb-0">
          Mostrando 1 a 10 de {{ users.length }} usuários
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50" disabled>
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold">1</button>
          <button class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200">2</button>
          <button class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200">3</button>
          <button class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent {
  users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao&#64;inadizero.com',
      type: 'admin',
      status: 'active',
      lastAccess: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria&#64;inadizero.com',
      type: 'manager',
      status: 'active',
      lastAccess: '2024-01-15 10:15'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro&#64;inadizero.com',
      type: 'user',
      status: 'active',
      lastAccess: '2024-01-14 16:45'
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      email: 'ana&#64;inadizero.com',
      type: 'user',
      status: 'inactive',
      lastAccess: '2024-01-10 09:20'
    },
    {
      id: 5,
      name: 'Carlos Ferreira',
      email: 'carlos&#64;inadizero.com',
      type: 'manager',
      status: 'pending',
      lastAccess: 'Nunca'
    }
  ];
}