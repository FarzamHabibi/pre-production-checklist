#!/usr/bin/env python3
"""Generate data/checklist.json from the Markdown checklists.

Markdown stays the source of truth — it is what contributors read and edit on GitHub.
This script derives the machine-readable layer from it, so adding an item never means
editing two files.

Every field is *derived from structure*, never guessed. There is deliberately no
`severity` field: assigning one to thousands of items by heuristic would be invention,
not data. `release_gate` is the one priority signal, and it comes from which file an
item lives in.

A stack supplement's items take their domain from the checklist each section extends, via
the `<sub>from ...</sub>` back-link — so `prodcheck performance --stack django` returns
Django's performance items and none of its security ones.
"""
import hashlib, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import tree  # noqa: E402

ITEM = re.compile(r"^\* \[ \] (.+)$")
BACKLINK = re.compile(r"^<sub>from \[`([a-z0-9/-]+\.md)`\]")

RELEASE_GATE_FILES = {
    "checklists/security/core/17-release-gates.md",
    "checklists/security/ai/11-release-gate.md",
    "checklists/security/ai-generated-code/09-release-gate.md",
    "checklists/performance/09-release-gate.md",
    "checklists/scale/08-load-testing-and-gates.md",
    "checklists/post-launch/01-readiness.md",
}

STACK_LABEL = {
    "supabase": "Supabase", "nestjs": "NestJS", "nextjs-react": "Next.js / React",
    "google-cloud": "Google Cloud", "cloudflare": "Cloudflare",
    "github-actions": "GitHub", "docker": "Docker", "postgres": "PostgreSQL",
    "ios-swift": "iOS / Swift", "macos": "macOS",
    "rails": "Ruby on Rails", "django": "Django", "laravel": "Laravel",
    "spring": "Spring Boot", "go-gin": "Go / Gin", "express": "Express",
    "react-native": "React Native", "flutter": "Flutter",
    "android-kotlin": "Android / Kotlin",
    "fastapi": "FastAPI", "aws": "AWS", "kubernetes": "Kubernetes", "vercel": "Vercel",
    "firebase": "Firebase", "stripe": "Stripe", "graphql": "GraphQL",
}


def slug_id(prefix, text, seen):
    h = hashlib.sha1(re.sub(r"\s+", " ", text.strip().lower()).encode()).hexdigest()[:8]
    base = f"{prefix}.{h}"
    if base not in seen:
        seen.add(base)
        return base
    n = 2                                   # same text twice in one file
    while f"{base}-{n}" in seen:
        n += 1
    seen.add(f"{base}-{n}")
    return f"{base}-{n}"


def parse(path, prefix, domain, area, stack, stack_id, seen):
    """Read one checklist file into item records."""
    out = []
    checklist = section = subsection = None
    section_domain = domain
    for lineno, raw in enumerate(open(path, encoding="utf-8"), 1):
        line = raw.rstrip("\n")
        if line.startswith("### "):
            subsection = line[4:].strip()
        elif line.startswith("## "):
            section, subsection = line[3:].strip(), None
        elif line.startswith("# "):
            checklist = line[2:].strip()
        elif stack:
            m = BACKLINK.match(line)
            if m:
                # a stack section inherits the domain of the checklist it extends
                section_domain = tree.domain_of_path("checklists/" + m.group(1)) or domain
        m = ITEM.match(line)
        if not m:
            continue
        text = m.group(1).strip()
        out.append({
            "id": slug_id(prefix, text, seen),
            "text": text,
            "domain": section_domain,
            "area": area,
            "checklist": checklist,
            "section": section,
            "subsection": subsection,
            "stack": stack or "any",
            "stack_id": stack_id or "any",
            "release_gate": path in RELEASE_GATE_FILES,
            "source": {"file": path, "line": lineno},
        })
    return out


def main():
    items, seen = [], set()

    for domain, area, path, stem in tree.walk():
        prefix = tree.item_id_prefix(domain, area, stem)
        items += parse(path, prefix, domain, area, None, None, seen)

    for path, slug in tree.stack_files():
        label = STACK_LABEL.get(slug)
        if not label:
            sys.exit(f"stacks/{slug}.md has no STACK_LABEL entry — add one in build_data.py")
        items += parse(path, f"stacks.{slug}", None, None, label, slug, seen)

    by_domain = {}
    for i in items:
        by_domain[i["domain"] or "stacks"] = by_domain.get(i["domain"] or "stacks", 0) + 1

    payload = {
        "$schema": "./schema.json",
        "version": 2,
        "source": "https://github.com/FarzamHabibi/pre-production-checklist",
        "license": "CC-BY-4.0",
        "generated_by": "scripts/build_data.py",
        "domains": [
            {"id": d, "label": tree.DOMAIN_LABEL[d], "description": tree.DOMAIN_BLURB[d],
             "areas": [{"id": a, "label": tree.AREA_LABEL.get(a, a)}
                       for a in tree.areas(d) if a]}
            for d in tree.domains()
        ],
        "counts": {
            "total": len(items),
            "by_domain": by_domain,
            "stack_agnostic": sum(1 for i in items if i["stack"] == "any"),
            "release_gate": sum(1 for i in items if i["release_gate"]),
        },
        "stacks": sorted({i["stack"] for i in items if i["stack"] != "any"}),
        "stack_ids": sorted({i["stack_id"] for i in items if i["stack_id"] != "any"}),
        "items": items,
    }
    with open("data/checklist.json", "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    assert len(seen) == len(items), "id collision"
    print(f"data/checklist.json v2 — {len(items):,} items, "
          + ", ".join(f"{k} {v:,}" for k, v in by_domain.items()))


if __name__ == "__main__":
    main()
