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

The blog has pre-rendered lists at `/en/blog` and `/de/blog`, four URL-addressable pages per locale, and localized article URLs. `/blog` redirects to `/en/blog`. Numbered pagination keeps all 20 mock posts reachable with stable URLs for sharing, search indexing, and keyboard navigation. Post search is available at `/search` and `/de/search`; `q`, `tag`, and `sort` round-trip through the URL, including language switching and browser history. The dashboard campaign table and authenticated edit-and-rollback E2E flow are implemented. Homepage pricing and testimonials are explicitly illustrative.

## SEO and runtime

`pnpm build` generates `sitemap.xml`, `robots.txt`, and 1200×630 PNG social cards for each localized post from the mock content. The PNGs are pre-rendered rather than generated per request so crawlers get a stable URL without function latency. Set the production origin in `site.config.json` before deploying to another domain. Public pages use absolute canonicals, hreflang alternates, Open Graph and Twitter metadata. Search, login, dashboard, and error pages are marked `noindex`.

The Vercel adapter runs authenticated routes and the telemetry endpoint on Node. Adapter 7 does not support per-route Edge configuration, so the build adds a small `/api/locale-suggestion` Edge Function to Vercel's Build Output API. It reads `Accept-Language` using only Web APIs and has no database or session dependency. This endpoint exists on Vercel deployments; `vite preview` serves the SvelteKit routes only.

## Observability

The browser samples 10% of sessions and reports LCP, INP, CLS, and TTFB with `sendBeacon` to `/api/telemetry`. A root Svelte error boundary, SvelteKit client error hook, and global error listeners report errors to the same endpoint. The endpoint validates payloads and logs them server-side; it does not store them. Paths exclude query strings. Sampling is stable within a browser tab. Lighthouse and JavaScript bundle budgets are still separate remaining CI work.
