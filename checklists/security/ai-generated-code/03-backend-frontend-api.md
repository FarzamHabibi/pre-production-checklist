# AI-Generated Application Bugs

[← all checklists](../../README.md)

---

## Backend Framework Bugs


* [ ] Review every generated controller.
* [ ] Review every generated guard.
* [ ] Review every generated decorator.
* [ ] Review every generated interceptor.
* [ ] Review every generated middleware.
* [ ] Review every generated pipe.
* [ ] Review every generated service.
* [ ] Verify unexpected properties are rejected/removed.
* [ ] Verify mass assignment is prevented.
* [ ] Verify entity fields are not directly bound from request bodies.
* [ ] Verify generated code does not trust client-provided role/tenant/owner fields.
* [ ] Verify generated code does not catch security exceptions and continue execution.
* [ ] Verify generated exception handling does not turn authorization failures into success.
* [ ] Verify generated code does not expose internal exceptions.
* [ ] Verify generated code does not log tokens.
* [ ] Verify generated code does not log passwords.
* [ ] Verify generated code does not log sensitive request bodies.
* [ ] Verify generated code does not disable validation for convenience.
* [ ] Verify generated code does not use `any` to bypass type constraints around security logic.
* [ ] Verify generated code does not add unsafe `as` casts around authorization state.
* [ ] Verify generated raw SQL is parameterized.
* [ ] Verify generated dynamic SQL identifiers use allowlists.
* [ ] Verify generated HTTP clients validate URLs.
* [ ] Verify generated file operations prevent traversal.
* [ ] Verify generated child-process calls are not command-injection vulnerable.
---

## Frontend Framework Bugs


* [ ] Review all AI-generated Route Handlers.
* [ ] Review all AI-generated Proxy changes.
* [ ] Review all server/client boundary changes.
* [ ] Verify Route Handlers perform authorization.
* [ ] Verify AI did not expose server-only environment variables.
* [ ] Verify `NEXT_PUBLIC_*` variables contain no secrets.
* [ ] Verify server imports remain server-only.
* [ ] Verify generated `fetch()` calls do not leak authorization headers.
* [ ] Verify generated caching does not share authenticated data.
* [ ] Verify generated `revalidate` configuration is safe.
* [ ] Verify generated redirects cannot become open redirects.
* [ ] Verify generated URL handling is allowlisted.
* [ ] Verify generated HTML rendering is sanitized.
* [ ] Verify generated Markdown rendering.
* [ ] Verify generated iframe behavior.
* [ ] Verify generated postMessage handling.
* [ ] Verify generated cookies use appropriate flags.
* [ ] Verify generated authentication logic does not trust client-side state.
* [ ] Verify generated Proxy matchers cannot be bypassed.
* [ ] Verify generated rewrites cannot bypass authorization.
---

## API Bugs


For every AI-generated endpoint:

* [ ] Authentication.
* [ ] Authorization.
* [ ] Object-level authorization.
* [ ] Function-level authorization.
* [ ] Property-level authorization.
* [ ] Input validation.
* [ ] Output filtering.
* [ ] Rate limiting.
* [ ] Pagination limits.
* [ ] Resource quotas.
* [ ] Error handling.
* [ ] Audit logging.
* [ ] CSRF where applicable.
* [ ] CORS where applicable.
* [ ] Cache behavior.
* [ ] Idempotency where applicable.

Also test:

* [ ] Duplicate parameters.
* [ ] Duplicate JSON keys.
* [ ] Unknown JSON properties.
* [ ] Type confusion.
* [ ] Null values.
* [ ] Empty values.
* [ ] Negative numbers.
* [ ] Extremely large values.
* [ ] Unicode.
* [ ] Encoded paths.
* [ ] Alternate HTTP methods.
* [ ] Alternate content types.
* [ ] Missing headers.
* [ ] Unexpected headers.
---

## Input Validation Bugs


AI frequently generates validation that checks shape but not security semantics.

* [ ] Validate type.
* [ ] Validate length.
* [ ] Validate range.
* [ ] Validate format.
* [ ] Validate business constraints.
* [ ] Validate ownership.
* [ ] Validate tenant.
* [ ] Validate allowed values.
* [ ] Validate state transitions.
* [ ] Validate resource existence.
* [ ] Validate current authorization.
* [ ] Validate relationships between fields.

Test AI-generated validation against:

* [ ] null
* [ ] empty strings
* [ ] negative values
* [ ] zero
* [ ] extremely large values
* [ ] floating-point values
* [ ] `NaN`
* [ ] infinity
* [ ] Unicode
* [ ] encoded input
* [ ] duplicated parameters
* [ ] extra JSON properties
* [ ] nested objects
* [ ] arrays where scalar expected
* [ ] scalar where array expected
