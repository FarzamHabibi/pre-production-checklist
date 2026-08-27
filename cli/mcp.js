#!/usr/bin/env node
'use strict'
/**
 * MCP stdio server exposing the pre-production checklist to coding agents.
 *
 * Implemented against the protocol directly rather than the SDK: this package ships in a
 * security repository, and "zero dependencies" is a claim worth keeping literal. The
 * stdio transport is newline-delimited JSON-RPC 2.0, which is small enough to do by hand.
 *
 * The server is read-only. It has no filesystem, network, or shell access beyond reading
 * its own bundled data file.
 */
const D = require('./lib/data')
const pkg = require('../package.json')

const SUPPORTED_PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05']
const DEFAULT_PROTOCOL = SUPPORTED_PROTOCOLS[0]

const STACK_ENUM_HINT = () => D.knownStacks().join(', ')

const TOOLS = [
  {
    name: 'checklist_for_stack',
    description:
      'Return the pre-production security checklist that applies to a given stack: every ' +
      'stack-agnostic item plus the supplements for the named products. A stack with no ' +
      'supplement file is not an error — you get the stack-agnostic core, which stands on ' +
      'its own. Use this when asked to review or prepare a project for production.',
    inputSchema: {
      type: 'object',
      properties: {
        stacks: {
          type: 'array', items: { type: 'string' },
          description: `Products in use. Supplements exist for: ${STACK_ENUM_HINT()}. Any other name is accepted and simply adds nothing.`
        },
        groups: {
          type: 'array',
          items: { type: 'string', enum: ['core', 'ai', 'vibe-coding', 'stacks'] },
          description: 'core = any stack; ai = LLM/agent features; vibe-coding = bugs AI assistants write. Omit for all.'
        },
        release_gate_only: { type: 'boolean', description: 'Only items that should block a release.' },
        limit: { type: 'integer', description: 'Cap the number of items returned. Omit for all.' }
      }
    }
  },
  {
    name: 'search_checklist',
    description:
      'Search checklist items by text. Use when you want the checks relevant to one topic ' +
      '(for example "CORS", "RLS", "prompt injection", "signed URL") rather than a whole checklist.',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'Case-insensitive substring match on item text.' },
        stacks: { type: 'array', items: { type: 'string' } },
        groups: { type: 'array', items: { type: 'string', enum: ['core', 'ai', 'vibe-coding', 'stacks'] } },
        limit: { type: 'integer', description: 'Default 50.' }
      }
    }
  },
  {
    name: 'release_gate',
    description:
      'Return only the items that should block a release. The fastest useful answer to ' +
      '"is this safe to ship?". 236 items across application, AI, and AI-assisted-coding gates.',
    inputSchema: {
      type: 'object',
      properties: { stacks: { type: 'array', items: { type: 'string' } } }
    }
  },
  {
    name: 'list_checklists',
    description:
      'List every checklist in the dataset with its group and item count, plus which stacks ' +
      'have supplement files. Call this first if you are not sure what is available.',
    inputSchema: { type: 'object', properties: {} }
  }
]

// ----------------------------------------------------------------- formatting
function renderItems (items, header) {
  if (!items.length) return `${header}\n\nNo items matched.`
  const lines = [header, '']
  let checklist = null
  let section = null
  for (const i of items) {
    if (i.checklist !== checklist) {
      checklist = i.checklist
      section = null
      lines.push('', `## ${i.checklist}`)
    }
    if (i.section !== section) {
      section = i.section
      if (section && section !== checklist) lines.push('', `### ${section}`)
      lines.push('')
    }
    lines.push(`* [ ] ${i.text}`)
  }
  return lines.join('\n')
}

