# Backend Application & API

Written originally against a NestJS app, but the controls are framework-independent — they apply equally to Django, FastAPI, Rails, Laravel, Express, Spring, or Go.

[← all checklists](../../README.md)

---

## Backend Application Security


### Bootstrap / HTTP stack

* [ ] Verify security middleware is registered before routes.
* [ ] Verify Helmet/security headers are actually applied to every relevant route.
* [ ] Verify CORS is explicitly configured rather than broadly enabled.
* [ ] Verify CORS does not use wildcard origins with credentials.
* [ ] Verify allowed origins are exact and environment-specific.
* [ ] Verify allowed HTTP methods are restricted.
* [ ] Verify allowed headers are restricted.
* [ ] Verify exposed headers do not reveal unnecessary sensitive information.
* [ ] Verify preflight behavior cannot be abused.
* [ ] Verify HTTP methods not used by the application are rejected.
* [ ] Verify TRACE is disabled where unnecessary.
* [ ] Verify request size limits exist.
* [ ] Verify JSON body size limits exist.
* [ ] Verify multipart upload limits exist.
* [ ] Verify URL/query length limits exist where appropriate.
* [ ] Verify compression cannot be abused for resource exhaustion.
* [ ] Verify timeout limits exist.
* [ ] Verify keep-alive behavior is appropriate.
* [ ] Verify large headers/cookies cannot consume excessive resources.
* [ ] Verify malformed requests produce safe failures.

NestJS recommends Helmet for security-related HTTP headers, and its placement matters because middleware ordering affects which routes receive the protection.

### Validation / parsing

* [ ] Verify `ValidationPipe` is configured deliberately.
* [ ] Verify unexpected properties are rejected or stripped.
* [ ] Verify primitive coercion cannot produce surprising authorization behavior.
* [ ] Verify nested DTOs are validated recursively.
* [ ] Verify arrays have maximum length.
* [ ] Verify strings have maximum length.
* [ ] Verify numeric ranges are enforced.
* [ ] Verify enum values are allowlisted.
* [ ] Verify dates are validated semantically, not just syntactically.
* [ ] Verify regex validations cannot cause ReDoS.
* [ ] Verify deeply nested JSON cannot cause parser/resource exhaustion.
* [ ] Verify prototype pollution paths are blocked.
* [ ] Verify JSON object keys cannot overwrite trusted server-side fields.
* [ ] Verify mass assignment is prevented.
* [ ] Verify DTOs do not expose administrative properties.
* [ ] Verify database entities are not directly used as request DTOs.
* [ ] Verify response DTOs do not accidentally expose private fields.
* [ ] Verify serialization does not leak internal metadata.
* [ ] Verify validation errors do not expose stack traces, SQL, filesystem paths, secrets, or internal service names.

### Authentication

* [ ] Verify every protected controller/route uses explicit authentication guards.
* [ ] Verify public routes are explicitly identified.
* [ ] Verify global guards cannot be bypassed through special routes.
* [ ] Verify custom decorators cannot accidentally skip guards.
* [ ] Verify metadata-based bypasses are reviewed.
* [ ] Verify API keys are independently scoped and rotatable.
* [ ] Verify internal service credentials are distinct from user credentials.
* [ ] Verify admin credentials are never accepted by normal-user endpoints unless intended.
* [ ] Verify password authentication is delegated to a secure identity provider where practical.
* [ ] Verify refresh-token flows cannot be replayed indefinitely.
* [ ] Verify token verification checks issuer, audience, expiry, signature algorithm, and key.
* [ ] Verify JWT algorithm confusion is impossible.
* [ ] Verify `none` or unintended algorithms cannot be accepted.
* [ ] Verify JWT key rotation is supported.
* [ ] Verify token claims are not trusted merely because the client supplied them.
* [ ] Verify authorization does not depend solely on custom JWT claims that can become stale.
* [ ] Verify token timestamps are validated.
* [ ] Verify clock-skew handling is bounded.
* [ ] Verify service-to-service tokens use appropriate audience restrictions.

### Authorization

