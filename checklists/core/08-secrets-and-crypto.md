# Secrets Management & Cryptography

[← all checklists](../README.md)

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
