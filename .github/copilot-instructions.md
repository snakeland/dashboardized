# Dashboardized — AI Coding Instructions

> **Primary Reference**: See [`README.md`](../README.md) for project overview, installation, features, and contribution guidelines.

## Project Overview

Dashboardized is a **modular, customizable dashboard platform** where users create personalized dashboards by selecting widgets (weather, news, crypto, GitHub activity, etc.). The platform includes OAuth authentication, user preference storage, and AI-generated daily/weekly summaries based on widget data.

**Tech Stack**: Vue 3 (Vite + Composition API), Pinia, Vue Router, TailwindCSS, Node.js backend (Express/NestJS), Auth0/Firebase Auth, OpenTelemetry

**Current Status**: MVP Phase - Weather Widget ✅ Complete (52 tests passing, full documentation)

For detailed project structure, installation, and available widgets, see [`README.md`](../README.md).

## Architecture & Structure

This is a **Turborepo monorepo**. See [`README.md`](../README.md#project-structure) for full directory layout.

**Key packages:**

- `apps/web` - Vue 3 + Vite + TailwindCSS frontend
- `apps/api` - Node.js backend (Express or NestJS)
- `packages/widgets` - Independent widget modules (Weather ✅ implemented)
- `packages/ui` - Shared UI components (ChartLine, WidgetErrorBoundary)
- `packages/utils` - Helpers, API wrappers
- `packages/types` - Shared TypeScript types (widget interfaces)

### Widget Architecture

Each widget in `packages/widgets/` is **independent and self-contained**, exposing:

- **UI component** (Vue 3 component)
- **Data fetching function** (e.g., `getWeatherForLocation()`, `fetchData()`)
- **`aiSummary(data)`** function returning structured data for AI prompts
- Configuration schema and props
- Comprehensive test suite (service, AI, component layers)

**Reference implementation**: `packages/widgets/src/weather/` (9 files, 52 tests, 100% passing)

Widgets consume public APIs (Open-Meteo, NewsAPI/mediastack, Coingecko, GitHub API). The backend acts as a **secure proxy** when API keys are needed—never expose keys in frontend code.

## Development Conventions

### Git Workflow & Branching

- **Always create a new branch** before starting work on any feature, fix, or chore
- Branch naming convention:
  - `feat/<feature-name>` - New features (e.g., `feat/weather-widget`, `feat/news-widget`)
  - `fix/<issue-description>` - Bug fixes (e.g., `fix/chart-rendering`)
  - `chore/<task-name>` - Maintenance tasks (e.g., `chore/configure-eslint`)
- **Never commit directly to `main`** - it's a protected branch
- Base new branches on latest `main`: `git checkout main && git pull && git checkout -b <branch-name>`

### Issue Management & Planning

Before moving an issue to "Ready" or "In Development", ensure:

1. **Issue must be refined** - Clear acceptance criteria and implementation details documented
2. **Issue must have estimation** - Time/effort estimate added (hours or story points)
3. **Issue must have proper tagging** - Appropriate labels applied (e.g., `enhancement`, `bug`, `documentation`, priority labels)

**Refinement must happen before estimation**. An issue cannot be accurately estimated without clear acceptance criteria and technical approach.

Only start work on issues that meet all three criteria above.

### Code Style & Commits

- **Conventional Commits** required for all commits (e.g., `feat:`, `fix:`, `chore:`)
- **Changesets** for versioning in monorepo—run `changeset add` before PRs
- **Protected main branch**—all changes via PRs with CI checks

### Testing Strategy

- **Vitest + Vue Test Utils** for unit tests
- **Current status**: 52 tests passing (Weather widget comprehensive suite)
- Widget tests must cover: component rendering, data fetching logic, AI summaries, error states
- Integration tests for AI summary endpoints in `apps/api`
- Run tests via `pnpm test` (leverages Turborepo caching)

**Test pattern** (Weather widget example):

1. Service layer tests (19 tests) - API calls, debouncing, error handling
2. AI summary tests (14 tests) - Data formatting, trends, edge cases
3. Component tests (19 tests) - User interactions, state management, loading/error states

### State Management & Routing

- **Pinia** for global state (user preferences, widget data)
- **Vue Router** for navigation
- Keep components pure in `packages/ui`—no direct API calls or state mutations

## Key Workflows

### Adding a New Widget

**Reference the Weather widget implementation** (`packages/widgets/src/weather/`) as a complete example.

1. Create module in `packages/widgets/<widget-name>/`
2. Implement component, data fetching, `aiSummary()` functions
3. Add comprehensive tests (Vitest) covering all layers
4. Register widget in widget loader (`packages/widgets/src/index.ts`)
5. Document API dependencies and required env vars (create README.md)
6. Add package to Turborepo pipeline in `turbo.json` if needed

**File structure** (Weather widget example):

```
weather/
├── index.ts               # Public exports
├── WeatherWidget.vue      # Main component (375 lines)
├── weatherService.ts      # API calls (188 lines)
├── weatherTypes.ts        # TypeScript types (166 lines)
├── weatherAI.ts           # AI summary (62 lines)
├── weatherConfig.ts       # Widget metadata (18 lines)
├── README.md              # Documentation (127 lines)
└── __tests__/
    ├── WeatherWidget.test.ts      # Component tests (19 tests)
    ├── weatherService.test.ts     # Service tests (19 tests)
    └── weatherAI.test.ts          # AI tests (14 tests)
```

### Authentication Flow

- OAuth via **Auth0 or Firebase Auth**
- Support Google and GitHub login providers
- Backend (`apps/api`) manages JWT tokens and user preferences
- Store dashboard config per user in database

### AI Summary Generation

- Each widget's `aiSummary(data)` returns structured data
- Backend endpoint collects all widget summaries and constructs prompt
- Call OpenAI/Azure OpenAI API with rate limiting and caching
- Return daily/weekly insights to user dashboard

### Build & Deploy

- **Development**: `pnpm dev` (Turborepo runs web + api in parallel)
- **Build**: `pnpm build` (Turborepo builds all apps/packages with caching)
- **Tests**: `pnpm test` (runs all Vitest tests with coverage, cached by Turborepo)
- **Lint**: `pnpm lint` (runs across all workspaces)
- **CI/CD**: GitHub Actions workflows in `.github/workflows/`
- **Deploy**: Vercel/Netlify (initial), migrate to Azure Static Web Apps

## Critical Guidelines

### Security & Privacy

- **Never expose API keys** in frontend—proxy through backend
- OAuth tokens stored securely; validate on every backend request
- User preferences encrypted at rest

### Observability

- **OpenTelemetry** for traces and metrics (plan for Azure Monitor export)
- Structured logging in backend (JSON format)
- Google Analytics or PostHog for frontend analytics

### UI/UX Patterns

- **TailwindCSS** for styling (utility-first approach)
- Reusable components in `packages/ui` (buttons, cards, loaders)
- Responsive design—mobile-first breakpoints
- Chart.js for widget visualizations (e.g., temperature trends)

## Project Roadmap

See [`plan-dashboardized.prompt.md`](../plan-dashboardized.prompt.md) for detailed roadmap and sprint planning.

**Current milestone**: MVP Phase - Day 3-5 ✅ Weather Widget Complete

**Next priorities**:

1. Authentication (OAuth) - [Issue #2](https://github.com/snakeland/dashboardized/issues/2)
2. CI/CD and coverage - [Issue #6](https://github.com/snakeland/dashboardized/issues/6)
3. ESLint configuration - [Issue #12](https://github.com/snakeland/dashboardized/issues/12)
4. Additional widgets (News, Crypto) - [Issues #4, #5](https://github.com/snakeland/dashboardized/issues)

## Environment Setup

Refer to [`README.md`](../README.md#getting-started) for:

- Installation instructions (`pnpm install`)
- Environment variables (`.env.example`)
- Running tests and CI locally
- Contribution guidelines

---

_Last updated: December 2025 | Weather Widget implementation complete with 52 passing tests_
