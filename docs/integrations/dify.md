# Dify

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

## As a knowledge source

The most robust option, and it works on Dify Cloud as well as self-hosted.

1. Generate the checklist you want as markdown:

```bash
npx prodcheck security --stack django -o security.md
npx prodcheck --gate -o blockers.md
```

2. Upload it to a **Knowledge Base** in Dify.
3. Point your app at that knowledge base.

Split by heading rather than by fixed character count — each `##` is a coherent section,
and cutting mid-section produces retrieval that returns half a control.

Upload the domains separately rather than one large file. A question about page speed
should not retrieve prompt-injection items.

## As data in a workflow

In a **Workflow** or **Chatflow** app, an **HTTP Request** node against the JSON:

```
GET https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json
```

Then a **Code** node to select what the step needs:

```python
def main(response: dict) -> dict:
    items = response["items"]
    picked = [i for i in items
              if i["release_gate"] and i["stack"] in ("any", "Django")]
    return {"checklist": "\n".join("- " + i["text"] for i in picked)}
```

Feed `checklist` into the LLM node's prompt alongside the code being reviewed.

## As an MCP tool

If your Dify version supports MCP tools, add the server with command `npx` and arguments
`-y --package=prodcheck prodcheck-mcp`. This needs self-hosted Dify with Node available in
the container — stdio MCP starts a local process. On Dify Cloud, use one of the two
methods above.

## Prompt

Use one of the [ready-made prompts](../prompts.md) as the app's instruction, not a
paraphrase. The three rules in them — cite `file:line`, `unknown` is a real answer, never
mark anything verified — are the difference between a review and a rubber stamp.
