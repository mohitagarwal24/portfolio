# Ascent handoff verification

Verified 8 October 2026 against a local production build. The work already present in the Claude handoff was preserved and completed; no deployment or Git commit was made.

## Completed

- Restored five empty files left by the interrupted session: 404, Logs, route template, sitemap and robots.
- Added home, About and all 15 project Open Graph images, canonical URLs and an Ascent favicon.
- Added the portrait-processing command, explicit image-processing dependency, reliable screenshot capture failure handling and content/deployment documentation.
- Fixed cover-art types, mobile text wrapping, semantic filters, command dialog labels and mobile navigation labels.
- Reduced-motion mode skips camera travel, parallax, object rotation and hero scrolling effects. The scene renders on demand; camera updates precede lighting updates.
- Browsers without hardware-accelerated WebGL use a static image captured from the site's scene. Loading progress no longer pulls the Three.js bundle into every page's initial JavaScript.
- Disabled Cache Components/partial prerendering to allow `dynamicParams = false`. Unknown project URLs now return HTTP 404, and all published pages build statically.
- RSS navigation and sitemap entries depend on available posts. Invalid items, unsafe URL schemes, missing dates and feed failures are handled without breaking the site.

## Checks

- ESLint, TypeScript and production build pass. All routes are static (`○` or `●`).
- 18 content pages return 200: Home, Work, About and 15 project reports.
- `/logs`, an unknown top-level URL and an unknown project URL return 404.
- 17 generated social images return PNG responses. Sample project previews were visually inspected.
- All 10 project image references exist locally. All 19 linked project destinations returned HTTP 200.
- The old Nexus and ResQ demo addresses return HTTP 402. Their published project pages retain repository-only links.
- Desktop (1440×900) and mobile (390×844) screenshots cover Home, Work, TradeLayer, About and 404. No horizontal overflow or WCAG A/AA violations were detected by axe on these pages.
- Interaction checks cover domain filters, Ctrl+K search/navigation, gallery open/next/Escape, mobile navigation and content without JavaScript.
- A separate browser check exercises the accelerated scene branch with a software-renderer test fixture: the same canvas survives Home → Work → About, with no runtime errors. Desktop screenshots also confirm the original animated scene; real-device GPU performance still needs a hardware browser.
- Temporarily invalidating TradeLayer's name causes the build to fail with the file and field identified. The original metadata was restored and a valid build completed.
- The portrait pipeline was exercised with a synthetic input and produced an 800×1000 WebP while retaining its source.

- The supplied orbital portrait is displayed in the Home crew viewport and About badge, and the supplied Google Drive resume is linked from Home and the command palette.
- The Home portrait uses a 240px frame beside the bio on desktop and a 160px frame above it on mobile. Production checks at 1440×900 and 390×844 confirm both images load, no horizontal overflow or browser errors occur, and the intro has no axe WCAG A/AA violations. ESLint, TypeScript and the production build pass after this change.
- The palette scrolling regression was reproduced: a wheel event moved the background 483 pixels while the list stayed at zero. After the fix, `npm run verify:palette` passes at desktop and mobile widths, with normal and reduced motion. It covers independent list scrolling, scroll boundaries, backdrop locking, closing/reopening, resumed page scrolling, navigation, portrait loading and the resume URL.

## Performance

Desktop Lighthouse on the production server: **Performance 97, Accessibility 100, Best Practices 100, SEO 100**. LCP 0.8 seconds, total blocking time 10 milliseconds, speed index 1.7 seconds. No audit warnings.

This headless environment uses software graphics, so these scores cover the static fallback. The initial always-on software-rendered scene scored 41 and caused an audit timeout; this led to the capability-based fallback. Scores are local measurements, not guarantees for every device or deployment.

Reproduce with `npm run verify`, `npm run verify:palette` and `npm run audit` while `npm start` is running. Browser reports/screenshots are in `artifacts/verification/`; Lighthouse HTML/JSON are in `artifacts/`. These generated files are ignored by Git.

## Owner-supplied items

- Headshot and resume link have been supplied and integrated.
- Choose the production domain and set `NEXT_PUBLIC_SITE_URL` before deployment. The local default is intentionally localhost.

`npm audit` reports five high-severity findings in the development-only ESLint → fast-glob → micromatch → braces chain. The suggested automatic fix downgrades the Next.js ESLint configuration across major versions, so it was not applied. Production dependencies have no reported findings in this audit.
