# Docker / containers

Items from the core checklists that are specific to **Docker / containers**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

### Secrets Management
<sub>from [`core/08-secrets-and-crypto.md`](../core/08-secrets-and-crypto.md)</sub>

* [ ] Verify secrets are never stored in Docker images.

### Container Runtime & Hosting
<sub>from [`core/13-runtime-and-containers.md`](../core/13-runtime-and-containers.md)</sub>

* [ ] Verify `.dockerignore`.

### Container Image & Build Security
<sub>from [`core/13-runtime-and-containers.md`](../core/13-runtime-and-containers.md)</sub>

* [ ] Scan Dockerfile.

### Source Repository Security
<sub>from [`core/15-ci-cd-and-supply-chain.md`](../core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Protect Dockerfiles.

### CI/CD Pipeline Security
<sub>from [`core/15-ci-cd-and-supply-chain.md`](../core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Verify Docker socket exposure.

### High-Risk “Must Not Exist” Search
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Docker registry credentials

### Final Security Sign-Off
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Docker audit complete.

### Generated-Code Execution
<sub>from [`ai/05-output-handling.md`](../ai/05-output-handling.md)</sub>

* [ ] Prevent access to Docker socket.

### AI + Software Engineering Agents
<sub>from [`ai/08-integrations.md`](../ai/08-integrations.md)</sub>

* [ ] Generated Dockerfiles receive security review.

### Configuration Bugs
<sub>from [`vibe-coding/04-crypto-secrets-deps.md`](../vibe-coding/04-crypto-secrets-deps.md)</sub>

* [ ] Dockerfile
* [ ] docker-compose

### Container Bugs
<sub>from [`vibe-coding/06-infra-ci-cd.md`](../vibe-coding/06-infra-ci-cd.md)</sub>

* [ ] Verify generated Dockerfile does not copy `.env`.
* [ ] Verify generated Dockerfile does not copy SSH keys.
* [ ] Verify generated Dockerfile does not copy GitHub credentials.
* [ ] Verify generated Dockerfile does not embed secrets in `ARG`.
* [ ] Verify generated Dockerfile does not use untrusted remote scripts.

### PR Security Checklist
<sub>from [`vibe-coding/08-prompts-and-pr-review.md`](../vibe-coding/08-prompts-and-pr-review.md)</sub>

* [ ] Identify Docker changes.
