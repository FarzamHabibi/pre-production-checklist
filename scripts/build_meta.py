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
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import tree  # noqa: E402
import prompt as promptmod  # noqa: E402

BEGIN = "<!-- counts:begin -->"
P_BEGIN = "<!-- start-prompt:begin -->"
P_END = "<!-- start-prompt:end -->"
END = "<!-- counts:end -->"


def facts():
    doc = json.load(open("data/checklist.json", encoding="utf-8"))
    c = doc["counts"]
    files = sum(1 for _ in tree.walk()) + len(tree.stack_files())
    return {
        "domains": len(tree.domains()),
        "total": c["total"],
        "files": files,
        "stacks": len(doc["stacks"]),
        "portable": round(100 * c["stack_agnostic"] / c["total"]),
        "gate": c["release_gate"],
    }


def inject_prompt(path, block):
    """Replace whatever sits between the start-prompt markers in `path`."""
    text = open(path, encoding="utf-8").read()
    if P_BEGIN not in text:
        raise SystemExit(f"{path} is missing the {P_BEGIN} marker")
    out = re.sub(re.escape(P_BEGIN) + r".*?" + re.escape(P_END),
                 f"{P_BEGIN}\n{block}\n{P_END}", text, flags=re.S)
    if out != text:
        open(path, "w", encoding="utf-8").write(out)


def main():
    f = facts()

    headline = (f"**{f['total']:,} items across {f['files']} checklists** in "
                f"{f['domains']} domain{'s' if f['domains'] > 1 else ''}. "
                f"{f['portable']}% of them apply to any stack.")

    sidebar = (f"Pre-production checklists for solo founders. "
               f"{f['total']:,} items, {f['portable']}% portable to any stack, "
               f"{f['stacks']} stack supplements — plus AI/agent security and the bugs "
               f"AI coding assistants actually write.")

    npm_desc = (f"Pre-production checklists for solo founders — {f['total']:,} "
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

    # the start prompt: one source, two generated copies, so they cannot disagree
    fenced = "```text\n" + promptmod.start_prompt(f["total"]) + "\n```"
    for path in ("README.md", "docs/prompts.md"):
        inject_prompt(path, fenced)

    os.makedirs(".github", exist_ok=True)
    open(".github/description.txt", "w", encoding="utf-8").write(sidebar + "\n")

    print(f"meta: {f['total']:,} items, {f['files']} checklists, "
          f"{f['stacks']} stacks, {f['portable']}% portable")
    print(f"  sidebar -> .github/description.txt")
    print(f"  start prompt -> README.md, docs/prompts.md")


if __name__ == "__main__":
    main()
