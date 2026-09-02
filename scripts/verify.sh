#!/usr/bin/env bash
# Everything that must hold before a push. Run it; do not push on a red result.
#
# CI runs the same checks, but CI tells you after the push. This tells you before,
# which is the only difference that matters when the fix is a one-line count.
#
#   ./scripts/verify.sh
#
set -uo pipefail
cd "$(dirname "$0")/.."

fail=0
step () { printf '  %-46s' "$1"; }
ok   () { printf 'ok\n'; }
bad  () { printf 'FAIL\n'; fail=1; }

echo
echo "verifying $(basename "$PWD")"
echo

# ---------------------------------------------------------------- generated files
step "generated files are current"
# Content, not a file count. Counting how many files git calls modified cannot see a
# regeneration that rewrites an already-dirty file — and the tree is nearly always dirty
# when this runs, which is the only time it matters. A hand-edit to a generated file was
# silently repaired here and reported as ok.
tree_hash() {
  { git ls-files -z | xargs -0 shasum 2>/dev/null
    git ls-files --others --exclude-standard | sort; } | shasum | cut -d' ' -f1
}
before=$(tree_hash)
./scripts/build.sh >/dev/null 2>&1 || { bad; echo "     build.sh itself failed"; }
after=$(tree_hash)
if [ "$before" = "$after" ]; then ok; else
  bad; echo "     build.sh rewrote tracked content — a generated file was edited by hand"
  git status --porcelain | head -5 | sed 's/^/       /'
fi

# ---------------------------------------------------------------- tests
step "tests"
if out=$(node cli/test.js 2>&1); then ok; else
  bad; echo "$out" | grep -A2 FAIL | head -12 | sed 's/^/     /'
fi

# ---------------------------------------------------------------- evals
step "eval harness intact"
if out=$(node evals/structure.test.js 2>&1); then ok; else
  bad; echo "$out" | grep -A2 FAIL | head -10 | sed 's/^/     /'
fi

# ---------------------------------------------------------------- links
step "internal links resolve"
if out=$(python3 - <<'PY'
import re, os, sys
bad = []
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ('.git', 'node_modules')]
    for f in files:
        if not f.endswith('.md'):
            continue
        p = os.path.join(root, f)
        for m in re.finditer(r'\]\(([^)#][^)]*?)(#[^)]*)?\)', open(p, encoding='utf-8').read()):
            t = m.group(1)
            if t.startswith(('http', 'mailto')):
                continue
            if not os.path.exists(os.path.normpath(os.path.join(root, t))):
                bad.append(f"{p} -> {t}")
for b in bad:
    print(b)
sys.exit(1 if bad else 0)
PY
); then ok; else bad; echo "$out" | head -8 | sed 's/^/     /'; fi

