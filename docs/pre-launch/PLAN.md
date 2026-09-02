# Pre-launch plan — Product Hunt, Saturday 12 September 2026

Written Wednesday 2 September against commit `1f58f58` (in sync with `origin/main`).
Every number and filename below was checked at the time of writing; where something
could not be determined it says so. The execution checklist is `STEPS.md` in this
folder; this file is the reasoning behind it.

Ten days, a solo maintainer with two to three hours a day, and a Product Hunt engagement
plan running in parallel. Call it fifteen to twenty hours of code-and-docs work in total,
and plan for less.

---

## Where the project actually is

The good news is that the machinery is sound. `scripts/verify.sh` passes end to end on a
clean clone of `1f58f58`: generated files current, 43 CLI/MCP tests green
(`cli/test.js`), 13 eval-structure tests green (`evals/structure.test.js`), internal links
resolve, the site builds, the CSP hash matches, the OG image hash matches, and the GitHub
sidebar description is in sync. The last two CI runs on `main` are green (the two failures
earlier today at 16:23 and 16:35 UTC were followed by fixes). The live site at
`https://prodcheck.pages.dev` is byte-identical to a local build except for the Cloudflare
analytics beacon, and it says 4,343 in every generated place: hero, stat tiles,
`llms.txt`, `checklist.json`, the start prompt. The GitHub Pages mirror says the same.
`data/checklist.json` holds 4,343 items across 96 files, 3,801 of them stack-agnostic
(88%), 542 in 26 stack supplements, 379 release-gate items of which 316 apply to any stack
and 63 sit in 20 of the stack files. `npx prodcheck info` reports exactly those numbers.

The bad news is everything the machinery does not reach. Three surfaces have drifted, and
they drifted for the same reason: a number typed into prose is not a number the build
derives.

**The published package is one data change behind.** npm `prodcheck@1.15.0` was
published today at 14:12 UTC. Six commits have landed since, and one of them
(`6084657`, "commit the generated files the post-launch items changed") moved the data
from 4,337 items / 373 gate / post-launch 192 to 4,343 / 379 / 198. So today:
`https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json` says 4,337 and 373;
the MCP registry entry `io.github.FarzamHabibi/prodcheck` (version 1.15.0, status
active) carries the description "4,337 pre-production checks"; `server.json:4` in the tree
still says 4,337; and the README shown on npmjs.com is the README as it stood at 14:12,
which includes every stale line listed in the next paragraph. The start prompt that the
site, `README.md` and `docs/prompts.md` hand to an assistant says "4,343 items" and then
tells the assistant to fetch the jsDelivr URL, which answers 4,337. Nothing breaks, but
the first thing a careful assistant will notice is that the project's own numbers
disagree. Only a release fixes the npm page; nothing else can.

**Hand-written prose still describes an older repository.** The verified inventory, with
the current value each should carry:

