# Launch copy

[← back to repository](../README.md)

Prepared text for Product Hunt, Hacker News and the rest. Written to be edited, not
posted verbatim — the numbers are current as of the last build, so re-check them against
[the site](https://prodcheck.pages.dev) before posting.

Counts to verify first: run `npx prodcheck info`.

---

## Tagline (60 characters)

> The checklist you wish someone gave you before launch

Alternatives, shorter:

> 4,343 things to check before you ship
> Everything to check before production. Free and open source.

## One-liner (Product Hunt "description", ~260 characters)

> A free, open-source pre-production checklist for solo founders — 4,343 items across
> security, performance, scale, integrations, and what to do after it breaks. Works with
> any AI assistant through MCP, or as a file you commit to your repo.

## Topics / tags

`Developer Tools` · `Open Source` · `Security` · `Artificial Intelligence` · `SaaS`

---

## First comment

The one that matters. Product Hunt readers skim the maker comment before the page.

> Hi — I'm a founder at Arioo.
>
> Before our launch I needed a pre-production review that covered everything we actually
> ship: a backend, a web app, native clients, a deploy pipeline, and a set of AI agents
> with real tools attached. Nothing I could find covered more than a fraction of it, so I
> ended up writing the checklist.
>
> Afterwards the checklist turned out to be more useful than the review. The findings were
> specific to our code. The questions apply to anyone shipping a product.
>
> So it is open source now: **4,343 items across five domains** — security, performance,
> scale, integrations, and what to do after it goes wrong. 88% of them name no product at
> all, so they work whatever you build with.
>
> Three things that make it different from the checklists I bounced off:
>
> **It knows AI is writing your code.** Over 1,300 items cover the LLM and agent surface,
> and the classes of bug coding assistants actually introduce. That part did not need to
> exist a few years ago.
>
> **It plugs into whatever you already use.** An MCP server, so Claude Code, Cursor,
> Copilot, Gemini CLI, Cline or Cherry Studio can pull the relevant items while they work.
> Or `npx prodcheck security --stack django -o SECURITY.md` and it is a file in your repo.
> Or fetch the JSON and use it from n8n, Dify or a script.
>
> **It asks whether you are ready for it to go wrong.** A whole domain on what happens
> after launch: is there a decided first move for a breach, for a corrupted database, for
> the connection going away? The plan for data loss is a backup you have *restored*, not
> one you have taken.
>
> One thing I want to be straight about: it was compiled with AI, and the repository
> contains a whole section on why AI review of AI-written code confirms it is fine. Both
> are true. The prompts it ships with demand a `file:line` citation for every claim and
> make "unknown" a first-class answer, because without that any model tells you the code
> is good. Spot-check the citations.
>
> Free, CC BY 4.0 for the content and MIT for the code. Corrections are worth more to me
> than stars — if an item is wrong or outdated, that is the exact failure mode the
> repository warns about, and I would like to know.

---

## Hacker News

Title — no marketing verbs, HN punishes them:

> Show HN: A 4,343-item pre-production checklist for solo founders

Body:

> I extracted this from the pre-launch security review of my own product, then spent a
> while generalising it away from my stack. It covers security, performance, scale,
> integrations and post-launch incident readiness.
>
> Two design decisions I would be interested in criticism of:
>
> There is no severity field. Assigning severity to four thousand items by heuristic
> would be invention presented as data, and every consumer would inherit the guess. The
> only priority signal is whether an item lives in a release-gate checklist.
>
> Product-specific items are opt-in. Without `--stack` you get only items that name no
> product, because a checklist that hands a Django team 400 items about Rails and iOS
> teaches people to skim.
>
> It ships an MCP server so an assistant can query it, and the prompts are written
> defensively — citations required, "unknown" as a real verdict — because a model
> reviewing AI-written code will otherwise report that it is fine.

---

## X / Twitter thread opener

> I shipped a product and needed to know it was safe to launch.
>
> Nothing covered more than a fraction of what we actually run, so I wrote the checklist.
>
> It's open source now. 4,343 items. Free.
>
> 🧵

Follow-ups, one idea each: the AI surface; the post-launch domain; MCP; the honesty note.

---

## Before you post

Run through [`checklists/integrations/`](../checklists/integrations/) against this project
itself — it would be a poor look to ship an SEO checklist from a site with no sitemap.

- [ ] Site is live at https://prodcheck.pages.dev
- [ ] `sitemap.xml`, `robots.txt` and `llms.txt` served
- [ ] Open Graph image renders — paste the URL into Slack and X and look
- [ ] Search Console and Bing Webmaster verified, sitemap submitted
- [ ] Counts in this file match `npx prodcheck info`
- [ ] npm has the current version — `npm view prodcheck version`
- [ ] Repository description, topics and social preview set
- [ ] A few `good first issue` tickets open for people who arrive wanting to help

---

## Access, before you post

- [x] `wrangler logout` — the deploy grant was 29 scopes for a static upload, and is revoked
- [ ] Re-run `npx wrangler login` only when you next deploy, and log out after

## Search engines — state as of now

| | |
| --- | --- |
| Google Search Console | verified (HTML tag), sitemap submitted |
| Bing Webmaster Tools | **not done** — needs a sign-in. Once in, use *Import from Google Search Console*, which carries the property and the sitemap across in two clicks |

The verification tag is emitted only on the home page, from `PRODCHECK_GOOGLE_VERIFY`
in `scripts/deploy-cloudflare.sh`. **Do not remove it** — Search Console re-checks
periodically and drops the property if it disappears.

## Tagged links, per platform

Post these rather than the bare URL, so you can tell which platform actually sent people
and which just sent applause. The tag has to be on the link **you post**; it cannot be
added afterwards.

| Where | Link to post |
| --- | --- |
| Product Hunt | `https://prodcheck.pages.dev/?utm_source=producthunt&utm_medium=launch&utm_campaign=v1` |
| Hacker News | `https://prodcheck.pages.dev/?utm_source=hn&utm_medium=post&utm_campaign=v1` |
| Reddit | `https://prodcheck.pages.dev/?utm_source=reddit&utm_medium=post&utm_campaign=v1` |
| X | `https://prodcheck.pages.dev/?utm_source=x&utm_medium=social&utm_campaign=v1` |
| LinkedIn | `https://prodcheck.pages.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=v1` |
| Dev.to | `https://prodcheck.pages.dev/?utm_source=devto&utm_medium=post&utm_campaign=v1` |
| Newsletter | `https://prodcheck.pages.dev/?utm_source=newsletter&utm_medium=email&utm_campaign=v1` |

Keep `utm_campaign=v1` on all of them, so a second launch can be compared against this one.

**Hacker News strips query strings from submitted URLs sometimes** — post the bare URL
there and rely on the referrer instead.

## What you can measure without adding a tracker

Three of these need nothing installed:

```bash
# who links to the repo, and what people click there
gh api repos/FarzamHabibi/pre-production-checklist/traffic/popular/referrers
gh api repos/FarzamHabibi/pre-production-checklist/traffic/views

# installs, which is the number that actually means adoption
curl -s https://api.npmjs.org/downloads/range/last-week/prodcheck
```

GitHub keeps only 14 days of traffic data, so export it if the launch week matters.

For the site itself, Cloudflare Web Analytics is the honest option: server-side, no
cookies, no cross-site identifiers, so it needs no consent banner and collects nothing
that would contradict `integrations/05-analytics-and-consent.md`. Enable it in the
Cloudflare dashboard under **Web Analytics**, for the `prodcheck.pages.dev` project.

Whatever you use, decide **before** launch which number would make you change what you do.
A dashboard nobody acts on is a cost, not a measurement.
