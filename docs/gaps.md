# Open coverage gaps

Things the checklist does not cover, found while doing something else, written down
before a decision has been made about them. Nothing here is a commitment to add anything.
A gap stays on this page until it is either filled or explicitly rejected with a reason,
so that "we thought about this and said no" is distinguishable from "nobody noticed".

Each entry records what was searched, what came back, and what is actually being asked.

---

## Provider-initiated termination of access

**Found** 6 September 2026, reading a Product Hunt thread in `p/cursor` about OpenAI
ending its contract with Cursor after Cursor's acquisition by SpaceX. Access ends
12 November, roughly sixty days' notice, for reasons unrelated to any developer using it.

**What was searched.** `data/checklist.json` for `terminat|revoke|withdraw|deprecat|
contract|vendor lock|provider chang|second provider|fallback (model|provider)|swap model`.
28 items matched. Every one is about the system revoking a user: revoked sessions and
tokens, expired credentials, deprecated endpoints, deprecated algorithms, user deletion
terminating access. None is about a supplier revoking the system.

The `integrations` domain sounds like the right home and is not: its 200 items are about
discoverability, crawlers, canonical tags and how third parties describe you. It is
integration in the marketing sense, not the dependency sense.

**So the gap is real.** The list covers every way access dies except the one where
somebody decides. That includes a model provider, but also a payment processor dropping a
category, a registry removing a package, an API tier being withdrawn, or an acquisition
changing who your counterparty is.

**The open question is scope, not whether the gap exists.** Everything on the list today
is verifiable by looking at your own code or your own infrastructure before you ship.
"Could you survive losing your model provider" is not that shape. It is a business
continuity question, the answer changes with contracts nobody can inspect, and the
honest version of the item may be unanswerable in the format the rest of the list uses.

The version that might fit the format is narrower and worth considering on its own:
not "do you have a plan" but "have you ever actually performed the switch". Whether the
prompts were tuned to one provider's behaviour, whether the eval numbers were ever
portable, and how long a swap took the one time it was tried, are all things a team can
establish before they need to know.

**Decision:** none yet. Do not add items from this page without deciding the scope
question first, because the wrong version of this becomes advice rather than a check, and
advice is what this list has stayed away from.

---

## Runtime patch lag and isolation boundaries

**Found** 9 September 2026, reading ExploitBench, a CMU benchmark of how far LLM agents
climb an exploitation ladder against 41 patched V8 bugs with mitigations on. Reaching the
vulnerable code and triggering a crash is now routine for every deployed model tested; a
private frontier model reaches code execution on about half. The point for a defender is
not the ladder. It is that the cost of exploiting a bug that already has a fix is falling,
so the time between an upstream fix and your redeploy is what an attacker gets.

**What was searched.** `checklists/` for `n-day|zero-day|CVE|Electron|Chromium|V8|
headless|puppeteer|playwright|WebAssembly|seccomp|gVisor|ASLR|memory.safe|runtime version|
end-of-life|ffmpeg|libvips|ImageMagick|node-gyp|Renovate|Dependabot`. Every term returned
zero files except `patch` (Kubernetes node images and CI runner OS only), `sandbox` (the
macOS App Sandbox, and one bare line, "Sandbox execution", in
`security/ai/05-output-handling.md` that gives no way to tell a sandbox from a `vm`
call), and `Dependabot` (GitHub Actions only). "Base images are updated" existed; "the
runtime is inside its support window" and "the patch lag is a number" did not.

**So the gap was real, and narrower than the benchmark.** Heap-sandbox escapes and ASLR
are not something a small team can verify, and rule 7 of the plan keeps them out. What a
team can verify is its own patch lag and whether the boundaries it relies on are process
or kernel boundaries rather than language ones. That slice fits the format.

**Decision, 9 September 2026 — filled, in place, without naming the benchmark.** A
benchmark name in a checklist is a date stamp; the items have to stand without it.

* `security/core/13-runtime-and-containers.md` — a *Runtime patch window* subsection:
  inventory of embedded engines and native binaries, support window, single pin,
  automatic base-image bumps, security-announce routing, the measured lag, observable
  running version, a runtime-only redeploy.
* `security/core/07-storage-and-files.md` — native media decoding in a worker with no
  credentials and no internal route, time and memory limits, decoder-level allow-list,
  parser versions on the same cadence.
* `security/ai/05-output-handling.md` — "Sandbox execution" now says what a sandbox is
  not (`vm`, `new Function`, `exec` with a filtered namespace), what to grep for, that
  the sandboxed engine is patched, and a test that proves the boundary.
* `post-launch/08-learning-and-drills.md` — the runtime-only patch is rehearsed and timed.

