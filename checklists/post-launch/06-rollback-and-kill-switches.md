# Rollback & Kill Switches

**Everything here is used after launch and has to be prepared before it.** The question each item asks is not "did you respond well" — it is **"is the answer already decided?"**

The fastest fix is almost always undo. That only holds if undo was built before it was needed.

[← all checklists](../README.md)

---


## Rolling back code

* [ ] Verify you can roll back to the previous release without rebuilding it.
* [ ] Verify you have rolled back at least once, deliberately, rather than only planned to.
* [ ] Verify how long a rollback takes, measured.
* [ ] Verify previous build artifacts are retained long enough to roll back to more than one release ago.
* [ ] Verify a rollback does not require the person who deployed.
* [ ] Verify rolling back the application does not leave the database in a state the old code cannot read — see [`scale/03-database.md`](../scale/03-database.md).
* [ ] Verify a release that cannot be rolled back is identified as such before it ships, not after.

## Switches that must already exist

* [ ] Verify every risky new feature ships behind a flag that can be turned off without a deploy.
* [ ] Verify the flag system itself does not depend on the thing that might be broken.
* [ ] Verify a flag defaults to the safe value if the flag service is unreachable.
* [ ] Verify there is a kill switch for each expensive or externally-facing capability: outbound fetching, email, SMS, model calls, signups, uploads.
* [ ] Verify each kill switch has been exercised in production at least once.
* [ ] Verify you can put the whole service into read-only mode, if the data model allows it.
* [ ] Verify you can disable a single tenant or account without affecting others.
* [ ] Verify turning something off is reversible and that turning it back on is also tested.

## Undoing data and config

* [ ] Verify configuration changes are versioned and revertible, including anything changed in a provider's console.
* [ ] Verify infrastructure changes go through code where possible, so the previous state is recoverable.
* [ ] Verify a DNS or edge configuration change can be reverted quickly, and that you know the propagation delay.
* [ ] Verify a bad bulk operation can be undone — either it was reversible, or a backup was taken first.
* [ ] Verify someone reviews destructive one-off scripts before they run against production, even if that someone is you an hour later.
