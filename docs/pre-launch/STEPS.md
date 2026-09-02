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

Record the actual output of each command, especially any that did not match.

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

Note who agreed to the freeze and when. If an item change becomes unavoidable, record it
here with the commit hash.

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

Paste the red output. List any complaint that was unexpected, and any expected complaint
that did not appear.

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

Record every line you changed and any replacement fact you could not confirm. If you
found a stale number this table missed, say which.

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

Note whether the maintainer's Product Hunt engagement plan carries its own copy of these
numbers somewhere outside the repository; if so, say where, so it gets the same fix.

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

List every edit made, plus any number in these files that was stale but not in the list
above.

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

Record which option was chosen, by whom, and the issue numbers if A.

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

Record whether the second run of `build.sh` was a no-op. If `verify.sh` reverted anything
you edited by hand, say what.

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

Record the duration, the sizes, what the frame at 12 s actually showed, and the exact
`SECONDS_TOTAL` that produced one loop.

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

Paste the final `verify.sh` output. Note the commit hashes.

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
