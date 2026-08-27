#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const D = require('./lib/data')

const pkg = require('../package.json')

const HELP = `
prodcheck — generate a pre-production security checklist for your stack

USAGE
  npx prodcheck [options]              write a checklist (markdown to stdout)
  npx prodcheck stacks                 list stacks with supplement files
  npx prodcheck info                   dataset summary

OPTIONS
  -s, --stack <name,...>   include supplements for these stacks (repeatable)
  -g, --group <name,...>   core | ai | vibe-coding | stacks
  -q, --search <text>      case-insensitive match on item text
      --gate               only release-blocking items
      --agnostic           only items that name no product at all
  -o, --out <file>         write to a file instead of stdout
  -f, --format <fmt>       markdown (default) | text | json | count
  -n, --limit <n>          cap the number of items
  -h, --help               this
  -v, --version

EXAMPLES
  npx prodcheck --stack django --group core -o SECURITY.md
  npx prodcheck --stack supabase,cloudflare --gate
  npx prodcheck --group ai -o AI-SECURITY.md
  npx prodcheck --search cors --format text

NOTES
  A stack with no supplement file is not an error — you get the stack-agnostic core,
  which stands on its own. That is the point: it works for stacks nobody has written
  a file for yet.

  Missing your stack? Contributions welcome:
  https://github.com/FarzamHabibi/pre-production-checklist/blob/main/CONTRIBUTING.md
`.trim()

function parse (argv) {
  const o = { stacks: [], groups: [], format: 'markdown' }
  const list = (v) => String(v).split(',').map((x) => x.trim()).filter(Boolean)
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => {
      const v = argv[++i]
      if (v === undefined) fail(`${a} needs a value`)
      return v
    }
    switch (a) {
      case '-s': case '--stack': o.stacks.push(...list(next())); break
      case '-g': case '--group': o.groups.push(...list(next())); break
      case '-q': case '--search': o.search = next(); break
      case '-o': case '--out': o.out = next(); break
      case '-f': case '--format': o.format = next(); break
      case '-n': case '--limit': o.limit = parseInt(next(), 10); break
      case '--gate': o.gate = true; break
      case '--agnostic': o.onlyAgnostic = true; break
      case '-h': case '--help': o.help = true; break
      case '-v': case '--version': o.version = true; break
      default:
        if (a.startsWith('-')) fail(`unknown option: ${a}`)
        else if (!o.command) o.command = a
        else fail(`unexpected argument: ${a}`)
    }
  }
  return o
}

function fail (msg) {
  process.stderr.write(`prodcheck: ${msg}\n\nRun 'npx prodcheck --help'.\n`)
  process.exit(2)
}

function main () {
  const o = parse(process.argv.slice(2))
  if (o.help) return console.log(HELP)
  if (o.version) return console.log(pkg.version)

  const doc = D.load()

  if (o.command === 'stacks') {
    console.log('Stacks with supplement files:\n')
    for (const s of D.knownStacks()) {
      const n = doc.items.filter((i) => i.stack === s).length
      console.log(`  ${s.padEnd(20)} ${String(n).padStart(4)} extra items`)
    }
    console.log(`\n  anything else        ${String(doc.counts.stack_agnostic).padStart(4)} stack-agnostic items (the core, which stands alone)`)
    console.log('\nAdd yours: https://github.com/FarzamHabibi/pre-production-checklist/blob/main/CONTRIBUTING.md')
    return
  }

  if (o.command === 'info') {
    console.log(`prodcheck ${pkg.version} — dataset v${doc.version}`)
    console.log(`  total items      ${doc.counts.total}`)
    for (const [g, n] of Object.entries(doc.counts.by_group)) {
      console.log(`    ${g.padEnd(14)} ${n}`)
    }
    console.log(`  stack-agnostic   ${doc.counts.stack_agnostic}`)
    console.log(`  release gate     ${doc.counts.release_gate}`)
    console.log(`  license          ${doc.license}`)
    console.log(`  source           ${doc.source}`)
    return
  }

  if (o.command) fail(`unknown command: ${o.command}`)

  const badGroups = o.groups.filter((g) => !['core', 'ai', 'vibe-coding', 'stacks'].includes(g))
  if (badGroups.length) fail(`unknown group(s): ${badGroups.join(', ')} — expected core, ai, vibe-coding or stacks`)

  const { unknown } = D.resolveStacks(o.stacks)
  if (unknown.length) {
    process.stderr.write(
      `note: no supplement file for ${unknown.join(', ')} — you get the stack-agnostic core, ` +
      "which stands on its own.\n      Run 'npx prodcheck stacks' to see what exists, or add yours.\n\n"
    )
  }

  const items = D.query(o)
  if (!items.length) {
    process.stderr.write('prodcheck: no items matched those filters.\n')
    process.exit(1)
  }

  let output
  switch (o.format) {
    case 'count': output = String(items.length) + '\n'; break
    case 'json': output = JSON.stringify(items, null, 2) + '\n'; break
    case 'text': output = items.map((i) => i.text).join('\n') + '\n'; break
    case 'markdown': {
      const bits = []
      if (o.stacks.length) bits.push(`stack: ${o.stacks.join(', ')}`)
      if (o.groups.length) bits.push(`groups: ${o.groups.join(', ')}`)
      if (o.gate) bits.push('release-blocking only')
      if (o.search) bits.push(`matching "${o.search}"`)
      output = D.toMarkdown(items, {
        subtitle: `${items.length} items${bits.length ? ' — ' + bits.join(' · ') : ''}.`
      })
      break
    }
    default: fail(`unknown format: ${o.format} — expected markdown, text, json or count`)
  }

  if (o.out) {
    const dest = path.resolve(process.cwd(), o.out)
    if (fs.existsSync(dest)) fail(`${o.out} already exists — refusing to overwrite it`)
    fs.writeFileSync(dest, output)
    process.stderr.write(`wrote ${o.out} — ${items.length} items\n`)
  } else {
    process.stdout.write(output)
  }
}

try {
  main()
} catch (err) {
  process.stderr.write(`prodcheck: ${err.message}\n`)
  process.exit(1)
}
