# CineRate design system

A calm dark UI: solid surfaces, one action colour, one highlight colour, no decoration. All tokens live in `:root` of `src/styles/global.css` (`pwa.css` and `public/offline.html` reuse them).

## Tokens

**Colour roles** (solid values only, so contrast is predictable)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b1020` | page |
| `--surface` / `--surface-raised` | `#121a30` / `#1a2440` | containers, fields, skeletons |
| `--border` / `--border-strong` | `#2a3558` / `#3d4a74` | dividers / control outlines |
| `--text` / `--text-muted` / `--text-disabled` | `#eef1f8` / `#a5aec6` / `#8f99b5` | muted >= 6.9:1 on every surface, disabled >= 5.4:1 |
| `--primary` / `--primary-hover` | `#2f66f0` / `#2557d6` | buttons (white text 4.9:1); `--primary-text` `#8aa9ff` for links and focus |
| `--accent` | `#f5b04d` | ratings, stars, active nav underline. Nothing else |
| `--danger`, `--success` | `#ff8a8a`, `#4ade80` | errors, online dot |

**Spacing** `--space-1..8` = 4, 8, 12, 16, 24, 32, 48, 64 px. Sections are separated by `--space-8` (`--space-7` on mobile); related items by `--space-2..4`.

**Type** Inter for body; Montserrat 300 for `h1` only. `--text-xs` 12, `sm` 14, `base` 16, `lg` 18, `xl` 20, `--text-2xl` and `--text-3xl` use `clamp()`.

**Radius** `--radius-sm` 8 (controls), `md` 12 (posters), `lg` 16, `xl` 20 (containers), `full`. Nested radius = outer radius - padding: the search box sets `--r` and `--pad`, and its input and button use `calc(var(--r) - var(--pad))`.

**Shadow** `--shadow-2` for floating layers only (mobile menu, toasts). Surfaces are otherwise flat.

**Motion** `--dur-fast` 120ms, `--dur` 200ms, `--ease`. Used for hover/focus, button press (scale .97), skeleton shimmer, menu, toast and new-review entrance. Everything is disabled under `prefers-reduced-motion`.

## Components

- **Button** `.btn` is the solid primary action (one per view). `.btn-outline` is secondary, `.btn-ghost` is tertiary. `.is-pending` plus `disabled` shows an inline spinner.
- **SearchBox** is icon, input and primary button in one container. `size="lg"` is used for the Home hero.
- **MovieCard** is a poster (radius md), then title and a plain `star rating · year` line. The title aligns with the poster edge.
- **Icon** (`components/Icon.jsx`) is the only icon source: 24px grid, 1.75 stroke, round caps, `currentColor`. Add new shapes to `SHAPES`.
- **Connectivity indicator** lives in the navbar: a dot (`--success` online, `--danger` offline) plus text; below 768px only the dot shows and the text stays for screen readers (`role="status"`). Offline also shows a full-width red bar above the header. Nothing is fixed over content except toasts (bottom-centre, safe-area aware).
- **Skeletons** (`components/Skeletons.jsx`) mirror the final layout for grids, hero posters, details, reviews and dashboard.
- **Stats, panels, reviews** are grouped by whitespace, not boxes. Only auth, offline notice and toasts use a surface.

## Rules

1. Muted text uses `--text-muted`; never lower opacity for contrast.
2. `--accent` is for ratings and highlights only; `--primary` is for actions only.
3. Monospace is for identifiers (the user ID). Numbers use `font-variant-numeric: tabular-nums` (`.num`, ratings, counts, dates).
4. No italics, gradients, glows, blur, or background decoration.
5. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty` and a 68ch max width.
6. Touch targets are at least 44px; inputs are 16px on small screens (prevents iOS zoom).
7. Visually redundant labels stay in the DOM as `.sr-only`.
