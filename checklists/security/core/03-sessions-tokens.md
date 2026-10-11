# Sessions, Tokens & Cookies

Applies to any session mechanism: JWT, opaque tokens, server sessions, signed cookies.

[← all checklists](../../README.md)

---

## Session / Token Security


* [ ] Verify expiration.
* [ ] Verify both an idle timeout and an absolute session lifetime are enforced server-side, including on the refresh token, so sliding refresh cannot keep a stolen session alive forever; record the chosen values and why.
* [ ] Verify issuance.
* [ ] Verify rotation.
* [ ] Verify revocation.
* [ ] Verify replay resistance.
* [ ] Verify audience.
* [ ] Verify issuer.
* [ ] Verify signing algorithm.
* [ ] Verify signing key.
* [ ] Verify key rotation.
* [ ] Verify token type separation.
* [ ] Verify each verifier rejects the wrong kind of token — an ID token, refresh token, or email-verification or reset JWT presented as an access token — by checking `typ` or a dedicated claim, above all where several kinds share a signing key.
* [ ] Verify access token vs refresh token separation.
* [ ] Verify user session vs service account token separation.
* [ ] Verify token scope.
* [ ] Verify token storage.
* [ ] Verify token leakage through URLs.
* [ ] Verify token leakage through logs.
* [ ] Verify token leakage through browser history.
* [ ] Verify token leakage through referrer headers.
* [ ] Verify token leakage through analytics.
* [ ] Verify token leakage through crash reporting.
