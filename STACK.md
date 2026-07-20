# Stack — Rollout Service Frontend

> Documento de versões e arquitetura. **Atualizado para Angular 21.2** (a stack
> instalada não é mais 17.2). Fonte: `package.json`.

## Versões instaladas (linha 21.x)

| Pacote | Versão | Papel |
| --- | --- | --- |
| `@angular/core` (e demais `@angular/*`) | `^21.2.0` | Framework (standalone, signals, control-flow) |
| `@angular/build` / `@angular/cli` | `^21.2.9` | Build e tooling |
| `@angular/ssr` | `^21.2.9` | Server-side rendering |
| `primeng` | `^21.1.9` | Componentes de UI |
| `@primeuix/themes` | `^2.0.3` | Tema (Aura) |
| `primeflex` | `^4.0.0` | Utilitários CSS |
| `@ngrx/store` / `effects` / `entity` / `store-devtools` | `^21.1.1` | State management |
| `@lucide/angular` | `^1.25.0` | Ícones |
| `chart.js` | `^4.5.1` | Gráficos |
| `rxjs` | `~7.8.0` | Reatividade |
| `typescript` | `~5.9.2` | Linguagem (strict) |
| `jest` / `jest-preset-angular` | `^30.4.2` / `^17.0.0` | Testes unitários |

> **Cypress (E2E)** ainda não está no `package.json` — instalar quando iniciarmos os testes end-to-end.

## Manter tudo na última versão

Não recomendo “bumpar” manualmente o `package.json` sem rodar o build. O caminho seguro e
suportado pelo Angular é:

```bash
# ver o que está desatualizado
npm outdated

# atualizar o core do Angular e CLI (roda migrations automáticas)
ng update @angular/core @angular/cli

# atualizar libs de terceiros que têm schematics
ng update @ngrx/store primeng

# demais libs sem schematics
npm update
```

Rode `npm run build` e `npm test` após cada `ng update`. Já estamos na **linha 21.x**
(a major mais recente do Angular à época deste repo); os patches acima trazem apenas
correções dentro da mesma major.

## Convenções de arquitetura

- **standalone components** (sem NgModules), **signals** e control-flow novo (`@if/@for/@switch`).
- **`core/`** — código transversal por domínio: `models`, `types`, `services`, `facades`,
  `data` (mocks), `guards`, `interceptors`.
- **`features/`** — módulos de funcionalidade (containers + UI específica). Ex.: `features/auth`
  (login, cadastro, auth-layout).
- **`shared/`** — componentes burros reutilizáveis: `smart-table`, `sidebar`, `layout`, `header`,
  `footer`, `icon`, `page-scaffold`.
- **`pages/`** — páginas/containers de rota (algumas ainda em scaffold; ver recomendação abaixo).

## Feature-toggle de mock

`src/app/environment/environment.ts` expõe `featureToggle.mock`:

- `mock: true` (dev) → **todo o site consome os mocks de `core/data`** (sem HTTP).
- `mock: false` (prod) → consome a API real (`environment.apiUrl`).

Serviços (`ApplicationsService`, `AuthService`) checam esse flag e trocam a fonte de dados
sem que os componentes visuais saibam.
