# Open WebUI, LibreChat and other self-hosted chat

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

Both can reach the checklist. Which method depends on how your instance is deployed.

## Open WebUI

**As a tool.** Open WebUI reaches MCP servers through an OpenAPI bridge (`mcpo`). Run the
bridge alongside your instance:

```bash
uvx mcpo --port 8000 -- npx -y --package=prodcheck prodcheck-mcp
```

Then add `http://localhost:8000` as an OpenAPI tool server in Settings → Tools. The four
checklist tools appear to every model you have configured — including local ones through
Ollama.

**As a document.** Simpler and needs nothing running: generate markdown and upload it to a
Knowledge collection, then reference it with `#` in a chat.

```bash
npx prodcheck --gate -o blockers.md
```

## LibreChat

LibreChat supports MCP servers in `librechat.yaml`:

```yaml
mcpServers:
  prodcheck:
    command: npx
    args: ["-y", "--package=prodcheck", "prodcheck-mcp"]
```

Restart, and the tools are available to any endpoint you have configured — OpenAI,
Anthropic, Google, or an OpenAI-compatible provider such as OpenRouter, DeepSeek or Qwen.

## Running it in a container

Both are usually deployed in Docker, where `npx` may not be present. Either:

* Use an image with Node available, or
* Install the package into the image: `npm i -g prodcheck`, then use `prodcheck-mcp`
  directly as the command, or
* Skip MCP and use the [JSON over HTTP](http-api.md), which needs nothing installed.

The last option is the one to reach for if you are not sure. It always works.
