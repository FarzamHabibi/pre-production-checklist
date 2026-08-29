# Data Loss & Corruption

**Everything here is used after launch and has to be prepared before it.** The question each item asks is not "did you respond well" — it is **"is the answer already decided?"**

A bad migration, a `DELETE` without a `WHERE`, a corrupted table, a well-meaning script. The plan for this is a backup you have restored, not a backup you have taken.

[← all checklists](../README.md)

---


## Backups that work

* [ ] Verify backups run automatically, and that a failed backup raises an alert rather than a silent gap.
* [ ] Verify you have **restored from backup end to end** at least once, into a usable environment.
* [ ] Verify how long a full restore takes, measured rather than estimated — that number is your worst case.
* [ ] Verify the restore time is acceptable at your current data size, and re-measure as it grows.
* [ ] Verify point-in-time recovery is available and that its window covers how long a problem could go unnoticed.
* [ ] Verify backups are stored somewhere separate from the primary, and that an attacker with production access cannot delete them.
* [ ] Verify backup retention and immutability are set deliberately, including against ransomware.
* [ ] Verify backups are encrypted and that the decryption key is not stored only alongside them.
* [ ] Verify what is *not* backed up is known and accepted — object storage, search indexes, caches, queue contents, secrets.

## Recovering part of it

* [ ] Verify you can restore a single table, or a single tenant's rows, without rolling the whole database back.
* [ ] Verify there is a procedure for extracting old rows from a restored copy and merging them into live data.
* [ ] Verify soft deletes exist where accidental deletion is plausible, and that they are actually recoverable.
* [ ] Verify cascading deletes are understood before you rely on a restore — one deleted parent row can take a great deal with it.
* [ ] Verify object storage has versioning enabled where the files matter.
* [ ] Verify the recovery procedure has been written down by someone who has performed it.

## When a migration goes wrong

* [ ] Verify every migration has a rollback path, or an explicit note that it does not and why.
* [ ] Verify a destructive migration is preceded by a fresh backup, taken as part of the deploy rather than as a habit.
* [ ] Verify a data backfill is reversible or idempotent.
* [ ] Verify a long migration can be stopped safely part-way without leaving the schema inconsistent.
* [ ] Verify migrations have been rehearsed against a production-sized copy — see [`scale/03-database.md`](../scale/03-database.md).

## Corruption and consistency

* [ ] Verify you would notice silent corruption: checksums, row counts, referential integrity checks, or a reconciliation job.
* [ ] Verify a reconciliation exists for anything that must agree with an external system — payments, inventory, subscriptions.
* [ ] Verify you can tell when the corruption started, since restoring past it is the whole task.
* [ ] Verify replicas are checked for divergence rather than assumed identical.
* [ ] Verify restored data is validated before traffic is sent to it — record counts, a spot check, a smoke test.
* [ ] Verify there is a decision recorded about what to do with writes that happened after the restore point.
