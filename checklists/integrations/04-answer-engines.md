# Answer Engines & AI Crawlers

Being usable by the systems that answer questions instead of returning links.

This is newer and less settled than the rest of this domain, so it is written as decisions to make deliberately rather than a settled best practice. The one thing that is already clear: whether AI crawlers may read your site is a choice, and not making it is also a choice.

[← all checklists](../README.md)

---


## Decide crawler access on purpose

* [ ] Inventory which AI crawlers reach you — `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Bytespider`, `Applebot-Extended` — from your own access logs, not from a blog post.
* [ ] Decide, and write down, whether each is allowed, and why. "We never looked" is the default and it is rarely the intent.
* [ ] Verify `Google-Extended` is understood correctly: it controls training and grounding, and blocking it does **not** remove you from AI Overviews, which follow ordinary Googlebot rules.
* [ ] Verify blocking a crawler in `robots.txt` is understood as a request, not enforcement; block at the edge if the decision has to hold.
* [ ] Verify AI crawler traffic is not a meaningful share of your origin load, and rate-limit it if it is — see [`security/core/18-abuse-and-availability.md`](../security/core/18-abuse-and-availability.md).
* [ ] Verify you do not serve different content to AI crawlers than to users; cloaking is a policy violation with every engine that detects it.
* [ ] Verify the decision is revisited on a schedule, because the crawler list and the trade-offs are both moving.

## Be quotable

* [ ] Verify the first paragraph of an important page answers the question the page is about, rather than warming up to it.
* [ ] Verify there is a single page that states plainly what the product is, who it is for, and what it costs — models cite the page that says it, not the page that implies it.
* [ ] Verify pricing is on a page as text, not only inside a calculator widget or an image.
* [ ] Verify comparison and alternative pages exist if people ask "X versus Y" about your category.
* [ ] Verify documentation is public and crawlable if you want assistants to answer questions about your product correctly.
* [ ] Verify answers are not buried behind a tab, an accordion, or a JavaScript fetch that a crawler will not perform.
* [ ] Verify content carries a visible date, and that stale pages are updated or removed rather than left to be cited.
* [ ] Consider publishing an `llms.txt` at the root pointing to the pages you would most want quoted — an emerging convention, cheap to add, harmless if ignored.

## Entity clarity

* [ ] Verify your product and company name are used consistently everywhere; a model that sees three spellings treats them as three things.
* [ ] Verify `Organization` structured data with `sameAs` links your site to the profiles that describe you elsewhere.
* [ ] Verify the descriptions on your own site, your social profiles, your repository and any directory listing agree with each other.
* [ ] Verify author and expertise are attributable on content where credibility matters.
* [ ] Verify third-party pages that describe you — a directory, a marketplace listing, a package registry — say what you would want quoted.

## Check what they actually say

* [ ] Ask the major assistants about your product and record the answers verbatim; this is the only measurement that exists today.
* [ ] Verify whether the answers cite you or a third party, and whether the third party is right.
* [ ] Verify factual errors in those answers are traceable to a page you control, and fix the page.
* [ ] Repeat on a cadence — the answers change without your site changing.
* [ ] Verify brand mentions in AI answers are watched with the same seriousness as search rankings, in whatever crude way is available.
