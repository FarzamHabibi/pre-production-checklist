# AI Integrations (email, browser, repos, cloud)

Where an agent touches a system that can act on the outside world.

[← all checklists](../README.md)

---

## AI + Email


If the agent can read/send email:

* [ ] Verify mailbox authorization.
* [ ] Verify sender authorization.
* [ ] Verify recipient authorization.
* [ ] Verify attachment authorization.
* [ ] Verify external-recipient warning.
* [ ] Verify prompt injection in inbound email.
* [ ] Verify malicious HTML email handling.
* [ ] Verify tracking pixels/URLs.
* [ ] Verify attachments are scanned.
* [ ] Verify agent cannot leak confidential data.
* [ ] Verify agent cannot send arbitrary mail.
* [ ] Verify mass-mail limits.
* [ ] Verify approval for sensitive external emails.
* [ ] Verify reply-to/header manipulation.
* [ ] Verify recipient confusion attacks.
* [ ] Verify forwarding restrictions.
* [ ] Verify BCC handling.
* [ ] Verify generated URLs are safe.
* [ ] Verify email content cannot authorize privileged actions.
---

## AI + Browser Automation


* [ ] Browser runs in isolated environment.
* [ ] Browser has minimum credentials.
* [ ] Browser cannot access internal admin systems unnecessarily.
* [ ] Browser cannot access cloud metadata.
* [ ] Browser cannot access localhost/internal networks unless required.
* [ ] Verify navigation allowlist.
* [ ] Verify download restrictions.
* [ ] Verify file-upload restrictions.
* [ ] Verify clipboard handling.
* [ ] Verify cookies.
* [ ] Verify session isolation.
* [ ] Verify browser profiles are isolated per user/task.
* [ ] Verify prompt injection from websites.
* [ ] Verify malicious page content cannot control high-risk actions.
* [ ] Verify payment actions require confirmation.
* [ ] Verify destructive actions require confirmation.
* [ ] Verify browser cannot automatically approve security prompts.
* [ ] Verify CAPTCHA/security challenges are handled appropriately.
---

## AI + Software Engineering Agents


For coding agents:

* [ ] Agent repository access is least privilege.
* [ ] Agent cannot read unrelated private repositories.
* [ ] Agent cannot modify repository settings.
* [ ] Agent cannot create production secrets.
* [ ] Agent cannot read production secrets.
* [ ] Agent cannot approve its own pull request.
* [ ] Agent cannot merge its own privileged changes.
* [ ] Agent cannot bypass required reviews.
* [ ] Agent cannot modify deployment environments.
* [ ] Agent cannot modify production infrastructure without approval.
* [ ] Generated CI workflows receive security review.
* [ ] Generated Terraform/IaC receives security review.
* [ ] Generated shell commands are constrained.
* [ ] Generated dependencies are reviewed.
* [ ] Agent cannot execute arbitrary PR code with privileged credentials.
* [ ] Agent cannot use secrets while processing untrusted forks.
* [ ] Agent cannot modify its own instructions/policies.
* [ ] Agent actions are logged.
* [ ] Agent commits identify agent authorship where appropriate.
---

## AI + Cloud / Production Operations


For agents capable of infrastructure operations:

* [ ] Production and non-production credentials are separated.
* [ ] Agent cannot obtain Owner/Editor privileges.
* [ ] Agent uses scoped service accounts.
* [ ] Agent cannot change IAM arbitrarily.
* [ ] Agent cannot create new privileged identities.
* [ ] Agent cannot read arbitrary secrets.
* [ ] Agent cannot modify DNS arbitrarily.
* [ ] Agent cannot disable WAF.
* [ ] Agent cannot disable logging.
* [ ] Agent cannot disable monitoring.
* [ ] Agent cannot delete audit logs.
* [ ] Agent cannot disable security controls.
* [ ] Agent cannot deploy arbitrary containers to production.
* [ ] Agent cannot deploy untrusted artifacts.
* [ ] Agent cannot change production environment variables without approval.
* [ ] Agent cannot rotate/revoke security credentials autonomously without an explicit runbook.
* [ ] Agent cannot destroy production infrastructure autonomously.
* [ ] High-risk operations require human approval.
