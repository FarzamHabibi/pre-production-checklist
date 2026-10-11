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
* [ ] Verify suspending or banning an account takes effect at once on every credential it holds — live sessions, refresh tokens, API keys and personal access tokens — not only at the next login.
* [ ] Verify an auth guard that tries several credential types re-throws an authorization failure instead of falling through to the next type; a catch-all turns "this account is banned" into a successful request on the API-key path.
* [ ] Verify the admin user list reads the identity provider's user table, not only your own profile table — an account that signed up but never got a profile row is invisible to the people who would have to suspend it.
* [ ] Verify every account with admin or staff rights inside the product is enrolled in MFA, and that the admin API enforces it server-side rather than the admin UI alone.
* [ ] Verify granting admin rights needs a source the application cannot write to itself — an environment secret, an IAM group, a separate allowlist — so one database write cannot create an admin.
---

## Managed Authentication Provider


* [ ] Verify email/password authentication settings match security requirements.
* [ ] Verify password policy is strong enough for the application's risk.
* [ ] Verify the password is hashed exactly as typed, with no trimming, case folding or silent truncation, and that with bcrypt any input over 72 bytes is rejected or pre-hashed first; confirm a 64-character password is accepted and a login that differs only after byte 72 fails.
* [ ] Verify breached-password protection where available/appropriate.
* [ ] Verify email confirmation policy.
* [ ] Verify unconfirmed accounts cannot access protected resources.
* [ ] Verify signup does not expose whether an email already exists where enumeration is a concern.
* [ ] Verify login does not expose whether an email exists.
* [ ] Verify password-reset responses are resistant to enumeration.
* [ ] Measure forgot-password, signup and login response times for about 50 existing and 50 unknown emails and verify the distributions overlap — sending mail synchronously or skipping the hash for unknown users reveals which accounts exist even when the text is identical.
* [ ] Verify password reset tokens expire.
* [ ] Verify password reset tokens are single-use.
* [ ] Verify password reset invalidates prior sessions where required.
* [ ] Verify finishing a password reset either does not sign the user in or still demands the enrolled second factor — a reset that issues a full session turns mailbox access into an MFA bypass.
* [ ] Verify users can list their active sessions and devices and revoke any or all of them, and that after a password change or reset every other session and refresh token is ended, or the user is offered that.
* [ ] Verify password-reset redirect URLs are allowlisted.
* [ ] Verify attackers cannot manipulate password-reset callback destinations.
* [ ] Verify code that builds password-reset, magic-link, invite and email-verification URLs takes the origin from configuration, never from `Host`, `X-Forwarded-Host` or `Origin` — a forged header makes your own email deliver the victim's token to the attacker's domain.
* [ ] Verify the page that consumes a reset or magic-link token sends `Referrer-Policy: no-referrer` and loads no third-party script until the token is exchanged and removed from the URL — otherwise analytics and CDN requests carry it in `Referer`.
* [ ] Verify email-change flow requires appropriate verification.
* [ ] Verify changing email does not silently bypass ownership verification.
* [ ] Verify a password change, password reset, MFA change and email change each send a notice to the address on file (for an email change, the old address) with a way to report it — it is the only alarm the real owner gets after a takeover.
* [ ] Verify changing password has appropriate reauthentication behavior.
* [ ] Verify changing email, phone, password or MFA factors, and creating API keys, requires an authentication from the last few minutes, checked server-side against the session's auth time, so a stolen session cookie cannot lock the owner out.
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
* [ ] Verify each one-time code (SMS, email, TOTP, recovery) is accepted once, only for the login or action it was issued for, expires within minutes, and that wrong guesses are capped per code and per account, not only per IP — a 6-digit code spread across many IPs falls in hours.
* [ ] Verify push-approval MFA rate-limits prompts per account and uses number matching or shows the request's location, so an attacker holding the password cannot spam prompts until the user taps Approve.
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
* [ ] Verify a client that uses more than one authorization server checks the `iss` parameter in the authorization response (RFC 9207) or uses a distinct redirect URI per provider, so one provider's code cannot be redeemed at another.
* [ ] Verify token audience.
* [ ] Verify token signature.
* [ ] Verify account-linking semantics.
* [ ] Verify identity collision handling.
* [ ] Verify an external login is keyed on the provider's issuer plus its immutable `sub`, never on email or display name, and that a provider email links accounts only when marked `email_verified` — keying on email lets a weaker provider sign someone in as the owner.
* [ ] Verify login CSRF protection.
* [ ] Verify logout semantics.
* [ ] Verify provider disconnect.
* [ ] Verify disconnecting a provider deletes the stored access and refresh tokens, not only the link, and revokes the grant at the provider where it offers a revocation endpoint.
* [ ] Verify a token refresh job reads the connection's status before writing, so it never revives a connection the user disconnected or the provider revoked.
* [ ] Verify identity removal.
* [ ] Verify email verification assumptions.
* [ ] Verify external-provider account takeover scenarios.
