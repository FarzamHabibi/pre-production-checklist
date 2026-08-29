# Analytics & Consent

Knowing what happened, without collecting things you should not have and cannot defend.

[← all checklists](../README.md)

---


## Installed and actually working

* [ ] Verify the analytics script fires on production, confirmed by watching the network request, not by trusting the dashboard.
* [ ] Verify it is installed exactly once; a duplicate tag through a tag manager doubles every number quietly.
* [ ] Verify it fires on client-side route changes in a single-page app, or every page after the first is invisible.
* [ ] Verify the same property is not receiving data from staging and production.
* [ ] Verify internal and team traffic is excluded, by IP, by a flag, or by a filtered view.
* [ ] Verify bot and crawler traffic is filtered.
* [ ] Verify a checkout, signup or other conversion has been completed end to end in production and appears correctly.

## Measure the right things

* [ ] Verify the events you collect map to the steps of the funnel you actually care about, rather than to whatever the SDK sends by default.
* [ ] Verify each event has a defined name, a defined payload, and one owner — an event taxonomy nobody wrote is an event taxonomy nobody can query.
* [ ] Verify you can answer the two or three questions the business will ask, before launch, using the events you have.
* [ ] Verify a metric you would act on has a threshold and an owner; the rest is decoration.
* [ ] Verify UTM parameters survive your redirects, or attribution silently collapses into direct traffic.
* [ ] Verify cross-domain tracking works if the journey crosses domains, including to a hosted checkout.
* [ ] Verify you know roughly what proportion of traffic blocks analytics, so you are not comparing a filtered number to an unfiltered one.

## Privacy and consent

* [ ] Verify no personal data lands in event payloads, page titles or URLs — an email address in a query string ends up in analytics, logs and referrer headers.
* [ ] Verify the consent banner blocks non-essential tags **before** consent, rather than firing them and asking afterwards.
* [ ] Verify declining is as easy as accepting, and that the choice is remembered.
* [ ] Verify consent state is passed to the tools that support it, so measurement degrades rather than lying.
* [ ] Verify the cookie and storage list in your policy matches what the site actually sets — check with a fresh browser profile.
* [ ] Verify data retention is set deliberately rather than left at the vendor's maximum.
* [ ] Verify IP anonymisation or equivalent is on where your jurisdiction expects it.
* [ ] Verify a data processing agreement exists with each analytics vendor, and that the data region is one you can defend.
* [ ] Verify your privacy policy describes what you actually collect, in words the reader can act on.
* [ ] Verify a user can ask for their data to be deleted and that the request reaches the analytics vendor too.

## Keeping it honest

* [ ] Verify a dashboard exists that someone looks at weekly, rather than a tool nobody opens.
* [ ] Verify an alert fires on a sudden traffic or conversion drop — a deploy that breaks the tracking snippet looks exactly like a traffic collapse.
* [ ] Verify analytics changes go through the same review as code; a tag manager is a production deploy path with no pull request.
* [ ] Verify server-side tagging has at least been considered if client-side loss or third-party load is material.
