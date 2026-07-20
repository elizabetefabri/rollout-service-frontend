# Implementação — Frontend Rollout Service

> Documento de entrega: o que foi implementado, análise com base na `documentacao.md`,
> decisões técnicas e o que ainda falta. Gerado nesta rodada de trabalho.

## 1. Resumo

Nesta entrega foram implementados a **Tabela Inteligente reutilizável**, o **sidebar de
navegação**, o **layout corporativo (shell)**, o **roteamento completo do domínio** e a
página **Repositórios/Applications** totalmente funcional (com camada de serviço + mock
fallback). As demais telas ficaram como scaffold consistente, já ligadas ao roteamento e
ao sidebar.

## 2. Observação importante sobre a stack

As instruções do projeto citam **Angular 17.2**, mas o repositório está em **Angular 21.2**
com **PrimeNG 21.1** e **@primeuix/themes (Aura)**. Segui a stack **realmente instalada**
(`package.json`), usando standalone components, signals e o novo control-flow (`@if/@for/@switch`).

Consequência relevante: **o PrimeNG 21 não possui mais o componente `Sidebar` de navegação**
(virou `Drawer`). O `sidebar.html` anterior usava tags `p-sidebar-layout`, `p-sidebar-menu`,
`pSidebarMenuButton` etc. que **não existem** na biblioteca — só “compilavam” porque
`CUSTOM_ELEMENTS_SCHEMA` silencia tags desconhecidas, ou seja, o sidebar não renderizava de
fato. Por isso ele foi **reconstruído** (ver seção 3.4).

## 3. O que foi implementado

### 3.1 Tipos, models e enums do domínio (`core/`)

- `core/types/enums.type.ts` — `ReleaseStatus`, `ReleaseTrainStatus`, `Audience`, `PublicKind`
  e `TERMINAL_RELEASE_STATUSES`, com os mesmos valores dos seeds do backend
  (UPPERCASE_WITH_UNDERSCORES).
- `core/models/pagination.models.ts` — `Pagination`, `PagedResult<T>`, `DEFAULT_PAGE_SIZE`,
  `PAGE_SIZE_OPTIONS`, `emptyPage()`. Espelham o envelope `{ data: { items, pagination } }`.
- `core/models/application.models.ts` — `Application` e `RepositoryRow` (visão denormalizada
  da tela Repositórios).
- `core/models/{release,release-train,package}.models.ts` — interfaces tipadas reais
  (antes eram stubs `class { id: number }`).
- `core/types/table.type.ts` — contrato completo da SmartTable (`TableColumn`, `TableCellType`,
  `TableAction`, `TableLazyEvent`, `TableActionEvent`, `TableBadgeSeverity`, `TableState`).
- `core/types/query.type.ts` — `ListQuery` (page, pageSize, sort, filters, search, context),
  `defaultQuery()` e `toHttpParams()`.

### 3.2 Ícones lucide (`shared/icons/icon.registry.ts`)

Registrados os ícones que faltavam para o sidebar e a tabela: `calendar-minus-2`, `tool-case`,
`paw-print`, `chevron-down`, `git-branch`, `ellipsis-vertical`, `refresh-cw`, `arrow-up-down`
(import + `provideLucideIcons` + `REGISTERED_ICONS`).

### 3.3 Tabela Inteligente (`shared/components/smart-table/`)

Componente **burro** (`OnPush`, inputs/outputs), desacoplado de regra de negócio:

- **Paginação e ordenação server-side (lazy)** via `p-table`. A conversão de base
  (PrimeNG usa `first` base 0; o domínio usa `page` base 1) é feita **no componente**,
  na fronteira — conforme o contrato (“adaptar na camada de integração, não no visual”).
- **Renderização por tipo de célula**: `text`, `code`, `badge` (p-tag), `progress`
  (p-progressBar), `percent`, `date`, `datetime`, `link` (routerLink/href), `icon-text`,
  `actions` (célula isolada) e `custom` (template projetado por `templateKey`).
