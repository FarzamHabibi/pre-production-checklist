#!/usr/bin/env python3
"""Fill demo/chat.html with a conversation whose every part is real.

The other demo shows what prodcheck contains. This one answers the question an issue
actually asked: what does using it look like, turn by turn, in the assistant you already
have open. The turns are scripted so the recording is one take, but the tool name and
arguments are a real MCP call, the counts come from data/checklist.json, and the code and
line numbers come from evals/fixtures/flawed/src/app.js.

    python3 scripts/build_chat.py
"""
import html as H
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

TEMPLATE = "demo/chat.html"
FIXTURE = "evals/fixtures/flawed/src/app.js"
DEFECTS = "evals/fixtures/flawed/DEFECTS.json"
MARKER = re.compile(r"\s*//\s*PLANTED:")
SHOW = ["missing-authz", "sql-injection"]


def real_line(src, marked):
    """DEFECTS.json records the marker's line; the defect is the code after it."""
    n = marked
    while n <= len(src) and (MARKER.match(src[n - 1]) or not src[n - 1].strip()):
        n += 1
    return n


def mcp_call(name, args):
    """Make the call for real, so the tool name and shape cannot drift from the server."""
    req = [
        json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize",
                    "params": {"protocolVersion": "2025-06-18"}}),
        json.dumps({"jsonrpc": "2.0", "id": 2, "method": "tools/call",
                    "params": {"name": name, "arguments": args}}),
    ]
    out = subprocess.run(["node", "cli/mcp.js"], input="\n".join(req) + "\n",
                         capture_output=True, text=True, timeout=60).stdout
    last = [l for l in out.strip().split("\n") if l.strip()][-1]
    return json.loads(last)["result"]["content"][0]["text"]


def main():
    doc = json.load(open("data/checklist.json", encoding="utf-8"))
    src = open(FIXTURE, encoding="utf-8").read().split("\n")
    by_id = {d["id"]: d for d in json.load(open(DEFECTS, encoding="utf-8"))["defects"]}

    args = {"stacks": ["express", "postgres"], "release_gate_only": True}
    returned = mcp_call("checklist_for_stack", args)
    count = int(re.match(r"(\d+) items", returned).group(1))

    findings = []
    for i in SHOW:
        d = by_id[i]
        n = real_line(src, d["line"])
        findings.append({
            "where": f"src/app.js:{n}",
            "what": H.escape(d.get("what") or d.get("description") or ""),
            "code": H.escape(src[n - 1].strip()),
        })

    data = {
        "question": "we ship Thursday. what did I forget?",
        "ack": "Let me pull the checks that apply to this project rather than guess. "
               "It is an Express app on Postgres, so I will start with what should "
               "block a release.",
        "tool": {
            "name": "checklist_for_stack",
            "args": '<span class="k">stacks</span>: ["express", "postgres"]\n'
                    '<span class="k">release_gate_only</span>: true',
            "returned": f"{count} items",
        },
        "verdictLead": f"Two of the {count} are true here, and I can show you where.",
        "findings": findings,
        "unknowns": [
            "Whether rate limiting exists at the edge. Nothing in this repository "
            "configures it, so the answer is in your CDN, not the code.",
        ],
        "closing": "That is evidence, not a verdict. <b>I have not marked anything "
                   "verified</b> — the two findings are real and the rest is still open.",
        "loop": 13500,
    }

    page = open(TEMPLATE, encoding="utf-8").read()
    if "__DATA__" not in page:
        page = re.sub(r"const DATA = \{.*?\n\};+", "const DATA = __DATA__;", page,
                      count=1, flags=re.S)
    if "__DATA__" not in page:
        raise SystemExit("demo/chat.html has no DATA placeholder")

    payload = json.dumps(data, indent=2, ensure_ascii=False)
    open(TEMPLATE, "w", encoding="utf-8").write(page.replace("__DATA__", payload + ";", 1))
    print(f"demo/chat.html — real call returned {count} items, "
          f"{len(findings)} findings at lines "
          f"{', '.join(f['where'].split(':')[1] for f in findings)}")


if __name__ == "__main__":
    main()
