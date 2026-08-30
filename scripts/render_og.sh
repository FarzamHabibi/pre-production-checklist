#!/usr/bin/env bash
# Render site/og.svg to site-assets/og.png at 1200x630.
#
# og.png is the social preview every share of the site shows, and it was hand-made and
# static — so it kept claiming a long-superseded item count. The SVG is
# templated from the data now; this turns it back into the PNG the meta tags point at.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME — set CHROME=..." >&2; exit 1; }
python3 scripts/build_site.py >/dev/null
"$CHROME" --headless --disable-gpu --hide-scrollbars --default-background-color=00000000 \
  --window-size=1200,630 --screenshot="site-assets/og.png" \
  --virtual-time-budget=3000 "file://$PWD/site/og.svg" 2>/dev/null
# Stamp what the PNG was rendered from: site/og.svg, the rendered SVG with the real
# numbers substituted in — not site-assets/og.svg, which is the {{total}} template.
# A timestamp cannot do this job: git does not record mtime, so after a fresh checkout
# every file carries the same time and the comparison decides at random. That is how CI
# came to fail on a PNG that was in fact current.
shasum -a 256 site/og.svg | cut -d' ' -f1 > site-assets/og.png.sha
python3 scripts/build_site.py >/dev/null
echo "site-assets/og.png regenerated from the current data"
