export enum StatusFatura {
  PENDENTE = 'PENDENTE',
  PAGA = 'PAGA',
  EM_ATRASO = 'EM_ATRASO',
  VENCIDA = 'VENCIDA'
}

export interface IPortalInquilinoData {
  inquilino: {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
  };
  lojas: ILojaInquilino[];
  faturas: {
    pendentes: IFaturaInquilino[];
    emAtraso: IFaturaInquilino[];
    proximasVencer: IFaturaInquilino[];
    pagas: IFaturaInquilino[];
  };
  notificacoes: INotificacaoInquilino[];
  resumoFinanceiro: IResumoFinanceiro;
}

export interface ILojaInquilino {
  id: string;
  nome: string;
  numero: string;
  localizacao: string;
  categoria?: string;
  area?: number;
  contrato: {
    id: string;
    valorAluguel: number;
    dataInicio: Date;
    dataFim: Date;
    dataVencimento: number;
    status: string;
  };
}

export interface IFaturaInquilino {
  id: string;
  valorAluguel: number;
  dataVencimento: Date;
  mesReferencia: number;
  anoReferencia: number;
  status: StatusFatura;
  diasParaVencimento?: number;
  diasEmAtraso?: number;
  efiCobrancaId?:number;
  loja: {
    id: string;
    nome: string;
    numero: string;
    localizacao: string;
  };
}

export interface INotificacaoInquilino {
  id: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  enviadaEm: Date;
}

export interface IResumoFinanceiro {
  totalFaturasPendentes: number;
  valorTotalPendente: number;
  faturasPagas: number;
  faturasEmAtraso: number;
  proximoVencimento?: Date;
}