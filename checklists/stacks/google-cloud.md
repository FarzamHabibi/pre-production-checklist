# Google Cloud (Cloud Run, Cloud Build, IAM)

Items from the core checklists that are specific to **Google Cloud (Cloud Run, Cloud Build, IAM)**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

### SSRF / Egress / Network Controls
<sub>from [`core/09-common-web-attacks.md`](../core/09-common-web-attacks.md)</sub>

* [ ] Verify workload identity permissions if outbound cloud APIs are used.

### Information Disclosure
<sub>from [`core/09-common-web-attacks.md`](../core/09-common-web-attacks.md)</sub>

* [ ] Search Cloud Run logs.
* [ ] Search Cloud Build logs.

### Container Runtime & Hosting
<sub>from [`core/13-runtime-and-containers.md`](../core/13-runtime-and-containers.md)</sub>

* [ ] Inventory every Cloud Run service.
* [ ] Inventory every default `run.app` URL.
* [ ] Review Cloud Run ingress configuration.
* [ ] Verify direct access to `run.app` cannot bypass Cloudflare/WAF/load balancer controls.

### DNS, CDN, Edge & WAF
<sub>from [`core/14-edge-dns-waf.md`](../core/14-edge-dns-waf.md)</sub>

* [ ] Verify Cloud Run `run.app` endpoint is controlled.

### CI/CD Pipeline Security
<sub>from [`core/15-ci-cd-and-supply-chain.md`](../core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Prefer workload identity federation/OIDC over long-lived cloud credentials.

### Build Service Security
<sub>from [`core/15-ci-cd-and-supply-chain.md`](../core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Review Cloud Build service account permissions.
* [ ] Verify artifact registry permissions.

### Monitoring / Detection
<sub>from [`core/16-monitoring-and-response.md`](../core/16-monitoring-and-response.md)</sub>

* [ ] Monitor Cloud Run deployments.

### Incident Response
<sub>from [`core/16-monitoring-and-response.md`](../core/16-monitoring-and-response.md)</sub>

* [ ] Document emergency Cloud Run rollback.

### Findings That Should Block Release
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Any Cloud Run service exposing a privileged internal endpoint directly to the internet unintentionally.

### Production Configuration Review
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Verify production Cloud Run configuration.

### Development / Staging Isolation
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Production Cloud Run service accounts cannot be used in development workflows.

### Final Security Sign-Off
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Cloud Run audit complete.
* [ ] Cloud Build audit complete.

### Dangerous Tools
<sub>from [`ai/03-tools-and-agency.md`](../ai/03-tools-and-agency.md)</sub>

* [ ] Cloud Run administration

### AI + Cloud / Production Operations
<sub>from [`ai/08-integrations.md`](../ai/08-integrations.md)</sub>

* [ ] Agent cannot expose Cloud Run publicly without approval.

### Configuration Bugs
<sub>from [`vibe-coding/04-crypto-secrets-deps.md`](../vibe-coding/04-crypto-secrets-deps.md)</sub>

* [ ] Cloud Run configuration
* [ ] Cloud Build configuration
* [ ] expose a Cloud Run service
