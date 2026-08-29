# Learning & Drills

**Everything here is used after launch and has to be prepared before it.** The question each item asks is not "did you respond well" — it is **"is the answer already decided?"**

The part everyone skips, which is why the second occurrence of an incident is so often identical to the first.

[← all checklists](../README.md)

---


## Postmortems

* [ ] Verify a written postmortem follows every significant incident, within days rather than weeks.
* [ ] Verify it is blameless in practice, not only in policy — a postmortem that names a culprit stops producing information.
* [ ] Verify it records a timeline, what was actually observed, and what was tried and did not work.
* [ ] Verify it asks why detection took as long as it did, separately from why the failure happened.
* [ ] Verify it asks what would have made the response faster, not only what would have prevented the cause.
* [ ] Verify near misses get a postmortem too; they are the same lesson at a lower price.

## Actions that actually happen

* [ ] Verify every action item has an owner and a date, or it is not an action item.
* [ ] Verify action items are tracked in the same place as normal work, not in the postmortem document where they will die.
* [ ] Verify the number of open incident actions is visible to whoever prioritises work.
* [ ] Verify a repeated incident triggers a check of whether the previous actions were completed.
* [ ] Verify at least one action from each postmortem improves detection or response, not only prevention.

## Practice

* [ ] Verify a restore from backup is rehearsed on a schedule, not only after a scare.
* [ ] Verify failover has been triggered deliberately at least once.
* [ ] Verify a rollback is performed periodically so the path stays working.
* [ ] Verify every kill switch is exercised on a cadence, since an untested switch is a hypothesis.
* [ ] Verify at least one incident scenario is walked through as an exercise before launch — reading the runbook aloud and finding the step that is wrong is most of the value.
* [ ] Verify the runbooks are updated by whoever last used them, while it is fresh.
* [ ] Verify a runbook that has never been used is treated as unverified.
* [ ] Verify recovery objectives are re-measured as the system grows, since restore time and data volume move together.