* [ ] Verify route-level authorization.
* [ ] Verify resource-level authorization.
* [ ] Verify action-level authorization.
* [ ] Verify ownership checks.
* [ ] Verify tenant checks.
* [ ] Verify role hierarchy.
* [ ] Verify admin-only operations.
* [ ] Verify support/staff impersonation controls.
* [ ] Verify emergency/break-glass access.
* [ ] Verify authorization is centralized enough to avoid inconsistent policies.
* [ ] Verify authorization does not rely on URL structure.
* [ ] Verify authorization cannot be bypassed using route aliases.
* [ ] Verify authorization cannot be bypassed through duplicate parameters.
* [ ] Verify conflicting parameters do not create authorization ambiguity.

### SQL / database access

* [ ] Search for string-concatenated SQL.
* [ ] Verify parameterized queries everywhere.
* [ ] Review dynamic `ORDER BY`, filter, table, column, and sort-direction inputs.
* [ ] Verify allowlists for dynamic SQL identifiers.
* [ ] Review raw SQL queries manually.
* [ ] Review query builders for unsafe raw fragments.
* [ ] Test SQL injection in every search/filter/sort/export endpoint.
* [ ] Test second-order SQL injection.
* [ ] Test JSON/JSONB operators.
* [ ] Test full-text-search inputs.
* [ ] Test stored procedure invocation.
* [ ] Verify database error handling does not leak schema details.
* [ ] Verify connection credentials have minimum privileges.
* [ ] Verify application DB users cannot perform administrative operations unnecessarily.

### SSRF / outbound requests

* [ ] Identify every server-side URL fetch.
* [ ] Block arbitrary user-selected schemes.
* [ ] Allowlist permitted schemes.
* [ ] Validate hostnames after DNS resolution.
* [ ] Prevent access to localhost.
* [ ] Prevent access to private RFC1918 addresses.
* [ ] Prevent access to link-local ranges.
* [ ] Prevent access to cloud metadata endpoints.
* [ ] Prevent IPv4/IPv6 bypasses.
* [ ] Prevent DNS rebinding.
* [ ] Resolve and validate destination IP.
* [ ] Revalidate redirects.
* [ ] Prevent redirects to internal addresses.
* [ ] Restrict outbound ports.
* [ ] Restrict response size.
* [ ] Restrict request timeout.
* [ ] Restrict maximum redirects.
* [ ] Disable unnecessary protocols such as `file:`, `gopher:`, etc.
* [ ] Test URL parser discrepancies between validation library and HTTP client.

OWASP specifically identifies SSRF, broken object authorization, broken authentication, unrestricted resource consumption, security misconfiguration, improper inventory management, and unsafe API consumption as major API risks.

### File handling

* [ ] Validate upload size.
* [ ] Validate MIME type.
* [ ] Validate extension.
* [ ] Validate actual file signature/magic bytes.
* [ ] Do not trust client-provided MIME type.
* [ ] Generate server-side filenames.
* [ ] Prevent path traversal.
* [ ] Prevent null-byte filename tricks.
* [ ] Prevent archive bombs.
* [ ] Prevent decompression bombs.
* [ ] Prevent polyglot-file abuse.
* [ ] Scan uploaded content where appropriate.
* [ ] Process files in isolated environments.
* [ ] Do not execute uploaded content.
* [ ] Prevent SVG/script payloads where SVG is not required.
* [ ] Sanitize document previews.
* [ ] Verify image processing libraries are updated.
* [ ] Verify EXIF metadata handling.
* [ ] Prevent uploaded files from becoming executable web content.
* [ ] Prevent content-type confusion.
* [ ] Verify download authorization separately from upload authorization.

### Error handling / logging

* [ ] Disable stack traces in production responses.
* [ ] Disable verbose framework errors.
* [ ] Verify error IDs/correlation IDs do not expose secrets.
* [ ] Verify logs never contain passwords.
* [ ] Verify logs never contain access tokens.
* [ ] Verify logs never contain refresh tokens.
* [ ] Verify cookies are not logged.
* [ ] Verify Authorization headers are not logged.
* [ ] Verify signed URLs are not logged in plaintext.
* [ ] Verify PII logging is minimized.
* [ ] Verify security events are logged.
* [ ] Verify authorization failures are logged.
* [ ] Verify admin actions are logged.
* [ ] Verify authentication events are logged.
* [ ] Verify logs are tamper-resistant.
* [ ] Verify log retention is appropriate.
* [ ] Verify alerts exist for repeated authentication failures and privilege escalation indicators.

