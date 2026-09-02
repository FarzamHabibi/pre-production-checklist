# Contributing

The most valuable contributions, roughly in order:

### 1. A stack file for a stack that isn't covered

The core checklists are deliberately product-neutral, so they already work for Django,
Rails, Laravel, Go, Phoenix, Spring, AWS, Vercel, Fly.io, Android, and everything else.
What's missing is the thin layer on top.

Copy [`checklists/stacks/_TEMPLATE.md`](checklists/stacks/_TEMPLATE.md) and open a PR.
Wanted: `django.md`, `rails.md`, `laravel.md`, `fastapi.md`, `go.md`, `spring.md`,
`aws.md`, `vercel.md`, `fly-io.md`, `kubernetes.md`, `android.md`, `firebase.md`,
`stripe.md`, `auth0.md`, `clerk.md`.

### 2. Items that are wrong or outdated

Frameworks move. Some of these items will rot. An issue saying *"§X item Y stopped being
true in version Z"* is worth more than three new items.

### 3. Items that are missing

Include *why* it matters and, ideally, what a real failure looked like.

### 4. War stories

If an item here would have caught a bug you actually shipped, say so in an issue. That is
the strongest possible argument for keeping an item, and it helps everyone prioritize.

---

## Licensing and scope

By opening a pull request or an issue that proposes checklist content, you agree that
your contribution is licensed under this repository's terms — [CC BY 4.0](LICENSE) for
content, [MIT](LICENSE-CODE) for code — and that it may be edited, rewritten or removed.
Contributing does not create any ownership stake in the project or any obligation on the
maintainer.

**This is a checklist, not a directory.** Items describe a *check* — something to verify
about your own system. They do not name a product as the way to satisfy it, and requests
to add a tool, service or vendor are declined as a matter of policy rather than judgement
about the tool. 88% of items name no product at all, and that is what makes the list
usable by someone who runs a different stack.

The exception is `checklists/stacks/`, where an item may name a product because the file
exists to cover that product's specific behaviour — and even there, the item is a check,
not a recommendation.

## Where does an item belong?

This is the only rule that really matters:

> **If you can rewrite the item without naming a specific product and it still makes
> sense, it belongs in the domain checklists, not in `stacks/`.**

`stacks/` is for the genuine remainder — currently 374 items out of 3,186 (11.7%).
Please keep it that small. A checklist that reads as "written for someone else's stack"
is a checklist nobody finishes.

## Style

* One verifiable action per line, imperative mood.
* Start with `Verify`, `Confirm`, `Identify`, `Test`, `Review`, `Inventory`, or `Search`.
* No vendor pitches, no affiliate links, no tool recommendations unless the item is
  meaningless without one.
* Keep items short enough to scan. If an item needs a paragraph, it's probably two items.
* Every item must be checkable. "Be careful with input" is not an item.

## Item counts

The per-file and per-folder counts in `README.md` and `checklists/README.md` are
generated. If you add or remove items, run:

```bash
./scripts/build.sh
```

and commit the result along with your change.

## Regenerating derived files

`checklists/**/*.md` is the source of truth. These are generated from it:

| File | What it is |
| --- | --- |
| `data/checklist.json` | machine-readable layer, consumed by tooling |
| `checklists/README.md` | index with per-file item counts |
| `ALL.md` | single-file concatenation |

After any change to a checklist, run `./scripts/build.sh` and commit the result with your
change. It needs only Python 3 — no dependencies.

If you add a new stack file, also add its slug to `STACK_LABEL` in
`scripts/build_data.py` so items route to a readable label instead of falling back to
`any`.

## Tests

The CLI and MCP server have a dependency-free test suite:

```bash
node cli/test.js
```

It checks the data layer's invariants (unique ids, counts that match the items, an unknown
stack returning exactly the stack-agnostic core), the CLI's argument handling, and the MCP
server's protocol behaviour — handshake, notifications, in-band tool errors, and recovery
from malformed input. CI runs it on every push and pull request, and also fails if the
generated files are stale or an internal link is broken.

## Before you push

```bash
./scripts/verify.sh
```

One command, and the gate for every change to this repository. It checks that the
generated files are current, the tests pass, no internal link is broken, every count in
the README, `package.json` and the GitHub sidebar agrees with the data, no checklist ships
a ticked box, and nothing private is in the diff.

CI runs the same script, so a green local run means a green CI run. The difference is that
this one tells you before the push, which matters when the fix is a one-line count.
