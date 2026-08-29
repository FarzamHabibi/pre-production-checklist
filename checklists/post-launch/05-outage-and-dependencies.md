# Outages & Dependency Failure

**Everything here is used after launch and has to be prepared before it.** The question each item asks is not "did you respond well" — it is **"is the answer already decided?"**

You are down, or something you cannot fix is. The useful preparation is knowing which of the two it is within minutes, and having decided what you do in each case.

[← all checklists](../README.md)

---


## Your own outage

* [ ] Verify there is a written first response for "the site is down", and that it starts with checking what changed rather than reading code.
* [ ] Verify you can tell the difference between the application being down, the database being unreachable, and DNS failing — from outside your own network.
* [ ] Verify you have an external check you trust, so you are not debugging a problem that only exists on your machine.
* [ ] Verify you can restart or redeploy the service without waiting for a build.
* [ ] Verify you can serve a static maintenance page without the application being up, and that you have tried.
* [ ] Verify a health check flapping cannot restart-loop the service into a worse state.
* [ ] Verify the runbook says who to tell and when, not only what to type.

## The connection is gone

* [ ] Verify certificate expiry is monitored with enough lead time, including on any certificate renewed manually.
* [ ] Verify domain registration auto-renews, and that the card on file is not expired.
* [ ] Verify registrar and DNS accounts have recovery paths that do not depend on email at the affected domain.
* [ ] Verify you know how to fail DNS over, and how long the TTL means it will take.
* [ ] Verify a CDN or edge outage has a decided response — wait, bypass, or switch — rather than being discovered as a question.
* [ ] Verify you can bypass the CDN and serve from origin if the origin can take it, and know whether it can.
* [ ] Verify database connection exhaustion has a specific response, since it is the most common cause of a total outage that is not a deploy.

## Someone else's outage

* [ ] Verify every critical third party is listed with what breaks if it disappears.
* [ ] Verify each one has a subscribed status page, so you find out from them rather than from a customer.
* [ ] Verify the failure mode of each dependency is decided: fail closed, fail open, queue, or degrade.
* [ ] Verify authentication provider downtime does not lock out every existing session as well as new logins.
* [ ] Verify payment provider downtime has a decided behaviour — queue the intent, or refuse cleanly with an honest message.
* [ ] Verify email or SMS provider downtime does not silently drop messages that should be retried.
* [ ] Verify a timeout and circuit breaker exists on every outbound call, so their outage is not automatically yours.
* [ ] Verify a slow dependency degrades rather than exhausting your workers — see [`scale/05-async-and-queues.md`](../scale/05-async-and-queues.md).
* [ ] Verify you know which dependency has no fallback at all, and that this is a recorded decision.

## Capacity and load

* [ ] Verify there is a decided response to a traffic spike: scale, shed, queue, or turn off the expensive feature.
* [ ] Verify you can turn off an expensive feature without a deploy.
* [ ] Verify a spike caused by abuse is handled differently from a spike caused by success, and that you can tell them apart — see [`security/core/18-abuse-and-availability.md`](../security/core/18-abuse-and-availability.md).
* [ ] Verify the autoscaling ceiling is high enough to survive a real spike and low enough not to bankrupt you.
