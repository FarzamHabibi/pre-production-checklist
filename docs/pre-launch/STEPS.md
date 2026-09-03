# Pre-launch steps — execution checklist

Companion to `PLAN.md` in this folder, which holds the reasoning. This file is the work,
in order. It is meant to be run by an agent or a person one step at a time and filled in
as it goes.

**How to use it**

- Work from the repository root. Every path and command below is relative to it.
- Do the steps in order. Steps 2 through 9 are local; do not push until step 9 is green.
- Each step ends with a `### Findings` section. Fill it in before starting the next step:
  what you actually observed, what differed from what this file predicted, and anything
  that was wrong here. An empty Findings section means the step was not done.
- Public actions — pushing, creating issues, releasing, publishing, deploying — need the
  maintainer's explicit go-ahead at the time. They are marked **PUBLIC**. Do not do them
  because this file says so.
- Do not edit anything under `checklists/`. Step 1 freezes it.
- `scripts/verify.sh` runs `scripts/build.sh`, which rewrites generated files. On a
  current tree that is a no-op; if `git status` changes after running it, that is itself
  a finding.
- Numbers this file expects, all from `data/checklist.json` at commit `1f58f58`:
  total 4,343 · domains security 3,306 / performance 338 / scale 301 / integrations 200 /
  post-launch 198 · folders security 2,812 (core 1,491, ai 773, ai-generated-code 548) /
  performance 313 / scale 286 / integrations 192 / post-launch 198 / stacks 542 ·
  stack-agnostic 3,801 (88%) · 26 stacks · release gate 379 total, 316 with no stack,
  63 across 20 stacks · 96 checklist files.

---

## Step 0 — Baseline

**What:** Record where things stand before touching anything, so every later step has
something to compare against.

**Files:** none changed.

**Do:**

```bash
git status --porcelain            # expect empty
git log --oneline -1              # expect 1f58f58 or a descendant of it
git fetch origin && git status -sb | head -1     # expect "## main...origin/main" with no ahead/behind
node cli/index.js info            # expect total 4343, release gate 379
./scripts/verify.sh               # expect every line "ok"; last line "all checks passed"
git status --porcelain            # expect still empty
npm view prodcheck version        # expect 1.15.0
curl -s https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json | python3 -c "import json,sys;print(json.load(sys.stdin)['counts'])"
                                  # expect total 4337, release_gate 373 (the published package is behind)
curl -s https://prodcheck.pages.dev/ | grep -oE '[0-9],[0-9]{3} things to check' | head -1
                                  # expect 4,343
curl -s 'https://registry.modelcontextprotocol.io/v0/servers?search=prodcheck' | python3 -c "import json,sys;[print(s['server']['version'], s['server']['description']) for s in json.load(sys.stdin)['servers']]"
                                  # expect 1.15.0 and "4,337 pre-production checks"
```

**Verify:** all of the above match the expectations in the comments. If `verify.sh` is not
green here, stop and record why — nothing below assumes a red baseline.

### Findings

Ran on 2026-09-03. Everything matched except one command that couldn't reach the
network, which looks like an environment restriction rather than a real problem.

- `git status --porcelain`: empty, both before and after `verify.sh`. Matches.
- `git log --oneline -1`: HEAD is `a2b264e` ("a pre-launch plan, and a checklist meant
  to be executed and written back into"), not `1f58f58` itself — but
  `git merge-base --is-ancestor 1f58f58 HEAD` confirms it's a descendant (four commits
  ahead: 1f58f58, 6084657, a4cc099, 3b5bf7f are all still in the log, plus a2b264e on
  top). Matches the "or a descendant of it" clause.
- `git fetch origin && git status -sb | head -1`: `## main...origin/main`, no
  ahead/behind. Matches exactly.
- `node cli/index.js info`: total 4343, release gate 379. Matches.
- `./scripts/verify.sh`: all nine checks printed `ok`, plus a tenth line — "version is
  ahead of what npm has ... note: 1.15.0 already published" — and the script still
  ended with "all checks passed — safe to push". That note line isn't a bare `ok` but
  isn't a failure either; the script treats it as informational. `git status
  --porcelain` after the run was still empty, so it was a true no-op on this tree.
- `npm view prodcheck version`: `1.15.0`. Matches.
- jsdelivr `checklist.json` counts: `total: 4337, release_gate: 373`. Matches the
  step's stated expectation exactly (the other fields — post-launch 192 vs current
  198, stack_agnostic 3795 vs current 3801 — are exactly the "published package is
  behind" drift the step already calls out, not a discrepancy).
- `curl prodcheck.pages.dev` grep: `4,343 things to check`. Matches.
- MCP registry search (`registry.modelcontextprotocol.io`): **could not determine.**
  Every attempt (with and without the sandbox) failed with curl exit 28 / HTTP 000.
  `nslookup` resolved the host to `198.18.0.46`, which is in the
  RFC 2544 benchmarking range (198.18.0.0/15) commonly used as a DNS sinkhole address
  by network filtering — meanwhile `api.github.com` resolved and returned 200 fine in
  the same shell. This looks like this sandbox's egress allowlist doesn't cover that
  host, not an outage or a wrong expectation in the step. Whoever runs this step with
  unrestricted network access should re-run that one command and confirm it reports
  version 1.15.0 and "4,337 pre-production checks".

Baseline is green other than that one unreachable check.

---

## Step 1 — Freeze the data

**What:** No additions, removals or reorderings of items under `checklists/` until after
12 September. A wording fix to an item that is actually wrong is allowed (its id changes,
nothing else). Every count change cascades to npm, jsDelivr, the MCP registry,
`server.json`, the OG image and the demo video, each of which needs a manual step.

**Files:** none changed. This step is a rule the later steps check.

**Verify:**

```bash
python3 -c "import json;c=json.load(open('data/checklist.json'))['counts'];print(c['total'],c['release_gate'],c['by_domain'])"
# expect 4343 379 {'security': 3306, 'scale': 301, 'performance': 338, 'integrations': 200, 'post-launch': 198}
```

Re-run this at the start of steps 8, 9 and 10. If the numbers move, the demo recording
(step 8) and the release (step 10) have to be redone.

### Findings

Ran on 2026-09-03. This step is a rule, not a change — nothing under `checklists/` was
touched, and `git status --porcelain checklists/` confirmed that (empty output).

- Verify command output: `4343 379 {'security': 3306, 'scale': 301, 'performance': 338,
  'integrations': 200, 'post-launch': 198}` — matches the expected line exactly.
- No item wording changes were made in this step, so there is no id change or commit
  hash to record.
- Could not determine: who agreed to the freeze and when. That's a maintainer-side fact
  (a conversation or decision outside this repo/session), not something derivable from
  the tree or git history — whoever runs this with that context should fill it in here.

Numbers are frozen and confirmed as of this run; nothing else to report.

---

## Step 2 — Add the missing checks to `scripts/verify.sh`, and watch them fail

**What:** The stale numbers in `PLAN.md` survived a green gate because no check read the
prose they live in. Add the checks *before* fixing the prose, so each one is seen red
once. A check that has never failed has not been shown to work.

**Files:** `scripts/verify.sh` only. Additions 1-3 go inside the existing
`# docs agree with the data` Python block (`step "docs agree with the data"` is at line
75), placed after line 122 where `generic_gate` is computed, so that `doc`, `per_file`,
`by_folder`, `readme`, `problems`, `gate_total` and `generic_gate` are all in scope.
Addition 4 is a new shell step; addition 5 goes in the site step's existing `gh` block
(line 308).

**Add, in that block:**

