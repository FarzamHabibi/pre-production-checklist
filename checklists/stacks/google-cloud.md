# Google Cloud (Cloud Run, Cloud Build, IAM)

Items from the core checklists that are specific to **Google Cloud (Cloud Run, Cloud Build, IAM)**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Common Web Attack Classes
<sub>from [`security/core/09-common-web-attacks.md`](../security/core/09-common-web-attacks.md)</sub>

* [ ] Verify workload identity permissions if outbound cloud APIs are used.

* [ ] Search Cloud Run logs.
* [ ] Search Cloud Build logs.

## Runtime, Containers & Hosting
<sub>from [`security/core/13-runtime-and-containers.md`](../security/core/13-runtime-and-containers.md)</sub>

* [ ] Inventory every Cloud Run service.
* [ ] Inventory every default `run.app` URL.
* [ ] Review Cloud Run ingress configuration.
* [ ] Verify direct access to `run.app` cannot bypass Cloudflare/WAF/load balancer controls.

## DNS, CDN, Edge & WAF
<sub>from [`security/core/14-edge-dns-waf.md`](../security/core/14-edge-dns-waf.md)</sub>

* [ ] Verify Cloud Run `run.app` endpoint is controlled.

## CI/CD & Supply Chain
<sub>from [`security/core/15-ci-cd-and-supply-chain.md`](../security/core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Prefer workload identity federation/OIDC over long-lived cloud credentials.

* [ ] Review Cloud Build service account permissions.
* [ ] Verify artifact registry permissions.

## Monitoring, Detection & Incident Response
<sub>from [`security/core/16-monitoring-and-response.md`](../security/core/16-monitoring-and-response.md)</sub>

* [ ] Monitor Cloud Run deployments.

* [ ] Document emergency Cloud Run rollback.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Any Cloud Run service exposing a privileged internal endpoint directly to the internet unintentionally.

* [ ] Verify production Cloud Run configuration.

* [ ] Production Cloud Run service accounts cannot be used in development workflows.

* [ ] Cloud Run audit complete.
* [ ] Cloud Build audit complete.

## Tool Calling & Excessive Agency
<sub>from [`security/ai/03-tools-and-agency.md`](../security/ai/03-tools-and-agency.md)</sub>

* [ ] Cloud Run administration

## AI Integrations (email, browser, repos, cloud)
<sub>from [`security/ai/08-integrations.md`](../security/ai/08-integrations.md)</sub>

* [ ] Agent cannot expose Cloud Run publicly without approval.

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`security/ai-generated-code/04-crypto-secrets-deps.md`](../security/ai-generated-code/04-crypto-secrets-deps.md)</sub>

* [ ] Cloud Run configuration
* [ ] Cloud Build configuration
* [ ] expose a Cloud Run service
