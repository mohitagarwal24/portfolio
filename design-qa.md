# Build Lab design QA

final result: passed

## Visual truth and normalization

Source: `design/approved-build-lab.png`, the first palette iteration of Build Lab explicitly selected by the user on 21 October 2026. Implementation: `artifacts/build-lab/hero.png` and `hero-ready.png`. Both source and desktop captures are 1860 ×846 pixels, viewport 1860 ×846 CSS pixels, deviceScaleFactor 1. No browser chrome or density correction. Full-view paired comparison: `artifacts/build-lab/comparison.png` (equal-sized originals combined, then scaled for viewing). Native-size detail comparisons: `focus-name.png` and `focus-computer.png`.

Source depicts a mid-drag/mid-build state. The stable implementation comparison is idle; `hero-ready.png` confirms the completed state. Consequently progress wording, the dragged pill and physical pill positions intentionally differ. The mockup is not used as a raster webpage.

## Required fidelity surfaces

- **Fonts and typography:** real Archivo variable at width62/weight900 for display, Instrument Sans body and JetBrains Mono terminal/metadata. The two-line square-particle name occupies the approved left 44.5%, with readable dark foreground. Main copy keeps the approved wording, size relationship and left alignment. Slight differences in particle density and native font rasterization remain acceptable.
- **Spacing and layout:** desktop name, copy, cream computer and own illustrated portrait retain the selected hierarchy and proportions. The dock and terminal actions are real controls. Mobile 390 ×844 viewport uses a 1020px-tall hero so the complete content remains visible by scrolling; all pills and four skill disks fit inside the hero. Tablet 768 ×1024 retains two columns. CSS overflow checks additionally pass at 320, 390, 768 and 1024px.
- **Colors and tokens:** warm parchment/espresso/vermilion replace cobalt across page, navigation, filters, dialogs, CV and social metadata. Muted sage/apricot/butter/lavender surfaces complement the imagery. Dark contact uses warm cream text, with appropriate secondary contrast. Automated scans report zero violations for the tested WCAG tags.
- **Image quality:** individual transparent computer and developer-badge assets match the selected tactile illustration style and retain Mohit's recognizable face. The paper background is a full-frame 16KB raster with fine grain, no repeated seams. Actual project images and reviewed PDF retain their provenance. No placeholder or code-drawn computer/portrait is used.
- **Copy and content:** approved headline, supporting line and Build Lab concept are present. The preview animation leads to real project notes; it does not execute or deploy a repository. The reviewed Notion facts, fifteen reports, real résumé, contact destination and source distinctions remain available.

## Comparison and correction history

1. Initial desktop/mobile inspection found repeated paper seams and a clipped mobile pill row. Replaced the crop with a full-frame texture, removed the collection height cap and gave the four categories their own row. `comparison-first.png` retains the initial desktop evidence.
2. Regression verification caught a malformed `.proof-panel` selector after obsolete basketball CSS removal; restoring its relative positioning prevents later preview images from intercepting hero controls. This was a functional regression, corrected before handoff.
3. Raised/inset the physical floor/walls and added collision clearance. The first iteration anchored skill disks; the user explicitly reversed that choice on 22 October. All four circles are dynamic in the final version. Spawn project pills above the anchors and recover any throw that escapes vertical bounds. Focused pills rise above the pile for both mouse and keyboard focus. These fixes preserve the playful drag interaction. Cached pill dimensions avoid repeated layout reads inside the animation loop.
4. Post-fix capture and tests: `hero.png`, `hero-ready.png`, `mobile-hero-full.png`, `mobile-hero-ready.png`, `tablet-hero.png` and the paired/focused comparisons. Final 26/26 browser checks pass, including exposed centers for every settled hero pill, actual pointer drop, preview completion, report opening, keyboard B and reset. Runtime error collection is empty.

## Interaction and responsive evidence

Production verification used `http://localhost:3001`. The existing development preview at 3000 also serves Build Lab. Tested skills and arrow/Home/End navigation, every archive filter, all fifteen dialogs and Escape/focus restoration, command search, contact selection/editing/mailto, EN/HI, redirects,404, reduced motion and no-JavaScript content. Captures for other unchanged sections are under `artifacts/build-lab/`: proof, skills, selected, archive, CV and contact. Screenshot collection alone is not the verification; interactions and accessibility scans are in `artifacts/verification/redesign-results.json`.

## Follow-up polish

- P3: project pills remain physical objects; exact pile angles/positions vary and a long pill can touch the small supporting line. The main introduction and Build Lab controls stay readable; all projects also remain available in ordinary cards and search. Reduced motion and small screens use a static collection.
- P3: the source's hand-drawn arrow and accent strokes are omitted; the live labeled dock, pointer feedback and Try Build Lab control carry that affordance. Native progress is continuous rather than painted segmented bars.

## 22 October requested refinements

The user’s latest instructions supersede the original mockup’s dotted tray and drop/build helper copy. Both are removed. Falling projects are caught automatically at the top edge of the monitor, shrink/fade into the computer and remain absorbed until reset. Try Build Lab and keyboard B demonstrate the same gravity-driven entry. The skill circles fall and bounce; release wakes bodies even after a hold longer than Matter’s sleep threshold. Body-only hydration suppression tolerates the demonstrated Grammarly attributes; an injected-extension test against the Next development server confirms no hydration console warning.

Final 26/26 browser checks pass. The latest production captures show the clean tray, removed helper text and mobile adaptation. Source palette, own portrait, typography and section hierarchy remain unchanged by this focused update. No actionable P0/P1/P2 finding remains. Deployment is handled by the existing Vercel/main integration and checked through GitHub statuses.
