# Multiple Instances & Regions

What changes when there is more than one of you, and again when they are far apart.

[← all checklists](../README.md)

---


## Coordination

* [ ] Verify anything that must happen exactly once uses leader election or a distributed lock, not the assumption that only one instance exists.
* [ ] Verify distributed locks have a TTL, so a crashed holder does not block forever.
* [ ] Verify lock holders can detect they have lost the lock before acting on it — a lock without fencing is an optimisation, not a guarantee.
* [ ] Verify no logic depends on instance clocks agreeing; assume skew.
* [ ] Verify a cron or scheduler runs from one place, or that the job itself is safe to run concurrently.
* [ ] Verify shared counters and quotas are coordinated rather than tracked per instance.

## Deploys and rollout

* [ ] Verify old and new versions can run simultaneously, because during any rolling deploy they will.
* [ ] Verify the API contract, queue message format and database schema are all compatible in both directions across one release.
* [ ] Verify a canary or staged rollout is possible, and that there is a metric that would stop it.
* [ ] Verify rollback has been performed at least once, not merely documented.
* [ ] Verify a feature flag evaluates consistently for the same user across instances.
* [ ] Verify configuration changes propagate without a deploy where they need to, and cannot half-propagate.

## Distance

* [ ] Verify the application is close to its database; a cross-region query on every request is invisible in development and dominant in production.
* [ ] Verify each region reads from a local replica if latency requires it, and that the resulting lag is acceptable to the feature.
* [ ] Verify writes have a defined home, and that conflicting writes from two regions are either impossible or resolved deliberately.
* [ ] Verify static assets and cacheable responses are served from the edge rather than from the origin region.
* [ ] Verify data residency requirements are met by where the data actually lives, including backups and logs.

## Failure of a whole thing

* [ ] Verify the loss of one instance is invisible to users, tested by killing one.
* [ ] Verify the loss of an availability zone is survivable, or that the decision not to survive it is deliberate and costed.
* [ ] Verify failover is automatic or that the manual runbook has been rehearsed and timed.
* [ ] Verify split brain is impossible or detected — two primaries accepting writes is worse than an outage.
* [ ] Verify recovery time and recovery point objectives are numbers someone has measured, not aspirations.
* [ ] Verify the system recovers on its own after the dependency comes back, without a manual restart.
