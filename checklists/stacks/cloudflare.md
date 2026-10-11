# Cloudflare

Items from the core checklists that are specific to **Cloudflare**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify an app behind Cloudflare Access validates `Cf-Access-Jwt-Assertion` (signature against the team certs, `aud` tag, expiry) on every request instead of trusting that the request arrived through Access.

## Object Storage & File Handling
<sub>from [`security/core/07-storage-and-files.md`](../security/core/07-storage-and-files.md)</sub>

* [ ] Verify the `r2.dev` public development URL is disabled on every bucket served through a custom domain — WAF, Access and token-auth rules apply only on the custom domain, and `r2.dev` serves the same objects without them.

## Secrets Management & Cryptography
<sub>from [`security/core/08-secrets-and-crypto.md`](../security/core/08-secrets-and-crypto.md)</sub>

* [ ] Identify Cloudflare tokens.
* [ ] Search `wrangler.toml` and `wrangler.jsonc` `vars` blocks, every `env.*.vars` block included, for keys, tokens and connection strings, and confirm `.dev.vars` is gitignored — `vars` are plaintext in the repo and the dashboard; secrets go through `wrangler secret put`.
* [ ] Verify `wrangler`, `miniflare` and `@cloudflare/vite-plugin` are past their dev-server advisories and that local development listens on `127.0.0.1` — older dev servers served `.dev.vars`, `.env` or arbitrary files to the network.
* [ ] Inventory every Cloudflare Tunnel token (`cloudflared ... --token`) in compose files, systemd units and CI, and confirm a rotation has been rehearsed — whoever holds it can run a connector for that tunnel.

## Common Web Attack Classes
<sub>from [`security/core/09-common-web-attacks.md`](../security/core/09-common-web-attacks.md)</sub>

* [ ] Search Cloudflare logs.

## DNS, CDN, Edge & WAF
<sub>from [`security/core/14-edge-dns-waf.md`](../security/core/14-edge-dns-waf.md)</sub>

* [ ] Verify Cloudflare is authoritative for intended zones.
* [ ] Verify the origin is not directly reachable from the public internet when it should be Cloudflare-only.
* [ ] Verify Authenticated Origin Pulls uses a zone-level or per-hostname certificate you uploaded, not the global Cloudflare certificate — the shared one only proves the request crossed some Cloudflare account.
* [ ] Verify Cloudflare proxying is enabled for intended web/API hosts.
* [ ] Set Cloudflare SSL/TLS to Full (strict) where appropriate.
* [ ] Verify no zone, Configuration Rule or Page Rule sets SSL/TLS to `Flexible` or `Off` for any path — Flexible fetches from the origin over plain HTTP while the browser still shows a padlock.
* [ ] Verify Cache Deception Armor is on in every Cache Rule that marks responses `Eligible for cache`, and that no Edge TTL or origin `Cache-Control` covered by the same rule overrides it.
* [ ] Inventory all Cloudflare API tokens.
* [ ] Verify resource/zone restrictions.
* [ ] Verify Cloudflare Transform Rules do not modify security-sensitive values unexpectedly.
* [ ] Verify `workers_dev = false` is set in the Wrangler config of every Worker served on a route or custom domain, and that version and preview URLs are disabled or behind Access — turning off `workers.dev` in the dashboard is undone by the next `wrangler deploy`.
* [ ] Search Workers for `passThroughOnException()` and confirm none sits in front of an auth, payment or rate-limit check — an exception then forwards the request to the origin unchecked.
* [ ] Verify no session revocation, ban list, kill switch or rate-limit counter relies on Workers KV for immediate effect — KV reads can be 60 seconds or more stale in other locations, so a revoked token keeps working there.
* [ ] Verify rate-limiting thresholds assume per-data-center counters (`cf.colo.id` is always a characteristic) — a distributed client gets the limit once per location, so per-account limits belong in the application.
* [ ] Audit every WAF custom rule with the `skip` action and confirm its expression matches only something the client cannot set (IP list, verified bot, mTLS certificate), never a User-Agent, path prefix or custom header.

## Monitoring, Detection & Incident Response
<sub>from [`security/core/16-monitoring-and-response.md`](../security/core/16-monitoring-and-response.md)</sub>

* [ ] Monitor Cloudflare DNS changes.
* [ ] Monitor Cloudflare token changes.

* [ ] Document how to rotate Cloudflare tokens.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Any exposed Cloudflare/API/cloud credential with production privileges.

* [ ] Cloudflare API key
* [ ] Cloudflare API token

* [ ] Verify production Cloudflare configuration.

* [ ] Cloudflare DNS audit complete.
* [ ] Cloudflare WAF/rate-limit audit complete.

## Abuse & Availability
<sub>from [`security/core/18-abuse-and-availability.md`](../security/core/18-abuse-and-availability.md)</sub>

* [ ] Search production config and build output for `1x0000000000000000000000000000000AA` and the other Turnstile test keys — the test secret passes every token, so a shipped test key silently turns the challenge off.

## AI Security Architecture & Identity
<sub>from [`security/ai/01-architecture-and-identity.md`](../security/ai/01-architecture-and-identity.md)</sub>

* [ ] AI does not receive Cloudflare administrator credentials.

## Tool Calling & Excessive Agency
<sub>from [`security/ai/03-tools-and-agency.md`](../security/ai/03-tools-and-agency.md)</sub>

* [ ] Cloudflare DNS changes

## AI Data Access & Privacy
<sub>from [`security/ai/04-data-access-and-privacy.md`](../security/ai/04-data-access-and-privacy.md)</sub>

* [ ] AI cannot bypass Cloudflare/WAF intentionally.

## AI Output Handling
<sub>from [`security/ai/05-output-handling.md`](../security/ai/05-output-handling.md)</sub>

* [ ] Never directly use model output as a Cloudflare rule.

## AI Testing & Red-Team Pack
<sub>from [`security/ai/10-testing-and-red-team.md`](../security/ai/10-testing-and-red-team.md)</sub>

Test whether an attacker can cause an agent to reveal:

* [ ] Cloudflare tokens

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`security/ai-generated-code/04-crypto-secrets-deps.md`](../security/ai-generated-code/04-crypto-secrets-deps.md)</sub>

Review every AI-generated:

* [ ] Cloudflare rules

## Review Blind Spots
<sub>from [`security/ai-generated-code/07-review-blind-spots.md`](../security/ai-generated-code/07-review-blind-spots.md)</sub>

* [ ] Verify outdated Cloudflare configuration is not copied.

* [ ] Compare Cloudflare behavior.

## Agent Prompts & PR Review
<sub>from [`security/ai-generated-code/08-prompts-and-pr-review.md`](../security/ai-generated-code/08-prompts-and-pr-review.md)</sub>

* [ ] Identify DNS/Cloudflare changes.

**Can an attacker reach the same operation another way?**

* [ ] Cloudflare API.

## Vibe-Coding Release Gate
<sub>from [`security/ai-generated-code/09-release-gate.md`](../security/ai-generated-code/09-release-gate.md)</sub>

* [ ] AI changed Cloudflare.
