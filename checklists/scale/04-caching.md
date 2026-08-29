# Caching

The fastest way to survive load, and the fastest way to serve one customer another customer's data. Both properties come from the same decision: the cache key.

[← all checklists](../README.md)

---


## What and for whom

* [ ] Verify every cache key includes the tenant, user or role when the cached value differs by any of them.
* [ ] Verify authenticated responses are never stored in a shared or public cache.
* [ ] Verify a cached fragment rendered for an admin cannot be served to a normal user.
* [ ] Verify what is cached was chosen because it is expensive and repeated, not because it was easy to wrap.
* [ ] Verify a TTL was chosen per cache rather than inherited from a library default.
* [ ] Verify the staleness each TTL allows is acceptable to whoever owns that data.

## Invalidation

* [ ] Verify an invalidation path exists for every cache whose data can change.
* [ ] Verify invalidation has been tested, not merely written.
* [ ] Verify a deploy that changes the shape of cached data either changes the key or clears the cache.
* [ ] Verify cache keys are versioned so a rollback does not read data written by the newer format.
* [ ] Verify partial invalidation is possible where clearing everything would stampede the origin.

## Behaviour under load

* [ ] Verify a popular expiring key does not send every concurrent request to the origin; use a lock, request coalescing, or stale-while-revalidate.
* [ ] Verify TTLs carry jitter so a batch of keys written together does not expire together.
* [ ] Verify misses are cached too, where a stream of requests for a nonexistent record would otherwise hit the database every time.
* [ ] Verify the cache has a memory limit and an eviction policy, and that the policy is the one you want.
* [ ] Verify eviction under pressure degrades performance rather than returning errors.
* [ ] Verify the origin can survive a completely cold cache — that is what a cache restart or a flush gives you, without warning.
* [ ] Verify hit ratio is monitored per cache, so a change that quietly stops caching is visible.
* [ ] Verify serialisation cost is measured; for small values it can exceed the cost of recomputing.

## Layers and dependencies

* [ ] Verify each cache layer — browser, CDN, application, database — has a deliberate role rather than overlapping by accident.
* [ ] Verify the CDN caches what it can and that the hit ratio is watched.
* [ ] Verify a cache outage degrades the application rather than taking it down; a hard dependency on a cache is not a cache.
* [ ] Verify cache client timeouts are short, so a slow cache is faster to skip than to wait for.
* [ ] Verify the cache is not being used as a durable store for anything you cannot regenerate.
* [ ] Verify cache warming exists if a cold start would be unacceptable, and that it is not itself a thundering herd.
