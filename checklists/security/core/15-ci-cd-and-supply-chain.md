# CI/CD & Supply Chain

Your pipeline has production credentials. Treat it as production.

[← all checklists](../../README.md)

---

## Source Repository Security


* [ ] Enable MFA for maintainers.
* [ ] Use strong organization/repository access controls.
* [ ] Review repository collaborators.
* [ ] Review organization members.
* [ ] Review outside collaborators.
* [ ] Review deploy keys.
* [ ] Review personal access tokens used for CI.
* [ ] Review GitHub Apps.
* [ ] Review OAuth applications.
* [ ] Review repository webhooks.
* [ ] Protect production branches.
* [ ] Require pull requests.
* [ ] Require code review.
* [ ] Protect workflow files.
* [ ] Protect deployment configuration.
* [ ] Protect infrastructure files.
* [ ] Protect secrets/configuration directories.
* [ ] Prevent force-pushes on critical branches.
* [ ] Prevent branch deletion.
* [ ] Require status checks.
* [ ] Require signed commits where appropriate.
* [ ] Review repository visibility.
* [ ] Review forks.
* [ ] Review private/internal repository settings.
* [ ] Review archived repositories and their credentials.
* [ ] Search Git history for secrets.
* [ ] Search deleted branches for secrets.
* [ ] Search PR history for secrets.
* [ ] Search issues/discussions for secrets.
* [ ] Search release artifacts for secrets.
---

## CI/CD Pipeline Security


### Workflow permissions

* [ ] Set explicit workflow/job `permissions`.
* [ ] Default to minimal permissions.
* [ ] Use `contents: read` where sufficient.
* [ ] Grant write permissions only to the specific job that needs them.
* [ ] Review `pull-requests: write`.
* [ ] Review `issues: write`.
* [ ] Review `packages: write`.
* [ ] Review `deployments: write`.
* [ ] Review `id-token: write`.
* [ ] Verify privileged permissions are unavailable to untrusted PR workflows.

### PR security

* [ ] Verify untrusted PR code is not executed in privileged workflow contexts.
* [ ] Verify fork PRs cannot access production secrets.
* [ ] Verify fork PRs cannot mutate deployment environments.
* [ ] Verify fork PRs cannot obtain cloud OIDC credentials.
* [ ] Verify branch-name/title/PR-body/comment content cannot become shell commands.
* [ ] Verify labels/comments from untrusted users cannot trigger privileged deployments.
* [ ] Verify issue titles/bodies cannot become shell injection.
* [ ] Verify commit messages cannot become shell injection.
* [ ] Verify tag names cannot become shell injection.
* [ ] Verify branch names cannot become shell injection.

GitHub specifically warns that attacker-controlled GitHub context values can become executable input when inserted into workflow commands.

### Action dependencies

* [ ] Pin third-party actions to immutable commit SHAs where appropriate.
* [ ] Do not blindly use floating major/minor tags for security-sensitive actions.
* [ ] Review every action's source repository.
* [ ] Review action maintainers.
* [ ] Review action release history.
* [ ] Review actions that execute shell commands.
* [ ] Review composite actions.
* [ ] Review local actions.
* [ ] Review reusable workflows.
* [ ] Review transitive action dependencies.
* [ ] Review security advisories for actions.
* [ ] Remove unused actions.

GitHub recommends hardening Actions usage, keeping actions updated, and using OIDC for cloud access when supported.

### Secrets

* [ ] Inventory repository secrets.
* [ ] Inventory environment secrets.
* [ ] Inventory organization secrets.
* [ ] Verify production secrets are environment-scoped.
* [ ] Verify secrets are not available to forks.
* [ ] Verify secrets are not printed.
* [ ] Verify `set -x` is not enabled around secret operations.
* [ ] Verify secrets are not placed in command-line arguments unnecessarily.
* [ ] Verify secrets are not written to artifacts.
* [ ] Verify secrets are not included in caches.
* [ ] Verify secrets are not passed to untrusted build steps.
* [ ] Rotate exposed secrets.
* [ ] Remove obsolete secrets.

### OIDC / cloud identity

