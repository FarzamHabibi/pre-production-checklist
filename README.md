# Pre-Production Checklist

Checklists to run **before** you ship to production.

Built for solo founders and small teams who own the whole stack — the code, the
infrastructure, the deploy pipeline, and increasingly the AI agents too — and who don't
have a security team to hand it to.

**2,922 security items across 47 checklists.** 94% of them apply to any stack.

### [→ Browse all checklists](checklists/README.md)

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

## Roadmap

- [x] Security checklists, split by domain and portable across stacks
- [ ] Machine-readable source (structured data → generated Markdown)
- [ ] `npx` CLI — generate a filtered checklist for your stack
- [ ] MCP server — so your coding agent can query the checklist directly
- [ ] Web version
- [ ] More categories: launch, social, legal, performance

---

## Contributing

Stack files, corrections, missing items, and war stories are all welcome.
See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Disclaimer

A starting point, not a guarantee, not a compliance certification, and not a substitute
for a professional security audit. Completing every item does not make an application
secure. Use it to find problems, not to declare their absence.

## License

[CC BY 4.0](LICENSE) — use it, fork it, adapt it, ship it commercially. Keep the
attribution.

## Credits

By [Farzam Habibi](https://github.com/FarzamHabibi), extracted from the pre-launch
security audit of Arioo. Compiled and expanded with
[Claude Code](https://claude.com/claude-code) (Anthropic).
