# Architecture plan

Keep route files thin. Put reusable presentation in `src/lib/components`, feature logic and schemas in `src/lib/features`, and server-only data access/authentication in `src/lib/server`. Create folders as their first implementation lands; avoid empty modules.

## Boundaries

| Area                         | Responsibility                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `src/routes`                 | SvelteKit load functions, actions, endpoint handlers, route layouts, and page composition |
| `src/lib/components/ui`      | Small reusable token-driven components                                                    |
| `src/lib/components/layout`  | Shared navigation and page shells                                                         |
| `src/lib/components/pages`   | Page-specific composed sections                                                           |
| `src/lib/features/posts`     | Post schemas, URL state, and mappers                                                      |
| `src/lib/features/campaigns` | Campaign schemas, filters, pagination, edits                                              |
| `src/lib/features/auth`      | Shared login form schema and auth types                                                   |
| `src/lib/server/data`        | Read/validate private JSON mocks and expose paginated data functions                      |
| `src/lib/server/auth`        | Cookie session implementation and route protection                                        |
| `src/lib/i18n`               | Locale selection and EN/DE UI dictionaries                                                |
| `src/lib/seo`                | Canonicals, metadata, JSON-LD, sitemap helpers                                            |
| `src/lib/observability`      | Web Vitals and client error beacons                                                       |
| `src/lib/styles`             | Tailwind entry point and semantic CSS variables                                           |
| `mocks`                      | Assignment data; server/build input, never served from `static`                           |

The assignment calls the source file `mocks/items.json` and requires `/dashboard/items`. Internally, those records are campaigns, so their schemas and data access live under `campaigns`.

## Route rendering plan

| Route                   | Rendering               | Runtime     | Reason                                          |
| ----------------------- | ----------------------- | ----------- | ----------------------------------------------- |
| `/`                     | Pre-rendered            | Build       | Stable marketing content and fast first paint   |
| `/[locale]/blog`        | Pre-rendered, paginated | Build       | Twenty local posts; indexable pages             |
| `/[locale]/blog/[slug]` | Pre-rendered            | Build       | Known slugs and locale-specific SEO             |
| `/search`               | SSR                     | Vercel Edge | URL-driven query with a light in-memory index   |
| `/login`                | SSR + form action       | Node        | Cookie/session handling                         |
| `/dashboard`            | SSR                     | Node        | Protected request data                          |
| `/dashboard/items`      | Streamed SSR            | Node        | Send shell before paginated row promise settles |

These choices are planned, not yet implemented. The current repository contains only the foundation and a starter page.

## State and data flow

- Parse search/table filters from the URL; serialize them back for shareable links and history navigation.
- Use Svelte 5 runes for local UI state. Keep form schemas shared between client and server; infer TypeScript types from Zod.
- Read the JSON mocks on the server, validate at the boundary, and expose query functions. Mutations use form actions/endpoints and invalidate only their affected data.
- Keep authentication, credentials, and raw users data out of client bundles.
- Use light/dark semantic CSS variables so components do not carry parallel theme classes.