`README.md` — line 54 names `ai/` and `vibe-coding/` as folders; the folders are
`checklists/security/ai/` and `checklists/security/ai-generated-code/` (773 + 548 =
1,321 items, so "over 1,300" is right). Line 165 reads "post-launch 192   post-launch
192", duplicated and wrong; the domain total is 198. Line 313 says "374 items across 19
supplements"; it is 542 across 26. Lines 351-352 and 682-689 say open issues exist for
FastAPI, AWS, Kubernetes, Vercel, Firebase, Stripe and GraphQL, "each labelled `good
first issue`"; all eight stack issues (#1-#8) are closed, the files exist in
`checklists/stacks/`, and line 571 of the same README says so. Lines 360, 423 and 715
say 3,093 items. Line 567 says `post-launch/` has 192 items (198). Line 575 says "373
blocking items: 310 that apply anywhere, plus 63 across 20 products"; it is 379: 316 plus
63 across 20. Line 595 says the demo is a 33-second loop; `ffprobe` gives 34.2 seconds
for `site-assets/demo/demo.mp4`, and the commit that added it is titled "in thirty-four
seconds". Line 624 says a Django app "does not need 1,435 items"; no query of the current
data produces 1,435 (`security --stack django` gives 2,839; core plus Django gives
1,518), so where that number came from could not be determined. Lines 656, 722 and 730
refer to a `vibe-coding/` folder and to `vibe-coding/07-review-blind-spots.md`; the file
is `checklists/security/ai-generated-code/07-review-blind-spots.md`.

`CONTRIBUTING.md` — lines 12-14 list fifteen "wanted" stack files, twelve of which
already exist (only `fly-io.md`, `auth0.md`, `clerk.md` do not). Line 57 says "374 items
out of 3,186 (11.7%)"; it is 542 of 4,343 (12.5%).

`data/README.md` — lines 6 and 56 say 3,093; the shape example shows
`"total": 3093, "stack_agnostic": 2756, "release_gate": 236` at line 25 and, at line 38,
a source path `checklists/core/04-backend-api.md` from before the domain folders
existed; line 60 says 236 items carry `release_gate` (379).

`docs/launch.md` — the Product Hunt tagline, one-liner, maker comment, HN title and X
opener (lines 19, 24, 48, 84, 114) all say 4,124. Line 49 says 90% name no product; it is
88%. This is the file the maintainer will be copying from on the day.

`docs/integrations/http-api.md` — line 18 pins `prodcheck@1.5.0` as the example; line
26 shows `"total": 4124` and `"release_gate": 310`; line 72 says the response is "around
1.5 MB" (`data/checklist.json` is 2,299,404 bytes). `docs/integrations/ci.md:64` pins
`prodcheck@1.5.0`. `docs/integrations/chinese-models.md:51` says `--gate` is 310 items
and line 56 says 4,124. `docs/integrations/openrouter.md:65` says 310 and 4,124.
`docs/hosting.md:122` quotes "324 of 4,124" from the js.org review; that one is a
historical quote and only needs to read as one.

`demo/index.html:187-188` — `"total": "4,337", "scoped": 310`. This is a tracked file
that `scripts/build_demo.py` fills, but `scripts/build.sh` does not call it, so
`verify.sh`'s "generated files are current" check never sees it. Rebuilding it in a
scratch clone produced 4,343 / 316. Rebuilding `demo/chat.html` produced no content
change but turned `};;;` into `};;;;` at line 143: `scripts/build_chat.py:94` matches
`\n\};` and re-inserts `payload + ";"`, so every run appends a semicolon.
`scripts/build_demo.py:134` has a `.replace(";;", ";")` patch for the same bug, which
collapses two semicolons but not three.

`scripts/build_site.py:830-832` — the live site's Contributing band says "there are
open issues for FastAPI, AWS, Kubernetes, Vercel, Firebase, Stripe and GraphQL, all
labelled `good first issue`", and the button at line 837 links to the open-issue filter
for that label, which currently returns nothing. The only open issue is #11, a request to
list a third-party tool, already answered with a reasoned no.

`scripts/query.py:25` — the "reference consumer" named in `data/README.md:68` still
offers `--group {core,ai,vibe-coding,stacks}`. A `--stack django --release-gate` query
runs and returns 318 items, but any `--group` value crashes with `KeyError: 'group'`
(line 46 filters on a field no item has), and the first example in `data/README.md:71`
passes `--domain`, which the script does not define. Not a launch matter — nothing on
the site or in the README points at this script — but the file that calls itself the
reference consumer should run.

Taken together, the item total appears in prose as 3,093, 3,186, 4,124, 4,337 and 4,343,
and the release gate as 236, 310, 316, 373 and 379. Two of the gate figures are correct
in context — 316 is the gate with no stack named, 379 is the gate with every stack
included — and the prose never says which it means. That ambiguity is the thing to fix,
not just the digits.

**The hero video contradicts the hero number.** `site-assets/demo/demo.mp4` (recorded 30
August, commit `5751c9c`) shows "4,337 in the checklist → 310 that apply here" at
roughly the twelve-second mark; the stat tiles two hundred pixels above it say 4,343 and
379. `README.md:24` promises that "the counts come from this repository". The second
video, `chat.mp4` (recorded today, `a4cc099`), shows "318 items" for an Express +
Postgres gate query, which is correct (316 + 2 + 0). The OG image is fine: `verify.sh`
checks `site-assets/og.png.sha` against the rendered `site/og.svg` and it matches.

## What a visitor from Product Hunt will hit on the 12th

They arrive on `https://prodcheck.pages.dev/?utm_source=producthunt...` (the tagged link
is in `docs/launch.md:162`). The hero is generated and correct: 4,343 / 5 / 379 / 88% /
26, a Product Hunt badge that resolves (post 1236140; the product page returns 200), a
copy button for the MCP command, and two videos. The first video they see is the 16-second
chat, which is right. If they watch the second, they see 4,337 → 310. Everything else on
the page is derived from the data and holds.

