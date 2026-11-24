# Abid Farhan | Portfolio

One-page portfolio built with Next.js, TypeScript, and Tailwind CSS.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000.

### Automatic updates during development

With `npm run dev`, Next.js Fast Refresh updates saved code and `src/data/portfolio.ts` changes automatically.

The page also checks the **local image and PDF files referenced by `portfolio.ts`** every 1.5 seconds while the tab is visible. Replacing a referenced file under the same name updates its URL and refreshes Server Components without a browser reload. Image optimization is bypassed only in development, so old optimized thumbnails cannot mask a replacement. The current portrait path is `/images/portrait-5fca94e5add3.webp`; replace that file, or set `portrait` to another file you want to edit.

Replacing a PDF updates the résumé links; it does not edit your portfolio text or reload an already-open browser PDF tab. Update `portfolio.ts` for text changes.

Polling pauses in hidden tabs and is disabled in production. `/api/dev-assets` returns 404 in production, where normal image optimization and static page generation are preserved. No extra dependency or deployment configuration is required.

Use Node.js 22.18+ (or Node.js 24+) so the content tests can import TypeScript directly.

```sh
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run test:dev
npm run build
npm start
```

## Update content

Edit `src/data/portfolio.ts`. All project content, experience, skills, and contact URLs live here.

- Put a portrait and original screenshots in `public/images/`, then set their paths (for example `/images/portrait.webp`).
- The current CV is served from `public/abid-farhan-cv.pdf`; `contact.resume` points to this file. To replace it, copy the updated PDF and update the data path if needed.
- Set `contact.email` to an email address, without `mailto:`.
- Add verified GitHub and LinkedIn URLs. Empty links are intentionally hidden.
- Set `siteUrl` to the real HTTPS origin (no path, query, or fragment). Canonical and public Open Graph URLs are enabled only when it is set. Without it, Next.js uses its local/deployment fallback for the social-image URL; do not publish until the real origin is configured.
- Roles, employment periods, project dates, GPA, publication, certifications, and contribution metrics follow the supplied `Abid_Farhan_Abdullah_CV_FullStack_Updated_v2.pdf`. Keep them aligned when updating the CV.
- Preview illustrations are explicitly marked **concept previews**, not original product screenshots.
- Quantitative contribution claims are taken from the CV, not independently audited. The Alibaba Cloud certification is explicitly marked expired in January 2026.

The project uses Google fonts through `next/font`, downloaded at build time and self-hosted at runtime. An internet connection is required on the first build.

Project details use native disclosure elements and remain usable without JavaScript. On supporting browsers, image links open the linked disclosure via a small progressive enhancement; the “Explore project” summary always works independently.

## UI and accessibility tests

Install the test browser once:

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright builds the production app, starts an isolated server at `127.0.0.1:3100`, and shuts it down after testing. It deliberately does not reuse a server, so it cannot accidentally test another app or a stale build.

The suite checks 390, 768, and 1440 px viewports, horizontal overflow, label sizes, touch targets, skip-link focus, keyboard disclosures, navigation, deep links, malformed fragments, reduced motion, runtime errors, social metadata, and native disclosure usage without JavaScript. It also runs axe WCAG A/AA checks with every project expanded. Automated checks do not replace manual assistive-technology testing.

Screenshots, failure traces, and the HTML report are written to ignored `test-results/` and `playwright-report/` directories.

```sh
npx playwright show-report
```

No production dependencies are added for browser or accessibility testing.

`npm run test:dev` launches a separate dev server on port 3101 with an isolated copy under ignored `test-results/`. It tests same-name image/PDF replacements and native Fast Refresh without changing your real assets. The copied app and server are removed after the test.