# ---------------------------------------------------------------- docs agree with data
step "docs agree with the data"
if out=$(python3 - <<'PY'
import json, re, sys, os
doc = json.load(open('data/checklist.json', encoding='utf-8'))
problems = []

per_file = {}
for i in doc['items']:
    per_file[i['source']['file']] = per_file.get(i['source']['file'], 0) + 1

readme = open('README.md', encoding='utf-8').read()
for m in re.finditer(r'\[[^\]]+\]\((checklists/(?!stacks/)[a-z0-9/-]+\.md)\)\s*\|\s*\*{0,2}(\d+)', readme):
    f, claimed = m.group(1), int(m.group(2))
    if per_file.get(f) != claimed:
        problems.append(f"README: {f} claims {claimed}, actual {per_file.get(f)}")

# The structure block is a folder tree, so it holds folder counts. A domain total is
# larger, because stack supplements contribute to the domain they extend.
by_folder = {}
for i in doc['items']:
    top = i['source']['file'].split('/')[1]
    by_folder[top] = by_folder.get(top, 0) + 1
for d, n in by_folder.items():
    hit = re.search(rf'{d}/\s+([\d,]+)\s+', readme)
    if hit and int(hit.group(1).replace(',', '')) != n:
        problems.append(f"README structure block: {d}/ claims {hit.group(1)}, folder holds {n}")

head = re.search(r'<!-- counts:begin -->\n(.*?)\n<!-- counts:end -->', readme, re.S)
if not head:
    problems.append("README: counts markers missing")
elif f"{doc['counts']['total']:,}" not in head.group(1):
    problems.append(f"README headline does not state {doc['counts']['total']:,}")

# every domain that exists on disk is described in the README
for d in doc['counts']['by_domain']:
    if f'checklists/{d}/' not in readme:
        problems.append(f"README never links to the {d}/ domain")

# package.json description is the generated one
pkg = json.load(open('package.json', encoding='utf-8'))
if f"{doc['counts']['total']:,}" not in pkg['description']:
    problems.append("package.json description is stale — run build.sh")

# Counts written into prose go stale silently. The MCP release_gate description claimed
# 236 items long after the real number passed 300 — and that sentence is what a model
# reads when deciding whether to call the tool.
gate_total = sum(1 for i in doc['items'] if i['release_gate'])
generic_gate = sum(1 for i in doc['items'] if i['release_gate'] and i['stack'] == 'any')
for f, claimed in (('docs/mcp-clients.md', generic_gate),):
    body = open(f, encoding='utf-8').read()
    hit = re.search(r'`npx prodcheck --gate`[^.]*?(\d[\d,]*) items', body)
    if not hit:
        problems.append(f"{f}: cannot find the --gate item count to check")
    elif int(hit.group(1).replace(',', '')) != claimed:
        problems.append(f"{f} says the gate has {hit.group(1)} items, actual {claimed}")
for f in ('cli/mcp.js',):
    body = open(f, encoding='utf-8').read()
    stale = re.search(r'\b(\d{2,4}) items across\b', body)
    if stale:
        problems.append(f"{f} hardcodes a gate count ({stale.group(1)}) — derive it instead")

# server.json pins the version published to the MCP registry. It does not move with a
# release, so without this the registry quietly keeps advertising an old version.
if os.path.exists('server.json'):
    sj = json.load(open('server.json', encoding='utf-8'))
    pkgv = json.load(open('package.json', encoding='utf-8'))['version']
    if sj.get('version') != pkgv:
        problems.append(f"server.json says {sj.get('version')}, package.json says {pkgv} "
                        f"— update it and re-run: mcp-publisher publish")
    for pk in sj.get('packages', []):
        if pk.get('version') != pkgv:
            problems.append(f"server.json package version {pk.get('version')} != {pkgv}")

sidebar = open('.github/description.txt', encoding='utf-8').read().strip()
if f"{doc['counts']['total']:,}" not in sidebar:
    problems.append(".github/description.txt is stale — run build.sh")

# The start prompt is shown in three places. It is generated from scripts/prompt.py into
# two of them, so a hand-edit to either copy is drift, not a change.
sys.path.insert(0, 'scripts')
import prompt as promptmod
canonical = promptmod.start_prompt(doc['counts']['total'])
for f in ('README.md', 'docs/prompts.md'):
    body = open(f, encoding='utf-8').read()
    m = re.search(r'<!-- start-prompt:begin -->\n```text\n(.*?)\n```\n<!-- start-prompt:end -->',
                  body, re.S)
    if not m:
        problems.append(f"{f}: start-prompt markers missing or malformed")
    elif m.group(1) != canonical:
        problems.append(f"{f}: start prompt differs from scripts/prompt.py — run build.sh")

for p in problems:
    print(p)
sys.exit(1 if problems else 0)
PY
); then ok; else bad; echo "$out" | head -10 | sed 's/^/     /'; fi

