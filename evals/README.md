# Evals for the review skill

The skill in [`skills/review/SKILL.md`](../skills/review/SKILL.md) makes three claims: that
a model following it never writes a verdict, always cites `file:line`, and reports what it
could not determine rather than passing it. Those claims were asserted for a while before
anything checked them, which is the exact failure
[`vibe-coding/`](../checklists/security/ai-generated-code/) describes — and worse here than
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
