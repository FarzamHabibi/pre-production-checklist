#!/usr/bin/env python3
"""Generate the static site into site/.

Every number on the site comes from data/checklist.json. Nothing is typed twice, so the
site cannot disagree with the checklists — which is the only way "keep the site in sync"
survives contact with a repository that changes weekly.

No framework, no build step, no dependencies. One stylesheet, one small script for the
copy buttons and the filter. Output is plain HTML that works with JavaScript disabled.
"""
import html
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import tree  # noqa: E402

OUT = "site"
REPO = "https://github.com/FarzamHabibi/pre-production-checklist"
NPM = "https://www.npmjs.com/package/prodcheck"

doc = json.load(open("data/checklist.json", encoding="utf-8"))
C = doc["counts"]
PKG = json.load(open("package.json", encoding="utf-8"))


def e(s):
    return html.escape(str(s), quote=True)


def fmt(n):
    return f"{n:,}"


# ------------------------------------------------------------------ page shell
CSS = """
*,*::before,*::after{box-sizing:border-box}
:root{
  --bg:#08080a; --panel:#0e0e12; --fg:#f2f2f4; --dim:#a3a3ad; --faint:#6e6e79;
  --line:#1e1e25; --line2:#2a2a33; --accent:#7dd3a0; --accent-dim:#3f7d5c;
  --code:#101015; --radius:14px;
}
:root[data-theme=light],
html:not([data-theme]) body.light{
  --bg:#fcfcfb; --panel:#fff; --fg:#15151a; --dim:#5c5c66; --faint:#8a8a94;
  --line:#e7e7e3; --line2:#d8d8d3; --accent:#0f7b52; --accent-dim:#8fcfae;
  --code:#f5f5f3;
}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{
  margin:0;background:var(--bg);color:var(--fg);
  font:16px/1.7 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:920px;margin:0 auto;padding:0 22px}
.narrow{max-width:720px}
a{color:var(--fg);text-decoration:none;border-bottom:1px solid var(--line2)}
a:hover{border-color:var(--accent);color:var(--accent)}
a.plain,a.btn,nav a{border:0}
code,pre,kbd,.mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
code{background:var(--code);padding:.14em .42em;border-radius:5px;font-size:.88em;
     border:1px solid var(--line)}
pre{background:var(--code);padding:15px 17px;border-radius:11px;overflow-x:auto;
    font-size:13px;line-height:1.65;margin:0;border:1px solid var(--line);color:var(--fg)}
pre code{background:none;padding:0;border:0;font-size:inherit}
hr{border:0;border-top:1px solid var(--line);margin:0}
h1,h2,h3{line-height:1.22;letter-spacing:-.024em;font-weight:620}
h2{font-size:1.5rem;margin:0 0 10px}
h3{font-size:1rem;margin:0 0 6px;letter-spacing:-.01em}
p{margin:0 0 15px}
.dim{color:var(--dim)}.faint{color:var(--faint)}
.small{font-size:.875rem}.tiny{font-size:.8rem}
.center{text-align:center}

header.top{position:sticky;top:0;z-index:20;backdrop-filter:blur(12px);
  background:color-mix(in srgb,var(--bg) 86%,transparent);border-bottom:1px solid var(--line)}
header.top .wrap{display:flex;align-items:center;gap:20px;height:56px}
header.top .brand{display:flex;align-items:center;gap:9px;font-weight:620;
  letter-spacing:-.028em;font-size:1rem}
header.top .brand .mark{width:23px;height:23px;flex:none;color:var(--accent)}
header.top .brand b{color:var(--accent);font-weight:620}
/* Both logotypes visible at once is a duplicate. The header one is revealed only
   once the hero lockup has scrolled away. JS adds .js-reveal, so with scripting
   disabled the brand is simply always visible. */
header.top .brand.js-reveal{opacity:0;transform:translateY(-6px);pointer-events:none;
  transition:opacity .22s ease,transform .22s ease}
header.top.scrolled .brand.js-reveal{opacity:1;transform:none;pointer-events:auto}
@media(prefers-reduced-motion:reduce){header.top .brand.js-reveal{transition:none}}
header.top nav{margin-left:auto;display:flex;gap:20px;font-size:.875rem}
header.top nav a{color:var(--dim)}
header.top nav a:hover{color:var(--fg)}
@media(max-width:560px){header.top nav{gap:14px;font-size:.8rem}}

/* ---- hero: same composition as the OG image ---- */
.hero{position:relative;overflow:hidden;border-bottom:1px solid var(--line);
      padding:74px 0 0}
.hero::before{content:"";position:absolute;inset:-220px -10% auto;height:680px;
  background:radial-gradient(ellipse 52% 50% at 42% 4%,
    color-mix(in srgb,var(--accent) 26%,transparent) 0%,
    color-mix(in srgb,var(--accent) 7%,transparent) 44%, transparent 72%);
  pointer-events:none}
.hero::after{content:"";position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(var(--line) 1px,transparent 1px),
                   linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:52px 52px;
  mask-image:linear-gradient(#000 8%,rgba(0,0,0,.35) 55%,transparent 92%);
  -webkit-mask-image:linear-gradient(#000 8%,rgba(0,0,0,.35) 55%,transparent 92%);
  opacity:.7}
.hero .wrap{position:relative;z-index:1}

.lockup{display:flex;align-items:center;gap:14px;margin:0 0 34px}
.lockup .mark{width:44px;height:44px;flex:none;color:var(--accent);
  filter:drop-shadow(0 0 18px color-mix(in srgb,var(--accent) 45%,transparent))}
.lockup .word{font-size:1.42rem;font-weight:620;letter-spacing:-.03em}
.lockup .word b{color:var(--accent);font-weight:620}
.lockup .badge{margin:0 0 0 auto}

.hero h1{font-size:clamp(1.95rem,5.1vw,3.05rem);margin:0 0 20px;letter-spacing:-.036em;
         font-weight:640;max-width:19ch}
.hero .lede{font-size:1.04rem;color:var(--dim);max-width:60ch;margin:0 0 8px}
.hero .lede b{color:var(--fg);font-weight:600}
.badge{display:inline-block;font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;
  color:var(--accent);border:1px solid var(--accent-dim);border-radius:999px;
  padding:4px 12px;font-weight:600;white-space:nowrap}

/* the two commands, in the hero, above the fold */
.quick{display:grid;gap:12px;grid-template-columns:1fr 1fr;margin:30px 0 0}
@media(max-width:760px){.quick{grid-template-columns:1fr}}
.quick .q{background:color-mix(in srgb,var(--panel) 88%,transparent);
  border:1px solid var(--line);border-radius:12px;padding:14px 15px;
  min-width:0}   /* grid items default to min-width:auto; a long <pre> then widens the column */
.quick .q h4{margin:0 0 3px;font-size:.82rem;font-weight:600;letter-spacing:-.005em}
.quick .q .sub{font-size:.74rem;color:var(--faint);margin:0 0 10px}
.quick .q pre{font-size:12.2px;padding:11px 13px;background:var(--bg);
  overflow-x:visible;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55;
  padding-right:74px}   /* clear the copy button so it never sits on the command */
.quick .q .more{font-size:.74rem;margin:9px 0 0}
.quick .q .more a{color:var(--dim);border:0}
.quick .q .more a:hover{color:var(--accent)}

.statrow{display:flex;flex-wrap:wrap;gap:0;margin:40px 0 0;
  border-top:1px solid var(--line);padding:22px 0 30px}
.statrow div{flex:1 1 0;min-width:96px}
.statrow b{display:block;font-size:1.34rem;font-variant-numeric:tabular-nums;
  letter-spacing:-.025em;line-height:1.2}
.statrow b.accent{color:var(--accent)}
.statrow span{font-size:.7rem;color:var(--faint);letter-spacing:.11em}
@media(max-width:620px){.statrow div{flex:1 1 33%;padding-bottom:16px;min-width:0}}
@media(max-width:420px){.statrow div{flex:1 1 50%}}
.ghbtns{display:flex;flex-wrap:wrap;gap:10px;margin:28px 0 0}
.hero .ghbtns{margin-top:26px}
.btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line2);
  background:var(--panel);color:var(--fg);border-radius:10px;padding:9px 16px;
  font-size:.885rem;font-weight:500;transition:border-color .15s,transform .15s}
.btn:hover{border-color:var(--accent);color:var(--fg);transform:translateY(-1px)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#08080a;font-weight:600}
.btn.primary:hover{color:#08080a;opacity:.92}
.btn svg{width:15px;height:15px;fill:currentColor;flex:none}

section.band{padding:72px 0;border-bottom:1px solid var(--line)}
section.band.alt{background:color-mix(in srgb,var(--panel) 55%,transparent)}
.eyebrow{font-size:.73rem;letter-spacing:.13em;text-transform:uppercase;color:var(--faint);
  margin:0 0 12px;font-weight:600}

.cards{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin:22px 0 0}
.cards>*{min-width:0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);
      padding:20px;transition:border-color .15s}
.card:hover{border-color:var(--line2)}
.card .n{font-size:.72rem;color:var(--accent);font-weight:700;letter-spacing:.08em;
         display:block;margin:0 0 8px}
.card p{font-size:.87rem;color:var(--dim);margin:0 0 13px}
.card .who{font-size:.75rem;color:var(--faint);margin:0 0 10px}

.copy{position:relative}
.copy pre{padding-top:15px;padding-right:78px;
  /* wrap rather than scroll: a command you have to scroll to read is a command you
     cannot check before running, and horizontally scrolled text slides under the button */
  white-space:pre-wrap;overflow-wrap:anywhere;overflow-x:visible}
.copy button{position:absolute;top:7px;right:7px;font:inherit;font-size:11px;
  display:inline-flex;align-items:center;gap:5px;
  background:var(--panel);color:var(--dim);border:1px solid var(--line2);
  border-radius:7px;padding:4px 9px;cursor:pointer;
  transition:color .15s,border-color .15s,background .15s}
.copy button:hover{color:var(--fg);border-color:var(--accent);background:var(--bg)}
.copy button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.copy button svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.7;
  stroke-linecap:round;stroke-linejoin:round;flex:none}
.copy button[data-done]{color:var(--accent);border-color:var(--accent)}
.quick .q .copy button{top:6px;right:6px}

.tools{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(178px,1fr));margin:14px 0 0}
.tools>*{min-width:0}
.tool span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tool{display:flex;align-items:center;gap:9px;border:1px solid var(--line);
  border-radius:10px;padding:10px 12px;background:var(--panel);font-size:.85rem}
.tool:hover{border-color:var(--accent)}
.tool .tag{margin-left:auto;font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;
  color:var(--faint);border:1px solid var(--line2);border-radius:5px;padding:1px 6px;flex:none}
.tool .tag.mcp{color:var(--accent);border-color:var(--accent-dim)}
.grp{margin:0 0 30px}
.grp h3{margin:0 0 3px}
.grp p{font-size:.86rem;color:var(--dim);margin:0}

table{border-collapse:collapse;width:100%;font-size:.89rem;margin:0}
th,td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--line);vertical-align:top}
tr:last-child td{border-bottom:0}
th{font-weight:600;color:var(--faint);font-size:.73rem;text-transform:uppercase;letter-spacing:.09em}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--dim)}
.tbl{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:var(--panel)}

.items{margin:0;padding:0;list-style:none}
.items li{padding:9px 0 9px 27px;border-bottom:1px solid var(--line);position:relative;font-size:.91rem}
.items li::before{content:"";position:absolute;left:1px;top:14px;width:11px;height:11px;
  border:1px solid var(--line2);border-radius:3px}
.items li:last-child{border-bottom:0}
.sec{margin:32px 0 4px;font-size:.73rem;text-transform:uppercase;letter-spacing:.12em;
     color:var(--accent);font-weight:600}

.filter{width:100%;padding:11px 14px;border:1px solid var(--line);border-radius:11px;
  background:var(--panel);color:var(--fg);font:inherit;font-size:.9rem;margin:0}
.filter::placeholder{color:var(--faint)}
.filter:focus{outline:0;border-color:var(--accent)}

footer{padding:44px 0 72px;font-size:.85rem;color:var(--faint)}
footer a{color:var(--dim)}
.skip{position:absolute;left:-9999px}
.skip:focus{left:10px;top:10px;background:var(--panel);padding:9px 14px;border-radius:9px;z-index:99}
"""

