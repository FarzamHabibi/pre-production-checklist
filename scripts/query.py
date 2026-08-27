#!/usr/bin/env python3
"""Query data/checklist.json — a small reference consumer of the data layer.

    ./scripts/query.py --stack django --group core
    ./scripts/query.py --release-gate
    ./scripts/query.py --search "cors" --format text
    ./scripts/query.py --stack supabase --format json

`--stack X` returns every stack-agnostic item plus the supplements for X, which is the
exact set someone on that stack needs. An unknown stack name is not an error — you get
the stack-agnostic core, which stands on its own.
"""
import argparse, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "checklist.json")


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--stack", action="append", default=[],
                   help="include supplements for this stack (repeatable)")
    p.add_argument("--group", action="append", default=[],
                   choices=["core", "ai", "vibe-coding", "stacks"])
    p.add_argument("--search", help="case-insensitive substring match on item text")
    p.add_argument("--release-gate", action="store_true", help="only release-blocking items")
    p.add_argument("--format", choices=["markdown", "text", "json", "count"],
                   default="markdown")
    a = p.parse_args()

    if not os.path.exists(DATA):
        sys.exit("data/checklist.json not found — run ./scripts/build.sh first")
    doc = json.load(open(DATA, encoding="utf-8"))
    items = doc["items"]

    if a.stack:
        def norm(x):
            return "".join(c for c in str(x).lower() if c.isalnum())
        want = {norm(s) for s in a.stack}
        items = [i for i in items
                 if i["stack"] == "any"
                 or norm(i["stack"]) in want
                 or norm(i.get("stack_id", "")) in want]
    if a.group:
        items = [i for i in items if i["group"] in a.group]
    if a.search:
        q = a.search.lower()
        items = [i for i in items if q in i["text"].lower()]
    if a.release_gate:
        items = [i for i in items if i["release_gate"]]

    if a.format == "count":
        print(len(items))
    elif a.format == "json":
        json.dump(items, sys.stdout, indent=2, ensure_ascii=False)
        print()
    elif a.format == "text":
        for i in items:
            print(i["text"])
    else:
        heading = None
        for i in items:
            h = (i["checklist"], i["section"])
            if h != heading:
                heading = h
                print(f"\n## {i['checklist']} — {i['section']}\n")
            print(f"* [ ] {i['text']}")
        print(f"\n<!-- {len(items)} items -->")


if __name__ == "__main__":
    main()
