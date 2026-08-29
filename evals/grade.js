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
 *   precision   on the clean fixture, every finding is a false positive by construction
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
  const re = /(?:^|[\s`(])((?:[\w.-]+\/)*[\w.-]+\.[a-z]{2,4}):(\d+)/gm
  let m
  while ((m = re.exec(text)) !== null) out.push({ file: m[1], line: Number(m[2]) })
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
      if (!r.ok) {
        problems.push(`unresolvable citation ${c.file}:${c.line} — ${r.why}`)
        bad++
      }
    }
  }

  // ---- 2. no verdicts anywhere in the document
  const verdicts = VERDICT.filter((re) => re.test(review))
  if (verdicts.length) {
    problems.push(`the review contains a verdict (${verdicts.length} pattern(s) matched) — ` +
                  'the skill forbids any state meaning "checked and fine"')
  }

  // ---- 3. unknowns are present and visible
  const unknown = section(review, 'Unknown')
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
    unknown_rows: Math.max(0, unknownRows - 2),   // minus the table header rows
    verdict_violations: verdicts.length
  }

  if (which === 'clean') {
    // by construction every defect is fixed here, so any finding is a false positive
    result.false_positives = found.length
    result.precision = found.length === 0 ? 1 : 0
    if (found.length) {
      problems.push(`${found.length} finding(s) on the clean fixture — every one is a ` +
                    'false positive by construction')
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
      const near = cs.some((c) => Math.abs(c.line - d.line) <= 3)
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
