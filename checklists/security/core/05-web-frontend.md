# Web Frontend

SSR framework, CSP, cookies, caching and client-side injection. Applies to any modern web frontend, not only React-based ones.

[← all checklists](../../README.md)

---

## Web Frontend & SSR


### Next.js architecture

* [ ] Inventory Route Handlers.
* [ ] Inventory Proxy configuration.
* [ ] Verify authorization is enforced at the data-access layer/server boundary.
* [ ] Verify server-only modules cannot be imported into client bundles.
* [ ] Verify server secrets cannot cross the client boundary.
* [ ] Search generated JS bundles for secrets.
* [ ] Search source maps for secrets.
* [ ] Search `NEXT_PUBLIC_*` variables for accidental sensitive information.
* [ ] Verify server-only environment variables do not start with `NEXT_PUBLIC_`.
* [ ] Verify build-time environment variables do not leak credentials.

Next.js guidance explicitly recommends keeping the strongest authorization checks close to the data source; Proxy should not be treated as the sole authorization boundary.

### Proxy / routing

* [ ] Verify every protected route is covered by intended Proxy matchers.
* [ ] Verify matcher exclusions cannot bypass authorization.
* [ ] Verify `/api` or route-handler paths are not accidentally excluded from required checks.
* [ ] Verify static assets do not contain sensitive information.
* [ ] Verify alternate URL normalization cannot bypass protection.
* [ ] Verify encoded-path traversal cannot bypass route rules.
* [ ] Verify case normalization cannot bypass authorization.
* [ ] Verify trailing-slash behavior.
* [ ] Verify rewrite behavior.
* [ ] Verify redirect behavior.
* [ ] Verify open redirects.
* [ ] Verify host-header-derived URLs are validated.
* [ ] Verify proxy does not perform expensive database authorization checks on every request unless intentionally designed.
* [ ] Verify Proxy authentication state cannot be forged by modifying unsigned cookies.

### Server Actions

* [ ] Verify authentication for every action.
* [ ] Verify authorization for every action.
* [ ] Verify input validation.
* [ ] Verify CSRF protection assumptions.
* [ ] Verify action arguments cannot manipulate trusted fields.
* [ ] Verify action results do not leak private data.
* [ ] Verify replay/idempotency requirements.
* [ ] Verify rate limits for expensive actions.
* [ ] Verify sensitive actions require recent authentication where required.

### Route Handlers

* [ ] Verify authentication.
* [ ] Verify authorization.
* [ ] Verify CORS.
* [ ] Verify CSRF where relevant.
* [ ] Verify input validation.
* [ ] Verify response caching.
* [ ] Verify rate limiting.
* [ ] Verify error handling.
* [ ] Verify SSRF controls.
* [ ] Verify file upload controls.
* [ ] Verify outbound calls.
* [ ] Verify secret handling.

### React / XSS

* [ ] Review every use manually.
* [ ] Search for HTML rendering libraries.
* [ ] Search for Markdown-to-HTML rendering.
* [ ] Search for rich-text editors.
* [ ] Search for user-controlled URLs.
* [ ] Search for `javascript:` URL possibilities.
* [ ] Search for unsafe DOM APIs.
* [ ] Search for direct `innerHTML`.
* [ ] Search for `eval`.
* [ ] Search for `new Function`.
* [ ] Search for dynamically generated scripts.
* [ ] Verify user-generated HTML is sanitized.
* [ ] Verify sanitizer configuration is secure.
* [ ] Verify URL protocols are allowlisted.
* [ ] Verify SVG handling.
* [ ] Verify embedded iframe origins.
* [ ] Verify postMessage origin validation.
* [ ] Verify message event data validation.
* [ ] Verify window opener behavior.
* [ ] Verify OAuth/payment popup security.
* [ ] Verify DOM clobbering risks where relevant.

### CSP / browser security

* [ ] Deploy a deliberate Content Security Policy.
* [ ] Review `script-src`.
* [ ] Review `style-src`.
* [ ] Review `img-src`.
* [ ] Review `connect-src`.
* [ ] Review `frame-src`.
* [ ] Review `object-src`.
* [ ] Review `base-uri`.
* [ ] Review `form-action`.
* [ ] Review `frame-ancestors`.
* [ ] Avoid `unsafe-eval` unless justified.
* [ ] Avoid `unsafe-inline` where possible.
* [ ] Use nonces/hashes where appropriate.
* [ ] Verify CSP is actually delivered on production responses.
* [ ] Verify CSP differs appropriately between development and production.
* [ ] Verify third-party scripts are explicitly allowlisted.
* [ ] Verify analytics/ad/tracking scripts do not receive unnecessary sensitive data.
* [ ] Verify Subresource Integrity where suitable.
* [ ] Verify HSTS.
* [ ] Verify `X-Content-Type-Options`.
* [ ] Verify `Referrer-Policy`.
* [ ] Verify clickjacking protection.
* [ ] Verify browser permissions policies.

Next.js documents CSP as a protection against XSS, clickjacking, and related code-injection threats and provides nonce/SRI approaches.

### Cookies / browser sessions

* [ ] Verify `Secure`.
* [ ] Verify `HttpOnly` for sensitive cookies.
* [ ] Verify appropriate `SameSite`.
* [ ] Verify cookie domain is as narrow as practical.
* [ ] Verify cookie path.
* [ ] Verify session expiration.
* [ ] Verify session rotation after login.
* [ ] Verify session rotation after privilege changes.
* [ ] Verify session invalidation on logout.
* [ ] Verify session fixation protection.
* [ ] Verify sensitive tokens are not stored in localStorage unnecessarily.
* [ ] Verify refresh tokens are not exposed to JavaScript unless explicitly required.
* [ ] Verify browser storage does not contain secrets that do not need to be there.
* [ ] Verify third-party scripts cannot read sensitive browser storage.

### Caching / SSR / RSC

* [ ] Verify authenticated pages cannot be publicly cached.
* [ ] Verify per-user data cannot be cached as shared content.
* [ ] Verify route cache keys include identity where needed.
* [ ] Verify static generation does not bake sensitive data into public assets.
* [ ] Verify revalidation cannot publish private information.
* [ ] Verify server-side fetches do not leak authorization headers into caches/logs.
* [ ] Verify cross-user request context isolation.
* [ ] Verify data from one user cannot be reused for another user through memoization.
* [ ] Verify redirects do not leak sensitive URL parameters.
* [ ] Verify error pages do not expose server-side data.

### Dependency / supply chain

* [ ] Pin production dependencies appropriately.
* [ ] Review direct dependencies.
* [ ] Review transitive dependencies.
* [ ] Run dependency vulnerability scanning.
* [ ] Run lockfile integrity checks.
* [ ] Verify package manager lockfile is committed.
* [ ] Verify postinstall scripts.
* [ ] Verify unexpected packages.
* [ ] Verify abandoned/high-risk packages.
* [ ] Verify image-processing packages.
* [ ] Verify authentication packages.
* [ ] Verify Markdown/HTML parsers.
* [ ] Verify URL parsers.
* [ ] Verify crypto libraries.
