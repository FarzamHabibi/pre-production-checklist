# Structured Data & Social Previews

Telling machines what the page *is*, rather than making them infer it. This is also what decides how your link looks when someone pastes it into Slack.

[← all checklists](../README.md)

---


## Choosing and writing it

* [ ] Verify the schema types chosen actually describe the page — `Organization`, `Product`, `Article`, `SoftwareApplication`, `LocalBusiness` — rather than whatever the plugin defaulted to.
* [ ] Verify JSON-LD is used rather than microdata or RDFa; it is what Google recommends and it is far easier to keep correct.
* [ ] Verify structured data is server-rendered or otherwise present for a crawler that does not execute your JavaScript.
* [ ] Verify the markup describes content that is actually visible on the page; marking up something a user cannot see is a policy violation, not a shortcut.
* [ ] Verify required properties for each type are present, not just the recommended ones.

## The markup worth having

* [ ] Verify the homepage carries `Organization` with a logo, a URL, and `sameAs` links to your real social profiles.
* [ ] Verify `WebSite` markup exists if you want a sitelinks search box.
* [ ] Verify `BreadcrumbList` matches the visible breadcrumb and the URL hierarchy.
* [ ] Verify articles and posts carry `Article` or `BlogPosting` with `author`, `datePublished` and `dateModified`.
* [ ] Verify `dateModified` changes only when the content actually changed.
* [ ] Verify product or pricing pages carry `Product` and `Offer` with a real price and currency, and that they stay in sync with the page.
* [ ] Verify ratings and reviews are marked up only if they are genuine and visible; fabricated `AggregateRating` is a manual-action risk.
* [ ] Verify `FAQPage` and `HowTo` are used only where they apply, and with the awareness that their rich results have been heavily restricted.
* [ ] Verify `LocalBusiness` name, address and phone match exactly what appears elsewhere on the web.
* [ ] Verify `@id` values are stable URLs so entities can be linked rather than duplicated across pages.

## Social previews

* [ ] Verify `og:title`, `og:description`, `og:image`, `og:url` and `og:type` are present on every shareable page.
* [ ] Verify `og:url` is the canonical absolute URL.
* [ ] Verify `og:image` is an absolute URL, at least 1200×630, and under the platform size limits.
* [ ] Verify the preview image is not generated per request in a way that times out the scraper.
* [ ] Verify `twitter:card` is set, with `summary_large_image` where the image is the point.
* [ ] Verify the preview actually renders: paste the URL into Slack, iMessage and X, and look.
* [ ] Verify Open Graph tags are in the initial HTML — scrapers do not run JavaScript.
* [ ] Verify a default preview image exists for pages that do not define their own.

## Validation and upkeep

* [ ] Validate with the Rich Results Test and the Schema Markup Validator, and fix warnings as well as errors.
* [ ] Verify the Search Console enhancement reports are clean, and that new errors are noticed.
* [ ] Verify structured data is generated from the same source as the page content, so the two cannot drift.
* [ ] Verify a change to the page template cannot silently drop the markup — add it to whatever check runs at build time.