- **Estados visuais padronizados**: loading inicial (skeleton), empty state, error state com
  **retry**, e **refresh** (barra sutil mantendo os dados já exibidos).
- Inputs: `columns`, `value`, `totalRecords`, `pageSize`, `loading`, `refreshing`, `error`,
  `actions`, `dataKey`, mensagens e `cellTemplates`. Outputs: `lazyLoad`, `action`, `rowClick`, `retry`.
- Testes: `smart-table.spec.ts` (criação, conversão lazy 0→1, emissão de ação, getter de célula).

### 3.4 Sidebar (`shared/components/sidebar/`)

Reconstruído com **PrimeNG PanelMenu vertical** + ícones lucide (via `pTemplate="item"`), seguindo
os comentários do projeto: **Calendário, Quality Budget, Dogfooding, Rollouts (submenu: Release
Trains, Applications, Release Trains Schedulers), Configurações**, com logo no topo e
avatar + Sair no rodapé. Navegação por `routerLink` + `routerLinkActive`. Cores/typografia vêm
**exclusivamente dos tokens do tema** (variáveis CSS existentes).

### 3.5 Layout shell e rotas

- `shared/components/layout/` — shell corporativo: sidebar (fixa no desktop, drawer no mobile
  com backdrop), topbar com toggle + `<app-header>`, área principal responsiva com
  `<router-outlet>` e `<app-footer>`.
- `app.routes.ts` — todas as rotas sob o shell: `/applications`, `/applications/:id`,
  `/release-trains`, `/release-trains/:id`, `/release-train-schedulers`,
  `/release-train-schedulers/:id`, `/dashboard`, `/dashboard-red`, além de
  `/calendario`, `/quality-budget`, `/dogfooding`, `/configuracoes` (placeholder).
- Correções: `App` tinha `template` **e** `templateUrl` ao mesmo tempo (erro de compilação) —
  corrigido. `Dashboard` montava seu próprio shell e usava `(toggleExpanded)` num sidebar que
  não existe mais — reescrito para ser página de conteúdo (health do backend).

### 3.6 Página Repositórios/Applications (completa)

- `applications.service.ts` — `GET /v1/applications` com `getPaged` (novo método no `ApiService`),
  **fallback para mock** enquanto o backend Go não estiver no ar.
- `applications.mock.ts` — dataset de referência (35 repositórios, versões, cargas, GMUD, estados),
  com busca/ordenação/paginação em memória simulando o servidor.
- `applications.facade.ts` — estado em **signals** (rows, total, loading, refreshing, error, query)
  e orquestração (load/onLazy/search/refresh/retry). Fornecida no nível da página.
- `applications.ts` + `.html` — container inteligente com a SmartTable e as **colunas de
  referência**: Repositório (link, ordenável), Versão (code), Rollout (progress), Carga
  (percent, ordenável), Estado (badge), Público, GMUD (code), Atualizado em (datetime, ordenável)
  e Ações (ver/editar/excluir). Busca com debounce + botão Atualizar.
- Testes: `applications.spec.ts` e `applications.service.spec.ts` (unwrap do envelope + fallback).

### 3.7 Scaffold das demais páginas

`shared/components/page-scaffold/` (bloco reutilizável) alimenta release-trains, release-trains-detail,
release-train-schedulers(+detail), applications-detail e dashboard-red — visual consistente, já
navegáveis pelo sidebar. Specs ajustados para os novos providers.

## 4. Análise com base na `documentacao.md`

| Item da documentação | Como o frontend atende |
| --- | --- |
| Envelope `{ data: { items, pagination } }` | `PagedResult<T>` + `ApiService.getPaged()` desembrulham `data`. |
| Paginação `page/limit/total` | `Pagination` + paginador da SmartTable; `DEFAULT_PAGE_SIZE = 10`. |
| Query com page, pageSize, sort, filters, search, context | `ListQuery` + `toHttpParams()`. |
| Base 1 (backend) vs base 0 (PrimeNG `first`) | Convertido dentro da SmartTable (`onLazyLoad`). |
| Enums de status/audience (UPPERCASE) | `enums.type.ts` com valores idênticos aos seeds. |
| Colunas de referência do rollout | Implementadas na página Applications (seção 3.6). |
| Estados: loading, empty, error+retry, refresh | Implementados na SmartTable. |
| Ordenação só em Repositório, Carga e Atualizado em | Configurado via `sortable` nessas colunas. |
| Rollout = progresso visual; Carga = percentual; Estado = badge; Ações isoladas | Tipos `progress`/`percent`/`badge`/`actions`. |
| Não acoplar componente visual ao HTTP | Fluxo Página → Facade → Service; SmartTable é burra. |

