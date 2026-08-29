# The First Fifteen Minutes

**Everything here is used after launch and has to be prepared before it.** The question each item asks is not "did you respond well" — it is **"is the answer already decided?"**

The generic path, before you know what kind of incident this is. Its purpose is to stop you diagnosing while the system burns.

[← all checklists](../README.md)

---


## Notice and declare

* [ ] Verify there is a defined threshold at which something becomes an incident, so the decision is not made by whoever is most anxious.
* [ ] Verify anyone can declare an incident, and that declaring one has no social cost.
* [ ] Verify declaring creates a single place where the response happens — a channel, a document, a call.
* [ ] Verify one person is the coordinator, even if it is a team of one wearing the hat deliberately.
* [ ] Verify a timestamped log of what was observed and what was tried is kept from the start; reconstructing it afterwards is guesswork.

## Stabilise before diagnosing

* [ ] Verify the first move is to stop the harm — roll back, disable the feature, shed load, block the source — not to find the root cause.
* [ ] Verify you have decided in advance what "stop the harm" means for each of your main failure modes.
* [ ] Verify rolling back is understood to be a valid first response, not an admission of defeat.
* [ ] Verify a degraded service is preferred to an unavailable one where that is possible, and that the degraded mode has been tried.
* [ ] Verify actions taken during an incident are announced in the shared channel as they happen, so two people cannot fix the same thing in opposite directions.
* [ ] Verify nobody changes two things at once when the second could mask the first.

## Size it

* [ ] Verify you can answer, within minutes: who is affected, how many, and since when.
* [ ] Verify you can tell whether it is total or partial — one region, one tenant, one endpoint, one browser.
* [ ] Verify you can see what changed recently: deploys, feature flags, config, migrations, third-party incidents, on one timeline.
* [ ] Verify the most recent deploy is the first suspect, because it usually is.
* [ ] Verify you can distinguish "our fault" from "a provider's fault" quickly, because the response is entirely different.

## Escalate

* [ ] Verify you know when to involve a provider's support, and that you have an account tier where that is possible.
* [ ] Verify support contacts and account identifiers are recorded somewhere reachable during the incident.
* [ ] Verify there is a point at which you stop trying and restore from backup instead, decided before you are tired.
* [ ] Verify customers are told before they tell you — see [`07-communication.md`](07-communication.md).
