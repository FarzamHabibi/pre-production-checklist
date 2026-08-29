# Database at Scale

The database is where most products actually stop scaling, and usually for one of a dozen well-known reasons rather than anything exotic.

[← all checklists](../README.md)

---


## Queries and indexes

* [ ] Run `EXPLAIN ANALYZE` on the ten slowest queries in production, against production-sized data.
* [ ] Verify every foreign key used in a join or filter has an index; the constraint does not create one in every engine.
* [ ] Verify composite index column order matches how the queries actually filter and sort.
* [ ] Verify no query on a hot path performs a sequential scan on a large table.
* [ ] Verify unused indexes are removed — each one is a cost on every write and on every vacuum.
* [ ] Verify N+1 patterns are found by counting queries per request, not by reading code.
* [ ] Verify the ORM is not lazily loading a relation inside a loop that iterates over a page of results.
* [ ] Verify `COUNT(*)` on a large table is not run to render a page; use an estimate or a maintained counter.
* [ ] Verify deep `OFFSET` pagination is replaced by keyset or cursor pagination before the offsets get large.
* [ ] Verify sorting and filtering by a user-supplied column cannot select an unindexed one.
* [ ] Verify queries on JSON columns are supported by an appropriate index, or moved into real columns.
* [ ] Verify full-text search is either properly indexed or moved to a dedicated engine, not implemented with `LIKE '%…%'`.
* [ ] Verify aggregate queries over large ranges are pre-computed or materialised rather than run per request.
* [ ] Verify a statement timeout is set, so one runaway query cannot hold a connection indefinitely.
* [ ] Verify slow queries are logged and that someone reads the log.

## Connections

* [ ] Verify the connection pool size times the maximum instance count does not exceed the database's connection limit.
* [ ] Verify that arithmetic includes background workers, cron containers, migrations and any admin tooling.
* [ ] Verify serverless functions use a pooler rather than opening a connection per invocation.
* [ ] Verify the pooler's mode is compatible with what the application does — transaction pooling breaks prepared statements, `SET` state and advisory locks held across statements.
* [ ] Verify connection acquisition timeout is set, so exhaustion surfaces as a fast error rather than a hang.
* [ ] Verify `CONN_MAX_AGE` or equivalent is tuned; both a new connection per request and an infinitely reused one have failure modes.
* [ ] Verify connection count is monitored with an alert before the ceiling, not at it.

## Locks and transactions

* [ ] Verify transactions are as short as possible, and that no external HTTP call happens inside one.
* [ ] Verify no transaction stays open across a user interaction.
* [ ] Verify hot-row contention is identified — a counter, a balance, a sequence — and handled with a suitable pattern rather than a longer lock.
* [ ] Verify `SELECT … FOR UPDATE` locks the narrowest set of rows that correctness requires.
* [ ] Verify lock ordering is consistent across code paths, so two operations cannot deadlock by acquiring in opposite order.
* [ ] Verify deadlocks are logged and counted rather than silently retried forever.
* [ ] Verify the isolation level is chosen deliberately, and that the code's assumptions match it.
* [ ] Verify long-running analytical queries do not run against the primary during peak.

## Migrations

* [ ] Verify migrations are backward compatible so that old and new code can run simultaneously during a rolling deploy.
* [ ] Verify schema changes follow expand-then-contract: add, backfill, switch reads, stop writes, drop — not a single destructive step.
* [ ] Verify adding a column with a default, changing a type, or adding a constraint does not take a lock that blocks writes on a large table.
* [ ] Verify indexes on large tables are created concurrently where the engine supports it.
* [ ] Verify a backfill runs in batches with pauses, rather than one statement over ten million rows.
* [ ] Verify a migration lock timeout is set so a blocked migration fails fast instead of queueing every write behind it.
* [ ] Verify migrations have been rehearsed against a production-sized copy, with the duration recorded.
* [ ] Verify there is a rollback plan for each migration, or an explicit acceptance that there is not.

## Growth and topology

* [ ] Identify which tables grow without bound — events, audit logs, notifications, sessions, webhook deliveries.
* [ ] Verify each of those has a retention policy, an archival path, or partitioning.
* [ ] Verify time-series tables are partitioned before they become painful to partition.
* [ ] Verify deletes at scale are batched; a single `DELETE` over millions of rows is an outage.
* [ ] Verify autovacuum or equivalent maintenance is keeping up, and that bloat is monitored.
* [ ] Verify read replicas are used for what can tolerate lag, and that replica lag is monitored.
* [ ] Verify read-after-write consistency where the user expects it — reading their own change from a lagging replica is a bug report you will not reproduce.
* [ ] Verify failover has been tested, and that the application reconnects rather than staying broken.
* [ ] Verify backup restore has been performed end to end and timed, because restore duration at ten times the data is the number that matters.
* [ ] Verify point-in-time recovery covers the window you would actually need.