## 5. Decisões técnicas

- **PanelMenu no lugar do `p-sidebar-*`** (inexistente no PrimeNG 21), conforme escolhido.
- **Sidebar em superfície clara** usando tokens do tema (`--color-background-default`, `--color-accent-*`),
  para casar com a imagem de referência. O token `--color-sidebar-background` existente é escuro
  (`#201f25`) e deixaria o texto ilegível com o tema Aura claro — por isso não foi usado como fundo.
  Se você quiser o sidebar escuro, dá pra trocar os tokens no `sidebar.scss` sem mexer em estrutura.
- **SmartTable genérica com default `any`** no parâmetro de tipo: o Angular não infere genéricos de
  componentes a partir de inputs, então esse default permite passar `TableColumn<RepositoryRow>[]`
  com tipagem forte no ponto de definição (única exceção ao “evitar any”, isolada e comentada).
- **Mock fallback** no service: as telas funcionam de imediato; ao subir o backend, o retorno real
  passa a prevalecer (o mock só entra no `catchError`).

## 6. O que ainda falta implementar

- **NgRx (feature slices)**: hoje o estado da tela usa uma **facade com signals**. O `provideStore`/
  `provideEffects` já estão no `app.config`, mas faltam actions/reducers/effects/selectors por domínio
  (a facade foi desenhada para ser o ponto de troca para NgRx sem tocar no componente visual).
- **Integração real das demais telas** (Release Trains, Schedulers, detalhes) na SmartTable — a base
  já está pronta para reuso.
- **Ações de negócio** `PUT /releases/{id}` e `PUT /release-trains/{id}` (pause, resume, cancel,
  stepback, postpone, deploy, rollback) + confirmações (p-confirmDialog) e toasts.
- **Filtros combináveis na UI** (a query já suporta `filters`; falta o painel de filtros).
- **Headers obrigatórios** `Authorization`, `correlationID`, `flowID` no interceptor + auth real.
- **i18n/locale pt-BR** para o `DatePipe` (hoje usa formato explícito `dd/MM/yy - HH:mm`).
- **E2E Cypress** e ampliação da cobertura de testes unitários (reducers/effects/selectors quando o NgRx entrar).
- **Acessibilidade fina** e revisão responsiva em telas muito estreitas (colunas já têm `hideOnMobile`).

## 7. Recomendações (o que ficaria melhor)

- Padronizar o **status → severidade/label** num único helper compartilhado (`shared/`), reutilizável
  por todas as telas que exibem `Estado`.
- Extrair um **`ListFacade<T>` base** para reaproveitar a orquestração (load/onLazy/search/refresh/retry)
  entre Applications, Release Trains e Schedulers.
- Quando o backend expuser a “rollout view”, alinhar o endpoint real (hoje aponto para `/v1/applications`)
  e remover o mock, deixando o `error state` da SmartTable aparecer de fato.

## 8. Como validar localmente

```bash
npm install
npm start          # ng serve --port 6002
npm test           # Jest (unitários)
npm run build      # build de produção (type-check completo)
npm run lint       # ESLint
```

> Observação: nesta sessão o sandbox de build não pôde ser iniciado, então a verificação foi feita
> por inspeção (APIs/seletores do PrimeNG 21, contratos e tipos). Rode `npm run build` e `npm test`
> localmente como verificação final.

---

## 9. Atualização (rodada 2)

### 9.1 Correção dos erros de compilação