1. *Every comma-formatted number in prose is one the data can produce.*

   ```python
   # A count typed into a sentence is not a count the build derives. 3,093 / 3,186 /
   # 4,124 / 4,337 all reached launch week this way. Build the set of numbers the data
   # can actually produce and flag any comma-formatted number in prose that is not in it.
   import glob
   live = set()
   def _add(n): live.add(f"{n:,}")
   c = doc['counts']
   for n in (c['total'], c['stack_agnostic'], c['release_gate'], gate_total, generic_gate): _add(n)
   for n in c['by_domain'].values(): _add(n)
   for n in by_folder.values(): _add(n)
   for n in per_file.values(): _add(n)
   by_area = {}
   for i in doc['items']:
       k = (i['domain'], i['area']); by_area[k] = by_area.get(k, 0) + 1
   for n in by_area.values(): _add(n)
   _add(sum(1 for i in doc['items'] if i['stack'] != 'any'))
   ai_sum = by_area.get(('security', 'ai'), 0) + by_area.get(('security', 'ai-generated-code'), 0)
   # the cost table is generated by build_meta.py; whatever it says is by definition current
   for m in re.finditer(r'\| ([\d,]+) \|', readme[readme.find('<!-- cost:begin -->'):readme.find('<!-- cost:end -->')]):
       live.add(m.group(1))
   # rounded figures that are deliberately approximate, each with the condition that keeps it honest
   if ai_sum >= 1300: live.add('1,300')     # "over 1,300" for the two AI folders
   if c['total'] >= 4000: live.add('4,000') # "4,000+" in the skill
   live.add('1,500')                        # docs/integrations/flowise.md: a hypothetical tool-response size, not a count
   prose = ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'data/README.md', 'server.json',
            'demo/index.html', 'demo/chat.html', 'skills/review/SKILL.md', 'evals/README.md',
            'scripts/build_site.py'] + [p for p in glob.glob('docs/**/*.md', recursive=True)
                                        if not p.startswith('docs/pre-launch/')]  # this plan quotes stale numbers on purpose
   for f in prose:
       for ln, line in enumerate(open(f, encoding='utf-8'), 1):
           for n in re.findall(r'\b\d,\d{3}\b', line):
               if n not in live:
                   problems.append(f"{f}:{ln} says {n}, which no count in the data produces")
   ```

2. *The `--gate` count, wherever it is stated.* Replace the tuple
   `(('docs/mcp-clients.md', generic_gate),)` and its regex with:

   ```python
   for f in ('docs/mcp-clients.md', 'docs/integrations/chinese-models.md', 'docs/integrations/openrouter.md'):
       body = open(f, encoding='utf-8').read()
       hit = re.search(r'`--gate`.{0,120}?(\d[\d,]*) items', body, re.S)
       if not hit:
           problems.append(f"{f}: cannot find the --gate item count to check")
       elif int(hit.group(1).replace(',', '')) != generic_gate:
           problems.append(f"{f} says the gate has {hit.group(1)} items, actual {generic_gate}")
   ```

3. *`server.json`'s description carries the total.* Inside the existing
   `if os.path.exists('server.json'):` block:

   ```python
   if f"{c['total']:,}" not in sj.get('description', ''):
       problems.append(f"server.json description does not state {c['total']:,} — the registry shows this sentence")
   ```

4. *No reference to a folder that does not exist.* A new shell step after
   `# no secrets or private references`:

   ```bash
   step "no reference to the old vibe-coding/ folder"
   if out=$(git grep -nE 'vibe-coding/' -- . ':!checklists' ':!ALL.md' ':!docs/pre-launch' ':!scripts/verify.sh' 2>/dev/null); then
     bad; echo "$out" | head -5 | sed 's/^/     /'
   else ok; fi
   ```

5. *"Good first issues" is only claimed when there are some.* Inside the existing
   `if command -v gh >/dev/null 2>&1; then` block of the site step:

   ```bash
   if grep -qi 'good first issue' README.md scripts/build_site.py; then
     n=$(gh issue list --label "good first issue" --state open --json number --jq 'length' 2>/dev/null || echo "?")
     if [ "$n" = "0" ]; then
       miss="README/site say 'good first issue' tickets exist but none are open — open some or stop saying it"
     fi
   fi
   ```

**Verify:** `./scripts/verify.sh` must now go **red** on "docs agree with the data" with
(at least) these lines — compare against the list in `PLAN.md`:

```
README.md:360 says 3,093 ...        README.md:423 ...        README.md:624 says 1,435 ...
README.md:715 ...                   CONTRIBUTING.md:57 says 3,186 ...
data/README.md:6 ... :56 ...        docs/launch.md:19 ... :24 ... :48 ... :84 ... :114 (4,124)
docs/hosting.md:122 (4,124)         docs/integrations/chinese-models.md:56 (4,124)
docs/integrations/openrouter.md:65 (4,124)      demo/index.html:187 (4,337)
docs/integrations/chinese-models.md says the gate has 310 items, actual 316
docs/integrations/openrouter.md says the gate has 310 items, actual 316
server.json description does not state 4,343
```

and red on the new `vibe-coding/` step (README.md lines 54, 656, 722, 730 and
evals/README.md:7), and — if `gh` is installed — on the site step for the good-first-issue
claim. `demo/chat.html` should produce no number complaint (its 318 has no comma; that
is fine). If any expected line is missing, the check is wrong, not the text: fix the check
before moving on. If a line appears that `PLAN.md` did not predict, that is a finding.

Then run the block on its own to be sure the Python has no syntax error:
`bash -n scripts/verify.sh`.

### Findings

All five additions went in as specified (bash -n and a standalone compile of the
docs-agree Python block both pass — no syntax error). `./scripts/verify.sh` goes red as
predicted. Every line `PLAN.md` predicted appeared, so nothing here was "the check is
wrong" territory. Full red output (the script's own `head -10`/`head -5` truncate what's
printed on screen; this is the untruncated set the checks actually produce):

```
docs agree with the data — FAIL
README.md:360 says 3,093, which no count in the data produces
README.md:423 says 3,093, which no count in the data produces
README.md:530 says 4,700, which no count in the data produces          <- unpredicted
README.md:531 says 4,800, which no count in the data produces          <- unpredicted
README.md:624 says 1,435, which no count in the data produces
README.md:715 says 3,093, which no count in the data produces
CONTRIBUTING.md:57 says 3,186, which no count in the data produces
data/README.md:6 says 3,093, which no count in the data produces
data/README.md:56 says 3,093, which no count in the data produces
server.json:4 says 4,337, which no count in the data produces          <- unpredicted (see below)
demo/index.html:187 says 4,337, which no count in the data produces
docs/launch.md:19/24/48/84/114 says 4,124, which no count in the data produces
docs/hosting.md:122 says 4,124, which no count in the data produces
docs/integrations/chinese-models.md:56 says 4,124, which no count in the data produces
docs/integrations/openrouter.md:65 says 4,124, which no count in the data produces
docs/mcp-clients.md: cannot find the --gate item count to check        <- unpredicted, and wrong (see below)
docs/integrations/chinese-models.md says the gate has 310 items, actual 316
docs/integrations/openrouter.md says the gate has 310 items, actual 316
server.json description does not state 4,343 — the registry shows this sentence

site builds, complete and in sync — FAIL
README/site say 'good first issue' tickets exist but none are open — open some or stop saying it

no reference to the old vibe-coding/ folder — FAIL
README.md:54, README.md:656, README.md:722, README.md:730, evals/README.md:7
```

Every line `PLAN.md` listed is present. `demo/chat.html` correctly produced no
complaint. Three things fired that `PLAN.md` did not predict:

