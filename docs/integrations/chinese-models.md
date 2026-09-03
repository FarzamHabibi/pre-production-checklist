# DeepSeek, Qwen, Kimi and GLM

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

All four are strong at code review and all four are reachable, but none of their web chat
interfaces is an MCP client. There are two good routes.

## 1. Through an MCP client (recommended)

Configure the model as an OpenAI-compatible endpoint in a client that speaks MCP, then add
the server as normal. The checklist works identically whichever model is behind it.

| Model | OpenAI-compatible base URL | Model id examples |
| --- | --- | --- |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat`, `deepseek-reasoner` |
| Qwen (Alibaba) | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-max`, `qwen-plus` |
| Kimi (Moonshot) | `https://api.moonshot.cn/v1` | `moonshot-v1-128k` |
| GLM (Zhipu) | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-plus` |

Clients that accept a custom base URL **and** speak MCP:

* **Cherry Studio** — the most direct route if you use these providers; add the MCP server
  under Settings → MCP, then pick your provider.
* **Cline / Roo Code / Continue** — inside VS Code.
* **Cursor** — custom OpenAI-compatible model.

MCP config is the same everywhere:

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

**Qwen Code**, Alibaba's CLI, has native MCP support — see
[mcp-clients.md](../mcp-clients.md#qwen-code).

## 2. Paste a prompt into the web chat

Works with all four, no setup:

```bash
npx prodcheck --gate -o BLOCKERS.md
```

Then paste a [prompt](../prompts.md) followed by the file. Use `--gate` (325 items) rather
than a whole domain — it leaves room for the code, which is the part that matters.

## Context windows

DeepSeek, Kimi and GLM all offer long-context models, which is tempting: paste all 4,352
items and be done. Do not. A model given a huge checklist and a small diff reviews the
checklist. Narrowing first with `--gate`, `--domain` or `--search` produces better
findings from every model, including the expensive ones.

## One caution that applies to every provider

Pasting your source code into a hosted model sends it to that provider. Check the data
handling terms for the one you pick, and whether prompts are retained or used for
training — this is item territory in
[`security/ai/04-data-access-and-privacy.md`](../../checklists/security/ai/04-data-access-and-privacy.md).
For a private codebase, prefer a route where you control the endpoint.
