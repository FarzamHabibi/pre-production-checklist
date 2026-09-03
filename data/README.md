# Machine-readable data

[`checklist.json`](checklist.json) is every item in this repository as structured data,
validated against [`schema.json`](schema.json). It exists so tools — a CLI, an MCP
server, a website, your own script — can filter the checklist instead of making people
read 4,343 items.

**Generated. Do not edit.** The Markdown under `checklists/` is the source of truth.
Run `./scripts/build.sh` to regenerate.

## Why Markdown is the source, not this file

The obvious design is YAML-first: author structured data, generate the Markdown. It was
tempting, and it's wrong for this project.

Contributors read and edit Markdown on GitHub. Making them write YAML to add one item
would cost more contributions than the structure is worth. Every field here is derivable
from the Markdown's own structure, so there is no reason to make a human maintain both.

## Shape

```json
{
  "version": 2,
  "counts": { "total": 4343, "stack_agnostic": 3801, "release_gate": 379 },
  "stacks": ["Cloudflare", "Docker", "GitHub", "..."],
  "items": [
    {
      "id": "security.core.04-backend-api.d1a32978",
      "text": "Rate-limit login.",
      "domain": "security",
      "area": "core",
      "checklist": "Backend Application & API",
      "section": "Backend Application Security",
      "subsection": "Abuse / availability",
      "stack": "any",
      "stack_id": "any",
      "release_gate": false,
      "source": { "file": "checklists/security/core/04-backend-api.md", "line": 185 }
    }
  ]
}
```

### `id` stability

`<domain>.<area>.<file-stem>.<sha1-8>` for nested domains, `<domain>.<file-stem>.<sha1-8>` for flat ones

Ids changed once, at 1.0.0, when the repository moved to domain folders. They are stable from there.

Stable when items are reordered, when a file gains or loses items, and when whitespace or
casing changes. **Changes when the item's wording changes** — that is intentional: a
reworded check is a different check, and anything tracking completion state should notice.

### There is no `severity` field

By design. Assigning a severity to 4,343 items by heuristic would be invention presented
as data, and every consumer would inherit the guess.

`release_gate` is the one priority signal, and it is honest: it means the item lives in a
release-gate checklist, nothing more. 379 items carry it; 316 of those apply to any stack.

Rank by your own threat model. A missing `SameSite` cookie attribute is critical for a
banking app and cosmetic for a static docs site; no field in a shared dataset can know
which one you are.

## Using it

The reference consumer is [`scripts/query.py`](../scripts/query.py):

```bash
./scripts/query.py --stack django --domain security   # security + Django supplement
./scripts/query.py --stack supabase --release-gate    # what must pass before shipping
./scripts/query.py --search cors --format text
./scripts/query.py --stack rails --format json        # feed it to something else
```

`--stack X` returns every stack-agnostic item plus supplements for X. An unrecognized
stack is not an error — you get the stack-agnostic core, which stands on its own. That is
the whole design: **the core works for a stack nobody has written a file for yet.**

## Stability

`version` is bumped on breaking changes to the shape. Field *values* change whenever the
checklists do, which is often — pin a commit or a release tag if you need reproducibility.
