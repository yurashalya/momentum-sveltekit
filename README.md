# Momentum

SvelteKit 3 + Svelte 5 + TypeScript implementation of the senior frontend take-home. The repository has the tooling, semantic design tokens, reusable UI primitives, validated mock data, a pre-rendered marketing homepage, a localized blog, and URL-driven SSR post search. Sign-in and a protected dashboard with a campaign table are implemented.

## Live demo

[Open Momentum](https://momentum-sveltekit.vercel.app/) — deployed on Vercel from `main`. Use the demo credentials below to access the dashboard.

## Requirements

- Node.js 22 or newer
- pnpm 10.34.6 via Corepack (`corepack enable`, then `corepack pnpm install`)

```sh
corepack pnpm install
corepack pnpm dev
```

The app opens at http://localhost:5173. Development uses a temporary session signing key if `SESSION_SECRET` is unset. Set a private `SESSION_SECRET` of at least 32 characters for production or local preview (for example, generate one with `openssl rand -hex 32`). See `.env.example`; never commit the real value.

## Demo login

Open `/login` or `/de/login` and use:

- Editor: `editor@demo.test` / `demo1234`
- Admin: `admin@demo.test` / `demo1234`
- Viewer: `viewer@demo.test` / `demo1234`

The form validates with the same Zod schema on the client and server. Successful login sets a signed, HttpOnly, SameSite cookie that expires after 12 hours. `/dashboard`, `/de/dashboard`, and their `/items` routes require a valid session; sign out clears the cookie. The dashboard shows campaign totals and recent activity. Its campaign table supports URL-driven search, filters, sorting, and pagination, plus inline name edits for editors and admins. Archived campaigns reject renaming to demonstrate optimistic rollback. Successful edits persist only in the running server process and reset after restart.

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

The blog has pre-rendered lists at `/en/blog` and `/de/blog`, four URL-addressable pages per locale, and localized article URLs. `/blog` redirects to `/en/blog`. Numbered pagination keeps all 20 mock posts reachable with stable URLs for sharing, search indexing, and keyboard navigation. Post search is available at `/search` and `/de/search`; `q`, `tag`, and `sort` round-trip through the URL, including language switching and browser history. The dashboard campaign table and authenticated edit-and-rollback E2E flow are implemented. Remaining production SEO, observability, and performance budgets are still open. Homepage pricing and testimonials are explicitly illustrative.
