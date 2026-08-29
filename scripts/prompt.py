#!/usr/bin/env python3
"""The prompt a first-time reader pastes into their assistant.

Two people who tried the site could not work out where to begin: it offered seven ways
in and no path. This is the path — one thing to copy, which then works out the rest with
them, including the case where the assistant cannot run commands at all.

Three places show it: the site, the README, and docs/prompts.md. Hand-maintaining three
copies is how the counts in this repository came to disagree once already, so this module
is the source and the other two are generated from it.
"""

MCP_ADD = "claude mcp add prodcheck -- npx -y --package=prodcheck prodcheck-mcp"
RAW_DATA = "https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json"
SITE = "https://prodcheck.pages.dev"

# Written for an assistant that has never heard of prodcheck — it was published after most
# models' training data ends, so the first instruction has to be "do not answer from
# memory", and every URL and command it needs has to be in the text itself.
TEMPLATE = """I want to get my project ready to ship. Use prodcheck: a free, open-source
pre-production checklist of {total} items covering security, performance, scale,
integrations and what to do after launch.

It is new, so do not answer it from memory. Everything you need:

- Site: {site}
- Install it into a repo: npx prodcheck init
- Raw checklist data: {raw}
- As an MCP server: {mcp}

Do this in order.

1. Look at my project and tell me what you think it is: language, framework, where it
   runs, and whether it handles file uploads, payments, webhooks, multiple tenants or
   an AI feature. Say how confident you are. Ask me about anything you cannot tell.

2. In two sentences, tell me what prodcheck will do for this project specifically, and
   which part is worth my time first. Do not describe the whole thing.

3. Set it up, using whichever of these you can actually do — say which one you are:
   - You can run commands here: run `npx prodcheck init`, then
     `npx prodcheck --gate -o BLOCKERS.md` for the release blockers alone.
   - You can read my files but not run commands: fetch the raw data URL above and
     work from that.
   - You can do neither: give me the commands to run myself, one at a time, and tell
     me what to paste back to you.

4. Start on the release blockers. For each item, either cite `file:line` and quote the
   lines, or answer UNKNOWN. UNKNOWN is a normal answer — it means a human has to go
   and look. Never mark anything verified on my behalf; that is my call, not yours.

Work through it with me a section at a time. Do not dump the whole checklist at me."""


def start_prompt(total, site=SITE):
    """Render the prompt. `total` is the item count from data/checklist.json."""
    return TEMPLATE.format(total=f"{total:,}", site=site, mcp=MCP_ADD, raw=RAW_DATA)
