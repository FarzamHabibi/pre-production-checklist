# Pre-Production Checklist

A collection of checklists to run **before** you ship to production.

Built for solo founders and small teams who own the whole stack — the code, the
infrastructure, the deploy pipeline, and increasingly the AI agents too — and who
don't have a security team to hand it to.

The first checklist is out now: **2,922 security items across 107 sections.**

---

## What's inside

| Checklist | Items | Status |
| --- | ---: | --- |
| [Deep Security Audit](checklists/security.md) | 2,922 | ✅ Available |
| Launch & Product Hunt | — | Planned |
| Social presence | — | Planned |
| Legal & compliance | — | Planned |
| Performance & cost | — | Planned |

---

## The security checklist

[`checklists/security.md`](checklists/security.md) — 107 sections, 2,922 items.

It is written against a specific, common indie stack, and it is opinionated about it:

**Next.js · NestJS · Supabase · Cloud Run · Cloudflare · Docker · GitHub Actions · Swift/SwiftUI**

Most of it generalizes. The parts that don't are labelled by platform, so you can skip
them.

### Coverage

<details>
<summary><b>Foundation</b> — 61 items</summary>

| § | Section | Items |
| ---: | --- | ---: |
| 1 | Architecture / Threat Model | 26 |
| 2 | Global Authentication & Authorization | 35 |
</details>

<details>
<summary><b>Application &amp; data</b> — 618 items</summary>

| § | Section | Items |
| ---: | --- | ---: |
| 3 | NestJS — Application Security | 167 |
| 4 | Supabase Auth | 46 |
| 5 | Supabase Database / PostgreSQL | 69 |
| 6 | Supabase Storage | 35 |
| 7 | Public API / REST / RPC | 42 |
| 8 | Webhooks | 18 |
| 9 | Next.js 16+ Frontend | 141 |
| 31 | File / Document / Image Security | 20 |
| 54 | RAG Security | 32 |
| 21 | SSRF / Egress / Network Controls | 14 |
| 22 | Business Logic Security | 27 |
| 23 | Race Conditions | 17 |
</details>

<details>
<summary><b>Native apps</b> — 161 items</summary>

| § | Section | Items |
| ---: | --- | ---: |
| 10 | iOS / iPadOS / Swift / SwiftUI | 116 |
| 11 | macOS | 45 |
</details>

<details>
<summary><b>Infrastructure &amp; delivery</b> — 384 items</summary>

| § | Section | Items |
| ---: | --- | ---: |
| 12 | Cloud Run | 76 |
| 13 | Docker / Build Security | 23 |
| 14 | Google Cloud Build | 24 |
| 15 | Cloudflare | 86 |
| 16 | GitHub Repository Security | 33 |
| 17 | GitHub Actions CI/CD | 91 |
| 18 | Dependency / Supply Chain Security | 20 |
| 19 | Secrets Management | 31 |
</details>

<details>
<summary><b>Classic web attack surface</b> — 108 items</summary>

| § | Section | Items |
| ---: | --- | ---: |
| 20 | Cryptography | 20 |
| 24 | Client / API Authorization Matrix Testing | 17 |
| 25 | Information Disclosure | 21 |
| 26 | Session / Token Security | 21 |
| 27 | CSRF | 15 |
| 28 | Clickjacking / UI Redress | 8 |
| 29 | Open Redirects | 8 |
| 30 | OAuth / SSO | 15 |
</details>

<details>
<summary><b>Operations &amp; release gates</b> — 228 items</summary>

| § | Section | Items |
| ---: | --- | ---: |
| 32 | Monitoring / Detection | 21 |
| 33 | Incident Response | 15 |
| 34 | Production Configuration Review | 22 |
| 35 | Development / Staging Isolation | 11 |
| 36 | Security Testing Automation | 18 |
| 37 | Manual Penetration-Test Scenarios | 46 |
| 38 | High-Risk "Must Not Exist" Search | 25 |
| 39 | Critical Findings That Should Block Release | 20 |
| 40 | Final Security Sign-Off | 30 |
</details>

<details>
<summary><b>AI &amp; agent security</b> — 732 items</summary>

The part you won't find in a standard checklist. If you ship an LLM feature, an agent,
tool-calling, RAG, or MCP, this is the section to read.

| § | Section | Items |
| ---: | --- | ---: |
| 41 | AI Security Architecture | 37 |
| 42 | AI Identity & Authorization | 35 |
| 43 | Prompt Injection | 43 |
| 44 | Agent Goal Hijacking | 13 |
| 45 | System Prompt Security | 22 |
| 46 | Prompt Structure / Instruction Hierarchy | 15 |
| 47 | AI Tool / Function Calling Security | 29 |
| 48 | Dangerous AI Tools | 40 |
| 49 | AI + Supabase Security | 22 |
| 50 | AI + API Security | 17 |
| 51 | AI + SSRF | 25 |
| 52 | AI Output Security | 23 |
| 53 | AI-Generated Code Execution | 24 |
| 55 | AI Memory Security | 19 |
| 56 | Multi-Agent Security | 25 |
| 57 | MCP Security | 26 |
| 58 | AI Supply Chain | 24 |
| 59 | Sensitive Data & AI Privacy | 20 |
| 60 | AI Data Exfiltration Tests | 35 |
| 61 | AI Output → Browser Security | 14 |
| 62 | AI + Email Security | 19 |
| 63 | AI + Browser Automation | 18 |
| 64 | AI + GitHub / SWE Agents | 23 |
| 65 | AI + Cloud / Production Operations | 19 |
| 66 | AI Rate Limits / Cost Security | 23 |
| 67 | AI Reliability as a Security Issue | 15 |
| 68 | AI Logging / Audit | 25 |
| 69 | AI Security Regression Testing | 26 |
| 70 | AI Red-Team Prompt Pack | 36 |
| 71 | AI Security "Do Not Trust" List | 24 |
| 72 | AI Production Release Gate | 24 |
</details>

