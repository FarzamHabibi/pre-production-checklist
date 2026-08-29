# Load Testing & Scale Gates

The point of a load test is not to pass. It is to find what breaks first, fix it, and find the next one — and to know the number you can quote when someone asks what the system can take.

[← all checklists](../README.md)

---


## Make the test mean something

* [ ] Verify the test reproduces the real traffic mix — the ratio of reads to writes, the distribution across endpoints, the size of payloads.
* [ ] Verify the test runs against production-sized data; an empty table is fast in a way production never is.
* [ ] Verify the data has realistic distribution, including the one tenant with far more rows than the rest.
* [ ] Verify caches are in a realistic state — an all-hit cache proves nothing, and a fully cold one may be unrealistically harsh.
* [ ] Verify the test exercises authenticated journeys, not only the public homepage.
* [ ] Verify it runs from outside your own network, so it includes the edge, the load balancer and TLS.
* [ ] Verify third-party dependencies are either included or stubbed with realistic latency, not with an instant mock.

## Run it properly

* [ ] Ramp load gradually to find the knee of the curve, rather than running one fixed level and declaring pass or fail.
* [ ] Record what broke first, and at what load; that is the actual result of the test.
* [ ] Fix it, then run again — the second bottleneck is never the same as the first.
* [ ] Run a soak test long enough to expose leaks, connection exhaustion and disk growth.
* [ ] Run a spike test, because a launch or a newsletter is a spike, not a ramp.
* [ ] Measure at p95 and p99; an average latency stays fine long after a quarter of users have given up.
* [ ] Watch the system's own metrics during the test, not just the load tool's output — the tool tells you it hurt, the metrics tell you where.
* [ ] Verify testing against production, if you do it, has a stated blast radius, a kill switch and someone watching.

## The gate

* [ ] Verify the system handles the peak you expect at launch, with a stated multiple of headroom.
* [ ] Verify the load at which it degrades is written down, along with how it degrades.
* [ ] Verify degradation is graceful — shedding load with a 429 or 503 rather than timing out or corrupting state.
* [ ] Verify database connection count at peak stays under its limit with margin.
* [ ] Verify queue backlog at peak drains within an acceptable time once the spike passes.
* [ ] Verify error rate under peak load stays within the target, and that errors are the kind you intended.
* [ ] Verify there is a documented plan for the load you have not tested: what gets turned off, what gets scaled, who decides.
* [ ] Verify the numbers from this test are recorded with the release, so the next test has something to compare against.
