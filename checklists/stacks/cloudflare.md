# Cloudflare

Items from the core checklists that are specific to **Cloudflare**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Secrets Management & Cryptography
<sub>from [`security/core/08-secrets-and-crypto.md`](../security/core/08-secrets-and-crypto.md)</sub>

* [ ] Identify Cloudflare tokens.

## Common Web Attack Classes
<sub>from [`security/core/09-common-web-attacks.md`](../security/core/09-common-web-attacks.md)</sub>

* [ ] Search Cloudflare logs.

## DNS, CDN, Edge & WAF
<sub>from [`security/core/14-edge-dns-waf.md`](../security/core/14-edge-dns-waf.md)</sub>

* [ ] Verify Cloudflare is authoritative for intended zones.
* [ ] Verify the origin is not directly reachable from the public internet when it should be Cloudflare-only.
* [ ] Verify Cloudflare proxying is enabled for intended web/API hosts.
* [ ] Set Cloudflare SSL/TLS to Full (strict) where appropriate.
* [ ] Inventory all Cloudflare API tokens.
* [ ] Verify resource/zone restrictions.
* [ ] Verify Cloudflare Transform Rules do not modify security-sensitive values unexpectedly.

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

* [ ] Cloudflare tokens

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`security/ai-generated-code/04-crypto-secrets-deps.md`](../security/ai-generated-code/04-crypto-secrets-deps.md)</sub>

* [ ] Cloudflare rules

## Review Blind Spots
<sub>from [`security/ai-generated-code/07-review-blind-spots.md`](../security/ai-generated-code/07-review-blind-spots.md)</sub>

* [ ] Verify outdated Cloudflare configuration is not copied.

* [ ] Compare Cloudflare behavior.

## Agent Prompts & PR Review
<sub>from [`security/ai-generated-code/08-prompts-and-pr-review.md`](../security/ai-generated-code/08-prompts-and-pr-review.md)</sub>

* [ ] Identify DNS/Cloudflare changes.

* [ ] Cloudflare?

## Vibe-Coding Release Gate
<sub>from [`security/ai-generated-code/09-release-gate.md`](../security/ai-generated-code/09-release-gate.md)</sub>

* [ ] AI changed Cloudflare.
