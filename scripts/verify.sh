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
before=$(git status --porcelain 2>/dev/null | wc -l)
./scripts/build.sh >/dev/null 2>&1 || { bad; echo "     build.sh itself failed"; }
after=$(git status --porcelain 2>/dev/null | wc -l)
if [ "$before" = "$after" ]; then ok; else
  bad; echo "     build.sh changed files — commit the regenerated output"
  git status --porcelain | head -5 | sed 's/^/       /'
fi

# ---------------------------------------------------------------- tests
step "tests"
if out=$(node cli/test.js 2>&1); then ok; else
  bad; echo "$out" | grep -A2 FAIL | head -12 | sed 's/^/     /'
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

sidebar = open('.github/description.txt', encoding='utf-8').read().strip()
if f"{doc['counts']['total']:,}" not in sidebar:
    problems.append(".github/description.txt is stale — run build.sh")

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
  sitehost=$(grep -m1 -o 'rel="canonical" href="https://[^/"]*' site/index.html | sed 's|.*https://||')
  if [ -f site/CNAME ]; then
    cname=$(tr -d '\n' < site/CNAME)
    [ "$cname" = "$sitehost" ] || miss="site/CNAME is $cname but pages canonicalise to $sitehost"
  fi
  # and the canonical host must be one that resolves
  if ! curl -s -o /dev/null --max-time 12 "https://$sitehost/" 2>/dev/null; then
    echo "     note: could not reach https://$sitehost (network, not necessarily a fault)"
  fi

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