* [ ] Restrict OIDC trust by repository.
* [ ] Restrict OIDC trust by branch/tag/environment.
* [ ] Restrict OIDC audience.
* [ ] Restrict deployment environment.
* [ ] Verify pull requests cannot satisfy production trust conditions.
* [ ] Verify branch rename/transfer behavior.
* [ ] Verify immutable subject claims where supported.
* [ ] Verify GitHub environment protection rules.
* [ ] Verify production deployment requires intended approvals.

GitHub documents OIDC subject/audience claims and recommends conditions so untrusted repositories cannot obtain cloud credentials.

### Runners

* [ ] Prefer GitHub-hosted runners for untrusted workloads where practical.
* [ ] Review self-hosted runners.
* [ ] Verify self-hosted runners are isolated.
* [ ] Verify runners are ephemeral where possible.
* [ ] Verify runners do not contain production credentials permanently.
* [ ] Verify one repository cannot compromise another through shared runner state.
* [ ] Verify workspace cleanup.
* [ ] Verify privileged containers.
* [ ] Verify runner network access.
* [ ] Verify runner OS patching.
* [ ] Verify runner agent updates.
* [ ] Verify runner registration tokens.
* [ ] Verify runners cannot access unrelated internal networks.

### Artifacts / caches

* [ ] Review artifact upload permissions.
* [ ] Review who can download artifacts.
* [ ] Verify artifacts do not contain secrets.
* [ ] Verify build outputs cannot be substituted by untrusted PRs.
* [ ] Verify artifact retention.
* [ ] Verify cache keys are not attacker-controlled in a way that allows poisoning.
* [ ] Verify cache restore paths.
* [ ] Verify dependency caches cannot execute attacker-controlled binaries.
* [ ] Verify production deployment uses trusted artifacts.

### Deployment

* [ ] Separate build and deploy jobs.
* [ ] Separate staging and production credentials.
* [ ] Require production environment protection.
* [ ] Require manual approval where appropriate.
* [ ] Verify deployment branch restrictions.
* [ ] Verify tag restrictions.
* [ ] Verify rollback mechanism.
* [ ] Verify rollback artifacts are trusted.
* [ ] Verify deployments are auditable.
* [ ] Verify deployment actor identity is logged.
* [ ] Verify failed deployments do not leave partially privileged infrastructure changes.
---

## Build Service Security


* [ ] Inventory all build triggers.
* [ ] Inventory who can modify build configurations.
* [ ] Inventory who can trigger builds.
* [ ] Inventory who can approve production deployments.
* [ ] Remove unnecessary project-level permissions.
* [ ] Verify build service accounts cannot access unrelated secrets.
* [ ] Verify builds cannot arbitrarily deploy to unrelated environments.
* [ ] Verify untrusted pull requests cannot obtain production credentials.
* [ ] Verify branch/tag conditions.
* [ ] Verify trigger source restrictions.
* [ ] Verify substitution variables cannot inject shell commands.
* [ ] Verify attacker-controlled repository content cannot alter deployment targets.
* [ ] Verify build steps do not interpolate untrusted input into shell code.
* [ ] Verify logs do not expose secrets.
* [ ] Verify build artifacts are protected.
* [ ] Verify provenance/attestation where required.
* [ ] Verify build workers/network access.
* [ ] Verify private pools where isolation requirements justify them.
* [ ] Verify build cache cannot be poisoned across trust boundaries.
* [ ] Verify reusable build definitions are versioned/reviewed.
* [ ] Verify production deployment requires the intended approval gates.
* [ ] Verify emergency deployment paths are audited.
---

## Dependency / Supply Chain Security


* [ ] Run SCA against application dependencies.
* [ ] Run container vulnerability scanning.
* [ ] Run IaC scanning.
* [ ] Run secret scanning.
* [ ] Run GitHub code scanning.
* [ ] Review npm dependency lifecycle.
* [ ] Review package maintainers.
* [ ] Review typosquatting risk.
* [ ] Review dependency confusion risk.
* [ ] Use private package scopes appropriately.
* [ ] Verify package registries.
* [ ] Verify lockfiles.
* [ ] Verify package integrity.
* [ ] Verify postinstall scripts.
* [ ] Verify native modules.
* [ ] Verify release artifacts.
* [ ] Verify build provenance.
* [ ] Verify production artifacts map to reviewed commits.
* [ ] Verify developers cannot silently substitute dependencies during CI.