- **SmartTable genérica**: a constraint `T extends Record<string, unknown>` impedia o Angular de
  inferir o genérico a partir de modelos sem index signature (ex.: `RepositoryRow`), fazendo o
  checker usar o bound `Record<string, unknown>` e quebrar os `@Input`. Trocado para `T = any`
  (o Angular passa a inferir `T` dos inputs do consumidor, mantendo tipagem forte no ponto de
  definição). Indexação de linha castada (`row as Record<string, unknown>`) e `date` pipe com
  `$any(...)`. Isso resolve os 7 erros TS reportados.

### 9.2 Feature-toggle de mock (todo o site mockado)

- `environment.featureToggle.mock` — `true` em dev, `false` em prod. Serviços consultam o flag e
  trocam entre **mock** (`core/data`) e **API real** sem tocar nos componentes. Ver `STACK.md`.

### 9.3 `core/data` (mocks de contexto)

- `core/data/repositories.mock.ts` — dataset de repositórios + paginação/busca/ordenação em memória.
- `core/data/users.mock.ts` — usuários mock + `authenticateMock`/`registerMock`/`createMockSession`.
- `core/data/index.ts` — barrel.

### 9.4 Reorganização de Applications para `core/*`

- `applications.service` → **`core/services/applications/`** (agora mock-aware).
- `applications.facade` → **`core/facades/applications/`**.
- `applications.mock` → **`core/data/repositories.mock.ts`**.
- A página `pages/applications/applications.ts` passou a importar a facade de `core`.

> **Ação necessária (não deu para deletar no sandbox desta sessão):** exclua os 4 arquivos antigos,
> hoje vazios/deprecados, em `src/app/pages/applications/`:
> `applications.service.ts`, `applications.facade.ts`, `applications.mock.ts`, `applications.service.spec.ts`.
> A pasta deve ficar apenas com o container: `applications.ts/.html/.scss/.spec.ts`.

### 9.5 Autenticação mockada + Login/Cadastro (`features/auth`)

- `AuthService` ganhou suporte a mock (login/register/logout) via `featureToggle`.
- `features/auth/auth-layout` — layout próprio das telas de auth (sem shell).
- `features/auth/login` e `features/auth/register` — formulários reativos + PrimeNG.
- **Credenciais de teste:** `admin@itau.com` / `123456` e `liza@itau.com` / `123456`. O cadastro
  adiciona o usuário ao mock e já faz login automático.

### 9.6 Rotas de auth + guard (corrige o erro de rota)

- Rotas `/login` e `/cadastro` fora do shell; shell protegido por `authGuard` (redireciona para
  `/login` com `returnUrl`). Botão **Sair** do sidebar agora faz logout e volta ao login.

### 9.7 Diretório `features/` — recomendação de organização

O `features/` deve concentrar **containers por domínio** (a parte "inteligente"), deixando `shared/`
só com componentes burros e `core/` com o transversal. Sugestão de evolução:

```
src/app/
├── core/            # models, types, services, facades, data (mocks), guards, interceptors
├── features/
│   ├── auth/        # login, cadastro, auth-layout   ✅ feito
│   ├── applications/# mover o container Applications para cá (routes por feature)
│   ├── release-trains/
│   └── release-train-schedulers/
├── shared/          # smart-table, sidebar, layout, header, footer, icon, page-scaffold
└── pages/           # (legado) migrar gradualmente para features/
```

Próximos passos recomendados no `features/`: mover os containers de `pages/` para `features/<domínio>/`
com **rotas por feature** (`*.routes.ts`), criar as **feature slices de NgRx** (actions/reducers/effects/
selectors) por domínio e um **`ListFacade<T>` base** reutilizável entre Applications, Release Trains e
Schedulers.

### 9.8 Versão

A stack real é **Angular 21.2 / PrimeNG 21.1** (não 17.2). Detalhes e o caminho seguro para manter
tudo atualizado (`ng update`) estão em **`STACK.md`**. Não alterei o `package.json` manualmente para
não arriscar o build em andamento — recomendo `ng update` + `npm run build`.
