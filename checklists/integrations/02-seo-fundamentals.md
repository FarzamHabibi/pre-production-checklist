# SEO Fundamentals

The markup and structure that decide how a page is understood. None of it is clever; all of it is routinely wrong on a first launch.

[← all checklists](../README.md)

---


## Titles and descriptions

* [ ] Verify every page has a title, and that no two important pages share one.
* [ ] Verify titles lead with what the page is about and end with the brand, not the reverse.
* [ ] Verify titles are not truncated into meaninglessness in results — roughly 60 characters is the practical limit.
* [ ] Verify no title is a template default like "Home", "Untitled" or the framework's placeholder.
* [ ] Verify every page has a meta description written for a human deciding whether to click.
* [ ] Verify descriptions are not duplicated across pages or auto-generated from the first sentence of the body.
* [ ] Verify titles and descriptions are in the server-rendered HTML, not set by client-side JavaScript.
* [ ] Verify templated titles for large page sets still read as sentences rather than as slot-filling.

## Structure

* [ ] Verify each page has exactly one `h1` that matches what the page is about.
* [ ] Verify heading levels descend without skipping — this is the same item as the accessibility one, and both audiences benefit.
* [ ] Verify the primary content is in `main`, and that navigation, header and footer are marked as such.
* [ ] Verify URLs are readable, lowercase, hyphenated, and stable enough that you will not need to change them.
* [ ] Verify URLs do not carry session ids, tracking parameters or sort order as part of their canonical form.
* [ ] Verify breadcrumbs exist on deep pages and match the URL hierarchy.

## Canonical and duplication

* [ ] Verify every page has a self-referencing canonical tag with an absolute URL.
* [ ] Verify the canonical points to the version you actually want indexed, and that it returns 200.
* [ ] Verify no page canonicalises to a `noindex` page, which asks the crawler to do two contradictory things.
* [ ] Verify paginated pages self-canonicalise; canonicalising page 2 to page 1 hides everything after the first page.
* [ ] Verify parameter variants — sort, filter, tracking — canonicalise to the clean URL.
* [ ] Verify the same content is not reachable at both trailing-slash and non-trailing-slash URLs.
* [ ] Verify uppercase and lowercase paths do not both resolve.
* [ ] Verify print, AMP or alternate views canonicalise correctly.

## International

* [ ] Verify `hreflang` annotations are reciprocal — every version points to every other, including itself.
* [ ] Verify an `x-default` exists for visitors who match no listed locale.
* [ ] Verify language and region codes are valid and describe the content, not the customer you wish you had.
* [ ] Verify `hreflang` and canonical do not contradict each other.
* [ ] Verify localised pages are actually localised; the same English page on five country URLs is duplication, not internationalisation.

## Links and status codes

* [ ] Verify every important page is reachable from the homepage within three clicks.
* [ ] Verify there are no orphan pages — in the sitemap but linked from nowhere.
* [ ] Verify internal anchor text describes the destination rather than saying "click here".
* [ ] Verify a missing page returns a real 404 status, not a 200 with an error message — a soft 404 keeps the URL indexed forever.
* [ ] Verify the 404 page helps: search, main navigation, and a link home.
* [ ] Verify permanent moves use 301, not 302; a 302 tells the crawler to keep the old URL.
* [ ] Verify no redirect chains or loops, and that no chain is longer than one hop.
* [ ] Verify outbound links to untrusted or user-generated destinations carry the appropriate `rel`.
* [ ] Verify broken internal links are found by a crawl before a user finds them.

## Content and parity

* [ ] Verify the mobile page contains the same content as desktop; indexing is mobile-first, so anything hidden on mobile effectively does not exist.
* [ ] Verify content is not gated behind a cookie banner or a modal that the crawler sees instead of the page.
* [ ] Verify thin or near-duplicate pages generated from a template are either consolidated or given a reason to exist.
* [ ] Verify images have descriptive `alt` text, which serves search and accessibility at once.
* [ ] Verify the site is served over HTTPS everywhere, with no mixed content.
* [ ] Verify page speed has been dealt with in [`performance/`](../performance/02-core-web-vitals.md) rather than treated as an SEO afterthought.
