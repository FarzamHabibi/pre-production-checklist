# Vercel

Items from the domain checklists that are specific to **Vercel**. If you do not use it, skip this file entirely — the domain checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify environment variables are scoped correctly across Production, Preview and Development; a production secret exposed to Preview is exposed to every pull request.
* [ ] Verify no secret is prefixed `NEXT_PUBLIC_` — that prefix ships the value to the browser.
* [ ] Verify Edge Middleware is not the only place an authorization decision is made; it is a routing layer and can be bypassed by anything that reaches the function directly.
* [ ] Verify serverless function regions are set close to the database rather than left at the default.
* [ ] Verify function timeouts and payload limits are understood, and that a slow dependency fails rather than hanging to the platform limit.

## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify Preview deployments are not publicly reachable, or that they cannot connect to production data — a preview URL is guessable and is indexed if linked.
* [ ] Verify Deployment Protection is enabled for previews if they touch anything real.
* [ ] Verify the `x-vercel-*` headers are not trusted as authentication, since a client can send them to a function reached directly.

## SEO Fundamentals
<sub>from [`integrations/02-seo-fundamentals.md`](../integrations/02-seo-fundamentals.md)</sub>

* [ ] Verify preview deployments send `noindex`, or the same content is indexed at several hostnames.
* [ ] Verify the production domain is canonical and that `.vercel.app` variants redirect to it rather than serving in parallel.

## Cost at Scale
<sub>from [`scale/07-cost-at-scale.md`](../scale/07-cost-at-scale.md)</sub>

* [ ] Verify function invocation and bandwidth are watched against the plan's limits; the overage on a viral launch is the surprise here.
* [ ] Verify Image Optimization is not being used to transform unbounded third-party URLs, which is both a cost and an SSRF question.
* [ ] Verify ISR revalidation intervals are chosen rather than left tight enough to rebuild constantly.
