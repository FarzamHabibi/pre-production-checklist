# Performance Release Gate

What has to hold before this ships. Everything here is a number, because a gate made of adjectives is not a gate.

[← all checklists](../README.md)

---


## Thresholds

* [ ] Verify the p75 field LCP is under 2.5 seconds on mobile, or that the exception is written down with an owner and a date.
* [ ] Verify the p75 field INP is under 200 milliseconds.
* [ ] Verify the p75 field CLS is under 0.1.
* [ ] Verify the lab Lighthouse performance score on mobile meets the target agreed for this project, measured as a median of several runs.
* [ ] Verify the Lighthouse accessibility score is 100, or that every remaining item is a known false positive with a note.
* [ ] Verify the Lighthouse best-practices and SEO scores are at target.
* [ ] Verify these numbers were measured on the templates that carry traffic, not only the homepage.

## No regressions

* [ ] Verify the performance budget is not exceeded by this release.
* [ ] Verify no new render-blocking resource was added to the critical path.
* [ ] Verify no new third-party script was added without an owner and a measured cost.
* [ ] Verify bundle size did not increase without a deliberate decision recorded in the pull request.
* [ ] Verify the LCP element on each key template is still what it was, and still discoverable in the HTML.
* [ ] Verify no image above the fold gained `loading="lazy"`.
* [ ] Verify the CI performance check ran on this commit and passed.

## When something is out of your hands

* [ ] Verify a third party degrading the score has been quantified, so the conversation with the vendor has a number in it.
* [ ] Verify a facade, a delayed load or a self-hosted copy has been considered before accepting the cost.
* [ ] Verify the decision to ship despite a failing metric is recorded with who made it and when it is revisited.
* [ ] Verify field metrics are watched for the week after release, tied to this deploy.

## Coverage

* [ ] Verify the gate ran against mobile emulation with throttling, not desktop on a fast connection.
* [ ] Verify the logged-in experience was measured if it is where users spend their time.
* [ ] Verify the numbers in this gate are stored with the release, so the next regression has something to compare against.
