# Dashboardized — Copilot Repository Instructions

> Short purpose: give GitHub Copilot clear, concise guidance about project goals, conventions and formatting so Copilot suggestions better match our team's expectations.
>
> Keep this file short (ideally < 300 lines). Copilot will use it as workspace-level guidance for completions and chat inside this repository.

---

## 1. How Copilot uses this file

- Copilot loads this file when a Copilot session starts in the repository (VS Code or GitHub web). It is treated as **guidance**, not an enforced policy.
- The file is read at session start or when Copilot reloads the workspace — it is **not** re-read on every single request. Save the file after edits; Copilot will pick changes up automatically or after a workspace reload.
- This file only applies to completions and chat **within this repository**.

---

## 2. Project summary (single paragraph)

Dashboardized is a modular, multi-package Turborepo that provides customizable user dashboards made from independently versioned widgets (weather, news, crypto, GitHub activity). Tech stack: **Vue 3 (Vite + Composition API), Pinia, TailwindCSS, Node.js (Express), TypeScript**. The backend proxies API keys and generates AI summaries from widget data.

---

## 3. Coding conventions (what Copilot should prefer)

- Language: **TypeScript** for frontend and backend. Prefer typed exports and interfaces.
- Frontend framework: **Vue 3 Composition API**. Prefer `setup()` + `<script setup>` style.
- State: **Pinia** over Vuex.
- Styling: **TailwindCSS** utility classes; keep components small and reusable.
- Tests: **Vitest + Vue Test Utils** for unit tests. Use descriptive test names and follow AAA (Arrange-Act-Assert).
- Commits: **Conventional Commits** (`feat:`, `fix:`, `chore:`).
- Versioning: **SemVer** using `changesets` in the monorepo.

---

## 4. Architecture & patterns Copilot should follow

- Keep UI in `packages/ui` purely presentational (no side-effects, no direct API calls).
- Widgets live in `packages/widgets/<widget-name>/` and must expose:
  - a Vue component (default export)
  - `fetchData()` or `get<Data>For(...)` service function
  - `aiSummary(data)` function that returns a small JSON-friendly object
  - a README describing env vars and API keys
- Backend in `apps/api` should act as a secure proxy for external APIs. Avoid leaking secrets to the frontend.

---

## 5. Examples (how to ask Copilot in this repo)

- "Create a Vue 3 component in `packages/widgets/news/` that fetches top headlines from the NewsAPI and exposes `aiSummary()` with title counts by category."
- "Write a Vitest unit test for `weatherService.fetchData` that mocks Open-Meteo responses and tests error handling."

---

## 6. Do / Don’t (explicit preferences)

- DO prefer small, focused functions and explicit typing.
- DO generate tests alongside features when asked.
- DO include README.md and usage examples for new packages.
- DO update `README.md` if needed before creating a PR.
- DO use github and github CLI.
- DO always ask if ready to commit changes, push to branch, and open a PR.
- DON'T add API keys or secrets into code. Use `process.env` and document required vars in `.env.example`.
- DON'T add global CSS in component packages; keep styles scoped or use Tailwind classes.
- DO always create a feature/doc/chore/fix branch for every change. `main` branch is protected.
- DO always check that a feature/fix/chore/docs branch has been created before committing changes.

### 6.1 Do / Don't for Planning (explicit preferences)

- DO ask for a plan before starting large features or architectural changes.
- DO include checkboxes for completed vs pending tasks in plans.
- DON'T start coding large features without a clear plan and checklist.
- DO check before starting with a new issue, that issue on github has been refined and contains estimation and correct label's/tagging.

---

## 7. Quick snippets & shortcuts

- Preferred component scaffold: use `<script setup lang="ts">` + `defineProps` + `defineEmits` where appropriate.
- Preferred export shape for widget index:

```ts
export { default as WeatherWidget } from './WeatherWidget.vue'
export * from './weatherService'
```

---

## 8. Updating this file

- Keep edits minimal and focused. When updating, include a short changelog entry at the bottom with date and author.
- Example: `- 2025-12-11 — Joan — Clarified widget export shape.`

---

**Changelog:**

- 2025-12-12 — Updated backend from "Express/NestJS" to "Express" to reflect actual implementation.

---

_Last updated: 2025-12-12 — Dashboardized team_