**Declined.** A threat-model item saying "assume N-day exploitation is automated" — that is
advice, and the measurable form (the lag is recorded) is already above. **Deferred**, not
declined: a headless-browser section (PDF export, previews, scraping run attacker HTML in
Chromium) and an Electron stack supplement; both are real, both are a minority of readers,
and Electron is a new stack rather than a few items.

---

## SVG, denial of service by name, and type safety at the boundary

**Found** 13 September 2026, asked directly: does the list cover SVG, input validation,
types and DDoS?

**What was searched.** `checklists/` for `\bsvg\b`, `ddos|denial|volumetric|slowloris|
rapid reset`, `input validation|ValidationPipe|allowlist|zod|class-validator`, and
`strict|any|type confusion|coercion|mass assignment|prototype pollution|runtime schema`.

Input validation was strong — seventeen concrete items under *Validation / parsing* in
`security/core/04-backend-api.md` plus the test list in
`security/ai-generated-code/03-backend-frontend-api.md` — and needed nothing.

SVG returned four bare lines, one each in `security/core/04`, `05`, `07` and
`security/ai/05`: "Verify SVG handling." with no how. Nothing said rasterize, sanitize
with an SVG profile, strip `<foreignObject>` and external `href`, disable DTD loading,
serve off-origin, embed only via `<img>`. For a list whose readers accept avatars and
render model output, that is the one file type the bitmap rules do not cover.

DDoS was covered in substance across `security/core/18`, `14` and `04` — resource
exhaustion, origin protection, rate limits — and the word appeared in no file. Anyone
searching the list, the JSON or the MCP output for the term they know found nothing.

Type safety appeared only as consequences: type confusion, coercion, mass assignment,
prototype pollution, and one `ai-generated-code` line about `any`. The cause — that a
TypeScript type is erased at build time and enforces nothing at the request boundary —
was not an item anywhere. It is stack-specific by nature, which is why it was missing
from the core files and belongs in the supplements.

**Decision, 13 September 2026 — filled.**

* `security/core/07-storage-and-files.md` — an *SVG* subsection, eight items; `05` and
  `security/ai/05` point at it in prose so the existing bare lines keep their ids.
* `security/core/18-abuse-and-availability.md` and `14-edge-dns-waf.md` — each names
  itself as the DoS/DDoS section and says which layer it owns; `14` gains four items
  (provider protection on, challenge mode rehearsed, HTTP/2 rapid reset, limit counts
  cost not requests).
* `stacks/nestjs.md` and `stacks/nextjs-react.md` — `strict`, the `any` and
  `@ts-ignore` grep, DTO classes over interfaces, the `ValidationPipe` flags, nested
  DTO decorators, runtime schema on `searchParams`, `FormData`, `JSON.parse` and
  webhook bodies.

**Declined.** A core-domain item about TypeScript `strict` — rule 4, it only makes sense
when a product is named. Anything about XSS through SVG in *other* people's sites,
which is the reader's problem only when they host the file.

---

## Payments, account lifecycle and agent approval, from a live product

**Found** 11 October 2026, by checking six weeks of fixes in a production product the
maintainers run against the list. Every one was a defect that shipped, was found in
production or in a live test, and was fixed. The question was which of them the list
would have caught first.

**What was searched.** `checklists/` for `webhook.*(event types|subscribed|enabled
events)`, `webhook.*api version`, `livemode`, `idempot.*(unavailable|down|redis)`,
`(notif|fulfil).*(before|until).*(confirm|paid)`, `(abandon|expire).*(checkout|seat|
stock)`, `reconcil`, `(decrement|release).*(fail|error)`, `\bban(ned)?\b`,
`disconnect|unlink|revoke`, `auth\.users|orphan`, `mfa|two-factor`,
`encrypt.*(token|credential)`, `oracle|credential.*test`, `redirect.*(authorization|
bearer)`, `(confirm|approv).*(replay|stored call)`, `(unattended|scheduled).*(approv|
consent)`, `(brows|navigat).*(allowlist|redirect)`, `(secret|api key).*(chat|
conversation)`, `invent|fabricat`, `css injection|custom propert`, `allow-same-origin`,
`402|provider.*billing`.

What came back was the general form of almost every one: "Verify provider disconnect",
"Suspended users cannot access protected data", "High-risk tools have approval gates",
"Verify navigation allowlist", "AI-generated CSS cannot break containment", "Refunds ...
revoke access". Each is true and none would have caught the defect, because each defect
lived in the part the line does not say: the refund logic was correct and the event was
never subscribed; the disconnect removed the link and kept the token; the suspension
changed a field and the API-key path still answered; the approval gate existed and the
model could draw its own button. `ban`, `livemode`, `allow-same-origin`, `402` and every
payment-sequencing term returned nothing at all.

