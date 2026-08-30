#!/usr/bin/env python3
"""Fill demo/index.html with real numbers and real code.

The demo is a scripted replay, which is the only way to get a loopable take: a live
agent run takes half a minute, differs every time, and cannot be cut to length. Scripted
is not the same as invented, though — every figure comes from data/checklist.json and
every quoted line from evals/fixtures/flawed/src/app.js, which genuinely contains the
defects shown, at the line numbers shown. If the data moves, this regenerates the demo
and scripts/verify.sh fails until it has been run.

    python3 scripts/build_demo.py
"""
import html as H
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, "scripts"))

TEMPLATE = "demo/index.html"
FIXTURE = "evals/fixtures/flawed/src/app.js"
DEFECTS = "evals/fixtures/flawed/DEFECTS.json"

# The findings the demo shows, by defect id. Chosen because each is obvious the moment
# you see the line — a demo is no place for a subtle one nobody can read in four seconds
# — and because all three sit in one route, so a single screenful of code holds them.
SHOW = ["sql-injection", "missing-authz", "mass-assignment"]

# Lines of code to show around them. The window is derived from the findings rather than
# written down, so a finding can never point outside the code the viewer can see.
PAD_BEFORE, PAD_AFTER = 3, 3

UNKNOWNS = [
    "Whether rate limiting exists at the edge. Nothing in this repository configures it, "
    "and the answer lives in your CDN dashboard.",
    "Whether the database enforces row-level security. The application never relies on it, "
    "so the code cannot tell you either way.",
    "Whether backups have ever been restored. A backup nobody has restored is a hope.",
]


MARKER = re.compile(r"\s*//\s*PLANTED:")


def real_line(src, marked):
    """Resolve a defect's recorded line to the code it is actually about.

    DEFECTS.json records the line of the PLANTED marker, which is a comment naming the
    defect for the eval grader. Quoting that line as a finding's evidence would show the
    answer key instead of the vulnerability, and cite a comment as the fault.
    """
    n = marked
    while n <= len(src) and (MARKER.match(src[n - 1]) or not src[n - 1].strip()):
        n += 1
    if n > len(src):
        raise SystemExit(f"defect at line {marked} has no code line after its marker")
    return n


def fixture_lines(lo, hi):
    src = open(FIXTURE, encoding="utf-8").read().split("\n")
    out = []
    for n in range(lo, min(hi, len(src)) + 1):
        text = src[n - 1]
        # the markers are the grader's answer key, not part of the code under review
        if MARKER.match(text):
            continue
        out.append({"n": n, "t": H.escape(text) or "&nbsp;"})
    return out


def main():
    doc = json.load(open("data/checklist.json", encoding="utf-8"))
    defects = json.load(open(DEFECTS, encoding="utf-8"))
    by_id = {d["id"]: d for d in (defects.get("defects") or defects)}

    missing = [i for i in SHOW if i not in by_id]
    if missing:
        raise SystemExit(f"demo references defects that no longer exist: {missing}")

    findings = []
    src = open(FIXTURE, encoding="utf-8").read().split("\n")
    for i in SHOW:
        d = by_id[i]
        line = real_line(src, d["line"])
        findings.append({
            "line": line,
            "where": f"src/app.js:{line}",
            "what": H.escape(d.get("what") or d.get("description") or ""),
            "code": H.escape(src[line - 1].strip()),
        })

    lines = [f["line"] for f in findings]
    lo, hi = max(1, min(lines) - PAD_BEFORE), max(lines) + PAD_AFTER
    code = fixture_lines(lo, hi)

    # A finding that highlights nothing is worse than one fewer finding: the viewer sees
    # a claim with no evidence beside it. This makes that unshippable rather than subtle.
    shown = {c["n"] for c in code}
    orphan = [f["where"] for f in findings if f["line"] not in shown]
    if orphan:
        raise SystemExit(f"findings fall outside the code window {lo}-{hi}: {orphan}")
    if len(code) > 16:
        raise SystemExit(f"code window is {len(code)} lines — too tall for the stage")

    # What a scoped review actually returns for this project, computed rather than picked:
    # the portable release gate plus the supplements for the stack the fixture uses.
    sys.path.insert(0, os.path.join(ROOT, "cli"))
    gate = [x for x in doc["items"] if x["release_gate"]]
    scoped = len([x for x in gate if x["stack"] == "any"])

    data = {
        "total": f"{doc['counts']['total']:,}",
        "scoped": scoped,
        "stack": ["Express", "PostgreSQL", "Docker"],
        "code": code,
        "findings": findings,
        "unknowns": [H.escape(u) for u in UNKNOWNS],
    }

    page = open(TEMPLATE, encoding="utf-8").read()
    if "__DATA__" not in page:
        # already filled: swap the previous payload out so this is safe to re-run
        page = re.sub(r"const DATA = \{.*?\n\};", "const DATA = __DATA__;", page,
                      count=1, flags=re.S)
    if "__DATA__" not in page:
        raise SystemExit("demo/index.html has no DATA placeholder to fill")

    payload = json.dumps(data, indent=2, ensure_ascii=False)
    open(TEMPLATE, "w", encoding="utf-8").write(page.replace("__DATA__", payload + ";", 1)
                                                    .replace(payload + ";;", payload + ";"))
    print(f"demo/index.html — {data['total']} items, {scoped} scoped, "
          f"{len(findings)} findings, fixture lines {lo}-{hi}")


if __name__ == "__main__":
    main()
