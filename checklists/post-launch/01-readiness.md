# Can You Act At All

**Everything here is used after launch and has to be prepared before it.** The question each item asks is not "did you respond well" — it is **"is the answer already decided?"**

Before any specific scenario: the things that decide whether you can do anything when one arrives. Most of these fail not because they are hard but because nobody checked them while everything was working.

Detection is covered elsewhere — [`security/core/16-monitoring-and-response.md`](../security/core/16-monitoring-and-response.md) and [`integrations/06-monitoring-and-alerting.md`](../integrations/06-monitoring-and-alerting.md) make sure you find out. This file is about what happens next.

[← all checklists](../README.md)

---


## Who and how

* [ ] Verify it is written down who responds to a production incident, including out of hours, and that the person knows.
* [ ] For a solo founder: verify you have decided which alerts are allowed to wake you and which can wait until morning, rather than treating all of them as either.
* [ ] Verify there is a second person who can act if the first is unreachable, or a written acceptance that there is not.
* [ ] Verify the alerting channel has been tested by firing a real alert, not assumed to work.
* [ ] Verify alerts reach a device that is on at night if the service matters at night.
* [ ] Verify the person who responds knows where the runbooks are without searching.

## Access when you need it

* [ ] Verify you can reach the production console, the database and the deploy pipeline from a phone or a borrowed laptop.
* [ ] Verify two-factor recovery codes for every critical account are stored somewhere you can reach when your laptop is the thing that is broken.
* [ ] Verify the password manager is not the single point of failure for its own recovery.
* [ ] Verify credentials are not held only by one person, and that a break-glass path exists and has been tested.
* [ ] Verify the break-glass path is auditable — using it should be loud, not silent.
* [ ] Verify you can still authenticate if the identity provider is the thing that is down.
* [ ] Verify domain registrar and DNS provider access is not tied to an email address hosted on the domain itself.

## Can you actually change anything

* [ ] Verify you can deploy right now — not in principle, but by having deployed recently.
* [ ] Verify a deploy does not require a person who is on holiday, a machine that is off, or a token that expired.
* [ ] Verify CI is green on `main`, so an emergency fix is not blocked behind an unrelated failure.
* [ ] Verify you can deploy a one-line change end to end in under fifteen minutes, and know what that number actually is.
* [ ] Verify you can roll back without a rebuild — see [`06-rollback-and-kill-switches.md`](06-rollback-and-kill-switches.md).
* [ ] Verify you can scale up or shed load without a code change.

## Know what you have

* [ ] Verify there is a current list of what runs in production: services, databases, queues, cron jobs, third parties, domains.
* [ ] Verify each one has an owner, even if every owner is you.
* [ ] Verify you know which provider hosts what, and which account it is billed to.
* [ ] Verify a diagram or written description of the request path exists that a new person could follow.
* [ ] Verify you know which single failure would take everything down, and whether that is acceptable.

## Will you notice before a customer does

Every check above assumes you already know something is wrong. These ask how you find out.

* [ ] Verify something exercises the critical paths on a schedule after deploy — signup, login, checkout, the one action the product exists for — and not only in CI before merge.
* [ ] Verify a failed run reaches a person, rather than a dashboard nobody opens.
* [ ] Verify you know how long a silent regression could last before anyone noticed: an hour, a day, or until a customer wrote in.
* [ ] Verify the checks run against production or a production-like environment, since the ones that only ever ran against a local stub have never tested your real configuration.
* [ ] Verify someone is accountable for a failing scheduled check, or it becomes noise that everyone learns to skip.
* [ ] Verify a check that has been failing for a week is treated as an outage in the monitoring, not as a known issue.

### When the thing that watches stops watching

The items above ask whether anything is checking. These ask whether the checker is still
alive, and whether it can still reach you — a different failure, and a quieter one.

* [ ] Verify something outside the check itself asserts that it produced a pass or a fail recently — a clock asking "has this reported in the last N hours", not the check reporting its own health.
* [ ] Verify a run that is killed rather than failed still alerts: a runner timeout is usually recorded as cancelled, not as a failure, so alerting keyed on failure fires nothing at all.
* [ ] Verify the alerting path itself fails loudly when its credential is missing or expired, rather than skipping the step and leaving the job green.
* [ ] Verify a step conditioned on a secret being present cannot pass by being skipped — an unset key should turn the build red, not quietly remove the notification.
* [ ] Verify every HTTP call in a check fails on an error status, since a plain `curl` exits zero on 401 or 404 and a check reading its empty output concludes nothing is wrong.
* [ ] Verify you have looked at the run history, not the last run: consecutive cancellations and a silent inbox look identical to a system finding nothing wrong.

## The gate

* [ ] Verify a runbook exists for the three most likely failures before launch, not after the first one.
* [ ] Verify at least one recovery procedure has been rehearsed end to end.
* [ ] Verify launching without a prepared response is a recorded decision with a date to revisit, rather than an oversight.
