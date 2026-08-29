# AI Data Access & Privacy

[← all checklists](../../README.md)

---

## AI + Database Access


* [ ] AI cannot bypass RLS merely because it is an agent.
* [ ] AI database tools execute as the correct user/tenant identity where possible.
* [ ] AI cannot arbitrarily query every table.
* [ ] AI cannot arbitrarily call privileged RPC functions.
* [ ] AI cannot change RLS policies.
* [ ] AI cannot create database roles.
* [ ] AI cannot expose `auth.users` data unnecessarily.
* [ ] AI cannot enumerate other users.
* [ ] AI cannot enumerate other tenants.
* [ ] AI cannot issue unauthorized Storage signed URLs.
* [ ] AI cannot enumerate protected Storage objects.
* [ ] AI cannot delete arbitrary Storage objects.
* [ ] AI-generated SQL is never trusted directly.
* [ ] SQL tool has query restrictions.
* [ ] SQL tool does not permit multiple statements where unnecessary.
* [ ] SQL tool blocks administrative statements.
* [ ] SQL tool has statement timeout.
* [ ] SQL tool has row/result limits.
* [ ] SQL tool runs with minimum privileges.
* [ ] AI-generated filters cannot bypass tenant conditions.
* [ ] AI-generated database queries undergo independent authorization.
---

## AI + API Access


* [ ] AI cannot invoke arbitrary internal APIs.
* [ ] AI cannot bypass normal API authentication.
* [ ] AI cannot forge user identity.
* [ ] AI cannot forge admin headers.
* [ ] AI cannot add privileged headers.
* [ ] AI cannot set arbitrary Host headers.
* [ ] AI cannot choose arbitrary internal URLs.
* [ ] AI cannot call internal metadata services.
* [ ] AI cannot access private services unless explicitly authorized.
* [ ] AI API calls use scoped credentials.
* [ ] AI API calls use separate service identities where appropriate.
* [ ] AI API calls have timeouts.
* [ ] AI API calls have rate limits.
* [ ] AI API calls have response-size limits.
* [ ] AI API calls validate redirects.
* [ ] AI API calls validate returned content.
---

## AI + SSRF


Agents dramatically increase SSRF risk if they can browse/fetch URLs.

* [ ] Identify every AI URL-fetching tool.
* [ ] Allowlist permitted protocols.
* [ ] Restrict protocols to HTTPS where practical.
* [ ] Block localhost.
* [ ] Block `127.0.0.0/8`.
* [ ] Block IPv6 loopback.
* [ ] Block RFC1918 private ranges.
* [ ] Block link-local ranges.
* [ ] Block cloud metadata endpoints.
* [ ] Block internal DNS names.
* [ ] Block Unix sockets where applicable.
* [ ] Validate after DNS resolution.
* [ ] Revalidate every redirect.
* [ ] Prevent DNS rebinding.
* [ ] Limit ports.
* [ ] Limit response size.
* [ ] Limit redirects.
* [ ] Limit request time.
* [ ] Prevent attacker-controlled URL schemes.
* [ ] Test decimal IPs.
* [ ] Test hexadecimal IPs.
* [ ] Test IPv6 representations.
* [ ] Test encoded hostnames.
* [ ] Test userinfo URLs.
* [ ] Test redirects through public → private networks.
---

## Sensitive Data & Privacy


* [ ] Inventory data sent to AI providers.
* [ ] Classify PII.
* [ ] Classify credentials.
* [ ] Classify financial data.
* [ ] Classify health data where applicable.
* [ ] Classify customer confidential information.
* [ ] Classify source code.
* [ ] Classify security secrets.
* [ ] Verify data minimization.
* [ ] Verify only necessary data enters prompts.
* [ ] Redact sensitive fields where possible.
* [ ] Verify provider retention.
* [ ] Verify provider training policy.
* [ ] Verify regional/data residency requirements.
* [ ] Verify deletion requirements.
* [ ] Verify logs do not store full prompts unnecessarily.
* [ ] Verify traces do not contain secrets.
* [ ] Verify observability platforms do not receive sensitive prompts.
* [ ] Verify evaluation datasets are sanitized.
* [ ] Verify test environments do not use unnecessary production data.
