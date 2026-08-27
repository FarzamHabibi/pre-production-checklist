# Spring Boot

Items from the core checklists that are specific to **Spring Boot**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`core/04-backend-api.md`](../core/04-backend-api.md)</sub>

* [ ] Verify `management.endpoints.web.exposure.include` is not `*`; Actuator's `env`, `heapdump`, `threaddump` and `configprops` leak credentials and memory.
* [ ] Verify Actuator is bound to a separate port or secured, and that `/actuator/shutdown` is disabled.
* [ ] Verify `server.error.include-stacktrace=never` and `include-message=never` in production.
* [ ] Verify the H2 console and Spring Boot DevTools are not on the production classpath.
* [ ] Verify `@CrossOrigin` is not used with `origins = "*"` alongside `allowCredentials = true`.
* [ ] Verify `spring.jackson` polymorphic typing is off — `enableDefaultTyping` / `@JsonTypeInfo` on untrusted input is deserialization RCE.
* [ ] Verify request size limits: `spring.servlet.multipart.max-file-size` and `max-request-size`.

## Authentication & Authorization
<sub>from [`core/02-authorization.md`](../core/02-authorization.md)</sub>

* [ ] Verify the `SecurityFilterChain` ordering — a broad `permitAll()` placed before a restrictive matcher wins.
* [ ] Verify `@EnableMethodSecurity` is on and `@PreAuthorize` covers service-layer entry points, not only controllers.
* [ ] Verify CSRF is not disabled wholesale; if it is, confirm every state-changing endpoint is token-authenticated.
* [ ] Verify `@PathVariable` ids are checked against the authenticated principal, not just loaded.
* [ ] Verify Spring Data REST does not auto-expose repositories you did not intend.

## Database & Row-Level Security
<sub>from [`core/06-database.md`](../core/06-database.md)</sub>

* [ ] Search for string concatenation inside `@Query`, `createQuery`, `createNativeQuery` and `JdbcTemplate` calls.
* [ ] Verify `Sort` and `Pageable` values that come from the request cannot reference arbitrary properties.

## Common Web Attack Classes
<sub>from [`core/09-common-web-attacks.md`](../core/09-common-web-attacks.md)</sub>

* [ ] Verify SpEL is never evaluated on user input — `@Value`, `ExpressionParser` and Spring Security expressions built by concatenation.
* [ ] Verify `RestTemplate`/`WebClient` calls to user-supplied URLs go through an allowlist (SSRF).

## Secrets Management & Cryptography
<sub>from [`core/08-secrets-and-crypto.md`](../core/08-secrets-and-crypto.md)</sub>

* [ ] Verify `application.properties` / `application.yml` in the repository contains no credential, and that production values come from the environment or a secret manager.
* [ ] Verify logging configuration cannot be reloaded from a remote source.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Run `mvn dependency-check` or `gradle dependencyCheckAnalyze` and confirm no known-vulnerable dependency ships.
* [ ] Verify the fat JAR does not bundle test fixtures, seed credentials or `application-local.yml`.
