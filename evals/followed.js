#!/usr/bin/env node
'use strict'
/**
 * Did the review follow the skill, or did the model simply review well?
 *
 * From the outside those look alike, so this scores the parts of the procedure a good
 * reviewer would not produce by default. A capable model cites lines and finds real
 * defects whether or not a skill is loaded — the control run proved that. What it does
 * not do by default is name its three states, declare the profile it inferred, and list
 * what it ruled out and why. Measured, not assumed: the control run reached for an
 * "unknown" section and said nothing was verified without any skill loaded.
 *
 *   node evals/followed.js <review.md>
 *
 * Exits 0 either way. This is a measurement, not a gate: a review can be excellent
 * without having followed this particular procedure.
 */
const fs = require('fs')

// Each signal is something the skill asks for explicitly and a default review rarely does.
const SIGNALS = [
  {
    id: 'three-states',
    weight: 3,
    what: 'uses the skill\'s three states rather than severities',
    test: (t) => /\bUNKNOWN\b/.test(t) && (/\bFINDING\b/.test(t) || /\bN\/A\b/.test(t))
  },
  {
    id: 'unknown-section',
    weight: 3,
    what: 'reports what it could not determine instead of dropping it',
    test: (t) => /^#{1,4}\s*.*\b(unknown|not assessed|undetermined|needs? a human)\b/im.test(t)
  },
  {
    id: 'nothing-verified',
    weight: 3,
    what: 'states in writing that nothing was marked verified',
    test: (t) => /\b(nothing|none of (?:this|these|it)|no item)\b[^.]{0,80}\b(verified|marked)\b/i.test(t)
  },
  {
    id: 'scope-declared',
    weight: 2,
    what: 'declares the profile it inferred and what it did not cover',
    test: (t) => /^\s*\*?\*?(scope|profile|not covered|coverage)\b/im.test(t)
  },
  {
    id: 'na-with-reason',
    weight: 2,
    what: 'marks items not applicable with a reason rather than omitting them',
    test: (t) => /^#{1,4}\s*.*\bnot applicable\b/im.test(t)
  },
  {
    id: 'revalidation-declared',
    weight: 3,
    what: 'declares a second pass over its own citations',
    test: (t) => /citations?\s+re-?checked\s*:\s*\d+/i.test(t)
  },
  {
    id: 'item-ids',
    weight: 1,
    what: 'ties findings to checklist item ids',
    test: (t) => /\b(security|performance|scale|integrations|post-launch)\.[a-z0-9-]+\.[0-9a-f]{8}\b/.test(t)
  },
  {
    id: 'no-verdict',
    weight: 1,
    what: 'writes no ship/do-not-ship verdict',
    test: (t) => !/^#{1,4}\s*.*\bverdict\b/im.test(t) && !/\bdo not ship\b/i.test(t)
  }
]

function score (text) {
  const hits = SIGNALS.filter((s) => s.test(text))
  const got = hits.reduce((n, s) => n + s.weight, 0)
  const max = SIGNALS.reduce((n, s) => n + s.weight, 0)
  return {
    score: got,
    max,
    ratio: Math.round((got / max) * 100) / 100,
    // Calibrated against the runs that produced it: the skill runs matched six and five
    // signals, the control matched two — a capable reviewer does reach for an "unknown"
    // section and does say nothing was verified, without being told. What it does not do
    // is name the three states, declare its inferred profile, and list what it ruled out
    // and why. Three distinct signals is the line between them.
    followed: hits.length >= 3,
    matched: hits.map((s) => s.id),
    missed: SIGNALS.filter((s) => !s.test(text)).map((s) => ({ id: s.id, what: s.what }))
  }
}

if (require.main === module) {
  const f = process.argv[2]
  if (!f || !fs.existsSync(f)) {
    console.error('usage: node evals/followed.js <review.md>')
    process.exit(2)
  }
  console.log(JSON.stringify(score(fs.readFileSync(f, 'utf8')), null, 2))
}

module.exports = { score, SIGNALS }
