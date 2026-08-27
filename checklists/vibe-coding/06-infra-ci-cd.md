# AI-Generated Infrastructure & Pipeline Bugs

[← all checklists](../README.md)

---

## Container Bugs


* [ ] Verify generated image is minimal.
* [ ] Verify generated image does not run as root.
* [ ] Verify base image source.
* [ ] Verify base image version.
* [ ] Verify package installation.
* [ ] Verify shell commands.
* [ ] Verify curl-pipe-shell patterns.
* [ ] Verify remote installation scripts.
* [ ] Verify production image excludes development tooling.
* [ ] Verify container user.
* [ ] Verify file permissions.
* [ ] Verify entrypoint.
* [ ] Verify startup shell expansion.
* [ ] Verify health checks cannot execute attacker input.
---

## CI/CD Pipeline Bugs


Every AI-generated workflow is a security-sensitive change.

* [ ] Review all `run:` commands.
* [ ] Review all `${{ }}` expressions.
* [ ] Review GitHub context variables.
* [ ] Review branch names.
* [ ] Review tag names.
* [ ] Review PR titles.
* [ ] Review issue content.
* [ ] Review commit messages.
* [ ] Review workflow inputs.
* [ ] Review matrix values.
* [ ] Review environment variables.
* [ ] Review secrets.
* [ ] Review action permissions.
* [ ] Review reusable workflows.
* [ ] Review third-party actions.
* [ ] Review action pinning.
* [ ] Review artifacts.
* [ ] Review caches.
* [ ] Review OIDC.
* [ ] Review deployment environments.

Specific tests:

* [ ] Attempt shell injection through branch name.
* [ ] Attempt shell injection through PR title.
* [ ] Attempt shell injection through issue content.
* [ ] Attempt shell injection through workflow input.
* [ ] Attempt malicious matrix values.
* [ ] Attempt artifact poisoning.
* [ ] Attempt cache poisoning.
* [ ] Attempt fork PR secret access.
* [ ] Attempt fork PR deployment.
* [ ] Attempt privilege escalation through workflow modification.
---

## Cloud IAM Bugs


* [ ] Review every generated IAM policy.
* [ ] Search for wildcard permissions.
* [ ] Search for `roles/owner`.
* [ ] Search for `roles/editor`.
* [ ] Search for broad service-account permissions.
* [ ] Search for unrestricted impersonation.
* [ ] Search for unrestricted secret access.
* [ ] Search for unrestricted storage access.
* [ ] Search for unrestricted deployment access.
* [ ] Search for unrestricted DNS access.
* [ ] Verify runtime and deployment identities are separated.
* [ ] Verify production and development identities are separated.
* [ ] Verify AI-generated changes cannot grant the AI itself additional privileges.
---

## Edge / CDN Bugs


* [ ] Review generated DNS changes.
* [ ] Review generated WAF rules.
* [ ] Review generated firewall rules.
* [ ] Review generated Workers.
* [ ] Review generated redirects.
* [ ] Review generated Transform Rules.
* [ ] Review generated Access policies.
* [ ] Review generated API tokens.
* [ ] Verify no wildcard allow rules.
* [ ] Verify no accidental origin exposure.
* [ ] Verify no accidental public DNS records.
* [ ] Verify no bypass of authentication.
* [ ] Verify no WAF bypass rule is overly broad.
* [ ] Verify no caching of sensitive responses.
* [ ] Verify no redirect to attacker-controlled destination.
