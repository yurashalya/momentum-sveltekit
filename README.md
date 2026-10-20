# Momentum

SvelteKit 3 + Svelte 5 + TypeScript implementation of the senior frontend take-home. The repository has the tooling, semantic design tokens, reusable UI primitives, validated mock data, and a pre-rendered marketing homepage. Blog, search, and dashboard routes are the next implementation stages.

## Requirements

- Node.js 22 or newer
- pnpm 10.34.6 via Corepack (`corepack enable`, then `corepack pnpm install`)

```sh
corepack pnpm install
corepack pnpm dev
```

The app opens at http://localhost:5173.

## Checks

```sh
corepack pnpm lint
corepack pnpm check
corepack pnpm typecheck
corepack pnpm test:unit
corepack pnpm build
corepack pnpm test:e2e
```

Playwright needs a browser once: `corepack pnpm exec playwright install chromium`.

Husky runs lint-staged before each commit. Staged TypeScript, JavaScript, and Svelte files are formatted and linted; staged styles, markup, data, and Markdown are formatted. Run `corepack pnpm verify` for the complete local check except E2E.

## Architecture

See the [architecture plan](docs/architecture.md) and [design tokens](docs/design-system.md). Original JSON data is under `mocks/` and never publicly exposed through `static/`. The search URL codec lives in `src/lib/features/posts`; reusable UI starts in `src/lib/components/ui`.

The dashboard, mock authentication with real cookie sessions, EN/DE routes, remaining production SEO, observability, performance budgets, and full test flows are not implemented yet. Homepage pricing and testimonials are explicitly illustrative. Demo credentials will be documented when login is implemented.
