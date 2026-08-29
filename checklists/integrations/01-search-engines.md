# Search Engines

Being findable, and being able to see whether you are.

Most of this is configuration you do once and then never think about — which is exactly why it is worth a checklist. The single most expensive item here is the last one in the launch section, and it has taken down more launches than any exploit in this repository.

[← all checklists](../README.md)

---


## Before you launch — the ones that actually bite

* [ ] Verify `noindex` is **removed from production**. A staging `<meta name="robots" content="noindex">` or `X-Robots-Tag` that shipped is the most common launch mistake there is, and it can cost weeks before anyone notices.
* [ ] Verify `robots.txt` in production is not the staging one that disallows everything.
* [ ] Verify staging and preview environments are blocked from indexing **and** password protected — `robots.txt` is a request, not access control, and a disallowed URL can still be indexed if something links to it.
* [ ] Verify the canonical host is decided and enforced: one of www or apex, one of http or https, one trailing-slash convention.
* [ ] Verify every URL that changed at launch has a 301 to its replacement, and that the map was built from the old site's real URL list rather than from memory.
* [ ] Verify the new site does not 301 everything to the homepage; that reads as a soft 404 and loses the ranking outright.

## Search Console and Webmaster Tools

* [ ] Verify a Google Search Console **domain property** is set up, not only a URL-prefix property — a domain property covers every subdomain and protocol at once.
* [ ] Verify Bing Webmaster Tools is set up; it can import the Search Console configuration in a couple of clicks, and it feeds more than Bing.
* [ ] Verify Yandex or Naver or Baidu are set up if you actually serve those markets, and not if you do not.
* [ ] Verify ownership is held by an account that survives a person leaving — a shared or role account, not someone's personal login.
* [ ] Verify at least two people have access.
* [ ] Verify email alerts are enabled and go somewhere a human reads.
* [ ] Verify the verification method will not break: a DNS TXT record survives a redeploy, an uploaded HTML file may not.
* [ ] Verify Search Console data is exported or archived; it only keeps 16 months.

## Sitemaps

* [ ] Verify a sitemap exists, is generated from the live routes rather than hand-maintained, and updates when content does.
* [ ] Verify the sitemap is submitted in Search Console and Bing, and referenced from `robots.txt`.
* [ ] Verify the sitemap contains only canonical, indexable, 200-status URLs — no redirects, no `noindex`, no parameters.
* [ ] Verify `lastmod` reflects a real change, not the build timestamp on every entry; a sitemap that claims everything changed today is ignored.
* [ ] Verify a sitemap index is used if you exceed 50,000 URLs or 50MB uncompressed.
* [ ] Verify image and video sitemaps exist if those are a meaningful part of what you offer.
* [ ] Verify the sitemap URL count roughly matches the number of pages you expect to be indexed; a large gap either way is a signal.

## Crawlability

* [ ] Verify `robots.txt` does not block CSS, JavaScript or images — a crawler that cannot render the page cannot judge it.
* [ ] Verify `robots.txt` and meta robots do not contradict each other; a page blocked in `robots.txt` can never be seen as `noindex`, so it stays indexed without a snippet.
* [ ] Verify `X-Robots-Tag` headers are checked as well as meta tags — a header set at the CDN is easy to forget.
* [ ] Verify the URL Inspection tool shows the rendered HTML you expect on your key templates, including content that JavaScript adds.
* [ ] Verify content that only appears after interaction — tabs, accordions, infinite scroll — is present in the HTML or reachable by a crawlable link.
* [ ] Verify pagination is crawlable by real links, not only by a button that calls an API.
* [ ] Verify faceted navigation cannot generate an unbounded crawl space of parameter combinations.
* [ ] Verify crawl stats show the crawler reaching the pages you care about, and not spending its budget on parameters and redirects.

## Fast indexing

* [ ] Verify IndexNow is wired up if you publish frequently; it pushes changes to Bing, Yandex and others immediately.
* [ ] Verify the Google Indexing API is not being misused — it is only for job postings and livestream markup, and other uses are ignored.
* [ ] Verify new content is discoverable by an internal link from an already-indexed page, which is still the most reliable path.

## Watching it

* [ ] Read the index coverage report rather than assuming; the difference between submitted and indexed is the whole story.
* [ ] Verify pages excluded as duplicate, crawled-not-indexed or discovered-not-indexed have been looked at at least once.
* [ ] Verify no manual action or security issue is open.
* [ ] Verify the Core Web Vitals report is green, or that its failures match what `performance/` already told you.
* [ ] Verify 404s reported by the crawler are either fixed, redirected, or deliberately left to die.
* [ ] Verify someone checks this on a cadence rather than only when traffic drops.
