# Monitoring & Alerting

Finding out from your own tooling rather than from a customer. Everything here is about shortening the gap between broken and known.

[← all checklists](../README.md)

---


## Is it up

* [ ] Verify an uptime check runs from more than one region, so a regional network problem is distinguishable from an outage.
* [ ] Verify the check exercises a real user journey — load a page, call an API that touches the database — rather than only a static health endpoint.
* [ ] Verify a health endpoint returns unhealthy when a dependency it needs is down, rather than always returning 200.
* [ ] Verify the health endpoint does not leak version numbers, dependency names or configuration.
* [ ] Verify TLS certificate expiry is monitored with enough warning to act, including on any certificate you renew manually.
* [ ] Verify domain registration expiry is monitored; it is the least sophisticated outage and one of the most common.
* [ ] Verify DNS records are monitored for unexpected change.
* [ ] Verify third-party status pages for your critical dependencies are subscribed to by someone.

## Is it broken

* [ ] Verify error tracking is installed on the backend, the frontend, and any mobile client.
* [ ] Verify releases are tagged in the error tracker so a new error can be tied to the deploy that introduced it.
* [ ] Verify source maps are uploaded so frontend stack traces are readable, and are not publicly served.
* [ ] Verify errors are grouped sensibly rather than arriving as thousands of unique fingerprints.
* [ ] Verify personal data is scrubbed from error payloads before they leave your infrastructure.
* [ ] Verify a new error type creates a notification, and that a known noisy one does not.
* [ ] Verify logs are aggregated somewhere searchable, with a retention period you have chosen.
* [ ] Verify logs are structured, and that a request can be followed across services by a correlation id.
* [ ] Verify background jobs, queues and scheduled tasks report failure — silent failure in an async path is the most expensive kind.
* [ ] Verify a scheduled job that stops running triggers an alert, through a dead-man's-switch or equivalent; nothing failing looks identical to nothing running.

## Is it slow, is it expensive

* [ ] Verify real-user monitoring reports Core Web Vitals from production sessions.
* [ ] Verify request latency is tracked at p95 and p99, not as an average.
* [ ] Verify database, queue and external-call latency are visible separately from total request time.
* [ ] Verify spend has an alert on rate of change, not only a monthly cap.
* [ ] Verify quota and rate-limit consumption against paid third parties is visible before you hit the ceiling.

## Does anyone find out

* [ ] Verify every alert reaches a human through a channel that person actually watches, and that this has been tested by firing one.
* [ ] Verify it is written down who responds out of hours — for a solo founder, that means deciding which alerts are allowed to wake you.
* [ ] Verify every alert is actionable; an alert nobody acts on trains everyone to ignore the channel.
* [ ] Verify alert thresholds have been tuned at least once since launch rather than left at defaults.
* [ ] Verify there is one dashboard that answers "is it working right now" without needing to be interpreted.
* [ ] Verify a public status page exists, or that you have decided deliberately not to have one.
* [ ] Verify a runbook exists for the three most likely failures, written so that a tired person can follow it.
* [ ] Verify an incident communication template exists, so writing to customers is not done from scratch at the worst moment.
* [ ] Verify you can find out what changed — deploys, feature flags, configuration, third-party incidents — on one timeline.
