#!/usr/bin/env node
'use strict'
/** Tests for the CLI and MCP server. No dependencies: `node cli/test.js`. */
const assert = require('assert')
const { execFileSync, spawn } = require('child_process')
const path = require('path')
const D = require('./lib/data')

const CLI = path.join(__dirname, 'index.js')
const MCP = path.join(__dirname, 'mcp.js')

let pass = 0
const failures = []

function test (name, fn) {
  try {
    fn()
    pass++
    console.log(`  ok  ${name}`)
  } catch (err) {
    failures.push([name, err])
    console.log(`  FAIL ${name}\n       ${err.message}`)
  }
}

async function testAsync (name, fn) {
  try {
    await fn()
    pass++
    console.log(`  ok  ${name}`)
  } catch (err) {
    failures.push([name, err])
    console.log(`  FAIL ${name}\n       ${err.message}`)
  }
}

const cli = (...args) => execFileSync(process.execPath, [CLI, ...args], { encoding: 'utf8' })

// ------------------------------------------------------------------ data
console.log('\ndata layer')

test('loads and self-reports a consistent total', () => {
  const doc = D.load()
  assert.strictEqual(doc.items.length, doc.counts.total)
  assert.ok(doc.counts.total > 2000, 'expected a few thousand items')
})

test('every item has the fields the schema requires', () => {
  for (const i of D.load().items) {
    for (const f of ['id', 'text', 'domain', 'checklist', 'stack', 'release_gate', 'source']) {
      assert.ok(i[f] !== undefined, `item ${i.id} missing ${f}`)
    }
    assert.ok(i.text.length > 0)
  }
})

test('ids are unique', () => {
  const ids = D.load().items.map((i) => i.id)
  assert.strictEqual(new Set(ids).size, ids.length)
})

test('stack-agnostic count matches the items themselves', () => {
  const doc = D.load()
  const actual = doc.items.filter((i) => i.stack === 'any').length
  assert.strictEqual(actual, doc.counts.stack_agnostic)
})

test('an unknown stack yields exactly the stack-agnostic core', () => {
  const doc = D.load()
  const items = D.query({ stacks: ['coldfusion'] })
  assert.strictEqual(items.length, doc.counts.stack_agnostic)
  assert.ok(items.every((i) => i.stack === 'any'))
})

test('a known stack adds items and never loses the core', () => {
  const doc = D.load()
  const items = D.query({ stacks: ['Supabase'] })
  assert.ok(items.length > doc.counts.stack_agnostic, 'supplements should add items')
  assert.ok(items.some((i) => i.stack === 'Supabase'))
})

test('stack names match regardless of punctuation or case', () => {
  const a = D.query({ stacks: ['Next.js / React'] }).length
  const b = D.query({ stacks: ['nextjs-react'] }).length
  const c = D.query({ stacks: ['NEXTJSREACT'] }).length
  assert.strictEqual(a, b)
  assert.strictEqual(b, c)
})

test('a stack resolves by file slug as well as display label', () => {
  // People type what they saw in the repo — "rails", "go-gin", "react-native" — not
  // "Ruby on Rails". Matching on the label alone silently returned the bare core.
  for (const [slug, label] of [['rails', 'Ruby on Rails'], ['spring', 'Spring Boot'],
                               ['go-gin', 'Go / Gin'], ['react-native', 'React Native']]) {
    const bySlug = D.query({ stacks: [slug] })
    const byLabel = D.query({ stacks: [label] })
    assert.strictEqual(bySlug.length, byLabel.length, `${slug} and ${label} must agree`)
    assert.ok(bySlug.some((i) => i.stack === label), `${slug} returned no ${label} items`)
  }
})

test('domain, area and gate filters narrow the set', () => {
  const doc = D.load()
  for (const d of D.knownDomains()) {
    assert.strictEqual(D.query({ domains: [d], allStacks: true }).length, doc.counts.by_domain[d])
  }
  const areaTotal = D.knownAreas('security')
    .reduce((n, a) => n + D.query({ domains: ['security'], areas: [a], allStacks: true }).length, 0)
  const noArea = D.query({ domains: ['security'], allStacks: true }).filter((i) => !i.area).length
  assert.strictEqual(areaTotal + noArea, doc.counts.by_domain.security,
    'areas plus area-less items must account for the whole domain')
  const gate = D.query({ gate: true, allStacks: true })
  assert.strictEqual(gate.length, doc.counts.release_gate)
  assert.ok(gate.every((i) => i.release_gate === true))
})

