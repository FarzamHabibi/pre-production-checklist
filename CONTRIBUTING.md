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

## Where does an item belong?

This is the only rule that really matters:

> **If you can rewrite the item without naming a specific product and it still makes
> sense, it belongs in `core/`.**

`stacks/` is for the genuine remainder — currently 166 items out of 2,922 (5.7%).
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
