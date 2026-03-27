# Dashboard LogiTrack

Aplicacao frontend em React para visualizacao de indicadores de logistica, com tela de login e dashboard de metricas consumidas de um backend em Java + Spring Boot.

🔗 Acesse o projeto: https://logi-track-dashboard-frontend.vercel.app/

## Instrucoes para configurar e rodar localmente

### 1) Pre-requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+
- Backend Java Spring Boot rodando localmente

### 2) Instalar dependencias do frontend

```bash
npm install
```

### 3) Configurar variavel de ambiente

Crie um arquivo `.env` na raiz do frontend com a URL base do backend Spring Boot:

```env
VITE_API_URL=http://localhost:8080
```

Observacao:
- O frontend usa essa variavel em [src/services/api.ts](src/services/api.ts).
- O endpoint atualmente consumido no dashboard e `/dashboard`.

### 4) Subir o frontend

```bash
npm run dev
```

O Vite exibira a URL local (geralmente `http://localhost:5173`).

### 5) Build e validacoes

```bash
npm run build
npm run lint
npm run preview
```

## Como rodar o backend Java + Spring Boot (referencia)

Este repositorio contem o frontend. O backend Spring Boot deve ser iniciado separadamente.

Opcoes comuns:

Maven:
```bash
mvn spring-boot:run
```

Gradle:
```bash
./gradlew bootRun
```

No Windows com gradle wrapper:
```bash
gradlew.bat bootRun
```

Garanta que:
- O backend esteja na mesma porta configurada em `VITE_API_URL`.
- O CORS do Spring Boot permita requisicoes do frontend (exemplo: `http://localhost:5173`).

## Decisoes tecnicas, ferramentas e arquitetura

### Stack e bibliotecas principais

- React 19 + TypeScript
- Vite para build e dev server
- MUI (Material UI) para componentes visuais e responsividade
- Axios para chamadas HTTP
- TanStack React Query disponivel no projeto para padrao de fetch/caching
- Styled Components presente para estilos legados

Dependencias podem ser vistas em [package.json](package.json).

### Decisoes tecnicas adotadas

- Theme centralizado com MUI em [src/App.tsx](src/App.tsx) para padronizar paleta, tipografia e componentes.
- Login com estado local para fluxo inicial de autenticacao no frontend, persistido em `localStorage`.
- URL de API externa ao codigo via `VITE_API_URL`, permitindo trocar ambiente sem alteracao de fonte.
- Dashboard desacoplado em componentes de pagina e componentes reutilizaveis para facilitar manutencao.

### Arquitetura de pastas

```text
src/
  components/   # componentes reutilizaveis (header, cards etc.)
  pages/        # telas (login, dashboard)
  services/     # cliente HTTP e configuracoes de API
  hooks/        # hooks customizados
  type/         # tipagens de payload/resposta
  themes/       # configuracoes de tema/tokens
```

### Fluxo da aplicacao

1. App inicia e verifica autenticacao local.
2. Usuario nao autenticado visualiza tela de login.
3. Apos login, dashboard e carregado.
4. Dashboard busca dados no backend Spring Boot via endpoint `/dashboard`.
5. Usuario pode sair e voltar para o login.

## Banco de dados e scripts

Neste escopo, nao houve alteracao de banco de dados no frontend.

- Justificativa: as mudancas realizadas foram de interface e fluxo de autenticacao no cliente.
- Novo script de banco: nao se aplica nesta entrega.

Se houver alteracoes futuras no backend Spring Boot, documentar aqui:

1. Justificativa tecnica da mudanca de schema.
2. Script SQL de migracao versionado (exemplo em `db/migration/V2__descricao.sql`).
3. Ordem de execucao e impacto esperado.