# ---------------------------------------------------------------- site
step "site builds, complete and in sync"
if out=$(python3 scripts/build_site.py 2>&1); then
  # every number on the site must come from the data, so the site cannot disagree
  # with the checklists. A literal count typed into the generator would survive a
  # data change; this catches that.
  total=$(python3 -c "import json;print(json.load(open('data/checklist.json'))['counts']['total'])")
  pretty=$(python3 -c "print(f'{$total:,}')")
  miss=""
  grep -q "$pretty" site/index.html || miss="index.html missing the current total ($pretty)"

  # style-src 'self' blocks a style="" attribute exactly as it blocks a <style> block.
  # Thirteen of them shipped and were inert on the live site for days: the classes
  # underneath supplied a near-enough value, so nothing looked broken and no test failed.
  if inline=$(grep -ho 'style="[^"]*"' site/*.html site/*/*.html 2>/dev/null | head -3); then
    if [ -n "$inline" ]; then
      miss="inline style attributes are blocked by our own CSP — move them to style.css: $(echo "$inline" | tr '\n' ' ')"
    fi
  fi

  # The social preview is what every share of this site shows. It was a hand-made static
  # asset and kept claiming a long-superseded item count.
  grep -q "$pretty" site/og.svg 2>/dev/null || miss="og.svg does not carry the current total ($pretty)"
  if ! python3 - <<'PY3'
import hashlib, os, sys
png = "site-assets/og.png"
svg = "site/og.svg"          # the rendered SVG, not the {{total}} template
stamp = "site-assets/og.png.sha"
# Compare content, not mtime. git does not record modification times, so after a fresh
# checkout the PNG and the SVG carry the same timestamp and an mtime comparison decides
# at random — it failed CI on a PNG that was current. render_og.sh stamps the hash of
# the rendered SVG it screenshotted; if that no longer matches, the PNG really is stale.
# build_site.py has already run by this point, so site/og.svg exists in CI too.
for f in (png, svg, stamp):
    if not os.path.exists(f):
        print(f"{f} is missing — run scripts/render_og.sh"); sys.exit(1)
want = open(stamp, encoding="utf-8").read().strip()
got = hashlib.sha256(open(svg, "rb").read()).hexdigest()
if want != got:
    print("site-assets/og.png was rendered from a different og.svg — run scripts/render_og.sh")
    sys.exit(1)
PY3
  then miss="og.png is stale — run scripts/render_og.sh"; fi

  # the start prompt on the page is the same one the README and docs carry
  if ! python3 - <<'PY2'
import html, json, re, sys
sys.path.insert(0, "scripts")
import prompt as promptmod
doc = json.load(open("data/checklist.json", encoding="utf-8"))
page = open("site/index.html", encoding="utf-8").read()
m = re.search(r'<pre id="c-start"><code>(.*?)</code></pre>', page, re.S)
if not m:
    print("site/index.html has no start prompt block"); sys.exit(1)
if html.unescape(m.group(1)) != promptmod.start_prompt(doc["counts"]["total"]):
    print("site start prompt differs from scripts/prompt.py"); sys.exit(1)