<details>
<summary><b>Vibe coding — bugs AI assistants actually write</b> — 630 items (§73)</summary>

Organized by the class of bug, not by the tool that wrote it. Written from real review
findings on AI-generated code.

| § | Section | Items |
| ---: | --- | ---: |
| 73.1 | Development Process | 22 |
| 73.2 | AI-Generated Authorization Bugs | 19 |
| 73.3 | AI-Generated Supabase / RLS Bugs | 19 |
| 73.4 | AI-Generated NestJS Security Bugs | 27 |
| 73.5 | AI-Generated Next.js Security Bugs | 26 |
| 73.6 | AI-Generated API Security Bugs | 30 |
| 73.7 | AI-Generated Dependency Vulnerabilities | 21 |
| 73.8 | AI-Generated Crypto Bugs | 22 |
| 73.9 | AI-Generated Input Validation Bugs | 27 |
| 73.10 | AI-Generated Error Handling | 11 |
| 73.11 | AI-Generated Logging Bugs | 17 |
| 73.12 | AI-Generated Configuration Bugs | 37 |
| 73.13 | AI-Generated Docker Security | 19 |
| 73.14 | AI-Generated GitHub Actions Bugs | 32 |
| 73.15 | AI-Generated Cloud IAM Bugs | 13 |
| 73.16 | AI-Generated Cloudflare Bugs | 15 |
| 73.17 | Copy-Paste Security Bugs | 13 |
| 73.18 | "Looks Secure" AI Code Review | 10 |
| 73.19 | AI Refactoring Security Regression | 17 |
| 73.20 | AI-Generated Tests Can Be Wrong | 14 |
| 73.21 | AI Review Blind Spots | 27 |
| 73.22 | AI Prompt Security for Coding Agents | 22 |
| 73.24 | AI PR Security Checklist | 34 |
| 73.25 | "One-Line Fix" Security Review | 20 |
| 73.26 | AI Code Review Questions | 34 |
| 73.27 | Vibe Coding Release Gate | 20 |
| 73.29 | Vibe-Coding Red Flags | 27 |
</details>

---

## How to use it

Don't read it top to bottom. It is a reference, not a tutorial.

1. **Copy** `checklists/security.md` into your own repo — it's a working document, meant
   to be edited and committed alongside your code.
2. **Mark `[N/A]` aggressively.** No web app on earth needs all 2,922 items. If you have
   no iOS app, §10 and §11 are 161 instant `[N/A]`s. Being honest about scope is what
   makes the remainder trustworthy.
3. **Start with §39** — "Critical Findings That Should Usually Block Release." If any of
   those 20 are true, stop and fix them before touching anything else.
4. **Then §38** — the "Must Not Exist" grep list. It's the fastest signal-per-minute in
   the whole document.
5. **Work section by section**, not item by item across sections. Context-switching
   between Cloudflare and RLS wastes more time than it saves.

### Marking convention

```
* [ ]     Not checked
* [x]     Verified secure
* [!]     Security issue found
* [N/A]   Not applicable
```

### Record every finding

An unrecorded finding is a finding you will re-discover in six months. For each `[!]`:

affected component · exact endpoint/file/config · attack precondition · proof of
exploitability · business impact · severity · remediation · regression test · owner ·
date verified

### One rule worth internalizing

> Do not accept *"the frontend hides it"*, *"the route is hard to guess"*, *"the user
> needs a valid JWT"*, or *"Cloudflare blocks it"* as authorization controls by
> themselves.

Enforce every control at the lowest trustworthy layer available:

```
Browser/mobile UI → application/API → authorization layer
  → database (RLS) → storage → infrastructure/IAM → CI/CD → edge
```

---

## Roadmap

- [x] Deep security audit checklist
- [ ] Machine-readable source (structured data → generated Markdown)
- [ ] `npx` CLI — generate a filtered checklist for your stack
- [ ] MCP server — so your coding agent can query the checklist directly
- [ ] Web version
- [ ] More categories: launch, social, legal, performance

The machine-readable step is the one that unlocks the rest. 2,922 items is a wall of
text; *"here are the 400 items that apply to Next.js + Supabase + Cloud Run"* is a tool.

---

## Contributing

Very welcome. Especially:

- **Items that are wrong or outdated.** Frameworks move; some of these will rot.
- **Items that are missing.** Particularly for stacks not covered here — Django, Rails,
  Laravel, Go, Vercel, AWS, Fly.io, Android.
- **Real-world war stories.** If an item on this list would have caught a bug you
  actually shipped, say so in an issue — that's the strongest argument for keeping it.

Please keep the existing style: one verifiable action per line, imperative mood, no
vendor pitches, no affiliate links.

---

## Disclaimer

This checklist is a starting point, not a guarantee, not a compliance certification, and
not a substitute for a professional security audit. Completing every item does not make
an application secure. Use it to find problems, not to declare their absence.

---

## License

[CC BY 4.0](LICENSE) — use it, fork it, adapt it, ship it commercially. Just keep the
attribution.

---

## Credits

Written by [Farzam Habibi](https://github.com/FarzamHabibi), extracted from the
pre-launch security audit of Arioo.

Compiled and expanded with [Claude Code](https://claude.com/claude-code) (Anthropic).