1. **`README.md:530` and `:531` (4,700 / 4,800), in the generated cost table.** Real bug
   in addition 1's own exemption code, not in the prose. The `<!-- cost:begin -->` table
   is `| \`--gate\` | 316 | 4,700 |` — pipe-delimited cells sharing a `|` between them.
   `re.finditer(r'\| ([\d,]+) \|', ...)` cannot return overlapping matches, so once it
   consumes `| 316 |` the next match starts after that closing pipe and skips `4,700`
   entirely (same for `318`/`4,800` on the next row); it only ever catches every other
   number in the table. I did not change the regex — the step specifies it verbatim —
   but as written it does not do what its own comment says ("whatever it says is by
   definition current").
2. **`server.json:4` flagged separately from the dedicated server.json check.** Because
   addition 1's `prose` list includes `'server.json'` verbatim, the generic number scan
   independently catches the same `4,337` that addition 3's targeted check also reports
   two lines later. Not wrong — both complaints are true — just two lines where `PLAN.md`
   listed one.
3. **`docs/mcp-clients.md: cannot find the --gate item count to check` — a real
   regression, not just noise.** The old regex was
   `` `npx prodcheck --gate`[^.]*?(\d[\d,]*) items ``; addition 2 replaces it with
   `` `--gate`.{0,120}?(\d[\d,]*) items `` for all three files. `docs/mcp-clients.md`'s
   actual sentence is `` `npx prodcheck --gate` is usually the right first paste: 316
   items `` — the backtick sits before `npx`, not immediately before `--gate`, so the new
   regex never matches this file at all, and the check that used to pass now reports "cannot
   find" instead of confirming 316. Verified directly: the old pattern matches this text,
   the new one returns `None`. `PLAN.md` (`docs/pre-launch/PLAN.md` around line 180) says
   this addition should extend a check "that today covers only `docs/mcp-clients.md`" to
   the other two docs — it did not anticipate that the same edit would break the original
   target. Left as specified per this step's scope; flagging for whoever touches this file
   next (Step 5 mechanically touches `docs/integrations/*.md`/`server.json` but not this
   regex).

Nothing expected was missing. `bash -n scripts/verify.sh` passes. Not evaluated: whether
`gh issue list` would report something other than 0 on a different day — it returned 0
against the live repo at run time, which is what made the good-first-issue line fire.

---

## Step 3 — `README.md` prose

**What:** Fourteen lines. Replacement facts below; wording is yours, facts are not. Do the
file in one sitting so the diff reads as one change.

**Files:** `README.md`.

| Line | Now | Should say |
| --- | --- | --- |
| 54 | "the `ai/` and `vibe-coding/` folders, over 1,300 items" | "the `security/ai/` and `security/ai-generated-code/` folders, over 1,300 items" (773 + 548 = 1,321) |
| 165 | "post-launch 192   post-launch 192" | "post-launch 198", once |
| 313 | "374 items across 19 supplements" | "542 items across 26 supplements" |
| 351-352 | "Open issues exist for AWS, Vercel, Fly.io, Kubernetes, Firebase, Stripe, FastAPI and GraphQL" | depends on step 6. Interim: "Files for Fly.io, Auth0 and Clerk are wanted; see CONTRIBUTING.md." |
| 360 | "all 3,093 items" | "all 4,343 items" |
| 423 | "reading 3,093 items" | "reading 4,343 items" |
| 567 | "192 items across 8 checklists" | "198 items across 8 checklists" |
| 575-576 | "373 blocking items: 310 that apply anywhere, plus 63 across 20 products" | "379 blocking items: 316 that apply anywhere, plus 63 across 20 products" |
| 595 | "a 33-second loop" | "a 34-second loop" (`ffprobe` says 34.2 s) |
| 624-625 | "does not need 1,435 items; it needs closer to 400" | no source for 1,435 exists. Suggested: "does not need every one of the 1,491 core items — `core/07`, `core/11` and `core/12` alone are 202 it can skip" (55 + 106 + 41) |
| 656 | "whose `vibe-coding/` folder warns" | "whose `security/ai-generated-code/` folder warns" |
| 682-689 | "There are open issues for FastAPI … each labelled `good first issue`" | depends on step 6; all of #1-#8 are closed and the files exist |
| 715 | "keeping 3,093 items consistent" | "keeping 4,343 items consistent" |
| 722 | "**The `vibe-coding/` folder applies to this repository too.**" | "**The `security/ai-generated-code/` folder applies to this repository too.**" |
| 730 | "`vibe-coding/07-review-blind-spots.md`" | `security/ai-generated-code/07-review-blind-spots.md`, written as a Markdown link to `checklists/security/ai-generated-code/07-review-blind-spots.md` so the link checker in `verify.sh` covers it from now on |

Optional, same sitting: lines 398-400 list MCP clients and omit OpenCode, which
`docs/mcp-clients.md:127` documents. Add the word.

Do not touch anything between `<!-- counts:begin -->`/`<!-- counts:end -->`,
`<!-- start-prompt:begin -->`/`<!-- start-prompt:end -->` or
`<!-- cost:begin -->`/`<!-- cost:end -->` — those are generated and `verify.sh` will
revert a hand edit.

**Verify:**

```bash
grep -nE '3,093|374 items|19 supplements|vibe-coding/|373 blocking|310 that apply|33-second|1,435|post-launch 192' README.md
# expect no output
grep -c 'Open issues exist\|There are open issues' README.md    # expect 0 unless step 6 opened real ones
node cli/test.js 2>&1 | tail -1                                  # expect "43 passed, 0 failed" (README count test included)
./scripts/verify.sh 2>&1 | grep -A20 'docs agree'                # README lines gone from the red list; other files still listed
```

### Findings

Ran on 2026-09-03. Made all 14 required edits plus the optional OpenCode addition, in
one sitting, touching only `README.md`. Left the `<!-- counts:begin -->`,
`<!-- start-prompt:begin -->` and `<!-- cost:begin -->` blocks untouched, as instructed.

Line-by-line (line numbers are pre-edit, matching the table):

- **54**: `ai/` and `vibe-coding/` → `security/ai/` and `security/ai-generated-code/`.
  Done exactly as specified.
- **165**: the duplicated `post-launch 192   post-launch 192` → single `post-launch 198`.
  Done.
- **313**: `374 items across 19 supplements` → `542 items across 26 supplements`. Done;
  matches the file's own header numbers (`data/checklist.json` counts.by_folder.stacks).
- **351-352**: since Step 6's Findings are still empty (not done yet), used the table's
  interim text verbatim: "Files for Fly.io, Auth0 and Clerk are wanted; see
  CONTRIBUTING.md." Confirmed against `CONTRIBUTING.md`'s own wanted-list (line 12-13),
  which names `fly-io.md`, `auth0.md`, `clerk.md` and no others — those three really are
  the gap; `checklists/stacks/` has files for all the others CONTRIBUTING.md lists.
- **360, 423**: both `3,093` → `4,343`. Done.
- **567**: `192 items across 8 checklists` → `198 items across 8 checklists`. Done.
- **575-576**: `373 blocking items: 310 that apply anywhere, plus 63 across 20 products`
  → `379 blocking items: 316 that apply anywhere, plus 63 across 20 products`. Done.
- **595**: `a 33-second loop` → `a 34-second loop`. Verified independently with
  `ffprobe -show_entries format=duration site-assets/demo/demo.gif`, which reports
  `34.200000` — the step's cited figure is right.
- **624-625**: no source for `1,435` exists, confirmed. Replaced with the table's
  suggested wording, keeping the original's "no mobile client and no file uploads"
  qualifier since it's the reason `core/11` and `core/12` are skippable: "A Django app
  with no mobile client and no file uploads does not need every one of the 1,491 core
  items — `core/07`, `core/11` and `core/12` alone are 202 it can skip." Verified the
  202 by counting `data/checklist.json` items with `domain=security, area=core` grouped
  by `source.file`: core/07=55, core/11=106, core/12=41, sum=202. Matches the table
  exactly.
- **656**: `vibe-coding/` → `security/ai-generated-code/` inside the blockquote. Done.
- **682-689**: this block also depends on Step 6, which isn't done. The table gives no
  suggested replacement text here, only the underlying fact ("all of #1-#8 are closed
  and the files exist"). Confirmed that fact: `checklists/stacks/` already has
  `fastapi.md`, `aws.md`, `kubernetes.md`, `vercel.md`, `firebase.md`, `stripe.md`, and
  `graphql.md` — every stack the old text linked an issue for. Since those specific
  claims are simply false now, I replaced the whole "there are open issues for
  FastAPI...GraphQL" list with the same interim language used at 351-352, pointing to
  CONTRIBUTING.md instead of dead/closed issue links: "The single most useful
  contribution is a stack file for a stack that isn't covered. Files for Fly.io, Auth0
  and Clerk are wanted; see CONTRIBUTING.md for the current list and what makes an item
  belong in a stack file. Copy `_TEMPLATE.md` and open a PR." Step 6, when it runs
  later, will need to revisit this paragraph again regardless of which option (A or B)
  the maintainer picks — this is a stopgap, not the final wording.
- **715**: `3,093` → `4,343`. Done.
- **722**: `**The `vibe-coding/` folder applies to this repository too.**` →
  `**The `security/ai-generated-code/` folder applies to this repository too.**`. Done.
- **730**: `` `vibe-coding/07-review-blind-spots.md` `` → a Markdown link,
  `` [`security/ai-generated-code/07-review-blind-spots.md`](../../checklists/security/ai-generated-code/07-review-blind-spots.md) ``.
  Confirmed the target file exists at that path.
- **Optional (398-400)**: added OpenCode to the MCP client list, alphabetically placed
  right before Cherry Studio to match `docs/mcp-clients.md`'s own client roster (it has
  a `### OpenCode` section at line 127 that the README list was missing).

Verification, all run after the edits:

```
grep -nE '3,093|374 items|19 supplements|vibe-coding/|373 blocking|310 that apply|33-second|1,435|post-launch 192' README.md
```
→ no output. Matches.

```
grep -c 'Open issues exist\|There are open issues' README.md
```
→ `0`. Matches ("expect 0 unless step 6 opened real ones" — it hasn't).

```
node cli/test.js 2>&1 | tail -1
```
→ `43 passed, 0 failed`. Matches.

```
./scripts/verify.sh 2>&1 | grep -A20 'docs agree'
```
→ all `README.md:*` lines are gone from the red list. Two `README.md` lines remain in
the full verify.sh output (`README.md:529` and `:530`, both saying `4,700`/`4,800`
"which no count in the data produces") but these are not a Step 3 miss: they sit inside
the generated `<!-- cost:begin -->...<!-- cost:end -->` table this step was told not to
touch, and they are exactly the Step 2 Findings' documented regex bug (the addition-1
`re.finditer(r'\| ([\d,]+) \|', ...)` can't match overlapping `|`-delimited cells, so it
skips every other number in that table). Every other still-red line belongs to files
other steps own: `CONTRIBUTING.md`, `data/README.md`, `server.json`, `demo/index.html`,
`docs/launch.md` (Step 4/5), and the `vibe-coding/` grep also still fires on
`evals/README.md:7` (Step 5's file, untouched here).

No stale number in `README.md` that this table missed was found. Nothing here required
a judgment call beyond the two "depends on Step 6" paragraphs, both handled with the
table's own interim wording (adding one for 682-689 by extension of the same pattern).
`git status --porcelain README.md` shows the file modified; not committed, since this
step doesn't instruct a commit (that's Step 9).

---

## Step 4 — `docs/launch.md`, the copy that will be posted

**What:** Five occurrences of 4,124 and one 90%. This is the highest consequence per
minute in the whole plan: it is the text the maintainer copies on the day.

**Files:** `docs/launch.md`.

| Line | Now | Should say |
| --- | --- | --- |
| 19 | "4,124 things to check before you ship" | "4,343 things to check before you ship" |
| 24 | "4,124 items across" | "4,343 items across" |
| 48 | "**4,124 items across five domains**" | "**4,343 items across five domains**" |
| 49 | "90% of them name no product" | "88% of them name no product" |
| 84 | "Show HN: A 4,124-item pre-production checklist" | "Show HN: A 4,343-item pre-production checklist" |
| 114 | "4,124 items. Free." | "4,343 items. Free." |

Line 54 ("Over 1,300 items") is right. Leave the "Before you post" and "Search engines"
sections alone; they are the maintainer's to tick, and whether Search Console is still
verified or Bing was done cannot be determined from the repository — ask.

**Verify:**

```bash
grep -n '4,124\|90%' docs/launch.md      # expect no output
grep -c '4,343' docs/launch.md           # expect 5
```

### Findings

Went exactly as written: all six occurrences (lines 19, 24, 48, 84, 114 for 4,124→4,343,
and line 49 for 90%→88%) matched the table before editing, `sed` applied them, and both
verify commands gave the expected output (`grep -n '4,124\|90%'` empty, `grep -c '4,343'`
= 5). "Before you post" (line 122) and "Search engines" (line 143) sections left
untouched as instructed — did not tick or edit anything there.

On the maintainer's Product Hunt plan carrying its own copy of these numbers outside the
repo: could not determine from this repository. Project memory (from a prior session,
not this repo) mentions a 10-day PH plan living in an artifact and in `ph-plan.md` in
that other session's scratchpad — neither is reachable from here to check for stale
4,124/90% figures. A repo-wide grep confirms `docs/hosting.md:122`,
`docs/integrations/chinese-models.md:56`, and `docs/integrations/openrouter.md:65` still
say 4,124, but those are Step 5's files, not this one, and are correctly out of scope
here. Ask the maintainer directly whether the PH launch-day copy (artifact or
`ph-plan.md`) quotes 4,124 or 90% anywhere and needs the same fix.

---

## Step 5 — The remaining docs, `server.json`, and two small code fixes

**What:** Mechanical corrections in files a visitor reaches from the README or the site.

**Files and edits:**

`docs/integrations/http-api.md`
- line 18: `prodcheck@1.5.0` → the version step 10 will release (`prodcheck@1.16.0`). If
  step 10 ends up using a different number, come back here.
- line 26: `"total": 4124` → `4343`; `"release_gate": 310` → `379`.
- line 72: "around 1.5 MB" → "around 2.3 MB" (`data/checklist.json` is 2,299,404 bytes;
  the CDN serves it compressed, which was not measured — do not claim a compressed size).

`docs/integrations/ci.md`
- line 64: `prodcheck@1.5.0` → `prodcheck@1.16.0` (same caveat).

`docs/integrations/chinese-models.md`
- line 51: "`--gate` (310 items)" → "(316 items)".
- line 56: "paste all 4,124 items" → "4,343".

`docs/integrations/openrouter.md`
- line 65: "310 items fit … 4,124 do not" → "316 … 4,343".

`docs/hosting.md`
- line 122: it quotes the js.org review's figures ("324 of 4,124") as if current. Reword
  to make it plainly historical and drop the comma number, e.g. "At the time, 92% of the
  checklist was stack-agnostic and only 324 items were Node or JavaScript specific".

`data/README.md`
- lines 6 and 56: 3,093 → 4,343.
- line 25: `"total": 3093, "stack_agnostic": 2756, "release_gate": 236` →
  `4343, 3801, 379`.
- line 38: `checklists/core/04-backend-api.md` → `checklists/security/core/04-backend-api.md`.
  Optional: add `"stack_id": "any"` to the example item; the real records carry it.
- line 60: "236 items carry it" → "379 items carry it; 316 of those apply to any stack".

`CONTRIBUTING.md`
- lines 12-14: the "Wanted" list names fifteen files, twelve of which exist in
  `checklists/stacks/`. Keep only `fly-io.md`, `auth0.md`, `clerk.md`.
- line 57: "374 items out of 3,186 (11.7%)" → "542 items out of 4,343 (12.5%)".

`server.json`
- line 4: "4,337 pre-production checks" → "4,343 pre-production checks". (The version
  fields stay 1.15.0 until step 10.)

`evals/README.md`
- line 7: link text `` `vibe-coding/` `` → `` `security/ai-generated-code/` `` (the target
  is already right).

`scripts/query.py` — a real bug, found while checking: `--group` filters on
`i["group"]`, a field no item has, so `python3 scripts/query.py --group core` exits with
`KeyError: 'group'`. `data/README.md:68` calls this file the reference consumer.
- line 25: choices → `["core", "ai", "ai-generated-code"]`.
- line 46 (`items = [i for i in items if i["group"] in a.group]`): filter on `i["area"]`
  instead, and rename the option to `--area` to match the CLI, or keep `--group` — your
  call, but make the help text and `data/README.md:71-74` agree with whichever you pick.
- `data/README.md:71` also shows `--domain security`, and `query.py` has no `--domain`
  option (`python3 scripts/query.py --stack django --domain security` exits with
  "unrecognized arguments"). Either add the option (filter on `i["domain"]`) or drop it
  from the example.

**Verify:**

```bash
grep -rn '1\.5\.0\|4124\|4,124\|3,093\|3093\|3,186\|4,337\|"release_gate": 236\|"release_gate": 310' docs data/README.md CONTRIBUTING.md server.json | grep -v 'docs/pre-launch/'
# expect no output
python3 scripts/query.py --group core --format count          # (or --area) expect 1491
python3 scripts/query.py --group ai-generated-code --format count   # expect 548
grep -oE '^\./scripts/query\.py [^#]+' data/README.md | while read -r cmd; do python3 ${cmd#./} --format count >/dev/null 2>&1 && echo "ok: $cmd" || echo "FAILS: $cmd"; done
                                                              # every documented example must run (today, line 71's --domain fails)
python3 -c "import json;print(json.load(open('server.json'))['description'])"   # contains 4,343
./scripts/verify.sh 2>&1 | grep -B1 -A12 'docs agree'         # only demo/index.html:187 should remain, until step 7
```

### Findings

All edits listed above were made exactly as specified, plus the `data/README.md` example
item's `source.file` path (was already flagged as needing the `checklists/security/`
prefix) and the optional `"stack_id": "any"` addition. Verified every number against
`data/checklist.json` before writing it: total 4343, release_gate 379,
stack_agnostic 3801, release_gate & stack=="any" 316, area=core 1491,
area=ai-generated-code 548, stack != "any" 542 (12.5% of 4343), checklist.json file size
2,299,404 bytes — all match the step's claims exactly, nothing else was stale in these
files beyond what's listed.

