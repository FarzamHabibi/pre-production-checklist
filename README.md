# Pre-Production Checklist

Checklists to run **before** you ship to production.

Built for solo founders and small teams who own the whole stack — the code, the
infrastructure, the deploy pipeline, and increasingly the AI agents too — and who don't
have a security team to hand it to.

<!-- counts:begin -->
**4,337 items across 96 checklists** in 5 domains. 88% of them apply to any stack.
<!-- counts:end -->

[![npm](https://img.shields.io/npm/v/prodcheck?color=cb3837&logo=npm)](https://www.npmjs.com/package/prodcheck)
[![ci](https://github.com/FarzamHabibi/pre-production-checklist/actions/workflows/ci.yml/badge.svg)](https://github.com/FarzamHabibi/pre-production-checklist/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/content-CC%20BY%204.0-blue)](LICENSE)

### [→ prodcheck.pages.dev](https://prodcheck.pages.dev/) · [or in the repo](checklists/README.md)

<sub>Built and maintained by the team at **[Arioo](https://arioo.com)** — where we ship
the kind of product this checklist was written for.</sub>

---

## Why this exists

I'm a founder at [Arioo](https://arioo.com). Getting ready to launch, I needed a
pre-production security review that covered the whole surface we actually ship: a
TypeScript backend, a web app, native clients, a deploy pipeline, and a set of AI agents
with real tools attached. Nothing I could find covered more than a fraction of that, so I
built the checklist myself.

**This repository is the checklist, not a report.** It is the set of questions,
generalized away from our stack and rewritten as a working document anyone can run
against their own product.

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
| **1** | [Findings that should block release](checklists/security/core/17-release-gates.md) | If any are true, stop and fix them first |
| **2** | [The "must not exist" search](checklists/security/core/17-release-gates.md#high-risk-must-not-exist-search) | A grep list. Fastest real signal in the repo |
| **3** | [Authentication & authorization](checklists/security/core/02-authorization.md) | Where almost every exploitable bug actually lives |
| **4** | [Prompt injection](checklists/security/ai/02-prompt-injection.md) | Only if you ship an LLM feature — but then, urgently |
| **5** | [Your service as a weapon](checklists/security/core/18-abuse-and-availability.md#your-service-as-a-weapon) | The one nobody looks for until the suspension email arrives |
| **6** | [Core Web Vitals](checklists/performance/02-core-web-vitals.md) | If users say it's slow, start here rather than with a score |
| **7** | [Before you launch](checklists/integrations/01-search-engines.md#before-you-launch--the-ones-that-actually-bite) | Six items. One of them is `noindex` still being on |
| **8** | [Can you act at all](checklists/post-launch/01-readiness.md) | Whether you could respond today, if you had to |

Then work section by section. Switching between edge config and database policies
costs more than it saves.

---

## Structure

```
checklists/
├── security/              2,812   not getting breached, abused or taken down
│   ├── core/              1,491   application, data, infrastructure, delivery
│   ├── ai/                  773   LLM features, agents, tools, RAG, MCP
│   └── ai-generated-code/   548   the bugs AI coding assistants actually write
├── performance/             313   Lighthouse, and what users actually feel
├── scale/                   286   surviving 10× the load
├── integrations/            192   search, analytics, monitoring
├── post-launch/             192   when it goes wrong anyway
└── stacks/                  542   26 products, spanning every domain
```

Counts above are what each folder holds. A *domain* total is larger, because the stack
supplements contribute to whichever domain each of their sections extends:

```
security 3,306   performance 338   scale 301   integrations 200   post-launch 192   post-launch 192
```

Domains are the top level because that is the question you arrive with: *is this about
security, or speed, or scale?*

### `security/core/` — applies to you regardless of language

Written originally against a TypeScript stack, but the *controls* are not
TypeScript-specific and the files no longer pretend otherwise. "Verify CORS does not use
wildcard origins with credentials" is as true in Django as in Express. Everything that
genuinely named a product was moved out to `stacks/`.

If you write Python, Go, Ruby, PHP, Java, Rust or Elixir: **this folder is your
checklist, all 1,491 items of it.**

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Architecture & threat model](checklists/security/core/01-threat-model.md) | 25 | | [Mobile apps](checklists/security/core/11-mobile-apps.md) | 106 |
| [Authentication & authorization](checklists/security/core/02-authorization.md) | 111 | | [Desktop apps](checklists/security/core/12-desktop-apps.md) | 41 |
| [Sessions, tokens & cookies](checklists/security/core/03-sessions-tokens.md) | 21 | | [Runtime & containers](checklists/security/core/13-runtime-and-containers.md) | 93 |
| [Backend application & API](checklists/security/core/04-backend-api.md) | 223 | | [DNS, CDN, edge & WAF](checklists/security/core/14-edge-dns-waf.md) | 78 |
| [Web frontend](checklists/security/core/05-web-frontend.md) | 127 | | [CI/CD & supply chain](checklists/security/core/15-ci-cd-and-supply-chain.md) | 158 |
| [Database & row-level security](checklists/security/core/06-database.md) | 68 | | [Monitoring & incident response](checklists/security/core/16-monitoring-and-response.md) | 30 |
| [Object storage & files](checklists/security/core/07-storage-and-files.md) | 55 | | [Pre-release gates](checklists/security/core/17-release-gates.md) | 149 |
| [Secrets & cryptography](checklists/security/core/08-secrets-and-crypto.md) | 47 | | | |
| [Common web attacks](checklists/security/core/09-common-web-attacks.md) | 62 | | | |
| [Business logic & race conditions](checklists/security/core/10-business-logic.md) | 44 | | [**Abuse & availability**](checklists/security/core/18-abuse-and-availability.md) | **53** |

### `security/ai/` — the part you won't find in a standard checklist

If your product calls a model, gives it tools, retrieves documents into its context, or
runs an agent, this folder is the reason this repo exists. It is stack-agnostic and
provider-agnostic.

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Architecture & identity](checklists/security/ai/01-architecture-and-identity.md) | 70 | | [Multi-agent & MCP](checklists/security/ai/07-multi-agent-and-mcp.md) | 75 |
| [Prompt injection & goal hijacking](checklists/security/ai/02-prompt-injection.md) | 91 | | [Integrations](checklists/security/ai/08-integrations.md) | 74 |
| [Tool calling & excessive agency](checklists/security/ai/03-tools-and-agency.md) | 66 | | [Cost, reliability & audit](checklists/security/ai/09-cost-reliability-audit.md) | 63 |
| [Data access & privacy](checklists/security/ai/04-data-access-and-privacy.md) | 82 | | [Testing & red-team pack](checklists/security/ai/10-testing-and-red-team.md) | 96 |
| [Output handling](checklists/security/ai/05-output-handling.md) | 58 | | [Release gate](checklists/security/ai/11-release-gate.md) | 47 |
| [RAG & agent memory](checklists/security/ai/06-rag-and-memory.md) | 51 | | | |

> Prompt injection is not a filtering problem. It is an authorization problem wearing a
> text costume — untrusted text reaching a privileged execution path.

### `security/ai-generated-code/` — bugs AI assistants write

Also known as *vibe coding*. 548 items organized by **class of bug**, not by which
assistant produced it. Written from real review findings on AI-generated code.
[Browse →](checklists/README.md#security)

### `performance/` — Lighthouse, and what users actually feel

Aimed at the highest achievable score across all four Lighthouse categories, with one
constraint that decides what goes in: **an item has to be about something a real user
experiences.** Lighthouse is the scoreboard, not the goal — anything whose only
justification is "raises the score" was left out.

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Measurement](checklists/performance/01-measurement.md) | 29 | | [CSS & rendering](checklists/performance/06-css-and-rendering.md) | 28 |
| [Core Web Vitals](checklists/performance/02-core-web-vitals.md) | 41 | | [Backend & delivery](checklists/performance/07-backend-and-delivery.md) | 40 |
| [Loading & critical path](checklists/performance/03-loading-and-critical-path.md) | 37 | | [Accessibility](checklists/performance/08-accessibility.md) | 41 |
| [JavaScript](checklists/performance/04-javascript.md) | 43 | | [Release gate](checklists/performance/09-release-gate.md) | 21 |
| [Images & media](checklists/performance/05-images-and-media.md) | 33 | | | |

> Lighthouse is a lab tool: one run, one simulated device, one network. It is excellent
> for *finding* problems and unreliable for *proving* them fixed. Field data at the 75th
> percentile is the scoreboard that matters.

Accessibility sits here because it is scored alongside performance, and because the
overlap is real — a page that is fast for a screen reader is usually a page with less
unnecessary markup and JavaScript. The Lighthouse accessibility category is treated as a
floor, not a ceiling; it catches roughly a third of real issues.

### `integrations/` — being findable, measured and watched

Everything a project has to be *connected to* before launch. Configuration you do once
and then never think about, which is exactly why it deserves a checklist.

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Search engines](checklists/integrations/01-search-engines.md) | 38 | | [Answer engines & AI crawlers](checklists/integrations/04-answer-engines.md) | 25 |
| [SEO fundamentals](checklists/integrations/02-seo-fundamentals.md) | 42 | | [Analytics & consent](checklists/integrations/05-analytics-and-consent.md) | 28 |
| [Structured data & social previews](checklists/integrations/03-structured-data.md) | 27 | | [Monitoring & alerting](checklists/integrations/06-monitoring-and-alerting.md) | 32 |

> Verify `noindex` is removed from production. A staging robots meta tag that shipped is
> the most common launch mistake there is, and it can cost weeks before anyone notices.

The answer-engine file is written as decisions to make rather than settled practice —
whether `GPTBot`, `ClaudeBot`, `PerplexityBot` and the rest may read your site is a
choice, and not making it is also a choice.

### `scale/` — surviving ten times the load

Written to be read *before* the traffic arrives, not during the incident.

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Capacity model](checklists/scale/01-capacity-model.md) | 29 | | [Multiple instances & regions](checklists/scale/06-multi-instance-and-region.md) | 35 |
| [Statelessness](checklists/scale/02-statelessness.md) | 26 | | [Cost at scale](checklists/scale/07-cost-at-scale.md) | 19 |
| [Database at scale](checklists/scale/03-database.md) | 60 | | [Load testing & scale gates](checklists/scale/08-load-testing-and-gates.md) | 23 |
| [Caching](checklists/scale/04-caching.md) | 25 | | [**Service levels**](checklists/scale/09-service-levels.md) | **30** |
| [Async work & queues](checklists/scale/05-async-and-queues.md) | 39 | | | |

> "Will it scale?" is unanswerable. "Will it survive 500 requests per second with a 40:1
> read/write ratio and one tenant holding 30% of the rows?" has an answer, and the work to
> find it is mostly arithmetic.

Start with [the capacity model](checklists/scale/01-capacity-model.md); the rest of the
domain is much less useful until you know which resource runs out first. Then
[service levels](checklists/scale/09-service-levels.md), because without a stated target
"is it fast enough" is an argument rather than a measurement, and every scaling decision
after that is made on vibes. Cost is in here
rather than in a domain of its own because scaling problems and billing problems are the
same problem seen from two sides.

### `post-launch/` — when it goes wrong anyway

Every other domain is about building something that does not break. This one assumes it
broke.

**Everything here is used after launch and has to be prepared before it.** The question
each item asks is not *did you respond well* — it is **is the answer already decided?**

| | Items | | | Items |
| --- | ---: | --- | --- | ---: |
| [Can you act at all](checklists/post-launch/01-readiness.md) | 27 | | [Outages & dependency failure](checklists/post-launch/05-outage-and-dependencies.md) | 27 |
| [The first fifteen minutes](checklists/post-launch/02-first-15-minutes.md) | 20 | | [Rollback & kill switches](checklists/post-launch/06-rollback-and-kill-switches.md) | 20 |
| [You have been breached](checklists/post-launch/03-security-incident.md) | 35 | | [Telling people](checklists/post-launch/07-communication.md) | 18 |
| [Data loss & corruption](checklists/post-launch/04-data-loss.md) | 26 | | [Learning & drills](checklists/post-launch/08-learning-and-drills.md) | 19 |

The rest of the repository makes sure you *find out* — monitoring is covered in
[`security/core/16`](checklists/security/core/16-monitoring-and-response.md) and
[`integrations/06`](checklists/integrations/06-monitoring-and-alerting.md). Neither asks
what happens next. Whether an immediate action exists for being breached, for a corrupted
database, for the connection going away, is a different question, and it is the one that
gets answered badly at 3am if it was not answered in daylight.

> The plan for data loss is a backup you have **restored**, not a backup you have taken.

[Can you act at all](checklists/post-launch/01-readiness.md) counts as a release gate.
Launching without a prepared response is a decision, and it should be a recorded one.

### `stacks/` — only if you use them

374 items across 19 supplements. Skip any file for a product you don't use; the core
checklists stand on their own without them.

**Backend & web**
[Django](checklists/stacks/django.md) ·
[FastAPI](checklists/stacks/fastapi.md) ·
[Ruby on Rails](checklists/stacks/rails.md) ·
[Laravel](checklists/stacks/laravel.md) ·
[Spring Boot](checklists/stacks/spring.md) ·
[Go / Gin](checklists/stacks/go-gin.md) ·
[Express](checklists/stacks/express.md) ·
[NestJS](checklists/stacks/nestjs.md) ·
[Next.js / React](checklists/stacks/nextjs-react.md) ·
[GraphQL](checklists/stacks/graphql.md)

**Mobile**
[iOS / Swift](checklists/stacks/ios-swift.md) ·
[Android / Kotlin](checklists/stacks/android-kotlin.md) ·
[React Native](checklists/stacks/react-native.md) ·
[Flutter](checklists/stacks/flutter.md) ·
[macOS](checklists/stacks/macos.md)

**Data & platform**
[PostgreSQL](checklists/stacks/postgres.md) ·
[Supabase](checklists/stacks/supabase.md) ·
[Firebase](checklists/stacks/firebase.md) ·
[Docker](checklists/stacks/docker.md) ·
[Kubernetes](checklists/stacks/kubernetes.md) ·
[AWS](checklists/stacks/aws.md) ·
[Google Cloud](checklists/stacks/google-cloud.md) ·
[Vercel](checklists/stacks/vercel.md) ·
[Cloudflare](checklists/stacks/cloudflare.md) ·
[GitHub](checklists/stacks/github-actions.md) ·
[Stripe](checklists/stacks/stripe.md)

**Your stack missing?** That's the most useful contribution you can make. The format is
documented end to end in [`_TEMPLATE.md`](checklists/stacks/_TEMPLATE.md) — a worked
example, what every field drives, and the one rule that decides whether an item belongs
in a stack file at all. Open issues exist for AWS, Vercel, Fly.io, Kubernetes, Firebase,
Stripe, FastAPI and GraphQL; see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## How to use it

1. **Copy the files you need** into your own repo. They're working documents, meant to be
   edited and committed next to your code.
2. **Mark `[N/A]` aggressively.** No product on earth needs all 3,093 items. No mobile
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

## Use it with an AI assistant

MCP is a feature of the **client**, not the model — Cursor running DeepSeek can use it;
DeepSeek's website cannot. Config for Claude Code, Claude Desktop, Cursor, VS Code
Copilot, Gemini CLI, OpenAI Codex CLI, Qwen Code, Cline, Roo, Continue, Windsurf, Zed and
Cherry Studio is in **[docs/mcp-clients.md](docs/mcp-clients.md)**.

| | |
| --- | --- |
| **[n8n](docs/integrations/n8n.md)** · [Dify](docs/integrations/dify.md) · [Flowise](docs/integrations/flowise.md) | Automation and agent platforms |
| **[OpenRouter](docs/integrations/openrouter.md)** | Any model, through an MCP client |
| **[DeepSeek, Qwen, Kimi, GLM](docs/integrations/chinese-models.md)** | Base URLs and which clients accept them |
| **[Open WebUI, LibreChat](docs/integrations/self-hosted-chat.md)** | Self-hosted chat |
| **[The JSON API](docs/integrations/http-api.md)** | No install at all — one HTTP GET |
| **[CI](docs/integrations/ci.md)** | Keep the file current, gate on blockers |

```bash
claude mcp add prodcheck -- npx -y --package=prodcheck prodcheck-mcp
```

For a chat window with no MCP — ChatGPT, Gemini, DeepSeek, Kimi, Qwen, GLM — generate a
file and paste it after one of the **[ready-made prompts](docs/prompts.md)**. Each is
built on three rules, because without them an assistant will tell you the code is fine:
cite `file:line` for every claim, treat `unknown` as a real answer, and never mark
anything verified on the reader's behalf.

## Command line

Generate a checklist scoped to your project, instead of reading 3,093 items:

```bash
npx prodcheck security --stack django -o SECURITY.md
npx prodcheck performance -o PERFORMANCE.md
npx prodcheck integrations -o LAUNCH.md
npx prodcheck scale -o SCALE.md
npx prodcheck post-launch -o INCIDENT-RESPONSE.md
```

```bash
npx prodcheck list                                # domains, areas and counts
npx prodcheck stacks                              # what supplements exist
npx prodcheck security --area ai -o AI-SECURITY.md
npx prodcheck --gate --stack supabase,cloudflare  # release blockers, every domain
npx prodcheck --search cors --format text
npx prodcheck security --stack rails --format json
npx prodcheck performance --stack nextjs-react -o PERF.md
```

The domain is a positional argument — `prodcheck security`, and in time
`prodcheck performance` — because that is how you would say it. Omit it for everything.

`--stack X` returns every stack-agnostic item plus the supplements for X. **An
unrecognized stack isn't an error** — you get the stack-agnostic core, which stands on
its own. That's the whole design: it works for a stack nobody has written a file for yet.

Zero dependencies, Node 18+.

## Let your agent run the review

The MCP server gives an agent the items. This gives it the **procedure**:

```bash
npx prodcheck init
```

It writes a skill into `.claude/skills/`, `.cursor/rules/` or `AGENTS.md` — whichever the
project already uses — and then you can ask your agent:

> *review this repo against the prodcheck release gate*

What the skill enforces matters more than what it enables:

- **The model never marks anything verified.** Every item ends as a `FINDING` with a
  `file:line` citation, an `UNKNOWN`, or an `N/A` with a reason. There is no "pass" it can
  write; that stays yours.
- **A finding without a citation is not a finding.** It has to quote the lines, and re-read
  them before claiming what they say.
- **`UNKNOWN` stays visible.** Most items on a checklist this size depend on production
  configuration a repository cannot show. The list of things a human still has to check is
  usually the most useful part of the report.

> This repository contains a folder about the bugs AI assistants write, and a section on
> why AI review misses them — fluent, confident output produced whether or not anything was
> established. The skill is written against that, not in spite of it.

Those three constraints are **measured, not asserted**. [`evals/`](evals/) holds a fixture
app with nine planted defects and a clean control of the same app: a deterministic grader
resolves every citation against the real file, matches verdict phrasing, counts unknowns,
and counts findings on the control — where any finding is a false positive by construction.
No model grades another model's output, because a grader that is itself a model has the
same failure mode as the thing it grades.

It does one thing: check whether what you built is ready to ship. For skills that teach an
agent how to *build* well — testing, debugging, planning, git workflow — see
[agent-skills](https://github.com/addyosmani/agent-skills). They compose; use both.

## MCP server

Let your coding agent query the checklist directly while it works, instead of you pasting
it in. Read-only, no filesystem or network access beyond its own bundled data.

**Claude Code**

```bash
claude mcp add prodcheck -- npx -y --package=prodcheck prodcheck-mcp
```

**Anything else** — add to your MCP client config:

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

**Shipped**

- [x] Security checklists, split by domain and portable across stacks
- [x] Machine-readable data layer + [schema](data/schema.json)
- [x] `npx prodcheck` — generate a filtered checklist for your stack
- [x] MCP server — so your coding agent can query the checklist directly

**Domains**

All five domains have shipped. The structure has room for more —
launch, social and legal are the obvious next ones — and
[the plan](https://github.com/FarzamHabibi/pre-production-checklist/blob/main/README.md#roadmap)
is written before the content, not after.

- [x] **`performance/`** — shipped: 313 items across 9 checklists.
- [x] **`integrations/`** — shipped: 192 items across 6 checklists.
- [x] **`scale/`** — shipped: 286 items across 9 checklists.
- [x] **`post-launch/`** — shipped: 192 items across 8 checklists. Added after the other
      four, because a gap showed up once they were all in front of a reader: every domain
      described how to build something that does not break, and none asked whether the
      response was prepared for when it breaks anyway.

**Next**

- [x] **Web version** — live at [prodcheck.pages.dev](https://prodcheck.pages.dev): every
      checklist browsable, filterable and copyable as Markdown, plus a JSON endpoint any
      tool can fetch.
- [x] **Deepen `scale/`** — 214 → 286. Added service levels and error budgets, search and
      analytics engines, realtime fan-out, contract and event versioning, and tenant-shape
      capacity. The gaps were measured rather than guessed at.
- [x] **Skill file for agents** — `npx prodcheck init` writes the review procedure into
      `.claude/skills/`, `.cursor/rules/` or `AGENTS.md`. Usable today: the MCP server
      already supplies the items, what was missing was the discipline.
- [x] **More stack supplements** — 19 → 26. Added FastAPI, AWS, Kubernetes, Vercel,
      Firebase, Stripe and GraphQL. Written rather than left as open issues, because a
      visitor who does not find their stack decides the project is not for them before
      reading an item.
- [ ] **More domains** — `launch/`, `social/`, `legal/`. The structure absorbs them without
      moving anything else.

**Later**

### Not started — a review that runs, rather than a document you read

**Parked deliberately, and last.** Everything above is content and tooling that works
today; this is a different product built on top of it, and shipping it half-done would be
worse than not shipping it. Recorded here so the design decisions are not lost.

The idea: a tool that checks a codebase against the checklist, writes a report to the repo
root, and re-opens items when the relevant code changes.

```
prodcheck scan      detect stack and features from the repo   -> .prodcheck/profile.json
prodcheck check     deterministic rules, no model involved    -> findings
prodcheck review    model-assisted review, citations verified -> findings
prodcheck report    render SECURITY-REVIEW.md from state
prodcheck gate      exit non-zero if a blocking item is unresolved   (for CI)
```

- [ ] **`scan` — profile the repo.** Read `package.json`, `requirements.txt`, `go.mod`,
      `Dockerfile`, CI config and the shape of the source tree to work out which stack is
      in use and which features exist — file upload, webhooks, multi-tenancy, background
      jobs, an LLM surface. Selects the applicable items *before* any model is involved.
      A Django app with no mobile client and no file uploads does not need 1,435 items;
      it needs closer to 400.

- [ ] **`check` — the deterministic tier.** Roughly 160 items are answerable by search
      alone: the [must-not-exist list](checklists/security/core/17-release-gates.md), unpinned CI
      actions, secrets in a Dockerfile, `dangerouslySetInnerHTML`, wildcard CORS. These
      need no model, cost nothing, cannot hallucinate, and run in CI on every push.

- [ ] **`review` — the model-assisted tier, built not to be trusted.** Most items need
      someone to read the code, so this runs inside whatever agent you already use
      (Claude Code, Cursor, Copilot) over MCP plus a skill file — no API key, no token
      cost from us. The design constraints matter more than the feature:

  - **A model never writes `[x]`.** Its output is evidence, not a verdict. Results are
    `deterministic-pass`, `model-flagged` (needs a human), or `human-verified`. Only the
    first and last count toward the gate. There is no green tick a model put there.
  - **Every citation is verified.** A finding must cite `file:line`; the tool confirms
    that line exists and that the quoted code matches before accepting it. Findings that
    fail this check are dropped, which removes most hallucination for almost no cost.
  - **`unknown` is a real result.** A model may say it could not determine something, and
    `unknown` never silently becomes `pass`. It is reported separately.

- [ ] **State that survives re-runs.** `.prodcheck/state.json`, keyed by the stable item
      ids already in [`data/checklist.json`](data/checklist.json), storing status,
      justification, date, and a hash of the code it was decided against. Items you marked
      `[N/A]` stay marked — until the relevant code changes, at which point they re-open
      with *"verified at `abc1234`; that file has changed since."* This is what makes it a
      living document rather than a report that rots.

- [ ] **`gate` in CI.** Without a build that fails, the report gets stale and stops being
      read. This is the part that makes the rest stick.

- [ ] **Skill file for agents.** `prodcheck init --skill` writes the review procedure into
      `.claude/skills/` or `AGENTS.md`, so an agent knows how to run all of the above.

> Building an AI code reviewer on top of a checklist whose `vibe-coding/` folder warns
> that AI review confirms AI-written code is fine, only makes sense if the design takes
> that warning seriously. That is what the three constraints above are for.


---

## Contributing

Stack files, corrections, missing items, and war stories are all welcome.
See [CONTRIBUTING.md](CONTRIBUTING.md).

## Questions

Open a [discussion or an issue](https://github.com/FarzamHabibi/pre-production-checklist/issues) —
that way the answer is public and the next person finds it.

For anything that does not fit there, [@farzam_habibi](https://x.com/farzam_habibi) on X.

## Reporting a security problem

See [SECURITY.md](SECURITY.md). That includes **an item in this checklist that is wrong in
a way that would make a reader less safe** — a checklist that gives false confidence is
worse than no checklist, so those are treated as the highest-priority reports.

The single most useful contribution is a stack file for a stack that isn't covered.
There are open issues for [FastAPI](https://github.com/FarzamHabibi/pre-production-checklist/issues/1),
[AWS](https://github.com/FarzamHabibi/pre-production-checklist/issues/2),
[Kubernetes](https://github.com/FarzamHabibi/pre-production-checklist/issues/3),
[Vercel](https://github.com/FarzamHabibi/pre-production-checklist/issues/4),
[Firebase](https://github.com/FarzamHabibi/pre-production-checklist/issues/5),
[Stripe](https://github.com/FarzamHabibi/pre-production-checklist/issues/6) and
[GraphQL](https://github.com/FarzamHabibi/pre-production-checklist/issues/8),
each labelled `good first issue`. Copy
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
(Anthropic) and [ChatGPT](https://chatgpt.com) (OpenAI), working from a real
pre-production review rather than generating checklist items from scratch. They did the parts that don't fit in one
person's head: cross-referencing hundreds of findings against OWASP categories, keeping
3,093 items consistent in wording and structure, and spotting the gaps between sections.

That's worth stating plainly for two reasons.

**It's the honest provenance.** A security checklist asks you to trust it. You should know
how it was made.

**The `vibe-coding/` folder applies to this repository too.** It says AI-generated work
needs review that assumes the AI was confidently wrong somewhere, and that "the tests
pass" is not a security argument. Both were true here — the test suite for the CLI caught
three real bugs in AI-written code, including an MCP server that silently truncated
every response over 8 KB. The checklist is not exempt from its own advice, and neither are the
tools shipped alongside it.

If you find an item that's wrong, plausible-sounding but false, or subtly misleading,
that's exactly the failure mode `vibe-coding/07-review-blind-spots.md` warns about.
[Open an issue](https://github.com/FarzamHabibi/pre-production-checklist/issues) — that
correction is worth more than three new items.

## Credits

Written and maintained by the founding team at **[Arioo](https://arioo.com)**, out of
the work of getting our own product ready to ship.

Contributions from everyone who opens an issue or a PR are what will keep it accurate —
see the [contributors](https://github.com/FarzamHabibi/pre-production-checklist/graphs/contributors).
