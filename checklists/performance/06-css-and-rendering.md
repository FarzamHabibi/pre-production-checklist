# CSS & Rendering

Smaller wins than JavaScript in bytes, larger than expected in interaction smoothness.

[← all checklists](../README.md)

---


## Size and structure

* [ ] Measure unused CSS on the pages that matter, and confirm the number is understood rather than merely observed.
* [ ] Verify a global stylesheet is not shipping every page's styles to every page.
* [ ] Verify CSS is minified and compressed in production.
* [ ] Verify unused framework utilities or components are purged from the build.
* [ ] Verify the number of stylesheet requests on the critical path is small.
* [ ] Verify CSS-in-JS, if used, extracts to static CSS at build time rather than generating styles at runtime.

## Rendering cost

* [ ] Verify no code reads layout properties and writes styles in the same loop, forcing repeated synchronous layout.
* [ ] Verify animations are limited to `transform` and `opacity`, which the compositor can handle without layout or paint.
* [ ] Verify `will-change` is applied to a small number of elements and removed when the animation ends.
* [ ] Verify large offscreen sections use `content-visibility: auto` with `contain-intrinsic-size` so they are not laid out until needed.
* [ ] Verify `contain` is used where a subtree's layout genuinely cannot affect the rest of the page.
* [ ] Verify the DOM is not unnecessarily deep or large; both style recalculation and layout scale with it.
* [ ] Verify expensive visual effects — large blurs, shadows on many elements, filters on scrolling containers — are measured rather than assumed cheap.
* [ ] Verify `position: fixed` and `sticky` elements are not causing repaints on every scroll frame.

## Correctness that affects speed

* [ ] Verify theme switching does not render the page twice or flash the wrong theme.
* [ ] Verify above-the-fold layout does not depend on a JavaScript measurement pass.
* [ ] Verify media queries match the breakpoints the layout actually uses, so no device downloads styles it will not apply.
* [ ] Verify `prefers-reduced-motion` is honoured, which also removes work for those users.

## Modern rendering controls

* [ ] Verify `contain-intrinsic-size` accompanies `content-visibility: auto`, or scrollbar length jumps as sections render.
* [ ] Verify view transitions, if used, do not block the next paint on a long-running script.
* [ ] Verify scroll-linked animations use `animation-timeline` or `IntersectionObserver` rather than a scroll handler that runs on every frame.
* [ ] Verify CSS custom properties are not being written on high-frequency events; each write invalidates everything that depends on them.
* [ ] Verify universal and deeply descendant selectors are not applied to large subtrees.
* [ ] Verify print styles exist and do not pull in the full stylesheet at render time.
* [ ] Verify an SVG sprite sheet is not shipping hundreds of icons to a page that uses three.
* [ ] Verify duplicated declarations across component stylesheets are not multiplying the transferred CSS.
* [ ] Verify the critical CSS is regenerated when the layout changes, rather than going stale and describing an old page.
* [ ] Verify a CSS framework's reset or preflight is included once, not per component bundle.