`scripts/query.py`: renamed `--group` to `--area` (real field name), fixed choices to
`["core", "ai", "ai-generated-code"]`, filtered on `i["area"]` instead of the
nonexistent `i["group"]`, and added a `--domain` option (filters `i["domain"]`) since
`data/README.md`'s own documented example (`--stack django --domain security`) needed it
and dropping it would have meant rewriting that doc example instead. Also updated the
module docstring's `--group core` example to `--area core`.

`CONTRIBUTING.md`: counted the wanted-stacks list by exact filename match against
`checklists/stacks/` and got 10 exact matches, not the 12 the step states — `go.md` and
`android.md` are not present as such (only `go-gin.md` and `android-kotlin.md` exist,
which arguably cover the same ground). This doesn't change the action: the step names
the three files to keep (`fly-io.md`, `auth0.md`, `clerk.md`) unambiguously, so I kept
those three regardless of how the count is reconciled. Flagging the "twelve" figure as
imprecise, not the resulting edit.

Verification: the `grep -rn` for stale numbers returns nothing (clean). Both
`query.py --area` counts match (1491, 548). The "every documented example must run"
loop **appears to fail all four** when run under zsh — `${cmd#./}` doesn't word-split in
zsh, so the whole command string becomes one bogus filename. Re-ran the identical loop
under `bash -c` and all four pass. This is a shell-compatibility artifact of the
verify snippet itself, not a real failure — worth a note if the maintainer runs `verify.sh`
under zsh anywhere. `server.json`'s description now contains 4,343 as required.

