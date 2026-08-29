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
  --bg:#fbfbfa; --fg:#16161a; --muted:#6b6b76; --line:#e4e4e0;
  --card:#fff; --accent:#1a56db; --accent-soft:#eef2ff; --code:#f4f4f2;
  --ok:#0f7b45; --warn:#9a3412;
}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){
  --bg:#0e0e11; --fg:#ececed; --muted:#9a9aa4; --line:#26262c;
  --card:#151519; --accent:#8ab4ff; --accent-soft:#181c2b; --code:#17171c;
  --ok:#4ade80; --warn:#fdba74;
}}
:root[data-theme=dark]{
  --bg:#0e0e11; --fg:#ececed; --muted:#9a9aa4; --line:#26262c;
  --card:#151519; --accent:#8ab4ff; --accent-soft:#181c2b; --code:#17171c;
  --ok:#4ade80; --warn:#fdba74;
}
html{-webkit-text-size-adjust:100%}
body{
  margin:0;background:var(--bg);color:var(--fg);
  font:16px/1.65 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  font-feature-settings:"kern","liga";
}
.wrap{max-width:880px;margin:0 auto;padding:0 20px}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
code,pre,kbd{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
code{background:var(--code);padding:.13em .4em;border-radius:4px;font-size:.9em}
pre{background:var(--code);padding:14px 16px;border-radius:10px;overflow-x:auto;
    font-size:13.5px;line-height:1.6;margin:0;border:1px solid var(--line)}
pre code{background:none;padding:0;font-size:inherit}
hr{border:0;border-top:1px solid var(--line);margin:56px 0}
h1,h2,h3{line-height:1.25;letter-spacing:-.017em}
h2{font-size:1.45rem;margin:0 0 6px}
h3{font-size:1.05rem;margin:28px 0 8px}
p{margin:0 0 14px}
.muted{color:var(--muted)}
.small{font-size:.875rem}

header.top{border-bottom:1px solid var(--line);background:var(--card)}
header.top .wrap{display:flex;align-items:center;gap:18px;height:54px}
header.top .brand{font-weight:650;letter-spacing:-.02em;color:var(--fg)}
header.top nav{margin-left:auto;display:flex;gap:18px;font-size:.9rem}

.hero{padding:64px 0 8px}
.hero .ghbtns{margin-bottom:6px}
.hero h1{font-size:clamp(1.9rem,5vw,2.7rem);margin:0 0 14px;letter-spacing:-.03em}
.hero .lede{font-size:1.1rem;color:var(--muted);max-width:62ch;margin:0 0 22px}
.stat{display:flex;flex-wrap:wrap;gap:8px 22px;margin:0 0 30px;font-size:.9rem}
.stat b{font-variant-numeric:tabular-nums}

.cards{display:grid;gap:14px;grid-template-columns:1fr 1fr;margin:26px 0 0}
@media(max-width:720px){.cards{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px}
.card h3{margin:0 0 4px;font-size:.95rem;letter-spacing:0}
.card p{font-size:.875rem;color:var(--muted);margin:0 0 12px}

.copy{position:relative}
.copy pre{padding-top:34px}
.copy button{
  position:absolute;top:8px;right:8px;font:inherit;font-size:11.5px;
  background:var(--bg);color:var(--muted);border:1px solid var(--line);
  border-radius:6px;padding:3px 9px;cursor:pointer
}
.copy button:hover{color:var(--fg);border-color:var(--muted)}
.copy button[data-done]{color:var(--ok);border-color:var(--ok)}

.ghbtns{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 0}
.btn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);
     background:var(--card);color:var(--fg);border-radius:8px;padding:7px 13px;
     font-size:.875rem;font-weight:500}
.btn:hover{text-decoration:none;border-color:var(--muted)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.btn.primary:hover{opacity:.9}

table{border-collapse:collapse;width:100%;font-size:.9rem;margin:0 0 8px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-weight:600;color:var(--muted);font-size:.8rem;text-transform:uppercase;letter-spacing:.04em}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}

.domain{border:1px solid var(--line);border-radius:12px;background:var(--card);
        padding:18px 20px;margin:0 0 14px}
.domain h3{margin:0 0 2px;font-size:1rem}
.domain .files{display:flex;flex-wrap:wrap;gap:6px 10px;margin:10px 0 0;font-size:.85rem}

.items{margin:0;padding:0;list-style:none}
.items li{padding:7px 0 7px 26px;border-bottom:1px solid var(--line);position:relative;
          font-size:.925rem}
.items li::before{content:"☐";position:absolute;left:2px;top:6px;color:var(--muted);font-size:.9em}
.items li:last-child{border-bottom:0}
.sec{margin:34px 0 6px;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;
     color:var(--muted);font-weight:600}

.filter{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:9px;
        background:var(--card);color:var(--fg);font:inherit;font-size:.9rem;margin:0 0 6px}
.filter:focus{outline:2px solid var(--accent);outline-offset:-1px}

footer{border-top:1px solid var(--line);margin-top:64px;padding:28px 0 56px;
       font-size:.85rem;color:var(--muted)}
