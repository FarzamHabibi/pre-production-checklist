# Statelessness

Everything that quietly assumes there is exactly one of you.

Most of these are invisible on a single instance and obvious on the second one. They are cheap to fix before you scale out and expensive to diagnose afterwards, because the symptom is usually "it works for some users".

[← all checklists](../README.md)

---


## State in the process

* [ ] Inventory every module-level variable that accumulates across requests — caches, counters, maps, singletons.
* [ ] Verify sessions are in a shared store, not in process memory.
* [ ] Verify rate limiting is shared; per-instance limits multiply by the instance count, which is not the limit you configured.
* [ ] Verify in-memory caches are either safe to be inconsistent between instances or moved to a shared cache.
* [ ] Verify counters, sequence generators and "last seen" values are not held in memory.
* [ ] Verify feature flag state converges across instances within a bounded time, and that a flag flip does not need a deploy.
* [ ] Verify WebSocket or SSE connection state does not assume the same instance handles the next request from that user.
* [ ] Verify anything held in memory is reconstructible after a restart, because instances restart without warning.

## State on disk

* [ ] Verify uploads go to object storage, not to the instance's local filesystem.
* [ ] Verify generated files — exports, thumbnails, PDFs, reports — are written somewhere every instance can read.
* [ ] Verify temp files are cleaned up and are not relied upon across requests.
* [ ] Verify an embedded database file is not being used by something that will run on more than one instance.
* [ ] Verify logs go to a collector rather than to a local file nobody will read after the container exits.
* [ ] Verify no local cache directory is treated as durable.

## Scheduling and startup

* [ ] Verify scheduled work does not run on every instance; three replicas means three copies of the nightly email.
* [ ] Verify in-process timers and intervals are understood to multiply with the instance count.
* [ ] Verify migrations do not run automatically at boot on every instance, racing each other.
* [ ] Verify startup is idempotent and safe to run concurrently.
* [ ] Verify the application starts without needing a warm-up that only the first instance performed.
* [ ] Verify configuration is read at startup from a source every instance can reach, not from a file someone edited on one box.

## Shutdown and routing

* [ ] Verify the process handles a termination signal by draining in-flight requests before exiting.
* [ ] Verify the drain period is shorter than the platform's kill timeout and longer than your slowest normal request.
* [ ] Verify readiness and liveness checks are distinct: readiness controls traffic, liveness controls restarts, and conflating them causes restart loops under load.
* [ ] Verify an instance marks itself not-ready before it stops accepting work.
* [ ] Verify session affinity is not required; if it is, verify what happens when that instance disappears.
* [ ] Verify a rolling deploy does not drop requests, tested rather than assumed.
