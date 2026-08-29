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
const { score } = require('./followed.js')
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

test('the clean fixture contains nothing worth reporting', () => {
  // It used to be a minimal Express app, and a review of it produced eight findings that
  // were all legitimate — no auth, no ownership check on a download route, unhandled async
  // rejections. So the false-positive test was measuring the fixture, not the reviewer.
  // It is a pure module now: any finding against it is a fabrication, which is the only
  // condition under which "any finding is a false positive" is a fair rule.
  const clean = path.join(ROOT, 'fixtures', 'clean')
  const files = []
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) walk(full)
      else if (/\.(js|ts|json)$/.test(e.name)) files.push(full)
    }
  }
  walk(clean)
  assert.ok(files.length, 'the clean fixture has no source files')

  const body = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')

  assert.ok(!/PLANTED/.test(body), 'the clean fixture contains a PLANTED marker')

  // Anything that reaches the outside world gives a reviewer something real to say, and
  // then a finding is not a fabrication.
  for (const [what, re] of [
    ['a network server', /express|http\.createServer|fastify|koa/],
    ['a database client', /\bpg\b|mysql|mongo|sqlite|prisma/],
    ['filesystem access', /require\(['"]fs['"]\)|readFile|writeFile|sendFile/],
    ['a child process', /child_process|execSync|spawn/],
    ['runtime dependencies', /"dependencies"\s*:\s*\{\s*"/]
  ]) {
    assert.ok(!re.test(body),
      `the clean fixture has ${what} — a reviewer would have something legitimate to report`)
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

test('a security claim against the inert module is fabrication', () => {
  const r = grade('clean', '## Findings\n\n### 1. SQL injection in split()\n' +
                           '- **Where:** `src/money.js:24`\n')
  assert.strictEqual(r.findings_claiming_security, 1)
  assert.strictEqual(r.precision, 0)
})

test('a correctness finding against the inert module is legitimate', () => {
  // The rule used to be "any finding is a false positive", which failed three reviewers
  // who found real bugs in code called clean. Only an unfalsifiable security claim counts
  // as fabrication now; a correctness observation is what a review is for.
  const r = grade('clean', '## Findings\n\n### 1. format() assumes two decimal places\n' +
                           '- **Where:** `src/money.js:40`\n\n## Unknown\n\n' +
                           'Nothing about how callers construct amounts could be established here.\n')
  assert.strictEqual(r.findings_claiming_security, 0)
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


test('the answer key matches the code it claims to describe', () => {
  // The first version of this fixture planted two defects that were not defects:
  // "no body size limit" (express.json already defaults to 100kb) and a debug flag in a
  // module nothing imported. Two independent agents caught both, and the grader had been
  // crediting reviews for repeating them. The key is derived from the markers now, and
  // this keeps it that way.
  const dir = path.join(__dirname, 'fixtures', 'flawed')
  const key = JSON.parse(fs.readFileSync(path.join(dir, 'DEFECTS.json'), 'utf8')).defects

  const markers = []
  for (const f of ['src/app.js', 'src/config.js']) {
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n')
    lines.forEach((l, i) => { if (l.includes('PLANTED:')) markers.push({ file: f, line: i + 1 }) })
  }

  assert.strictEqual(key.length, markers.length,
    `DEFECTS.json has ${key.length} entries but the code has ${markers.length} PLANTED markers`)

  for (const d of key) {
    const hit = markers.find((m) => m.file === d.file && m.line === d.line)
    assert.ok(hit, `${d.id} claims ${d.file}:${d.line} but there is no PLANTED marker there`)
    const line = fs.readFileSync(path.join(dir, d.file), 'utf8').split('\n')[d.line - 1]
    assert.ok(line.includes('PLANTED:'), `${d.id}: ${d.file}:${d.line} is not a marker line`)
    assert.ok(Array.isArray(d.keywords) && d.keywords.length,
      `${d.id} has no keywords, so it can never be detected`)
  }
})

test('the follow detector separates procedure from a good review', () => {
  // It has to distinguish "followed the skill" from "reviewed well", because a capable
  // model does the second by default — the control reached for an unknown section and
  // said nothing was verified with no skill loaded at all.
  const followed = score([
    '**Scope:** the three files in src/',
    '## Findings',
    '### 1. Something — FINDING',
    '- **Where:** `src/app.js:21`',
    '## Unknown — needs a human',
    'Whether the deploy sets NODE_ENV could not be established from the repository.',
    '## Not applicable',
    'No mobile client here.',
    'Nothing in this report is marked verified.'
  ].join('\n'))
  assert.ok(followed.followed, 'a review that follows the procedure was not recognised')

  const goodButNotProcedure = score([
    '## Findings',
    '### Critical',
    '#### SQL injection at src/app.js:21',
    'Use parameterised queries.',
    '### High',
    '#### Missing rate limiting'
  ].join('\n'))
  assert.ok(!goodButNotProcedure.followed,
    'a competent severity-graded review was scored as having followed the skill')
})

test('the follow detector does not reward a verdict', () => {
  const withVerdict = score('## Verdict: DO NOT SHIP\n\n## Findings\n### 1. x')
  assert.ok(!withVerdict.matched.includes('no-verdict'))
})

console.log(`\n${pass} passed, ${fails.length} failed\n`)
process.exit(fails.length ? 1 : 0)