footer a{color:var(--muted);text-decoration:underline}
.skip{position:absolute;left:-9999px}
.skip:focus{left:8px;top:8px;background:var(--card);padding:8px 12px;border-radius:8px;z-index:9}
"""

JS = """
document.querySelectorAll('[data-copy]').forEach(function(b){
  b.addEventListener('click', function(){
    var t = document.getElementById(b.getAttribute('data-copy'));
    var s = t ? (t.innerText || t.textContent) : '';
    navigator.clipboard.writeText(s).then(function(){
      var o = b.textContent; b.textContent = 'copied'; b.setAttribute('data-done','1');
      setTimeout(function(){ b.textContent = o; b.removeAttribute('data-done'); }, 1400);
    });
  });
});
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


def page(title, desc, body, depth=0, extra_head=""):
    up = "../" * depth
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text y='13' font-size='14'>&#9745;</text></svg>">
<link rel="stylesheet" href="{up}style.css">
{extra_head}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap">
  <a class="brand" href="{up}index.html">prodcheck</a>
  <nav>
    <a href="{up}checklists.html">Checklists</a>
    <a href="{up}index.html#use">Use it</a>
    <a href="{up}index.html#why">Why</a>
    <a href="{REPO}">GitHub</a>
  </nav>
</div></header>
<main id="main">
{body}
</main>
<footer><div class="wrap">
  <p>Content <a href="{REPO}/blob/main/LICENSE">CC BY 4.0</a> ·
     code <a href="{REPO}/blob/main/LICENSE-CODE">MIT</a> ·
     <a href="{REPO}">source</a> ·
     <a href="{NPM}">npm</a></p>
  <p>Generated from the repository — every number on this site comes from
     <a href="{REPO}/blob/main/data/checklist.json">checklist.json</a>.</p>
</div></footer>
<script>{JS}</script>
</body>
</html>
"""


def codeblock(cid, text, label="copy"):
    return (f'<div class="copy"><pre id="{cid}"><code>{e(text)}</code></pre>'
            f'<button data-copy="{cid}">{label}</button></div>')


# ------------------------------------------------------------------ index
def build_index():
    domains_tbl = "".join(
        f'<tr><td><a href="checklists.html#{d}"><b>{e(tree.DOMAIN_LABEL[d])}</b></a><br>'
        f'<span class="muted small">{e(tree.DOMAIN_BLURB[d])}</span></td>'
        f'<td class="n">{fmt(C["by_domain"].get(d, 0))}</td></tr>'
        for d in tree.domains())

    mcp = "claude mcp add prodcheck -- npx -y --package=prodcheck prodcheck-mcp"
    npm_cmd = "npx prodcheck security --stack django -o SECURITY.md"
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

    body = f"""
<div class="wrap">
<section class="hero">
  <h1>The checklist you wish someone had given you before launch.</h1>
  <p class="lede">{fmt(C['total'])} items across five domains — security, performance,
  scale, integrations and what to do after it goes wrong. Built for solo founders and
  small teams with no security team to hand it to.</p>
  <p class="stat">
    <span><b>{fmt(C['total'])}</b> items</span>
    <span><b>{len(tree.domains())}</b> domains</span>
    <span><b>{fmt(C['release_gate'])}</b> release blockers</span>
    <span><b>{round(100 * C['stack_agnostic'] / C['total'])}%</b> apply to any stack</span>
    <span><b>{len(doc['stacks'])}</b> stack supplements</span>
  </p>

  <div class="ghbtns">
    <a class="btn primary" href="checklists.html">Browse the checklists</a>
    <a class="btn" href="{REPO}">★ Star on GitHub</a>
    <a class="btn" href="{REPO}/fork">Fork</a>
    <a class="btn" href="{NPM}">npm</a>
  </div>
</section>

<hr style="margin:44px 0">

<section id="use">
<h2>Three ways to use it</h2>
<p class="muted">No account, no API key, no sign-up. Pick one.</p>

<div class="cards">
  <div class="card">
    <h3>1 · Give it to your assistant</h3>
    <p>MCP server. The assistant pulls only the items relevant to what it is doing.
    Works with Claude, Cursor, Copilot, Gemini CLI, Codex, Cline, Cherry Studio —
    and with DeepSeek, Qwen, Kimi or GLM through any of them.</p>
    {codeblock('c-mcp', mcp)}
    <p class="small" style="margin:10px 0 0"><a href="{REPO}/blob/main/docs/mcp-clients.md">Config for every client →</a></p>
  </div>

  <div class="card">
    <h3>2 · Generate a file</h3>
    <p>A checklist scoped to your stack, written into your repo as a working document
    you commit and tick off.</p>
    {codeblock('c-npm', npm_cmd)}
    <p class="small" style="margin:10px 0 0"><a href="{REPO}#command-line">All commands →</a></p>
  </div>
</div>