If they click through to GitHub they land on `README.md`. The headline, the tables and
the cost table are generated and right. The prose between them is where the stale
numbers live, and a reader who compares the "Structure" block (line 157: post-launch
198) with the domain line eight lines later (192, twice) will notice. The Contributing
section sends them to seven closed issues.

If they click "Good first issues" on the site, they get an empty list.

If they run `claude mcp add prodcheck ...` or `npx prodcheck`, they get 1.15.0: 4,337
items, the old README on the npm page, and a review skill (`skills/review/SKILL.md`)
that points at `https://prodcheck.pages.dev/checklist.json` — which now exists and
returns 200, so the earlier 404 is closed even for the already-published package.

If they read `docs/`, they find `hosting.md` and `launch.md` sitting beside the user
guides. Neither is linked from `README.md` (checked: no link to either), so a visitor
only finds them by browsing.

None of this is a broken product. All of it is a project whose pitch is "evidence, not
verdicts" contradicting its own evidence in five places at once, on the one day a few
hundred sceptical people will look.

## What must be true by the 12th, in order of consequence

**One: what `npx` installs must match what the site says.** That means a release —
1.16.0 — after the prose is fixed, so that the npm README, the jsDelivr data, the MCP
registry description and the site all say 4,343 and 379. The release path is already
automated (`.github/workflows/publish.yml` on a GitHub release whose tag matches
`package.json`; Cloudflare is a manual `scripts/deploy-cloudflare.sh`; the registry is a
manual `mcp-publisher publish`, and `verify.sh` already refuses a `server.json` version
that disagrees with `package.json`). Do it by Tuesday the 8th, leaving jsDelivr's
`@latest` cache time to roll over and three days for anything that goes wrong.

**Two: `docs/launch.md` must carry the numbers the site carries.** Five occurrences of
4,124 and one 90%. Twenty minutes, and the highest ratio of consequence to effort in this
plan, because it is the text that will be posted.

**Three: `README.md` prose.** Fourteen lines, listed above and in `STEPS.md` with the
replacement facts. Do the whole file in one sitting so the diff is reviewable as one
change.

**Four: stop it happening again, before fixing it.** Add the missing checks to
`scripts/verify.sh` first, watch them fail on the current text, then fix the text and
watch them pass. A check that has never been seen red has not been shown to work, which
is the project's own rule (`scripts/verify.sh:258-262`, on the link check that could not
fail). The checks are small: every comma-formatted number in prose must be one the data
can produce; the `--gate` count check that today covers only `docs/mcp-clients.md`
should cover the other two docs that state it; `server.json`'s description must contain
the total; `vibe-coding/` must not appear anywhere outside `checklists/`.

**Five: the "good first issues" claim.** Either it is true or it is not said. The cheap
honest version is to open two or three real issues for stack files the maintainer would
accept — `CONTRIBUTING.md` already names `fly-io.md`, `auth0.md` and `clerk.md` as
wanted — and leave the copy alone. That is a public action and the maintainer's call. If
it is not made, the sentence in `scripts/build_site.py:830-832` and the same claim in
`README.md:351-352` and `README.md:682-689` have to change instead. Do not ship the
launch with a button that opens an empty list.

