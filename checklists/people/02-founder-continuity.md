# Founder Continuity

**The attacker here does not need a bug, only a person who does what they are asked.** This file covers the case where there is no attacker at all: the one person who holds the keys is unreachable, ill, or gone.

In a small company, a founder is often the only owner of the domain, the cloud billing, the payment account and the signing authority. If that person disappears tomorrow — an accident, a hospital, a lost phone abroad, a falling-out — nobody else may be able to keep the product running or the money moving.

[← all checklists](../README.md)

---


## Who can act

* [ ] Verify every account that the business cannot run without — domain registrar, DNS, cloud provider, source host, database provider, payment processor, bank, email workspace, app stores — has at least two people with owner-level access, or a written acceptance that it has one.
* [ ] Verify the second owner has actually signed in recently, with their own credentials and second factor, rather than holding access in principle.
* [ ] Verify billing for each critical service does not depend on one person's personal card, so the service is not suspended when that card expires or is cancelled.
* [ ] Verify the company's legal authority — who may sign contracts, instruct the bank, and file with authorities — does not rest on one person, and that the bank has the second signatory on record.
* [ ] Verify domain names, app store accounts and social handles are registered to the company rather than to a founder personally.

## What they would need

* [ ] Verify there is a written inventory of critical accounts: what each is for, who owns it, how it recovers, and where its recovery codes are kept.
* [ ] Verify the inventory and the emergency credentials are stored where a second founder can reach them without the first — a shared vault with emergency access, or a sealed offline copy — and that the method has been tested.
* [ ] Verify an emergency-access feature, where your password manager has one, is set up with a waiting period, so it works when needed and cannot be used silently.
* [ ] Verify the runbooks for deploy, rollback and restore can be followed by someone other than their author — see [`post-launch/01-readiness.md`](../post-launch/01-readiness.md).
* [ ] Verify scheduled renewals that would quietly break the product — domains, certificates, app store memberships, API plans — are on a shared calendar, not only in one inbox.

## When a founder leaves or disagrees

* [ ] Verify a founder agreement exists that says what happens to shares, roles and account ownership if a founder leaves, and that it has been signed.
* [ ] Verify intellectual property — code, designs, domains, content — has been assigned to the company in writing by every founder and early contributor.
* [ ] Verify no single founder can lock the others out: removing an owner from the registrar, the cloud organisation or the bank needs more than one person, or sends a notice to all of them.
* [ ] Verify a departing founder's access is reduced deliberately and recorded, with the same checklist as anyone else — see [`03-joiners-and-leavers.md`](03-joiners-and-leavers.md).

## Practising it

* [ ] Verify the second founder has performed one real operational task alone — a deploy, a refund, a DNS change — so the access is proven, not assumed.
* [ ] Verify the continuity plan is reviewed when the team changes, a critical account is added, or a founder moves country.
* [ ] Verify someone outside the founders — a lawyer, an accountant, a trusted adviser — knows the plan exists and how to start it.
