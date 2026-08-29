---
name: prodcheck-review
description: Review this codebase against the prodcheck pre-production checklists — security, performance, scale, integrations and post-launch readiness. Use when asked to check whether a project is ready to ship, to audit an area before launch, or to work through a specific checklist. Produces evidence with file:line citations, never a verdict.
---

# Reviewing a codebase against prodcheck

You are checking a real codebase against a checklist of 4,000+ items. The value of this
work is entirely in whether the findings are true. A confident wrong answer is worse than
no answer, because it will be believed and the underlying problem will ship.

Read the three rules before doing anything else. They are not style guidance.

---

## The three rules

### 1. You never mark an item verified

You produce **evidence**, not verdicts. Every item you look at ends in one of exactly
three states:

| State | Meaning | When |
| --- | --- | --- |
| `FINDING` | You found a specific problem | You can cite the file and line that is wrong |
| `UNKNOWN` | You could not determine this | Anything you did not fully establish |
| `N/A` | The item cannot apply here | You can say *why* — "no mobile client in this repo" |

There is no "pass", "verified", "looks fine" or `[x]`. Those are a human's to write, after
reading your evidence. If you find yourself wanting a fourth state, the answer is
`UNKNOWN`.

### 2. Every finding cites file and line

A finding without `path/to/file.ext:42` is not a finding, it is a guess. Quote the two or
three lines that show the problem. If you cannot point at the code, you have an `UNKNOWN`.

Write it **exactly as `path/from/repo/root.ext:42`** — relative to the repository root, no
absolute path, and never abbreviated with `...`. A citation a reader cannot open is not a
citation, and shortening the path for readability is the most common way it happens.

Before writing a citation, **re-read that exact line** and confirm it says what you are
about to claim. Citations that turn out to be wrong destroy trust in the whole report
faster than missing findings do.

### 3. `UNKNOWN` is a real answer and must stay visible

Most items on a large checklist cannot be settled by reading code — they depend on
production configuration, a provider's dashboard, or a decision nobody wrote down.

Saying so is the correct output. Do not convert `UNKNOWN` into a pass because the codebase
"looks like" it does the right thing, and do not quietly drop the item. The `UNKNOWN` list
is often the most useful part of the report: it is the list of things a human has to go
and look at.

---

## Procedure

### Step 1 — Scope it, and say what you assumed

Work out what this project actually is before pulling any items:

* Language and framework — from `package.json`, `requirements.txt`, `go.mod`, `Gemfile`,
  `pom.xml`, `composer.json`, `pubspec.yaml`, `*.csproj`.
* Where it runs — `Dockerfile`, `fly.toml`, `vercel.json`, `wrangler.toml`, CI workflows,
  Terraform.
* What it does — look for file upload handling, webhook receivers, background jobs,
  multi-tenancy, payments, an LLM or agent surface, a mobile client.

State the profile you inferred **and how confident you are**. If you cannot tell whether
the project is multi-tenant, say so; that single fact changes hundreds of items.

Never invent a stack to make the checklist fit.

### Step 2 — Pull the right items

If the **prodcheck MCP server** is available, use it:

* `list_checklists` — see what exists
* `checklist_for_stack` — items for this project, with `domains` and `stacks`
* `release_gate` — the blocking subset, best first pass
* `search_checklist` — one topic

Otherwise use the CLI:

```bash
npx prodcheck security --stack django --format json
npx prodcheck --gate --format json
npx prodcheck security --area ai --format text
```

Or fetch the data directly:
`https://prodcheck.pages.dev/checklist.json`

**Do not pull all 4,000 items.** Pick one checklist, or the release gate, and finish it.
A complete pass over 40 items beats a shallow skim of 400.

### Step 3 — Review in passes

Start with `--gate` — the release blockers. If one of those is a real finding, it matters
more than anything else you might find.

Then work one checklist at a time, in this order unless asked otherwise:

1. `security/core/02-authorization` — where most exploitable bugs actually are
2. `security/core/17-release-gates` — including the "must not exist" search
3. Whatever matches what the project does — the AI checklists if it ships an agent, the
   database checklist if it is data-heavy
4. `post-launch/01-readiness` — is a response prepared

For the "must not exist" items, **actually run the search**. Do not reason about whether a
pattern is likely to be present.

### Step 4 — Verify before you write

For every finding, before it goes in the report:

* Re-read the cited line. Does it still say what you think?
* Is there a control elsewhere that already handles this? Check the middleware, the base
  class, the framework default, the edge configuration. A finding that ignores an existing
  mitigation is a false positive.
* Could you argue the opposite? If a competent engineer would push back, either strengthen
  the evidence or downgrade it to `UNKNOWN`.