JS = """
document.querySelectorAll('[data-copy]').forEach(function(b){
  b.addEventListener('click', function(){
    var t = document.getElementById(b.getAttribute('data-copy'));
    var s = t ? (t.innerText || t.textContent) : '';
    var lab = b.querySelector('span') || b;
    var done = function(){
      var o = lab.textContent; lab.textContent = 'copied';
      b.setAttribute('data-done','1');
      setTimeout(function(){ lab.textContent = o; b.removeAttribute('data-done'); }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(done, function(){ fallback(s, done); });
    } else { fallback(s, done); }
  });
});
function fallback(s, done){
  // clipboard API needs a secure context; file:// and plain http do not get one
  var ta = document.createElement('textarea');
  ta.value = s; ta.setAttribute('readonly',''); ta.style.position = 'fixed';
  ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch (e) {}
  document.body.removeChild(ta);
}

// Reveal the header logo only after the hero lockup has scrolled past, so the two
// logotypes are never on screen together. Applied in JS rather than CSS so that with
// scripting disabled the brand simply stays visible.
(function(){
  var head = document.querySelector('header.top');
  var brand = head && head.querySelector('.brand');
  var anchor = document.querySelector('.hero .lockup');
  if (!head || !brand) return;
  if (!anchor) { head.classList.add('scrolled'); return; }   // inner pages: always show
  brand.classList.add('js-reveal');

  // A scroll listener rather than IntersectionObserver: the threshold is one number,
  // it is trivially testable, and it behaves identically in every embedding context.
  // The threshold is measured once, not on every scroll event. getBoundingClientRect
  // in a scroll handler forces layout on every frame, which performance/06 warns about;
  // offsetTop cannot be used instead because the lockup's offsetParent is the positioned
  // .hero .wrap, making it ~0. Rect plus current scroll gives the document offset.
  var trigger = 0;
  function measure(){
    trigger = anchor.getBoundingClientRect().bottom + scrollTop() - 56;   // header height
  }
  function scrollTop(){
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  function update(){ head.classList.toggle('scrolled', scrollTop() > trigger); }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', function(){ measure(); update(); }, { passive: true });
  measure();
  update();
})();
var f = document.getElementById('filter');
if (f) {
  f.addEventListener('input', function(){
    var q = f.value.toLowerCase();
    var shown = 0;
    document.querySelectorAll('.items li').forEach(function(li){
      var hit = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
      li.hidden = !hit; if (hit) shown++;
    });
    document.querySelectorAll('[data-sec]').forEach(function(h){
      var any = false, n = h.nextElementSibling;
      if (n) n.querySelectorAll('li').forEach(function(li){ if(!li.hidden) any = true; });
      h.hidden = !any; if (n) n.hidden = !any;
    });
    var c = document.getElementById('count');
    if (c) c.textContent = shown;
  });
}
"""


