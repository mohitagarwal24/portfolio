# Ascent — Mohit Agarwal

A portfolio built with Next.js 16.4, React, TypeScript, MDX and a shared Three.js scene. Home follows a scroll-driven flight; Work, project reports and About each park the camera at a different stop.

## Run locally

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm run build
npm start
```

Read the installed Next.js guides in `node_modules/next/dist/docs/` before changing framework code. Routes are statically generated; Cache Components is disabled so unknown project slugs can return a real HTTP 404 through `dynamicParams = false`. The optional RSS feed uses hourly fetch revalidation.

## Edit content

| Content | File |
| --- | --- |
| Name, email, social links, domain, photo, resume, blog feed | `site.config.ts` |
| Bio, status, home introduction, stats | `content/profile.ts` |
| Education and experience | `content/experience.ts` |
| Skills and awards | `content/skills.ts` |
| Project stories and metadata | `content/work/*.mdx` |
| Project registry | `content/work/index.ts` |

To add a project:

1. Copy an existing MDX file to `content/work/<slug>.mdx` and edit its `meta` export and story.
2. Import it in `content/work/index.ts` and add it to `entries` under the same slug.
3. Add screenshots to `public/work/<slug>/`. Set `cover: { image: "/work/<slug>/cover.webp" }`, or choose a generated illustration with `cover: { art: "attention" }`.
4. Run the checks below. Push the MDX, registry entry and images together.

The Zod schema in `lib/work.ts` validates metadata during builds. Required fields are `code`, `name`, `summary` (up to 220 characters), `when`, `year`, `crew`, `status`, `domain`, `stack`, `order` and `cover`. Invalid metadata names the file and field in the build error. `links` accepts `repo`, `live`, `video` and `docs`. Only link public destinations you intend visitors to use.

`home: true` selects the four home-page projects; `featured: true` selects large Work cards. Other projects appear in the archive. Smaller `order` values come first. Domains are AI, Quant, Web3, Systems and Web. Available illustration names are listed in `lib/work.ts`. Illustrations are decorative, not measured project results.

## Screenshots and portrait

The home crew viewport and About badge share the supplied orbital portrait at `public/about/portrait-orbital.jpg`. The resume button and command palette use the supplied Google Drive link in `site.config.ts`.

```sh
npx playwright install chromium
npm run capture -- gitcraft citadel
```

Omit the slugs to capture every destination in `scripts/capture.mjs`. Review screenshots before committing them; demos can change or require sign-in. Existing assets are not replaced when a destination returns an error.

For the crew badge, put your own headshot at `public/about/portrait-source.jpg` and run:

```sh
npm run portrait
# Or use a source outside the repository:
npm run portrait -- /path/to/headshot.jpg
```

The script crops to 4:5, applies navy/orange duotone and subtle grain, and writes `public/about/portrait.webp`. It preserves the original. Set `portrait: "/about/portrait.webp"` in `site.config.ts`. The optional processing source is ignored by Git. Clearing `portrait` in `site.config.ts` shows a silhouette. Update `resumeUrl` to change the resume destination.

## Writing

The default `blog: { kind: "none" }` hides Logs and makes `/logs` return 404. To publish a Medium or Substack feed, set `blog` to `{ kind: "rss", feedUrl: "https://…" }`. The navigation and sitemap show Logs only when valid posts are available. Posts link to their original publication; the feed is cached for an hour. Unavailable or empty feeds leave Logs hidden.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
# With npm start running in another terminal:
npm run verify
npm run verify:palette
```

The browser checks cover routes, metadata, project images, filters, keyboard navigation, galleries, mobile overflow, reduced motion, no-JavaScript content and accessibility. Screenshots and a report go to `artifacts/verification/` (ignored by Git). Override the origin using `SITE_TEST_URL`.

For a desktop Lighthouse audit against a production server:

```sh
npm run audit
```

Browsers without hardware-accelerated WebGL use a static space backdrop. Hardware-accelerated browsers retain the shared animated scene; reduced-motion mode renders only when the camera target changes. Headless audits exercise the static fallback, so test the animated scene on a real GPU as well. See `VERIFICATION.md` for the latest measured results and remaining owner-supplied assets.

## Deploy and update

The site is prepared for Vercel; it has not been deployed as part of this handoff.

1. Push this repository to your GitHub account.
2. Import the repository into Vercel and keep the detected Next.js settings (`npm run build`, framework-managed output).
3. Set `NEXT_PUBLIC_SITE_URL` to the complete public origin, for example `https://your-domain.com`. This controls canonical URLs, the sitemap and social previews. Without it, local development uses `http://localhost:3000`.
4. Deploy. Add a custom domain under the project's Domains settings and apply the DNS records Vercel provides at your registrar.
5. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy. Check the generated `/sitemap.xml`, `/robots.txt` and link previews.

After connecting GitHub, pushes to the production branch deploy automatically; other branches receive preview deployments. Update the content files and commit assets to keep the portfolio current. No database or authentication service is needed.