test('product supplements are opt-in', () => {
  // Generating a checklist that mixes Rails, Django and iOS items for someone who uses
  // none of them teaches the reader to skim. No --stack means no supplements.
  const plain = D.query({ domains: ['performance'] })
  assert.ok(plain.every((i) => i.stack === 'any'), 'default must not include supplements')

  const withStack = D.query({ domains: ['performance'], stacks: ['nextjs-react'] })
  assert.ok(withStack.length > plain.length, 'naming a stack must add items')
  assert.ok(withStack.some((i) => i.stack === 'Next.js / React'))
  assert.ok(withStack.every((i) => i.domain === 'performance'),
    'a domain query must not leak another domain from the same stack file')

  const all = D.query({ domains: ['performance'], allStacks: true })
  assert.ok(all.length > withStack.length, '--all-stacks must include every supplement')
})

test('search is case-insensitive and actually matches', () => {
  const hits = D.query({ search: 'CORS', allStacks: true })
  assert.ok(hits.length > 0)
  assert.ok(hits.every((i) => i.text.toLowerCase().includes('cors')))
})

test('markdown output carries every item and the marking legend', () => {
  const items = D.query({ areas: ['ai'], limit: 25 })
  const md = D.toMarkdown(items, {})
  assert.strictEqual((md.match(/^\* \[ \] /gm) || []).length, items.length)
  assert.ok(md.includes('[N/A]'))
})

test('no source file contains a raw control byte', () => {
  const fs = require('fs')
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(d, e.name)
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(full)
    return /\.(js|json|md|sh|py|yml)$/.test(e.name) ? [full] : []
  })
  const root = path.join(__dirname, '..')
  for (const f of walk(root)) {
    const buf = fs.readFileSync(f)
    for (let i = 0; i < buf.length; i++) {
      const b = buf[i]
      if (b < 9 || (b > 13 && b < 32) || b === 127) {
        assert.fail(`${path.relative(root, f)} has a raw control byte 0x${b.toString(16)} at offset ${i} — git will treat it as binary`)
      }
    }
  }
})

test('every stack file follows the documented format', () => {
  const fs = require('fs')
  const dir = path.join(__dirname, '..', 'checklists', 'stacks')
  // A stack supplement may extend any checklist, not only core/ — Cloudflare has items
  // that belong under the AI checklists, for instance.
  const coreTitles = new Set()
  const walkTitles = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) { walkTitles(full); continue }
      if (!e.name.endsWith('.md') || e.name === 'README.md' || e.name === '_TEMPLATE.md') continue
      coreTitles.add(fs.readFileSync(full, 'utf8').split('\n')[0].replace(/^#\s*/, '').trim())
    }
  }
  for (const d of D.knownDomains()) {
    walkTitles(path.join(__dirname, '..', 'checklists', d))
  }

  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f === '_TEMPLATE.md' || f === 'README.md') continue
    const where = `stacks/${f}`
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n')

    assert.ok(lines[0].startsWith('# '), `${where}: first line must be the H1 display label`)
    assert.ok(!/^#\s+[a-z-]+$/.test(lines[0]),
      `${where}: H1 is the human label ("Ruby on Rails"), not the slug`)

    const h2s = lines.filter((l) => l.startsWith('## ')).map((l) => l.slice(3).trim())
    assert.ok(h2s.length > 0, `${where}: needs at least one H2 naming a core checklist`)
    for (const h of h2s) {
      assert.ok(coreTitles.has(h),
        `${where}: H2 "${h}" does not match the H1 of any checklist`)
    }
    // every H2 is followed by its back-link
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith('## ')) continue
      assert.ok(/^<sub>from \[`[a-z0-9/-]+\.md`\]\(\.\.\/[a-z0-9/-]+\.md\)<\/sub>$/.test(lines[i + 1] || ''),
        `${where}: H2 "${lines[i].slice(3)}" is missing its <sub>from ...</sub> back-link`)
    }
    const items = lines.filter((l) => l.startsWith('* ['))
    assert.ok(items.length >= 3, `${where}: only ${items.length} items`)
    assert.ok(items.every((l) => l.startsWith('* [ ] ')),
      `${where}: ships a pre-ticked item — stack files must be all [ ]`)
  }
})

