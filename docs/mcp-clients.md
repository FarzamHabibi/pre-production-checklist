# Using prodcheck with your AI assistant

[← back to repository](../README.md)

There are two ways to give an assistant this checklist. Pick based on what your tool
supports, not on which model you like — **MCP is a feature of the client, not of the
model.** Cursor with DeepSeek can use MCP; DeepSeek's website cannot.

| | When to use it |
| --- | --- |
| [**MCP server**](#mcp-server) | Your tool supports MCP. The assistant queries the checklist itself, only pulling the items relevant to what it is doing. |
| [**Paste a prompt**](#paste-a-prompt) | Everything else — a chat window, a model without an MCP client, a quick one-off. |

---

## MCP server

One command, no API key, no account. The server is read-only and has no filesystem or
network access beyond its own bundled data.

```bash
npx -y --package=prodcheck prodcheck-mcp
```

It exposes four tools: `list_checklists`, `checklist_for_stack`, `release_gate` and
`search_checklist`.

> Config file locations change between versions. If a snippet below does not match what
> your tool expects, the command and args are always the same three values —
> `npx`, `-y --package=prodcheck`, `prodcheck-mcp` — so any MCP client can be pointed at
> it.

### Claude Code

```bash
claude mcp add prodcheck -- npx -y --package=prodcheck prodcheck-mcp
```

### Claude Desktop

`claude_desktop_config.json`:

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

### Cursor

`.cursor/mcp.json` in the project, or the global equivalent:

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

Cursor can run Claude, GPT, Gemini or a custom OpenAI-compatible endpoint — including
DeepSeek, Qwen, Kimi or GLM — and the MCP server works the same with all of them.

### VS Code — GitHub Copilot agent mode

`.vscode/mcp.json`:

```json
{
  "servers": {
    "prodcheck": {
      "command": "npx",
      "args": ["-y", "--package=prodcheck", "prodcheck-mcp"]
    }
  }
}
```

### Gemini CLI

`~/.gemini/settings.json`:

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

### OpenAI Codex CLI

`~/.codex/config.toml`:

```toml
[mcp_servers.prodcheck]
command = "npx"
args = ["-y", "--package=prodcheck", "prodcheck-mcp"]
```

### Qwen Code

Alibaba's CLI takes the same shape as Gemini CLI, in `~/.qwen/settings.json`:

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

### OpenCode

`opencode.jsonc`, in the project root or `~/.config/opencode/`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "prodcheck": {
      "type": "local",
      "command": ["npx", "-y", "--package=prodcheck", "prodcheck-mcp"],
      "enabled": true
    }
  }
}
```

`type: "local"` is the stdio transport. The name you give it here is how you refer to the
server when prompting.

### Cline, Roo Code, Continue, Windsurf, Zed

All take a `mcpServers` object with the same `command` and `args` as the Claude Desktop
snippet above, in their own settings file. These are the most direct route to using
**DeepSeek, Qwen, Kimi (Moonshot) or GLM (Zhipu)** with MCP — configure the model as an
OpenAI-compatible endpoint, and the checklist works unchanged.

### Cherry Studio

A desktop client widely used with Chinese model providers. Add the server under
Settings → MCP with `npx` as the command and
`-y --package=prodcheck prodcheck-mcp` as the arguments, then pick DeepSeek, Qwen, GLM,
Kimi or any other configured provider.

### Anything else

If your client speaks MCP over stdio, this works:

```
command: npx
args:    -y  --package=prodcheck  prodcheck-mcp
```

---

## Paste a prompt

For a chat window with no MCP support — ChatGPT, Gemini, DeepSeek, Kimi, Qwen, GLM,
Copilot Chat, or any other — generate the checklist and paste it in.

**1. Generate the file:**

```bash
npx prodcheck security --stack django -o SECURITY.md
```

Swap the domain (`security`, `performance`, `scale`, `integrations`, `post-launch`) and
the stack for yours. Run `npx prodcheck list` to see what exists.

**2. Paste this, then the file:**

See [prompts.md](prompts.md) for ready-to-paste prompts — a review prompt, a
triage prompt, and one for having the assistant work through the checklist with you.

### If the file is too large

Narrow it before pasting:

```bash
npx prodcheck --gate                          # only the release blockers
npx prodcheck security --area ai              # one area
npx prodcheck --search "rate limit"           # one topic
npx prodcheck performance -n 100              # first 100 items
```

`npx prodcheck --gate` is usually the right first paste: 316 items across four domains,
all of them things that should stop a release. Add `--stack` for the products you use —
a leaked `service_role` key or an unaudited RLS policy blocks a launch too, and those
items only appear when you name the product.

---

## Which is better

MCP, clearly, when you have it. The assistant pulls the twenty items relevant to the file
it is looking at instead of carrying four thousand in its context, and it can ask again as
the work moves. Pasting a file works, but the assistant sees the checklist once and then
has to remember it.

Both have the same limitation, and it is worth stating plainly: **an assistant marking
items as done is producing an opinion, not evidence.** The repository's own
[`security/ai-generated-code/`](../checklists/security/ai-generated-code/) checklists
exist because AI review of AI-written code tends to confirm it is fine. Ask for
`file:line` citations and check them.
