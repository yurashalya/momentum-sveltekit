# Momentum design system

Semantic tokens live in `tailwind.config.ts` and `src/lib/styles/app.css`. Reusable primitives live in `src/lib/components/ui`; shared public layout components live in `src/lib/components/layout`.

## Color roles

| Role                 | Tailwind example                                                                             | Use                                   |
| -------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------- |
| Canvas and surfaces  | `bg-canvas`, `bg-surface`, `bg-surface-muted`, `bg-surface-raised`                           | Page and card layers                  |
| Text                 | `text-foreground`, `text-muted`                                                              | Main and secondary copy               |
| Borders              | `border-border`, `border-border-strong`                                                      | Separation and stronger control edges |
| Primary action       | `bg-action text-action-foreground shadow-action`                                             | Main buttons and action links         |
| Accent and highlight | `text-accent`, `text-highlight`, `bg-accent-soft`                                            | Emphasis and small visual signals     |
| Feedback             | `text-success bg-success-soft`, `text-warning bg-warning-soft`, `text-danger bg-danger-soft` | Status and validation                 |
| Destructive action   | `bg-danger text-danger-foreground hover:bg-danger-hover`                                     | Destructive controls                  |
| Focus and overlay    | `ring-focus`, `bg-overlay/60`                                                                | Focus indicators and modal backdrop   |

Color roles are RGB CSS variables so Tailwind opacity modifiers work. `bg-action` and `bg-panel` use gradients defined as CSS variables. Pair foreground tokens with their intended backgrounds; avoid raw palette classes in product components.

## Layout and type

- Spacing: `px-page`, `py-section`, `p-card`, `gap-field`; `max-w-content` for the page container.
- Shape: `rounded-control`, `rounded-card`, `rounded-pill`; `shadow-card` for elevated surfaces.
- Type: `font-sans`, `text-display`, `text-heading`, `text-subheading`, `text-body`, `text-caption`.

The font stack uses system fonts, so no network font request is required.

## Themes

Dark is the default theme. `html.light` swaps the same semantic tokens to the light palette; component markup does not carry parallel theme classes. The public theme toggle stores the explicit choice in `localStorage`, and `src/app.html` applies it before the page renders.

Check token changes in both themes for contrast and visible keyboard focus. Reduced-motion preferences disable nonessential animation and transitions.
