# @elamais/ui

ELA+ design system: design tokens, React components and hooks shared by the
four ELA+ apps. ELA+ is a premium women's benefits club — the UI voice is
elegant, feminine PT-BR microcopy, "value, not price".

- **Stack**: React 19 + TypeScript, built with Vite (library mode, ESM +
  `.d.ts`), plain CSS on top of design tokens (no CSS-in-JS, no Tailwind).
- **Source of truth**: `design-reference/tokens.css` / `tokens.json` and
  `design-reference/componentes.html` (official component specs).

## Install

Private package, consumed via `file:` or git dependency:

```jsonc
// package.json of an app
{
  "dependencies": {
    "@elamais/ui": "file:../elamais-ui"
  }
}
```

`react` and `react-dom` (>= 19) are peer dependencies.

## Usage

```tsx
// main.tsx — import the styles once (tokens + base + components)
import "@elamais/ui/styles.css";

import { Button, ToastProvider, useToast, tokens } from "@elamais/ui";

function App() {
  return (
    <ToastProvider>
      <Button variant="primary">Usar benefício</Button>
    </ToastProvider>
  );
}
```

### Fonts

The package does **not** bundle webfonts. Add the official Google Fonts link
to each app's `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
```

Components reference the families only through the tokens
(`--font-display` = Playfair Display, `--font-sans` = Montserrat), which
declare system fallbacks.

## Components

| Component | Purpose |
| --- | --- |
| `Button` | `primary` / `secondary` / `ghost` / `destructive`; `loading`, `disabled`, `fullWidth`. 52px mobile / 48px desktop. |
| `TextField` | Labelled input with hint and error state (`aria-invalid` + linked message). |
| `CheckboxField` | Checkbox row: `label` (node, e.g. with a Badge), `description`, `error`, `disabled`, `id`, controlled `checked`/`onChange`, `indeterminate` (dash + `aria-checked="mixed"`). Whole row is a 44px target. |
| `CheckboxGroup` | Titled fieldset (`title`, `description`, `error`, `disabled`) of CheckboxFields with an optional tri-state "Marcar/Desmarcar todas" toggle (`selectAll={{ checked, total, onChange(next) }}`). |
| `Chip` | Selectable category chip (`aria-pressed`, 44px touch target). |
| `Badge` | Status badge: `brand`, `gold`, `lilac`, `success`, `warning`, `error`, `info`, `neutral`. |
| `Card` | Base white surface (radius 16, elevation e1; `elevated`, `goldBorder`, `padding`). |
| `BenefitCard` | Partner benefit: 3:2 image area, "% OFF" tag, category, name, distance, rating, unavailable state. |
| `PlanCard` | Plan pricing card; `highlighted` renders the plum "Recomendado" version. |
| `CycleToggle` | Mensal/Anual segmented radiogroup. |
| `MemberCard` | Member card ("carteirinha"): plum card, champagne hairline, name, plan, QR slot via `children` (QR always on off-white). |
| `CodeDisplay` | Redeem screen: big spaced code, QR slot, countdown + champagne progress bar, last-minute warning, expired state. Pairs with `useCountdown`. |
| `WalletBalance` | XP wallet: available vs pending with "libera em DD/MM" pill. XP is a points program — never a BRL balance. |
| `SavingsRow` | Statement line with "você economizou R$ X" emphasis; `saved` / `pending` / `debit`. |
| `RatingStars` | Star rating: read-only (`role="img"`) and input (`radiogroup`, arrow keys). |
| `Toast` / `ToastProvider` | One-line toasts above the tab bar, 4s auto-dismiss, no close button. Fire via `useToast()`. |
| `Modal` | Accessible dialog: Esc/overlay close, focus trap and focus restore. |
| `BottomSheet` | Bottom-anchored dialog with drag handle, radius 24 top. |
| `EmptyState` | Icon in champagne circle + serif title + description + action slot. |
| `Skeleton` | Pulsing placeholder (`text` / `rect` / `circle`). Never a full-screen spinner. |
| `AppBar` | `brand` (plum + the official logo) or `page` (off-white, back button + title). |
| `Logo` | The approved ELA+ artwork, inlined (never typed — brand manual). `tone` `positive` (plum, light grounds) / `negative` (off-white, plum grounds); `title=""` when a link already names it. Size with CSS `height`. |
| `SiteBar` | The institutional site's plum bar: logo to `homeHref`, `nav` links (hidden under 560px) and a champagne `cta`. `renderLink` lets an app use its router. |
| `SiteFooter` | The institutional site's footer: logo, slogan, `social` networks, link `columns` and the copyright `year`. Same `renderLink`. |
| `TabBar` | 5-item bottom navigation; active item in plum with a 4px champagne dot. |
| `RichTextEditor` | Controlled rich text field (`value` HTML + `onChange(html)`, `label`/`hint`/`error`/`disabled`/`id`/`minHeight`) for backoffice contents. contentEditable with a WAI-ARIA toolbar (bold, italic, underline, H2/H3, paragraph, lists, quote, link with http(s)/mailto validation, clear, undo/redo); output sanitized on every change and on paste. No extra runtime dependency. |
| `RichTextView` | Read-only render of a rich text body (`html`), sanitized, same typography as the editor. |

### Hooks

- `useCountdown(target: Date | number, options?)` — counts down to a `Date`
  or for a duration in ms; pauses on expiry, exposes `remainingMs`,
  `formatted` (`mm:ss`), `isExpired`, `restart()`.
- `useToast()` — toast API from `ToastProvider`.
- `useDisclosure(initialOpen?)` — `isOpen` / `open` / `close` / `toggle` for
  Modal and BottomSheet.

### Formatting helpers (pt-BR)

`formatBRL`, `formatXp`, `formatRating`, `formatMmSs`, `formatDayMonth`.

### Rich text safety

`sanitizeHtml(html: string): string` keeps only `p`, `br`, `strong`/`b`,
`em`/`i`, `u`, `h2`, `h3`, `ul`, `ol`, `li`, `blockquote` and `a[href]`
(http, https or mailto only, forced `target="_blank"` +
`rel="noopener noreferrer"`); every other tag is unwrapped or dropped with
its content (scripts, styles, media, forms) and every other attribute is
removed. Also exported: `isSafeLinkUrl(url)` and `plainTextToHtml(text)`.

## Tokens

All styling is driven by the CSS custom properties in `src/styles/tokens.css`
(shipped inside `styles.css`). The same values are exported as a typed object:

```ts
import { tokens } from "@elamais/ui";

