import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6" [@fadeIn]>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold text-blue-900">Detalhes da Fatura</h2>
          <p class="text-gray-600 mt-1">Informações completas da fatura selecionada</p>
        </div>
        <button (click)="onClose()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">Voltar</button>
      </div>

      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {{error}}
      </div>

      <div *ngIf="!loading && !error && detalhes" class="bg-white border border-blue-200 rounded-xl p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-blue-600">Identificador</p>
            <p class="text-lg font-semibold text-blue-900">{{detalhes.fatura.id}}</p>
          </div>
          <div>
            <p class="text-sm text-blue-600">Status</p>
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" [class]="getStatusClass(detalhes.fatura.status)">
              {{detalhes.fatura.statusDescricao || getStatusText(detalhes.fatura.status)}}
            </span>
          </div>
          <div>
            <p class="text-sm text-blue-600">Valor</p>
            <p class="text-lg font-semibold text-blue-900">{{detalhes.fatura.valorFormatado || formatCurrency(detalhes.fatura.valor)}}</p>
          </div>
          <div>
            <p class="text-sm text-blue-600">Vencimento</p>
            <p class="text-lg font-semibold text-blue-900">{{formatDate(detalhes.fatura.dataVencimento)}}</p>
          </div>
          <div>
            <p class="text-sm text-blue-600">Referência</p>
            <p class="text-lg font-semibold text-blue-900">{{detalhes.fatura.referencia}}</p>
          </div>
          <div>
            <p class="text-sm text-blue-600">Situação</p>
            <p class="text-lg font-semibold" [class]="detalhes.fatura.estaVencida ? 'text-red-700' : 'text-green-700'">
              {{detalhes.fatura.estaVencida ? 'Vencida' : 'No prazo'}}
            </p>
          </div>
          <div *ngIf="detalhes.fatura.diasParaVencimento !== null">
            <p class="text-sm text-blue-600">Dias para vencimento</p>
            <p class="text-lg font-semibold text-blue-900">{{detalhes.fatura.diasParaVencimento}}</p>
          </div>
          <div *ngIf="detalhes.fatura.diasEmAtraso !== null">
            <p class="text-sm text-blue-600">Dias em atraso</p>
            <p class="text-lg font-semibold text-red-700">{{detalhes.fatura.diasEmAtraso}}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-600">Inquilino</p>
            <p class="text-lg font-semibold text-blue-900">{{detalhes.inquilino.nome}}</p>
            <p class="text-sm text-gray-600">{{detalhes.inquilino.email}}</p>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-600">Loja</p>
            <p class="text-lg font-semibold text-blue-900">{{detalhes.loja.nome}}</p>
            <p class="text-sm text-gray-600">Nº {{detalhes.loja.numero}} · {{detalhes.loja.localizacao}}</p>
            <p class="text-sm text-gray-600">Empresa: {{detalhes.loja.empresa}}</p>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-600">Contrato</p>
            <p class="text-sm text-gray-700">Valor aluguel: <span class="font-semibold text-blue-900">{{formatCurrency(detalhes.contrato.valorAluguel)}}</span></p>
            <p class="text-sm text-gray-700">Início: <span class="font-semibold text-blue-900">{{formatDate(detalhes.contrato.dataInicio)}}</span></p>
            <p class="text-sm text-gray-700">Fim: <span class="font-semibold text-blue-900">{{formatDate(detalhes.contrato.dataFim)}}</span></p>
            <div class="mt-2">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" [class]="getContratoStatusClass(detalhes.contrato.status)">
                {{getContratoStatusText(detalhes.contrato.status)}}
              </span>
            </div>
          </div>
        </div>
      </div>
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
export class InvoiceDetailsComponent implements OnInit {
  @Input() invoiceId!: string;
  @Output() closed = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  detalhes: DetalhesData | null = null;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    if (this.invoiceId) {
      this.fetchDetails(this.invoiceId);
    }
  }

  fetchDetails(id: string): void {
    this.loading = true;
    this.error = null;
    this.invoiceService.getFaturaDetalhes(id).subscribe({
      next: (data) => {
        this.detalhes = (data?.data || data) as DetalhesData;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da fatura:', err);
        this.error = err?.error?.message || 'Erro ao carregar detalhes da fatura';
        this.loading = false;
      }
    });
  }

  onClose(): void {
    this.closed.emit();
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
        return 'Pago';
      case 'PENDENTE':
        return 'Pendente';
      case 'VENCIDO':
      case 'VENCIDA':
        return 'Vencido';
      default:
        return status;
    }
  }

  getContratoStatusClass(status: string): string {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'VIGENTE':
        return 'bg-blue-100 text-blue-800';
      case 'VENCIDO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getContratoStatusText(status: string): string {
    switch (status) {
      case 'ATIVO':
        return 'Ativo';
      case 'VIGENTE':
        return 'Vigente';
      case 'VENCIDO':
        return 'Vencido';
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
}

// Tipagens para organizar melhor os dados da API
interface FaturaDetalhe {
  id: string;
  referencia: string;
  valor: number;
  valorFormatado: string;
  dataVencimento: string;
  status: string;
  statusDescricao: string;
  estaVencida: boolean;
  diasParaVencimento: number | null;
  diasEmAtraso: number | null;
}

interface LojaDetalhe {
  nome: string;
  numero: string;
  localizacao: string;
  empresa: string;
}

interface InquilinoDetalhe {
  nome: string;
  email: string;
}

interface ContratoDetalhe {
  valorAluguel: number;
  dataInicio: string;
  dataFim: string;
  status: string;
}

interface DetalhesData {
  fatura: FaturaDetalhe;
  loja: LojaDetalhe;
  inquilino: InquilinoDetalhe;
  contrato: ContratoDetalhe;
}