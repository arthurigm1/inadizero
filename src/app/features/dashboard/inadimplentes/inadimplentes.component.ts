import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';

interface Paginacao {
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
  limite: number;
  temProximaPagina: boolean;
  temPaginaAnterior: boolean;
}

interface Filtros {
  lojaId?: string;
  inquilinoId?: string;
  q?: string;
}

interface ResultadoInadimplentes {
  inquilinos: any[];
  paginacao: Paginacao;
  filtros: Filtros;
}

@Component({
  selector: 'app-inadimplentes',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="mb-2">
        <h2 class="text-2xl font-bold text-blue-900">Inadimplentes</h2>
        <p class="text-gray-600">Liste e filtre os inquilinos inadimplentes da sua empresa.</p>
      </div>

      <!-- Filtros -->
      <div class="bg-white border border-blue-200 rounded-xl shadow p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-blue-900">Filtros</h3>
          <button (click)="exportarPdf()" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg" [disabled]="inquilinos.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Baixar PDF
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-blue-900 mb-1">Loja (ID)</label>
            <input [(ngModel)]="filtros.lojaId" name="lojaId" type="text" placeholder="ex: LOJA123"
                   class="w-full border rounded-lg p-2 text-blue-900 focus:outline-none"
                   [ngClass]="{'border-blue-200 focus:ring-2 focus:ring-blue-500': true}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-blue-900 mb-1">Inquilino (ID)</label>
            <input [(ngModel)]="filtros.inquilinoId" name="inquilinoId" type="text" placeholder="ex: INQ456"
                   class="w-full border rounded-lg p-2 text-blue-900 focus:outline-none"
                   [ngClass]="{'border-blue-200 focus:ring-2 focus:ring-blue-500': true}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-blue-900 mb-1">Busca (q)</label>
            <input [(ngModel)]="filtros.q" name="q" type="text" placeholder="Nome, email, CPF..."
                   class="w-full border rounded-lg p-2 text-blue-900 focus:outline-none"
                   [ngClass]="{'border-blue-200 focus:ring-2 focus:ring-blue-500': true}" />
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <button (click)="aplicarFiltros()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Aplicar</button>
          <button (click)="limparFiltros()" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-blue-900 rounded-lg">Limpar</button>
        </div>
      </div>

      <!-- Área exportável (métricas + cards) -->
      <div #exportArea class="space-y-4">
        <!-- Métricas resumidas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white border border-blue-200 rounded-xl shadow p-4 flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">{{ totalInadimplentes }}</div>
            <div class="flex-1">
              <div class="text-sm text-blue-600">Total de inadimplentes</div>
              <div class="text-lg font-semibold text-blue-900">{{ totalInadimplentes }}</div>
            </div>
          </div>
          <div class="bg-white border border-blue-200 rounded-xl shadow p-4 flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 font-bold">R$</div>
            <div class="flex-1">
              <div class="text-sm text-blue-600">Total em faturas</div>
              <div class="text-lg font-semibold text-blue-900">{{ formatCurrency(totalValorFaturas) }}</div>
            </div>
          </div>
          <div class="bg-white border border-blue-200 rounded-xl shadow p-4 flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 font-bold">⏱</div>
            <div class="flex-1">
              <div class="text-sm text-blue-600">Média de dias em atraso</div>
              <div class="text-lg font-semibold text-blue-900">{{ mediaDiasAtraso !== null ? mediaDiasAtraso + ' dias' : '—' }}</div>
            </div>
          </div>
        </div>

        <!-- Resultados em Cards -->
        <div class="bg-white border border-blue-200 rounded-xl shadow p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-blue-900">Resultados</h3>
            <div class="text-sm text-blue-600" *ngIf="paginacao">Página {{ paginacao.paginaAtual }} de {{ paginacao.totalPaginas }} ({{ paginacao.totalRegistros }} registros)</div>
          </div>

          <div *ngIf="loading" class="p-2 bg-blue-50 border border-blue-200 rounded text-blue-700">Carregando inadimplentes...</div>
          <div *ngIf="error" class="p-2 bg-red-50 border border-red-200 rounded text-red-700">{{ error }}</div>
          <div *ngIf="!loading && !error && inquilinos.length === 0" class="text-blue-600">Nenhum inadimplente encontrado com os filtros informados.</div>

          <div *ngIf="!loading && !error && inquilinos.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div *ngFor="let inq of inquilinos" class="rounded-xl border border-blue-100 shadow-sm bg-gradient-to-br from-white to-blue-50">
              <div class="p-4">
                <div class="flex items-start justify-between">
                  <div>
                    <div class="text-blue-900 font-semibold text-base">{{ inq.nome || '—' }}</div>
                    <div class="mt-1 text-xs text-blue-600">{{ inq.lojaNome || '—' }}</div>
                  </div>
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Em atraso
                  </span>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-3">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h2a2 2 0 012 2v2H2V5zM2 9h6v2a2 2 0 01-2 2H4a2 2 0 01-2-2V9zM10 7V5a2 2 0 012-2h2a2 2 0 012 2v2h-6zM10 9h6v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V9z" />
                    </svg>
                    <div class="text-sm text-blue-900">{{ inq.email || '—' }}</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M2.003 5.884a1 1 0 01.632-1.265l2.79-1.035a1 1 0 011.11.31l1.965 2.36a1 1 0 01.23.64v1.415a1 1 0 01-.293.707l-1.12 1.12a11.042 11.042 0 005.516 5.516l1.12-1.12a1 1 0 01.707-.293h1.415a1 1 0 01.64.23l2.36 1.966a1 1 0 01.31 1.11l-1.036 2.79a1 1 0 01-1.265.631A15.933 15.933 0 012.003 5.884z" clip-rule="evenodd" />
                    </svg>
                    <div class="text-sm text-blue-900">{{ inq.telefone || '—' }}</div>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-3">
                  <div class="bg-white rounded-lg border border-blue-100 p-3">
                    <div class="text-xs text-blue-600">Valor da Fatura</div>
                    <div class="text-base font-semibold text-blue-900">{{ formatCurrency(inq.valorFatura) || '—' }}</div>
                  </div>
                  <div class="bg-white rounded-lg border border-blue-100 p-3">
                    <div class="text-xs text-blue-600">Dias em atraso</div>
                    <div class="text-base font-semibold text-blue-900">{{ inq.diasEmAtraso || '—' }}</div>
                  </div>
                  <div class="bg-white rounded-lg border border-blue-100 p-3 col-span-2">
                    <div class="text-xs text-blue-600">Vencimento</div>
                    <div class="text-base font-semibold text-blue-900">{{ inq.vencimento ? formatDate(inq.vencimento) : '—' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginação -->
          <div *ngIf="paginacao" class="mt-6 flex items-center gap-2">
            <button class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-blue-900 rounded-lg disabled:opacity-50"
                    [disabled]="!paginacao.temPaginaAnterior"
                    (click)="irParaPagina(paginacao.paginaAtual - 1)">Anterior</button>
            <div class="text-sm text-blue-900">Página {{ paginacao.paginaAtual }} de {{ paginacao.totalPaginas }}</div>
            <button class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-blue-900 rounded-lg disabled:opacity-50"
                    [disabled]="!paginacao.temProximaPagina"
                    (click)="irParaPagina(paginacao.paginaAtual + 1)">Próxima</button>
            <div class="ml-auto flex items-center gap-2">
              <label class="text-sm text-blue-900">Limite</label>
              <select [(ngModel)]="limite" name="limite" class="border rounded-lg p-1 text-blue-900" (change)="irParaPagina(1)">
                <option [ngValue]="10">10</option>
                <option [ngValue]="20">20</option>
                <option [ngValue]="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InadimplentesComponent implements OnInit {
  inquilinos: any[] = [];
  paginacao: Paginacao | null = null;
  filtros: Filtros = { lojaId: undefined, inquilinoId: undefined, q: undefined };
  loading = false;
  error: string | null = null;

  limite = 10;
  private EMPRESA_API_URL = 'http://localhost:3010/api/empresa/inadimplentes';

  @ViewChild('exportArea') exportAreaRef!: ElementRef<HTMLDivElement>;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadInadimplentes(1);
  }

  // Métricas calculadas
  get totalInadimplentes(): number {
    return this.inquilinos.length;
  }
  get totalValorFaturas(): number {
    return this.inquilinos.reduce((sum, i) => sum + (Number(i.valorFatura) || 0), 0);
  }
  get mediaDiasAtraso(): number | null {
    const dias = this.inquilinos.map(i => Number(i.diasEmAtraso)).filter(n => !isNaN(n));
    if (dias.length === 0) return null;
    return Math.round(dias.reduce((a, b) => a + b, 0) / dias.length);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.token;
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  aplicarFiltros(): void {
    this.loadInadimplentes(1);
  }

  limparFiltros(): void {
    this.filtros = { lojaId: undefined, inquilinoId: undefined, q: undefined };
    this.loadInadimplentes(1);
  }

  irParaPagina(pagina: number): void {
    this.loadInadimplentes(pagina);
  }

  loadInadimplentes(pagina: number): void {
    this.loading = true;
    this.error = null;

    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e: any) {
      this.loading = false;
      this.error = e?.message || 'Erro de autenticação';
      return;
    }

    let params = new HttpParams()
      .set('pagina', String(pagina))
      .set('limite', String(this.limite));
    if (this.filtros.lojaId) params = params.set('lojaId', this.filtros.lojaId);
    if (this.filtros.inquilinoId) params = params.set('inquilinoId', this.filtros.inquilinoId);
    if (this.filtros.q) params = params.set('q', this.filtros.q);

    this.http.get<ResultadoInadimplentes>(this.EMPRESA_API_URL, { headers, params })
      .subscribe({
        next: (res) => {
          // Mapeia os dados do backend para os campos desejados na UI
          this.inquilinos = (res?.inquilinos || []).map((item: any) => ({
            nome: item?.inquilino?.nome ?? item?.nome ?? '—',
            email: item?.inquilino?.email ?? item?.email ?? '—',
            telefone: item?.inquilino?.telefone ?? item?.telefone ?? '—',
            lojaNome: item?.loja?.nome ?? item?.lojaNome ?? '—',
            valorFatura: item?.fatura?.valorAluguel ?? item?.valorFatura,
            diasEmAtraso: item?.fatura?.diasEmAtraso ?? item?.diasEmAtraso,
            vencimento: item?.fatura?.vencimento ?? item?.vencimento
          }));
          this.paginacao = res?.paginacao || null;
          // Atualiza filtros refletidos pelo backend, se vierem
          if (res?.filtros) {
            this.filtros = {
              lojaId: res.filtros.lojaId,
              inquilinoId: res.filtros.inquilinoId,
              q: res.filtros.q
            };
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erro ao buscar inadimplentes';
          this.loading = false;
        }
      });
  }

  async exportarPdf(): Promise<void> {
    try {
      if (!this.inquilinos || this.inquilinos.length === 0) {
        this.error = 'Nenhum dado para exportar';
        return;
      }

      const doc = new jsPDF('p', 'mm', 'a4');

      // Cores e tipografia
      const primary = '#1e3a8a'; // azul
      const secondary = '#0ea5e9'; // azul claro
      const text = '#0f172a'; // slate-900
      const gray = '#64748b'; // slate-500

      // Cabeçalho
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, 210, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Relatório de Inadimplentes', 10, 12);

      // Subcabeçalho com filtros
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const filtrosLinha = `Loja: ${this.filtros.lojaId || '—'} | Inquilino: ${this.filtros.inquilinoId || '—'} | Busca: ${this.filtros.q || '—'}`;
      doc.text(filtrosLinha, 10, 26);

      // Métricas cards-like
      let y = 32;
      const cardW = 64;
      const cardH = 22;
      const spacing = 6;

      const drawCard = (x: number, title: string, value: string) => {
        doc.setDrawColor(30, 58, 138);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, cardW, cardH, 3, 3);
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.text(title, x + 4, y + 8);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(value, x + 4, y + 16);
        doc.setFont('helvetica', 'normal');
      };

      drawCard(10, 'Total de inadimplentes', String(this.totalInadimplentes));
      drawCard(10 + cardW + spacing, 'Total em faturas', this.formatCurrency(this.totalValorFaturas));
      drawCard(10 + (cardW + spacing) * 2, 'Média de dias em atraso', this.mediaDiasAtraso !== null ? `${this.mediaDiasAtraso} dias` : '—');

      // Título da seção
      y += cardH + 12;
      doc.setTextColor(30, 58, 138);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Inquilinos inadimplentes', 10, y);

      // Tabela de dados
      y += 6;
      const colX = [10, 70, 120, 160];
      const headers = ['Inquilino', 'Contato', 'Loja', 'Valor'];

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      headers.forEach((h, i) => doc.text(h, colX[i], y));
      y += 3;
      doc.setDrawColor(226, 232, 240);
      doc.line(10, y, 200, y);

      const rowHeight = 8;
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');

      for (const inq of this.inquilinos) {
        // Quebra de página
        if (y + rowHeight > 285) {
          doc.addPage();
          y = 18;
          // Re-renderiza cabeçalho da tabela
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          headers.forEach((h, i) => doc.text(h, colX[i], y));
          y += 3;
          doc.setDrawColor(226, 232, 240);
          doc.line(10, y, 200, y);
          doc.setTextColor(15, 23, 42);
        }

        y += 5;
        // Inquilino (nome)
        doc.setFont('helvetica', 'bold');
        doc.text((inq.nome || '—').toString(), colX[0], y);
        doc.setFont('helvetica', 'normal');

        // Contato (email + telefone)
        const contato = [inq.email, inq.telefone].filter(Boolean).join(' | ') || '—';
        doc.text(contato, colX[1], y);

        // Loja
        doc.text((inq.lojaNome || '—').toString(), colX[2], y);

        // Valor
        doc.text((this.formatCurrency(inq.valorFatura) || '—').toString(), colX[3], y);

        y += 3;
        // Linha separadora
        doc.setDrawColor(241, 245, 249);
        doc.line(10, y, 200, y);
      }

      // Rodapé
      const footerY = 290;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 10, footerY);

      doc.save(`inadimplentes_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error(e);
      this.error = 'Falha ao gerar PDF';
    }
  }

  formatCurrency(value: number | string | undefined): string {
    if (value === undefined || value === null) return '';
    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return String(value);
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatDate(value: string | Date): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('pt-BR');
  }
}