# Loading & the Critical Path

What the browser has to do between the first byte and something useful on screen — and everything you can take out of that path.

[← all checklists](../README.md)

---


## Render-blocking resources

* [ ] Inventory every render-blocking stylesheet and script on the critical path, and justify each one.
* [ ] Verify every `<script>` in `<head>` is `defer`, `async`, or genuinely required to be synchronous.
* [ ] Verify stylesheets not needed for the initial view are loaded without blocking, via `media` or a print-onload pattern.
* [ ] Verify critical CSS is inlined and the remainder deferred, and that the inlined block is actually the critical part rather than the whole sheet.
* [ ] Verify `@import` is not used in CSS; it serialises requests that could have been parallel.
* [ ] Verify the HTML response starts flushing before the server has finished all its work, where the framework supports streaming.

## Resource hints, used sparingly

* [ ] Verify `preconnect` is used for the origins that serve critical resources, and limited to a handful — each one costs a connection.
* [ ] Verify `dns-prefetch` is used for origins that are needed but not critical.
* [ ] Verify `preload` is reserved for resources the parser would otherwise discover late; preloading everything demotes everything.
* [ ] Verify every `preload` is actually used within a few seconds — an unused preload is a wasted download and a console warning.
* [ ] Verify `preload` `as` and `type` attributes are correct, or the resource is fetched twice.
* [ ] Verify `modulepreload` is used for the critical module graph rather than plain `preload`.
* [ ] Verify `fetchpriority` is set deliberately on the few resources where it matters, and not sprinkled.
* [ ] Consider `103 Early Hints` for the resources you already know the page needs.

## Fonts

* [ ] Inventory every font family, weight and style actually used, and remove the ones that are not.
* [ ] Verify fonts are self-hosted or served from the same origin as the page where possible, removing a connection from the critical path.
* [ ] Verify `font-display` is set — `swap` for body text, `optional` where a swap would be more jarring than the fallback.
* [ ] Verify the font used by above-the-fold text is preloaded.
* [ ] Verify fonts are subset to the characters and scripts you actually serve.
* [ ] Verify variable fonts are used where several weights are needed, rather than several files.
* [ ] Verify the fallback stack is metrically similar to the web font, so the swap does not reflow.
* [ ] Verify icon fonts are not blocking render; inline SVG is usually both smaller and safer.

## Navigation and entry

* [ ] Verify the entry URL does not redirect; each hop on the critical path costs a full round trip.
* [ ] Verify HTTP-to-HTTPS and apex-to-www redirects happen at the edge, not at the origin.
* [ ] Verify HSTS is set so browsers skip the upgrade redirect entirely.
* [ ] Verify the initial HTML is not so large that parsing dominates; move data that is not needed for first render out of the document.
* [ ] Verify server-rendered data embedded in the HTML is not duplicated by a client fetch of the same data.
* [ ] Consider speculation rules or prefetch for the next navigation users predictably make.
* [ ] Verify prefetching is not so aggressive that it competes with the current page for bandwidth.

## Repeat visits and prefetching

* [ ] Verify a service worker, if present, does not delay the first response while it installs or claims clients.
* [ ] Verify the service worker's caching strategy is deliberate per resource type, and that a stale HTML shell cannot pin users to an old release.
* [ ] Verify `<iframe loading="lazy">` is used for embeds below the fold.
* [ ] Verify prefetch on hover or on viewport entry is used for the next likely navigation, and cancelled when the intent goes away.
* [ ] Verify the back/forward cache is not disabled by an `unload` handler, a `Cache-Control: no-store` header, or an open connection.
* [ ] Verify `document.write` appears nowhere; it blocks the parser and disables the preload scanner.
* [ ] Verify the module/nomodule split, if used, does not serve both bundles to the same browser.
* [ ] Verify the HTML document itself is not de-prioritised behind a service worker or a redirect chain on repeat visits.
