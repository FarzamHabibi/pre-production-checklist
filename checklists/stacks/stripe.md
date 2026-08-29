# Stripe

Items from the domain checklists that are specific to **Stripe**. If you do not use it, skip this file entirely — the domain checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify webhook handlers call `constructEvent` with the signing secret and reject unsigned or mis-signed payloads.
* [ ] Verify the webhook endpoint reads the **raw** body; a JSON body parser running first invalidates the signature.
* [ ] Verify the event timestamp is checked so an old captured payload cannot be replayed.
* [ ] Verify webhook handling is idempotent by event id — Stripe retries, and a duplicate must not fulfil an order twice.
* [ ] Verify the handler responds quickly and does the work asynchronously, rather than timing out and being retried.
* [ ] Verify a failed webhook is visible to you, not only in Stripe's dashboard.

## Business Logic & Race Conditions
<sub>from [`security/core/10-business-logic.md`](../security/core/10-business-logic.md)</sub>

* [ ] Verify the charge amount is computed server-side from a price or product id, never taken from the request body.
* [ ] Verify currency is server-side too; a client-supplied currency is a discount.
* [ ] Verify entitlement is granted from the webhook or a server-side retrieve, not from the browser returning to a success URL.
* [ ] Verify a success redirect cannot be visited directly to unlock the product.
* [ ] Verify idempotency keys are sent on charge and payment-intent creation so a retried request does not double-charge.
* [ ] Verify subscription state is read from Stripe or from a webhook-updated record, rather than assumed after checkout.
* [ ] Verify refunds, disputes, cancellations and failed renewals revoke access.
* [ ] Verify promotion codes and trials cannot be stacked or reused beyond intent.

## Secrets Management & Cryptography
<sub>from [`security/core/08-secrets-and-crypto.md`](../security/core/08-secrets-and-crypto.md)</sub>

* [ ] Verify the secret key is server-side only, and that only the publishable key reaches the browser.
* [ ] Verify test and live keys cannot be confused — different environments, and an assertion at boot that the mode matches the environment.
* [ ] Verify restricted keys are used where a service needs only part of the API.
* [ ] Verify the webhook signing secret is stored as a secret and differs per endpoint and per environment.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Verify card details never touch your server — Elements or Checkout, so PCI scope stays SAQ-A.
* [ ] Verify a real payment has been made and refunded end to end in production before launch.
