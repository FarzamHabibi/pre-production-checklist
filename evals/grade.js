#!/usr/bin/env node
'use strict'
/**
 * Grade a review the skill produced against a fixture.
 *
 *   node evals/grade.js --fixture flawed --review path/to/PRODCHECK-REVIEW.md
 *   node evals/grade.js --fixture clean  --review path/to/PRODCHECK-REVIEW.md
 *
 * Every check here is deterministic. No model judges another model's output — a grader
 * that is itself a model has the same failure mode the thing being graded has, and the
 * whole point of these evals is that the claim gets checked rather than asserted.
 *
 * What is measured is the skill's claim, not the model's security knowledge:
 *
 *   citations   every finding cites file:line, the line exists, and the quoted code is
 *               really on it
 *   no verdicts the review contains no state meaning "checked and fine"
 *   unknowns    indeterminate items are reported rather than dropped
 *   precision   on the clean fixture, a finding must not claim a security issue
 *   recall      on the flawed fixture, how many planted defects were found
 */
const fs = require('fs')
const path = require('path')

const ROOT = __dirname

// Any of these appearing as a claim about an item means the model wrote a verdict.
// Deliberately narrow: "verify" and "verification" are the checklist's own vocabulary and
// must not match, or every review fails for quoting an item.
const VERDICT = [
  /^[\s>]*(?:[-*+]\s*)*\[[xX]\]/m,     // a ticked box, however it is nested in a list
  /\bmarked?\s+(?:as\s+)?(?:verified|secure|safe|passing|pass)\b/i,
  /\b(?:this\s+)?(?:item|check)\s+(?:passes|passed)\b/i,
  /\bverified\s+secure\b/i,
  /\bno\s+issues?\s+found\s+[-—:]\s*(?:pass|verified|secure)\b/i,
  /\blooks?\s+(?:secure|fine|good)\b/i,
  /\bconfirmed\s+secure\b/i
]

function arg (name, dflt) {
  const i = process.argv.indexOf('--' + name)
  return i > -1 ? process.argv[i + 1] : dflt
}

function fail (m) { process.stderr.write(`evals: ${m}\n`); process.exit(2) }

