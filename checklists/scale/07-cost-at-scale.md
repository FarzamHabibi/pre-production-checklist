# Cost at Scale

Scaling problems and billing problems are the same problem seen from different sides. A system that survives ten times the traffic at eleven times the cost has scaled; at a hundred times the cost, it has not.

[← all checklists](../README.md)

---


## Unit economics

* [ ] Calculate the infrastructure cost of one request, one active user, and one tenant.
* [ ] Verify which costs scale linearly with usage and which scale worse than linearly.
* [ ] Identify the query, job or endpoint with the worst cost per invocation.
* [ ] Verify a feature's cost is attributable, so an expensive one can be found without guessing.
* [ ] Verify the cost of your largest tenant is known, and that the pricing covers it.
* [ ] Verify free-tier or trial usage has a ceiling, in resource terms as well as in time.

## Where the bill actually comes from

* [ ] Verify egress bandwidth is measured; it is frequently larger than compute and rarely modelled.
* [ ] Verify log and metric volume is measured — observability spend routinely overtakes the infrastructure it observes.
* [ ] Verify per-call third-party costs are metered per user: model tokens, SMS, email, geocoding, image processing.
* [ ] Verify storage growth is projected, including backups, versions and anything never deleted.
* [ ] Verify idle cost is known separately from peak cost, so autoscaling savings are not imaginary.
* [ ] Verify a query that is cheap at a thousand rows has been costed at ten million.
* [ ] Verify data transfer between regions and between services is accounted for.

## Controls

* [ ] Verify a budget alarm exists on rate of change, not only on a monthly total.
* [ ] Verify autoscaling has a maximum, so an availability incident cannot become a billing incident.
* [ ] Verify per-user and per-tenant quotas exist on anything that costs money per call.
* [ ] Verify the cheapest fix has been considered before the expensive one — a limit, a cache or a smaller payload usually beats more capacity.
* [ ] Verify committed or reserved capacity has been considered once the baseline is predictable.
* [ ] Verify someone owns the bill and looks at it monthly, with the ability to explain a change.
