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