**Decision, 11 October 2026 — filled, in place.** Thirty items, no new file, no existing
item text changed:

* `stacks/stripe.md` — enabled events against handled events, the endpoint's API
  version, `livemode` checked per event.
* `security/core/04-backend-api.md` — webhooks fail closed when the idempotency store is
  down, and the API still boots.
* `security/core/10-business-logic.md` — nothing fires before payment is confirmed,
  abandoned checkouts release what they held, zero-priced items skip the gateway, a
  reconciliation sweep is idempotent, a quota release writes nothing on error.
* `security/core/02-authorization.md` — suspension reaches every credential, a
  multi-credential guard re-throws, the admin list reads the identity provider, admin MFA
  enforced server-side, admin rights need a source the app cannot write; under OAuth,
  disconnect deletes the tokens and a refresh cannot revive the connection.
* `security/core/08-secrets-and-crypto.md` — user-supplied credentials encrypted with a
  key the database does not hold, fail closed; a credential-test endpoint is not an
  oracle.
* `security/core/11-mobile-apps.md` — an interceptor's bearer token does not follow a
  cross-host redirect.
* `security/ai/03`, `05`, `08`, `02`, `09` — server-drawn approval, exact one-time replay,
  unattended exemption keyed on the trigger, money fields stripped from model writes;
  CSS values against a grammar, `allow-same-origin`, stored bundles; invented specifics
  on public pages; every address change in a browser agent; one place to enter a secret;
  a provider billing failure is not a rate limit.

**Second pass, same day — the deploy, operations and agent-assisted development lessons.**
The same search shape found the same pattern: "Run infrastructure drift detection",
"Verify rollback mechanism", "Verify error tracking is installed" were all present, and
none said that policies run by hand drift, that a skipped assertion is a pass, or that the
label on a service is not what serves traffic. `pg_policies`, `skip`, `serving|traffic`,
`unhandled rejection`, `ansi`, `watchdog`, `worktree|commit -a`, `--fix|--write` and
`plan quota` returned nothing. Seventeen items, again in place:

* `security/core/06-database.md` — policies ship in the table's migration; production
  `pg_policies` diffed against the repository.
* `security/core/15-ci-cd-and-supply-chain.md` — a deploy is confirmed from what serves
  traffic; a check that did not run blocks like one that failed.
* `security/core/17-release-gates.md` — a suite whose assertions skip fails.
* `security/core/16-monitoring-and-response.md` — the unhandled-rejection handler never
  logs the raw error.
* `stacks/google-cloud.md` — the serving revision's commit, not the newest revision.
* `post-launch/05-outage-and-dependencies.md` — a watchdog checks its own probe; a plan
  quota is an outage.
* `post-launch/06-rollback-and-kill-switches.md` — dark features behind two switches;
  every switch that matters is reachable from the admin interface.
* `integrations/06-monitoring-and-alerting.md` — error-tracker replay and bodies off by
  default; no ANSI escapes in production logs.
* `security/ai-generated-code/01-process.md` — one worktree per agent session or explicit
  staging, no mutating scripts to inspect, no purge of shared dependency directories, a
  baseline at session start.

**Declined.** Sanctions screening of currencies and payment rails. It is checkable, but
it is a legal question first and belongs in the `legal/` domain the expansion plan
already names, not as a lone line in a security file.

---

## What well-known public repositories check that this list did not

**Found** 11 October 2026, by reading five groups of widely used public repositories
for checks a team can run before shipping, and searching this list for each one:

* Alibaba and Alibaba-origin projects — the Java coding guidelines (`alibaba/p3c`),
  flow control (`alibaba/Sentinel`), `fastjson`/`fastjson2`, `nacos`, `druid`,
  `arthas`, and `apache/dubbo`, with their published advisories.
* Cloudflare — `cloudflare/cloudflare-docs` (TLS modes, origin protection, cache rules,
  Turnstile, R2, Workers, Tunnel, Access, DNS) and the `workers-sdk` and `pingora`
  advisories.
* General application security — OWASP ASVS 5.0, the OWASP Cheat Sheet Series,
  `goldbergyoni/nodebestpractices`, `shieldfy/API-Security-Checklist`,
  `thedaviddias/Front-End-Checklist`.
* Supply chain and infrastructure — `ossf/scorecard`, SLSA's verification spec,
  `step-security/harden-runner`, `docker/docker-bench-security`, checkov's GitHub
  Actions checks, `gitleaks`, and the `tj-actions/changed-files` advisories.
* LLM, agent and MCP security — the MCP specification's security best practices,
  `invariantlabs-ai/mcp-scan`, `promptfoo` red-team plugins, `NVIDIA/garak` probes,
  `protectai/llm-guard`, and the OWASP LLM and agentic material.

