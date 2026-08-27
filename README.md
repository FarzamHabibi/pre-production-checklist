# Pre-Production Checklist

Checklists to run **before** you ship to production.

Built for solo founders and small teams who own the whole stack — the code, the
infrastructure, the deploy pipeline, and increasingly the AI agents too — and who don't
have a security team to hand it to.

**2,922 security items across 47 checklists.** 94% of them apply to any stack.

### [→ Browse all checklists](checklists/README.md)

---

## Why this exists

I'm a founder at [Arioo](https://arioo.com). Before our launch I ran a deep security
audit of everything we'd built, and the audit turned up more than I expected — including
a few things that had been sitting in production-bound code for months, in areas I'd
have told you with confidence were fine.

What struck me afterwards wasn't the findings. It was that **the checklist was more
valuable than the audit.** The findings were specific to our code and are fixed. The
questions that surfaced them apply to anyone shipping a product.

Two things made it worth publishing rather than keeping:

**Solo founders have no security team.** You write the code, configure the infrastructure,
set up the pipeline, and then you're also the one who has to decide whether it's safe to
launch. There's no one to hand it to, and no obvious place to find out what you should
have asked. Most public checklists are either too shallow to catch anything real or
written for enterprises with a security function.

**AI-assisted development changed the shape of the problem.** A large part of this
checklist — the `ai/` and `vibe-coding/` folders, over 1,300 items — didn't need to exist
a few years ago. When you ship an agent with tools, or when a model writes code you review
faster than you'd review a colleague's, you inherit failure modes that standard security
checklists don't cover. Those two folders are the part I couldn't find anywhere else, and
the reason I bothered.

It's published under CC BY 4.0 so you can copy it into your own repo and make it yours.
If it catches something before it reaches your users, it did its job.

---

## Start here

You are not meant to read this top to bottom. In order of signal-per-minute:

| | | |
| --- | --- | --- |
| **1** | [Findings that should block release](checklists/core/17-release-gates.md) | If any are true, stop and fix them first |
| **2** | [The "must not exist" search](checklists/core/17-release-gates.md#high-risk-must-not-exist-search) | A grep list. Fastest real signal in the repo |
| **3** | [Authentication & authorization](checklists/core/02-authorization.md) | Where almost every exploitable bug actually lives |
| **4** | [Prompt injection](checklists/ai/02-prompt-injection.md) | Only if you ship an LLM feature — but then, urgently |

Then work section by section. Switching between edge config and database policies
costs more than it saves.

---

## Structure

```
checklists/
├── core/          1,435 items — any language, any framework
├── ai/              773 items — LLM features, agents, tools, RAG, MCP
├── vibe-coding/     548 items — bugs AI coding assistants actually write
└── stacks/          166 items — the small remainder that names a product
```

### `core/` — applies to you regardless of language

Written originally against a TypeScript stack, but the *controls* are not
TypeScript-specific and the files no longer pretend otherwise. "Verify CORS does not use
wildcard origins with credentials" is as true in Django as in Express. Everything that
genuinely named a product was moved out to `stacks/`.

If you write Python, Go, Ruby, PHP, Java, Rust or Elixir: **this folder is your
checklist, all 1,435 items of it.**

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Architecture & threat model](checklists/core/01-threat-model.md) | 25 | | [Mobile apps](checklists/core/11-mobile-apps.md) | 106 |
| [Authentication & authorization](checklists/core/02-authorization.md) | 111 | | [Desktop apps](checklists/core/12-desktop-apps.md) | 41 |
| [Sessions, tokens & cookies](checklists/core/03-sessions-tokens.md) | 21 | | [Runtime & containers](checklists/core/13-runtime-and-containers.md) | 93 |
| [Backend application & API](checklists/core/04-backend-api.md) | 223 | | [DNS, CDN, edge & WAF](checklists/core/14-edge-dns-waf.md) | 78 |
| [Web frontend](checklists/core/05-web-frontend.md) | 127 | | [CI/CD & supply chain](checklists/core/15-ci-cd-and-supply-chain.md) | 158 |
| [Database & row-level security](checklists/core/06-database.md) | 68 | | [Monitoring & incident response](checklists/core/16-monitoring-and-response.md) | 30 |
| [Object storage & files](checklists/core/07-storage-and-files.md) | 55 | | [Pre-release gates](checklists/core/17-release-gates.md) | 146 |
| [Secrets & cryptography](checklists/core/08-secrets-and-crypto.md) | 47 | | | |
| [Common web attacks](checklists/core/09-common-web-attacks.md) | 62 | | | |
| [Business logic & race conditions](checklists/core/10-business-logic.md) | 44 | | | |

