# daybook style guide

The visual rules for daybook's web app. The future iOS and macOS apps should follow the same palette and semantic roles.
Tokens live in [`web/src/styles/tokens.css`](../../web/src/styles/tokens.css). Contrast ratios below come from
[`scripts/check-contrast.mjs`](../../scripts/check-contrast.mjs), so rerun it whenever you change a colour:

```bash
node scripts/check-contrast.mjs   # exits non-zero if any pairing fails WCAG AA
```

## 1. Principles

- **Calm, not loud.** A planner is open all day. Use soft backgrounds, one accent colour and few shadows.
- **Colour has meaning.** The accent marks *interactive* or *selected*. Priority and status always pair colour with a label or icon (about 1 in 12 men has a colour-vision deficiency).
- **Readable first.** All text meets WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text (≥24px, or ≥18.66px bold) and UI boundaries.
- **Semantic tokens only.** Components use `var(--color-text)` and never `#1F2A1C`. That is what makes dark mode a token swap rather than a rewrite.

## 2. Palette

### Brand colours

| Name | Hex | Role |
|---|---|---|
| **Ivory** | `#F4F6E8` | Light theme: page background (main theme) |
| **Fern** | `#5F8651` | Light theme: accent (fills, focus rings, selected states, borders, large text) |
| **Dim Grey** | `#6F6E6A` | Dark theme: card and panel surfaces (main theme) |
| **Lavender** | `#E5E6FA` | Dark theme: accent and primary text (secondary theme) |

### Supporting colours (derived, so the brand colours stay readable)

| Name | Hex | Why it exists |
|---|---|---|
| Ivory Raised | `#FBFCF5` | Cards sit slightly above the Ivory page |
| Fern Deep | `#476A3C` | Fern on Ivory is only 3.83:1, which is fine for fills but too low for small text. Fern Deep (5.65:1) is used for links, accent text and **primary buttons** (white label = 6.19:1) |
| Fern Tint | `#DCE7D3` | Chip and calendar-event backgrounds |
| Forest Ink | `#1F2A1C` | Light body text, a green-tinted near-black that suits Ivory better than pure black |
| Moss Grey | `#55604F` | Light muted/secondary text |
| Dim Grey Deep | `#4A4946` | Dark page background. Lavender on Dim Grey itself is ~4.1:1, so the page uses this deeper shade (7.3:1) and Dim Grey becomes the card colour |
| Dim Grey Hover | `#5A5955` | Dark hover/pressed surface |
| Ghost White | `#FAFAFF` | Dark body text on Dim Grey cards (4.91:1) |
| Lavender Mist | `#D2D3E8` | Dark muted text, **page background only** |
| Lavender Tint | `#C9CBEF` | Dark chip and calendar-event backgrounds |
| Night Ink | `#2E2D3A` | Text on Lavender buttons and chips |

## 3. Semantic tokens

| Token | Light | Dark | Use for |
|---|---|---|---|
| `--color-bg` | Ivory | Dim Grey Deep | Page background |
| `--color-surface` | Ivory Raised | Dim Grey | Cards, columns, modals, sidebar |
| `--color-surface-hover` | `#EEF1DF` | Dim Grey Hover | Hovered rows/cards |
| `--color-border` | `#D5DBC6` | `#85847F` | Dividers, card outlines (decorative) |
| `--color-text` | Forest Ink | Ghost White | Body text |
| `--color-text-muted` | Moss Grey | Lavender Mist | Metadata, timestamps, placeholders |
| `--color-accent` | Fern | Lavender | Selected states, progress bars, focus ring, icons |
| `--color-accent-text` | Fern Deep | Lavender | Links and accent-coloured text |
| `--color-accent-tint` / `--color-on-accent-tint` | Fern Tint / Forest Ink | Lavender Tint / Night Ink | Chips, calendar events |
| `--color-primary-bg` / `--color-on-primary` | Fern Deep / white | Lavender / Night Ink | Primary buttons |
| `--color-danger` | `#B42318` | `#FFC2B8` | Overdue, delete, errors |
| `--color-warning` | `#8A5A00` | `#F3D58F` | Due soon, blocked |

### Contrast results (from the script)

| Pairing | Ratio | Needs |
|---|---|---|
| Light body text on page / card | 13.65 / 14.47 | 4.5 |
| Light muted text on page / card | 6.05 / 6.41 | 4.5 |
| Fern Deep text on page / card | 5.65 / 5.99 | 4.5 |
| Fern on Ivory (fills, focus, large text) | 3.83 | 3 |
| White on Fern Deep button (hover `#3B5932`) | 6.19 (7.89) | 4.5 |
| Text on Fern Tint chip | 11.67 | 4.5 |
| Lavender text on dark page | 7.30 | 4.5 |
| Ghost White on Dim Grey card | 4.91 | 4.5 |
| Lavender on Dim Grey card (large text/icons only) | 4.14 | 3 |
| Muted (Lavender Mist) on dark page | 6.10 | 4.5 |
| Night Ink on Lavender button (hover `#F2F2FD`) | 10.97 (12.17) | 4.5 |
| Text on Lavender Tint chip | 8.55 | 4.5 |
| Ghost White on dark hover surface | 6.74 | 4.5 |
| Danger / warning, light | 6.37 / 5.74 | 4.5 |
| Danger / warning, dark | 5.86 / 6.31 | 4.5 |

