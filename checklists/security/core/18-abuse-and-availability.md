# Abuse & Availability

Two failure modes that do not leak a single byte of data and can still take your product
off the internet: being overwhelmed, and being *used*.

The second one is the reason this file exists. Every other checklist here asks what an
attacker can take from you. This one asks what an attacker can do **with** you — turn your
service into a proxy, an amplifier, a spam relay, or a way to spend your money. Nothing is
stolen, so nothing looks like a breach. Your IP lands on a blocklist, your cloud account
gets suspended for an acceptable-use violation, and your product is down.

For a small team that is worse than most data incidents, because you cannot fix a
suspension by shipping a patch.

[← all checklists](../../README.md)

---

## Resource exhaustion

Rate limiting on authentication endpoints lives in
[`04-backend-api.md`](04-backend-api.md); edge rate limiting and WAF rules live in
[`14-edge-dns-waf.md`](14-edge-dns-waf.md); instance and quota caps live in
[`13-runtime-and-containers.md`](13-runtime-and-containers.md). This section covers what
those miss.

* [ ] Identify the single most expensive operation a caller can trigger, and confirm it is authenticated, rate-limited and bounded.
* [ ] Verify limits exist per user and per tenant, not only globally — one global limit lets a single account deny service to everyone else.
* [ ] Verify concurrency is capped, not just request rate; ten concurrent slow requests can cost more than a thousand fast ones.
* [ ] Verify pagination has a maximum page size that the client cannot raise.
* [ ] Verify any endpoint returning a collection cannot be asked for the entire table.
* [ ] Verify sorting, filtering and aggregation cannot be pointed at unindexed columns by the caller.
* [ ] Verify nested or recursive payloads are depth-limited — JSON nesting, GraphQL query depth, XML entity expansion, deeply nested multipart.
* [ ] Verify uploaded archives are checked for decompression ratio before extraction (zip bomb).
* [ ] Verify image and document processing has memory, dimension and time limits; a small file can decompress into gigabytes of pixels.
* [ ] Verify no user-supplied string is ever compiled into a regular expression, and that your own expressions have no catastrophic backtracking.
* [ ] Verify cache misses cannot stampede — a popular expired key should not send every concurrent request to the origin.
* [ ] Verify retries use exponential backoff with jitter, in your clients and in your service-to-service calls, so a partial failure cannot become a retry storm.
* [ ] Verify a slow or failing third-party dependency degrades your service rather than hanging it — timeouts and a circuit breaker on every outbound call.
* [ ] Verify autoscaling has an upper bound and a budget alert; without one, an availability attack succeeds as a billing attack instead.
* [ ] Verify load shedding exists: under pressure the service returns 429 or 503 quickly rather than queueing indefinitely.
* [ ] Verify background job queues have a maximum depth and cannot be filled by an unauthenticated caller.
* [ ] Verify long-lived connections (WebSocket, SSE, streaming responses) are capped per user and time out when idle.

---

## Your service as a weapon

Every feature that fetches a URL, sends a message, or costs money on demand is a capability
an attacker would like to borrow. Inventory them first, then bound each one.

### Outbound fetch

* [ ] Inventory every feature that fetches a URL the user supplied: link previews, avatar-from-URL, import-from-URL, webhook delivery, RSS or sitemap ingestion, PDF and screenshot rendering, OG-tag scraping, file mirroring, AI tools that browse.
* [ ] Verify each of those is authenticated — an unauthenticated URL fetcher is an open proxy with a marketing page.
* [ ] Verify each is rate-limited **per user**, not only globally; a global limit still lets one account consume the whole allowance to attack a target.
* [ ] Verify the response size is capped and the connection times out, so a slow or endless target cannot pin your workers.
* [ ] Verify redirects are followed to a bounded depth and re-validated at every hop.
* [ ] Verify the amplification ratio is close to one: a small request from the caller must not produce a large request to a third party.
* [ ] Verify the same target cannot be requested repeatedly by rotating trivially different URLs (query string, fragment, casing, trailing slash).
* [ ] Verify outbound requests carry a User-Agent identifying your service and a link to your abuse policy, so a target can tell you rather than block you.
* [ ] Verify you honour `robots.txt` and back off on `429` and `503` from targets you fetch repeatedly.
* [ ] Verify egress passes through a NAT or proxy with an IP you control and can rotate, rather than a shared cloud range you cannot.

### Messaging and paid actions

* [ ] Verify email sending cannot be triggered at an arbitrary recipient by an unauthenticated caller — signup confirmations, invites, "share this page", password resets and contact forms are all send-to-anyone primitives.
* [ ] Verify the recipient of any transactional email is derived from your own records, never taken from the request body.
* [ ] Verify user-supplied text cannot inject headers or additional recipients into an outgoing message.
* [ ] Verify SMS and voice endpoints are rate-limited per user, per destination number and per country — SMS pumping directs floods at premium ranges and bills you for every message.
* [ ] Verify countries you do not serve are blocked outright for SMS and voice.
* [ ] Verify push notification sending cannot be triggered for arbitrary device tokens.
* [ ] Verify every paid third-party action — model calls, SMS, email, geocoding, storage writes — has a per-user quota and a global budget alarm.
* [ ] Verify a new, unverified account cannot reach the expensive capabilities at all until it has done something that costs the attacker time or money.

### Hosting and identity

* [ ] Verify user-uploaded files cannot be served from your primary domain in a way that makes your brand host malware or a phishing page.
* [ ] Verify uploaded content is served with `Content-Disposition: attachment` and a non-executable content type unless rendering is genuinely required.
* [ ] Verify user-generated public pages, profiles or short links cannot be used to host redirects to attacker sites under your domain's reputation.
* [ ] Verify wildcard DNS and unclaimed subdomains cannot be taken over and used to send mail or serve content as you.
* [ ] Verify SPF, DKIM and DMARC are configured and DMARC is set to something stronger than `p=none`, so a spoofed campaign does not burn your domain.
* [ ] Verify free-tier signup cannot be automated into resource farming — build minutes, container runtime and model credits are all mined.
* [ ] Verify CI/CD runners cannot be used for cryptomining by a pull request from a fork; check the workflow trigger, not just the secrets.
* [ ] Verify referral, invite, trial and credit systems cannot be cycled by one person for unbounded value.

---

## Knowing it is happening

An abuse incident usually reaches you as a suspension notice or a blocklist entry, days
after it started. These items are about finding out first.

* [ ] Verify outbound request volume and outbound bandwidth are monitored, with an alert on a sudden rise — this is the earliest signal that your service is being used against someone.
* [ ] Verify spend is alerted on rate of change, not only on a monthly total.
* [ ] Verify the top talkers by user, IP and destination are visible in under five minutes without writing a new query.
* [ ] Verify an `abuse@` and a `security@` address exist for your domain, reach a human, and are published where a reporter will look.
* [ ] Verify the WHOIS or RDAP record for your domain has a working contact address.
* [ ] Verify you can disable a single abusive account, and revoke its sessions and queued jobs, without a deploy.
* [ ] Verify you can disable an entire feature — the URL fetcher, SMS, invites — behind a flag, without a deploy.
* [ ] Document what happens if your cloud provider suspends the account for an acceptable-use violation: who is contacted, from what address, and how the service is restored.
* [ ] Verify your provider's acceptable-use policy has been read by someone on the team, and that the features you ship do not violate it under abuse.
* [ ] Verify blocklist status for your sending IPs and domain is checked on a schedule, not discovered from a customer complaint.
