# DNS, CDN, Edge & WAF

Written against Cloudflare, but applies to any edge provider — Fastly, Akamai, CloudFront, or an nginx reverse proxy you run yourself.

[← all checklists](../README.md)

---

## DNS, CDN, Edge & WAF


### DNS

* [ ] Verify nameserver configuration.
* [ ] Verify registrar account MFA.
* [ ] Verify registrar lock/transfer protection.
* [ ] Verify DNSSEC.
* [ ] Verify all DNS records.
* [ ] Identify stale DNS records.
* [ ] Identify unused subdomains.
* [ ] Identify dangling CNAMEs.
* [ ] Identify dangling delegated subdomains.
* [ ] Identify third-party SaaS records.
* [ ] Identify DNS-only records exposing origins.
* [ ] Identify direct IP records.
* [ ] Verify IPv6 records.
* [ ] Verify mail records.
* [ ] Verify SPF.
* [ ] Verify DKIM.
* [ ] Verify DMARC.
* [ ] Verify BIMI where applicable.
* [ ] Verify TXT verification records.
* [ ] Review NS delegations.
* [ ] Review wildcard DNS.
* [ ] Review wildcard subdomains.
* [ ] Review CNAME flattening behavior where security/domain-verification implications exist.

Cloudflare's current DNS documentation highlights proxy status, CNAME flattening, NS delegation, and risks around third-party CNAME verification records.

### Origin protection

* [ ] Identify the actual origin IP.
* [ ] Verify firewall rules reject unauthorized direct traffic.
* [ ] Verify origin TLS.
* [ ] Verify origin certificate validity.
* [ ] Verify origin certificate hostname coverage.
* [ ] Verify TLS versions/ciphers.
* [ ] Verify origin authentication.
* [ ] Evaluate Authenticated Origin Pulls/mTLS.
* [ ] Verify direct-origin requests fail.
* [ ] Verify attacker cannot bypass WAF by discovering the origin IP.
* [ ] Verify monitoring endpoints do not expose the origin.
* [ ] Verify cloud provider default endpoints do not bypass the edge.
* [ ] Verify staging origins are not publicly exposed unintentionally.

Cloudflare documents Full (strict) for validated encrypted origin connections and Authenticated Origin Pulls for ensuring requests to the origin originate from Cloudflare.

### WAF / rate limiting

* [ ] Enable appropriate WAF protections.
* [ ] Review custom WAF rules.
* [ ] Review exclusions.
* [ ] Review bypass rules.
* [ ] Verify sensitive API endpoints have rate limiting.
* [ ] Rate-limit login.
* [ ] Rate-limit password reset.
* [ ] Rate-limit signup.
* [ ] Rate-limit OTP.
* [ ] Rate-limit expensive APIs.
* [ ] Rate-limit file uploads.
* [ ] Rate-limit admin endpoints.
* [ ] Verify bots cannot easily bypass with distributed IPs.
* [ ] Verify rate limits account for authenticated identity where possible.
* [ ] Verify WAF false-positive exclusions do not create broad bypasses.
* [ ] Verify WAF rules cover APIs separately from browser pages.
* [ ] Verify managed rules are updated.
* [ ] Review security events regularly.

### Cloudflare API

* [ ] Replace broad global API keys where possible with scoped API tokens.
* [ ] Verify minimum permissions.
* [ ] Verify token expiration/rotation.
* [ ] Verify CI tokens are distinct from human tokens.
* [ ] Verify tokens are not stored in repositories.
* [ ] Verify tokens are not shipped to frontend/mobile clients.
* [ ] Verify token use is audited.
* [ ] Verify leaked tokens can be rapidly revoked.

Cloudflare recommends API tokens over older API-key approaches where possible and supports scoped permissions.

### Edge behavior

* [ ] Verify cache rules.
* [ ] Verify authenticated responses cannot enter shared cache.
* [ ] Verify sensitive API responses are not cached.
* [ ] Verify cache keys.
* [ ] Verify query-string normalization.
* [ ] Verify cache poisoning resistance.
* [ ] Verify request-header normalization.
* [ ] Verify host-header handling.
* [ ] Verify origin header trust.
* [ ] Verify WebSocket security.
* [ ] Verify API token/header stripping.
* [ ] Verify Workers cannot be altered by unauthorized users.
* [ ] Review every Worker.
* [ ] Review every KV/config secret.
* [ ] Verify Workers cannot access unrelated resources.
* [ ] Verify redirects cannot create open redirect vulnerabilities.