### Known constraint: dark cards
Dim Grey is a mid-tone, so text on it has little contrast headroom. On dark cards:
- Body text is **Ghost White**, not Lavender.
- **Don't use muted text on cards.** Show hierarchy with size and weight (e.g. metadata at `--text-sm` and weight 500) rather than a dimmer colour.
- Lavender on cards is only for headings ≥24px, icons and borders.

## 4. Typography

- Family: `--font-sans` (Inter if loaded, otherwise the system UI font). Use tabular numbers (`font-variant-numeric: tabular-nums`) for times, dates and counts so calendar columns line up.
- Scale: `xs 12` · `sm 14` · `base 16` · `lg 18` · `xl 22` · `2xl 28` · `3xl 36` (px).
- Weights: 400 body, 500 labels/metadata, 600 headings and buttons. Avoid 700+.
- Line height: `1.5` for body, `1.25` for headings.
- Sentence case everywhere ("New task", not "New Task").

## 5. Space, shape, depth, motion

- Spacing uses a 4px grid: `--space-1` (4) … `--space-12` (48). Card padding is `--space-4`, the gap between cards is `--space-3`, and section gaps are `--space-8`.
- Radius: `--radius-sm` 6 (inputs, chips), `--radius-md` 10 (cards, buttons), `--radius-lg` 16 (modals), `--radius-pill` (tags, avatars).
- Depth: only `--shadow-card`, on cards and popovers. Don't stack shadows. In dark mode, a lighter surface signals elevation more than a shadow does.
- Motion: `--duration-fast` (120ms) for hover, `--duration-base` (200ms) for open/close and drag-drop settle, with `--ease-out`. Both drop to 0 under `prefers-reduced-motion`.
- The old dark gradient (`#1a1a2e → #16213e`) and glassy cards are retired.

## 6. Components

**Buttons**
- *Primary*: `--color-primary-bg` + `--color-on-primary`, at most one per view (e.g. "Add task").
- *Secondary*: transparent background, `--color-border` outline, `--color-text`.
- *Danger*: `--color-danger` text and outline. Fill it only inside a confirm dialog.
- All buttons: min height 36px (44px on touch), and a 2px focus ring in `--color-focus` with a 2px offset via `:focus-visible`.

**Cards (tasks, lists)**: `--color-surface`, `--radius-md`, `--shadow-card`, 1px `--color-border`. Hover uses `--color-surface-hover`. Completed tasks: strike-through title and `--color-text-muted` (on light only; on dark cards keep Ghost White and rely on the strike-through and a check icon).

**Inputs**: `--color-surface` background, 1px `--color-border`. On focus, the border becomes `--color-accent` and the focus ring appears. Error state: `--color-danger` border plus a message below (never colour alone).

**Priority**: always icon + word: `↑ High` (danger colour), `→ Medium` (warning colour), `↓ Low` (muted). Never a coloured dot on its own.

**Labels**: user-chosen colours appear as a **6px swatch** plus the label name in `--color-text`, never as text coloured with the user's choice (we can't guarantee its contrast).

**Calendar events**: `--color-accent-tint` background, `--color-on-accent-tint` text, 3px left border in `--color-accent`. All-day/due-date markers use the same tint at full width. Today's column: `--color-surface-hover`. Overdue: `--color-danger` left border.

**Empty states**: one muted sentence plus one primary action ("Nothing due today. Add a task").

## 7. Do and don't

| Do | Don't |
|---|---|
| Use Fern Deep for small accent text on Ivory | Put small Fern text on Ivory (3.8:1) |
| Use Ghost White for body text on Dim Grey cards | Put body text in Lavender on Dim Grey cards (4.1:1) |
| Pair every status colour with an icon or word | Rely on red/green alone |
| Add new colours as tokens in `tokens.css`, then rerun the script | Hard-code hex values in components |
| Test both themes (`data-theme="light"` / `"dark"` on `<html>`) | Assume the OS theme is light |
| Leave room for text ~40% longer than English (buttons, tabs, labels wrap or grow) | Give text a fixed width that only fits English |
| Use CSS logical properties (`margin-inline-start`, `padding-inline`) | Use `left`/`right` for spacing that should flip in right-to-left languages |
| Take all text, including `aria-label`, from the locale files | Put words inside icons or images |
