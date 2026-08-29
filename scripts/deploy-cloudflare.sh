#!/usr/bin/env bash
# Build and deploy the site to Cloudflare Pages.
#
#   wrangler login                       # once, opens a browser
#   ./scripts/deploy-cloudflare.sh       # every time after that
#
# The first run creates the project and prints the live URL. Direct upload, so nothing
# is connected to the repository and no API token is stored anywhere.
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT="${PRODCHECK_CF_PROJECT:-prodcheck}"
SITE_URL="${PRODCHECK_SITE:-https://${PROJECT}.pages.dev}"

echo "building for ${SITE_URL}"
# Search-engine ownership tokens. Public by nature — they only prove control of a site
# that is already public — but kept here rather than in the generator so a fork does not
# inherit them and so rotating one is a single line.
PRODCHECK_SITE="$SITE_URL" \
PRODCHECK_GOOGLE_VERIFY="${PRODCHECK_GOOGLE_VERIFY:-bz0Jm7FBM9_UPgG1Kn0XgI6tqVuDIXV_bZrEQ2Rtx30}" \
PRODCHECK_BING_VERIFY="${PRODCHECK_BING_VERIFY:-}" \
  python3 scripts/build_site.py

# Canonical tags, og:url and the sitemap all carry SITE_URL, so a build aimed at one host
# must not be uploaded to another.
if ! grep -q "rel=\"canonical\" href=\"${SITE_URL}/\"" site/index.html; then
  echo "error: built canonical does not match ${SITE_URL} — refusing to deploy" >&2
  exit 1
fi

npx --yes wrangler@latest pages deploy site \
  --project-name="$PROJECT" \
  --branch=main \
  --commit-dirty=true
