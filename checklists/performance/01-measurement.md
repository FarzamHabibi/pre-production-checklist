# Measurement

Do this first. Every other file here assumes you can tell whether a change helped, and on a real user's phone rather than your laptop.

Lighthouse is a lab tool: one run, one simulated device, one network. It is excellent for *finding* problems and unreliable for *proving* them fixed. Field data — what your actual users experienced — is the scoreboard that matters.

[← all checklists](../README.md)

---


## Lab data

* [ ] Run Lighthouse from a clean profile with extensions disabled; a single extension can cost tens of points.
* [ ] Run it at least three times and take the median — single-run scores vary by 5 points or more on identical builds.
* [ ] Verify the throttling setting is deliberate: simulated, applied, or none, and the same one every time you compare.
* [ ] Test the mobile configuration, not only desktop; most scoring problems are mobile-only.
* [ ] Test against a production or production-like build, never a development server with hot reload attached.
* [ ] Test the pages that carry traffic, not only the homepage — a landing page, a listing page, a detail page, and a logged-in page.
* [ ] Test both cold and warm cache; the second visit is a different product.
* [ ] Test the logged-in experience separately if it renders differently — Lighthouse defaults to logged-out.

## Field data

* [ ] Verify a real-user monitoring script reports Core Web Vitals from actual sessions, not only synthetic runs.
* [ ] Verify the origin appears in the Chrome UX Report, and check whether its data is origin-level or per-URL.
* [ ] Hold yourself to the **75th percentile**, which is what Google scores — an average hides the quarter of users having a bad time.
* [ ] Segment field data by device class and connection; a good p75 overall can hide a terrible p75 on low-end Android.
* [ ] Segment by country or region if you serve more than one — latency to your origin is not uniform.
* [ ] Verify field metrics are attributed: which element was LCP, which script caused the longest task, which node shifted.
* [ ] Verify field data is retained long enough to see a regression against the release that caused it.

## Budgets and regression

* [ ] Set a performance budget with numbers, not adjectives: total transferred bytes, JavaScript bytes, request count, and a time target.
* [ ] Verify the budget is enforced in CI, so a regression fails a pull request rather than surfacing a month later.
* [ ] Verify bundle size is reported per pull request, with the delta, not only the absolute number.
* [ ] Verify a third-party script cannot be added without the budget noticing.
* [ ] Alert on a field-metric regression, tied to the deploy that introduced it.
* [ ] Record the current numbers before optimising, so improvement is demonstrable rather than asserted.

## Honest scoping

* [ ] Verify no item is being optimised because it raises the score without helping a user — score is the proxy, not the goal.
* [ ] Verify the slowest real journey has been measured end to end, not just the pages that score well.
* [ ] Verify improvements are checked on a mid-range device, not only a flagship phone or a laptop.
* [ ] Identify which metric is actually costing you conversions before spending a week on the other three.

## Attribution

* [ ] Verify you can name, for the worst page, which resource is the LCP element and which script owns the longest task.
* [ ] Verify a regression can be traced to a release, not merely to a week.
* [ ] Verify synthetic monitoring runs on a schedule against production, not only in CI against a preview.
* [ ] Verify someone is accountable for the numbers, and looks at them on a cadence.