**Six: the demo video.** Fix the semicolon bug in `scripts/build_chat.py` and
`scripts/build_demo.py`, add both builders to `scripts/build.sh` so `verify.sh` covers
`demo/*.html`, then re-record `demo.mp4`/`demo.gif`/`poster.webp` with
`scripts/record_demo.sh` (Chrome and ffmpeg are both present on this machine; the
script needs both). Do this last of the content changes and only after the data is
frozen, because a re-record has to be redone if a single item changes.

**Seven: the remaining docs.** `docs/integrations/*.md`, `data/README.md`,
`CONTRIBUTING.md`, `server.json`. Mechanical.

## What to freeze

Freeze `checklists/` at 4,343 items from now until after the launch. Today's six-item
change to `post-launch/` desynchronised five surfaces (npm, jsDelivr, the registry,
`server.json`, the hero video) in one commit, and every one of them costs a manual step
to bring back. The next ten days do not have that budget. If a genuine error in an item
is reported, fix the wording and accept that the id changes; do not add or remove items.

## What not to do, and why

**Do not add domains, stack files or items.** The roadmap in `README.md:600-601` lists
`launch/`, `social/` and `legal/` as next. They are next, after the 12th. A visitor is
not going to decide against the project because it has 26 stack supplements rather than
29; they might because the number on the site and the number in the package differ.

**Do not touch the "Later" roadmap** (`README.md:603-658`, the scan/check/review
tooling). It is explicitly parked, and the paragraph saying so is one of the better
paragraphs in the file.

**Do not change hosting or the domain.** `docs/hosting.md:92-97` describes adding a
real domain later. Every canonical tag, the sitemap, `og:url`, the registry entry, the
npm `homepage`, the tagged launch links and the Product Hunt submission all carry
`prodcheck.pages.dev`. Changing that in launch week would put a redirect in front of
every first impression.

**Do not redesign the site or the README.** Both are generated where it matters and
correct where generated. The work is to make the prose as reliable as the tables, not to
write more prose.

**Do not re-record the chat demo.** It is correct.

**Do not move `docs/hosting.md` and `docs/launch.md` this week.** They are maintainer
notes in a user-facing folder, and they should move to something like `docs/maintainer/`
along with this folder — after the launch. They are not linked from anywhere a visitor
reads, the move touches relative links in both files, and `docs/launch.md` is probably
referenced by the engagement plan by its current path. `STEPS.md` lists it as deferred.

**Do not widen the eval harness, the skill or the MCP server.** The skill's own "What is
actually known" section (`skills/review/SKILL.md:232-258`) is careful about its limits;
adding claims now means adding claims that have not been measured.

**Do not answer issue #11 again or add any kind of tool directory.** The reply already
on the issue gives the reason and it is the right one.

**Do not set up Bing Webmaster unless it really is the two clicks `docs/launch.md:150`
says it is.** It cannot be verified from the repository whether Search Console is still
verified or whether Bing has been done since that note was written; the executing agent
should ask rather than assume.

## Timing

Steps 1-9 in `STEPS.md` are local and can be done in two or three sittings by Sunday
the 6th. The release (step 10) and the deploy are public actions and need the maintainer
present; aim for Monday the 7th or Tuesday the 8th. Live checks (step 11) the day after
the release, once jsDelivr has rolled over. After Thursday the 10th, nothing changes
except a hotfix, and a hotfix means running `verify.sh` and the release sequence again,
not a hand edit.

## What could not be determined

Whether Google Search Console is still verified and whether Bing Webmaster was done
(`docs/launch.md:143-148` records the state at some earlier date, without a date).
Where the figure 1,435 in `README.md:624` came from. How `site-assets/demo/poster.webp`
was produced — `scripts/record_demo.sh` writes `poster.png` and no script in the tree
converts it. How long jsDelivr caches `@latest` (documented as up to a day; not
measured here). Whether the 1,838 npm downloads in the last seven days are people or
CI. None of these block the launch; all of them are worth writing down when found.
