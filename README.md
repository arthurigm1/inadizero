# Inadizero — Guia de Uso

Aplicação Angular para gestão de faturas, contratos, lojas, usuários e inadimplentes. Utiliza Tailwind CSS e componentes standalone do Angular.

## Requisitos

- Node.js `>= 18`
- npm `>= 9`
- Angular CLI (recomendado) `>= 17`
- Backend API acessível em `http://localhost:3010` (endpoints da empresa)

## Instalação

```bash
cd inadizero
npm install
```

## Desenvolvimento

- Iniciar servidor local:

```bash
npm start
```

- Acesse `http://localhost:4200/`.
- Caso a porta 4200 esteja ocupada, execute:

```bash
npm run start -- --port 4300
```

E acesse `http://localhost:4300/`.

Hot-reload está habilitado: alterações em arquivos de `src/` recarregam a aplicação automaticamente.

## Configuração de API e Autenticação

- O app consome endpoints REST da empresa. Exemplo utilizado no módulo de inadimplentes:
  - `GET http://localhost:3010/api/empresa/inadimplentes`
  - Requer cabeçalho `Authorization: Bearer <token>` (gerenciado por `AuthService`).
- Garanta que você está autenticado pela própria aplicação para preencher o token.
- Se precisar alterar URLs de API, ajuste os serviços ou mova as URLs para `environment.ts` conforme sua preferência de configuração.

## Scripts úteis

- Build de produção:

```bash
npm run build
```

Os artefatos serão gerados em `dist/inadizero/`.

- Testes unitários (se configurados):

```bash
npm test
```

- Lint (se disponível no `package.json`):

```bash
npm run lint
```

## Padrões de UI e Paginação

- A paginação segue um padrão responsivo unificado:
  - Mobile: botões "Anterior" e "Próximo" com ícones e estados de desabilitado.
  - Desktop: texto "Mostrando X a Y de Z resultados" com navegação por setas e seletor de limite quando aplicável.
- Este padrão está aplicado em Faturas, Lojas, Usuários e Inadimplentes.

## Estrutura do Projeto (resumo)

- `src/app/features/` — módulos e componentes principais (ex.: `invoices`, `contracts`, `stores`, `users`, `dashboard/inadimplentes`).
- `src/styles.css` — estilos globais e integração com Tailwind.
- `tailwind.config.js` — configuração do Tailwind CSS.

## Build e Deploy

```bash
npm run build
```

- Sirva o conteúdo de `dist/inadizero/` com um servidor estático (Nginx, Apache, ou qualquer serviço de hospedagem de SPA).

## Troubleshooting

- API indisponível/CORS: valide se o backend está rodando em `http://localhost:3010` e se as rotas estão acessíveis.
- Token ausente: faça login pela aplicação; erros como "Token de autenticação não encontrado" indicam falta de autenticação.
- Porta ocupada: utilize `--port 4300` para iniciar em outra porta.
- Estilos não aplicados: confira `tailwind.config.js` e a importação do Tailwind em `styles.css`.

## Referências

- Angular CLI: https://angular.dev/tools/cli
- Tailwind CSS: https://tailwindcss.com/