tokens.color.brand.plum.base; // "#3D1B35"
tokens.radius.lg;             // 16
```

Never hard-code colors in app code — use the CSS variables
(`var(--ela-plum)`, `var(--text-gold)`, ...) or the `tokens` object.

## Accessibility rules

- **Champagne (`#D8B99A`) is decorative only.** Text on light surfaces uses
  `var(--text-gold)` (`#7A5A2E`); icons on light surfaces use
  `--ela-champagne-600` (`#B08A4F`). Both meet AA contrast.
- Focus is always visible: every interactive element uses
  `:focus-visible { box-shadow: var(--focus-ring) }`.
- Touch targets are at least 44px (`--touch-min`), including chips (visual
  40px + extended hit area) and tab bar items.
- Every component is keyboard-accessible with proper ARIA: toggle chips use
  `aria-pressed`, rating and cycle toggles are radiogroups with arrow-key
  support, dialogs use `role="dialog"` + `aria-modal` with Esc close, focus
  trap and focus restore, toasts announce via `role="status"` / `role="alert"`.
- QR codes render plum on white/off-white with a quiet zone — never on plum.

## Development

```bash
npm install
npm test        # vitest + testing-library (jsdom)
npm run build   # vite lib build -> dist/index.js + dist/styles.css + d.ts
npm run lint    # tsc --noEmit
npm run dev     # vite build --watch
```

Component pattern: presentational only (props in, events out — no fetching,
no global state), one component per folder (`Component.tsx`, `component.css`,
`Component.test.tsx`, `index.ts`), reusable logic in custom hooks, everything
exported from `src/index.ts`. Versioned by SemVer; breaking changes bump the
major.
