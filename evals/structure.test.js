#!/usr/bin/env node
'use strict'
/**
 * Tier 1 — structural checks that need no model, so they can run in CI on every push.
 * These do not measure whether the skill works. They measure that the things which
 * measure it are still wired up: that the fixtures match their manifest, that the grader
 * catches what it claims to, and that the skill still states the constraints being graded.
 */
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = __dirname
const GRADE = path.join(ROOT, 'grade.js')
let pass = 0
const fails = []

function test (name, fn) {
  try { fn(); pass++; console.log(`  ok  ${name}`) } catch (e) {
    fails.push(name); console.log(`  FAIL ${name}\n       ${e.message}`)
  }
}

function grade (fixture, body) {
  const tmp = path.join(require('os').tmpdir(), `pc-eval-${Date.now()}-${Math.random().toString(36).slice(2)}.md`)
  fs.writeFileSync(tmp, body)
  try {
    const out = execFileSync(process.execPath, [GRADE, '--fixture', fixture, '--review', tmp],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    return JSON.parse(out)
  } catch (e) {
    return JSON.parse(e.stdout)      // non-zero exit still prints the result
  } finally {
    fs.unlinkSync(tmp)
  }
}

console.log('\nevals — structure\n')

test('every planted defect points at a line that exists and still matches', () => {
  const dir = path.join(ROOT, 'fixtures', 'flawed')
  const { defects } = JSON.parse(fs.readFileSync(path.join(dir, 'DEFECTS.json'), 'utf8'))
  assert.ok(defects.length >= 5, 'too few defects to measure anything')
  for (const d of defects) {
    const lines = fs.readFileSync(path.join(dir, d.file), 'utf8').split('\n')
    assert.ok(d.line >= 1 && d.line <= lines.length,
      `${d.id}: line ${d.line} is outside ${d.file}`)
    assert.ok(d.keywords && d.keywords.length, `${d.id}: no keywords, so it can never be detected`)
  }
})

test('the clean fixture really is clean of what was planted', () => {
  const flawed = path.join(ROOT, 'fixtures', 'flawed')
  const clean = path.join(ROOT, 'fixtures', 'clean')
  const { defects } = JSON.parse(fs.readFileSync(path.join(flawed, 'DEFECTS.json'), 'utf8'))
  for (const d of defects) {
    const ctl = fs.readFileSync(path.join(clean, d.file), 'utf8')
    if (d.kind === 'omission') {
      // the flaw is the absence of a control, so the flawed line is often legitimate and
      // appears in the control too — check the fix is present instead
      assert.ok(d.clean_evidence && ctl.includes(d.clean_evidence),
        `${d.id}: the clean fixture does not show the fix (${d.clean_evidence})`)
      continue
    }
    const src = fs.readFileSync(path.join(flawed, d.file), 'utf8').split('\n')[d.line - 1].trim()
    assert.ok(!ctl.includes(src), `${d.id}: the clean fixture still contains the flawed line`)
  }
})

test('the grader rejects a citation pointing past the end of a file', () => {
  const r = grade('flawed', '## Findings\n\n### 1. Thing\n- **Where:** `src/app.js:9000`\n')
  assert.strictEqual(r.pass, false)
  assert.ok(r.problems.some((p) => /unresolvable citation/.test(p)), JSON.stringify(r.problems))
})

test('the grader rejects a finding with no citation', () => {
  const r = grade('flawed', '## Findings\n\n### 1. Something is wrong somewhere\n- no citation\n')
  assert.ok(r.problems.some((p) => /without a citation/.test(p)), JSON.stringify(r.problems))
})

test('the grader rejects a verdict', () => {
  for (const v of ['- [x] checked', '- Ownership checks look secure.', '- This item passes.']) {
    const r = grade('flawed', `## Findings\n\n### 1. Thing\n- **Where:** \`src/app.js:19\`\n${v}\n`)
    assert.ok(r.verdict_violations > 0, `not caught as a verdict: ${v}`)
  }
})

test('the grader does not mistake the checklist vocabulary for a verdict', () => {
  // "Verify …" is how every item in this repository is written; flagging it would fail
  // every honest review that quotes the item it is reporting against.
  const r = grade('flawed',
    '## Findings\n\n### 1. Thing\n- **Item:** Verify parameterised queries are used.\n' +
    '- **Where:** `src/app.js:19`\n\n## Unknown\n\n| a | b |\n| --- | --- |\n| x | y |\n')
  assert.strictEqual(r.verdict_violations, 0, 'flagged the word "Verify" as a verdict')
})

test('a finding on the clean fixture counts as a false positive', () => {
  const r = grade('clean', '## Findings\n\n### 1. SQL injection\n- **Where:** `src/app.js:19`\n')
  assert.strictEqual(r.false_positives, 1)
  assert.strictEqual(r.precision, 0)
})

test('an empty review of the clean fixture is a pass', () => {
  const r = grade('clean', '## Findings\n\nNone.\n\n## Unknown\n\n| a | b |\n| --- | --- |\n| x | y |\n')
  assert.strictEqual(r.false_positives, 0)
  assert.strictEqual(r.precision, 1)
})

test('detection needs the right place and the right description', () => {
  // cites the right line but says nothing about the defect there
  const vague = grade('flawed',
    '## Findings\n\n### 1. Something\n- **Where:** `src/app.js:19`\n- unclear\n\n' +
    '## Unknown\n\n| a | b |\n| --- | --- |\n| x | y |\n')
  assert.strictEqual(vague.detected, 0, 'credited a defect with no description')

  const real = grade('flawed',
    '## Findings\n\n### 1. SQL injection via string interpolation\n' +
    '- **Where:** `src/app.js:19`\n\n## Unknown\n\n| a | b |\n| --- | --- |\n| x | y |\n')
  assert.ok(real.detected >= 1, 'did not credit a correct finding')
})

test('the skill still states the constraints these evals grade', () => {
  const skill = fs.readFileSync(path.join(ROOT, '..', 'skills', 'review', 'SKILL.md'), 'utf8').toLowerCase()
  for (const rule of ['never mark an item verified', 'cites file and line', 'is a real answer']) {
    assert.ok(skill.includes(rule), `the skill no longer states: "${rule}" — the evals grade a claim it stopped making`)
  }
})

console.log(`\n${pass} passed, ${fails.length} failed\n`)
process.exit(fails.length ? 1 : 0)
