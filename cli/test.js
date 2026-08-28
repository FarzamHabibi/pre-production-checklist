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
    for (const f of ['id', 'text', 'group', 'checklist', 'stack', 'release_gate', 'source']) {
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

test('group and gate filters narrow the set', () => {
  const doc = D.load()
  const core = D.query({ groups: ['core'] })
  assert.strictEqual(core.length, doc.counts.by_group.core)
  const gate = D.query({ gate: true })
  assert.strictEqual(gate.length, doc.counts.release_gate)
  assert.ok(gate.every((i) => i.release_gate === true))
})

test('search is case-insensitive and actually matches', () => {
  const hits = D.query({ search: 'CORS' })
  assert.ok(hits.length > 0)
  assert.ok(hits.every((i) => i.text.toLowerCase().includes('cors')))
})

test('markdown output carries every item and the marking legend', () => {
  const items = D.query({ groups: ['ai'], limit: 25 })
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
  for (const grp of ['core', 'ai', 'vibe-coding']) {
    const d = path.join(__dirname, '..', 'checklists', grp)
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.md') || f === 'README.md') continue
      coreTitles.add(fs.readFileSync(path.join(d, f), 'utf8').split('\n')[0].replace(/^#\s*/, '').trim())
    }
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
      assert.ok(/^<sub>from \[`(core|ai|vibe-coding)\/[a-z0-9-]+\.md`\]\(\.\.\/(core|ai|vibe-coding)\/[a-z0-9-]+\.md\)<\/sub>$/.test(lines[i + 1] || ''),
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
  const row = /\[[^\]]+\]\((checklists\/(?:core|ai|vibe-coding)\/[a-z0-9-]+\.md)\)\s*\|\s*\*{0,2}(\d+)/g
  let m
  let checked = 0
  while ((m = row.exec(readme)) !== null) {
    const [, file, claimed] = m
    assert.strictEqual(perFile.get(file), Number(claimed),
      `README says ${file} has ${claimed} items; it has ${perFile.get(file)}`)
    checked++
  }
  assert.ok(checked > 20, `only ${checked} README rows were checked — did the tables change shape?`)

  // Per-group totals in the structure block.
  for (const [group, n] of Object.entries(doc.counts.by_group)) {
    const re = new RegExp(`${group}/\\s+([\\d,]+) items`)
    const hit = readme.match(re)
    if (!hit) continue
    assert.strictEqual(Number(hit[1].replace(/,/g, '')), n,
      `README's structure block says ${group} has ${hit[1]}; it has ${n}`)
  }

  // The generated headline.
  const headline = readme.match(/<!-- counts:begin -->\n(.*?)\n<!-- counts:end -->/s)
  assert.ok(headline, 'README is missing the counts:begin/end markers')
  assert.ok(headline[1].includes(doc.counts.total.toLocaleString('en-US')),
    `headline does not state ${doc.counts.total}: ${headline[1]}`)
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
  const stacks = cli('stacks')
  for (const s of D.knownStacks()) assert.ok(stacks.includes(s), `missing ${s}`)
})

test('--format count agrees with the library', () => {
  const n = parseInt(cli('--group', 'core', '--format', 'count').trim(), 10)
  assert.strictEqual(n, D.query({ groups: ['core'] }).length)
})

test('--format json emits parseable items', () => {
  const out = JSON.parse(cli('--group', 'ai', '--limit', '5', '--format', 'json'))
  assert.strictEqual(out.length, 5)
  assert.ok(out[0].id && out[0].text)
})

test('comma-separated and repeated --stack both work', () => {
  const a = cli('--stack', 'supabase,cloudflare', '--format', 'count').trim()
  const b = cli('--stack', 'supabase', '--stack', 'cloudflare', '--format', 'count').trim()
  assert.strictEqual(a, b)
})

test('bad input exits non-zero instead of guessing', () => {
  for (const args of [['--group', 'nope'], ['--format', 'yaml'], ['--nonsense'], ['badcmd']]) {
    assert.throws(() => execFileSync(process.execPath, [CLI, ...args], { stdio: 'pipe' }),
      `expected failure for: ${args.join(' ')}`)
  }
})

test('--out refuses to clobber an existing file', () => {
  assert.throws(
    () => execFileSync(process.execPath, [CLI, '--group', 'ai', '--out', 'package.json'],
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
