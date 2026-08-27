# Next.js / React

Items from the core checklists that are specific to **Next.js / React**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Web Frontend
<sub>from [`core/05-web-frontend.md`](../core/05-web-frontend.md)</sub>

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
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Next.js source/build audit complete.

## AI-Generated Application Bugs
<sub>from [`vibe-coding/03-backend-frontend-api.md`](../vibe-coding/03-backend-frontend-api.md)</sub>

* [ ] Review all AI-generated Server Actions.
* [ ] Verify Server Actions perform authentication.
* [ ] Verify Server Actions perform authorization.
* [ ] Verify security checks are not moved exclusively into Client Components.
* [ ] Verify generated code does not serialize private data to Client Components.
* [ ] Verify generated use of `dangerouslySetInnerHTML`.

## Review Blind Spots
<sub>from [`vibe-coding/07-review-blind-spots.md`](../vibe-coding/07-review-blind-spots.md)</sub>

* [ ] Verify old Next.js patterns are not copied into Next.js 16+.

## Agent Prompts & PR Review
<sub>from [`vibe-coding/08-prompts-and-pr-review.md`](../vibe-coding/08-prompts-and-pr-review.md)</sub>

* [ ] Server Action.