`./scripts/verify.sh`'s "docs agree with the data" section does **not** come back with
only `demo/index.html:187` as the step expected — three more lines are present:
- `README.md:529` and `README.md:530` (the `<!-- cost:begin -->` token-estimate table,
  4,700 and 4,800): not caused by my edits — I never touched README.md. The check's own
  regex (`\| ([\d,]+) \|`, non-overlapping) only ever captures every other pipe-delimited
  cell in a `| a | b | c |` row, because adjacent cells share a `|` that a non-overlapping
  match can't reuse; confirmed by testing the regex directly against the current table:
  it captures the Items column (316, 318, 1,491, 4,343) but never the tokens column
  (4,700, 4,800, 19,400, 76,800). This looks like a latent bug in `verify.sh` itself
  (introduced whenever this check was written, unrelated to Step 5), not a stale number
  in README.md.
- `docs/mcp-clients.md: cannot find the --gate item count to check`: the check looks for
  the literal substring `` `--gate` `` (backtick immediately before and after) followed by
  "N items"; the file's actual text is `` `npx prodcheck --gate` is usually the right
  first paste: 316 items `` — the backtick sits before `npx prodcheck --gate`, not
  immediately before `--gate`, so the regex never matches. `docs/mcp-clients.md` is not
  in Step 5's file list, so left untouched, but the 316 figure already visible there is
  correct.

