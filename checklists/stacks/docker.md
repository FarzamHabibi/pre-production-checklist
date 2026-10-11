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
* [ ] Verify every published port in `docker run -p` or compose `ports:` is bound to a specific interface (`127.0.0.1:5432:5432`) unless it must be public — Docker writes its own iptables rules, so a host firewall such as ufw does not block a port bound to 0.0.0.0.
* [ ] Verify containers run with `no-new-privileges`, without `seccomp=unconfined`, and with a `pids` limit — these runtime flags keep a compromised process from escalating or fork-bombing the host.
* [ ] Verify the Dockerfile uses `COPY` rather than `ADD` for local files, never `ADD <url>`, and removes setuid and setgid bits from the final image — `ADD` fetches remote content and auto-extracts archives.

## CI/CD & Supply Chain
<sub>from [`security/core/15-ci-cd-and-supply-chain.md`](../security/core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Protect Dockerfiles.

* [ ] Verify Docker socket exposure.
* [ ] Verify the Docker daemon is not listening on `tcp://` (2375/2376) without mutual TLS and that `daemon.json` lists no `insecure-registries` — an open daemon socket is root on the host.

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

Review every AI-generated:

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
