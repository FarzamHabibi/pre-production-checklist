# Docker / containers

Items from the core checklists that are specific to **Docker / containers**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Secrets Management & Cryptography
<sub>from [`security/core/08-secrets-and-crypto.md`](../security/core/08-secrets-and-crypto.md)</sub>

* [ ] Verify secrets are never stored in Docker images.

## Runtime, Containers & Hosting
<sub>from [`security/core/13-runtime-and-containers.md`](../security/core/13-runtime-and-containers.md)</sub>

* [ ] Verify `.dockerignore`.

* [ ] Scan Dockerfile.

## CI/CD & Supply Chain
<sub>from [`security/core/15-ci-cd-and-supply-chain.md`](../security/core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Protect Dockerfiles.

* [ ] Verify Docker socket exposure.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Docker registry credentials

* [ ] Docker audit complete.

## AI Output Handling
<sub>from [`security/ai/05-output-handling.md`](../security/ai/05-output-handling.md)</sub>

* [ ] Prevent access to Docker socket.

## AI Integrations (email, browser, repos, cloud)
<sub>from [`security/ai/08-integrations.md`](../security/ai/08-integrations.md)</sub>

* [ ] Generated Dockerfiles receive security review.

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`security/ai-generated-code/04-crypto-secrets-deps.md`](../security/ai-generated-code/04-crypto-secrets-deps.md)</sub>

* [ ] Dockerfile
* [ ] docker-compose

## AI-Generated Infrastructure & Pipeline Bugs
<sub>from [`security/ai-generated-code/06-infra-ci-cd.md`](../security/ai-generated-code/06-infra-ci-cd.md)</sub>

* [ ] Verify generated Dockerfile does not copy `.env`.
* [ ] Verify generated Dockerfile does not copy SSH keys.
* [ ] Verify generated Dockerfile does not copy GitHub credentials.
* [ ] Verify generated Dockerfile does not embed secrets in `ARG`.
* [ ] Verify generated Dockerfile does not use untrusted remote scripts.

## Agent Prompts & PR Review
<sub>from [`security/ai-generated-code/08-prompts-and-pr-review.md`](../security/ai-generated-code/08-prompts-and-pr-review.md)</sub>

* [ ] Identify Docker changes.
