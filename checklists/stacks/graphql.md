# GraphQL

Items from the domain checklists that are specific to **GraphQL**. If you do not use it, skip this file entirely — the domain checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify introspection is disabled in production, or that exposing the full schema is a deliberate decision.
* [ ] Verify query depth is limited; a recursive relationship makes one request arbitrarily expensive.
* [ ] Verify query complexity is scored and capped, since depth alone does not stop a wide query.
* [ ] Verify aliases are counted — the same expensive field requested two hundred times under different aliases bypasses a naive per-field limit.
* [ ] Verify batched operations in one request are limited, and that batching cannot be used to brute-force a login mutation past rate limiting.
* [ ] Verify a persisted-query allowlist is used if clients are all your own.
* [ ] Verify errors do not return stack traces or the underlying database message.
* [ ] Verify suggestions in error messages ("did you mean…") are off, since they leak schema even with introspection disabled.
* [ ] Verify a query timeout exists at the resolver level, not only at the HTTP layer.

## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify authorization is enforced per field, not only at the top-level resolver; a nested field is a second entry point to the same data.
* [ ] Verify a field returning another type cannot be used to walk to records the caller may not read.
* [ ] Verify mutations check authorization independently rather than trusting a preceding query.
* [ ] Verify node or global-id lookups do not resolve arbitrary objects by id without an ownership check.
* [ ] Verify the schema does not expose internal fields that exist only for the admin client.

## Database at Scale
<sub>from [`scale/03-database.md`](../scale/03-database.md)</sub>

* [ ] Verify N+1 resolution is batched with a dataloader; the shape of GraphQL makes N+1 the default rather than the mistake.
* [ ] Verify pagination is cursor-based and that a caller cannot request an unbounded list.
* [ ] Verify a nested list-within-list query cannot multiply into a query count nobody bounded.

## JavaScript
<sub>from [`performance/04-javascript.md`](../performance/04-javascript.md)</sub>

* [ ] Verify the client does not ship the entire schema or unused fragments to the browser.
* [ ] Verify cache normalisation is configured so a field update does not invalidate an entire view.
