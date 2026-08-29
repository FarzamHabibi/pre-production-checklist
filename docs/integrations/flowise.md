# Flowise

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

## Custom Tool over HTTP

The most portable option: give the agent a tool that fetches and filters the checklist.

Add a **Custom Tool** with this function body:

```js
const res = await fetch("https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json");
const doc = await res.json();

const domain = $domain || "security";
const stack  = $stack  || "any";

const items = doc.items.filter(i =>
  i.domain === domain && (i.stack === "any" || i.stack_id === stack)
);

return items.slice(0, 120).map(i => "- " + i.text).join("\n");
```

Input schema: `domain` (security, performance, scale, integrations, post-launch) and
`stack` (django, rails, nextjs-react, …). Describe them in the tool description so the
agent fills them in correctly.

Cap the result. An agent that receives 1,500 items in one tool response will summarise
them instead of using them.

## Document Store

For retrieval instead of tool calling: generate markdown and load it.

```bash
npx prodcheck performance -o performance.md
```

Use a **Markdown Text Splitter** and split on headings. Load each domain as its own
document so a retrieval about page speed cannot return security items.

## MCP node

If your Flowise version has an MCP node, use command `npx` with arguments
`-y --package=prodcheck prodcheck-mcp`. Self-hosted only — stdio MCP runs a local process.
