# Common Web Attack Classes

The classics. Still shipped broken, constantly.

[← all checklists](../README.md)

---

## SSRF / Egress / Network Controls


* [ ] Inventory all outbound destinations.
* [ ] Restrict outbound destinations where possible.
* [ ] Restrict outbound ports.
* [ ] Block metadata services.
* [ ] Block localhost.
* [ ] Block private networks where not required.
* [ ] Protect internal administrative services.
* [ ] Verify DNS rebinding protections.
* [ ] Verify redirect handling.
* [ ] Verify URL parser consistency.
* [ ] Verify proxy behavior.
* [ ] Verify IPv6 handling.
* [ ] Verify services cannot call cloud control-plane APIs unnecessarily.
---

## Information Disclosure


* [ ] Search API responses for unnecessary PII.
* [ ] Search API responses for internal IDs.
* [ ] Search responses for database IDs.
* [ ] Search errors for stack traces.
* [ ] Search responses for cloud resource names.
* [ ] Search responses for internal hostnames.
* [ ] Search responses for filesystem paths.
* [ ] Search responses for implementation versions.
* [ ] Search responses for environment variables.
* [ ] Search responses for feature flags.
* [ ] Search responses for admin metadata.
* [ ] Search HTML for comments containing secrets.
* [ ] Search JS bundles for secrets.
* [ ] Search source maps for secrets.
* [ ] Search mobile binaries for credentials.
* [ ] Search app logs for credentials.
* [ ] Search GitHub logs.
* [ ] Search analytics systems.
---

## CSRF


Applicable especially where authentication relies on cookies.

* [ ] Identify every state-changing browser endpoint.
* [ ] Verify SameSite cookie behavior.
* [ ] Verify CSRF token strategy.
* [ ] Verify Origin validation where appropriate.
* [ ] Verify Referer validation where appropriate.
* [ ] Verify JSON-only assumptions are actually enforced.
* [ ] Verify `Content-Type` restrictions cannot be bypassed.
* [ ] Verify CORS does not accidentally defeat CSRF assumptions.
* [ ] Verify login CSRF.
* [ ] Verify account-linking CSRF.
* [ ] Verify email-change CSRF.
* [ ] Verify password-change CSRF.
* [ ] Verify MFA-change CSRF.
* [ ] Verify API-key creation CSRF.
* [ ] Verify destructive action CSRF.
---

## Clickjacking / UI Redress


* [ ] Verify `frame-ancestors`.
* [ ] Verify `X-Frame-Options` where appropriate.
* [ ] Verify sensitive pages cannot be embedded by untrusted origins.
* [ ] Test login screen embedding.
* [ ] Test account settings embedding.
* [ ] Test payment screens.
* [ ] Test destructive-action screens.
* [ ] Test admin screens.
---

## Open Redirects


* [ ] Search every `redirect`, callback, `returnTo`, `next`, `continue`, `redirect_uri`, and similar parameter.
* [ ] Allowlist destinations.
* [ ] Reject arbitrary external domains.
* [ ] Verify protocol-relative URLs.
* [ ] Verify encoded URLs.
* [ ] Verify Unicode/IDN edge cases.
* [ ] Verify nested redirects.
* [ ] Verify OAuth redirect parameters.
