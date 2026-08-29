'use strict'
/**
 * Shared data access for the CLI and the MCP server.
 * Zero dependencies — this ships in a security checklist, so its own supply chain
 * should be nothing.
 */
const fs = require('fs')
const path = require('path')

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'checklist.json')

let cache = null

function load () {
  if (cache) return cache
  try {
    cache = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
  } catch (err) {
    throw new Error(
      `could not read the checklist data at ${DATA_PATH}: ${err.message}\n` +
      'If you are running from a git clone, run ./scripts/build.sh first.'
    )
  }
  return cache
}

/** Normalize a stack name so "Next.js / React", "nextjs-react" and "NEXTJS/REACT" match. */
function normStack (s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function knownStacks () {
  return load().stacks.slice()
}

/** Domain ids in declared order, e.g. ['security', 'performance']. */
function knownDomains () {
  return load().domains.map((d) => d.id)
}

/** Area ids inside a domain, e.g. ['core', 'ai', 'ai-generated-code']. */
function knownAreas (domain) {
  const d = load().domains.find((x) => x.id === domain)
  return d ? d.areas.map((a) => a.id) : []
}

function domainLabel (id) {
  const d = load().domains.find((x) => x.id === id)
  return d ? d.label : id
}

/**
 * Every string that should resolve to a given stack: its display label and its file slug.
 * Users type the slug they saw in the repo ("rails"), not the label ("Ruby on Rails").
 */
function stackAliases () {
  const map = new Map()
  for (const i of load().items) {
    if (i.stack === 'any') continue
    if (!map.has(i.stack)) map.set(i.stack, new Set([normStack(i.stack)]))
    if (i.stack_id) map.get(i.stack).add(normStack(i.stack_id))
  }
  return map
}

/**
 * Resolve user-supplied stack names against the dataset.
 * Unknown names are returned separately rather than thrown: the core checklist stands on
 * its own, so asking for a stack nobody has written a file for is a valid thing to do.
 */
function resolveStacks (requested) {
  const index = new Map()
  for (const [label, aliases] of stackAliases()) {
    for (const a of aliases) index.set(a, label)
  }
  const matched = []
  const unknown = []
  for (const raw of requested) {
    const hit = index.get(normStack(raw))
    if (hit) { if (!matched.includes(hit)) matched.push(hit) } else unknown.push(raw)
  }
  return { matched, unknown }
}

/**
 * @param {object} opts
 * @param {string[]} [opts.stacks]   include supplements for these stacks
 * @param {string[]} [opts.domains]  security | scale | performance | integrations
 * @param {string[]} [opts.areas]    areas within a domain, e.g. core, ai
 * @param {string}   [opts.search]   case-insensitive substring on item text
 * @param {boolean}  [opts.gate]     only release-gate items
 * @param {number}   [opts.limit]
 */
function query (opts = {}) {
  const doc = load()
  let items = doc.items

  // No --stack means no product supplements. Generating a checklist that mixes Rails,
  // Django and iOS items for someone who uses none of them is worse than useless — it
  // teaches the reader to skim. `allStacks` is the deliberate "show me everything" view.
  if (opts.stacks && opts.stacks.length) {
    const want = new Set(resolveStacks(opts.stacks).matched)
    items = items.filter((i) => i.stack === 'any' || want.has(i.stack))
  } else if (!opts.allStacks) {
    items = items.filter((i) => i.stack === 'any')
  }
  if (opts.domains && opts.domains.length) {
    const want = new Set(opts.domains)
    items = items.filter((i) => want.has(i.domain))
  }
  if (opts.areas && opts.areas.length) {
    const want = new Set(opts.areas)
    items = items.filter((i) => want.has(i.area))
  }
  if (opts.search) {
    const q = String(opts.search).toLowerCase()
    items = items.filter((i) => i.text.toLowerCase().includes(q))
  }
  if (opts.gate) items = items.filter((i) => i.release_gate)
  if (opts.limit > 0) items = items.slice(0, opts.limit)
  return items
}

/** Group items into the order they appear, keyed by checklist + section. */
function groupItems (items) {
  const out = []
  let key = null
  for (const i of items) {
    // \u0000 as the separator, written as an escape rather than a raw byte: a literal
    // NUL in the source makes git treat this file as binary, which kills diffs and review.
    const k = `${i.checklist}\u0000${i.section}`
    if (k !== key) {
      key = k
      out.push({ checklist: i.checklist, section: i.section, domain: i.domain, items: [] })
    }
    out[out.length - 1].items.push(i)
  }
  return out
}

function toMarkdown (items, meta = {}) {
  const lines = []
  lines.push(`# ${meta.title || 'Pre-Production Security Checklist'}`, '')
  if (meta.subtitle) lines.push(meta.subtitle, '')
  // The legend uses a table rather than literal `* [ ]` lines on purpose: written the
  // obvious way, the legend itself parses as four checklist items on any round trip.
  lines.push(
    '| Mark | Meaning | Mark | Meaning |',
    '| --- | --- | --- | --- |',
    '| `[ ]` | Not checked | `[!]` | Security issue found |',
    '| `[x]` | Verified secure | `[N/A]` | Not applicable |',
    '',
    'Mark `[N/A]` aggressively — being honest about scope is what makes the rest',
    'trustworthy. For each `[!]` record: affected component, exact endpoint/file/config,',
    'attack precondition, proof of exploitability, business impact, severity, remediation,',
    'regression test, owner, date verified.',
    ''
  )
  let currentChecklist = null
  for (const block of groupItems(items)) {
    if (block.checklist !== currentChecklist) {
      currentChecklist = block.checklist
      lines.push('', '---', '', `## ${block.checklist}`, '')
    }
    if (block.section && block.section !== block.checklist) {
      lines.push(`### ${block.section}`, '')
    }
    for (const i of block.items) lines.push(`* [ ] ${i.text}`)
    lines.push('')
  }
  lines.push(
    '',
    '---',
    '',
    `${items.length} items · generated by \`prodcheck\` · CC BY 4.0`,
    'https://github.com/FarzamHabibi/pre-production-checklist',
    ''
  )
  return lines.join('\n')
}

module.exports = { load, query, knownStacks, knownDomains, knownAreas, domainLabel, stackAliases, resolveStacks, groupItems, toMarkdown, normStack, DATA_PATH }
