# Project Plan — Dashboardized

## Main Project Idea

The goal of **Dashboardized** is to provide a web platform where each user can create a **fully customizable dashboard**, selecting widgets they find relevant for their daily needs. These widgets can include information such as weather, calendar, news, cryptocurrency or metal prices, GitHub activity, Google Analytics metrics, and other modules that will be progressively added.

The platform will include a **secure registration and login system** via OAuth, and a backend responsible for managing each user's preferences. Based on the data collected by the widgets, an **AI will generate daily and weekly summaries**, providing relevant insights according to their dashboard content.

The project is designed to be **highly modular, scalable, and extensible**, allowing new widgets and capabilities to be added without rewriting the main system.

## Summary of the 12 Required Technical Points

1. **Frontend with Vue 3 (Vite + Composition API)**
   - Use Vue 3 with Vite for performance and DX.
   - Manage state with Pinia and routes with Vue Router.

2. **GitHub Repository**
   - Monorepo (recommended) using Turborepo to organize `apps/` and `packages/`.
   - Protected `main` branch; use PRs and conventional commits.

3. **Full coverage in unit tests**
   - Vitest + Vue Test Utils for components.
   - Configure coverage reports and upload to Codecov or Coveralls.

4. **Semantic versioning**
   - Adopt SemVer and Conventional Commits.
   - Use Changesets for version management in monorepo and automatic changelog generation.

5. **Automated and scalable releases**
   - GitHub Actions workflow that: generates changelog, creates tags following SemVer, and publishes release.
   - Maintain option for manual releases if control is needed.

6. **Basic CI/CD**
   - GitHub Actions: `ci.yml` (lint, test, build), `release.yml` (changesets), and `deploy.yml`.
   - Initial deploy to Vercel/Netlify; prepare for Azure Static Web Apps in the future.

7. **Well-documented README.md**
   - Installation instructions, usage, contribution, test execution, and badges (build, coverage, version, license).

8. **Use of public APIs for dynamic data**
   - Widgets consume public APIs (e.g., Open-Meteo, NewsAPI/mediastack, Coingecko, GitHub API).
   - Backend acts as a secure proxy if needed to handle keys.

9. **Analytics / monitoring integration**
   - Initial: Google Analytics or PostHog.
   - Backend: OpenTelemetry for traces and metrics; plan for Azure Monitor.

10. **Visual and responsive design**
    - TailwindCSS (recommended) or Bootstrap.
    - Reusable components in `packages/ui`.

11. **Clear and useful functionality**
    - Minimum viable product (MVP): customizable dashboard with widgets (e.g., weather, news, crypto).

12. **User authentication**
    - OAuth via Auth0 or Firebase Auth; allow login with Google and GitHub.
    - Backend manages tokens and private preferences.

---

## Proposed Architecture (summary)

```
my-dashboard/
 ├─ apps/
 │   ├─ web/               # Vue 3 + Vite + Tailwind
 │   └─ api/               # Node.js (Express or NestJS)
 ├─ packages/
 │   ├─ widgets/           # widgets as independent packages
 │   ├─ ui/                # shared components
 │   ├─ utils/             # helpers, API wrappers
 │   └─ types/             # shared TS types
 ├─ .github/workflows/
 ├─ package.json
 └─ turbo.json
```

Each widget is an independent module that exposes:
- UI component
- `fetchData()` function
- `aiSummary(data)` function (data structure for AI)
- configuration and props

---

## Startup Plan — step by step (initial sprint)

### Day 1–2: Foundations
- Initialize monorepo with Turborepo.
- Create `apps/web` (Vue 3 + Vite) and `apps/api` (basic Express or NestJS).
- Configure TailwindCSS in `web`.
- Initialize `packages/ui` and `packages/widgets` with empty structure.
- Create base `README.md` at root with project summary.

### Day 3–5: First widget and dynamic data
- Implement first widget: **Weather** (use Open-Meteo).
- Create reusable widget component and dynamic widget loader.
- Add Chart.js to show trends (e.g., temperature last 7 days).
- Write unit tests for the widget (Vitest).

### Day 6–7: Authentication and preferences storage
- Integrate Auth0 (login with Google/GitHub) in `web`.
- In `api`, endpoint to save dashboard configurations per user.
- Test registration/login flow and layout saving.

### Day 8–10: AI integration and more widgets
- Design data contract for each widget to send its summary to the backend.
- Implement AI endpoint in `api` that builds prompt and calls the AI API (e.g., OpenAI / Azure OpenAI).
- Add **News** (NewsAPI or mediastack) and **Cryptocurrency** (Coingecko) widgets.
- Integration tests for AI flow.

### Day 11–14: Tests, CI/CD and releases
- Configure Vitest for full coverage and upload reports to Codecov.
- Create GitHub Actions: `ci.yml` (lint + test + build) and `release.yml` (changesets).
- Configure build and coverage badges in README.
- Initial deploy on Vercel/Netlify; verify environment and variables (API keys, secrets).

### Week 3+: Improvements and scaling
- Add more widgets (GitHub Activity, Calendar, Google Analytics).
- Migrate monitoring to OpenTelemetry and plan for exporters (Azure Monitor).
- Prepare deployment to Azure (Static Web Apps + App Service or Functions for API).
- Optimize e2e tests with Cypress and add regression tests.
- Refine AI prompts and cost limits (caching and rate limits).

---

## Practical Notes and Quick Recommendations
- **Conventional Commits** from the start to facilitate automatic changelogs.
- **Changesets** for monorepo versioning.
- **Separate UI and logic**: `packages/ui` for pure components without data dependencies.
- **Privacy**: never expose API keys in frontend; use backend as proxy.
- **Observability** from the start: structured logs and basic metrics.

---

*Ready to begin implementation. Next steps available upon request.*
