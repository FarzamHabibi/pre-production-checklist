# Capacity Model

Before any of the rest of this domain is worth reading: know your numbers.

"Will it scale?" is unanswerable. "Will it survive 500 requests per second with a 40:1 read/write ratio and one tenant holding 30% of the rows?" has an answer, and the work to find it is mostly arithmetic.

[← all checklists](../README.md)

---


## Know where you are

* [ ] Write down current traffic: requests per second at median and at peak, and the ratio between them.
* [ ] Write down the shape of that traffic — steady, daily cycle, weekly cycle, or spiky — because a peak-to-average ratio of 20 is a different system from one of 2.
* [ ] Write down current data volume per table that matters, and how fast each is growing.
* [ ] Write down the read-to-write ratio; it decides whether replicas, caching or sharding is the useful lever.
* [ ] Identify the largest single tenant or account, and what share of the data and traffic it represents.
* [ ] Identify how concentrated traffic is in time — a launch, a newsletter send, a cron, a timezone — because concurrency is what breaks things, not daily totals.
* [ ] Measure current headroom: at what multiple of today's peak does something fail?

## Decide what 10× means here

* [ ] Define which dimension is actually growing — users, requests, data, concurrent connections, or tenants — because they scale differently and rarely together.
* [ ] Verify the growth assumption came from somewhere, even if that somewhere is "the launch plan says 5,000 signups".
* [ ] Identify the resource that runs out first: CPU, memory, disk, database connections, IO, or a third-party quota.
* [ ] Verify that guess has been tested rather than assumed; the answer is very often database connections, and very often surprising.
* [ ] Identify the second thing that breaks, because you will hit it minutes after fixing the first.
* [ ] Verify per-user data growth is bounded, or that a user with a hundred times the average records does not take the system down.

## Decide what you are promising

* [ ] Write down the latency target at p95, and whether you are currently meeting it.
* [ ] Write down the availability target, and whether anyone is actually measuring against it.
* [ ] Write down what an hour of downtime costs, so headroom can be argued in the same units as the bill.
* [ ] Verify the target is for the journey users care about, not for a health endpoint.
* [ ] Verify degraded operation is defined: what gets turned off first when the system is under pressure, and who decides.

## Keep it honest

* [ ] Verify these numbers are written down somewhere the team can find, not held in one person's head.
* [ ] Verify they are revisited after each significant traffic change rather than dated at launch and forgotten.
* [ ] Verify no scaling work has been started before the constraint was identified; buying capacity for the wrong resource is the most common way to spend a month.
