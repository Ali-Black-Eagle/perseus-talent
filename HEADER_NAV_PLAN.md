# Header navigation plan: full menu on desktop, menu button on tablets and phones

**Date:** 19 November 2026
**Problem:** the full menu only appears from 1280px wide. Normal desktops and laptops at 100% scaling often have a browser window narrower than that, so they get the three-line menu button. **Desktop users must see the full menu words.** The button should appear only on tablets and phones.

## Target behaviour

| Window width | Header shows |
|---|---|
| **1280px and wider** | Unchanged: medallion, "PERSEUS TALENT" wordmark, 7 links at 15px, gap 24px (32px at 1536px and wider), "Calculate Your Fee" button |
| **1024–1279px (laptops, high display scaling)** | **Full menu.** Medallion and wordmark at full size (the wordmark is never hidden, owner's request), 7 links at 14px, gap 20px. "Calculate Your Fee" becomes a 44×44 gold-outline **calculator icon button** (`aria-label` and tooltip "Calculate Your Fee"). Measured: 108px between logo and menu at 1024. |

**Labels (owner's request):** "For Employers" → **"Employers"**, "For Candidates" → **"Candidates"** in the header, mobile menu, footer, breadcrumbs and 404 page. The home page panel eyebrows and browser-tab titles keep "For Employers / For Candidates".
| **Below 1024px (tablets and phones)** | Medallion and wordmark, three-line menu button, slide-out menu. The fee-calculator icon button still appears from 640px. |

The desktop breakpoint moves from Tailwind `xl` (1280) to **`lg` (1024)**. This is Tailwind's standard laptop breakpoint: iPad portrait (768–834) and most tablets stay on the menu button. The header height `--header-h` (72px below 1280, 88px from 1280) doesn't change.

## Changes

1. **`src/components/layout/Header.tsx`**
   - Desktop `<nav>`: `hidden xl:flex … gap-6 2xl:gap-8` becomes `hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8`.
   - Nav links: `text-[14px] xl:text-[15px]`, keep `whitespace-nowrap`.
   - "Calculate Your Fee" link: `ml-2 xl:ml-4 h-10 xl:h-11 px-4 xl:px-5 text-[12px] xl:text-[13px] whitespace-nowrap`. The label stays "Calculate Your Fee".
   - Mobile controls `<div … xl:hidden>` becomes `lg:hidden`; the slide-out panel `… xl:hidden` becomes `lg:hidden`.
   - Update the comments to say the desktop menu shows from 1024px.
   - If any JavaScript closes the menu on resize or reads a width (`matchMedia`, `innerWidth`), change 1280 to 1024. The drawer must close and the page must not stay inert or scroll-locked if the window is widened past 1024 while the menu is open: add a `matchMedia('(min-width: 1024px)')` listener that closes it.
2. **`src/components/brand/Logo.tsx`** (lockup, `size="header"` only): the wordmark gets `lg:hidden xl:block`, so it shows below 1024, is hidden from 1024 to 1279, and shows again from 1280. The emblem is 40px on phones and 48px from `md`, unchanged. The footer lockup is unchanged.
3. **No label changes.** Menu order and wording stay exactly as in `src/config/site.ts`.

## Acceptance checks (measure in a browser, not by eye)

At each width — **1024, 1100, 1180, 1279, 1280, 1366, 1440, 1536, 1920** — on `/`:
- The desktop menu is visible, the menu button is hidden.
- Every nav link is a single line (`getBoundingClientRect().height` of each link's text span at most 24px).
- At least 16px between the logo and the first link.
- `document.documentElement.scrollWidth <= innerWidth`.
- The "Calculate Your Fee" button is fully inside the viewport.

At **375, 768 and 1023**: the menu button is visible and the desktop nav is hidden; opening the menu works and Escape closes it.

At **1279 vs 1280**: the wordmark is hidden at 1279 and visible at 1280.

Resize with the menu open from 800 to 1100: the menu closes, and `main` and the footer are no longer `inert`.

## Tests

Add to `tests/e2e/e2e.spec.ts` a test **"Header shows full menu on desktop widths and menu button on tablet/phone"** that runs the visible/hidden and one-line checks above at 375, 768, 1023, 1024, 1280 and 1440. Existing mobile-menu tests that set a viewport at or above 1024 must use a viewport below 1024.

## Done when

`npm run verify` passes (lint, type-check, unit, content audit, build, accessibility checks, browser tests), and the acceptance checks pass in the browser.
