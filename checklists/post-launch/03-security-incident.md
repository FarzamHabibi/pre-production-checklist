# You Have Been Breached

**Everything here is used after launch and has to be prepared before it.** The question each item asks is not "did you respond well" — it is **"is the answer already decided?"**

The scenario the rest of the security domain exists to prevent. Assume it happened anyway.

The instinct is to fix and move on. The order that actually works is contain, preserve, then investigate — because the fix usually destroys the evidence you will need to know how far it went.

[← all checklists](../README.md)

---


## Contain first

* [ ] Verify there is a written first move for a suspected compromise, decided in advance.
* [ ] Verify you can revoke every session for every user with one action, and know how long it takes to propagate.
* [ ] Verify you can revoke a single user's or a single API key's access without revoking everyone's.
* [ ] Verify you can disable a compromised account without deleting it, so evidence survives.
* [ ] Verify you can take the service offline or into a maintenance mode deliberately, if containment requires it.
* [ ] Verify you can block an IP, a range or a country at the edge without a deploy.
* [ ] Verify isolating a compromised host does not destroy its memory and disk state.

## Preserve evidence

* [ ] Verify logs are stored somewhere the attacker could not have altered, with enough retention to cover the time before you noticed.
* [ ] Verify log retention is long enough to matter — a breach is typically discovered long after it started.
* [ ] Verify you know how to snapshot a compromised instance before rebuilding it.
* [ ] Verify audit logs record who did what, including administrative actions, and that they cannot be deleted by the account that made them.
* [ ] Verify the incident timeline is recorded as you go, with timestamps and sources.

## Rotate

* [ ] Verify there is a written, ordered list of every credential to rotate, so it is not assembled under pressure.
* [ ] Verify rotating each one is possible without downtime, or that the downtime is known.
* [ ] Verify rotation covers the ones people forget: signing keys, webhook secrets, database passwords, CI tokens, third-party API keys, OAuth client secrets, SSH keys, backup encryption keys.
* [ ] Verify a rotated credential is actually invalidated, not merely replaced.
* [ ] Verify sessions and tokens issued with an old signing key stop working after rotation.
* [ ] Verify you know which credentials cannot be rotated quickly, and have a plan for those specifically.

## Size the blast radius

* [ ] Verify you can determine which data the compromised credential or account could reach — this is what every access-control item in `security/` was for.
* [ ] Verify you can tell whether data was actually accessed or exported, not only whether it could have been.
* [ ] Verify egress volume is visible historically, so a bulk export is detectable after the fact.
* [ ] Verify you can list which users are affected, because the notification obligation depends on it.
* [ ] Verify you check for persistence: new accounts, new keys, changed webhooks, scheduled jobs, forwarding rules, OAuth grants, modified CI workflows.
* [ ] Verify you check whether your service was used to attack someone else — see [`security/core/18-abuse-and-availability.md`](../security/core/18-abuse-and-availability.md).

## Obligations

* [ ] Verify you know your breach notification deadline before you need it — under GDPR it is 72 hours from awareness, and other regimes differ.
* [ ] Verify you know who must be told: users, a supervisory authority, customers under contract, a cyber insurer, a payment processor.
* [ ] Verify contractual notification terms with business customers have been read, since they are often stricter than the law.
* [ ] Verify legal advice is obtainable quickly, and that you know who to call.
* [ ] Verify a breach notification template exists in advance — see [`07-communication.md`](07-communication.md).
* [ ] Verify you do not speculate publicly about cause or scope before you know; a correction is worse than a delay.

## Recover

* [ ] Verify you rebuild from a known-good state rather than cleaning a compromised one.
* [ ] Verify the entry point is closed before the service is restored, or you will do this twice.
* [ ] Verify you can restore to a point before the compromise — see [`04-data-loss.md`](04-data-loss.md).
* [ ] Verify restored data is checked for attacker-planted changes, not only for completeness.
* [ ] Verify monitoring is heightened for a period afterwards, because a return visit is common.
