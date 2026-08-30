#!/usr/bin/env bash
# Capture demo/index.html to an MP4 and a GIF, without a screen recorder.
#
# Screen-recording a browser means catching the window at the right moment, at the right
# size, with no notification sliding in. This drives a headless Chrome instead: fixed
# 1280x720, fixed frame interval, one full loop, deterministic every run.
#
#   scripts/record_demo.sh            one loop, mp4 + gif
#   FPS=20 scripts/record_demo.sh     smoother, larger files
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
FPS="${FPS:-12}"
SECONDS_TOTAL="${SECONDS_TOTAL:-53}"   # one full loop; see the header of demo/index.html
OUT="${OUT:-demo/out}"

[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME — set CHROME=..." >&2; exit 1; }
command -v ffmpeg >/dev/null || {
  echo "ffmpeg not found. brew install ffmpeg — or record the page with Loom instead." >&2
  exit 1; }

python3 scripts/build_demo.py >/dev/null
rm -rf "$OUT/frames"; mkdir -p "$OUT/frames"

node scripts/capture_demo.js --fps "$FPS" --seconds "$SECONDS_TOTAL" --out "$OUT/frames"

# the manifest carries each frame's true duration, so the video runs at real speed
# The manifest carries each frame's true on-screen duration, so the video runs at real
# speed. -r alone resamples that variable timing onto a constant rate; asking for both
# -vsync vfr and -r is contradictory and ffmpeg refuses.
ffmpeg -y -loglevel error -f concat -safe 0 -i "$OUT/frames/frames.ffconcat" \
  -r "$FPS" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$OUT/demo.mp4"

# A shared palette keeps the greens from banding. 720px/10fps/64 colours is the knee of
# the curve — below it the type stops being readable, above it the file doubles without
# looking better. It still lands near 2.5MB, which is why the site plays the mp4 and
# keeps this as the fallback.
ffmpeg -y -loglevel error -i "$OUT/demo.mp4" \
  -vf "fps=10,scale=720:-1:flags=lanczos,palettegen=max_colors=64:stats_mode=diff" "$OUT/pal.png"
ffmpeg -y -loglevel error -i "$OUT/demo.mp4" -i "$OUT/pal.png" \
  -lavfi "fps=10,scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
  "$OUT/demo.gif"

# a still for the video poster, so the box is never blank while the file loads
ffmpeg -y -loglevel error -ss 2.2 -i "$OUT/demo.mp4" -frames:v 1 "$OUT/poster.png"

rm -f "$OUT/pal.png"
echo
ls -lh "$OUT/demo.mp4" "$OUT/demo.gif" | awk '{print "  " $9 "  " $5}'
echo "  frames kept in $OUT/frames — delete when you are happy with the result"
