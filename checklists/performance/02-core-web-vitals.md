# Core Web Vitals

LCP, INP and CLS, one at a time, with the causes that actually move each of them.

Each metric has a small number of real culprits. Work the list for the metric you are failing rather than applying generic advice to all three.

[← all checklists](../README.md)

---


## Largest Contentful Paint — identify it first

* [ ] Identify the LCP element on every important template; optimising the wrong element is the most common wasted effort here.
* [ ] Verify the LCP element is present in the initial HTML response, not inserted later by JavaScript.
* [ ] Verify the LCP resource is discoverable by the browser's preload scanner — a CSS `background-image` or a JS-injected `src` is not.
* [ ] Verify the LCP image is **not** lazy loaded; `loading="lazy"` on the hero image is a guaranteed LCP regression.
* [ ] Verify the LCP image carries `fetchpriority="high"`.
* [ ] Verify the LCP image is preloaded when it is discovered late, and that the preload matches the `srcset` candidate actually chosen.

## Largest Contentful Paint — the four parts

* [ ] Break LCP into its four parts — time to first byte, resource load delay, resource load duration, element render delay — and attack the largest.
* [ ] Verify TTFB is not the dominant part; if it is, the fix is in `07-backend-and-delivery.md`, not in the front end.
* [ ] Verify no render-blocking stylesheet or synchronous script sits between the HTML and the LCP element.
* [ ] Verify web fonts do not delay LCP text: `font-display: swap` or `optional`, and preload the face used above the fold.
* [ ] Verify a hero carousel or slider does not make LCP depend on JavaScript initialising.
* [ ] Verify client-side data fetching does not gate the hero content; render the shell with content, not a spinner.
* [ ] Verify a cookie banner or consent gate does not delay or replace the LCP element.
* [ ] Verify the LCP image is served at the size it is displayed, not scaled down from something far larger.

## Interaction to Next Paint

* [ ] Identify the interactions with the worst INP — usually a filter, a menu, a search box, or the first click after load.
* [ ] Verify no task on the main thread runs longer than 50ms during load; long tasks are what makes an early click feel broken.
* [ ] Break INP into input delay, processing time and presentation delay, and confirm which one you are actually fixing.
* [ ] Verify event handlers yield back to the main thread for anything expensive, rather than blocking until finished.
* [ ] Verify visual feedback is rendered before the expensive work runs, so the interface acknowledges the click immediately.
* [ ] Verify handlers do not force synchronous layout by reading geometry after writing to the DOM.
* [ ] Verify a single keystroke does not trigger a full re-render of a large list; debounce input and virtualise long lists.
* [ ] Verify third-party scripts are not occupying the main thread when users typically first interact.
* [ ] Verify hydration is not still running when the page looks ready — an interactive-looking page that ignores clicks is an INP failure.
* [ ] Verify animations during interaction run on the compositor, not on layout-triggering properties.
* [ ] Verify INP is measured on the interactions users actually perform, not only the first one.

## Cumulative Layout Shift

* [ ] Verify every `<img>` and `<video>` has explicit `width` and `height`, or a CSS `aspect-ratio`.
* [ ] Verify space is reserved for ads, embeds and iframes before they load, at their final size.
* [ ] Verify late-injected banners — cookie notices, promo bars, app-install prompts — do not push content down; overlay them instead.
* [ ] Verify font swapping does not reflow text: match fallback metrics with `size-adjust`, `ascent-override` and friends.
* [ ] Verify dynamically inserted content appears below the current viewport or in reserved space.
* [ ] Verify animations use `transform` and `opacity` rather than `top`, `left`, `width` or `height`.
* [ ] Verify skeleton placeholders occupy exactly the size of the content that replaces them.
* [ ] Verify layout shift is measured after load too — CLS accumulates over the whole page lifetime, including scrolling and interaction.
* [ ] Verify the page is eligible for the back/forward cache; an ineligible page reloads and re-shifts on every back navigation.

## The supporting metrics

* [ ] Verify Time to First Byte is measured separately from LCP so a server problem is not mistaken for a front-end one.
* [ ] Verify First Contentful Paint is close behind TTFB; a large gap means render-blocking resources.
* [ ] Verify Total Blocking Time in the lab correlates with the INP you see in the field; a large divergence means you are testing the wrong interaction.
* [ ] Verify the DOM node count is not so large that style and layout recalculation dominate every interaction.

## Measuring them honestly

* [ ] Verify CLS is checked after interaction and scrolling, not only on load — most real shifts happen later.
* [ ] Verify INP is measured on a mid-range Android device, where it is usually two to three times worse than on a laptop.
* [ ] Verify soft navigations in a single-page app are measured; a client-side route change that takes four seconds records nothing by default.