<h3 style="margin-top:26px">3 · Paste a prompt</h3>
<p class="muted small">For a chat window with no MCP — ChatGPT, Gemini, DeepSeek, Kimi,
Qwen, GLM. Paste this, then the checklist file.</p>
{codeblock('c-prompt', prompt, 'copy prompt')}
<p class="small"><a href="{REPO}/blob/main/docs/prompts.md">Five more prompts — triage, PR review, working through it with you →</a></p>
</section>

<hr>

<section id="domains">
<h2>What is in it</h2>
<table>
<thead><tr><th>Domain</th><th class="n">Items</th></tr></thead>
<tbody>{domains_tbl}</tbody>
</table>
<p class="small muted">Stack supplements add
{fmt(sum(1 for i in doc['items'] if i['stack'] != 'any'))} more items across
{len(doc['stacks'])} products. They are opt-in — without <code>--stack</code> you get
only the items that name no product.</p>
</section>

<hr>

<section id="why">
<h2>Why this exists</h2>
<p>It started as the pre-launch security review for
<a href="https://arioo.com">Arioo</a>. Nothing available covered more than a fraction of
what we actually ship — a backend, a web app, native clients, a deploy pipeline, and a
set of AI agents with real tools attached — so the checklist got written.</p>
<p><b>This is the checklist, not a report.</b> It is the set of questions, generalised
away from one stack and rewritten as a working document anyone can run against their own
product.</p>
<h3>Solo founders have no security team</h3>
<p>You write the code, configure the infrastructure, set up the pipeline, and then you
are also the person who decides whether it is safe to launch. There is nobody to hand it
to. Most public checklists are either too shallow to catch anything real, or written for
companies with a security function.</p>
<h3>AI-assisted development changed the shape of the problem</h3>
<p>Over 1,300 items here — the <code>ai</code> and <code>ai-generated-code</code> areas —
did not need to exist a few years ago. When you ship an agent with tools, or review code a
model wrote faster than you would review a colleague's, you inherit failure modes standard
checklists do not cover.</p>
<h3>Built with AI, and honest about it</h3>
<p>Compiled and expanded with Claude and ChatGPT, working from a real pre-production
review rather than generating items from nothing. That matters twice: it is the honest
provenance for something that asks you to trust it, and the <code>ai-generated-code</code>
checklists apply to this repository too. Its own test suite has caught several bugs in
AI-written code here, which is the argument that section makes.</p>
</section>

<hr>

<section id="contribute">
<h2>Contributing</h2>
<p>The most useful contribution is a stack file for a stack that is not covered — there
are open issues for FastAPI, AWS, Kubernetes, Vercel, Firebase, Stripe and GraphQL, all
labelled <code>good first issue</code>. The format is documented end to end.</p>
<p>Corrections are worth more than additions. If an item is wrong, outdated, or
plausible-sounding but false, that is exactly the failure mode this repository warns
about — <a href="{REPO}/issues">open an issue</a>.</p>
<div class="ghbtns">
  <a class="btn" href="{REPO}/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</a>
  <a class="btn" href="{REPO}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Good first issues</a>
</div>
</section>

<hr>

<section id="license">
<h2>Licence</h2>
<table>
<tbody>
<tr><td>Content — the checklists and the data</td>
    <td><a href="{REPO}/blob/main/LICENSE">CC BY 4.0</a></td></tr>
<tr><td>Code — the CLI, the MCP server, the scripts</td>
    <td><a href="{REPO}/blob/main/LICENSE-CODE">MIT</a></td></tr>
</tbody>
</table>
<p class="small muted">Two licences because they are two different things. Creative
Commons is not written for software, and a CC-licensed npm package gets stopped by
corporate legal review.</p>
<p class="small muted">A starting point, not a guarantee, not a compliance certification,
and not a substitute for a professional audit. Completing every item does not make an
application secure. Use it to find problems, not to declare their absence.</p>
</section>
</div>
"""
    return page("prodcheck — pre-production checklists for solo founders",
                f"{fmt(C['total'])} pre-production checklist items across security, "
                "performance, scale, integrations and post-launch. CLI + MCP server.",
                body)


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
def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, "c"))

    open(os.path.join(OUT, "style.css"), "w", encoding="utf-8").write(CSS)
    open(os.path.join(OUT, ".nojekyll"), "w").write("")
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(build_index())
    open(os.path.join(OUT, "checklists.html"), "w", encoding="utf-8").write(
        build_checklists_index())

    pages = 0
    for d, a, path, stem in tree.walk():
        items = [i for i in doc["items"] if i["source"]["file"] == path]
        slug = f"{d}--{(a + '--') if a else ''}{stem}"
        open(os.path.join(OUT, "c", slug + ".html"), "w", encoding="utf-8").write(
            build_checklist_page(path, slug, tree.title_of(path), items))
        pages += 1
    for path, s in tree.stack_files():
        items = [i for i in doc["items"] if i["source"]["file"] == path]
        open(os.path.join(OUT, "c", f"stacks--{s}.html"), "w", encoding="utf-8").write(
            build_checklist_page(path, f"stacks--{s}", tree.title_of(path), items))
        pages += 1

    print(f"site/ — {pages + 2} pages, every count from data/checklist.json")


if __name__ == "__main__":
    main()
