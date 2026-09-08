# Runtime, Containers & Hosting

Written against Cloud Run, but applies to any container host — ECS, Fly.io, Render, Railway, Kubernetes, or a plain VM running Docker.

[← all checklists](../../README.md)

---

## Container Runtime & Hosting


### Public exposure

* [ ] Inventory every revision.
* [ ] Inventory every custom domain.
* [ ] Verify services that should not be public are not publicly accessible.
* [ ] Prefer `internal` where appropriate.
* [ ] Prefer `internal-and-cloud-load-balancing` when public access should pass through the intended load balancer/edge.
* [ ] Verify direct service invocation is authorized.
* [ ] Verify unauthenticated invocation is intentional.
* [ ] Verify IAM invocation permissions.
* [ ] Verify service-to-service authentication.
* [ ] Verify service accounts use least privilege.
* [ ] Verify service accounts are not shared unnecessarily.

Cloud Run supports restrictive ingress modes, including `internal` and `internal-and-cloud-load-balancing`; the latter can prevent direct internet requests to the `run.app` URL while allowing traffic through the external load balancer.

### Container

* [ ] Use a minimal base image.
* [ ] Do not run unnecessary OS packages.
* [ ] Remove package managers where practical.
* [ ] Remove shells/tools not required in production where practical.
* [ ] Run as non-root.
* [ ] Verify container UID/GID.
* [ ] Verify filesystem permissions.
* [ ] Use read-only filesystem assumptions where practical.
* [ ] Avoid writing secrets to image layers.
* [ ] Verify no `.env` files enter the build context.
* [ ] Verify no SSH keys enter the image.
* [ ] Verify no Git metadata enters the image.
* [ ] Scan container images.
* [ ] Scan OS packages.
* [ ] Scan application dependencies.
* [ ] Verify image provenance.
* [ ] Verify immutable image digests.
* [ ] Verify deployment does not rely on mutable `latest`.
* [ ] Verify base images are updated.
* [ ] Verify image signing/attestation where implemented.
* [ ] Verify startup script does not execute untrusted input.
* [ ] Verify shell expansion of environment values.
* [ ] Verify application does not expose internal metadata.

### Secrets

* [ ] Store production secrets in Secret Manager.
* [ ] Verify service account access to each secret is minimal.
* [ ] Verify secrets are not baked into container images.
* [ ] Verify secrets are not committed to Git.
* [ ] Verify secrets are not printed during startup.
* [ ] Verify secrets are not exposed through debug endpoints.
* [ ] Verify secret versions are controlled.
* [ ] Verify secret rotation process.
* [ ] Verify old secret versions are retired.
* [ ] Verify deployment permissions are separate from runtime secret access.
* [ ] Verify runtime service accounts cannot administer secrets unnecessarily.

Google recommends Secret Manager for sensitive values used by Cloud Run services and documents granting runtime identities only the required secret access.

### Runtime

* [ ] Verify concurrency settings against application safety.
* [ ] Verify timeout settings.
* [ ] Verify maximum instances/quotas.
* [ ] Verify minimum instances are appropriate for security-sensitive workloads.
* [ ] Verify CPU/memory limits.
* [ ] Verify request size limits.
* [ ] Verify background thread/process behavior.
* [ ] Verify temporary file usage.
* [ ] Verify SSRF restrictions.
* [ ] Verify metadata/service-account access is unnecessary.
* [ ] Verify egress restrictions where practical.
* [ ] Verify VPC connectivity is intentionally configured.
* [ ] Verify private service dependencies.
* [ ] Verify service-to-service identity.

### Runtime patch window

Exploiting a bug that already has a patch used to take a specialist and weeks. Agents now reach and trigger published engine bugs routinely, so the time between an upstream security release and your redeploy is the window in which that bug is exploitable against you — and it is the one part of engine security a small team can actually measure.

* [ ] Inventory every runtime that embeds a JavaScript or WebAssembly engine — Node, Deno, Bun, Electron, headless Chromium, edge runtimes — with its exact version; each one ships V8 or JavaScriptCore, and an engine bug is a bug in every process that embeds it.
* [ ] Verify every runtime major is inside its upstream support window — an end-of-life Node line receives no V8 security backports, so a bug fixed upstream stays open for you.
* [ ] Verify the runtime version is pinned in one place — `engines` in `package.json`, `.node-version` or `.nvmrc`, the base-image tag — and that production, CI and any sandbox image resolve to the same number.
* [ ] Verify base-image tags are bumped automatically — Renovate or Dependabot on the Dockerfile, not only on CI actions — so a runtime security release becomes a pull request the same day.
* [ ] Verify someone receives the runtime's security announcements (the `nodejs-sec` list, the Chromium release blog for an embedded browser) and that they land where work is tracked, not in an inbox.
* [ ] Measure the time between an upstream runtime security release and the fixed version serving production traffic, and record the number.
* [ ] Verify the running version is observable in production — a build-info endpoint, a startup log line, an image label — so "are we patched" is a query and not a guess.
* [ ] Verify a runtime-only rebuild and deploy can happen with no application code change, and has been done at least once.
* [ ] Inventory native addons and bundled binaries in the image — `node-gyp` builds, `sharp`/libvips, FFmpeg, ImageMagick, headless Chromium — with their versions, and verify they move on the same cadence; they are C and C++ parsing attacker-supplied bytes and are invisible to `npm audit` until their wrapper package bumps.

### IAM

* [ ] Review project IAM.
* [ ] Review service IAM.
* [ ] Review deployment IAM.
* [ ] Review service-account IAM.
* [ ] Identify Owner/Editor assignments.
* [ ] Identify user-managed keys.
* [ ] Remove unnecessary service-account keys.
* [ ] Verify impersonation permissions.
* [ ] Verify CI deployer cannot administer unrelated projects.
* [ ] Verify runtime service account cannot deploy code.
* [ ] Verify deployment account cannot read production application secrets unless necessary.
* [ ] Verify production and staging projects are separated.
---

## Container Image & Build Security


* [ ] Pin base images.
* [ ] Prefer immutable image digests.
* [ ] Verify trusted base-image sources.
* [ ] Scan image vulnerabilities.
* [ ] Scan dependencies.
* [ ] Review all `RUN` instructions.
* [ ] Review shell interpolation.
* [ ] Verify secrets are not passed as build args.
* [ ] Verify BuildKit secret handling where needed.
* [ ] Verify build context contains no secrets.
* [ ] Verify multi-stage builds do not accidentally copy secrets.
* [ ] Verify generated artifacts do not contain secrets.
* [ ] Verify source maps are intentional.
* [ ] Verify production image differs appropriately from development image.
* [ ] Verify debug tools are absent.
* [ ] Verify image history does not contain secrets.
* [ ] Verify build process is reproducible or sufficiently controlled.
* [ ] Verify dependency downloads are from trusted registries.
* [ ] Verify package integrity.
* [ ] Verify registry permissions.
* [ ] Verify registry deletion/overwrite permissions.
* [ ] Verify production deploy references immutable artifacts.
