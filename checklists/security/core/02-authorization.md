# Authentication & Authorization

The largest source of real, exploitable bugs in small products. Read this even if you read nothing else.

[← all checklists](../../README.md)

---

## Global Authentication & Authorization


* [ ] Create a complete authorization matrix for every role × endpoint × operation × resource.
* [ ] Verify authorization is enforced server-side.
* [ ] Verify object-level authorization exists for every resource identifier.
* [ ] Verify function-level authorization exists for every privileged operation.
* [ ] Verify field/property-level authorization exists for sensitive response fields.
* [ ] Verify authorization is checked after authentication and before sensitive data access.
* [ ] Verify authorization is performed on every alternate route to the same operation.
* [ ] Verify bulk endpoints enforce authorization per object, not only once for the request.
* [ ] Verify batch operations cannot mix authorized and unauthorized object IDs to bypass controls.
* [ ] Verify users cannot change `user_id`, `owner_id`, `tenant_id`, `organization_id`, `role`, or equivalent ownership attributes to obtain access.
* [ ] Verify changing HTTP method cannot bypass authorization.
* [ ] Verify alternate content types cannot bypass authorization.
* [ ] Verify GraphQL, REST, RPC, internal APIs, cron handlers, queues, and webhooks enforce equivalent authorization.
* [ ] Verify authorization survives pagination, sorting, filtering, searching, exporting, and aggregation.
* [ ] Verify authorization survives cached responses.
* [ ] Verify authorization is not implemented only in UI logic.
* [ ] Verify hidden routes are still protected.
* [ ] Verify disabled/deleted/suspended users cannot continue privileged operations.
* [ ] Verify revoked sessions/tokens no longer grant protected access according to the intended revocation model.
* [ ] Verify role changes take effect within the documented security window.
* [ ] Verify privilege downgrade invalidates previously granted privileged sessions where required.
* [ ] Verify tenant switching cannot leak resources.
* [ ] Verify IDs are not relied upon as authorization secrets.
* [ ] Verify predictable IDs do not expose unauthorized resources.
* [ ] Verify indirect object references are protected against enumeration.
* [ ] Test horizontal privilege escalation between two normal users.
* [ ] Test vertical privilege escalation from normal user → moderator/admin.
* [ ] Test cross-tenant access.
* [ ] Test access to deleted, archived, disabled, and soft-deleted resources.
* [ ] Test access to resources created before/after role changes.
* [ ] Test access using expired, revoked, malformed, and altered credentials.
* [ ] Test authorization on error paths.
* [ ] Test authorization on retries and idempotency flows.
* [ ] Test authorization during race conditions.
* [ ] Test authorization when resource ownership changes concurrently.
---

## Managed Authentication Provider


* [ ] Verify email/password authentication settings match security requirements.
* [ ] Verify password policy is strong enough for the application's risk.
* [ ] Verify breached-password protection where available/appropriate.
* [ ] Verify email confirmation policy.
* [ ] Verify unconfirmed accounts cannot access protected resources.
* [ ] Verify signup does not expose whether an email already exists where enumeration is a concern.
* [ ] Verify login does not expose whether an email exists.
* [ ] Verify password-reset responses are resistant to enumeration.
* [ ] Verify password reset tokens expire.
* [ ] Verify password reset tokens are single-use.
* [ ] Verify password reset invalidates prior sessions where required.
* [ ] Verify password-reset redirect URLs are allowlisted.
* [ ] Verify attackers cannot manipulate password-reset callback destinations.
* [ ] Verify email-change flow requires appropriate verification.
* [ ] Verify changing email does not silently bypass ownership verification.
* [ ] Verify changing password has appropriate reauthentication behavior.
* [ ] Verify logout behavior.
* [ ] Verify session refresh behavior.
* [ ] Verify refresh-token rotation/reuse protections according to the deployed Auth configuration.
* [ ] Verify compromised refresh tokens cannot be replayed indefinitely.
* [ ] Verify sessions terminate according to expected policies.
* [ ] Verify user deletion terminates access.
* [ ] Verify disabled/suspended users lose access.
* [ ] Verify admin-level Auth operations are isolated.
* [ ] Verify service-role credentials are never exposed to browsers or mobile applications.
* [ ] Search source control/history for service-role credentials.
* [ ] Verify public/anon credentials only have intended permissions through RLS.
* [ ] Verify JWT verification uses the intended project issuer/audience/signing configuration.
* [ ] Verify custom claims cannot be client-modified to escalate privileges.
* [ ] Verify external identity provider claims are validated.
* [ ] Verify OAuth redirect allowlists.
* [ ] Verify OAuth state protection.
* [ ] Verify PKCE where applicable.
* [ ] Verify identity linking cannot be abused to take over another account.
* [ ] Verify account-linking requires authentication appropriate to the risk.
* [ ] Verify unlinking the last authentication method is protected.
* [ ] Verify MFA enrollment requires authenticated user action.
* [ ] Verify MFA cannot be enrolled by an attacker who only partially controls the account.
* [ ] Verify MFA challenge verification.
* [ ] Verify MFA recovery.
* [ ] Verify factor removal.
* [ ] Verify factor replacement.
* [ ] Verify backup/recovery codes are protected.
* [ ] Verify privileged operations can require stronger authentication/MFA.

Supabase explicitly recommends MFA for stronger account protection and warns about server-side rendering/session handling considerations.
---

## Authorization Matrix Testing


Create at least two test identities:

* user A
* user B
* admin
* suspended/deleted user
* user from tenant B
* unauthenticated user

For every sensitive object:

* [ ] A can access A's object.
* [ ] A cannot read B's object.
* [ ] A cannot modify B's object.
* [ ] A cannot delete B's object.
* [ ] A cannot list B's objects.
* [ ] A cannot search for B's object.
* [ ] A cannot infer B's object existence.
* [ ] A cannot export B's data.
* [ ] A cannot create resources owned by B.
* [ ] A cannot modify `owner_id`.
* [ ] A cannot modify `tenant_id`.
* [ ] A cannot promote itself.
* [ ] A cannot execute admin endpoints.
* [ ] Suspended users cannot access protected data.
* [ ] Deleted users cannot access protected data.
* [ ] Admin access does not accidentally bypass tenant boundaries unless explicitly intended.
* [ ] Service accounts cannot perform unrelated user operations.
---

## OAuth / SSO


* [ ] Verify PKCE.
* [ ] Verify state.
* [ ] Verify nonce where applicable.
* [ ] Verify redirect URI exact matching.
* [ ] Verify provider issuer.
* [ ] Verify token audience.
* [ ] Verify token signature.
* [ ] Verify account-linking semantics.
* [ ] Verify identity collision handling.
* [ ] Verify login CSRF protection.
* [ ] Verify logout semantics.
* [ ] Verify provider disconnect.
* [ ] Verify identity removal.
* [ ] Verify email verification assumptions.
* [ ] Verify external-provider account takeover scenarios.
