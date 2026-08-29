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
PRODCHECK_SITE="$SITE_URL" python3 scripts/build_site.py

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
