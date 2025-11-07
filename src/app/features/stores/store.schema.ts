import { z } from 'zod';

// Enum para status da loja
export const statusLojaEnum = z.enum(['VAGA', 'OCUPADA', 'INATIVA']);

// Schema para criação de loja
export const criarLojaSchema = z.object({
  nome: z.string().min(1, "Nome da loja é obrigatório"),
  numero: z.string().min(1, "Número da loja é obrigatório"),
  localizacao: z.string().min(1, "Localização é obrigatória"),
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
});

// Tipo inferido do schema
export type CriarLojaData = z.infer<typeof criarLojaSchema>;