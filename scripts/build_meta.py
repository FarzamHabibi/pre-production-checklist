#!/usr/bin/env python3
"""Derive every user-facing count and blurb from the data, so nothing drifts.

Three places describe this repository — the README headline, the npm package
description, and the GitHub repository sidebar. Hand-maintaining three copies of the
same numbers is how they end up disagreeing, which is exactly what happened.

This computes them once from data/checklist.json and writes:
  README.md                 the headline, between HTML markers
  package.json              the "description" field
  .github/description.txt   the canonical sidebar text, which CI compares against
                            the live GitHub description
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BEGIN = "<!-- counts:begin -->"
END = "<!-- counts:end -->"


def facts():
    doc = json.load(open("data/checklist.json", encoding="utf-8"))
    c = doc["counts"]
    files = 0
    for grp in ["core", "ai", "vibe-coding", "stacks"]:
        files += sum(1 for f in os.listdir(os.path.join("checklists", grp))
                     if f.endswith(".md") and f not in ("README.md", "_TEMPLATE.md"))
    return {
        "total": c["total"],
        "files": files,
        "stacks": len(doc["stacks"]),
        "portable": round(100 * c["stack_agnostic"] / c["total"]),
        "gate": c["release_gate"],
    }


def main():
    f = facts()

    headline = (f"**{f['total']:,} security items across {f['files']} checklists.** "
                f"{f['portable']}% of them apply to any stack.")

    sidebar = (f"Pre-production security checklists for solo founders. "
               f"{f['total']:,} items, {f['portable']}% portable to any stack, "
               f"{f['stacks']} stack supplements — plus AI/agent security and the bugs "
               f"AI coding assistants actually write.")

    npm_desc = (f"Pre-production security checklists for solo founders — {f['total']:,} "
                f"items, {f['portable']}% portable to any stack, {f['stacks']} stack "
                f"supplements. CLI + MCP server.")

    # README headline, between markers so this is safe to re-run
    readme = open("README.md", encoding="utf-8").read()
    if BEGIN not in readme:
        raise SystemExit(f"README.md is missing the {BEGIN} marker")
    readme = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END),
                    f"{BEGIN}\n{headline}\n{END}", readme, flags=re.S)
    open("README.md", "w", encoding="utf-8").write(readme)

    pkg = json.load(open("package.json", encoding="utf-8"))
    pkg["description"] = npm_desc
    with open("package.json", "w", encoding="utf-8") as fh:
        json.dump(pkg, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    os.makedirs(".github", exist_ok=True)
    open(".github/description.txt", "w", encoding="utf-8").write(sidebar + "\n")

    print(f"meta: {f['total']:,} items, {f['files']} checklists, "
          f"{f['stacks']} stacks, {f['portable']}% portable")
    print(f"  sidebar -> .github/description.txt")


if __name__ == "__main__":
    main()