function runTool (name, args) {
  const a = args || {}
  switch (name) {
    case 'checklist_for_stack': {
      const stacks = a.stacks || []
      const { matched, unknown } = D.resolveStacks(stacks)
      const items = D.query({
        stacks, groups: a.groups, gate: a.release_gate_only, limit: a.limit
      })
      const notes = [`${items.length} items.`]
      if (matched.length) notes.push(`Supplements included: ${matched.join(', ')}.`)
      if (unknown.length) {
        notes.push(
          `No supplement file for ${unknown.join(', ')} — these results are the ` +
          'stack-agnostic core, which stands on its own.'
        )
      }
      return renderItems(items, notes.join(' '))
    }
    case 'search_checklist': {
      if (!a.query) throw new Error('search_checklist requires a "query" argument')
      const items = D.query({
        search: a.query, stacks: a.stacks, groups: a.groups, limit: a.limit || 50
      })
      return renderItems(items, `${items.length} items matching "${a.query}".`)
    }
    case 'release_gate': {
      const items = D.query({ stacks: a.stacks, gate: true })
      return renderItems(items, `${items.length} release-blocking items.`)
    }
    case 'list_checklists': {
      const doc = D.load()
      const seen = new Map()
      for (const i of doc.items) {
        const k = `${i.group}/${i.checklist}`
        seen.set(k, (seen.get(k) || 0) + 1)
      }
      const lines = [`${doc.counts.total} items across ${seen.size} checklists.`, '']
      let group = null
      for (const [k, n] of seen) {
        const [g, title] = k.split('/')
        if (g !== group) { group = g; lines.push('', `## ${g}`, '') }
        lines.push(`- ${title} — ${n} items`)
      }
      lines.push('', '## stacks with supplement files', '', D.knownStacks().join(', '))
      lines.push('', `${doc.counts.stack_agnostic} of ${doc.counts.total} items name no product at all.`)
      return lines.join('\n')
    }
    default:
      throw new Error(`unknown tool: ${name}`)
  }
}

// ----------------------------------------------------------------- transport
function send (msg) {
  process.stdout.write(JSON.stringify(msg) + '\n')
}

function reply (id, result) {
  send({ jsonrpc: '2.0', id, result })
}

function replyError (id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } })
}

function handle (msg) {
  const { id, method, params } = msg
  const isNotification = id === undefined || id === null

  switch (method) {
    case 'initialize': {
      const asked = params && params.protocolVersion
      const version = SUPPORTED_PROTOCOLS.includes(asked) ? asked : DEFAULT_PROTOCOL
      return reply(id, {
        protocolVersion: version,
        capabilities: { tools: {} },
        serverInfo: { name: 'prodcheck', version: pkg.version },
        instructions:
          'Pre-production security checklists. Call list_checklists to see what exists, ' +
          'checklist_for_stack to get the items that apply to a project, release_gate for ' +
          'the blocking subset, and search_checklist for one topic. Read-only.'
      })
    }
    case 'notifications/initialized':
    case 'initialized':
      return // notification: no response
    case 'ping':
      return reply(id, {})
    case 'tools/list':
      return reply(id, { tools: TOOLS })
    case 'tools/call': {
      const name = params && params.name
      try {
        const text = runTool(name, params && params.arguments)
        return reply(id, { content: [{ type: 'text', text }] })
      } catch (err) {
        // Tool failures are reported in-band so the model can correct itself,
        // per the MCP spec, rather than as protocol errors.
        return reply(id, { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true })
      }
    }
    default:
      if (isNotification) return
      return replyError(id, -32601, `method not found: ${method}`)
  }
}

let buffer = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => {
  buffer += chunk
  let nl
  while ((nl = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, nl).trim()
    buffer = buffer.slice(nl + 1)
    if (!line) continue
    let msg
    try {
      msg = JSON.parse(line)
    } catch {
      replyError(null, -32700, 'parse error')
      continue
    }
    try {
      handle(msg)
    } catch (err) {
      if (msg.id !== undefined && msg.id !== null) {
        replyError(msg.id, -32603, `internal error: ${err.message}`)
      }
    }
  }
})
// Deliberately no process.exit() here. stdout on a pipe is asynchronous, and exiting on
// stdin's 'end' discards whatever is still buffered — which silently truncates any tool
// response larger than the pipe buffer (~8 KB), i.e. most real ones. Letting the event
// loop drain naturally is the fix.
process.stdin.on('end', () => { process.exitCode = 0 })
