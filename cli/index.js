#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const D = require('./lib/data')

const pkg = require('../package.json')

function help () {
  const domains = D.knownDomains()
  return `
prodcheck — generate a pre-production checklist for your project

USAGE
  npx prodcheck [domain] [options]     write a checklist (markdown to stdout)
  npx prodcheck list                   domains, areas and item counts
  npx prodcheck stacks                 which product supplements exist
  npx prodcheck info                   dataset summary

DOMAINS
  ${domains.map((d) => `${d.padEnd(14)} ${D.domainLabel(d)}`).join('\n  ')}
  (omit the domain to get every one)

OPTIONS
  -a, --area <name,...>    area within a domain, e.g. core, ai, ai-generated-code
  -s, --stack <name,...>   include supplements for these products (repeatable).
                           Without it you get only items that name no product.
  -q, --search <text>      case-insensitive match on item text
      --gate               only release-blocking items
      --all-stacks         include every product supplement, not just yours
  -o, --out <file>         write to a file instead of stdout
  -f, --format <fmt>       markdown (default) | text | json | count
  -n, --limit <n>          cap the number of items
  -h, --help               this
  -v, --version

EXAMPLES
  npx prodcheck security --stack django -o SECURITY.md
  npx prodcheck security --area ai
  npx prodcheck --gate                       release blockers, every domain
  npx prodcheck --search cors --format text

NOTES
  A stack with no supplement file is not an error — you get the items that name no
  product, which stand on their own. That is the point: it works for stacks nobody
  has written a file for yet.

  Missing your stack? Contributions welcome:
  https://github.com/FarzamHabibi/pre-production-checklist/blob/main/CONTRIBUTING.md
`.trim()
}

const COMMANDS = new Set(['list', 'stacks', 'info'])

function parse (argv) {
  const o = { domains: [], areas: [], stacks: [], format: 'markdown' }
  const list = (v) => String(v).split(',').map((x) => x.trim()).filter(Boolean)
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => {
      const v = argv[++i]
      if (v === undefined) fail(`${a} needs a value`)
      return v
    }
    switch (a) {
      case '-a': case '--area': o.areas.push(...list(next())); break
      case '-s': case '--stack': o.stacks.push(...list(next())); break
      case '-q': case '--search': o.search = next(); break
      case '-o': case '--out': o.out = next(); break
      case '-f': case '--format': o.format = next(); break
      case '-n': case '--limit': o.limit = parseInt(next(), 10); break
      // --domain and --group are the pre-1.0 spellings, kept so existing scripts work
      case '-d': case '--domain': case '-g': case '--group': o.domains.push(...list(next())); break
      case '--gate': o.gate = true; break
      case '--all-stacks': o.allStacks = true; break
      case '-h': case '--help': o.help = true; break
      case '-v': case '--version': o.version = true; break
      default:
        if (a.startsWith('-')) fail(`unknown option: ${a}`)
        else if (COMMANDS.has(a) && !o.command) o.command = a
        else o.domains.push(a)
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
  if (o.help) return console.log(help())
  if (o.version) return console.log(pkg.version)

  const doc = D.load()

  if (o.command === 'list') {
    console.log(`${doc.counts.total.toLocaleString('en-US')} items across ${doc.domains.length} domain(s)\n`)
    for (const d of doc.domains) {
      const n = doc.counts.by_domain[d.id] || 0
      console.log(`  ${d.id.padEnd(14)} ${String(n).padStart(5)}  ${d.description}`)
      for (const a of d.areas) {
        const an = doc.items.filter((i) => i.domain === d.id && i.area === a.id).length
        console.log(`    ${a.id.padEnd(22)} ${String(an).padStart(5)}  ${a.label}`)
      }
    }
    const sn = doc.items.filter((i) => i.stack !== 'any').length
    console.log(`\n  ${'stacks'.padEnd(14)} ${String(sn).padStart(5)}  ${doc.stacks.length} product supplements`)
    return
  }

  if (o.command === 'stacks') {
    console.log('Stacks with supplement files:\n')
    for (const s of D.knownStacks()) {
      const n = doc.items.filter((i) => i.stack === s).length
      console.log(`  ${s.padEnd(20)} ${String(n).padStart(4)} extra items`)
    }
    console.log(`\n  anything else        ${String(doc.counts.stack_agnostic).padStart(4)} items that name no product (they stand alone)`)
    console.log('\nAdd yours: https://github.com/FarzamHabibi/pre-production-checklist/blob/main/CONTRIBUTING.md')
    return
  }

  if (o.command === 'info') {
    console.log(`prodcheck ${pkg.version} — dataset v${doc.version}`)
    console.log(`  total items      ${doc.counts.total}`)
    for (const [d, n] of Object.entries(doc.counts.by_domain)) {
      console.log(`    ${d.padEnd(14)} ${n}`)
    }
    console.log(`  stack-agnostic   ${doc.counts.stack_agnostic}`)
    console.log(`  release gate     ${doc.counts.release_gate}`)
    console.log(`  license          ${doc.license}`)
    console.log(`  source           ${doc.source}`)
    return
  }

  const known = D.knownDomains()
  const badDomains = o.domains.filter((d) => !known.includes(d))
  if (badDomains.length) {
    fail(`unknown domain(s): ${badDomains.join(', ')} — expected ${known.join(', ')}`)
  }

  const validAreas = new Set(known.flatMap((d) => D.knownAreas(d)))
  const badAreas = o.areas.filter((a) => !validAreas.has(a))
  if (badAreas.length) {
    fail(`unknown area(s): ${badAreas.join(', ')} — expected ${[...validAreas].join(', ')}`)
  }

  const { unknown } = D.resolveStacks(o.stacks)
  if (unknown.length) {
    process.stderr.write(
      `note: no supplement file for ${unknown.join(', ')} — you get the items that name ` +
      "no product, which stand on their own.\n      Run 'npx prodcheck stacks' to see what exists, or add yours.\n\n"
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
      if (o.domains.length) bits.push(o.domains.map((d) => D.domainLabel(d)).join(', '))
      if (o.areas.length) bits.push(`area: ${o.areas.join(', ')}`)
      if (o.stacks.length) bits.push(`stack: ${o.stacks.join(', ')}`)
      if (o.gate) bits.push('release-blocking only')
      if (o.search) bits.push(`matching "${o.search}"`)
      const title = o.domains.length === 1
        ? `Pre-Production ${D.domainLabel(o.domains[0])} Checklist`
        : 'Pre-Production Checklist'
      output = D.toMarkdown(items, {
        title,
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