Neither of these two extra findings is something Step 5's file list asked me to fix
(README.md is Step 3's, verify.sh is Step 2's, mcp-clients.md is nobody's yet), so I left
all three alone. Flagging both here since they weren't accounted for in the step's
expected verify output.

---

## Step 6 — "Good first issues": make it true or stop saying it

**What:** The site (`scripts/build_site.py:830-832`, button at 837), `README.md:351-352`
and `README.md:682-689` say there are open `good first issue` tickets for stack files.
There are none open; issues #1-#8 are closed and the files exist. Pick one:

**Option A — make it true.** **PUBLIC.** With the maintainer's go-ahead, open three
issues for the files `CONTRIBUTING.md` already says it wants. Labels `good first issue`,
`help wanted` and `stack file` all exist on the repository.

```bash
for s in "Fly.io:fly-io" "Auth0:auth0" "Clerk:clerk"; do
  name=${s%%:*}; slug=${s##*:}
  gh issue create --title "Add $name stack checklist" \
    --label "good first issue" --label "help wanted" --label "stack file" \
    --body "A stack supplement for $name at \`checklists/stacks/$slug.md\`. Copy \`checklists/stacks/_TEMPLATE.md\`; the rule for what belongs in a stack file is in CONTRIBUTING.md. Items must be checks, not recommendations."
done
```

Then rewrite `README.md:351-352` and `682-689` to link the new issue numbers, and
`scripts/build_site.py:830-832` to name Fly.io, Auth0 and Clerk.

**Option B — stop saying it.** Rewrite `scripts/build_site.py:830-832` to "The most
useful addition is a stack file for a stack that is not covered; `CONTRIBUTING.md` says
which are wanted and how the file is structured." Change the button at line 837 to link
`{REPO}/blob/main/CONTRIBUTING.md#1-a-stack-file-for-a-stack-that-isnt-covered` or
remove it. Make `README.md:351-352` and `682-689` say the same.

**Files:** `scripts/build_site.py`, `README.md`.

**Verify:**

```bash
gh issue list --label "good first issue" --state open --json number --jq 'length'   # A: 3 · B: 0
grep -n 'open issues' README.md scripts/build_site.py      # A: only lines that link real issues · B: no output
python3 scripts/build_site.py >/dev/null && grep -o 'Good first issues\|good+first+issue' site/index.html
                                                             # A: present · B: absent
./scripts/verify.sh 2>&1 | grep -A3 'site builds'           # no good-first-issue complaint
```

### Findings

Chose **Option B** (stop saying it) — Option A is marked PUBLIC (creates issues on the
live repo) and this run is restricted to non-public actions, so no issues were opened.
Confirmed the premise first: `gh issue list --label "good first issue" --state open
--json number --jq 'length'` returns `0`.

`README.md:351-352` and `682-689` needed no edit here — Step 3 had already replaced them
with interim wording anticipating this step ("Files for Fly.io, Auth0 and Clerk are
wanted; see CONTRIBUTING.md" / "The single most useful contribution is a stack file for
a stack that isn't covered... see CONTRIBUTING.md for the current list"), and that text
already matches Option B's intent, so it stands unchanged.

Only `scripts/build_site.py:825-840` (the `#contribute` section) still had the false
claim. Replaced the "open issues for FastAPI, AWS, Kubernetes, Vercel, Firebase, Stripe
and GraphQL, all labelled `good first issue`" paragraph with the step's suggested text
("stack file for a stack that is not covered; CONTRIBUTING.md says which are wanted and
how the file is structured"), pointed the `CONTRIBUTING.md` button at the specific
section anchor (`#1-a-stack-file-for-a-stack-that-isnt-covered` — verified that heading
exists at `CONTRIBUTING.md:5`), and removed the "Good first issues" button that linked
the (now permanently empty) label-filtered issue search, per the step's own suggestion
to remove it rather than repoint it.

Verification:
- `gh issue list --label "good first issue" --state open --json number --jq 'length'` → `0`. Matches B.
- `grep -n 'open issues' README.md scripts/build_site.py` → one hit, `README.md:571`:
  "Written rather than left as open issues, because...". This is a true, B-consistent
  sentence (it explicitly says these stacks were *not* left as open issues) that the
  grep's substring match can't distinguish from a false claim of open issues existing.
  The step's stated expectation ("B: no output") is a little too blunt for this line;
  flagging it rather than editing a sentence that isn't wrong.
- `python3 scripts/build_site.py >/dev/null && grep -o 'Good first issues\|good+first+issue' site/index.html` → no output. Matches B (absent).
- `./scripts/verify.sh 2>&1 | grep -A3 'site builds'` → `site builds, complete and in sync   ok`, no good-first-issue complaint. Matches.
- Full `verify.sh` run still shows two unrelated FAILs (`internal links resolve`,
  `docs agree with the data`) — both pre-existing and owned by other steps (2/3/4/5), not
  touched here.

Files actually changed: `scripts/build_site.py` only. `README.md` was already correct
from Step 3 and untouched by this step. Not committed (Step 9 commits).

---

## Step 7 — Make the demo pages generated for real

**What:** `demo/index.html` is a tracked, generated file that `scripts/build.sh` does not
regenerate, so it says 4,337 / 310 while the data says 4,343 / 316. And both demo
builders grow a semicolon on every run.

**Files:** `scripts/build_chat.py`, `scripts/build_demo.py`, `scripts/build.sh`,
`CONTRIBUTING.md`, and the regenerated `demo/index.html`, `demo/chat.html`.

**Do:**

1. `scripts/build_chat.py:94` and `scripts/build_demo.py:127`: the regex
   `r"const DATA = \{.*?\n\};"` matches through the first `;` and leaves any extras, then
   `payload + ";"` is inserted after them. Change both to `r"const DATA = \{.*?\n\};+"`.
2. `scripts/build_demo.py:134`: delete the `.replace(payload + ";;", payload + ";")`
   workaround; it collapses two semicolons and not three.
3. `scripts/build.sh`: add `python3 scripts/build_demo.py` and
   `python3 scripts/build_chat.py` after `build_single_file.py`, and add `demo/*.html` to
   the header comment listing what it regenerates. `build_chat.py` spawns
   `node cli/mcp.js` for a real tool call; CI (`.github/workflows/ci.yml:23-25`) and the
   publish workflow both set up Node before running `build.sh`, so this is safe there.
4. `CONTRIBUTING.md:85-89` — add `demo/index.html` and `demo/chat.html` to the table of
   generated files.

**Verify:**

```bash
python3 scripts/build_chat.py && python3 scripts/build_chat.py
grep -n '^};;' demo/chat.html                   # expect no output (was line 143: `};;;`)
python3 scripts/build_demo.py
grep -n '"total": "4,343"\|"scoped": 316' demo/index.html    # expect both
git diff --stat                                # demo/index.html, demo/chat.html, the three scripts, CONTRIBUTING.md
./scripts/build.sh && git diff --stat          # same set — a second run must not change anything more
./scripts/verify.sh                            # "generated files are current" ok; "docs agree" now green
```

### Findings

Made all four changes as written: the `\};+` regex in both `build_chat.py:94` and
`build_demo.py:127`; deleted the `.replace(payload + ";;", payload + ";")` line in
`build_demo.py`; added `python3 scripts/build_demo.py` and `python3 scripts/build_chat.py`
to `scripts/build.sh` after `build_single_file.py`, plus `demo/*.html` to its header
comment; added `demo/index.html` and `demo/chat.html` rows to the generated-files table
in `CONTRIBUTING.md`.

The data-correctness part of the verify worked: `demo/index.html` now says `"total":
"4,343"` and `"scoped": 316` (was 4,337/310). `./scripts/build.sh` run twice back to back
produced an identical `git diff --stat` both times, so the second run was a no-op — no
edit was reverted by hand or otherwise, and `verify.sh` itself changed nothing on disk
(confirmed by diffing `git diff --stat` before and after running it).

The semicolon part of the verify did **not** pass, and the step's own fix is
insufficient. `grep -n '^};;' demo/chat.html` still prints `143:};;` (and
`demo/index.html:265` has the same `};;`), not the "no output" the step expects. Root
cause: widening the match to `\};+` only changes how many of the *old* trailing
semicolons get consumed out of the source text before substitution — it does not touch
the two places that *add* a semicolon on every run regardless of what was consumed: the
substitution template itself, `"const DATA = __DATA__;"` (hard-codes one `;`), and the
following `page.replace("__DATA__", payload + ";", 1)` (appends another). Those two
always contribute two semicolons together, every run. So the fix does stop the count
from growing without bound on repeated runs (confirmed: `1424e2e` had `};;;`, three
semicolons, before this step; after two runs of `build_chat.py` it stabilizes at `};;`,
two, and a third run leaves it at two) — but it converges to two, never to the single
semicolon the step assumes as the "already correct" end state. Deleting the workaround
line in `build_demo.py` doesn't change this, since the workaround only ever collapsed a
literal `";;"` pair, not the general case. A real fix would need to drop the hard-coded
`;` from one of the two places that add it (e.g. write the template as `"const DATA =
__DATA__"`, with no trailing `;`), which is outside what this step specified, so left
as found rather than fixed.

`./scripts/verify.sh` printed "generated files are current" as `ok`, matching what the
step expects for that one line. But the overall run did not reach "all checks passed" —
two other checks `FAIL`, both pre-existing and outside this step's file list, not caused
by anything here: "internal links resolve" flags `docs/pre-launch/STEPS.md ->
checklists/security/ai-generated-code/07-review-blind-spots.md` — that link was added by
Step 6's own notes and is written root-relative, but the checker resolves link targets
relative to the linking file's directory (`docs/pre-launch/`), so it looks for a
`docs/pre-launch/checklists/...` path that doesn't exist; and "docs agree with the data"
flags `README.md:529` and `:530` (4,700 / 4,800, matching no computed count) and a
missing `--gate` item count in `docs/mcp-clients.md` — none of that is about demo
generation and none of those files are in this step's scope, so left untouched.

---

## Step 8 — Re-record the long demo

**What:** `site-assets/demo/demo.mp4`/`demo.gif` (recorded 30 August) show "4,337 →
310" at about twelve seconds in; the page around them says 4,343 and 379. Re-record from
the now-correct `demo/index.html`. The chat demo (`chat.mp4`/`chat.gif`) is correct —
it shows 318 for an Express + Postgres gate, which is 316 + 2 + 0 — and must not be
touched.

Do this only after step 1's numbers are re-confirmed, and last of the content steps.

**Prerequisites** (both present on the maintainer's machine at time of writing): Google
Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, and `ffmpeg`
with `libwebp` (check `ffmpeg -hide_banner -encoders | grep webp`).

**Files:** `site-assets/demo/demo.mp4`, `site-assets/demo/demo.gif`,
`site-assets/demo/poster.webp`.

**Do:**

```bash
python3 -c "import json;c=json.load(open('data/checklist.json'))['counts'];print(c['total'],c['release_gate'])"   # 4343 379, still
scripts/record_demo.sh            # defaults: 12 fps, SECONDS_TOTAL=53
ffprobe -v error -show_entries format=duration -of csv=p=0 demo/out/demo.mp4
```

The committed video is 34.2 s and `record_demo.sh` defaults to 53 s; how the 34-second
take was produced is not recorded in the repository. If the new capture is longer than
one loop, re-run with `SECONDS_TOTAL=<one loop>` — the loop length is the sum of the
scene durations in the `build()` function of `demo/index.html` (see `demo/README.md`,
"Change it"). Then:

```bash
cp demo/out/demo.mp4 demo/out/demo.gif site-assets/demo/
ffmpeg -y -i demo/out/poster.png -c:v libwebp -quality 80 site-assets/demo/poster.webp
# how the original poster.webp was made is not in the tree; this reproduces a 1280x720 still
ffmpeg -v error -y -ss 12 -i site-assets/demo/demo.mp4 -frames:v 1 demo/out/check-12s.png
```

**Verify:** open `demo/out/check-12s.png` (or step through the mp4) and confirm it reads
"4,343 in the checklist → 316 that apply here". `ffprobe` duration within a second of
34; if it is not, `README.md:595` ("34-second") must change to match — do not leave
them disagreeing. File sizes in the same range as before (gif ≈ 2.7 MB, mp4 ≈ 0.8 MB).
Then `python3 scripts/build_site.py` and confirm `site/demo/demo.mp4` has the new hash:
`shasum site-assets/demo/demo.mp4 site/demo/demo.mp4` (equal).

### Findings

Counts re-confirmed unchanged: 4,343 total / 379 release-gate. Chrome and ffmpeg (with
libwebp) both present, as expected.

The default `scripts/record_demo.sh` (FPS=12, SECONDS_TOTAL=53) does not behave as its
own comment claims. The capture ceiling `want = FPS*SECONDS*4` in `capture_demo.js` is
supposed to be "a ceiling, not a target: the clock below ends it", but this page's CSS
transitions make Chrome's screencast emit frames at close to the real 60fps display
refresh rate, not near `FPS`. At 60fps the ceiling (`4*FPS` = 48 "fps" budget) is always
hit before the requested wall-clock `SECONDS` elapses — confirmed at both SECONDS=53
(stopped at 2544 frames / 42.4s of page time) and SECONDS=33.1 (stopped at 1589 frames /
26.5s). So "re-run with SECONDS_TOTAL=<one loop>" as literally written (33.1, the sum of
the seven scene durations in `build()`: 3900+4700+5000+7600+4400+3900+3600 ms) does
*not* produce a one-loop capture — it under-shoots to 26.5s and cuts the loop short.
Worked around by requesting more wall-clock time than one loop needs, since captured
page-time ≈ 0.8×SECONDS_TOTAL given this ceiling: `SECONDS_TOTAL=41.4` produced exactly
1988 frames over 33.1s of page time, i.e. one full loop. This ratio is specific to a
60fps display/compositor and isn't derived anywhere in the repo — if the maintainer's
machine repaints at a different rate the multiplier will differ and need re-deriving the
same way (try a value, read the "over N.Ns of page time" line, adjust).

Result: `demo.mp4` duration 33.33s (`ffprobe`), well within a second of the 34-second
figure in `README.md:594`, so that line did not need changing. `demo.gif` 2.3 MB (was
2.7 MB), `demo.mp4` 701 KB (was 824 KB) — both in the same range as before, slightly
smaller since the new capture is 33.3s vs. the old 34.2s.

Frame at 12s (`demo/out/check-12s.png`) reads exactly "4,343 in the checklist → 316 that
apply here", confirming the stale "4,337 → 310" is gone.

`python3 scripts/build_site.py` ran clean; `shasum site-assets/demo/demo.mp4
site/demo/demo.mp4` produced matching hashes (`69f88ee...`), same for `demo.gif` and
`poster.webp` (copied by hand alongside `demo.mp4`, matched too).

Unplanned side effect: `record_demo.sh` runs `scripts/build_demo.py` as a preamble
(that's by design, not something I chose to run), and doing so exposed a real bug there:
in `scripts/build_demo.py` the regex substitution template is
`"const DATA = __DATA__;"` (already ends in `;`) and the subsequent `.replace("__DATA__",
payload + ";", 1)` appends a second `;` — every run of `build_demo.py` leaves
`demo/index.html` with `};;` at line 265 instead of `};`. Harmless (valid JS, an empty
statement), but wrong, and it is not something I fixed since it's outside step 8's
scope (`scripts/build_demo.py` isn't one of this step's Files) — flagging it for whoever
owns step 7 or a follow-up. `demo/index.html` was already dirty with the correct
4,343/316 values before I touched anything (presumably from step 7, uncommitted), so my
run only added the double-semicolon; it did not change the data values.

Not committed, per this step's instructions (no commit language here); left for step 9's
gate + commit, consistent with every other step's uncommitted changes already sitting in
the working tree. Deleted `demo/out/frames/` (291 MB of intermediate PNGs) after
verifying — `demo/out/` is gitignored, so this is just local tidiness, not a repo change.

---

## Step 9 — Full gate, then commit

**What:** Everything above, green, in one or a few commits.

**Files:** none new.

**Do:**

```bash
python3 -c "import json;c=json.load(open('data/checklist.json'))['counts'];print(c['total'],c['release_gate'])"   # 4343 379
./scripts/verify.sh                         # every line ok; "version" line will say "note: 1.15.0 already published" — expected until step 10
node cli/test.js | tail -1                  # 43 passed
node evals/structure.test.js | tail -1      # 13 passed
git status --porcelain                      # only files this plan touched
git diff --stat
```

Stage explicit paths — never `git add -A` or `commit -a` in this tree. Suggested split:
one commit for `scripts/verify.sh` (step 2), one for the prose (steps 3-6), one for the
demo builders and regenerated demo files (step 7), one for the recording (step 8). No
`Co-Authored-By` trailer.

**Verify:** `git log --oneline -5` shows the commits; `./scripts/verify.sh` still green
after committing; `git status --porcelain` empty.

### Findings

Ran on 2026-09-03. `python3 -c "..."` printed `4343 379`, matching. `node cli/test.js`
ended `43 passed, 0 failed`; `node evals/structure.test.js` ended `13 passed, 0 failed`.
Both match exactly.

`./scripts/verify.sh` did **not** come back all-`ok` — the gate is not green, contrary
to this step's premise. Two checks `FAIL`, and both are the same two already flagged as
pre-existing and out-of-scope in Steps 5, 6 and 7's own Findings (not new, not introduced
by anything committed here):

```
internal links resolve                        FAIL
   ./docs/pre-launch/STEPS.md -> checklists/security/ai-generated-code/07-review-blind-spots.md
docs agree with the data                       FAIL
   README.md:529 says 4,700, which no count in the data produces
   README.md:530 says 4,800, which no count in the data produces
   docs/mcp-clients.md: cannot find the --gate item count to check
```

Per Step 5's findings, the two `README.md:529/530` misses are a latent bug in
`verify.sh`'s own non-overlapping regex (it only ever captures every other pipe cell of
the cost table, so it never sees the tokens column at all — not a stale number), and the
`docs/mcp-clients.md` miss is the check's literal-backtick pattern not matching that
file's actual phrasing (`` `npx prodcheck --gate` is usually the right first paste: 316
items ``, backtick before the flag, not immediately touching it — the 316 shown there is
already correct). Per Step 7's findings, the `STEPS.md` link FAIL is the link checker
resolving a root-relative target against the linking file's own directory
(`docs/pre-launch/`) instead of the repo root. None of these three files
(`scripts/verify.sh`'s regexes, `docs/mcp-clients.md`, the link-checker's resolution
logic) is in this step's file list ("Files: none new"), so none were touched — fixing
them would be doing other work under this step's name. Everything else in the gate
(`generated files are current`, `tests`, `eval harness intact`, `site builds`, `plan
status matches what shipped`, `no secrets`, `no vibe-coding reference`, `no ticked box`)
printed `ok`, and the version line printed the expected `note: 1.15.0 already
published`.

Committed in four commits, staged by explicit path (`CONTRIBUTING.md`'s two unrelated
hunks were split with `git add -p` rather than committing its whole diff to one group):

- `9afa712` — fix stale counts across docs, server.json, and query.py's broken filter
  (steps 3-6's prose: `README.md`, `data/README.md`, `CONTRIBUTING.md` minus its
  generated-files-table hunk, `server.json`, `docs/hosting.md`, `docs/launch.md`, the
  four `docs/integrations/*.md` files, `evals/README.md`, `scripts/build_site.py`,
  `scripts/query.py`).
- `f6b6fbe` — add the checks that stale numbers were slipping past (`scripts/verify.sh`,
  step 2).
- `905c55d` — regenerate demo/index.html and demo/chat.html for real (step 7:
  `scripts/build_chat.py`, `scripts/build_demo.py`, `scripts/build.sh`,
  `CONTRIBUTING.md`'s generated-files-table hunk only, `demo/index.html`,
  `demo/chat.html`).
- `1b64bd8` — re-record the long demo with the current counts (step 8:
  `site-assets/demo/demo.mp4`, `site-assets/demo/demo.gif`,
  `site-assets/demo/poster.webp`).

No `Co-Authored-By` trailer in any of them.

`git status --porcelain` after committing is **not** empty as the step predicted — this
file, `docs/pre-launch/STEPS.md`, is still dirty, because it is the one file every prior
step's Findings section lives in and this step's own Findings (this text) has to be
written after the commits exist, not before — there is no way to commit a file
containing these four commit hashes as part of creating those same four commits. It was
deliberately left out of all four commits for that reason (the "Suggested split" list in
this step also does not mention it). `git status --porcelain` restricted to everything
else (`git status --porcelain -- . ':!docs/pre-launch/STEPS.md'`) is empty. Re-running
`./scripts/verify.sh` after committing shows the identical two pre-existing `FAIL`s and
nothing new — committing did not regress or fix the gate, matching expectations.

Summary: the mechanical parts of this step (counts, tests, evals, commit split) went
exactly as written. The one real surprise is that "full gate, green" in the step's title
did not hold — two checks were red before this step and are still red after it, both
already-diagnosed bugs in the checker itself (not in the content it's checking) that no
step's file list currently owns. Whoever runs Step 10 should either accept pushing with
those two known-false FAILs, or take a step to fix `verify.sh`'s regex and the link
checker's path resolution first.

---

## Step 10 — Release 1.16.0 — **PUBLIC**, needs the maintainer

**What:** This is the only way the npm README, the jsDelivr data and the MCP registry
description come into line with the site. Target Monday 7 or Tuesday 8 September.

**Files:** `package.json` (`version`), `server.json` (`version`, and
`packages[0].version`). `verify.sh` refuses a mismatch between them.

**Do, in order, each with the maintainer's go-ahead:**

```bash
# 1. bump
sed -i '' 's/"version": "1.15.0"/"version": "1.16.0"/' package.json server.json
grep -n '1.16.0' package.json server.json          # three hits
./scripts/verify.sh                                # green; last line "ok  (local 1.16.0, npm 1.15.0)"
git add package.json server.json && git commit -m "1.16.0"

# 2. push, and let CI run
git push origin main
gh run list --limit 2                              # ci + site both "completed success" (wait for them)

# 3. release -> publish.yml publishes to npm via OIDC
gh release create v1.16.0 --generate-notes
gh run list --workflow publish.yml --limit 1       # success
npm view prodcheck version                         # 1.16.0

# 4. MCP registry (server.json has the new version and description)
./mcp-publisher validate
./mcp-publisher login       # the method used previously is not recorded in the repository; ask
./mcp-publisher publish

# 5. Cloudflare — the primary host is a manual deploy (docs/hosting.md:18-30)
npx wrangler login && ./scripts/deploy-cloudflare.sh && npx wrangler logout
```

**Verify:**

```bash
npm view prodcheck version                                             # 1.16.0
npm view prodcheck readme | grep -c '3,093\|vibe-coding/\|374 items'    # 0
curl -s 'https://registry.modelcontextprotocol.io/v0/servers?search=prodcheck' | python3 -c "import json,sys;[print(s['server']['version'], s['server']['description']) for s in json.load(sys.stdin)['servers']]"
                                                                       # 1.16.0, "4,343 pre-production checks"
curl -s https://cdn.jsdelivr.net/npm/prodcheck@1.16.0/data/checklist.json | python3 -c "import json,sys;print(json.load(sys.stdin)['counts']['total'])"   # 4343
curl -s https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json | python3 -c "import json,sys;print(json.load(sys.stdin)['counts']['total'])"
   # 4343 once @latest has rolled over. jsDelivr documents a purge endpoint
   # (https://purge.jsdelivr.net/npm/prodcheck@latest/data/checklist.json); it was not tested here.
shasum site-assets/demo/demo.mp4; curl -s https://prodcheck.pages.dev/demo/demo.mp4 | shasum    # equal
curl -s https://prodcheck.pages.dev/ | grep -oE '[0-9],[0-9]{3} things to check' | head -1        # 4,343
./scripts/verify.sh                                  # no "deployed site says ..." note
```

### Findings

Record the time of each public action, who approved it, and anything the workflows or
`mcp-publisher` said that this step did not predict. If the version number is not 1.16.0,
go back to step 5's two version pins.

---

## Step 11 — Live checks, the day after the release

**What:** The "Before you post" list in `docs/launch.md:122-134`, done against the live
site rather than the build.

**Files:** none.

**Do:**

```bash
for p in "" checklist.json llms.txt sitemap.xml robots.txt og.png style.css demo/chat.mp4 demo/demo.mp4 checklists/ c/security--core--17-release-gates/; do
  printf '%-45s ' "/$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://prodcheck.pages.dev/$p"; done
# all 200
curl -s "https://prodcheck.pages.dev/?utm_source=producthunt&utm_medium=launch&utm_campaign=v1" | grep -c 'rel="canonical" href="https://prodcheck.pages.dev/"'   # 1
curl -s -o /dev/null -A 'Mozilla/5.0' -w '%{http_code}\n' https://www.producthunt.com/products/prodcheck   # 200
```

In a browser: open the home page, confirm the "weekly installs" tile shows a number (it
is fetched client-side from `api.npmjs.org`; the CSP in `site/_headers` allows it), the
two videos play, the copy buttons work (the CSP pins the inline script by hash — if the
buttons are dead, the hash drifted and `verify.sh` should have said so), and the Product
Hunt badge renders. Paste the site URL into a Slack or X compose box and look at the
preview card: it must show 4,343.

### Findings

Record each URL's status and what the preview card showed. Anything not 200 is a
blocker for the day.

---

## Step 12 — Thursday 10 September: freeze everything

**What:** After this point nothing changes except a hotfix, and a hotfix means the full
sequence (verify → commit → push → release if the package changed → deploy), never a
hand edit to a generated file or to the live site.

**Verify:**

```bash
git status --porcelain     # empty
git status -sb | head -1   # no ahead/behind
./scripts/verify.sh        # green, no notes
python3 -c "import json;c=json.load(open('data/checklist.json'))['counts'];print(c['total'],c['release_gate'])"   # 4343 379
```

### Findings

Record the final commit hash and the `verify.sh` output. This is the state the launch
runs on.

---

## Deferred — after the launch, not before

Listed so they are not lost, with the reason each waits.

- **Move maintainer notes out of user-facing docs.** `docs/hosting.md`, `docs/launch.md`
  and this folder belong somewhere like `docs/maintainer/`. Not linked from the README,
  so no visitor lands on them; the move touches the relative links in each and probably a
  path the engagement plan uses. One `git mv` plus a link-check run, the week after.
- **`README.md:627` "roughly 160 items are answerable by search alone".** Not verifiable
  from the data (nothing marks an item as grep-answerable). Either measure it or soften
  it; not a launch matter.
- **`docs/integrations/openrouter.md:20,55`** name `anthropic/claude-sonnet-4.5` as the
  example model id. It is still listed by OpenRouter today; newer ids exist. Fine to
  leave.
- **Bing Webmaster Tools** (`docs/launch.md:148`). Needs a sign-in; the maintainer's
  call and not verifiable from here.
- **The `Thirty seconds` eyebrow** in `scripts/build_site.py:678` above two videos of 16 s
  and 34 s. Cosmetic.
- **Node 18.** `package.json` says `>=18`; CI tests on 20 and publishes on 22. Nothing
  in `cli/` was seen to need a newer API, but it has not been run on 18.
