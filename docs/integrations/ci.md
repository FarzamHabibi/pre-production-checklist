# CI

[← all integrations](../../README.md#use-it-with-an-ai-assistant) · [MCP clients](../mcp-clients.md) · [prompts](../prompts.md)

No model involved. Two things worth automating.

## Keep the checklist file current

If you committed a generated checklist, regenerate it when the upstream one changes, so a
new item does not go unnoticed for a year.

```yaml
name: refresh-checklist
on:
  schedule: [{ cron: "0 6 * * 1" }]     # Mondays
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          npx -y prodcheck security --stack django -o SECURITY.new.md
          if ! diff -q SECURITY.md SECURITY.new.md >/dev/null 2>&1; then
            mv SECURITY.new.md SECURITY.md
          else
            rm SECURITY.new.md
          fi
      - uses: peter-evans/create-pull-request@v6
        with:
          title: "Checklist updated upstream"
          branch: refresh-checklist
```

A pull request rather than a direct commit: the point is that a human reads the new items.

## Fail a build on an unresolved blocker

If you tick items in the committed file, this turns the checklist into a gate.

```yaml
- name: No unresolved release blockers
  run: |
    npx -y prodcheck --gate --format text > /tmp/gate.txt
    # every blocker must appear in your file as [x], [!] or [N/A] — never as [ ]
    if grep -q '^\* \[ \]' SECURITY.md; then
      echo "::error::SECURITY.md still has unchecked items"
      grep -n '^\* \[ \]' SECURITY.md | head -20
      exit 1
    fi
```

Start with this **not** failing the build — report only — until the file is honestly
filled in. A gate that fails from day one gets disabled in week one.

## Pin the version

```bash
npx -y prodcheck@1.16.0 --gate
```

Unpinned means your build output changes when this repository releases. That is fine for a
scheduled refresh and wrong for a gate.
