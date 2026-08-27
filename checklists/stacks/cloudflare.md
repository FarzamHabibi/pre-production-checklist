# Cloudflare

Items from the core checklists that are specific to **Cloudflare**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Secrets Management & Cryptography
<sub>from [`core/08-secrets-and-crypto.md`](../core/08-secrets-and-crypto.md)</sub>

* [ ] Identify Cloudflare tokens.

## Common Web Attack Classes
<sub>from [`core/09-common-web-attacks.md`](../core/09-common-web-attacks.md)</sub>

* [ ] Search Cloudflare logs.

## DNS, CDN, Edge & WAF
<sub>from [`core/14-edge-dns-waf.md`](../core/14-edge-dns-waf.md)</sub>

* [ ] Verify Cloudflare is authoritative for intended zones.
* [ ] Verify the origin is not directly reachable from the public internet when it should be Cloudflare-only.
* [ ] Verify Cloudflare proxying is enabled for intended web/API hosts.
* [ ] Set Cloudflare SSL/TLS to Full (strict) where appropriate.
* [ ] Inventory all Cloudflare API tokens.
* [ ] Verify resource/zone restrictions.
* [ ] Verify Cloudflare Transform Rules do not modify security-sensitive values unexpectedly.

## Monitoring, Detection & Incident Response
<sub>from [`core/16-monitoring-and-response.md`](../core/16-monitoring-and-response.md)</sub>

* [ ] Monitor Cloudflare DNS changes.
* [ ] Monitor Cloudflare token changes.

* [ ] Document how to rotate Cloudflare tokens.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Any exposed Cloudflare/API/cloud credential with production privileges.

* [ ] Cloudflare API key
* [ ] Cloudflare API token

* [ ] Verify production Cloudflare configuration.

* [ ] Cloudflare DNS audit complete.
* [ ] Cloudflare WAF/rate-limit audit complete.

## AI Security Architecture & Identity
<sub>from [`ai/01-architecture-and-identity.md`](../ai/01-architecture-and-identity.md)</sub>

* [ ] AI does not receive Cloudflare administrator credentials.

## Tool Calling & Excessive Agency
<sub>from [`ai/03-tools-and-agency.md`](../ai/03-tools-and-agency.md)</sub>

* [ ] Cloudflare DNS changes

## AI Data Access & Privacy
<sub>from [`ai/04-data-access-and-privacy.md`](../ai/04-data-access-and-privacy.md)</sub>

* [ ] AI cannot bypass Cloudflare/WAF intentionally.

## AI Output Handling
<sub>from [`ai/05-output-handling.md`](../ai/05-output-handling.md)</sub>

* [ ] Never directly use model output as a Cloudflare rule.

## AI Testing & Red-Team Pack
<sub>from [`ai/10-testing-and-red-team.md`](../ai/10-testing-and-red-team.md)</sub>

* [ ] Cloudflare tokens

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`vibe-coding/04-crypto-secrets-deps.md`](../vibe-coding/04-crypto-secrets-deps.md)</sub>

* [ ] Cloudflare rules

## Review Blind Spots
<sub>from [`vibe-coding/07-review-blind-spots.md`](../vibe-coding/07-review-blind-spots.md)</sub>

* [ ] Verify outdated Cloudflare configuration is not copied.

* [ ] Compare Cloudflare behavior.

## Agent Prompts & PR Review
<sub>from [`vibe-coding/08-prompts-and-pr-review.md`](../vibe-coding/08-prompts-and-pr-review.md)</sub>

* [ ] Identify DNS/Cloudflare changes.

* [ ] Cloudflare?

## Vibe-Coding Release Gate
<sub>from [`vibe-coding/09-release-gate.md`](../vibe-coding/09-release-gate.md)</sub>

* [ ] AI changed Cloudflare.
