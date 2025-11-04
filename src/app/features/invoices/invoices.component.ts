import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { InvoiceService } from './invoice.service';
import { InvoiceDetailsComponent } from './invoice-details.component';

// Uso do jspdf-autotable via função importada

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, InvoiceDetailsComponent],
  template: `
    <div *ngIf="!showDetails" class="space-y-4 sm:space-y-6 p-4 sm:p-6" [@fadeIn]>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-blue-900">Faturas</h2>
          <p class="text-sm sm:text-base text-gray-600 mt-1">Gerencie todas as faturas do sistema</p>
        </div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            (click)="exportToPDF()" 
            [disabled]="loading || totalFaturas === 0"
            class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Exportar PDF</span>
          </button>
          <div class="relative">
            <input 
              type="text" 
              placeholder="Buscar faturas..." 
              [(ngModel)]="searchTerm"
              (input)="filterFaturas()"
              class="w-full sm:w-64 px-4 py-2 bg-white border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <svg class="absolute right-3 top-2.5 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-xs sm:text-sm font-medium">Total de Faturas</p>
              <p class="text-xl sm:text-2xl font-bold text-blue-900 mt-1">{{totalFaturas}}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white border border-green-200 rounded-xl p-4 sm:p-6 hover:border-green-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-xs sm:text-sm font-medium">Pagas</p>
              <p class="text-xl sm:text-2xl font-bold text-green-900 mt-1">{{faturasPagas}}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white border border-yellow-200 rounded-xl p-4 sm:p-6 hover:border-yellow-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-600 text-xs sm:text-sm font-medium">Pendentes</p>
              <p class="text-xl sm:text-2xl font-bold text-yellow-900 mt-1">{{faturasPendentes}}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white border border-red-200 rounded-xl p-4 sm:p-6 hover:border-red-400 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-600 text-xs sm:text-sm font-medium">Vencidas</p>
              <p class="text-xl sm:text-2xl font-bold text-red-900 mt-1">{{faturasVencidas}}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-blue-900 mb-2">Status</label>
            <select [(ngModel)]="selectedStatus" (change)="filterFaturas()" class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGA">Paga</option>
              <option value="VENCIDA">Vencida</option>
            </select>
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-blue-900 mb-2">Mês</label>
            <select [(ngModel)]="selectedMonth" (change)="filterFaturas()" class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="">Todos</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-blue-900 mb-2">Ano</label>
            <select [(ngModel)]="selectedYear" (change)="filterFaturas()" class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="">Todos</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Faturas Cards -->
      <div *ngIf="!loading" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div *ngFor="let fatura of filteredFaturas" class="bg-white border border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-all duration-300">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm text-blue-600">Referência</p>
                <p class="text-base sm:text-lg font-semibold text-blue-900 truncate">{{fatura.referencia}}</p>
                <p class="text-xs text-gray-500">ID {{fatura.id.substring(0, 8)}}...</p>
              </div>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ml-2 flex-shrink-0" [class]="getStatusClass(fatura.status)">
                {{fatura.statusDescricao || getStatusText(fatura.status)}}
              </span>
            </div>
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p class="text-xs sm:text-sm text-blue-600">Inquilino</p>
                <p class="text-xs sm:text-sm font-medium text-blue-900 truncate">{{fatura.inquilino}}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-blue-600">Loja</p>
                <p class="text-xs sm:text-sm font-medium text-blue-900 truncate">{{fatura.loja}}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-blue-600">Valor</p>
                <p class="text-xs sm:text-sm font-semibold text-blue-900">{{fatura.valorFormatado}}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-blue-600">Vencimento</p>
                <p class="text-xs sm:text-sm font-semibold text-blue-900">{{formatDate(fatura.dataVencimento)}}</p>
              </div>
            </div>
            <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <span *ngIf="fatura.estaVencida" class="text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded">Vencida</span>
                <span *ngIf="!fatura.estaVencida" class="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">No prazo</span>
              </div>
              <button class="text-blue-600 hover:text-blue-900 transition-colors flex items-center justify-center sm:justify-start space-x-1 text-sm" title="Ver detalhes" (click)="openDetails(fatura.id)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span class="hidden sm:inline">Ver detalhes</span>
                <span class="sm:hidden">Detalhes</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredFaturas.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma fatura encontrada</h3>
          <p class="mt-1 text-sm text-gray-500">Não há faturas que correspondam aos filtros selecionados.</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="totalFaturas > 0" class="bg-blue-50 px-4 sm:px-6 py-3 flex items-center justify-between border border-blue-200 rounded-lg">
          <div class="flex-1 flex justify-between sm:hidden">
            <button (click)="previousPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-3 py-2 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
              Anterior
            </button>
            <span class="text-xs text-blue-700 flex items-center">
              {{currentPage}} de {{totalPages}}
            </span>
            <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="relative inline-flex items-center px-3 py-2 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50">
              Próximo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-blue-700">
                Mostrando <span class="font-medium">{{(currentPage - 1) * 10 + 1}}</span> a <span class="font-medium">{{currentPage * 10 < totalFaturas ? currentPage * 10 : totalFaturas}}</span> de <span class="font-medium">{{totalFaturas}}</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button (click)="previousPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50 disabled:opacity-50">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
                <span class="relative inline-flex items-center px-4 py-2 border border-blue-300 bg-white text-sm font-medium text-blue-700">
                  {{currentPage}} de {{totalPages}}
                </span>
                <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50 disabled:opacity-50">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showDetails" class="space-y-6" [@fadeIn]>
      <app-invoice-details [invoiceId]="selectedInvoiceId!" (closed)="closeDetails()"></app-invoice-details>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class InvoicesComponent implements OnInit {
  faturas: FaturaResumo[] = [];
  filteredFaturas: FaturaResumo[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = '';
  selectedMonth = '';
  selectedYear = '';
  showDetails = false;
  selectedInvoiceId: string | null = null;
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalFaturas = 0;

  // Stats
  faturasPagas = 0;
  faturasPendentes = 0;
  faturasVencidas = 0;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.loadFaturas();
  }

  loadFaturas() {
    this.loading = true;
    this.invoiceService.getFaturas(this.currentPage, 10).subscribe({
      next: (response) => {
        if (response.sucesso) {
          this.faturas = response.data.faturas.map((f: any) => ({
            id: f.id,
            referencia: f.referencia || '',
            valor: f.valor || 0,
            valorFormatado: f.valorFormatado || this.formatCurrency(f.valor || 0),
            dataVencimento: f.dataVencimento || '',
            status: f.status || '',
            statusDescricao: f.statusDescricao || this.getStatusText(f.status || ''),
            estaVencida: f.estaVencida || false,
            loja: f.loja || '',
            inquilino: f.inquilino || ''
          }));
          this.filteredFaturas = [...this.faturas];
          this.totalFaturas = response.data.total;
          this.totalPages = (response.data.totalPages || Math.ceil((this.totalFaturas || 0) / 10)) || 1;
          this.currentPage = response.data.page || this.currentPage || 1;
          this.calculateStats();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar faturas:', error);
        this.loading = false;
      }
    });
  }

  calculateStats() {
    this.faturasPagas = this.faturas.filter(f => f.status === 'PAGA' || f.status === 'PAGO').length;
    this.faturasPendentes = this.faturas.filter(f => f.status === 'PENDENTE').length;
    this.faturasVencidas = this.faturas.filter(f => f.estaVencida === true || f.status === 'VENCIDA' || f.status === 'VENCIDO').length;
  }

  filterFaturas() {
    this.filteredFaturas = this.faturas.filter(fatura => {
      const search = this.searchTerm?.toLowerCase() || '';
      const matchesSearch = !search ||
        (fatura.inquilino?.toLowerCase().includes(search)) ||
        (fatura.loja?.toLowerCase().includes(search)) ||
        (fatura.id?.toLowerCase().includes(search));

      const status = fatura.status;
      const matchesStatus = !this.selectedStatus || status === this.selectedStatus ||
        (this.selectedStatus === 'PAGA' && status === 'PAGO') ||
        (this.selectedStatus === 'VENCIDA' && status === 'VENCIDO');

      const [mesRef, anoRef] = (fatura.referencia || '').split('/');
      const matchesMonth = !this.selectedMonth || Number(mesRef) === Number(this.selectedMonth);
      const matchesYear = !this.selectedYear || anoRef === this.selectedYear;

      return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadFaturas();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadFaturas();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAGO':
      case 'PAGA':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'VENCIDO':
      case 'VENCIDA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAGO':
      case 'PAGA':
        return 'Paga';
      case 'PENDENTE':
        return 'Pendente';
      case 'VENCIDO':
      case 'VENCIDA':
        return 'Vencida';
      default:
        return status;
    }
  }

  getMonthName(month: number): string {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return months[month - 1] || month.toString();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
  openDetails(id: string) {
    this.selectedInvoiceId = id;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedInvoiceId = null;
  }

  exportToPDF() {
    if (this.totalFaturas === 0) {
      return;
    }

    // Criar novo documento PDF
    const doc = new jsPDF();
    
    // Configurar título
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // blue-900
    doc.text('Relatório de Faturas', 20, 30);
    
    // Adicionar data de geração
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // gray-500
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Gerado em: ${dataAtual}`, 20, 45);
    
    // Adicionar estatísticas
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138); // blue-900
    doc.text('Resumo:', 20, 65);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total de Faturas: ${this.totalFaturas}`, 20, 80);
    doc.text(`Faturas Pagas: ${this.faturasPagas}`, 20, 90);
    doc.text(`Faturas Pendentes: ${this.faturasPendentes}`, 20, 100);
    doc.text(`Faturas Vencidas: ${this.faturasVencidas}`, 20, 110);
    
    // Preparar dados da tabela
    const tableData = this.filteredFaturas.map(fatura => [
      fatura.referencia,
      fatura.inquilino,
      fatura.loja,
      fatura.valorFormatado,
      this.formatDate(fatura.dataVencimento),
      this.getStatusText(fatura.status),
      fatura.estaVencida ? 'Sim' : 'Não'
    ]);
    
    // Configurar e adicionar tabela
    autoTable(doc, {
      head: [['Referência', 'Inquilino', 'Loja', 'Valor', 'Vencimento', 'Status', 'Vencida']],
      body: tableData,
      startY: 125,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 58, 138], // blue-900
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // gray-50
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Referência
        1: { cellWidth: 35 }, // Inquilino
        2: { cellWidth: 30 }, // Loja
        3: { cellWidth: 25 }, // Valor
        4: { cellWidth: 25 }, // Vencimento
        5: { cellWidth: 20 }, // Status
        6: { cellWidth: 15 }  // Vencida
      }
    });
    
    // Salvar o PDF
    const nomeArquivo = `faturas_${dataAtual.replace(/\//g, '-')}.pdf`;
    doc.save(nomeArquivo);
  }
}

// Interface alinhada ao payload da API de listagem de faturas
interface FaturaResumo {
  id: string;
  referencia: string;
  valor: number;
  valorFormatado: string;
  dataVencimento: string;
  status: string;
  statusDescricao: string;
  estaVencida: boolean;
  loja: string;
  inquilino: string;
}