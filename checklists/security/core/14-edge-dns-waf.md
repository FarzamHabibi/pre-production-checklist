# DNS, CDN, Edge & WAF

Written against Cloudflare, but applies to any edge provider — Fastly, Akamai, CloudFront, or an nginx reverse proxy you run yourself.

[← all checklists](../../README.md)

---

## DNS, CDN, Edge & WAF


### DNS

* [ ] Verify nameserver configuration.
* [ ] Verify registrar account MFA.
* [ ] Verify registrar lock/transfer protection.
* [ ] Verify DNSSEC.
* [ ] Verify the DS record is published at the registrar and `dig +dnssec` returns the `ad` flag, and that removing the DS is a step in any nameserver migration — a stale DS takes the domain offline.
* [ ] Verify CAA records name every CA that issues for the domain, the edge provider's certificate authorities included, so the record blocks strangers without blocking your own renewals.
* [ ] Verify certificate-transparency monitoring alerts on any new certificate issued for your domains — an unexpected certificate is often the first sign of a hijacked record or a mis-issuance.
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
* [ ] Verify the origin IP was changed after the domain moved behind the edge, and that no DNS-only record, SPF `ip4:` entry, MX host or bounce message reveals the new one — passive-DNS history keeps every address the domain ever used.
* [ ] Verify firewall rules reject unauthorized direct traffic.
* [ ] Verify origin TLS.
* [ ] Verify origin certificate validity.
* [ ] Verify origin certificate hostname coverage.
* [ ] Verify TLS versions/ciphers.
* [ ] Verify origin authentication.
* [ ] Evaluate Authenticated Origin Pulls/mTLS.
* [ ] Verify direct-origin requests fail.
* [ ] Verify attacker cannot bypass WAF by discovering the origin IP.
* [ ] Verify an origin firewall that allowlists only the edge provider's published IP ranges is paired with a secret the edge adds (client certificate, tunnel, signed header) — those ranges are shared by every customer, so another account can point its own zone at your origin and skip your WAF.
* [ ] Verify monitoring endpoints do not expose the origin.
* [ ] Verify cloud provider default endpoints do not bypass the edge.
* [ ] Verify staging origins are not publicly exposed unintentionally.

Cloudflare documents Full (strict) for validated encrypted origin connections and Authenticated Origin Pulls for ensuring requests to the origin originate from Cloudflare.

### WAF / rate limiting

The DDoS items. Layer 3 and 4 floods are the provider's job and you can only check that
the protection is on and that the origin is not reachable around it; layer 7 is yours,
and the application-side half is in [`18-abuse-and-availability.md`](18-abuse-and-availability.md).

* [ ] Verify the edge provider's DDoS protection is enabled for the zone, and that the origin's own network exposure is small enough that the protection cannot be walked around — see *Origin protection* above.
* [ ] Verify the "under attack" or managed-challenge mode has been switched on once in staging: who is allowed to flip it, how long it takes, and which API clients, webhooks and mobile apps break when they are challenged.
* [ ] Verify HTTP/2 is terminated at the edge or by a server patched for rapid reset (CVE-2023-44487), and that HTTP/2 stream and connection limits are set on whatever terminates it.
* [ ] Verify the layer-7 rate limit counts what the attack costs — requests to the expensive route, not requests to the zone — and that a limit exists per authenticated identity as well as per IP.
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
* [ ] Verify a dynamic URL with a static extension appended (`/account/x.css`, `/api/me/a.jpg`, `/account;.js`) returns 404 or a non-cacheable response — if the origin ignores the extra segment and the edge caches by extension, the next visitor receives the victim's page (web cache deception).
* [ ] Verify sensitive API responses are not cached.
* [ ] Verify cache keys.
* [ ] Verify the edge or reverse-proxy cache key includes host, scheme and method, not only the path — a path-only key lets one hostname poison another's responses on a shared proxy.
* [ ] Verify query-string normalization.
* [ ] Verify cache poisoning resistance.
* [ ] Verify request-header normalization.
* [ ] Verify host-header handling.
* [ ] Verify origin header trust.
* [ ] Verify WebSocket security.
* [ ] Verify the reverse proxy switches a connection to tunnel mode only after the backend answers `101 Switching Protocols`; send an `Upgrade: websocket` request the backend refuses with a second request pipelined behind it, and confirm the proxy parses and filters the second one.
* [ ] Verify API token/header stripping.
* [ ] Verify Workers cannot be altered by unauthorized users.
* [ ] Review every Worker.
* [ ] Review every KV/config secret.
* [ ] Verify Workers cannot access unrelated resources.
* [ ] Verify redirects cannot create open redirect vulnerabilities.
