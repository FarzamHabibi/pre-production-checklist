#!/usr/bin/env python3
"""The one place that knows how checklists/ is laid out.

Every build script imports this, so adding a domain means adding a folder and a line in
DOMAINS — not editing four scripts that each walk the tree their own way.

Layout:
    checklists/<domain>/<file>.md              flat domain, e.g. performance/
    checklists/<domain>/<area>/<file>.md       nested domain, e.g. security/core/
    checklists/stacks/<product>.md             spans every domain; each item's domain
                                               comes from the checklist it extends
"""
import os

CHECKLISTS = "checklists"
SKIP = {"README.md", "_TEMPLATE.md"}

# Order matters: it is the order everything renders in.
DOMAINS = [
    ("security", "Security", "Not getting breached, abused, or taken down."),
    ("scale", "Scale", "Surviving ten times the load, and knowing what breaks first."),
    ("performance", "Performance", "Being fast for a real user, with Lighthouse agreeing."),
    ("integrations", "Integrations", "Being connected: search, analytics, monitoring."),
]
DOMAIN_IDS = [d for d, _, _ in DOMAINS]
DOMAIN_LABEL = {d: label for d, label, _ in DOMAINS}
DOMAIN_BLURB = {d: blurb for d, _, blurb in DOMAINS}

# Declared order — "core" first, because that is what most readers need.
AREA_ORDER = ["core", "ai", "ai-generated-code"]

AREA_LABEL = {
    "core": "Core",
    "ai": "AI & agents",
    "ai-generated-code": "AI-generated code",
}
AREA_BLURB = {
    "core": "Application, data, infrastructure, delivery and the release gates.",
    "ai": "LLM features, agents, tool calling, RAG and MCP.",
    "ai-generated-code": "The bugs AI coding assistants actually write. Also known as vibe coding.",
}


def domains():
    """Domain ids that actually exist on disk, in declared order."""
    return [d for d in DOMAIN_IDS if os.path.isdir(os.path.join(CHECKLISTS, d))]


def areas(domain):
    """Area ids inside a domain, or [None] when the domain holds files directly."""
    base = os.path.join(CHECKLISTS, domain)
    subs = [e for e in os.listdir(base) if os.path.isdir(os.path.join(base, e))]
    if not subs:
        return [None]
    rank = {a: i for i, a in enumerate(AREA_ORDER)}
    return sorted(subs, key=lambda a: (rank.get(a, len(rank)), a))


def files(domain, area=None):
    """(path, stem) for every checklist file in a domain or area, in filename order."""
    base = os.path.join(CHECKLISTS, domain, area) if area else os.path.join(CHECKLISTS, domain)
    out = []
    for f in sorted(os.listdir(base)):
        if not f.endswith(".md") or f in SKIP or os.path.isdir(os.path.join(base, f)):
            continue
        out.append((os.path.join(base, f).replace(os.sep, "/"), f[:-3]))
    return out


def walk():
    """Every checklist file: (domain, area or None, path, stem)."""
    for d in domains():
        for a in areas(d):
            for path, stem in files(d, a):
                yield d, a, path, stem


def stack_files():
    """(path, slug) for every product supplement."""
    base = os.path.join(CHECKLISTS, "stacks")
    if not os.path.isdir(base):
        return []
    return [(os.path.join(base, f).replace(os.sep, "/"), f[:-3])
            for f in sorted(os.listdir(base))
            if f.endswith(".md") and f not in SKIP]


def title_of(path):
    """The H1 of a checklist file."""
    with open(path, encoding="utf-8") as fh:
        return fh.readline().lstrip("# ").strip()


def domain_of_path(path):
    """checklists/security/core/04-x.md -> 'security'."""
    parts = path.split("/")
    return parts[1] if len(parts) > 2 and parts[0] == CHECKLISTS else None


def item_id_prefix(domain, area, stem):
    return f"{domain}.{area}.{stem}" if area else f"{domain}.{stem}"
