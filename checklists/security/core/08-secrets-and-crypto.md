# Secrets Management & Cryptography

[← all checklists](../../README.md)

---

## Secrets Management


* [ ] Create a complete secret inventory.
* [ ] Identify API keys.
* [ ] Identify JWT signing keys.
* [ ] Identify refresh-token secrets.
* [ ] Identify database credentials.
* [ ] Identify Google service-account credentials.
* [ ] Identify GitHub credentials.
* [ ] Identify Apple signing certificates.
* [ ] Identify Apple provisioning profiles.
* [ ] Identify webhook secrets.
* [ ] Identify OAuth client secrets.
* [ ] Identify encryption keys.
* [ ] Identify third-party credentials.
* [ ] Verify every secret has an owner.
* [ ] Verify every secret has rotation procedure.
* [ ] Verify every secret has expiration/review date.
* [ ] Verify production secrets differ from staging/development.
* [ ] Verify no signing key, token secret or inter-node shared key in production equals a value shipped in the vendor's sample config, docs or image — a published default lets anyone mint admin tokens.
* [ ] Verify least privilege.
* [ ] Verify secrets are never stored in source code.
* [ ] Verify secrets are never stored in frontend bundles.
* [ ] Verify secrets are never stored in mobile binaries unless inherently public.
* [ ] Verify secrets do not appear in logs.
* [ ] Verify secrets do not appear in error reports.
* [ ] Verify secrets do not appear in URLs.
* [ ] Verify secrets cannot be retrieved through debug endpoints.
* [ ] Test secret rotation.
* [ ] Test compromised-secret response.
* [ ] Verify credentials users hand you for their own accounts (OAuth tokens, API keys) are encrypted at rest with a key the database does not hold, and that a failed encryption refuses the save rather than storing plaintext.
* [ ] Verify an endpoint that tests a credential before saving stores nothing, answers only pass or fail — no prefix, length or provider error text derived from the secret — and runs the same validation and allowlist as the save path first.
---

## Cryptography


* [ ] Inventory every cryptographic operation.
* [ ] Remove home-grown cryptography.
* [ ] Use platform/library primitives.
* [ ] Verify TLS everywhere.
* [ ] Verify certificate validation.
* [ ] Verify modern algorithms.
* [ ] Verify deprecated algorithms are absent.
* [ ] Verify secure random generation.
* [ ] Search for every comparison of a secret against request input (HMAC and webhook signatures, API keys, reset, invite and CSRF tokens) and verify each uses a constant-time function such as `timingSafeEqual`, `hmac.compare_digest`, `ConstantTimeCompare` or `MessageDigest.isEqual` on equal-length buffers — `==` stops at the first differing byte and leaks the secret through timing.
* [ ] Verify encryption keys have appropriate length.
* [ ] Verify encryption is authenticated where appropriate.
* [ ] Verify nonce/IV uniqueness.
* [ ] Verify key separation.
* [ ] Verify encryption key rotation.
* [ ] Verify key storage.
* [ ] Verify key backup/recovery.
* [ ] Verify key destruction.
* [ ] Verify signing-key protection.
* [ ] Verify JWT signing key rotation.
* [ ] Verify asymmetric private keys never reach clients.
* [ ] Verify client-side “encryption” is not falsely treated as authorization.
