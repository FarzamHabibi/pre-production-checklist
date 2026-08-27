# Review Blind Spots

Why AI-assisted review misses AI-written bugs — and what to do instead.

[← all checklists](../README.md)

---

## Copy-Paste Security Bugs


Vibe coding commonly combines generated snippets from multiple sources.

* [ ] Identify copied code.
* [ ] Identify source of security-sensitive snippets.
* [ ] Verify snippet version/date.
* [ ] Verify framework version compatibility.
* [ ] Verify security assumptions remain valid.
* [ ] Verify deprecated APIs are not used.
* [ ] Verify copied regexes are not ReDoS-prone.
* [ ] Verify copied authentication middleware does not have known bypasses.
---

## "Looks Secure" Code


Never approve code simply because it contains words such as:

* `secure`
* `auth`
* `validate`
* `sanitize`
* `admin`
* `private`
* `internal`
* `trusted`
* `encrypted`
* `safe`
* `verified`

For every such implementation:

* [ ] Identify what security property is actually enforced.
* [ ] Identify what attacker-controlled value is used.
* [ ] Identify who supplies the identity.
* [ ] Identify who supplies the authorization decision.
* [ ] Identify what prevents tampering.
* [ ] Identify what prevents replay.
* [ ] Identify what prevents cross-user access.
* [ ] Identify what prevents cross-tenant access.
* [ ] Identify what happens on failure.
* [ ] Identify whether the check can be bypassed through another code path.
---

## Refactoring Regressions


Security bugs can be introduced without adding functionality.

For every AI refactor:

* [ ] Compare authorization behavior before/after.
* [ ] Compare authentication behavior before/after.
* [ ] Compare RLS behavior before/after.
* [ ] Compare API responses before/after.
* [ ] Compare error behavior.
* [ ] Compare caching behavior.
* [ ] Compare cookie behavior.
* [ ] Compare CORS behavior.
* [ ] Compare CSP.
* [ ] Compare logging.
* [ ] Compare rate limits.
* [ ] Compare database permissions.
* [ ] Compare service-account permissions.
* [ ] Compare mobile entitlements.
* [ ] Compare build artifacts.
---

## Generated Tests Can Be Wrong


Do not trust AI-generated security tests automatically.

* [ ] Verify test actually reaches the protected resource.
* [ ] Verify test identity is correct.
* [ ] Verify test exercises the real authorization layer.
* [ ] Verify test fails when the authorization check is removed.
* [ ] Verify test fails when RLS is weakened.
* [ ] Verify test fails when tenant filtering is removed.
* [ ] Verify negative authorization tests exist.
* [ ] Verify tests do not mock away security controls.
* [ ] Verify integration tests use real authentication.
* [ ] Verify security tests do not merely assert HTTP 200/403 without verifying data.
* [ ] Verify security tests check response contents.
* [ ] Verify security tests cover cross-user cases.
* [ ] Verify security tests cover cross-tenant cases.
* [ ] Verify security tests cover direct database/storage access where applicable.

A test that can pass while the authorization mechanism is deleted is not an effective authorization test.
---

## Review Blind Spots


Explicitly review for:

* [ ] authorization omitted because implementation focused on functionality
* [ ] security check implemented in wrong layer
* [ ] security check applied to one route but not an equivalent route
* [ ] client-side security mistaken for server-side security
* [ ] authentication mistaken for authorization
* [ ] IDs mistaken for permissions
* [ ] hidden endpoints mistaken for protected endpoints
* [ ] private database client mistaken for an authorization boundary
* [ ] service-role access used as a shortcut
* [ ] excessive IAM permissions generated for convenience
* [ ] wildcard CORS
* [ ] wildcard IAM
* [ ] public storage
* [ ] unrestricted SSRF
* [ ] unsafe shell commands
* [ ] insecure deserialization
* [ ] unsafe dynamic SQL
* [ ] unsafe dynamic HTML
* [ ] unsafe redirects
* [ ] missing rate limiting
* [ ] missing idempotency
* [ ] missing race-condition protection
* [ ] secrets in logs
* [ ] secrets in frontend/mobile code
* [ ] insecure default configuration
* [ ] deprecated security APIs
* [ ] missing security regression tests