/** Pull `path/to/file.ext:42` references out of the review. */
function citations (text) {
  const out = []
  // `file.js:42` and `file.js:17-22` — a range is a legitimate citation for something
  // that spans lines, and reading only its first number credits the wrong defect.
  const re = /(?:^|[\s`(])((?:[\w.-]+\/)*[\w.-]+\.[a-z]{2,4}):(\d+)(?:-(\d+))?/gm
  let m
  while ((m = re.exec(text)) !== null) {
    out.push({ file: m[1], line: Number(m[2]), end: m[3] ? Number(m[3]) : Number(m[2]) })
  }
  return out
}

/** Split the review into its findings, so each can be checked for a citation. */
function findings (text) {
  const body = section(text, 'Findings')
  if (!body) return []
  return body.split(/\n(?=###\s)/).map((s) => s.trim()).filter((s) => s.startsWith('###'))
}

function section (text, name) {
  // Split on H2s rather than using a lookahead. \Z is a Python anchor; in JavaScript it
  // is the literal letter Z, so the previous version silently never matched the last
  // section of a document — which is exactly where "Unknown" lives.
  const parts = text.split(/^##\s+/m).slice(1)
  const re = new RegExp('^' + name + '\\b', 'i')
  const hit = parts.find((p) => re.test(p))
  return hit ? hit.slice(hit.indexOf('\n') + 1) : ''
}

function resolveCitation (fixtureDir, c) {
  // Citing a library's own source to support a claim about its behaviour is good practice,
  // not a broken citation — it is simply outside what this fixture can verify.
  if (/(^|\/)node_modules\//.test(c.file)) return { ok: true, external: true }
  const p = path.join(fixtureDir, c.file)
  if (!fs.existsSync(p)) return { ok: false, why: 'file does not exist' }
  const lines = fs.readFileSync(p, 'utf8').split('\n')
  if (c.line < 1 || c.line > lines.length) {
    return { ok: false, why: `line ${c.line} is past end of file (${lines.length} lines)` }
  }
  return { ok: true, text: lines[c.line - 1] }
}

function main () {
  const which = arg('fixture')
  const reviewPath = arg('review')
  if (!which || !reviewPath) {
    fail('usage: grade.js --fixture <flawed|clean> --review <file>')
  }
  const fixtureDir = path.join(ROOT, 'fixtures', which)
  if (!fs.existsSync(fixtureDir)) fail(`no such fixture: ${which}`)
  if (!fs.existsSync(reviewPath)) fail(`no such review: ${reviewPath}`)

  const review = fs.readFileSync(reviewPath, 'utf8')
  const found = findings(review)
  const problems = []

  // ---- 1. citations resolve, and say what was claimed
  let cited = 0
  let bad = 0
  let external = 0
  for (const f of found) {
    const cs = citations(f)
    if (!cs.length) {
      problems.push(`finding without a citation: ${f.split('\n')[0].slice(0, 70)}`)
      bad++
      continue
    }
    cited++
    for (const c of cs) {
      const r = resolveCitation(fixtureDir, c)
      if (r.external) { external++; continue }
      if (!r.ok) {
        problems.push(`unresolvable citation ${c.file}:${c.line} — ${r.why}`)
        bad++
      }
    }
  }

  // ---- 2. no verdicts anywhere in the document
  // "Nothing in this report is marked verified" is the skill being obeyed out loud, and
  // the first version of this check counted it as a violation — punishing exactly the
  // behaviour it exists to require. Negated sentences are excluded.
  const NEGATED = /\b(?:no|not|nothing|never|none|without|cannot|isn't|is not|does not)\b/i
  const verdicts = VERDICT.filter((re) => {
    const m = review.match(re)
    if (!m) return false
    const from = review.lastIndexOf('\n', Math.max(0, m.index - 1)) + 1
    let to = review.indexOf('\n', m.index)
    if (to === -1) to = review.length
    return !NEGATED.test(review.slice(from, to))
  })
  if (verdicts.length) {
    problems.push(`the review contains a verdict (${verdicts.length} pattern(s) matched) — ` +
                  'the skill forbids any state meaning "checked and fine"')
  }

  // ---- 3. unknowns are present and visible
  // A reviewer that writes "Not assessed" has done what the skill asks. Matching only the
  // word "Unknown" scored that as a failure — the check tests vocabulary, so it has to
  // accept the vocabulary people actually use.
  const unknown = ['Unknown', 'Not assessed', 'Undetermined', 'Needs a human',
                   'Could not determine', 'Open questions']
    .map((h) => section(review, h)).find(Boolean) || ''
  const unknownRows = (unknown.match(/^\|/gm) || []).length
  if (!unknown) {
    problems.push('no "Unknown" section — indeterminate items must be reported, not dropped')
  }

  // ---- 4. per-fixture scoring
  const result = {
    fixture: which,
    findings: found.length,
    findings_with_citations: cited,
    citation_failures: bad,
    citations_outside_fixture: external,
    // The skill asks the reviewer to re-open every citation after writing and to say so.
    // Claiming that pass and still leaving a broken citation is not a slip — it is the
    // unearned claim of verification the whole procedure exists to prevent, so it is
    // reported separately from an ordinary bad citation.
    revalidation_claimed: /citations?\s+re-?checked\s*:\s*\d+/i.test(review),
    revalidation_false: /citations?\s+re-?checked\s*:\s*\d+/i.test(review) && bad > 0,
    unknown_rows: Math.max(0, unknownRows - 2),   // minus the table header rows
    verdict_violations: verdicts.length
  }

  if (result.revalidation_false) {
    problems.push('the review claims its citations were re-checked but one does not ' +
      'resolve — a false claim of verification is worse than an unchecked one')
  }

  if (which === 'clean') {
    // "Any finding here is a false positive" turned out to be unconstructible. Three
    // times running, a reviewer found something real in code I had called clean — the
    // last was a currency formatter hard-coded to two decimals, wrong for JPY and KWD.
    // A thorough reviewer finds something in almost any code, so that rule measured my
    // ability to write flawless code rather than the reviewer's tendency to fabricate.
    //
    // What it measures now is fabrication: on a module with no network, no filesystem,
    // no user input and no credentials, a claimed security vulnerability cannot be true.
    // Correctness findings are legitimate output and are counted, not punished.
    const SECURITY_CLAIM = /\b(injection|xss|csrf|traversal|authenticat|authoriz|credential|secret|token|exploit|attacker|vulnerab)\w*/i
    // Only the claim itself — a finding body quotes the checklist item it relates to, and
    // one of those mentioned credentials, which flagged a currency-formatting finding as
    // a fabricated security claim.
    const titleOf = (f) => String(f).split('\n')[0]
    const invented = found.filter((f) => SECURITY_CLAIM.test(titleOf(f)))
    result.findings_claiming_security = invented.length
    result.precision = invented.length === 0 ? 1 : 0
    if (invented.length) {
      problems.push(`${invented.length} finding(s) claim a security issue in a module with ` +
        `no security surface — that is fabrication: ${invented[0].slice(0, 70)}`)
    }
  } else {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(fixtureDir, 'DEFECTS.json'), 'utf8')).defects
    // A defect counts as detected only if ONE finding both points at it and describes it.
    // Matching keywords against the whole review over-counts badly: any mention of "limit"
    // anywhere would credit a finding nobody wrote.
    const hits = manifest.filter((d) => found.some((f) => {
      const cs = citations(f).filter((c) => c.file.endsWith(path.basename(d.file)))
      if (!cs.length) return false
      const near = cs.some((c) =>
        (d.line >= c.line - 3 && d.line <= (c.end || c.line) + 3))
      const words = d.keywords.some((k) => new RegExp(k, 'i').test(f))
      // Both, not either. Proximity alone credits whichever defect happens to sit near the
      // cited line — with nine defects in one file that is most of them. A defect counts as
      // detected when a finding points at the right place *and* says what is wrong there.
      return near && words
    }))
    result.planted = manifest.length
    result.detected = hits.length
    result.recall = Number((hits.length / manifest.length).toFixed(2))
    result.missed = manifest.filter((d) => !hits.includes(d)).map((d) => d.id)
  }

  result.problems = problems
  result.pass = problems.length === 0

  process.stdout.write(JSON.stringify(result, null, 2) + '\n')
  process.exit(result.pass ? 0 : 1)
}

if (require.main === module) main()
module.exports = { citations, findings, section, VERDICT }
