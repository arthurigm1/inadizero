export interface Loja {
  id: string;
  nome: string;
  numero: string;
  localizacao: string;
  status: string;
  empresaId: string;
  usuarioId: string;
  criadoEm: string;
}

export interface Inquilino {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
}

export interface Contrato {
  id: string;
  lojaId: string;
  inquilinoId: string;
  valorAluguel: number;
  dataInicio: string;
  dataFim: string;
  dataVencimento: number;
  reajusteAnual: boolean;
  percentualReajuste: number | null;
  clausulas: string;
  observacoes: string;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
  loja: Loja;
  inquilino: Inquilino;
}

export interface Fatura {
  id: string;
  contratoId: string;
  mesReferencia: number;
  anoReferencia: number;
  valorAluguel: number;
  dataVencimento: string;
  dataGeracao: string;
  status: string;
  efiCobrancaId: string;
  criadoEm: string;
  atualizadoEm: string;
  contrato: Contrato;
}

export interface FaturaResponse {
  sucesso: boolean;
  mensagem: string;
  data: {
    faturas: Fatura[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}