### `ai/` — the part you won't find in a standard checklist

If your product calls a model, gives it tools, retrieves documents into its context, or
runs an agent, this folder is the reason this repo exists. It is stack-agnostic and
provider-agnostic.

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Architecture & identity](checklists/ai/01-architecture-and-identity.md) | 70 | | [Multi-agent & MCP](checklists/ai/07-multi-agent-and-mcp.md) | 75 |
| [Prompt injection & goal hijacking](checklists/ai/02-prompt-injection.md) | 91 | | [Integrations](checklists/ai/08-integrations.md) | 74 |
| [Tool calling & excessive agency](checklists/ai/03-tools-and-agency.md) | 66 | | [Cost, reliability & audit](checklists/ai/09-cost-reliability-audit.md) | 63 |
| [Data access & privacy](checklists/ai/04-data-access-and-privacy.md) | 82 | | [Testing & red-team pack](checklists/ai/10-testing-and-red-team.md) | 96 |
| [Output handling](checklists/ai/05-output-handling.md) | 58 | | [Release gate](checklists/ai/11-release-gate.md) | 47 |
| [RAG & agent memory](checklists/ai/06-rag-and-memory.md) | 51 | | | |

> Prompt injection is not a filtering problem. It is an authorization problem wearing a
> text costume — untrusted text reaching a privileged execution path.

### `vibe-coding/` — bugs AI assistants actually write

