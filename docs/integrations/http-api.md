# The JSON API

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

There is no API to sign up for. Every item is a static JSON file on a CDN, so anything
that can fetch a URL can use the checklist — a workflow tool, a shell script, a spreadsheet.

```
https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json
```

Always current, straight from the repository:

```
https://raw.githubusercontent.com/FarzamHabibi/pre-production-checklist/main/data/checklist.json
```

Use the CDN URL when you want a version you can pin (`prodcheck@1.16.0`), and the raw URL
when you want whatever is on `main` right now.

## Shape

```jsonc
{
  "version": 2,
  "counts":  { "total": 4343, "by_domain": { ... }, "release_gate": 379 },
  "domains": [ { "id": "security", "label": "Security", "areas": [...] } ],
  "stacks":  ["Django", "Ruby on Rails", "..."],
  "items": [
    {
      "id": "security.core.04-backend-api.d1a32978",
      "text": "Rate-limit login.",
      "domain": "security",
      "area": "core",
      "checklist": "Backend Application & API",
      "section": "Backend Application Security",
      "stack": "any",
      "stack_id": "any",
      "release_gate": false,
      "source": { "file": "checklists/security/core/04-backend-api.md", "line": 185 }
    }
  ]
}
```

Full schema: [`data/schema.json`](../../data/schema.json). There is deliberately no
`severity` field — [why](../../data/README.md#there-is-no-severity-field).

## The three filters you actually need

```js
const doc = await (await fetch("https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json")).json()

// everything that should block a release
doc.items.filter(i => i.release_gate)

// one domain, no product-specific noise
doc.items.filter(i => i.domain === "performance" && i.stack === "any")

// one domain plus the supplements for your stack
doc.items.filter(i =>
  i.domain === "security" && (i.stack === "any" || i.stack_id === "django"))
```

`stack_id` is the file slug — `django`, `rails`, `nextjs-react` — which is what people
type. `stack` is the display label. Both are present so you can match either.

## Zapier, Make and similar

Neither runs a local process, so MCP is not available. Use an HTTP request step against
the URL above, then a code or filter step with one of the expressions above. The response
is around 2.3 MB; if your platform limits payload size, use the
[per-checklist markdown files](https://github.com/FarzamHabibi/pre-production-checklist/tree/main/checklists)
on the raw URL instead — each is a few kilobytes.

## Rate limits and courtesy

jsDelivr and the GitHub raw endpoint are both free and neither is yours. Cache the
response rather than fetching it per run; the data changes on release, not per minute.
