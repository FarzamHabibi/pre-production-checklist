# Evals for the review skill

The skill in [`skills/review/SKILL.md`](../skills/review/SKILL.md) makes three claims: that
a model following it never writes a verdict, always cites `file:line`, and reports what it
could not determine rather than passing it. Those claims were asserted for a while before
anything checked them, which is the exact failure
[`security/ai-generated-code/`](../checklists/security/ai-generated-code/) describes — and worse here than
anywhere, because the claim is the product.

## What is measured

Not whether the model is good at security. That is unmeasurable from here and is not the
claim. The claim is narrower and testable:

| Property | Failing looks like |
| --- | --- |
| Citations resolve | A `file:line` pointing past the end of a file, or at a file that does not exist |
| No verdicts | A `[x]`, "verified", "looks secure" — any state meaning *checked and fine* |
| Unknowns survive | No `Unknown` section, so indeterminate items were dropped |
| Precision | Any finding at all on the clean fixture |
| Recall | How many planted defects a review actually found |

**Precision matters more than recall.** A review with invented findings is worse than no
review: the reader spends their time disproving it, and stops trusting the parts that were
right.

## The fixtures

`fixtures/flawed/` is a small Express app with nine planted defects, each recorded in
`DEFECTS.json` with the file, the line and the vocabulary a real finding would use.

Two of them are **omissions** — a missing ownership check, a missing body limit — where the
flawed line is legitimate code that also appears in the fix. Those are marked `kind:
"omission"` and the control is checked for the fix being present rather than for the line
being absent.

`fixtures/clean/` is the same app with every defect fixed. Any finding there is a false
positive by construction, which is what makes precision measurable at all.

## Running them

```bash
npm run evals            # tier 1: structure, no model, runs in CI

# tier 2: a real review, which needs an agent
#   1. copy fixtures/flawed to a scratch directory
#   2. install the skill:  npx prodcheck init
#   3. ask your agent to review it
#   4. grade what it wrote:
node evals/grade.js --fixture flawed --review /path/to/PRODCHECK-REVIEW.md
node evals/grade.js --fixture clean  --review /path/to/PRODCHECK-REVIEW.md
```

## Why tier 2 is not in CI

Running a real agent against fixtures costs money and needs an API key. This repository has
neither and should not want either — a key in CI is a standing credential for a project
whose own checklist argues against exactly that. Tier 1 runs on every push; tier 2 is a
local command someone runs deliberately.

## The grader has no model in it

Every check in `grade.js` is deterministic: citations are resolved against the real file,
verdict phrasing is matched against a fixed list, unknowns are counted, findings on the
control are counted. **No model judges another model's output.** A grader that is itself a
model has the same failure mode as the thing it grades, which would leave the claim exactly
as unverified as it was before.

## What these evals do not tell you

* Whether the checklist items themselves are correct.
* Whether a real codebase behaves like a 40-line fixture. It does not.
* Whether the model would do as well on a language the fixture does not use.

A recall number here is a signal that the procedure works, not a promise about your
repository.

## What the first run found, and it was not what I expected

The first three runs against this fixture produced four corrections — three to the harness,
one to my own confidence. Recording them because they are the reason to have an eval at
all, and because a harness that has never been wrong has never been tested.

**Two of the nine planted defects were not defects.**

