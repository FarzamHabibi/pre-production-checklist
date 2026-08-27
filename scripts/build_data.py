#!/usr/bin/env python3
"""Generate data/checklist.json from the Markdown checklists.

Markdown stays the source of truth — it is what contributors read and edit on GitHub.
This script derives the machine-readable layer from it, so adding an item never means
editing two files.

Every field here is *derived from structure*, never guessed. There is deliberately no
`severity` field: assigning one to 2,922 items by heuristic would be invention, not data.
`release_gate` is the one priority signal, and it comes from which file an item lives in.
"""
import hashlib, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

GROUPS = ["core", "ai", "vibe-coding", "stacks"]
SKIP = {"README.md", "_TEMPLATE.md"}
RELEASE_GATE_FILES = {
    "checklists/core/17-release-gates.md",
    "checklists/ai/11-release-gate.md",
    "checklists/vibe-coding/09-release-gate.md",
}
ITEM = re.compile(r"^\* \[ \] (.+)$")

# stacks/<slug>.md -> the value that lands in `stack`
STACK_LABEL = {
    "supabase": "Supabase", "nestjs": "NestJS", "nextjs-react": "Next.js / React",
    "google-cloud": "Google Cloud", "cloudflare": "Cloudflare",
    "github-actions": "GitHub", "docker": "Docker", "postgres": "PostgreSQL",
    "ios-swift": "iOS / Swift", "macos": "macOS",
}


def slug_id(group, stem, text, seen):
    h = hashlib.sha1(re.sub(r"\s+", " ", text.strip().lower()).encode()).hexdigest()[:8]
    base = f"{group}.{stem}.{h}"
    if base not in seen:
        seen.add(base)
        return base
    n = 2                                   # same text twice in one file
    while f"{base}-{n}" in seen:
        n += 1
    seen.add(f"{base}-{n}")
    return f"{base}-{n}"


def main():
    items, seen = [], set()
    for group in GROUPS:
        folder = os.path.join("checklists", group)
        for fname in sorted(os.listdir(folder)):
            if not fname.endswith(".md") or fname in SKIP:
                continue
            path = os.path.join(folder, fname).replace(os.sep, "/")
            stem = fname[:-3]
            checklist = section = subsection = None
            for lineno, raw in enumerate(open(path, encoding="utf-8"), 1):
                line = raw.rstrip("\n")
                if line.startswith("### "):
                    subsection = line[4:].strip()
                elif line.startswith("## "):
                    section, subsection = line[3:].strip(), None
                elif line.startswith("# "):
                    checklist = line[2:].strip()
                m = ITEM.match(line)
                if not m:
                    continue
                text = m.group(1).strip()
                items.append({
                    "id": slug_id(group, stem, text, seen),
                    "text": text,
                    "group": group,
                    "checklist": checklist,
                    "section": section,
                    "subsection": subsection,
                    "stack": STACK_LABEL.get(stem, "any") if group == "stacks" else "any",
                    "release_gate": path in RELEASE_GATE_FILES,
                    "source": {"file": path, "line": lineno},
                })

    os.makedirs("data", exist_ok=True)
    payload = {
        "$schema": "./schema.json",
        "version": 1,
        "source": "https://github.com/FarzamHabibi/pre-production-checklist",
        "license": "CC-BY-4.0",
        "generated_by": "scripts/build_data.py",
        "counts": {
            "total": len(items),
            "by_group": {g: sum(1 for i in items if i["group"] == g) for g in GROUPS},
            "stack_agnostic": sum(1 for i in items if i["stack"] == "any"),
            "release_gate": sum(1 for i in items if i["release_gate"]),
        },
        "stacks": sorted({i["stack"] for i in items if i["stack"] != "any"}),
        "items": items,
    }
    with open("data/checklist.json", "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"data/checklist.json — {len(items):,} items, "
          f"{payload['counts']['stack_agnostic']:,} stack-agnostic, "
          f"{payload['counts']['release_gate']:,} release-gate")
    assert len(seen) == len(items), "id collision"


if __name__ == "__main__":
    main()