### Abuse / availability

* [ ] Rate-limit login.
* [ ] Rate-limit password reset.
* [ ] Rate-limit OTP generation.
* [ ] Rate-limit OTP verification.
* [ ] Rate-limit registration.
* [ ] Rate-limit expensive search endpoints.
* [ ] Rate-limit export endpoints.
* [ ] Rate-limit file processing.
* [ ] Rate-limit invitation sending.
* [ ] Rate-limit webhook endpoints.
* [ ] Rate-limit expensive database queries.
* [ ] Rate-limit resource creation.
* [ ] Verify quotas are enforced per identity and per origin/IP where appropriate.
* [ ] Test account enumeration.
* [ ] Test credential stuffing resistance.
* [ ] Test brute-force resistance.
* [ ] Test denial-of-service through expensive parameters.
* [ ] Test concurrency/race attacks.
* [ ] Test duplicate request handling.
* [ ] Test idempotency for state-changing API calls.
---

## Public API / REST / RPC


* [ ] Inventory every endpoint.
* [ ] Inventory every version.
* [ ] Inventory deprecated endpoints.
* [ ] Inventory undocumented endpoints.
* [ ] Inventory internal/debug endpoints.
* [ ] Inventory health endpoints.
* [ ] Inventory admin endpoints.
* [ ] Inventory webhook endpoints.
* [ ] Inventory file endpoints.
* [ ] Inventory export endpoints.
* [ ] Inventory GraphQL/RPC endpoints where applicable.
* [ ] Verify deprecated endpoints are disabled or equally protected.
* [ ] Verify OpenAPI documentation matches actual exposed endpoints.
* [ ] Verify HTTP method authorization.
* [ ] Verify path parameter authorization.
* [ ] Verify query parameter authorization.
* [ ] Verify body-property authorization.
* [ ] Verify nested object authorization.
* [ ] Verify response-property filtering.
* [ ] Verify error-property filtering.
* [ ] Verify sensitive business workflows have anti-automation controls.
* [ ] Verify rate limits.
* [ ] Verify quotas.
* [ ] Verify pagination limits.
* [ ] Verify maximum page size.
* [ ] Verify maximum export size.
* [ ] Verify maximum request complexity.
* [ ] Verify protection against parameter pollution.
* [ ] Verify duplicate parameter behavior is deterministic.
* [ ] Verify parser differences between proxies and backend are reviewed.
* [ ] Verify HTTP content-type restrictions.
* [ ] Verify JSON/XML parsers cannot resolve external entities if XML is supported.
* [ ] Verify request validation on all alternate content types.
* [ ] Verify response caching cannot cross users.
* [ ] Verify cache keys include all security-relevant identity dimensions.
* [ ] Verify private responses are not publicly cached.
* [ ] Verify ETag/conditional-request behavior does not leak information.
* [ ] Verify sensitive actions use CSRF defenses where cookie-based authentication is used.
* [ ] Verify CORS and credentials behavior.
* [ ] Verify CSRF tokens cannot be replayed cross-session.
* [ ] Verify SameSite cookie settings.
* [ ] Verify Origin/Referer validation where appropriate.
---

## Webhooks


* [ ] Inventory every webhook receiver.
* [ ] Verify webhook signatures.
* [ ] Verify signature verification covers the exact raw body.
* [ ] Verify timestamps/nonces where supported.
* [ ] Verify replay protection.
* [ ] Verify event IDs are idempotent.
* [ ] Verify duplicate webhook delivery is safe.
* [ ] Verify webhook source allowlisting where appropriate.
* [ ] Verify webhook secrets are rotatable.
* [ ] Verify webhook secrets are not exposed in client code.
* [ ] Verify webhook failures cannot reveal secrets.
* [ ] Verify webhook payloads are validated.
* [ ] Verify webhook payloads do not directly control privileged actions without authorization.
* [ ] Verify webhook-triggered operations enforce tenant/resource authorization.
* [ ] Verify webhook endpoint rate limits.
* [ ] Verify asynchronous processing cannot be poisoned.
* [ ] Verify malformed events cannot create queue exhaustion.
* [ ] Verify webhook retries cannot create duplicate financial/security operations.
