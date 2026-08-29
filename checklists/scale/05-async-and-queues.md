# Async Work & Queues

Moving work out of the request is the standard fix for latency and the standard source of the next class of bug: work that runs twice, out of order, or never.

[← all checklists](../README.md)

---


## What belongs where

* [ ] Verify anything the user does not need to wait for has been moved out of the request — email, thumbnails, webhooks, exports, indexing.
* [ ] Verify the user is told what happened when work moves to the background, rather than being shown a success that has not happened yet.
* [ ] Verify nothing critical to correctness relies on a background job completing, without a way to detect that it did not.
* [ ] Verify workers scale independently of web instances, so a backlog does not require scaling the front end.

## Correctness

* [ ] Verify every job is idempotent; queues deliver at least once, so every job will eventually run twice.
* [ ] Verify idempotency is enforced by a key the job owns, not by hoping duplicates do not happen.
* [ ] Verify a job that sends money, email or a notification cannot send twice on retry.
* [ ] Verify jobs tolerate their input having changed or been deleted between enqueue and execution.
* [ ] Verify job payloads carry an identifier rather than a snapshot of mutable data, or that the snapshot is intentional.
* [ ] Verify the ordering guarantee you depend on actually exists in the queue you chose; most give none across partitions.
* [ ] Verify a write to the database and the event announcing it cannot diverge — use a transactional outbox or accept and document the gap.

## Failure

* [ ] Verify retries use exponential backoff with jitter, and a maximum attempt count.
* [ ] Verify a permanently failing message goes to a dead-letter queue rather than retrying forever.
* [ ] Verify someone looks at the dead-letter queue, and that it alerts when it is not empty.
* [ ] Verify one poison message cannot block the whole queue behind it.
* [ ] Verify the visibility or lease timeout exceeds the slowest normal run, or long jobs will be redelivered while still running.
* [ ] Verify a worker killed mid-job leaves the system in a recoverable state.
* [ ] Verify a failing downstream dependency causes jobs to back off rather than to hammer it.

## Flow control

* [ ] Verify queue depth is monitored with an alert, and that the alert threshold reflects how long the backlog would take to drain.
* [ ] Verify producers cannot outpace consumers indefinitely without anyone noticing.
* [ ] Verify an unauthenticated or cheap request cannot enqueue expensive work without limit.
* [ ] Verify fan-out is bounded — one event producing ten thousand jobs is a self-inflicted load test.
* [ ] Verify a high-volume low-priority job type cannot starve a low-volume critical one.
* [ ] Verify payload size is bounded, and that large data is passed by reference to object storage rather than through the queue.
* [ ] Verify batching is used where per-item overhead dominates, and not where it delays the first result.

## Visibility

* [ ] Verify job duration, failure rate and queue wait time are measured per job type.
* [ ] Verify a job type that stops being enqueued triggers an alert; nothing running looks exactly like nothing failing.
* [ ] Verify a scheduled job has a dead-man's switch, so a silent scheduler failure is detected.
* [ ] Verify a correlation id links a job back to the request that created it.

## Realtime and fan-out

* [ ] Verify the number of concurrent WebSocket or SSE connections a single instance can hold is known, and what happens at that number.
* [ ] Verify connections are distributed across instances rather than pinned, so one instance is not the ceiling for the whole product.
* [ ] Verify a message published to a channel with many subscribers has a bounded fan-out cost, and that you know what happens at ten times the current subscriber count.
* [ ] Verify a client that disconnects and reconnects does not replay the entire history, and that it can catch up without a full resync.
* [ ] Verify presence and typing indicators — the highest-frequency, lowest-value messages — are throttled or coalesced.
* [ ] Verify a slow consumer is dropped or buffered with a limit, rather than allowed to hold memory on the server indefinitely.
* [ ] Verify reconnect storms are handled: a deploy disconnects every client at once, and they will all reconnect at once unless the backoff is jittered.
* [ ] Verify the realtime layer degrades to polling rather than breaking, if the product can tolerate it.
* [ ] Verify realtime delivery is not the only path for anything that must not be lost; it is a delivery optimisation, not a queue.
* [ ] Verify authorisation is re-checked on subscribe and on each message, not only at connection time — a long-lived connection outlives a permission change.
