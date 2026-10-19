# Momentum design tokens

The token layer lives in `tailwind.config.ts` and `src/lib/styles/app.css`. Components will be added under `src/lib/components/ui` as each product route needs them. `Container.svelte` is the only current primitive.

## Color roles

| Role               | Tailwind example                                                                             | Use                                   |
| ------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------- |
| Canvas, surfaces   | `bg-canvas`, `bg-surface`, `bg-surface-muted`, `bg-surface-raised`                           | Page and card layers                  |
| Text               | `text-foreground`, `text-muted`                                                              | Main and secondary copy               |
| Borders            | `border-border`, `border-border-strong`                                                      | Separation and stronger control edges |
| Primary action     | `bg-accent text-accent-foreground hover:bg-accent-hover`                                     | Main action; `text-accent` for links  |
| Feedback           | `text-success bg-success-soft`, `text-warning bg-warning-soft`, `text-danger bg-danger-soft` | Status and validation                 |
| Destructive action | `bg-danger text-danger-foreground hover:bg-danger-hover`                                     | Destructive controls                  |
| Focus and overlay  | `ring-focus`, `bg-overlay/60`                                                                | Focus indicators and modal backdrop   |

Colors are RGB CSS variables so Tailwind opacity modifiers work. Pair foreground tokens with their intended backgrounds; avoid raw palette classes in product components.

## Layout and type

- Spacing: `px-page`, `py-section`, `p-card`, `gap-field`; `max-w-content` for the page container.
- Shape: `rounded-control`, `rounded-card`, `rounded-pill`; `shadow-card` for elevated surfaces.
- Type: `font-sans`, `text-display`, `text-heading`, `text-subheading`, `text-body`, `text-caption`.

The font stack uses system fonts, so no network font request is required.

## Themes

Without a class on `html`, the OS color preference selects light or dark. `html.dark` forces dark and `html.light` forces light. Component markup should keep the same semantic classes in both themes. The colors of these classes change through CSS variables.

The starter palette is deliberately restrained and can be tuned when the marketing page's visual direction is chosen. Any change to a role should be checked in both themes, including text contrast and visible keyboard focus.
