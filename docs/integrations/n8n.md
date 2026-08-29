# n8n

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

Two ways, depending on whether you want the checklist as **data** in a workflow or as a
**tool** an agent can call.

## 1. As data — HTTP Request node

The simplest and most reliable. No install, works on n8n Cloud and self-hosted alike.

1. Add an **HTTP Request** node.
2. Method `GET`, URL:

```
https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json
```

3. Add a **Code** node after it to filter to what the workflow needs:

```js
const items = $input.first().json.items;

// only the release blockers for a Django project
return items
  .filter(i => i.release_gate && (i.stack === 'any' || i.stack_id === 'django'))
  .map(i => ({ json: { id: i.id, text: i.text, checklist: i.checklist } }));
```

4. Feed the result into an **AI Agent** or **Basic LLM Chain** node as context.

Cache it. Use n8n's static data or a scheduled workflow that refreshes daily — the data
changes on release, not per execution.

## 2. As a tool — MCP Client Tool node

If your n8n version has the **MCP Client Tool** node, an AI Agent can query the checklist
itself instead of receiving all of it.

* **Transport:** command / stdio
* **Command:** `npx`
* **Arguments:** `-y --package=prodcheck prodcheck-mcp`

This requires n8n to be **self-hosted with Node available in the container** — stdio MCP
runs a local process, so it does not work on n8n Cloud. On Cloud, use method 1.

Tools the agent gets: `list_checklists`, `checklist_for_stack`, `release_gate`,
`search_checklist`.

## A workflow worth building

**On every pull request, comment the relevant blockers.**

1. **Webhook** — GitHub pull request event.
2. **HTTP Request** — fetch the changed files from the GitHub API.
3. **Code** — map file paths to domains: anything under a migrations folder implies
   `scale`, a Dockerfile implies `security`, a component implies `performance`.
4. **HTTP Request** — fetch the checklist JSON.
5. **Code** — select `release_gate` items for those domains.
6. **AI Agent** — with the [PR review prompt](../prompts.md#5-review-a-single-pull-request)
   and the diff.
7. **HTTP Request** — post the result as a PR comment.

Keep step 6's rule intact: every finding cites `file:line`, and the agent never marks
anything verified. A bot that comments "looks good" on every PR gets muted within a week.