# The site's own base URL. Every canonical tag, og:url and sitemap entry uses it, so it
# has to be a hostname that actually resolves — a canonical pointing at a domain that does
# not is worse than none, and it is what integrations/02-seo-fundamentals.md warns about.
#
# Override without editing this file:
#     PRODCHECK_SITE=https://prodcheck.pages.dev python3 scripts/build_site.py
#
# CUSTOM_DOMAIN writes a CNAME file, which GitHub Pages reads as "serve only here and
# redirect the github.io URL to it". Leave it unset until that DNS actually resolves;
# setting it early is how the site went dark once.
SITE = os.environ.get(
    "PRODCHECK_SITE", "https://farzamhabibi.github.io/pre-production-checklist"
).rstrip("/")
CUSTOM_DOMAIN = os.environ.get("PRODCHECK_CNAME") or None

MARK = ('<svg class="mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">'
        '<rect x="3" y="3" width="42" height="42" rx="11" stroke="currentColor" '
        'stroke-width="2.5" opacity=".38"/>'
        '<path d="M14 24.5 L21 31.5 L34 17" stroke="currentColor" stroke-width="4" '
        'stroke-linecap="round" stroke-linejoin="round"/></svg>')


def page(title, desc, body, depth=0, canonical="", schema=""):
    up = "../" * depth
    ld = f'<script type="application/ld+json">{schema}</script>' if schema else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{SITE}/{canonical}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}/{canonical}">
