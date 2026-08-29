# Pre-Release Gates

**Start here if you are short on time.** The 'Must Not Exist' search and the blocking-findings list give you the most signal per minute in this entire repository.

[← all checklists](../../README.md)

---

## Findings That Should Block Release


* [ ] Any unauthenticated access to sensitive data.
* [ ] Any cross-user data access.
* [ ] Any cross-tenant data access.
* [ ] Any privilege escalation.
* [ ] Any production database credential in source/build artifacts.
* [ ] Any ability to bypass RLS through ordinary client access.
* [ ] Any exposed private storage object without intentional public access.
* [ ] Any unauthenticated privileged API.
* [ ] Any SSRF to cloud/internal infrastructure.
* [ ] Any unauthenticated feature that fetches a URL on the caller's behalf — an open proxy.
* [ ] Any way to send email, SMS or push to a recipient chosen by the request body.
* [ ] Any paid third-party action reachable without a per-user quota.
* [ ] Any arbitrary command execution.
* [ ] Any arbitrary file read/write with sensitive impact.
* [ ] Any account-takeover path.
* [ ] Any production GitHub workflow that lets untrusted PR code obtain production credentials.
* [ ] Any CI workflow that permits arbitrary branch/PR input to become privileged shell execution.
* [ ] Any Apple app private signing credential leaked.
* [ ] Any production deployment path that can be modified without appropriate review/approval.
* [ ] Any origin bypass that defeats the intended security controls.
---

## High-Risk “Must Not Exist” Search


Search the complete repository, Git history, container images, built frontend, mobile binaries, CI logs, and deployed configuration for:

* [ ] database password
* [ ] database connection string with credentials
* [ ] JWT signing secret
* [ ] Google service-account private key
* [ ] GitHub PAT
* [ ] GitHub runner token
* [ ] Apple private signing key
* [ ] OAuth client secret
* [ ] webhook signing secret
* [ ] encryption key
* [ ] private certificate key
* [ ] SSH private key
* [ ] production `.env`
* [ ] `.npmrc` credentials
* [ ] package-manager authentication tokens
* [ ] hard-coded admin passwords
* [ ] test credentials that work against production
* [ ] debugging backdoors
* [ ] hidden master/admin parameters
* [ ] undocumented administrative endpoints
---

## Production Configuration Review


* [ ] Review production environment variables.
* [ ] Review staging environment variables.
* [ ] Compare production vs staging security configuration.
* [ ] Verify no development debug flags.
* [ ] Verify no test accounts with production privileges.
* [ ] Verify no default passwords.
* [ ] Verify no development endpoints.
* [ ] Verify no localhost fallback.
* [ ] Verify production logging is safe.
* [ ] Verify production CORS.
* [ ] Verify production CSP.
* [ ] Verify production cookies.
* [ ] Verify production TLS.
* [ ] Verify production DNS.
* [ ] Verify production IAM.
* [ ] Verify production bucket settings.
* [ ] Verify production OAuth redirect URIs.
* [ ] Verify production Apple configuration.
* [ ] Verify production app bundle identifiers.
---

## Development / Staging Isolation


* [ ] Production credentials cannot be used from development.
* [ ] Development credentials cannot access production.
* [ ] Staging users cannot access production.
* [ ] Staging APIs do not share sensitive secrets with production.
* [ ] Staging DNS cannot overwrite production DNS.
* [ ] Staging CI cannot deploy to production.
* [ ] Production GitHub environments require correct branch/tag.
* [ ] Development databases cannot contain unnecessary production PII.
* [ ] Production data copied to staging is sanitized.
* [ ] Developer local machines do not receive production credentials unnecessarily.
---

## Security Testing Automation


* [ ] Run SAST.
* [ ] Run SCA.
* [ ] Run secret scanning.
* [ ] Run IaC scanning.
* [ ] Run container scanning.
* [ ] Run DAST.
* [ ] Run API fuzzing.
* [ ] Run authorization regression tests.
* [ ] Run RLS regression tests.
* [ ] Run storage authorization tests.
* [ ] Run SSRF regression tests.
* [ ] Run XSS regression tests.
* [ ] Run CSRF regression tests.
* [ ] Run dependency update checks.
* [ ] Run mobile static analysis.
* [ ] Run binary security checks.
* [ ] Run code-signing verification.
* [ ] Run infrastructure drift detection.
---

## Manual Penetration-Test Scenarios


### Authentication

* [ ] Account enumeration.
* [ ] Credential stuffing.
* [ ] Password reset takeover.
* [ ] Email change takeover.
* [ ] MFA enrollment takeover.
* [ ] MFA removal bypass.
* [ ] Session fixation.
* [ ] Session replay.
* [ ] JWT tampering.
* [ ] Token substitution.
* [ ] OAuth account-linking takeover.

### Authorization

* [ ] Horizontal privilege escalation.
* [ ] Vertical privilege escalation.
* [ ] Cross-tenant access.
* [ ] BOLA/IDOR.
* [ ] Mass assignment.
* [ ] Hidden admin endpoint access.
* [ ] Property-level authorization bypass.
* [ ] Function-level authorization bypass.

### Input

* [ ] SQL injection.
* [ ] NoSQL/JSON injection if applicable.
* [ ] Command injection.
* [ ] Template injection.
* [ ] XSS.
* [ ] SSRF.
* [ ] XXE if applicable.
* [ ] Path traversal.
* [ ] Header injection.
* [ ] Host-header attacks.
* [ ] CRLF injection.
* [ ] ReDoS.
* [ ] Prototype pollution.
* [ ] Deserialization abuse.

### Resource exhaustion

* [ ] Huge JSON.
* [ ] Deep JSON nesting.
* [ ] Huge arrays.
* [ ] Huge strings.
* [ ] Huge multipart uploads.
* [ ] Archive bombs.
* [ ] Expensive search.
* [ ] Expensive regex.
* [ ] Excessive pagination.
* [ ] Concurrent expensive requests.
* [ ] Webhook flooding.
* [ ] Account creation flooding.
* [ ] OTP flooding.
---

## Final Security Sign-Off


* [ ] Threat model reviewed.
* [ ] Asset inventory complete.
* [ ] Endpoint inventory complete.
* [ ] Authorization matrix complete.
* [ ] Secrets audit complete.
* [ ] Dependency/supply-chain audit complete.
* [ ] DAST completed.
* [ ] API authorization testing completed.
* [ ] Mobile security testing completed.
* [ ] Production configuration reviewed.
* [ ] Incident-response test completed.
* [ ] All critical findings remediated.
* [ ] All high findings remediated or formally accepted.
* [ ] Regression tests added for every security finding.
* [ ] Security evidence archived.
* [ ] Final security reviewer approval recorded.
---

## Recommended Audit Evidence


For each checked section, retain:

* configuration screenshots/export
* relevant source-code references
* test requests/responses
* database policy definitions
* RLS policy tests
* storage policy tests
* JWT/authentication test results
* API authorization test matrix
* dependency scan results
* container scan results
* CI/CD workflow review
* GitHub permissions review
* Cloud Run/IAM review
* Cloudflare DNS/WAF/TLS review
* iOS/macOS entitlement and signing review
* penetration-test findings
* remediation evidence