Deleting your own weak findings is the highest-value thing you do in this whole procedure.

### Step 5 — Write the report

Write to `PRODCHECK-REVIEW.md` in the repository root. Never edit the checklists
themselves — they are the source, not the worksheet.

Use exactly this shape:

```markdown
# prodcheck review — <date>

**Scope:** <what you reviewed — which checklists, how many items>
**Profile:** <stack and features you inferred, and your confidence>
**Not covered:** <what you did not look at, and why>

## Findings

### 1. <One sentence: what is wrong>
- **Item:** `<item id from the data>` — <item text>
- **Where:** `path/to/file.ext:42`
- **Evidence:**
  ```<lang>
  <the two or three lines that show it>
  ```
- **Why it matters:** <the concrete consequence, not the category name>
- **Suggested fix:** <what to change>

## Unknown — needs a human

| Item | Why it could not be determined |
| --- | --- |
| `<id>` — <text> | Depends on the production Cloudflare configuration |

## Not applicable

| Item | Why |
| --- | --- |
| `<id>` — <text> | No mobile client in this repository |
```

Order findings by consequence, not by checklist order. If the report has no findings, say
that plainly and make the `UNKNOWN` list the body of it — that is an honest and useful
result, and padding it with weak findings is not.

### Step 6 — Re-open every citation, after writing

This is a separate pass, and it has to happen **after** the report exists. Checking as you
write is what produced the citations you are now checking; the point of a second pass is
that it does not share the first one's assumptions.

For every citation in the finished file:

1. Open that file at that line.
2. If the file or line does not exist — fix the citation, or the finding is not a finding.
3. If the line does not support the claim, the claim is wrong. Correct it or downgrade it
   to `UNKNOWN`.

Then end the report with one line, in this exact form, so the reader knows it happened:

```
Citations re-checked: <n> of <n>. <m> corrected.
```

If `m` is zero, say zero. If you did not do this pass, do not write the line — an
unearned claim of verification is the exact failure this whole procedure exists to
prevent, and writing it falsely is worse than any missed finding.

### Step 7 — Hand it over

Tell the user, in the chat:

* how many items you covered, out of how many in scope
* the count in each state
* how many citations you re-checked, and how many you corrected
* the single thing you would fix first, and why
* that **nothing has been marked verified**, because that is theirs to do

---

## What not to do

* Do not edit files under `checklists/` — that is the checklist, not your worksheet.
* Do not mark anything `[x]`.
* Do not report an item as a finding when you have not read the relevant code.
* Do not summarise a checklist back to the user instead of checking it. They can read it.
* Do not review the whole checklist in one pass and produce forty shallow findings. One
  checklist, done properly.
* Do not treat "the tests pass" or "the framework handles it" as evidence. Show the code
  that handles it.
* Do not fix what you find in the same pass unless asked. Findings and fixes are separate
  work, and mixing them means neither gets reviewed properly.

---

## Why the constraints

This checklist contains a folder, `security/ai-generated-code/`, about the bugs AI coding
assistants write — and a section in it on why AI review misses them. The pattern it
describes is that a model reviewing code produces fluent, plausible, confident output
whether or not it actually established anything.

You are the thing that folder is about. The three rules exist so your output stays useful
anyway: evidence a human can check, citations that can be verified, and an honest account
of what you could not determine.

## What is actually known about this skill

Stated here because a skill about not overclaiming should not overclaim about itself.

**Tested:** Claude, through the Claude Code agent, on a 50-line fixture with nine planted
defects and on an inert module with none. The skill triggered on all three natural
phrasings tried — *"is this ready to ship?"*, *"we launch next week, can you review this?"*,
*"check this for security problems"* — without prodcheck being named. Every planted defect
was found in every run, and no run wrote a verdict.

Citations did not start out clean: before Step 6 existed, two runs in three shipped a
citation a reader could not open. With the step, two runs re-checked 21 and 25 citations,
corrected 0 and 5, and left none broken.

**Not tested:** any other model. Any real codebase — the fixture is fifty lines of
textbook defects and real code is not like that. Whether the numbers hold across many
runs. Treat the results as an optimistic ceiling.

**Measured, not assumed:** a capable model reaches for an "unknown" section and says
nothing was verified *without any skill loaded*. Those two habits are not what this adds.
What the control run did not do was name the three states, declare the profile it
inferred, or list what it ruled out and why.

The harness is in [`evals/`](https://github.com/FarzamHabibi/pre-production-checklist/tree/main/evals),
including the four defects it found in itself.

Learn more: https://prodcheck.pages.dev
