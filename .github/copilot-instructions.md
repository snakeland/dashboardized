# Dashboardized — AI Coding Instructions

## Project Overview

Dashboardized is a **modular, customizable dashboard platform** where users create personalized dashboards by selecting widgets (weather, news, crypto, GitHub activity, etc.). The platform includes OAuth authentication, user preference storage, and AI-generated daily/weekly summaries based on widget data.

**Tech Stack**: Vue 3 (Vite + Composition API), Pinia, Vue Router, TailwindCSS, Node.js backend (Express/NestJS), Auth0/Firebase Auth, OpenTelemetry

## Architecture & Structure

This is a **Turborepo monorepo** with the following layout:

```
my-dashboard/
 ├─ apps/
 │   ├─ web/               # Vue 3 + Vite + TailwindCSS frontend
 │   └─ api/               # Node.js backend (Express or NestJS)
 ├─ packages/
 │   ├─ widgets/           # Independent widget modules
 │   ├─ ui/                # Shared UI components (pure, no data deps)
 │   ├─ utils/             # Helpers, API wrappers
 │   └─ types/             # Shared TypeScript types
 ├─ .github/workflows/     # CI/CD: ci.yml, release.yml, deploy.yml
 ├─ turbo.json             # Turborepo pipeline configuration
```

### Widget Architecture

Each widget in `packages/widgets/` is **independent and self-contained**, exposing:
- **UI component** (Vue 3 component)
- **`fetchData()`** function for API calls
- **`aiSummary(data)`** function returning structured data for AI prompts
- Configuration schema and props

Widgets consume public APIs (Open-Meteo, NewsAPI/mediastack, Coingecko, GitHub API). The backend acts as a **secure proxy** when API keys are needed—never expose keys in frontend code.

## Development Conventions

### Code Style & Commits

- **Conventional Commits** required for all commits (e.g., `feat:`, `fix:`, `chore:`)
- **Changesets** for versioning in monorepo—run `changeset add` before PRs
- **Protected main branch**—all changes via PRs with CI checks

### Testing Strategy

- **Vitest + Vue Test Utils** for unit tests
- **80% coverage minimum** project-wide—configure coverage reports (Codecov/Coveralls)
- Widget tests must cover: component rendering, `fetchData()` logic, error states
- Integration tests for AI summary endpoints in `apps/api`
- Run tests via `pnpm test` (leverages Turborepo caching)

### State Management & Routing

- **Pinia** for global state (user preferences, widget data)
- **Vue Router** for navigation
- Keep components pure in `packages/ui`—no direct API calls or state mutations

## Key Workflows

### Adding a New Widget

1. Create module in `packages/widgets/<widget-name>/`
2. Implement component, `fetchData()`, `aiSummary()` functions
3. Add tests (Vitest) meeting 80% coverage threshold
4. Register widget in widget loader (dynamic import)
5. Document API dependencies and required env vars
6. Add package to Turborepo pipeline in `turbo.json` if needed

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

## Project Roadmap (from Plan.md)

**MVP Phase**: Customizable dashboard with Weather, News, Crypto widgets, Auth0 login, basic AI summaries

**Future**: GitHub Activity widget, Google Calendar integration, Google Analytics metrics, Azure deployment, end-to-end tests (Cypress)

## Environment Setup

Refer to `README.md` for:
- Installation instructions (`pnpm install`)
- Environment variables (`.env.example`)
- Running tests and CI locally
- Contribution guidelines

---

*Last updated: December 2025 | Based on Plan.md specifications*
