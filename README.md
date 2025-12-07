# Dashboardized

A modular, customizable dashboard platform where users create personalized dashboards by selecting widgets for weather, news, crypto, GitHub activity, and more. Features OAuth authentication, user preference storage, and AI-generated daily/weekly summaries.

[![CI](https://github.com/yourusername/dashboardized/workflows/CI/badge.svg)](https://github.com/yourusername/dashboardized/actions)
[![Coverage](https://img.shields.io/badge/coverage-0%25-red)](https://github.com/yourusername/dashboardized)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Tech Stack

- **Frontend**: Vue 3 (Vite + Composition API), Pinia, Vue Router, TailwindCSS
- **Backend**: Node.js (Express/NestJS)
- **Monorepo**: Turborepo with pnpm
- **Testing**: Vitest + Vue Test Utils
- **Auth**: Auth0/Firebase (OAuth with Google & GitHub)
- **Observability**: OpenTelemetry, Google Analytics/PostHog
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel/Netlify (initial), Azure Static Web Apps (planned)

## Project Structure

```
my-dashboard/
 ├─ apps/
 │   ├─ web/               # Vue 3 + Vite + TailwindCSS frontend
 │   └─ api/               # Node.js backend (Express or NestJS)
 ├─ packages/
 │   ├─ widgets/           # Independent widget modules
 │   ├─ ui/                # Shared UI components
 │   ├─ utils/             # Helpers, API wrappers
 │   └─ types/             # Shared TypeScript types
 ├─ .github/workflows/     # CI/CD workflows
 └─ turbo.json             # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dashboardized.git
cd dashboardized

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration
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

### MVP (Current)
- ✅ Project structure and documentation
- 🚧 Customizable dashboard layout
- 🚧 Weather widget (Open-Meteo API)
- 🚧 News widget (NewsAPI/mediastack)
- 🚧 Cryptocurrency widget (Coingecko API)
- 🚧 OAuth authentication (Auth0/Firebase)
- 🚧 AI-generated summaries (OpenAI/Azure OpenAI)

### Planned
- GitHub Activity widget
- Google Calendar integration
- Google Analytics metrics widget
- End-to-end testing (Cypress)
- Azure deployment

## Widget Development

Each widget is self-contained and exposes:
- **UI component** (Vue 3)
- **`fetchData()`** function for API calls
- **`aiSummary(data)`** function for AI prompt data
- Configuration schema

See [Widget Development Guide](docs/widget-development.md) for details.

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

- Minimum 80% code coverage project-wide
- All widgets must have unit tests
- Integration tests for AI endpoints

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

See [Plan.md](Plan.md) for detailed project roadmap and sprint planning.

---

**Status**: 🚧 In Development | **Version**: 0.0.0 | **Last Updated**: December 2025
