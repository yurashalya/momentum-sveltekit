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

| Route                   | Rendering               | Runtime         | Reason                                              |
| ----------------------- | ----------------------- | --------------- | --------------------------------------------------- |
| `/` and `/de`           | Pre-rendered            | Build           | Stable marketing content and fast first paint       |
| `/en/blog`, `/de/blog`  | Pre-rendered, paginated | Build           | Twenty local posts; four shareable pages per locale |
| `/[locale]/blog/[slug]` | Pre-rendered            | Build           | Known slugs and locale-specific metadata            |
| `/search`, `/de/search` | SSR                     | Vercel Function | URL-driven query over validated server-side mocks   |
| `/login`                | SSR + form action       | Node            | Cookie/session handling                             |
| `/dashboard`            | SSR                     | Node            | Protected request data                              |
| `/dashboard/items`      | Streamed SSR            | Node            | Send shell before paginated row promise settles     |

Both localized homepage variants and all blog routes are pre-rendered. `/blog` redirects to `/en/blog`; blog pagination uses `/[locale]/blog/page/[page]`, with six posts per page. Search is implemented as SSR on the adapter default Vercel Function runtime; it normalizes `q`, `tag`, and `sort` in the URL and uses the validated JSON data without a separate backend. The remaining route rendering choices are planned and will be verified as their routes are implemented.

## State and data flow

- Parse search/table filters from the URL; serialize them back for shareable links and history navigation.
- Use Svelte 5 runes for local UI state. Derive the locale from the URL in the root layout and provide it to descendants through typed context. Keep form schemas shared between client and server; infer TypeScript types from Zod.
- Read the JSON mocks on the server, validate at the boundary, and expose query functions. Mutations use form actions/endpoints and invalidate only their affected data.
- Keep authentication, credentials, and raw users data out of client bundles.
- Use light/dark semantic CSS variables so components do not carry parallel theme classes.
