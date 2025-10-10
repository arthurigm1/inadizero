export interface Contract {
  id: string;
  lojaId: string;
  inquilinoId: string;
  valorAluguel: number;
  dataInicio: string;
  dataFim: string;
  reajusteAnual: boolean;
  percentualReajuste?: number;
  clausulas?: string;
  dataVencimento?: number;
  observacoes?: string;
  status: ContractStatus;
  criadoEm: string;
  atualizadoEm: string;
  
  // Dados relacionados (populados pelo backend)
  loja?: {
    id: string;
    nome: string;
    numero: string;
    localizacao?: string;
  };
  inquilino?: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
  };
}

// Interface para resposta detalhada do contrato
export interface ContractDetailResponse {
  sucesso: boolean;
  contrato: Contract;
}

export enum ContractStatus {
  ATIVO = 'ATIVO',
  VENCIDO = 'VENCIDO',
  RESCINDIDO = 'RESCINDIDO',
  SUSPENSO = 'SUSPENSO'
}

export interface CreateContractRequest {
  lojaId: string;
  inquilinoId: string;
  valorAluguel: number;
  dataInicio: string;
  dataFim: string;
  dataVencimento: number;
  reajusteAnual?: boolean;
  percentualReajuste?: number;
  clausulas?: string;
  observacoes?: string;
}

export interface UpdateContractRequest {
  valorAluguel?: number;
  dataFim?: string;
  reajusteAnual?: boolean;
  percentualReajuste?: number;
  clausulas?: string;
  observacoes?: string;
  status?: ContractStatus;
  ativo?: boolean;
  inquilinoId?: string;
}



export interface ContractRenewRequest {
  novaDataFim: string;
  novoValor?: number;
}

export interface ExpiringContractsRequest {
  dias: number;
}

export interface UpdateExpiredStatusResponse {
  message: string;
  updatedCount: number;
}

export interface ContractFilters {
  status?: ContractStatus;
  ativo?: boolean;
  lojaId?: string;
  inquilinoId?: string;
  dataInicioMin?: string;
  dataInicioMax?: string;
  dataFimMin?: string;
  dataFimMax?: string;
  page?: number;
  limit?: number;
}

export interface ContractListResponse {
  contracts: Contract[];
  total: number;
}

export interface ExpiringContractsRequest {
  dias: number;
}

export interface ContractStats {
  activeContracts: number;
  pendingContracts: number;
  expiringSoon: number;
  totalRevenue: number;
}

// Interfaces para selects
export interface StoreOption {
  id: string;
  nome: string;
  numero: string;
}

export interface TenantOption {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}