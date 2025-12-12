# Dashboardized

A modular, customizable dashboard platform where users create personalized dashboards by selecting widgets for weather, news, crypto, GitHub activity, and more. Features OAuth authentication, user preference storage, and AI-generated daily/weekly summaries.

[![CI](https://github.com/yourusername/dashboardized/workflows/CI/badge.svg)](https://github.com/yourusername/dashboardized/actions)
[![Coverage](https://img.shields.io/badge/coverage-0%25-red)](https://github.com/yourusername/dashboardized)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Tech Stack

- **Frontend**: Vue 3 (Vite + Composition API), Pinia, Vue Router, TailwindCSS
- **Backend**: Node.js (Express)
- **Monorepo**: Turborepo with pnpm
- **Testing**: Vitest + Vue Test Utils
- **Auth**: Auth0/Firebase (OAuth with Google & GitHub)
- **Observability**: OpenTelemetry, Google Analytics/PostHog
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel/Netlify (initial), Azure Static Web Apps (planned)

## Project Structure

```
Dashboardized/
 ├─ apps/
 │   ├─ web/               # Vue 3 + Vite + TailwindCSS frontend
 │   │   ├─ src/
 │   │   │   ├─ views/     # Page components
 │   │   │   ├─ router/    # Vue Router configuration
 │   │   │   └─ assets/    # Static assets and styles
 │   │   ├─ vite.config.ts
 │   │   └─ vitest.config.ts
 │   └─ api/               # Node.js Express backend
 │       ├─ src/
 │       │   └─ index.ts   # Express server entry point
 │       ├─ tsconfig.json
 │       └─ vitest.config.ts
 ├─ packages/
 │   ├─ widgets/           # Independent widget modules
 │   ├─ ui/                # Shared UI components
 │   ├─ utils/             # Helpers, API wrappers
 │   └─ types/             # Shared TypeScript types
 ├─ .github/
 │   └─ copilot-instructions.md  # AI coding guidelines
 ├─ .changeset/            # Changesets for versioning
 ├─ turbo.json             # Turborepo pipeline configuration
 └─ pnpm-workspace.yaml    # pnpm workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/snakeland/dashboardized.git
cd dashboardized

# Install dependencies
pnpm install

# Set up environment variables for frontend
cp apps/web/.env.example apps/web/.env

# Set up environment variables for backend
cp apps/api/.env.example apps/api/.env
# Edit .env files with your API keys and configuration
```

### Development

```bash
# Run development servers (web + api in parallel)
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Build all apps and packages
pnpm build
```

## Features

### Implemented ✅
- ✅ **Turborepo monorepo** setup with pnpm workspaces
- ✅ **Vue 3 frontend** with Vite, Pinia, Vue Router, TailwindCSS
- ✅ **Express backend** with TypeScript
- ✅ **Testing infrastructure**: Vitest + Vue Test Utils (52 tests passing)
- ✅ **Changesets** for semantic versioning
- ✅ **Weather Widget**: City search, current weather, 7-day forecast with Chart.js
- ✅ **Reusable UI components**: ChartLine, WidgetErrorBoundary
- ✅ **Widget type system**: Core interfaces and contracts
- ✅ **AI summary generation** framework (ready for integration)

### In Progress 🚧
- 🚧 **OAuth authentication** (Auth0/Firebase) - [Issue #2](https://github.com/snakeland/dashboardized/issues/2)
- 🚧 **CI/CD Pipeline** and coverage reporting - [Issue #6](https://github.com/snakeland/dashboardized/issues/6)
- 🚧 **ESLint configuration** - [Issue #12](https://github.com/snakeland/dashboardized/issues/12)

### Planned 🔜
- 🔜 **News widget** (NewsAPI/mediastack) - [Issue #4](https://github.com/snakeland/dashboardized/issues/4)
- 🔜 **Cryptocurrency widget** (Coingecko) - [Issue #5](https://github.com/snakeland/dashboardized/issues/5)
- 🔜 **GitHub Activity widget** - [Issue #7](https://github.com/snakeland/dashboardized/issues/7)
- 🔜 **AI-powered summaries** (OpenAI/Azure OpenAI) - [Issue #3](https://github.com/snakeland/dashboardized/issues/3)
- 🔜 **Google Calendar** integration
- 🔜 **Google Analytics** metrics widget
- 🔜 **Azure deployment** - [Issue #11](https://github.com/snakeland/dashboardized/issues/11)
- 🔜 **End-to-end testing** (Cypress)

## Widget Development

### Available Widgets

#### Weather Widget ✅
**Status**: Implemented | **API**: Open-Meteo (free, no auth required)

Features:
- City search with autocomplete
- Current weather display (temperature, condition, icon)
- 7-day forecast with interactive Chart.js visualization
- Auto-refresh every 30 minutes
- Manual refresh button
- Comprehensive error handling

See [`packages/widgets/src/weather/README.md`](packages/widgets/src/weather/README.md) for detailed documentation.

### Creating a New Widget

Each widget in `packages/widgets/` is self-contained and exposes:
- **UI component** (Vue 3)
- **`fetchData()`** or **`getWeatherForLocation()`** function for API calls
- **`aiSummary(data)`** function for AI prompt data
- Configuration schema and props
- Comprehensive test suite (unit + integration)

**Widget development workflow:**
1. Create module in `packages/widgets/<widget-name>/`
2. Implement component, data fetching, and AI summary functions
3. Add tests (Vitest) with comprehensive coverage
4. Register widget in widget loader (`packages/widgets/src/index.ts`)
5. Document API dependencies and required env vars
6. Add package to Turborepo pipeline in `turbo.json` if needed

**Reference implementation:** `packages/widgets/src/weather/` (375 lines component, 52 passing tests)

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for detailed coding guidelines.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes using [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'feat: add amazing feature'`)
4. Run tests (`pnpm test`)
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
- `test:` - Test updates
- `refactor:` - Code refactoring

### Testing Requirements

- **52 tests currently passing** (Weather widget comprehensive suite)
- All widgets must have unit tests covering:
  - Service layer (API calls, data processing)
  - AI summary generation
  - Component integration (rendering, user interactions, error states)
- Integration tests for AI endpoints in backend
- Target comprehensive coverage for critical paths

## Versioning

This project uses [Semantic Versioning](https://semver.org/) and [Changesets](https://github.com/changesets/changesets) for version management.

```bash
# Add a changeset
pnpm changeset add

# Version packages
pnpm changeset version

# Publish release
pnpm changeset publish
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Roadmap

See [plan-dashboardized.prompt.md](plan-dashboardized.prompt.md) for detailed project roadmap and sprint planning.

**Current milestone**: MVP Phase - Day 3-5 (Weather Widget) ✅ Complete

**Next steps**:
- Authentication and user preferences (Day 6-7)
- AI integration and additional widgets (Day 8-10)
- CI/CD and coverage reporting (Day 11-14)

Track all issues and progress on [GitHub Issues](https://github.com/snakeland/dashboardized/issues).

---

**Status**: 🚧 In Active Development | **Version**: 0.0.0 | **Last Updated**: December 2025
