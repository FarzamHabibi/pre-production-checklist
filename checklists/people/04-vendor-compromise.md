# Vendor Compromise

**The attacker here does not need a bug, only a person who does what they are asked.** Or a vendor that does what it was allowed to: when a provider you connected is breached, the attacker inherits every token, key and permission you gave it.

Your security is the sum of what every connected service can do with your data. A breach at an analytics tool, a support widget, an AI provider or a CI service is a breach at you, often reported to you days later, by them, in an email.

[← all checklists](../README.md)

---


## Knowing what each one holds

* [ ] Verify there is a current list of every third-party service with access to your data or systems, and for each: what data it receives, what credential it holds, and what that credential can do.
* [ ] Verify every OAuth app granted access to your workspace, source host, cloud account or social accounts is listed, and that unused grants are revoked.
* [ ] Verify each integration's credential has the narrowest scope the provider allows — read-only where it only reads, one repository rather than all, one bucket rather than the account.
* [ ] Verify each vendor credential is unique to that vendor, so revoking one does not break the others and a leak points to its source.
* [ ] Verify you know which vendors receive personal data, because a breach at one of them is a notification question for you.

## Cutting one off

* [ ] Verify you can revoke a single vendor's access in minutes, and that the steps for each critical vendor are written down.
* [ ] Verify the product degrades sensibly when a vendor is cut off, rather than failing entirely — see [`post-launch/05-outage-and-dependencies.md`](../post-launch/05-outage-and-dependencies.md).
* [ ] Verify webhook signing secrets and inbound API keys from a vendor can be rotated without downtime.
* [ ] Verify a vendor that can push code or configuration into your product — a script tag, a tag manager, a feature-flag service, a CI action — is treated as having write access to production.

## When a vendor says it was breached

* [ ] Verify you have subscribed to the security or status notices of your critical vendors, so you hear from them before you read it in the news.
* [ ] Verify there is a decided first move when a vendor reports a breach: rotate the credentials it held, review your logs for its access, and check what it could reach.
* [ ] Verify your own logs record calls made with each vendor's credential, so you can tell whether a stolen token was used against you.
* [ ] Verify you treat a vendor's "no customer data was affected" as a claim to check against your own logs, not a conclusion.
* [ ] Verify a breach at a vendor that held your users' data is assessed for your own notification duties — see [`post-launch/03-security-incident.md`](../post-launch/03-security-incident.md).

## Before you connect a new one

* [ ] Verify a new integration is approved by someone who reads what scopes it requests, not added by whoever needed it that day.
* [ ] Verify you know where the vendor stores your data, how long it keeps it, and how to make it delete it when you leave.
* [ ] Verify leaving a vendor includes revoking its credentials and asking for deletion, not only stopping payment.
