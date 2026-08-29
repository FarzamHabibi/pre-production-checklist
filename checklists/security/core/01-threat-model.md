# Architecture & Threat Model

Do this first. Everything downstream depends on knowing what you actually run.

[← all checklists](../../README.md)

---

## Architecture / Threat Model


* [ ] Identify every public hostname, subdomain, API, mobile app, web application, background worker, webhook, cron job, queue, storage bucket, database, third-party integration, and CI/CD deployment target.
* [ ] Identify every trust boundary.
* [ ] Identify every internet-facing component.
* [ ] Identify every component that accepts attacker-controlled input.
* [ ] Identify every component holding credentials, signing keys, refresh tokens, service-role credentials, certificates, or deployment credentials.
* [ ] Identify all privileged identities.
* [ ] Identify all administrative interfaces.
* [ ] Identify all machine-to-machine identities.
* [ ] Identify all tenant boundaries.
* [ ] Identify all user roles.
* [ ] Identify all organization/project/team/resource ownership relationships.
* [ ] Identify all cross-tenant data access paths.
* [ ] Identify all asynchronous flows where authorization is separated from execution.
* [ ] Identify all file-processing paths.
* [ ] Identify all URL-fetching features.
* [ ] Identify all outbound HTTP integrations.
* [ ] Identify all webhook receivers.
* [ ] Identify all OAuth/SSO integrations.
* [ ] Identify all password-reset/account-recovery flows.
* [ ] Identify all billing/payment/credit/resource-consumption flows.
* [ ] Identify security assumptions that are not enforced by code or infrastructure.
* [ ] Identify components whose compromise would allow lateral movement.
* [ ] Define the blast radius of compromise for each major credential.
* [ ] Define which controls must exist simultaneously at application, database, infrastructure, and edge layers.
* [ ] Verify security requirements exist for confidentiality, integrity, availability, authentication, authorization, accountability, and privacy.