PY2
  then miss="site start prompt is out of sync with scripts/prompt.py"; fi
  grep -q "$pretty" site/llms.txt   || miss="llms.txt missing the current total"
  # CNAME is deliberately absent until the custom domain resolves — see build_site.py
  for f in sitemap.xml robots.txt llms.txt favicon.svg og.png style.css; do
    [ -f "site/$f" ] || miss="site/$f not generated"
  done
  if stale=$(grep -oE '\b[0-9],[0-9]{3}\b' scripts/build_site.py | head -1); then
    miss="scripts/build_site.py contains a hardcoded count: $stale"
  fi
  # a CNAME must match the base URL the pages actually claim, or Pages redirects the
  # working host to one that may not resolve — which is how the site went dark once
  # sitebase is host+path (a project Pages site lives under a path); sitehost is the
  # bare host, which is the only thing a CNAME file can name.
  sitebase=$(grep -m1 -o 'rel="canonical" href="[^"]*"' site/index.html \
             | sed 's|.*href="https://||; s|"$||; s|/$||')
  sitehost=${sitebase%%/*}
  if [ -f site/CNAME ]; then
    cname=$(tr -d '\n' < site/CNAME)
    [ "$cname" = "$sitehost" ] || miss="site/CNAME is $cname but pages canonicalise to $sitehost"
  fi
  # and the canonical host must be one that resolves
  if ! curl -s -o /dev/null --max-time 12 "https://$sitehost/" 2>/dev/null; then
    echo "     note: could not reach https://$sitehost (network, not necessarily a fault)"
  fi

  # The README's own site link must be the host the build stamps into every canonical
  # tag. A broad "no doc mentions another host" rule fires on instructions too, and a
  # check that flags correct content teaches people to ignore it — so this checks the
  # one link that is a claim about where the site lives.
  readme_site=$(grep -m1 -oE '\[→ Browse the site\]\(https://[^)]*' README.md \
                | sed 's|.*(https://||; s|/$||')
  if [ -n "$readme_site" ] && [ "$readme_site" != "$sitebase" ]; then
    miss="README links to https://$readme_site but pages canonicalise to https://$sitebase"
  fi

  # The gate compared the built site against the data, never the deployed one. Because
  # the mirror deploys automatically on push and the primary is a manual command, the
  # primary silently fell a release behind while every check stayed green. A warning
  # rather than a failure: pushing before deploying is legitimate, forgetting is not.
  live=$(curl -s --max-time 12 "https://$sitehost/" 2>/dev/null \
         | grep -oE '[0-9],[0-9]{3} things to check' | head -1 | cut -d' ' -f1)
  if [ -n "$live" ] && [ "$live" != "$pretty" ]; then
    echo "     note: the deployed site says $live, the data says $pretty —"
    echo "           run ./scripts/deploy-cloudflare.sh (needs 'npx wrangler login' first)"
  fi

  # The CSP pins the inline script by hash. If the script changes and the hash does not,
  # the browser blocks every script on the site — copy buttons, search, filters — and the
  # pages still render, so nothing looks broken until someone clicks.
  csp_hash=$(python3 - <<'PY2'
import re, base64, hashlib, sys
html = open("site/index.html", encoding="utf-8").read()
m = re.search(r"<script>(.*?)</script>", html, re.S)
if not m:
    print("no inline script found in site/index.html"); sys.exit(0)
want = "sha256-" + base64.b64encode(hashlib.sha256(m.group(1).encode()).digest()).decode()
got = re.search(r"script-src '([^']*)'", open("site/_headers", encoding="utf-8").read())
got = got.group(1) if got else "(none)"
if want != got:
    print(f"CSP script-src is {got} but the shipped script hashes to {want}")
PY2
)
  [ -n "$csp_hash" ] && miss="$csp_hash"

  # Every place that claims "the site lives here" must name the canonical host. The
  # README was checked; package.json's homepage and the GitHub Website field were not,
  # and both sat on a domain the js.org request had been declined for — one of them on
  # the published npm page.
  pkg_home=$(python3 -c "import json;print(json.load(open('package.json')).get('homepage',''))" \
             | sed 's|https://||; s|/$||')
  if [ -n "$pkg_home" ] && [ "$pkg_home" != "$sitebase" ]; then
    miss="package.json homepage is https://$pkg_home but pages canonicalise to https://$sitebase"
  fi
  if command -v gh >/dev/null 2>&1; then
    gh_home=$(gh repo view --json homepageUrl --jq '.homepageUrl // ""' 2>/dev/null \
              | sed 's|https://||; s|/$||')
    if [ -n "$gh_home" ] && [ "$gh_home" != "$sitebase" ]; then
      miss="the GitHub Website field is https://$gh_home but pages canonicalise to https://$sitebase"
    fi
    # The gate checked that description.txt was regenerated, never that GitHub was told.
    # CI caught the drift instead — after the push, which is the wrong end.
    gh_desc=$(gh repo view --json description --jq '.description // ""' 2>/dev/null)
    want_desc=$(cat .github/description.txt 2>/dev/null)
    if [ -n "$gh_desc" ] && [ "$gh_desc" != "$want_desc" ]; then
      miss="the GitHub description has drifted — run: gh repo edit --description \"\$(cat .github/description.txt)\""
    fi
  fi

  # The markdown link check above never looked at the generated site. Restructuring the
  # output to directory URLs broke 91 of its links and the gate stayed green.
  sitelinks=$(python3 - <<'PY2'
import re, os
bad = []
for root, _, files in os.walk("site"):
    for f in files:
        if not f.endswith(".html"):
            continue
        p = os.path.join(root, f)
        for m in re.finditer(r'(?:href|src)="([^"#:]+)"', open(p, encoding="utf-8").read()):
            # style.css?v=<hash> is one file, not a missing one: strip the cache-busting
            # query before resolving the path
            t = m.group(1)
            if t.startswith(("http", "mailto", "data:", "/")) or not t:
                continue
            t = t.split("?", 1)[0]
            if not t:
                continue
            tgt = os.path.normpath(os.path.join(root, t))
            if os.path.isdir(tgt):
                tgt = os.path.join(tgt, "index.html")
            if not os.path.exists(tgt):
                bad.append(f"{p} -> {t}")
print("; ".join(bad[:3]) + (f" (+{len(bad)-3} more)" if len(bad) > 3 else ""))
PY2
)
  [ -n "$sitelinks" ] && miss="broken links in the generated site: $sitelinks"

  # every integration listed in the manifest must have the doc it points at
  docmiss=$(python3 - <<'PY2'
import json, os
m = json.load(open("data/integrations.json", encoding="utf-8"))
bad = []
for g in m["groups"]:
    for t in g["tools"]:
        d = t["doc"].split("#")[0]
        if d.startswith(".."):
            continue
        if not os.path.exists(os.path.join("docs", d)):
            bad.append(f'{t["id"]} -> docs/{d}')
print("; ".join(bad))
PY2
)
  [ -n "$docmiss" ] && miss="integrations manifest points at missing docs: $docmiss"
  if [ -n "$miss" ]; then bad; echo "     $miss"; else ok; fi
else
  bad; echo "$out" | tail -4 | sed 's/^/     /'
fi

# ---------------------------------------------------------------- expansion plan status
step "plan status matches what shipped"
if out=$(python3 - <<'PY'
import json, os, sys
doc = json.load(open('data/checklist.json', encoding='utf-8'))
plan = os.path.expanduser('~/Desktop/jetro/docs/pre-production-checklist/00-expansion-plan.md')
if not os.path.exists(plan):
    sys.exit(0)                                  # plan lives outside this repo; skip if absent
text = open(plan, encoding='utf-8').read()
missing = [d for d in doc['counts']['by_domain'] if f'`{d}/`' not in text]
if missing:
    print("expansion plan does not mention shipped domain(s): " + ", ".join(missing))
    sys.exit(1)
PY
); then ok; else bad; echo "$out" | sed 's/^/     /'; fi

# ---------------------------------------------------------------- nothing private
step "no secrets or private references"
if out=$(git grep -nIiE \
  "496313|gserviceaccount|/Users/|lalehfarzam|jets\.bio|-----BEGIN|gh[pous]_[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{12}|xox[baprs]-" \
  -- . ':!scripts/verify.sh' 2>/dev/null); then
  bad; echo "$out" | head -5 | sed 's/^/     /'
else ok; fi

# ---------------------------------------------------------------- checklists ship unticked
step "no checklist ships a ticked box"
if out=$(git grep -nE '^\* \[(x|!|N/A)\]' -- checklists 2>/dev/null); then
  bad; echo "$out" | head -5 | sed 's/^/     /'
else ok; fi

# ---------------------------------------------------------------- version sanity
step "version is ahead of what npm has"
local_v=$(node -p "require('./package.json').version")
npm_v=$(curl -s --max-time 10 https://registry.npmjs.org/prodcheck 2>/dev/null \
        | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags']['latest'])" 2>/dev/null || echo "?")
if [ "$npm_v" = "?" ]; then
  printf 'skipped (registry unreachable)\n'
elif [ "$local_v" = "$npm_v" ]; then
  printf 'note: %s already published\n' "$local_v"
else
  printf 'ok  (local %s, npm %s)\n' "$local_v" "$npm_v"
fi

echo
if [ "$fail" = "0" ]; then
  echo "  all checks passed — safe to push"
else
  echo "  FAILED — fix the above before pushing"
fi
exit "$fail"
