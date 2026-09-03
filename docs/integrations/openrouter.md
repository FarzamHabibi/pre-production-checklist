# OpenRouter

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

OpenRouter is a **model router**, not an MCP client. It gives one OpenAI-compatible
endpoint for Claude, GPT, Gemini, Llama, DeepSeek, Qwen, Kimi, GLM and a few hundred
others — but it does not run tools on your machine, so it cannot start an MCP server by
itself.

That is not a limitation in practice: MCP lives in the client. Point a client at
OpenRouter for the model, and at prodcheck for the checklist.

## Use OpenRouter as the model inside an MCP client

Cline, Roo Code, Continue and Cursor all accept an OpenAI-compatible base URL.

```
Base URL:  https://openrouter.ai/api/v1
API key:   your OpenRouter key
Model:     anthropic/claude-sonnet-4.5   (or any other id)
```

Then add the MCP server exactly as in [mcp-clients.md](../mcp-clients.md) — the config is
identical regardless of which model is behind it:

```json
{
  "mcpServers": {
    "prodcheck": {
      "command": "npx",
      "args": ["-y", "--package=prodcheck", "prodcheck-mcp"]
    }
  }
}
```

The assistant calls the checklist tools; OpenRouter only supplies the model.

## Use OpenRouter directly, without MCP

If you are calling the API from your own code, fetch the checklist yourself and put it in
the request. This is the same pattern as any OpenAI-compatible client:

```js
const doc = await (await fetch("https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json")).json()
const items = doc.items.filter(i => i.release_gate).map(i => "- " + i.text).join("\n")

const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "anthropic/claude-sonnet-4.5",
    messages: [
      { role: "system", content: REVIEW_PROMPT },   // from docs/prompts.md
      { role: "user", content: `Checklist:\n${items}\n\nDiff:\n${diff}` }
    ]
  })
})
```

Use [`--gate`](../../README.md#command-line) rather than the whole checklist —
325 items fit comfortably in any context window; 4,352 do not leave room for the code.

## Choosing a model

Whatever you pick, the review is only as good as the constraints in the prompt. The
[prompts](../prompts.md) demand a `file:line` citation for every claim and make `unknown`
a first-class answer, because every model — cheap or expensive — will otherwise report
that the code is fine. Spot-check the citations; a wrong line number means the whole run
is suspect.
