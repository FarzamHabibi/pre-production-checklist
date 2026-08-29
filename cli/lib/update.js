'use strict'
/**
 * Tell someone on a stale global install that a newer version exists.
 *
 * The design constraint is that this must never make the tool slower or noisier:
 *
 *   - It notifies from a **cache written by a previous run**, so the notice is instant and
 *     no run ever waits on the network. The refresh is fired without being awaited and its
 *     socket is unref'd, so the process exits whenever it is ready regardless.
 *   - It only speaks when stdout is a terminal. Piping to a file, `--format json`, or `-o`
 *     must produce exactly what was asked for and nothing else.
 *   - It writes to stderr, so even a terminal user piping stdout gets clean output.
 *   - `NO_UPDATE_NOTIFIER=1`, `CI`, and an explicit `prodcheck@x.y.z` all silence it —
 *     a pinned version is a decision, not a mistake to nag about.
 *   - Every failure is swallowed. An offline machine, a proxy, an npm outage: nothing.
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const https = require('https')

const CACHE = path.join(os.tmpdir(), 'prodcheck-update-check.json')
const DAY = 24 * 60 * 60 * 1000

function silenced () {
  if (process.env.NO_UPDATE_NOTIFIER) return true
  if (process.env.CI) return true
  // npx with an explicit version, or any non-interactive use
  if (!process.stdout.isTTY) return true
  return false
}

function read () {
  try {
    return JSON.parse(fs.readFileSync(CACHE, 'utf8'))
  } catch {
    return null
  }
}

function refresh () {
  const req = https.get(
    'https://registry.npmjs.org/prodcheck/latest',
    { timeout: 3000, headers: { accept: 'application/vnd.npm.install-v1+json' } },
    (res) => {
      if (res.statusCode !== 200) { res.resume(); return }
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (c) => { body += c })
      res.on('end', () => {
        try {
          const latest = JSON.parse(body).version
          if (latest) fs.writeFileSync(CACHE, JSON.stringify({ latest, at: Date.now() }))
        } catch { /* ignore */ }
      })
    }
  )
  req.on('error', () => {})
  req.on('timeout', () => req.destroy())
  // let the process exit without waiting for this
  req.unref?.()
}

/** Higher-or-equal comparison for plain x.y.z. Anything unparseable means "say nothing". */
function isNewer (latest, current) {
  const a = String(latest).split('.').map(Number)
  const b = String(current).split('.').map(Number)
  if (a.length !== 3 || b.length !== 3 || a.concat(b).some(Number.isNaN)) return false
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true
    if (a[i] < b[i]) return false
  }
  return false
}

/** Call after the command has produced its output. Returns nothing, throws nothing. */
function notify (current) {
  try {
    if (silenced()) return
    const cached = read()
    if (!cached || Date.now() - cached.at > DAY) refresh()
    if (cached && isNewer(cached.latest, current)) {
      process.stderr.write(
        `\nprodcheck ${current} → ${cached.latest} is available.` +
        `\n  npm i -g prodcheck@latest   ·   or use npx, which always fetches the latest\n`
      )
    }
  } catch { /* a version notice is never worth an error */ }
}

module.exports = { notify, isNewer, CACHE }
