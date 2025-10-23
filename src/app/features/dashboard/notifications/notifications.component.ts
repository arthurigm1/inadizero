import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';

interface Tenant {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  telefone: string | null;
}

interface TenantsResponse {
  sucesso: boolean;
  inquilinos: Tenant[];
}

// Define o payload aceito pelas rotas enviar-sistema e enviar-email
interface EnviarPredefinidasPayload {
  tipo: TipoNotificacao;
  mensagem: string;
  assunto?: string;
  inquilinoId?: string;
}

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="mb-2">
        <h2 class="text-2xl font-bold text-blue-900">Notificações</h2>
        <p class="text-gray-600">Envie notificações pré-definidas por sistema ou e-mail para todos ou para um inquilino específico.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Formulário de envio de notificações -->
        <div class="bg-white border border-blue-200 rounded-xl shadow p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-blue-900">Enviar Notificações</h3>
          </div>

          <!-- Seleção de destinatário e tipo -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-blue-900 mb-1">Destinatário</label>
              <select class="w-full border rounded-lg p-2 text-blue-900 focus:outline-none" [(ngModel)]="selectedTenantId" name="destinatario"
                      [ngClass]="{'border-blue-200 focus:ring-2 focus:ring-blue-500': true}">
                <option [ngValue]="null">Todos os inquilinos</option>
                <option *ngFor="let t of tenants" [ngValue]="t.id">{{ t.nome }} ({{ t.email }})</option>
              </select>
              <div class="text-xs text-blue-600 mt-1">{{ selectedTenantId ? 'Enviando para inquilino específico' : 'Enviando para todos os inquilinos' }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-900 mb-1">Tipo</label>
              <select class="w-full border rounded-lg p-2 text-blue-900 focus:outline-none" [(ngModel)]="form.tipo" name="tipo"
                      [ngClass]="{'border-blue-200 focus:ring-2 focus:ring-blue-500': true}">
                <option [ngValue]="TipoNotificacao.PAGAMENTO_VENCIDO">Pagamento vencido</option>
                <option [ngValue]="TipoNotificacao.PAGAMENTO_PROXIMO_VENCIMENTO">Pagamento próximo do vencimento</option>
                <option [ngValue]="TipoNotificacao.PAGAMENTO_REALIZADO">Pagamento realizado</option>
                <option [ngValue]="TipoNotificacao.CONTRATO_VENCIMENTO">Contrato próximo do vencimento</option>
                <option [ngValue]="TipoNotificacao.GERAL">Geral</option>
              </select>
            </div>
          </div>

          <!-- Assunto -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-blue-900 mb-1">Assunto (opcional)</label>
            <input type="text" class="w-full border rounded-lg p-2 text-blue-900 focus:outline-none"
                   [(ngModel)]="form.assunto" name="assunto" [placeholder]="getDefaultSubject(form.tipo)" maxlength="200"
                   [ngClass]="{'border-blue-200 focus:ring-2 focus:ring-blue-500': isAssuntoValido(), 'border-red-300 focus:ring-2 focus:ring-red-500': !isAssuntoValido()}" />
            <div class="flex items-center justify-between mt-1">
              <div class="text-xs text-blue-600">{{ assuntoLength }}/200</div>
              <div class="w-2/3 h-1 bg-blue-100 rounded overflow-hidden">
                <div class="h-1 bg-blue-500" [style.width.%]="assuntoProgress"></div>
              </div>
            </div>
          </div>

          <!-- Mensagem -->
          <div>
            <label class="block text-sm font-medium text-blue-900 mb-1">Mensagem</label>
            <textarea rows="5" class="w-full border rounded-lg p-2 text-blue-900 focus:outline-none"
                      [(ngModel)]="form.mensagem" name="mensagem" placeholder="Escreva a mensagem a ser enviada" maxlength="500"
                      [ngClass]="{'border-blue-200 focus:ring-2 focus:ring-blue-500': isMensagemValida(), 'border-red-300 focus:ring-2 focus:ring-red-500': !isMensagemValida()}"
            ></textarea>
            <div class="flex items-center justify-between mt-1">
              <div class="text-xs" [class.text-red-600]="!isMensagemValida()" [class.text-blue-600]="isMensagemValida()">
                {{ isMensagemValida() ? 'Mensagem válida' : 'Mensagem é obrigatória (1-500 caracteres)' }}
              </div>
              <div class="text-xs text-blue-600">{{ mensagemLength }}/500</div>
            </div>
            <div class="w-full h-1 bg-blue-100 rounded overflow-hidden mt-1">
              <div class="h-1 bg-blue-500" [style.width.%]="mensagemProgress"></div>
            </div>
          </div>

          <!-- Ações -->
          <div class="mt-5 flex flex-wrap gap-3">
            <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                    (click)="sendSystemNotification()" [disabled]="sendingSystem || !isFormValido()">
              <span>Enviar no Sistema</span>
              <svg *ngIf="sendingSystem" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </button>
            <button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                    (click)="sendEmailNotification()" [disabled]="sendingEmail || !isFormValido()">
              <span>Enviar por Email</span>
              <svg *ngIf="sendingEmail" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </button>
            <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-blue-900 rounded-lg" (click)="resetForm()" [disabled]="sendingSystem || sendingEmail">Limpar</button>
          </div>

          <!-- Resultado/Erro -->
          <div class="mt-3 space-y-2">
            <div *ngIf="sendResult" class="p-2 text-sm bg-green-50 border border-green-200 rounded text-green-700">{{ sendResult }}</div>
            <div *ngIf="sendError" class="p-2 text-sm bg-red-50 border border-red-200 rounded text-red-700">{{ sendError }}</div>
          </div>

          <!-- Resumo do envio -->
          <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div class="text-sm text-blue-900">
              <span class="font-medium">Resumo:</span>
              <span class="ml-1">Tipo: {{ getTipoLabel(form.tipo) }}</span>
              <span class="ml-2">Assunto: {{ (form.assunto || getDefaultSubject(form.tipo)) }}</span>
              <span class="ml-2">Destinatário: {{ destinatarioLabel }}</span>
            </div>
          </div>
        </div>

        <!-- Lista de inquilinos -->
        <div class="bg-white border border-blue-200 rounded-xl shadow p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-blue-900">Inquilinos</h3>
            <span class="text-sm text-blue-600">Total: {{ tenants.length }}</span>
          </div>

          <div *ngIf="tenants.length === 0 && !loading && !error" class="text-blue-600">Nenhum inquilino encontrado.</div>
          <div *ngIf="loading" class="p-2 bg-blue-50 border border-blue-200 rounded text-blue-700">Carregando inquilinos...</div>
          <div *ngIf="error" class="p-2 bg-red-50 border border-red-200 rounded text-red-700">{{ error }}</div>

          <ul class="divide-y divide-blue-100">
            <li *ngFor="let t of tenants" class="py-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-900 font-medium">{{ t.nome }}</p>
                  <p class="text-blue-600 text-sm">{{ t.email }}</p>
                </div>
                <button class="text-sm px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                        (click)="selectedTenantId = t.id">Selecionar</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class NotificacoesComponent implements OnInit {
  tenants: Tenant[] = [];
  loading = false;
  error: string | null = null;

  // Estado do formulário de envio
  TipoNotificacao = TipoNotificacao;
  form: { tipo: TipoNotificacao; assunto: string; mensagem: string } = {
    tipo: TipoNotificacao.GERAL,
    assunto: '',
    mensagem: ''
  };
  selectedTenantId: string | null = null;
  sendingSystem = false;
  sendingEmail = false;
  sendResult: string | null = null;
  sendError: string | null = null;

  // Base URL de notificações (ajuste se necessário de acordo com seu backend)
  private NOTIF_API_URL = 'http://localhost:3010/api/notificacao';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTenants();
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

  // Helpers de formulário
  isMensagemValida(): boolean {
    const len = (this.form.mensagem || '').trim().length;
    return len >= 1 && len <= 500;
  }

  isAssuntoValido(): boolean {
    const len = (this.form.assunto || '').trim().length;
    return len === 0 || (len >= 1 && len <= 200);
  }

  isFormValido(): boolean {
    return !!this.form.tipo && this.isMensagemValida() && this.isAssuntoValido();
  }

  resetForm(): void {
    this.form.assunto = '';
    this.form.mensagem = '';
    this.sendResult = null;
    this.sendError = null;
  }

  getDefaultSubject(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.PAGAMENTO_VENCIDO:
        return 'Pagamento vencido';
      case TipoNotificacao.PAGAMENTO_PROXIMO_VENCIMENTO:
        return 'Pagamento próximo do vencimento';
      case TipoNotificacao.PAGAMENTO_REALIZADO:
        return 'Pagamento realizado';
      case TipoNotificacao.CONTRATO_VENCIMENTO:
        return 'Contrato próximo do vencimento';
      case TipoNotificacao.GERAL:
      default:
        return 'Aviso geral';
    }
  }

  // Labels de tipo
  getTipoLabel(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.PAGAMENTO_VENCIDO:
        return 'Pagamento vencido';
      case TipoNotificacao.PAGAMENTO_PROXIMO_VENCIMENTO:
        return 'Pagamento próximo do vencimento';
      case TipoNotificacao.PAGAMENTO_REALIZADO:
        return 'Pagamento realizado';
      case TipoNotificacao.CONTRATO_VENCIMENTO:
        return 'Contrato próximo do vencimento';
      case TipoNotificacao.GERAL:
      default:
        return 'Geral';
    }
  }

  // Destinatário label
  get destinatarioLabel(): string {
    if (this.selectedTenantId) {
      const t = this.tenants.find(tt => tt.id === this.selectedTenantId);
      return t ? `${t.nome} (${t.email})` : 'Inquilino selecionado';
    }
    return 'Todos os inquilinos';
  }

  // Contadores e progresso
  get mensagemLength(): number { return (this.form.mensagem || '').length; }
  get assuntoLength(): number { return (this.form.assunto || '').length; }
  get mensagemProgress(): number {
    const len = (this.form.mensagem || '').length;
    return Math.min(100, Math.round((len / 500) * 100));
  }
  get assuntoProgress(): number {
    const len = (this.form.assunto || '').length;
    return Math.min(100, Math.round((len / 200) * 100));
  }

  // Envio de notificações pré-definidas dentro do sistema
  sendSystemNotification(): void {
    if (!this.isFormValido()) {
      this.sendError = 'Formulário inválido. Verifique os campos.';
      this.sendResult = null;
      return;
    }

    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e: any) {
      this.sendError = e?.message || 'Erro de autenticação';
      this.sendResult = null;
      return;
    }

    const payload: EnviarPredefinidasPayload = {
      tipo: this.form.tipo,
      mensagem: this.form.mensagem.trim()
    };
    const assuntoTrim = (this.form.assunto || '').trim();
    if (assuntoTrim.length > 0) {
      payload.assunto = assuntoTrim;
    }
    if (this.selectedTenantId) {
      payload.inquilinoId = this.selectedTenantId;
    }

    this.sendingSystem = true;
    this.sendError = null;
    this.sendResult = null;

    const url = `${this.NOTIF_API_URL}/enviar-sistema`;
    this.http.post<{ sucesso?: boolean; message?: string }>(url, payload, { headers }).subscribe({
      next: (res) => {
        this.sendingSystem = false;
        this.sendResult = res?.message || 'Notificações no sistema enviadas com sucesso!';
      },
      error: (err) => {
        this.sendingSystem = false;
        if (err?.status === 403) {
          this.sendError = 'Você não tem permissão para enviar notificações.';
        } else {
          this.sendError = err?.error?.message || 'Erro ao enviar notificações no sistema.';
        }
      }
    });
  }

  // Envio de notificações pré-definidas por email
  sendEmailNotification(): void {
    if (!this.isFormValido()) {
      this.sendError = 'Formulário inválido. Verifique os campos.';
      this.sendResult = null;
      return;
    }

    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e: any) {
      this.sendError = e?.message || 'Erro de autenticação';
      this.sendResult = null;
      return;
    }

    const payload: EnviarPredefinidasPayload = {
      tipo: this.form.tipo,
      mensagem: this.form.mensagem.trim()
    };
    const assuntoTrim = (this.form.assunto || '').trim();
    if (assuntoTrim.length > 0) {
      payload.assunto = assuntoTrim;
    }
    if (this.selectedTenantId) {
      payload.inquilinoId = this.selectedTenantId;
    }

    this.sendingEmail = true;
    this.sendError = null;
    this.sendResult = null;

    const url = `${this.NOTIF_API_URL}/enviar-email`;
    this.http.post<{ sucesso?: boolean; message?: string }>(url, payload, { headers }).subscribe({
      next: (res) => {
        this.sendingEmail = false;
        this.sendResult = res?.message || 'Notificações por email enviadas com sucesso!';
      },
      error: (err) => {
        this.sendingEmail = false;
        if (err?.status === 403) {
          this.sendError = 'Você não tem permissão para enviar notificações por email.';
        } else {
          this.sendError = err?.error?.message || 'Erro ao enviar notificações por email.';
        }
      }
    });
  }

  private loadTenants(): void {
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

    // Mantém compatibilidade com a API usada no projeto
    const url = 'http://localhost:3010/api/usuario/inquilinos';

    this.http.get<TenantsResponse | { sucesso?: boolean; inquilinos?: Tenant[] } | Tenant[]>(url, { headers })
      .subscribe({
        next: (response: any) => {
          // Aceitar múltiplos formatos de resposta
          if (Array.isArray(response)) {
            this.tenants = response as Tenant[];
          } else if (response?.inquilinos) {
            this.tenants = response.inquilinos as Tenant[];
          } else {
            this.tenants = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar inquilinos:', err);
          this.error = err?.error?.message || 'Erro ao buscar inquilinos';
          this.loading = false;
        }
      });
  }
}

enum TipoNotificacao {
  PAGAMENTO_VENCIDO = 'PAGAMENTO_VENCIDO',
  PAGAMENTO_PROXIMO_VENCIMENTO = 'PAGAMENTO_PROXIMO_VENCIMENTO',
  PAGAMENTO_REALIZADO = 'PAGAMENTO_REALIZADO',
  CONTRATO_VENCIMENTO = 'CONTRATO_VENCIMENTO',
  GERAL = 'GERAL'
}