548 items organized by **class of bug**, not by which assistant produced it. Written from
real review findings on AI-generated code. [Browse →](checklists/README.md#vibe-coding--bugs-ai-assistants-write)

### `stacks/` — only if you use them

166 items. Skip any file for a product you don't use; the core checklists stand on their
own without them.

[Supabase](checklists/stacks/supabase.md) ·
[Next.js / React](checklists/stacks/nextjs-react.md) ·
[NestJS](checklists/stacks/nestjs.md) ·
[Google Cloud](checklists/stacks/google-cloud.md) ·
[Cloudflare](checklists/stacks/cloudflare.md) ·
[GitHub](checklists/stacks/github-actions.md) ·
[Docker](checklists/stacks/docker.md) ·
[PostgreSQL](checklists/stacks/postgres.md) ·
[iOS / Swift](checklists/stacks/ios-swift.md) ·
[macOS](checklists/stacks/macos.md)

**Your stack missing?** That's the most useful contribution you can make — copy
[`_TEMPLATE.md`](checklists/stacks/_TEMPLATE.md) and open a PR. Django, Rails, Laravel,
FastAPI, Go, Spring, AWS, Vercel, Fly.io, Kubernetes, Android, Firebase, Stripe are all
open. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## How to use it

1. **Copy the files you need** into your own repo. They're working documents, meant to be
   edited and committed next to your code.
2. **Mark `[N/A]` aggressively.** No product on earth needs all 2,922 items. No mobile
   app? `core/11` and `core/12` are 147 instant `[N/A]`s. Being honest about scope is what
   makes the remainder trustworthy.
3. **Record every finding.** An unrecorded finding is one you'll rediscover in six months.

```
* [ ]     Not checked
* [x]     Verified secure
* [!]     Security issue found
* [N/A]   Not applicable
```

For each `[!]`: affected component · exact endpoint/file/config · attack precondition ·
proof of exploitability · business impact · severity · remediation · regression test ·
owner · date verified

### The one rule worth internalizing

> Do not accept *"the frontend hides it"*, *"the route is hard to guess"*, *"the user
> needs a valid JWT"*, or *"the WAF blocks it"* as authorization controls by themselves.

Enforce every control at the lowest trustworthy layer available:

```
Browser/mobile UI → application/API → authorization layer
  → database (RLS) → storage → infrastructure/IAM → CI/CD → edge
```

### Want it as one file?

[`ALL.md`](ALL.md) is every checklist concatenated — convenient for printing, or for
pasting into an AI tool. It's generated; edit the files under `checklists/` instead.

---

## Command line

Generate a checklist scoped to your project, instead of reading 2,922 items:

```bash
npx prodcheck --stack django --group core -o SECURITY.md
```

```bash
npx prodcheck stacks                              # what supplements exist
npx prodcheck --stack supabase,cloudflare --gate  # release blockers only
npx prodcheck --group ai -o AI-SECURITY.md        # the LLM/agent surface
npx prodcheck --search cors --format text
npx prodcheck --stack rails --format json         # feed it to something else
```

`--stack X` returns every stack-agnostic item plus the supplements for X. **An
unrecognized stack isn't an error** — you get the stack-agnostic core, which stands on
its own. That's the whole design: it works for a stack nobody has written a file for yet.

Zero dependencies, Node 18+.

## MCP server

Let your coding agent query the checklist directly while it works, instead of you pasting
it in. Read-only, no filesystem or network access beyond its own bundled data.

**Claude Code**

```bash
claude mcp add prodcheck -- npx -y prodcheck-mcp
```

**Anything else** — add to your MCP client config:

```json
{
  "mcpServers": {
    "prodcheck": { "command": "npx", "args": ["-y", "prodcheck-mcp"] }
  }
}
```

Four tools: `list_checklists`, `checklist_for_stack`, `release_gate`, `search_checklist`.
Then ask your agent things like *"check this repo against the release gate for a
Next.js + Supabase app"* and it pulls the relevant items itself.

## Machine-readable data

Both of the above read [`data/checklist.json`](data/checklist.json), validated against
[`data/schema.json`](data/schema.json). Use it directly if you're building something else
— it's CC BY 4.0.

The Markdown under `checklists/` is the source of truth; the JSON is generated from it by
`./scripts/build.sh`. There is deliberately no `severity` field —
[here's why](data/README.md#there-is-no-severity-field).

---

## Roadmap

- [x] Security checklists, split by domain and portable across stacks
- [x] Machine-readable data layer + schema
- [x] `npx prodcheck` — generate a filtered checklist for your stack
- [x] MCP server — so your coding agent can query the checklist directly
- [ ] Web version
- [ ] More categories: launch, social, legal, performance

---

## Contributing

Stack files, corrections, missing items, and war stories are all welcome.
See [CONTRIBUTING.md](CONTRIBUTING.md).

The single most useful contribution is a stack file for a stack that isn't covered —
Django, Rails, Laravel, FastAPI, Go, Spring, AWS, Vercel, Fly.io, Kubernetes, Android,
Firebase, Stripe are all open. Copy
[`_TEMPLATE.md`](checklists/stacks/_TEMPLATE.md) and open a PR.

---

## Disclaimer

A starting point, not a guarantee, not a compliance certification, and not a substitute
for a professional security audit. Completing every item does not make an application
secure. Use it to find problems, not to declare their absence.

## License

Dual-licensed, because the two halves of this repository are different kinds of thing:

| | License | |
| --- | --- | --- |
| **Content** — `checklists/`, `data/`, `ALL.md` | [CC BY 4.0](LICENSE) | Copy it, adapt it, ship it commercially. Keep the attribution. |
| **Code** — `cli/`, `scripts/`, the `prodcheck` package | [MIT](LICENSE-CODE) | Creative Commons licenses aren't designed for software, and a CC-licensed npm package gets rejected by corporate legal review. MIT removes that friction. |

## Built with AI, and honest about it

This repository was compiled and expanded with [Claude](https://claude.com/claude-code)
(Anthropic) and [ChatGPT](https://chatgpt.com) (OpenAI), working from a real audit rather
than generating checklist items from scratch. They did the parts that don't fit in one
person's head: cross-referencing hundreds of findings against OWASP categories, keeping
2,922 items consistent in wording and structure, and spotting the gaps between sections.

That's worth stating plainly for two reasons.

**It's the honest provenance.** A security checklist asks you to trust it. You should know
how it was made.

**The `vibe-coding/` folder applies to this repository too.** It says AI-generated work
needs review that assumes the AI was confidently wrong somewhere, and that "the tests
pass" is not a security argument. Both were true here — the test suite for the CLI caught
two real bugs in AI-written code, including an MCP server that silently truncated every
response over 8 KB. The checklist is not exempt from its own advice, and neither are the
tools shipped alongside it.

If you find an item that's wrong, plausible-sounding but false, or subtly misleading,
that's exactly the failure mode `vibe-coding/07-review-blind-spots.md` warns about.
[Open an issue](https://github.com/FarzamHabibi/pre-production-checklist/issues) — that
correction is worth more than three new items.

## Credits

Extracted from the pre-launch security audit of [Arioo](https://arioo.com) and published
by its founding team.

Contributions from everyone who opens an issue or a PR are what will keep it accurate —
see the [contributors](https://github.com/FarzamHabibi/pre-production-checklist/graphs/contributors).