<meta property="og:image" content="{SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="prodcheck">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="{SITE}/og.png">
<meta name="color-scheme" content="dark light">
<link rel="icon" href="{up}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{up}style.css">
{ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap">
  <a class="brand plain" href="{up}index.html">{MARK}<span>prod<b>check</b></span></a>
  <nav>
    <a href="{up}checklists.html">Checklists</a>
    <a href="{up}index.html#start">Start</a>
    <a href="{up}index.html#tools">Tools</a>
    <a href="{up}index.html#why">Why</a>
    <a href="{REPO}">GitHub</a>
  </nav>
</div></header>
<main id="main">
{body}
</main>
<footer><div class="wrap center">
  <p>Content <a href="{REPO}/blob/main/LICENSE">CC BY 4.0</a> ·
     code <a href="{REPO}/blob/main/LICENSE-CODE">MIT</a> ·
     <a href="{REPO}">source</a> ·
     <a href="{NPM}">npm</a></p>
  <p class="tiny">Generated from the repository — every number here comes from
     <a href="{REPO}/blob/main/data/checklist.json">checklist.json</a>.</p>
</div></footer>
<script>{JS}</script>
</body>
</html>
"""


def codeblock(cid, text, label="copy"):
    return (f'<div class="copy"><pre id="{cid}"><code>{e(text)}</code></pre>'
            f'<button data-copy="{cid}" aria-label="Copy to clipboard">'
            f'{COPY_ICON}<span>{label}</span></button></div>')


# ------------------------------------------------------------------ index
INTEG = json.load(open("data/integrations.json", encoding="utf-8"))
HOW = {h["id"]: h for h in INTEG["how"]}

NPM_ICON = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.763 0C.786 0 0 .786 0 '
            '1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763'
            'C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h'
            '-3.456L12.04 19.17H5.113z"/></svg>')

COPY_ICON = ('<svg viewBox="0 0 24 24" aria-hidden="true">'
             '<rect x="9" y="9" width="12" height="12" rx="2.5"/>'
             '<path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>')

GH_ICON = ('<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 '
           '3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53'
           '-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 '
           '1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95'
           ' 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27'
           ' 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 '
           '1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 '
           '2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>')


def tool_grid(group):
    out = [f'<div class="grp"><h3>{e(group["label"])}</h3><p>{e(group["blurb"])}</p>',
           '<div class="tools">']
    for t in group["tools"]:
        how = HOW[t["how"]]
        cls = "tag mcp" if t["how"] == "mcp" else "tag"
        href = t["doc"] if t["doc"].startswith("..") else f'{REPO}/blob/main/docs/{t["doc"]}'
        out.append(f'<a class="tool" href="{href}"><span>{e(t["name"])}</span>'
                   f'<span class="{cls}">{e(how["label"].split()[0].lower())}</span></a>')
    out.append("</div></div>")
    return "".join(out)


def build_index():
    domains_tbl = "".join(
        f'<tr><td><a class="plain" href="checklists.html#{d}"><b>{e(tree.DOMAIN_LABEL[d])}</b></a>'
        f'<br><span class="dim small">{e(tree.DOMAIN_BLURB[d])}</span></td>'
        f'<td class="n">{fmt(C["by_domain"].get(d, 0))}</td></tr>'
        for d in tree.domains())

    mcp = "claude mcp add prodcheck -- npx -y --package=prodcheck prodcheck-mcp"
    npm_cmd = "npx prodcheck security --stack django -o SECURITY.md"
    http_url = "https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json"
    prompt = """Review this codebase against the prodcheck checklist.

If you have the prodcheck MCP tools, call checklist_for_stack with the stacks this
project actually uses. Otherwise use the checklist file I paste below.

Rules:
1. Every finding must cite file:line and quote the lines it refers to. No citation,
   no finding.
2. Three verdicts only: PASS (you read the code, cite it), FAIL (you read the code,
   cite it, say what a user or attacker would experience), UNKNOWN (you cannot tell —
   this is a normal answer, say what you would need to see).
3. Absence of evidence is UNKNOWN, never PASS.
4. Never mark anything verified on my behalf. You produce evidence; I decide.

Start with the items that would block a release. Output a table:
item | verdict | file:line | one-sentence reason."""

    ai_items = sum(1 for i in doc["items"]
                   if i["area"] in ("ai", "ai-generated-code"))

    schema = json.dumps({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "prodcheck",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "description": f"{C['total']} pre-production checklist items across security, "
                       "performance, scale, integrations and post-launch, with a CLI and "
                       "an MCP server.",
        "url": SITE,
        "codeRepository": REPO,
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "author": {"@type": "Organization", "name": "Arioo", "url": "https://arioo.com"},
    }, separators=(",", ":"))

    body = f"""
<section class="hero"><div class="wrap">
  <div class="lockup">
    {MARK}
    <span class="word">prod<b>check</b></span>
    <span class="badge">Free · open source</span>
  </div>

  <h1>The checklist you wish someone had given you before launch.</h1>
  <p class="lede"><b>{fmt(C['total'])} things to check</b> before you ship — security,
  speed, scale, being findable, and what to do when it breaks anyway.</p>
  <p class="lede small">Built for solo founders and small teams with no security team to
  hand it to.</p>

  <div class="quick">
    <div class="q">
      <h4>Give it to your AI assistant</h4>
      <p class="sub">MCP · Claude, Cursor, Copilot, Gemini CLI, Cline, Cherry Studio…</p>
      {codeblock('h-mcp', mcp)}
      <p class="more"><a href="{REPO}/blob/main/docs/mcp-clients.md">every client →</a>
        &nbsp;·&nbsp; <a href="#tools">n8n, OpenRouter, DeepSeek… →</a></p>
    </div>
    <div class="q">
      <h4>Or write a file into your repo</h4>
      <p class="sub">npm · scoped to your stack, commit it and tick it off</p>
      {codeblock('h-npm', npm_cmd)}
      <p class="more"><a href="{REPO}#command-line">all commands →</a>
        &nbsp;·&nbsp; <a href="{REPO}/blob/main/docs/prompts.md">prompts to paste →</a></p>
    </div>
  </div>

  <div class="ghbtns">
    <a class="btn primary" href="checklists.html">Browse the checklists</a>
    <a class="btn" href="{REPO}">{GH_ICON} Star</a>
    <a class="btn" href="{REPO}/fork">{GH_ICON} Fork</a>
    <a class="btn" href="{NPM}">{NPM_ICON} npm</a>
  </div>

  <div class="statrow">
    <div><b>{fmt(C['total'])}</b><span>ITEMS</span></div>
    <div><b>{len(tree.domains())}</b><span>DOMAINS</span></div>
    <div><b>{fmt(C['release_gate'])}</b><span>BLOCKERS</span></div>
    <div><b>{round(100 * C['stack_agnostic'] / C['total'])}%</b><span>ANY STACK</span></div>
    <div><b>{len(doc['stacks'])}</b><span>STACKS</span></div>
    <div><b class="accent">Free</b><span>OPEN SOURCE</span></div>
  </div>
</div></section>

<section class="band" id="start"><div class="wrap narrow">
  <p class="eyebrow">Start here</p>
  <h2>Four ways in</h2>
  <p class="dim">No account, no API key, no sign-up. The first two are in the header
  above; these are all four with the detail.</p>

  <div class="cards">
    <div class="card">
      <span class="n">01</span>
      <h3>Give it to your AI assistant</h3>
      <p class="who">{e(HOW['mcp']['who'])}</p>
      <p>{e(HOW['mcp']['blurb'])}</p>
      {codeblock('c-mcp', mcp)}
      <p class="tiny" style="margin:11px 0 0"><a href="{REPO}/blob/main/docs/mcp-clients.md">Config for every client →</a></p>
    </div>

    <div class="card">
      <span class="n">02</span>
      <h3>Write a file into your repo</h3>
      <p class="who">{e(HOW['cli']['who'])}</p>
      <p>{e(HOW['cli']['blurb'])}</p>
      {codeblock('c-npm', npm_cmd)}
      <p class="tiny" style="margin:11px 0 0"><a href="{REPO}#command-line">All commands →</a></p>
    </div>

    <div class="card">
      <span class="n">03</span>
      <h3>Fetch it over HTTP</h3>
      <p class="who">{e(HOW['http']['who'])}</p>
      <p>{e(HOW['http']['blurb'])}</p>
      {codeblock('c-http', http_url)}
      <p class="tiny" style="margin:11px 0 0"><a href="{REPO}/blob/main/docs/integrations/http-api.md">The JSON API →</a></p>
    </div>

    <div class="card">
      <span class="n">04</span>
      <h3>Paste a prompt</h3>
      <p class="who">{e(HOW['prompt']['who'])}</p>
      <p>{e(HOW['prompt']['blurb'])}</p>
      {codeblock('c-gate', 'npx prodcheck --gate -o BLOCKERS.md')}
      <p class="tiny" style="margin:11px 0 0"><a href="{REPO}/blob/main/docs/prompts.md">Six ready-made prompts →</a></p>
    </div>
  </div>

  <details style="margin:26px 0 0">
    <summary class="dim small" style="cursor:pointer">The review prompt, if you want it now</summary>
    <div style="margin:12px 0 0">{codeblock('c-prompt', prompt, 'copy prompt')}</div>
  </details>
</div></section>

<section class="band alt" id="tools"><div class="wrap narrow">
  <p class="eyebrow">Your tools</p>
  <h2>Works with what you already use</h2>
  <p class="dim">One thing worth knowing first: <b>MCP is a feature of the app, not of the
  model.</b> Cursor running DeepSeek can use it; DeepSeek's website cannot. If your app is
  not listed, method 03 or 04 above works everywhere.</p>
  {"".join(tool_grid(g) for g in INTEG["groups"])}
</div></section>

<section class="band" id="domains"><div class="wrap narrow">
  <p class="eyebrow">Contents</p>
  <h2>Five domains</h2>
  <div class="tbl" style="margin-top:16px">
  <table><tbody>{domains_tbl}</tbody></table>
  </div>
  <p class="small dim" style="margin-top:14px">Stack supplements add
  {fmt(sum(1 for i in doc['items'] if i['stack'] != 'any'))} more items across
  {len(doc['stacks'])} products. They are opt-in — without <code>--stack</code> you get
  only the items that name no product, so a Django team never sees an iOS item.</p>
</div></section>

<section class="band alt" id="why"><div class="wrap narrow">
  <p class="eyebrow">Why</p>
  <h2>Why this exists</h2>
  <p>It started as the pre-launch security review for <a href="https://arioo.com">Arioo</a>.
  Nothing available covered more than a fraction of what we actually ship — a backend, a
  web app, native clients, a deploy pipeline, and a set of AI agents with real tools
  attached — so the checklist got written.</p>
  <p><b>This is the checklist, not a report.</b> It is the set of questions, generalised
  away from one stack and rewritten as a working document anyone can run against their
  own product.</p>

  <h3 style="margin-top:30px">Solo founders have no security team</h3>
  <p class="dim">You write the code, configure the infrastructure, set up the pipeline,
  and then you are also the person who decides whether it is safe to launch. There is
  nobody to hand it to. Most public checklists are either too shallow to catch anything
  real, or written for companies with a security function.</p>

  <h3 style="margin-top:26px">AI-assisted development changed the shape of the problem</h3>
  <p class="dim">{fmt(ai_items)} items here did not need to exist a few years ago. When you
  ship an agent with tools, or review code a model wrote faster than you would review a
  colleague's, you inherit failure modes standard checklists do not cover.</p>

  <h3 style="margin-top:26px">Built with AI, and honest about it</h3>
  <p class="dim">Compiled and expanded with Claude and ChatGPT, working from a real
  pre-production review rather than generating items from nothing. That matters twice: it
  is the honest provenance for something that asks you to trust it, and the
  <code>ai-generated-code</code> checklists apply to this repository too. Its own test
  suite has caught several bugs in AI-written code here, which is the argument that
  section makes.</p>
</div></section>

<section class="band" id="contribute"><div class="wrap narrow">
  <p class="eyebrow">Contributing</p>
  <h2>Corrections are worth more than additions</h2>
  <p class="dim">If an item is wrong, outdated, or plausible-sounding but false, that is
  exactly the failure mode this repository warns about. The most useful addition is a
  stack file for a stack that is not covered — there are open issues for FastAPI, AWS,
  Kubernetes, Vercel, Firebase, Stripe and GraphQL, all labelled
  <code>good first issue</code>.</p>
  <div class="ghbtns" style="justify-content:flex-start">
    <a class="btn" href="{REPO}/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</a>
    <a class="btn" href="{REPO}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Good first issues</a>
    <a class="btn" href="{REPO}/issues">Report something wrong</a>
  </div>
</div></section>

<section class="band alt" id="license"><div class="wrap narrow">
  <p class="eyebrow">Licence</p>
  <h2>Two licences, because they are two things</h2>
  <div class="tbl"><table><tbody>
  <tr><td>Content — the checklists and the data</td>
      <td><a href="{REPO}/blob/main/LICENSE">CC BY 4.0</a></td></tr>
  <tr><td>Code — the CLI, the MCP server, the scripts</td>
      <td><a href="{REPO}/blob/main/LICENSE-CODE">MIT</a></td></tr>
  </tbody></table></div>
  <p class="small dim" style="margin-top:14px">Creative Commons is not written for
  software, and a CC-licensed npm package gets stopped by corporate legal review.</p>
  <p class="small faint">A starting point, not a guarantee, not a compliance
  certification, and not a substitute for a professional audit. Completing every item does
  not make an application secure. Use it to find problems, not to declare their
  absence.</p>
</div></section>
"""
    return page("prodcheck — the pre-production checklist for solo founders",
                f"{fmt(C['total'])} things to check before you ship: security, performance, "
                "scale, integrations and post-launch. Free, open source, works with any "
                "AI assistant.",
                body, canonical="", schema=schema)


# ------------------------------------------------------------------ checklist index
def build_checklists_index():
    out = ['<div class="wrap"><section class="hero" style="padding:44px 0 6px">',
           '<h1>Checklists</h1>',
           f'<p class="lede">{fmt(C["total"])} items. Every page has a copy button that '
           'gives you plain markdown — for your own repo, or to paste into an assistant.</p>',
           '</section>']
    for d in tree.domains():
        out.append(f'<h2 id="{d}" style="margin-top:36px">{e(tree.DOMAIN_LABEL[d])} '
                   f'<span class="muted small" style="font-weight:400">'
                   f'{fmt(C["by_domain"].get(d, 0))} items</span></h2>')
        out.append(f'<p class="muted small">{e(tree.DOMAIN_BLURB[d])}</p>')
        for a in tree.areas(d):
            if a:
                out.append(f'<p class="sec" style="margin:22px 0 6px">'
                           f'{e(tree.AREA_LABEL.get(a, a))}</p>')
            out.append('<div class="domain">')
            for path, stem in tree.files(d, a):
                n = sum(1 for i in doc["items"] if i["source"]["file"] == path)
                href = f"c/{d}--{(a + '--') if a else ''}{stem}.html"
                out.append(f'<div style="display:flex;gap:12px;padding:5px 0">'
                           f'<a href="{href}" style="flex:1">{e(tree.title_of(path))}</a>'
                           f'<span class="muted small">{n}</span></div>')
            out.append('</div>')

    out.append(f'<h2 id="stacks" style="margin-top:36px">Stack supplements</h2>'
               f'<p class="muted small">One file per product, spanning every domain. '
               f'Skip any you do not use — the domain checklists stand on their own.</p>'
               f'<div class="domain">')
    for path, slug in tree.stack_files():
        n = sum(1 for i in doc["items"] if i["source"]["file"] == path)
        out.append(f'<div style="display:flex;gap:12px;padding:5px 0">'
                   f'<a href="c/stacks--{slug}.html" style="flex:1">{e(tree.title_of(path))}</a>'
                   f'<span class="muted small">{n}</span></div>')
    out.append('</div></div>')
    return page("Checklists — prodcheck", "Browse all prodcheck checklists.",
                "\n".join(out))


# ------------------------------------------------------------------ one checklist
MD_LINK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
MD_CODE = re.compile(r"`([^`]+)`")


def inline(text):
    """Escape, then re-apply the small amount of markdown the items use."""
    s = e(text)
    s = MD_CODE.sub(lambda m: f"<code>{m.group(1)}</code>", s)
    s = MD_LINK.sub(lambda m: m.group(1), s)      # drop links; targets are repo-relative
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    return s


def build_checklist_page(path, slug, title, items):
    secs, cur = [], None
    for i in items:
        if i["section"] != cur:
            cur = i["section"]
            secs.append((cur, []))
        secs[-1][1].append(i)

    body = [f'<div class="wrap"><section style="padding:40px 0 4px">',
            f'<p class="small muted"><a href="../checklists.html">← all checklists</a></p>',
            f'<h1 style="font-size:1.75rem;margin:0 0 8px">{e(title)}</h1>',
            f'<p class="muted small"><span id="count">{len(items)}</span> items · '
            f'<a href="{REPO}/blob/main/{path}">source</a></p>',
            '<div class="ghbtns" style="margin:14px 0 18px">'
            f'<button class="btn" data-copy="raw">Copy as markdown</button></div>',
            '<label class="skip" for="filter">Filter items</label>',
            '<input class="filter" id="filter" type="search" placeholder="Filter items…">',
            '</section>']

    for name, group in secs:
        if name:
            body.append(f'<p class="sec" data-sec>{e(name)}</p>')
        body.append('<ul class="items">')
        for i in group:
            body.append(f"<li>{inline(i['text'])}</li>")
        body.append("</ul>")

    raw = [f"# {title}", ""]
    for name, group in secs:
        if name:
            raw += [f"## {name}", ""]
        raw += [f"* [ ] {i['text']}" for i in group]
        raw.append("")
    raw += ["", f"{len(items)} items · {REPO} · CC BY 4.0"]
    body.append(f'<pre id="raw" hidden>{e(chr(10).join(raw))}</pre>')
    body.append("</div>")
    return page(f"{title} — prodcheck", f"{len(items)} checklist items: {title}.",
                "\n".join(body), depth=1)


# ------------------------------------------------------------------ run
FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
           '<rect width="48" height="48" rx="11" fill="#08080a"/>'
           '<path d="M13 24.5 L21 32 L35 16" fill="none" stroke="#7dd3a0" stroke-width="5" '
           'stroke-linecap="round" stroke-linejoin="round"/></svg>')

HEADERS = """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Content-Security-Policy: default-src 'none'; img-src 'self' data:; style-src 'self'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'

/style.css
  Cache-Control: public, max-age=3600

/og.png
  Cache-Control: public, max-age=86400

/*.html
  Cache-Control: public, max-age=600
"""

ROBOTS = f"""# prodcheck — https://github.com/FarzamHabibi/pre-production-checklist
User-agent: *
Allow: /

# AI crawlers are allowed deliberately: the point of this project is to be quoted
# correctly by assistants. See checklists/integrations/04-answer-engines.md, which says
# to make this decision rather than inherit it.
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: {SITE}/sitemap.xml
"""

LLMS_TXT = None   # filled in by build_llms_txt()


def build_llms_txt(urls):
    lines = [
        "# prodcheck",
        "",
        f"> {C['total']:,} pre-production checklist items across five domains — security, "
        "performance, scale, integrations and post-launch. Free and open source, with a "
        "CLI and an MCP server.",
        "",
        "prodcheck is a checklist, not a scanner. It asks the questions; a human or an "
        "assistant answers them against a specific codebase.",
        "",
        "## Facts",
        "",
        f"- Items: {C['total']:,} across {len(tree.domains())} domains",
        f"- Release blockers: {C['release_gate']:,}",
        f"- {round(100 * C['stack_agnostic'] / C['total'])}% of items name no product and "
        f"apply to any stack; {len(doc['stacks'])} stack supplements cover the rest",
        "- Install: `npx prodcheck` — no account, no API key",
        "- MCP server: `npx -y --package=prodcheck prodcheck-mcp`",
        f"- JSON API: https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json",
        "- Licence: content CC BY 4.0, code MIT",
        f"- Source: {REPO}",
        "",
        "## Domains",
        "",
    ]
    for d in tree.domains():
        lines.append(f"- **{tree.DOMAIN_LABEL[d]}** ({C['by_domain'].get(d, 0):,} items): "
                     f"{tree.DOMAIN_BLURB[d]}")
    lines += ["", "## Pages", ""]
    for u, t in urls:
        lines.append(f"- [{t}]({SITE}/{u})")
    return "\n".join(lines) + "\n"


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, "c"))

    urls = []
    open(os.path.join(OUT, "style.css"), "w", encoding="utf-8").write(CSS)
    open(os.path.join(OUT, "favicon.svg"), "w", encoding="utf-8").write(FAVICON)
    open(os.path.join(OUT, ".nojekyll"), "w").write("")
    # A CNAME file makes Pages serve only at that host and redirect the github.io URL to
    # it. Writing one before the DNS exists takes the site down.
    if CUSTOM_DOMAIN:
        open(os.path.join(OUT, "CNAME"), "w").write(CUSTOM_DOMAIN + "\n")
    open(os.path.join(OUT, "robots.txt"), "w", encoding="utf-8").write(ROBOTS)
    open(os.path.join(OUT, "_headers"), "w", encoding="utf-8").write(HEADERS)

    for src in ("og.png", "og.svg"):
        p = os.path.join("site-assets", src)
        if os.path.exists(p):
            shutil.copyfile(p, os.path.join(OUT, src))

    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(build_index())
    urls.append(("", "prodcheck — the pre-production checklist for solo founders"))
    open(os.path.join(OUT, "checklists.html"), "w", encoding="utf-8").write(
        build_checklists_index())
    urls.append(("checklists.html", "All checklists"))

    pages = 0
    for d, a, path, stem in tree.walk():
        items = [i for i in doc["items"] if i["source"]["file"] == path]
        slug = f"{d}--{(a + '--') if a else ''}{stem}"
        title = tree.title_of(path)
        open(os.path.join(OUT, "c", slug + ".html"), "w", encoding="utf-8").write(
            build_checklist_page(path, slug, title, items))
        urls.append((f"c/{slug}.html", f"{title} ({tree.DOMAIN_LABEL[d]})"))
        pages += 1
    for path, s in tree.stack_files():
        items = [i for i in doc["items"] if i["source"]["file"] == path]
        title = tree.title_of(path)
        open(os.path.join(OUT, "c", f"stacks--{s}.html"), "w", encoding="utf-8").write(
            build_checklist_page(path, f"stacks--{s}", title, items))
        urls.append((f"c/stacks--{s}.html", f"{title} (stack supplement)"))
        pages += 1

    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, _ in urls:
        pri = "1.0" if u == "" else ("0.8" if u == "checklists.html" else "0.6")
        sm.append(f"  <url><loc>{SITE}/{u}</loc><priority>{pri}</priority></url>")
    sm.append("</urlset>")
    open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(sm) + "\n")

    open(os.path.join(OUT, "llms.txt"), "w", encoding="utf-8").write(build_llms_txt(urls))

    print(f"site/ — {pages + 2} pages, sitemap, robots.txt, llms.txt, CNAME; "
          "every count from data/checklist.json")


if __name__ == "__main__":
    main()
