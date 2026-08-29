# Service Levels

The rest of this domain is about capacity. None of it says how you decide the system is
*good enough*, which is the question every scaling decision actually turns on.

Without a stated service level, "is it fast enough" is an argument. With one, it is a
measurement, and the answer to "should we spend a week on this" stops depending on who is
in the room.

[← all checklists](../README.md)

---

## Pick what to measure

* [ ] Write down the two or three user journeys whose health actually represents the product working — not every endpoint, and not the health check.
* [ ] For each, choose an indicator a user would recognise: did the request succeed, how long did it take, was the data current.
* [ ] Verify each indicator is measured where the user is, not where it is convenient — at the edge or in the client, not at the application after the load balancer has already absorbed the slow part.
* [ ] Verify latency is measured as a distribution, not an average; an average stays healthy long after a quarter of requests have become unusable.
* [ ] Verify the success indicator counts what the user experiences as failure, including a 200 response that renders an error.
* [ ] Verify indicators are attributable — you can tell which journey, which tenant and which region a breach came from without writing a new query.
* [ ] Verify you are not measuring so many things that nothing is watched. Three indicators someone looks at beat thirty nobody does.

## Set a target you would actually defend

* [ ] Write down a target for each indicator, as a number and a window: for example 99.5% of checkout requests under 800ms, measured over 28 days.
* [ ] Verify the target came from what users need rather than from what the system currently does — a target set to today's performance can never be missed and never informs anything.
* [ ] Verify the target is not 100%. A target you cannot miss is a target that cannot tell you to slow down.
* [ ] Verify the cost of the next nine has been considered before promising it; each one is roughly an order of magnitude more work.
* [ ] Verify a different target exists for journeys with genuinely different stakes — a payment and an avatar upload should not share one.
* [ ] Verify the target is written where a person deciding what to build next will see it.

## Error budgets

* [ ] Verify the error budget is stated explicitly: a 99.5% target over 28 days is about 3.4 hours of failure you have agreed to tolerate.
* [ ] Verify the budget is tracked as it is consumed, not calculated after the month ends.
* [ ] Verify there is a written rule for what happens when it runs out — usually: stop shipping features, spend the next work on reliability.
* [ ] Verify the rule has been agreed by whoever prioritises work, since it is a commitment about their roadmap and not a technical setting.
* [ ] Verify an unusually *untouched* budget prompts a question too; it usually means the target is too loose or you are over-provisioning.
* [ ] Verify planned maintenance is either inside the budget or explicitly excluded, and that the choice is written down.
* [ ] Verify burn rate is alerted on, not only total consumption — spending a month's budget in an hour is an incident regardless of the total.

## Alert on symptoms

* [ ] Verify alerts fire on the indicators above rather than on causes; high CPU is worth a dashboard, a failing journey is worth waking someone.
* [ ] Verify a fast burn and a slow burn are handled differently: one pages, the other opens a ticket.
* [ ] Verify every paging alert corresponds to something a user is experiencing right now.
* [ ] Verify an alert that has fired three times without anyone acting is either fixed or deleted.

## What the measurement costs

* [ ] Verify metric cardinality is bounded — a label carrying a user id, a request id or a URL with parameters multiplies series until the bill or the query time becomes the problem.
* [ ] Verify trace sampling is deliberate, with a rate chosen rather than inherited, and that errors are sampled at a higher rate than successes.
* [ ] Verify log volume is measured and budgeted; observability spend routinely overtakes the infrastructure it observes.
* [ ] Verify retention differs by signal — raw traces for days, aggregated indicators for a year, because the questions asked of each are different.
* [ ] Verify the observability stack itself has a capacity limit, and that hitting it degrades collection rather than the application.
* [ ] Verify a dashboard exists that answers "are we meeting the target" without interpretation, and that it is the one people actually open.
