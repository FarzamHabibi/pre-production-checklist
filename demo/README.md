# demo

A scripted, looping replay of what prodcheck does, built to be recorded.

## Why scripted

A real agent run takes half a minute of thinking, produces different output every time,
and cannot be looped or cut to length. This replays a fixed scene at a controlled pace,
so one take is the take, and re-recording after a copy change is a single command.

Scripted is not invented. Every number comes from `data/checklist.json`, and every quoted
line comes from `evals/fixtures/flawed/src/app.js`, which genuinely contains those
defects at those line numbers. `scripts/build_demo.py` fills them in and refuses to build
if a finding would point at a line the code pane does not show.

## Watch it

```bash
open demo/index.html
```

It loops for as long as you leave it open. `space` pauses, `R` restarts, `H` hides the
keyboard hint. Add `?rec=1` to hide the hint from the start.

## Record it

Two ways, depending on what you want.

**Loom, or any screen recorder.** Open `demo/index.html?rec=1`, make the window big
enough that the 1280×720 stage is not scaled, and record. Best when you want to talk over
it.

**Headless, no recorder:**

```bash
scripts/record_demo.sh
```

Writes `demo/out/demo.mp4` and `demo/out/demo.gif`. It drives one Chrome over the
DevTools protocol and streams frames out, so the capture takes about as long as the loop
and comes out identical every run. `FPS=20 scripts/record_demo.sh` for smoother and
larger.

A note on the timing: Chrome emits a screencast frame when the page repaints, not on a
clock, so a still scene sends almost none. The capture records each frame's real
timestamp and hands ffmpeg a manifest of true durations — without that the video runs at
the wrong speed, with still scenes rushing past.

## Change it

Scene text lives in `demo/index.html`, in the `build()` function — one entry per scene,
with its duration in milliseconds. Which findings to show, and how much code to show
around them, are at the top of `scripts/build_demo.py`. Re-run it after either.

## Two loops

`index.html` shows what the checklist contains — the domains, the scoping, the evidence
discipline. `chat.html` answers a different question, asked in issue #10: what does using
it look like, turn by turn, in the assistant you already have open.

Both are scripted, because a real agent run takes half a minute of thinking, differs every
time, and cannot be cut to length. Neither is invented. In `chat.html` the tool name and
arguments are a real MCP call — `scripts/build_chat.py` makes the call and reads the item
count off the response rather than typing a number — and the findings cite lines that
genuinely contain those defects.

```bash
python3 scripts/build_chat.py                              # refresh from the data
node scripts/capture_demo.js --page demo/chat.html \
     --fps 15 --seconds 16 --out demo/out/chat-frames      # record it
```
