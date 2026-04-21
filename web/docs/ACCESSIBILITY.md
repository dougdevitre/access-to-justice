# Accessibility — what we've done, what you still need to verify

Target: **WCAG 2.1 AA**. This document is the practical pre-launch
checklist. Automated coverage is in place; the items under "Manual
verification required" can only be confirmed by a human and must be
walked through before any production launch.

## Automated coverage (already passing)

- `eslint-plugin-jsx-a11y` runs in `npm run lint` and in CI. Violates
  the build if any a11y rule fires.
- Semantic landmarks present on every page: `<header>` (TopBar),
  `<main id="main">`, `<nav aria-label="Primary">` (BottomNav),
  `<footer>` with a descriptive `aria-label` on the internal `<nav>`.
- `<html lang={locale}>` set by the locale layout.
- Skip-to-content link renders before the top bar and is visible on
  focus.
- Exactly one `<h1>` per page; section structure uses `<h2>` subheadings.
- All interactive controls have visible focus rings via the shared
  `focus-visible:ring-2 focus-visible:ring-brand` Tailwind pattern.
- `BottomNav` sets `aria-current="page"` on the active route.
- Forms: every input has a programmatic label; required fields set
  `aria-required`; fields with errors set `aria-invalid` and
  `aria-describedby` pointing at the error span (which carries
  `role="alert"` for immediate announcement). Form-level errors sit
  inside `role="alert" aria-live="polite"`.
- Touch targets are at least 44 × 44 CSS px (`min-h-11` / `min-h-12`).
- No animations triggered by user motion; `prefers-reduced-motion` is
  effectively honored by the absence of animation.

## Color-contrast sign-off

All ratios computed against WCAG AA (4.5:1 for normal text, 3:1 for
large text / UI components).

| Foreground | Background | Ratio | Use | Verdict |
| --- | --- | --- | --- | --- |
| `#1f4e79` (brand) | `#ffffff` | 8.3 : 1 | Body links, focused text | AAA |
| `#1e293b` (slate-800) | `#f8fafc` (slate-50) | 14.9 : 1 | Body text | AAA |
| `#475569` (slate-600) | `#f8fafc` | 7.6 : 1 | Secondary text | AAA |
| `#ffffff` | `#1f4e79` | 8.3 : 1 | TopBar brand, primary buttons | AAA |
| `#e7effa` (brand-soft) | `#1f4e79` | 6.8 : 1 | Hero subtitle, button-soft text | AA |
| `#b91c1c` (red-700) | `#fef2f2` (red-50) | 6.5 : 1 | Field error messages | AAA |
| `#78350f` (amber-900) | `#fffbeb` (amber-50) | 10.4 : 1 | LegalReviewBanner text | AAA |

Re-run the contrast check any time the palette changes (any edit to
`tailwind.config.ts` or a `bg-*` / `text-*` class swap).

## Manual verification required (blocks launch)

Work through this on the deployed staging build, not in dev mode (so
the SW and production CSP are in play). Mark each row ✅ before launch.

### 1. Keyboard-only walkthrough — both locales

**Path**: `/` → language switcher → `/en/find-help` → `/en/intake`
→ submit an empty form → see focus land on the first error.

Check:

- [ ] Tab order follows visual order.
- [ ] Every interactive element is reachable with Tab (no mouse-only
      controls).
- [ ] Focus indicator is visible on every stop.
- [ ] Skip link appears on the first Tab press and jumps focus to main.
- [ ] `Enter` submits the intake form; `Space` toggles the select.
- [ ] No keyboard traps (Esc closes any overlay; Tab always moves on).
- [ ] After a validation error, focus moves to the first invalid field
      OR the error summary is announced (whichever your screen reader
      picks up — see section 2).

### 2. Screen-reader smoke

Pick one of each:

- iOS Safari + VoiceOver.
- Windows Firefox + NVDA.
- macOS Chrome + VoiceOver.

Check:

- [ ] Page title announced on navigation.
- [ ] `<h1>` announced once per page.
- [ ] Nav links announce their label + active state (e.g. "Home, current
      page").
- [ ] Form fields announce label, required state, and current value.
- [ ] Error messages announce when submit fails.
- [ ] Legal-review banner announces its heading ("Legal review
      required") and body.

### 3. Zoom

- [ ] Desktop Chrome + 200% zoom: no horizontal scroll, no clipped
      controls, bottom nav still reachable.
- [ ] iOS Safari + pinch to 200%: text reflows, nothing overlaps.

### 4. Forced colors (Windows High Contrast)

- [ ] Open in Edge with Windows High Contrast on. Borders, focus rings,
      and interactive elements remain visible. Text is legible.

### 5. Reduced motion

- [ ] System `prefers-reduced-motion: reduce` enabled: nothing animates
      unexpectedly. (We don't currently use animations; this is a
      regression check.)

### 6. Mobile touch

- [ ] Every tap target is at least 44 × 44 CSS px. Spot-check BottomNav
      icons, form inputs, language switcher chips.
- [ ] No pinch-to-zoom blocked (`viewport` does not include
      `maximum-scale=1` or `user-scalable=no`).

## When to re-run

- Every new page or interactive component: run `npm run lint` (jsx-a11y
  catches most mechanical issues).
- Any palette change: redo the contrast table.
- Any form change: re-verify field labels, errors, and tab order.
- Before every production deploy that touches UI code: walk the manual
  checklist end-to-end.

## What we have not done

Noted on `/accessibility` so users know:

- No formal third-party audit (no VPAT).
- Screen-reader testing is not systematic across every major reader.
- Cognitive accessibility (reading level, plain language) hasn't been
  reviewed by a plain-language editor.
- Spanish copy has not been reviewed by a legal-aid translator (see
  `web/messages/TRANSLATIONS.md`).

## Follow-ups that strengthen this baseline

- Automated axe-core checks run in CI via Playwright (next batch).
- Plain-language review of Resources and Intake copy with a
  legal-aid editor.
- Third-party audit + VPAT once the site has real content and users.
