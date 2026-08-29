# Backend & Delivery

Everything before the browser has anything to work with. A perfect front end cannot rescue a slow first byte.

[← all checklists](../README.md)

---


## Time to first byte

* [ ] Measure TTFB separately for cached and uncached responses, and know which one most users get.
* [ ] Break server response time into its parts — routing, authentication, database, template rendering, serialisation — and know which dominates.
* [ ] Verify no page render performs an N+1 query pattern.
* [ ] Verify queries on the render path are indexed for the access pattern they actually use.
* [ ] Verify external API calls on the render path are parallel where they are independent, and have timeouts.
* [ ] Verify a slow third-party dependency degrades the page rather than holding the response open.
* [ ] Verify serverless cold starts are measured, and mitigated if they land on user-facing routes.
* [ ] Verify the application is deployed close to its users, or that the parts that need to be are.
* [ ] Verify the database is close to the application; a cross-region query on every request is invisible locally and obvious in the field.

## Caching

* [ ] Verify static assets have content-hashed URLs and a long `max-age` with `immutable`.
* [ ] Verify HTML is not cached with the same policy as assets, and that a deploy is visible immediately.
* [ ] Verify `stale-while-revalidate` is used where a slightly old response is better than a slow one.
* [ ] Verify the CDN caches what it can, and that the cache hit ratio is monitored rather than assumed.
* [ ] Verify cache keys do not include something that varies per user unnecessarily — a cookie, a query parameter, a header.
* [ ] Verify authenticated responses are never cached publicly.
* [ ] Verify `Vary` is correct so compressed and uncompressed, or different formats, are not served to the wrong client.
* [ ] Verify conditional requests work: `ETag` or `Last-Modified` returning 304 rather than the whole body.
* [ ] Verify an application-level cache exists for expensive computed responses, with an invalidation path that someone has tested.

## Transfer

* [ ] Verify compression is enabled — Brotli where supported, gzip otherwise — for text, JSON, CSS, JS and SVG.
* [ ] Verify already-compressed formats are not being compressed again.
* [ ] Verify HTTP/2 is in use, and HTTP/3 where the CDN supports it.
* [ ] Verify TLS session resumption is working so repeat visits skip a full handshake.
* [ ] Verify the number of distinct origins the page connects to is small; each one costs DNS, TCP and TLS.

## API and payload

* [ ] Verify API responses return what the page needs and not the entire record set.
* [ ] Verify the client does not make a waterfall of dependent requests where one combined request would do.
* [ ] Verify pagination is used, with a sane default page size.
* [ ] Verify large lists support incremental or cursor-based loading rather than fetching everything.
* [ ] Verify response payloads are measured; a 2MB JSON response costs parse time as well as transfer.

## Origin and infrastructure

* [ ] Verify database connection pooling is configured for the instance count, so a scale-up does not exhaust connections.
* [ ] Verify identical concurrent requests are coalesced rather than each doing the same expensive work.
* [ ] Verify a GraphQL or flexible API cannot be asked for a response far more expensive than the page needs.
* [ ] Verify the compression level is chosen deliberately; maximum Brotli on dynamic responses can cost more CPU time than it saves in transfer.
* [ ] Verify keep-alive timeouts on the origin exceed the load balancer's, so connections are not closed mid-request.
* [ ] Verify DNS TTL is low enough to fail over and high enough not to pay for a lookup on every visit.
* [ ] Verify an origin shield or tiered cache is used if many edge locations are pulling the same objects.
* [ ] Verify incremental or on-demand regeneration, if used, serves stale content while revalidating rather than blocking.
* [ ] Verify health checks and monitoring probes are not a meaningful share of origin load.
* [ ] Verify background jobs cannot starve the request path of CPU or database connections.
* [ ] Verify the response is streamed where the framework allows it, so the browser starts parsing before the server finishes.
* [ ] Verify large responses are paginated or streamed rather than buffered entirely in memory first.