test('README item counts agree with the data', () => {
  const fs = require('fs')
  const doc = D.load()
  const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8')

  // Per-file counts in the README's tables.
  const perFile = new Map()
  for (const i of doc.items) {
    perFile.set(i.source.file, (perFile.get(i.source.file) || 0) + 1)
  }
  const row = /\[[^\]]+\]\((checklists\/(?!stacks\/)[a-z0-9/-]+\.md)\)\s*\|\s*\*{0,2}(\d+)/g
  let m
  let checked = 0
  while ((m = row.exec(readme)) !== null) {
    const [, file, claimed] = m
    assert.strictEqual(perFile.get(file), Number(claimed),
      `README says ${file} has ${claimed} items; it has ${perFile.get(file)}`)
    checked++
  }
  assert.ok(checked > 20, `only ${checked} README rows were checked — did the tables change shape?`)

  // Per-domain totals in the structure block.
  for (const [domain, n] of Object.entries(doc.counts.by_domain)) {
    const re = new RegExp(`${domain}/\\s+([\\d,]+) items`)
    const hit = readme.match(re)
    if (!hit) continue
    assert.strictEqual(Number(hit[1].replace(/,/g, '')), n,
      `README's structure block says ${domain} has ${hit[1]}; it has ${n}`)
  }

  // The generated headline.
  const headline = readme.match(/<!-- counts:begin -->\n(.*?)\n<!-- counts:end -->/s)
  assert.ok(headline, 'README is missing the counts:begin/end markers')
  assert.ok(headline[1].includes(doc.counts.total.toLocaleString('en-US')),
    `headline does not state ${doc.counts.total}: ${headline[1]}`)
})

