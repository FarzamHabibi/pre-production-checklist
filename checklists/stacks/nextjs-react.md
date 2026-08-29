# Next.js / React

Items from the core checklists that are specific to **Next.js / React**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Web Frontend
<sub>from [`security/core/05-web-frontend.md`](../security/core/05-web-frontend.md)</sub>

* [ ] Inventory App Router and Pages Router usage.
* [ ] Inventory Server Components.
* [ ] Inventory Client Components.
* [ ] Inventory Server Actions.
* [ ] Inventory middleware/proxy transitions from older Next.js versions.
* [ ] Verify authentication decisions are not performed only in client components.
* [ ] Verify sensitive data is not passed to Client Components unnecessarily.
* [ ] Verify `nextUrl` values are not trusted blindly.
* [ ] Inventory all Server Actions.
* [ ] Treat every Server Action as remotely invokable.
* [ ] Search for `dangerouslySetInnerHTML`.
* [ ] Verify Server Components do not unintentionally serialize sensitive data.
* [ ] Verify major Next.js/React security advisories.
* [ ] Verify Next.js upgrades are tested against framework security changes.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Next.js source/build audit complete.

## AI-Generated Application Bugs
<sub>from [`security/ai-generated-code/03-backend-frontend-api.md`](../security/ai-generated-code/03-backend-frontend-api.md)</sub>

* [ ] Review all AI-generated Server Actions.
* [ ] Verify Server Actions perform authentication.
* [ ] Verify Server Actions perform authorization.
* [ ] Verify security checks are not moved exclusively into Client Components.
* [ ] Verify generated code does not serialize private data to Client Components.
* [ ] Verify generated use of `dangerouslySetInnerHTML`.

## Review Blind Spots
<sub>from [`security/ai-generated-code/07-review-blind-spots.md`](../security/ai-generated-code/07-review-blind-spots.md)</sub>

* [ ] Verify old Next.js patterns are not copied into Next.js 16+.

## Agent Prompts & PR Review
<sub>from [`security/ai-generated-code/08-prompts-and-pr-review.md`](../security/ai-generated-code/08-prompts-and-pr-review.md)</sub>

* [ ] Server Action.

## JavaScript
<sub>from [`performance/04-javascript.md`](../performance/04-javascript.md)</sub>

* [ ] Verify `next/dynamic` is used for components that are below the fold or behind an interaction.
* [ ] Verify Server Components are used where the component does not need interactivity, so its code never reaches the client.
* [ ] Verify `use client` is placed at the leaf that needs it, not near the root — every component below it ships to the browser.
* [ ] Verify `next/script` strategy is set per script (`afterInteractive`, `lazyOnload`, `worker`) rather than left to default.
* [ ] Verify the App Router's client bundle is not carrying data-fetching libraries that only the server uses.
* [ ] Verify React `key` stability and memoisation are not causing whole lists to re-render on every state change.

## Images & Media
<sub>from [`performance/05-images-and-media.md`](../performance/05-images-and-media.md)</sub>

* [ ] Verify `next/image` is used rather than a bare `<img>`, so sizing, formats and lazy loading are handled.
* [ ] Verify the hero image sets `priority`, which applies `fetchpriority="high"` and disables lazy loading.
* [ ] Verify `sizes` is set on any `fill` image; without it Next serves the largest candidate to everyone.
* [ ] Verify the image optimiser is not being bypassed with `unoptimized` for convenience.

## Backend & Delivery
<sub>from [`performance/07-backend-and-delivery.md`](../performance/07-backend-and-delivery.md)</sub>

* [ ] Verify the caching and revalidation strategy per route is deliberate — static, ISR with a revalidate window, or dynamic.
* [ ] Verify `fetch` calls declare their cache behaviour explicitly rather than relying on a framework default that changes between versions.
* [ ] Verify a single dynamic segment has not opted the whole route tree out of static rendering.
* [ ] Verify streaming and Suspense boundaries are placed so the shell renders before slow data arrives.

## SEO Fundamentals
<sub>from [`integrations/02-seo-fundamentals.md`](../integrations/02-seo-fundamentals.md)</sub>

* [ ] Verify the Metadata API (`metadata` or `generateMetadata`) sets title, description and canonical, rather than a client-side `<Head>` that crawlers may not see.
* [ ] Verify `metadataBase` is set, or relative Open Graph and canonical URLs resolve against the wrong host.
* [ ] Verify a route that opts out of static rendering has not lost its metadata along with it.
* [ ] Verify `app/robots.ts` and `app/sitemap.ts` generate from real routes rather than being static files that drift.

## Structured Data & Social Previews
<sub>from [`integrations/03-structured-data.md`](../integrations/03-structured-data.md)</sub>

* [ ] Verify JSON-LD is rendered in a Server Component; a client-side injection is invisible to most scrapers.
* [ ] Verify dynamic Open Graph images (`opengraph-image`) render within the scraper's timeout and are cached.