**How the wording was produced.** Every source was read for what to check, never for
how to say it. No sentence, rule text or example was copied; each item is written fresh
in this list's own form. Several sources are CC BY-SA or Apache licensed, and this list
is CC BY 4.0 — copying their wording would have changed what this list can be used for.
Configuration names were checked against each project's current source before they were
written down (`nacos.core.auth.server.identity.key`, `fastjson.parser.safeMode`,
`resetEnable`, `qos-accept-foreign-ip`, `csp.sentinel.api.port`).

**What was searched.** Each candidate was searched with two to four patterns over
`checklists/`, and kept only when the topic was absent or present only as a bare line
with no way to check it. Among the absent: `persist-credentials`, `workflow_run`,
`GITHUB_ENV`, `--ignore-scripts`, licence, pre-commit, `timingSafeEqual`, `__Host-`,
`Cross-Origin-Opener-Policy`, `Sec-Fetch`, JSONP, CSV formula, log injection, cache
deception, CAA, certificate transparency, `jku`, `iss` mix-up, `sub` as identity key,
autoType and polymorphic deserialization, QoS and diagnostic ports, default token
secrets, hot-key limits, unbounded executors, token passthrough, tool-definition
hashing, tool shadowing, Unicode tag characters, chat-template tokens, reasoning budgets,
client-supplied conversation history.

**Decision, 11 October 2026 — filled.** 132 items in 32 existing files. Three new H2s in
`stacks/cloudflare.md` (*Authentication & Authorization*, *Object Storage & File
Handling*, *Abuse & Availability*), each with its back-link; no new file, no new domain,
no existing item text changed. This closes eight of the topics the 13 September audit
found absent: constant-time comparison, OSS licence compliance, CAA and certificate
transparency, field-level encryption, log injection, web cache deception, pre-commit
secret blocking, and homoglyph and bidi identity spoofing.

**Declined.** A Dubbo stack supplement: one product's three settings do not justify a
file, and the core RPC-deserialization item covers the class of bug. Product features
that would read as a pitch (client-side script monitoring, schema-validation services,
named runner-hardening tools). Testing techniques with no pass/fail form (glitch tokens,
encoding probes, model identification). OSS project-health signals that say nothing
about a production deployment (fuzzing badges, contributor counts, maintenance scores).

**Still open from the 13 September audit:** GDPR operations and DSAR handling beyond
retention, human on- and offboarding, email deliverability beyond SPF/DKIM/DMARC,
admin-panel exposure as its own topic, Electron, headless-browser rendering, jailbreak
detection, PCI and tax outside a payment processor, bot mitigation at signup beyond the
challenge-verification items.

## Ransomware that targets identity and people

**Found** 19 October 2026, after reading a summary of a 2026 ransomware risk survey by
an identity-recovery vendor: over a third of organisations reported attackers
threatening employees' families or friends (threats, stalking, doxxing, swatting);
most reported being hit more than once in a year; most of the attacks reached the
identity system (directory, IdP); about half had a separate backup of identity. The
figures are the vendor's own and were not used as item text; the topics were.

**What was searched.** `ransom`, `immutab`, `identity provider`, `break-glass`,
`restore`, `dox`, `swat`, `extort`, `phishing-resistant`, `security key`, `passkey`,
`SIM`, `staff`, `family`, `home address`, `WHOIS`. Present: backups out of reach of
production and immutable "against ransomware" (`post-launch/04`), break-glass and an
IdP outage (`post-launch/01`), in-product admin MFA (`security/core/02`), registrar MFA
(`security/core/14`). Absent: restoring the identity store itself and proving sign-in
after a restore; checking a restore for attacker-added admins, factors and keys; any
decision about paying, including that a payment to a sanctioned group is unlawful; an
out-of-band response channel; pressure on staff and families; phishing-resistant MFA
on the team's own operator accounts; SIM swap; help-desk resets.

**Decision, 19 October 2026 — filled.** 25 items in four existing `post-launch/` files:
a new H2 *When the identity system is what was hit* in `04-data-loss.md` (7), two new
H2s *Extortion and ransom demands* (7) and *When the pressure moves to people* (5) in
`03-security-incident.md`, five operator-account items under *Access when you need it*
in `01-readiness.md`, and one ransomware drill in `08-learning-and-drills.md`. No new
file, no new domain, no existing item text changed.

**Declined.** Survey percentages as item text (they are one vendor's figures, not
checks). Named identity-recovery products. Registering with police address-flag
services against swatting: it exists only in some places and could not be stated as a
general check. Sanctions screening of customers stays declined and left for `legal/`;
the one sanctions line added is about a ransom payment only.
