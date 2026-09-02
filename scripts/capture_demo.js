#!/usr/bin/env node
'use strict'
/**
 * Capture demo/index.html as a frame sequence, by driving one Chrome over the DevTools
 * protocol.
 *
 * The obvious approach — `chrome --headless --screenshot` once per frame — reloads and
 * re-renders the whole page every time. At 12fps for one 53-second loop that is 636 cold
 * starts and the better part of an hour. This opens the browser once and asks it to
 * stream frames instead, which takes about as long as the loop itself.
 *
 * Zero dependencies: Node 22 ships a WebSocket client, and CDP is plain JSON over it.
 *
 *   node scripts/capture_demo.js [--fps 12] [--seconds 53] [--out demo/out/frames]
 */
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const arg = (name, dflt) => {
  const i = process.argv.indexOf('--' + name)
  return i === -1 ? dflt : process.argv[i + 1]
}
const FPS = +arg('fps', 12)
const SECONDS = +arg('seconds', 53)
const OUT = path.resolve(arg('out', 'demo/out/frames'))
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9222 + (process.pid % 500)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main () {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME} — set CHROME=...`)
  fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })

  // which demo to capture; both are 1280x720 scenes with the same controls
  const page = 'file://' + path.resolve(arg('page', 'demo/index.html')) + '?rec=1'
  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu',
    '--hide-scrollbars', '--window-size=1280,720', '--force-device-scale-factor=1',
    '--user-data-dir=' + fs.mkdtempSync('/tmp/prodcheck-demo-'),
    '--no-first-run', '--no-default-browser-check', page
  ], { stdio: 'ignore' })

  // wait for the debugger to answer, rather than guessing at a sleep
  let target = null
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250)
    try {
      const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())
      target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
    } catch { /* not up yet */ }
  }
  if (!target) { chrome.kill(); throw new Error('Chrome never opened its debugging port') }

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

  let id = 0
  const send = (method, params) => ws.send(JSON.stringify({ id: ++id, method, params }))

  let n = 0
  const stamps = []
  const want = FPS * SECONDS * 4   // a ceiling, not a target: the clock below ends it
  let done
  const finished = new Promise((r) => { done = r })

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.method !== 'Page.screencastFrame') return
    send('Page.screencastFrameAck', { sessionId: msg.params.sessionId })
    if (n >= want) return
    const name = String(n).padStart(5, '0') + '.png'
    fs.writeFileSync(path.join(OUT, name), Buffer.from(msg.params.data, 'base64'))
    // Screencast emits a frame when the page repaints, not on a clock — a static scene
    // sends almost none. Treating frame N as second N/FPS therefore time-warps the
    // result. Chrome stamps each frame, so record the real timing and let ffmpeg use it.
    stamps.push(msg.params.metadata.timestamp)
    n++
    const elapsed = stamps[stamps.length - 1] - stamps[0]
    if (n % 30 === 0) process.stdout.write(`\r  ${elapsed.toFixed(0)}s / ${SECONDS}s  (${n} frames)`)
    if (elapsed >= SECONDS || n >= want) done()
  }

  // everyFrame would follow the compositor; a fixed interval keeps frame N at N/FPS
  // seconds, which is what ffmpeg is about to assume.
  // --window-size sets the window, not the viewport: the first capture came back
  // 1280x633 and cut the bottom off the stage. Override the metrics so the viewport is
  // exactly the stage.
  send('Emulation.setDeviceMetricsOverride',
    { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false })
  send('Page.enable')
  await sleep(600)
  send('Page.startScreencast', { format: 'png', maxWidth: 1280, maxHeight: 720, everyNthFrame: 1 })

  const guard = setTimeout(done, (SECONDS + 25) * 1000)
  await finished
  clearTimeout(guard)

  send('Page.stopScreencast')
  await sleep(200)
  ws.close(); chrome.kill()
  // an ffconcat manifest carrying each frame's true on-screen duration
  const lines = ['ffconcat version 1.0']
  for (let i = 0; i < n; i++) {
    const dur = (i + 1 < n ? stamps[i + 1] - stamps[i] : 1 / FPS)
    lines.push(`file '${String(i).padStart(5, '0')}.png'`, `duration ${Math.max(dur, 0.001).toFixed(4)}`)
  }
  lines.push(`file '${String(n - 1).padStart(5, '0')}.png'`)   // ffconcat wants the last one twice
  fs.writeFileSync(path.join(OUT, 'frames.ffconcat'), lines.join('\n') + '\n')

  const span = stamps.length > 1 ? stamps[stamps.length - 1] - stamps[0] : 0
  console.log(`\n  ${n} frames over ${span.toFixed(1)}s of page time` +
              ` -> ${path.relative(process.cwd(), OUT)}`)
}

main().catch((e) => { console.error('capture failed:', e.message); process.exit(1) })
