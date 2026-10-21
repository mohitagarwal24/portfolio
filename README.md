# Mohit Agarwal · Portfolio

A single-page portfolio built with Next.js 16.4, React, TypeScript and MDX. The warm parchment and vermilion interface follows the selected Build Lab mockup, retaining the supplied reference’s scroll-morphing particle field, illustrated developer portrait, Matter.js project playground, six isometric skill layers, six sticky project showcases, an image-led archive, a real résumé preview and a dark contact composer. See [DESIGN.md](DESIGN.md) for the selected visual target, tokens and original frame analysis.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview, run `npm run build` followed by `npm start`. Read the installed framework guides in `node_modules/next/dist/docs/` before changing Next.js code.

## Content

Public information was reconciled with Mohit's Notion Master Profile and reviewed résumé on 21 October 2026. See [CONTENT-SOURCES.md](CONTENT-SOURCES.md) for sources and corrections. Private outreach notes, compensation preferences and personal identifiers are excluded. Notion is an editorial source; the site does not need Notion credentials or fetch private content at runtime.

| What to edit | File |
| --- | --- |
| Contact, résumé, social links and canonical domain | `site.config.ts` |
| Experience timeline | `content/experience.ts` |
| Skill layers, featured project presentation, contributions and milestones | `content/portfolio.ts` |
| Project metadata and detailed notes | `content/work/*.mdx` |
| Project registry | `content/work/index.ts` |
| Page copy and section composition | `components/portfolio/Portfolio.tsx` |
| Layout, colors and responsive rules | `app/globals.css` |

Project metadata is validated with Zod at build time. Add a project MDX file, register it in `content/work/index.ts`, and map its actual preview in `archiveImages` in `content/portfolio.ts`; it then appears in search and, unless featured, the archive. The six featured slugs are selected in `Portfolio.tsx`; their preview assets and presentation are in `content/portfolio.ts`. Project reports are rendered on the server and passed into native dialogs. Detail links use `/#project-<slug>` and survive reloads. Legacy `/work`, `/about` and known `/work/<slug>` routes redirect permanently; unknown project routes return 404.

## Interactions and assets

- Move over the name to disperse particles; the accessible heading remains HTML. The same canvas morphs through four project proof chapters as you scroll.
- Drop or throw a project pill through the top of the computer to build its preview, or use **Try Build Lab**. The computer absorbs it with a shrinking animation; reset restores absorbed pills. The screen then offers **Explore project**. Enter opens a focused pill directly; **B** drops the focused project into the computer. Reset returns the screen and physics to their starting states. The short animation prepares the portfolio overview; it does not compile or deploy a repository.
- The hero skill circles are free physics bodies: they fall, bounce and can be dragged. Long holds still fall correctly on release.
- Select a skill layer with a pointer or arrow keys. Home/End jump to the first/last layer.
- Use **⌘K / Ctrl+K** for project and section search. Native dialogs support Escape, focus containment and scroll isolation.
- Small screens and reduced-motion preferences use static, clickable project pills. Particle and physics loops pause offscreen and settle when idle. Desktop pill geometry is reserved before hydration to prevent an initial layout jump; keyboard-focused pills rise above the pile.
- The portrait and footer open the full About dialog with education, experience, open source and achievements.
- Select a project need and timing to compose an editable email. The send button opens your mail client; there is no simulated submission.
- EN/HI changes core navigation and contact copy; technical project reports retain English.
- Project notes, the local reviewed résumé PDF and GitHub links remain available alongside the interaction. No-JavaScript pages retain the heading, all project summaries and external links.

Illustrated avatar and playground assets are in `public/about/` and `public/playground/`. LLM and NIFTY previews are explicitly labeled illustrative; their project claims come from the source content. Other previews use actual application screenshots, repository README captures, architecture diagrams, or reviewed project notes. ResQ and Nexus live demos returned HTTP 402; their covers do not imply a working deployment. The preview in `public/resume/` is rendered from the reviewed Drive PDF; the local download is that same file. Refresh public demo screenshots with `npm run capture -- gitcraft`; review changes before committing.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npm start
npm run verify
npm run audit
```

The browser suite defaults to `http://localhost:3000`; override it with `TEST_URL` when using another port. Lighthouse uses `SITE_TEST_URL`, defaulting to port 3000. The suite checks desktop/mobile layouts, Build Lab previews, drag-to-dock and keyboard building, keyboard controls, all project filters and dialogs, redirects, 404s, reduced motion, no-JavaScript content, social metadata and automated WCAG A/AA rules. Screenshots and reports are written under ignored `artifacts/verification/`. `node scripts/capture-build-lab.mjs` captures the selected design comparison and desktop/mobile states under `artifacts/build-lab/`; the approved visual target is retained in `design/approved-build-lab.png`. See [design-qa.md](design-qa.md) for the visual review.

## Hosting

The existing Vercel project serves `https://www.maddiee.dev`. Set `NEXT_PUBLIC_SITE_URL` only when using a different canonical production domain. Build with `npm run build`; no database, private API keys or runtime Notion connection is required. Review the local result before publishing the redesign.

## Production deployment

The GitHub repository is connected to Vercel. Pushing `main` triggers a Production deployment for `https://www.maddiee.dev` (`maddiee.dev` redirects there). Check the commit’s Vercel status before treating a push as live. Local reference frames in `sample-images/` and generated review captures in `artifacts/` are not published.

The root body uses `suppressHydrationWarning` for grammar-extension attributes added before hydration. Descendant hydration checks remain enabled. Verification injects the reported Grammarly attributes before hydration and checks the development console.