test('no item loses a lead-in the source file provides', () => {
  // The defect: `[ ] null` shipped because the generator read the list under "Test
  // AI-generated validation against:" and dropped the sentence. Asserting on item text
  // ("does this read as a sentence?") is not something a regex settles; asserting the
  // pipeline preserves what the markdown states is.
  const fs = require('fs')
  const root = path.join(__dirname, '..')
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(d, e.name)
    return e.isDirectory() ? walk(full) : (e.name.endsWith('.md') ? [full] : [])
  })

  const led = new Set()
  for (const f of walk(path.join(root, 'checklists'))) {
    const lines = fs.readFileSync(f, 'utf8').split('\n')
    let lead = null
    for (let n = 0; n < lines.length; n++) {
      const t = lines[n].trim()
      if (/^[*-] \[[ x!]\]/i.test(t)) {
        if (lead) led.add(`${path.relative(root, f)}:${n + 1}`)
        continue
      }
      if (!t) continue
      if (/^#{1,6}\s/.test(t)) lead = null      // a heading opens a new list
      else if (/^\*\*[^*].*\*\*$/.test(t)) lead = t.replace(/\*/g, '')
      else if (t.endsWith(':') && !/^[#|><*-]/.test(t)) lead = t
      else if (!/^[#<]/.test(t)) lead = null
    }
  }
  assert.ok(led.size > 500, `expected the tree to have many led lists, found ${led.size}`)

  const missing = D.load().items
    .filter((i) => led.has(`${i.source.file}:${i.source.line}`) && !i.lead)
    .map((i) => `${i.source.file}:${i.source.line} "${i.text}"`)
  assert.deepStrictEqual(missing, [], 'items whose lead-in the generator dropped')
})

test('every rendered format keeps the lead-in', () => {
  const withLead = D.load().items.filter((i) => i.lead)
  assert.ok(withLead.length > 0, 'no item carries a lead-in — the parser stopped capturing it')
  const sample = withLead[0]

  const md = D.toMarkdown([sample], {})
  assert.ok(md.includes(sample.lead), 'markdown output dropped the lead-in')

  const text = cli('--search', sample.text.slice(0, 20), '--format', 'text', '--all-stacks')
  if (text.includes(sample.text)) {
    assert.ok(text.includes(sample.lead), 'text output dropped the lead-in')
  }
})

test('a stack section inherits the gate status of the checklist it extends', () => {
  // The gate returned nothing product-specific at all: a leaked Supabase service-role
  // key sat outside it purely because stack supplements live in their own files. The
  // back-link already says which checklist a section extends — the domain was inherited
  // through it and the gate flag was not.
  const doc = D.load()
  const gated = doc.items.filter((i) => i.stack !== 'any' && i.release_gate)
  assert.ok(gated.length > 0, 'no stack supplement contributes a release blocker')

  // and it must not be blanket: most stack items are not blockers
  const stackItems = doc.items.filter((i) => i.stack !== 'any')
  assert.ok(gated.length < stackItems.length / 2,
    `${gated.length} of ${stackItems.length} stack items are gated — the flag is too broad`)
})

test('naming no stack leaves the gate exactly as it was', () => {
  // The inheritance must not leak into the default. Someone who runs `prodcheck --gate`
  // with no --stack is asking for the portable gate and must not receive Supabase items.
  const bare = D.query({ gate: true })
  assert.strictEqual(bare.filter((i) => i.stack !== 'any').length, 0,
    'the bare gate picked up product supplements')

  const scoped = D.query({ gate: true, stacks: ['supabase'] })
  assert.ok(scoped.length > bare.length, '--stack supabase added no blockers')
  const foreign = scoped.filter((i) => i.stack !== 'any' && !/supabase/i.test(i.stack))
  assert.deepStrictEqual(foreign.map((i) => i.stack), [],
    'another product leaked into the Supabase gate')
})

test('the prompts and the skill agree on the three states', () => {
  // They did not. skills/review/SKILL.md says a model may never mark an item as
  // passing; docs/prompts.md instructed it to answer PASS. Two documents in one
  // repository contradicting each other on the single rule the project exists for.
  const fs = require('fs')
  const root = path.join(__dirname, '..')
  const skill = fs.readFileSync(path.join(root, 'skills/review/SKILL.md'), 'utf8')
  const prompts = fs.readFileSync(path.join(root, 'docs/prompts.md'), 'utf8')

  for (const state of ['FINDING', 'UNKNOWN', 'N/A']) {
    assert.ok(skill.includes(state), `the skill lost the ${state} state`)
  }
  // a verdict the skill forbids must not be instructed anywhere
  const forbids = /\bPASS\b/g
  const stray = (prompts.match(forbids) || []).filter((_, i, a) => a.length > 0)
  const explanatory = (prompts.match(/quiet PASS|never a pass|no pass/gi) || []).length
  assert.ok(stray.length <= explanatory,
    `docs/prompts.md still instructs PASS ${stray.length} times, ` +
    'and the skill forbids any pass at all')
})

// ------------------------------------------------------------------ CLI
console.log('\ncli')

test('--help and --version work', () => {
  assert.ok(cli('--help').includes('USAGE'))
  assert.ok(/^\d+\.\d+\.\d+/.test(cli('--version').trim()))
})

test('info and stacks subcommands report real numbers', () => {
  const doc = D.load()
  assert.ok(cli('info').includes(String(doc.counts.total)))
  const list = cli('list')
  for (const d of D.knownDomains()) assert.ok(list.includes(d), `list omits domain ${d}`)
  const stacks = cli('stacks')
  for (const s of D.knownStacks()) assert.ok(stacks.includes(s), `missing ${s}`)
})

test('--format count agrees with the library', () => {
  const n = parseInt(cli('security', '--format', 'count').trim(), 10)
  assert.strictEqual(n, D.query({ domains: ['security'] }).length)
  // the positional domain and the legacy --domain flag must agree
  assert.strictEqual(cli('--domain', 'security', '--format', 'count').trim(), String(n))
})

test('--format json emits parseable items', () => {
  const out = JSON.parse(cli('--area', 'ai', '--limit', '5', '--format', 'json'))
  assert.strictEqual(out.length, 5)
  assert.ok(out[0].id && out[0].text)
})

test('comma-separated and repeated --stack both work', () => {
  const a = cli('--stack', 'supabase,cloudflare', '--format', 'count').trim()
  const b = cli('--stack', 'supabase', '--stack', 'cloudflare', '--format', 'count').trim()
  assert.strictEqual(a, b)
})

test('bad input exits non-zero instead of guessing', () => {
  for (const args of [['nope'], ['--area', 'nope'], ['--format', 'yaml'], ['--nonsense']]) {
    assert.throws(() => execFileSync(process.execPath, [CLI, ...args], { stdio: 'pipe' }),
      `expected failure for: ${args.join(' ')}`)
  }
})

test('--out refuses to clobber an existing file', () => {
  assert.throws(
    () => execFileSync(process.execPath, [CLI, '--area', 'ai', '--out', 'package.json'],
      { stdio: 'pipe', cwd: path.join(__dirname, '..') }),
    /already exists|Command failed/
  )
})

test('README only documents bin names that this package actually declares', () => {
  const fs = require('fs')
  const pkg = require('../package.json')
  const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8')
  // `npx -y <name>` resolves <name> as a PACKAGE. A bin that is not also a published
  // package name only works via `npx --package=<pkg> <bin>`. Shipping the short form
  // for prodcheck-mcp gave every reader a command that 404s.
  for (const bin of Object.keys(pkg.bin)) {
    if (bin === pkg.name) continue
    const bare = new RegExp(`npx\\s+(-y\\s+)?${bin}\\b`)
    assert.ok(!bare.test(readme),
      `README tells people to run "npx ${bin}", but "${bin}" is a bin, not a package. ` +
      `Use "npx -y --package=${pkg.name} ${bin}".`)
  }
})

test('the review skill states the three rules it exists for', () => {
  const fs = require('fs')
  const skill = fs.readFileSync(path.join(__dirname, '..', 'skills', 'review', 'SKILL.md'), 'utf8')
  assert.ok(skill.startsWith('---'), 'skill needs frontmatter for Claude Code to load it')
  for (const field of ['name:', 'description:']) {
    assert.ok(skill.includes(field), `skill frontmatter missing ${field}`)
  }
  // The whole point of the skill. If an edit ever loosens these, the skill becomes the
  // thing security/ai-generated-code warns about instead of the answer to it.
  for (const rule of ['never mark an item verified', 'cites file and line',
                      'is a real answer']) {
    assert.ok(skill.toLowerCase().includes(rule.toLowerCase()),
      `the skill no longer states: "${rule}"`)
  }
  assert.ok(!/\bmark(ing)? (it|them|items) as \[x\]/i.test(skill))
})

test('init writes into a project without touching anything else', () => {
  const fs = require('fs')
  const os = require('os')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-init-'))
  try {
    execFileSync(process.execPath, [CLI, 'init'], { cwd: dir, stdio: 'pipe' })
    const written = path.join(dir, '.claude', 'skills', 'prodcheck-review', 'SKILL.md')
    assert.ok(fs.existsSync(written), 'init wrote nothing')
    assert.ok(fs.readFileSync(written, 'utf8').startsWith('---'))

    // second run must not clobber a file the user may have edited
    fs.writeFileSync(written, 'MINE')
    execFileSync(process.execPath, [CLI, 'init'], { cwd: dir, stdio: 'pipe' })
    assert.strictEqual(fs.readFileSync(written, 'utf8'), 'MINE', 'init overwrote without --force')

    execFileSync(process.execPath, [CLI, 'init', '--force'], { cwd: dir, stdio: 'pipe' })
    assert.ok(fs.readFileSync(written, 'utf8').startsWith('---'), '--force did not overwrite')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('init appends to AGENTS.md rather than replacing it', () => {
  const fs = require('fs')
  const os = require('os')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-agents-'))
  try {
    const f = path.join(dir, 'AGENTS.md')
    fs.writeFileSync(f, '# House rules\n\nSomething the project already relies on.\n')
    execFileSync(process.execPath, [CLI, 'init', '--target', 'agents'], { cwd: dir, stdio: 'pipe' })
    let out = fs.readFileSync(f, 'utf8')
    assert.ok(out.includes('Something the project already relies on'), 'init destroyed existing content')
    assert.ok(out.includes('prodcheck:begin'))

    // and re-running replaces only its own block
    execFileSync(process.execPath, [CLI, 'init', '--target', 'agents'], { cwd: dir, stdio: 'pipe' })
    out = fs.readFileSync(f, 'utf8')
    assert.strictEqual((out.match(/prodcheck:begin/g) || []).length, 1, 'block duplicated on re-run')
    assert.ok(out.includes('Something the project already relies on'))
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('each target gets the format that client actually reads', () => {
  const fs = require('fs')
  const os = require('os')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-fmt-'))
  try {
    fs.mkdirSync(path.join(dir, '.cursor'))
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), '')
    execFileSync(process.execPath, [CLI, 'init', '--target', 'all'], { cwd: dir, stdio: 'pipe' })

    // Cursor decides when a rule applies from its own frontmatter; without it the
    // behaviour is undefined, which is what shipped in the first version.
    const mdc = fs.readFileSync(path.join(dir, '.cursor', 'rules', 'prodcheck-review.mdc'), 'utf8')
    assert.ok(mdc.startsWith('---'), 'cursor rule has no frontmatter')
    assert.ok(/^description:/m.test(mdc), 'cursor rule has no description')
    assert.ok(/^alwaysApply:/m.test(mdc), 'cursor rule does not say when it applies')

    // AGENTS.md is read on every task in the repo, so it gets a pointer, not the
    // whole procedure — the first version inlined ~2000 tokens into every request.
    const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8')
    assert.ok(agents.length < 2000,
      `AGENTS.md block is ${agents.length} chars — it loads on every task, keep it a pointer`)
    assert.ok(agents.includes('SKILL.md'), 'AGENTS.md does not point at the full procedure')
    assert.ok(/never mark an item verified/i.test(agents),
      'the pointer drops the rule that matters most')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('init rejects an unknown target', () => {
  assert.throws(() => execFileSync(process.execPath, [CLI, 'init', '--target', 'nope'],
    { stdio: 'pipe' }))
})

test('the update notice only fires when it should', () => {
  const fs = require('fs')
  const U = require('./lib/update')

  assert.strictEqual(U.isNewer('1.9.0', '1.8.0'), true)
  assert.strictEqual(U.isNewer('1.8.0', '1.9.0'), false)
  assert.strictEqual(U.isNewer('1.8.0', '1.8.0'), false, 'equal is not newer')
  assert.strictEqual(U.isNewer('2.0.0', '1.99.99'), true)
  assert.strictEqual(U.isNewer('1.10.0', '1.9.0'), true, 'must compare numerically, not as strings')
  // anything unparseable means say nothing rather than guess
  assert.strictEqual(U.isNewer('1.9.0-beta', '1.8.0'), false)
  assert.strictEqual(U.isNewer('latest', '1.8.0'), false)
  assert.strictEqual(U.isNewer('', '1.8.0'), false)

  // a stale cache must not make the notice appear on piped output — this is the one that
  // matters, because --format json and -o must produce exactly what was asked for
  const saved = fs.existsSync(U.CACHE) ? fs.readFileSync(U.CACHE, 'utf8') : null
  try {
    fs.writeFileSync(U.CACHE, JSON.stringify({ latest: '99.0.0', at: Date.now() }))
    const out = execFileSync(process.execPath, [CLI, '--gate', '--format', 'count'],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    assert.ok(/^\d+\n$/.test(out), `piped output was polluted: ${JSON.stringify(out)}`)
  } finally {
    if (saved !== null) fs.writeFileSync(U.CACHE, saved)
    else try { fs.unlinkSync(U.CACHE) } catch {}
  }
})

// ------------------------------------------------------------------ MCP
console.log('\nmcp server')

function mcpSession (requests) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [MCP], { stdio: ['pipe', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    const timer = setTimeout(() => { child.kill(); reject(new Error('mcp server timed out')) }, 15000)
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { err += d })
    child.on('close', () => {
      clearTimeout(timer)
      if (err.trim()) return reject(new Error(`server wrote to stderr: ${err.trim()}`))
      try {
        resolve(out.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)))
      } catch (e) {
        reject(new Error(`unparseable server output: ${e.message}\n${out.slice(0, 400)}`))
      }
    })
    for (const r of requests) child.stdin.write(JSON.stringify(r) + '\n')
    child.stdin.end()
  })
}

;(async () => {
  await testAsync('initialize handshake returns capabilities and server info', async () => {
    const [res] = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 't', version: '1' } } }
    ])
    assert.strictEqual(res.id, 1)
    assert.strictEqual(res.result.protocolVersion, '2024-11-05', 'should echo a supported version back')
    assert.ok(res.result.capabilities.tools)
    assert.strictEqual(res.result.serverInfo.name, 'prodcheck')
  })

  await testAsync('unknown protocol version falls back to our latest', async () => {
    const [res] = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '1999-01-01' } }
    ])
    assert.strictEqual(res.result.protocolVersion, '2025-06-18')
  })

  await testAsync('initialized notification produces no response', async () => {
    const msgs = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { jsonrpc: '2.0', method: 'notifications/initialized' }
    ])
    assert.strictEqual(msgs.length, 1, 'a notification must not be answered')
  })

  await testAsync('tools/list advertises every tool with a schema', async () => {
    const [, res] = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { jsonrpc: '2.0', id: 2, method: 'tools/list' }
    ])
    const names = res.result.tools.map((t) => t.name).sort()
    assert.deepStrictEqual(names,
      ['checklist_for_stack', 'list_checklists', 'release_gate', 'search_checklist'])
    for (const t of res.result.tools) {
      assert.ok(t.description && t.description.length > 40, `${t.name} needs a real description`)
      assert.strictEqual(t.inputSchema.type, 'object')
    }
  })

  await testAsync('tools/call returns checklist content', async () => {
    const [, res] = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'release_gate', arguments: {} } }
    ])
    const text = res.result.content[0].text
    assert.ok(text.includes('release-blocking items'))
    assert.ok(text.includes('* [ ] '))
  })

  await testAsync('an unknown stack is answered, not rejected', async () => {
    const [, res] = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'checklist_for_stack', arguments: { stacks: ['coldfusion'], groups: ['core'], limit: 5 } } }
    ])
    assert.ok(!res.result.isError)
    assert.ok(res.result.content[0].text.includes('No supplement file for coldfusion'))
  })

  await testAsync('tool errors come back in-band, not as protocol errors', async () => {
    const [, res] = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'no_such_tool', arguments: {} } }
    ])
    assert.ok(!res.error, 'should not be a JSON-RPC error')
    assert.strictEqual(res.result.isError, true)
    assert.ok(res.result.content[0].text.includes('unknown tool'))
  })

  await testAsync('unknown method returns JSON-RPC -32601', async () => {
    const [, res] = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { jsonrpc: '2.0', id: 2, method: 'resources/list' }
    ])
    assert.strictEqual(res.error.code, -32601)
  })

  await testAsync('malformed input does not crash the server', async () => {
    const child = spawn(process.execPath, [MCP], { stdio: ['pipe', 'pipe', 'pipe'] })
    let out = ''
    child.stdout.on('data', (d) => { out += d })
    child.stdin.write('this is not json\n')
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 9, method: 'ping' }) + '\n')
    child.stdin.end()
    await new Promise((r) => child.on('close', r))
    const msgs = out.trim().split('\n').map((l) => JSON.parse(l))
    assert.strictEqual(msgs[0].error.code, -32700, 'parse error expected')
    assert.strictEqual(msgs[1].id, 9, 'server must keep serving after bad input')
  })

  console.log(`\n${pass} passed, ${failures.length} failed\n`)
  process.exit(failures.length ? 1 : 0)
})()
