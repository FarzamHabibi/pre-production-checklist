# JavaScript

Usually the largest single lever, and the one most likely to have grown without anyone deciding it should.

[← all checklists](../README.md)

---


## Know what you ship

* [ ] Run a bundle analysis and be able to name the five largest modules in the main bundle.
* [ ] Verify no dependency in the critical bundle is there for a feature most users never reach.
* [ ] Verify the dependency tree has no duplicated packages at different versions.
* [ ] Verify heavy general-purpose libraries are not pulled in whole for one function.
* [ ] Verify date, i18n and icon libraries are imported by path or tree-shaken, not wholesale.
* [ ] Verify `sideEffects` is declared correctly so tree shaking actually removes what it can.
* [ ] Verify the production build has minification, dead-code elimination and mangling enabled.
* [ ] Verify development-only code — dev tools, mock handlers, verbose logging — is stripped from the production bundle.

## Split and defer

* [ ] Verify JavaScript is split per route, so a landing page does not download the dashboard.
* [ ] Verify components below the fold or behind an interaction are dynamically imported.
* [ ] Verify heavy, rarely used features — a rich text editor, a chart library, a map, a video player — are loaded on demand.
* [ ] Verify code splitting has not created a waterfall where one chunk must load before the next is even requested.
* [ ] Verify the number of chunks is reasonable; hundreds of tiny requests has its own cost.
* [ ] Verify polyfills are served only to browsers that need them, not to every visitor.
* [ ] Verify the build targets the browsers you actually support, rather than transpiling to a decade-old baseline.

## The main thread

* [ ] Measure total blocking time and identify the specific scripts responsible.
* [ ] Verify no single script evaluation blocks the main thread for more than 50ms during load.
* [ ] Verify expensive computation — parsing, sorting, filtering, encryption, image processing — runs in a web worker.
* [ ] Verify long lists are virtualised rather than rendered in full.
* [ ] Verify large JSON payloads are not parsed on the main thread during load.
* [ ] Verify state updates do not cascade into re-rendering large subtrees on every keystroke or scroll event.
* [ ] Verify scroll and resize handlers are passive or throttled, and do not read layout on every frame.
* [ ] Verify `requestAnimationFrame` callbacks do no work that could be done once outside the frame loop.

## Hydration and rendering strategy

* [ ] Verify the rendering strategy per route is deliberate: static, server-rendered, client-rendered or streamed.
* [ ] Verify hydration is not re-rendering the entire page to attach a few event handlers.
* [ ] Verify selective, progressive or island hydration is used where the framework offers it.
* [ ] Verify server-rendered markup matches what the client renders; a hydration mismatch costs a full re-render and often a layout shift.
* [ ] Verify data needed for the first render is delivered with the HTML rather than fetched after it.
* [ ] Verify the client does not re-fetch data that the server already embedded.

## Third-party scripts

* [ ] Inventory every third-party script, who owns it, and what it costs in bytes and main-thread time.
* [ ] Verify each one still earns its place; analytics, heatmaps, chat widgets and A/B tools accumulate and are rarely removed.
* [ ] Verify third parties load with `async` or `defer`, and after the content, not before it.
* [ ] Verify a heavy embed — chat, video, map, social feed — uses a facade that loads the real widget only on interaction.
* [ ] Verify a tag manager cannot inject an unbudgeted script without anyone noticing.
* [ ] Verify a third-party outage degrades the page rather than blocking it.
* [ ] Verify third-party scripts are pinned or self-hosted where the vendor allows it, so their deploy is not your regression.
* [ ] Verify consent tooling does not itself become the largest blocking script on the page.

## Browser behaviour

* [ ] Verify `IntersectionObserver` is used instead of scroll handlers for visibility work.
* [ ] Verify event listeners on scroll and touch are registered as `passive` where they do not call `preventDefault`.
* [ ] Verify no `unload` handler exists; use `pagehide` and `visibilitychange` so the page stays eligible for the back/forward cache.
* [ ] Verify timers and observers are cleaned up on unmount, so a long session does not accumulate work every frame.
* [ ] Verify detached DOM nodes are not retained by closures or global caches.
* [ ] Verify `import()` calls for predictable next steps are prefetched rather than fetched at click time.