* `no body size limit` — `express.json()` already defaults to 100kb
  ([body-parser source](https://github.com/expressjs/body-parser/blob/master/lib/types/json.js):
  `102400 // 100kb default`). The absence I planted was not an absence.
* `debug enabled in production` — `config.js` was never imported by `app.js`, so the flag
  changed no behaviour at all.

Two independent agents caught both, and one of them also pointed out that a wildcard
`Access-Control-Allow-Origin` alongside `Allow-Credentials: true` is *rejected* by
browsers, so the consequence I had written into the fixture was wrong too. I verified all
three against the actual sources before accepting them.

The uncomfortable part: the run **without** the skill scored a perfect recall by repeating
the two claims that were false, and the run **with** the skill scored lower because it
correctly downgraded them to `UNKNOWN`. The metric was rewarding over-reporting against a
wrong answer key.

Both defects are real now — a `50mb` limit set explicitly, and a config module that is
actually imported and changes behaviour — and the answer key is derived from the `PLANTED:`
markers in the code rather than maintained beside it, with a test that fails if the two
ever disagree.

**Two grader bugs, both of which punished correct behaviour.**

* A review that said *"Nothing in this report is marked verified"* was flagged for
  containing a verdict. The check now ignores negated sentences.
* A citation of `src/app.js:17-22` was read as line 17 only, so a finding about line 21 was
  scored as missed. Ranges are honoured now.

**The fixture is easier than real code.** Nine textbook defects in fifty lines. Treat any
number from this harness as an optimistic ceiling, not a prediction of behaviour on a real
repository — and read `--json` output rather than the pass/fail line, because the
interesting signal is in the citation and unknown counts.

## The second run found more, including in the harness again

**The "clean" fixture was not clean.** It was a minimal Express app, and the run against it
produced eight findings that the grader counted as false positives by construction. Reading
them, they were not false: nothing authenticated a request while two routes read
`req.user.id`, Express 4 does not catch rejected promises from `async` handlers, `/download`
served files with no ownership check. A thorough reviewer *should* report those.

The false-positive test was therefore measuring the fixture, not the reviewer. It is a pure
arithmetic module now — integer minor units, no I/O, no network, no filesystem, no user
input, no dependencies. A finding against that really is a fabrication, which is the only
condition under which "any finding is a false positive" is a fair rule.

**Two more grader bugs, both punishing correct behaviour again.**

* A review with a `## Not assessed` section was scored as having no unknowns, because the
  check matched the literal word "Unknown". It matches the meaning now.
* Findings counted `###` headings, so a review that grouped by severity (`### Critical`,
  `### High`) scored three findings instead of the twenty beneath them.

**And one about how I work.** The first attempt at the unknown-section fix printed a
success message and changed nothing — the string it searched for was not in the file. I
reported it as done. The grep that would have caught it is two seconds of work, and every
edit here should end with one.

## Does the skill trigger, and is it stable?

Two questions the earlier rounds never touched. A skill nobody's phrasing activates is
inert, and a result from one run says nothing about the next.

**Trigger.** Three natural prompts, the skill installed, `prodcheck` never named:

| Prompt | Triggered | Procedure score | Recall |
| --- | --- | --- | --- |
| "is this ready to ship?" | yes | 14/15 | 9/9 |
| "we launch next week, can you review this?" | yes | 11/15 | 9/9 |
| "check this for security problems" | yes | 14/15 | 9/9 |

**Stability**, three runs of the identical prompt:

| | run 1 | run 2 | run 3 | |
| --- | --- | --- | --- | --- |
| triggered | yes | yes | yes | stable |
| followed the procedure | yes | yes | yes | stable |
| verdicts written | 0 | 0 | 0 | stable |
| planted defects found | 9/9 | 9/9 | 9/9 | stable |
| procedure score | 14 | 11 | 14 | varies |
| unknowns reported | 9 | 16 | 14 | varies |
| **unresolvable citations** | **0** | **1** | **1** | **varies** |

What the skill exists to guarantee held every time. The shape of the report varied, which
is fine. One thing did not: **two runs in three left a citation a reader could not open**,
usually by abbreviating a path for readability. The skill already said to re-read the line
before citing it, and saying it in a rule was not enough.

So the rule gained a format (`path/from/repo/root.ext:42`, never absolute, never `...`)
and the procedure gained a step: re-open every citation *after* the report is written,
because checking while writing is what produced the citations being checked. The reviewer
must then state `Citations re-checked: <n> of <n>. <m> corrected.`

That line is graded. A review that claims the pass and still leaves a broken citation is
reported separately from one that never claimed it — an unearned claim of verification is
the failure this entire procedure exists to prevent, so it cannot be the thing the harness
lets through.

### Did the step work

Two runs with the re-validation step in place, on the same fixture:

| | run A | run B |
| --- | --- | --- |
| citations written | 21 | 25 |
| re-checked, as declared | 21 | 25 |
| corrected on the second pass | 0 | 5 |
| unresolvable in the final report | 0 | 0 |

The zero that matters is the last row, and it is the row that was non-zero in two of the
three runs before the step existed. Run B is the more interesting one: five citations were
wrong when first written and right by the time the report was handed over, which is the
step doing exactly the work it was added for.

Two runs is not evidence that this holds generally. It is evidence that the step is not
decorative, on the one fixture, with one model.
