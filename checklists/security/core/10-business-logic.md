# Business Logic & Race Conditions

Scanners cannot find these. Only you know what your product is supposed to allow.

[← all checklists](../../README.md)

---

## Business Logic Security


* [ ] Test price manipulation.
* [ ] Test quantity manipulation.
* [ ] Test negative quantities.
* [ ] Test zero quantities.
* [ ] Test integer overflow/underflow.
* [ ] Test currency manipulation.
* [ ] Test currency/locale mismatch.
* [ ] Search schema and code for money held as `float`, `double` or `REAL` and verify amounts use a fixed-point decimal or integer minor units end to end — binary floats cannot represent most cents, so totals and comparisons drift.
* [ ] Test free-trial abuse.
* [ ] Test coupon reuse.
* [ ] Test invitation abuse.
* [ ] Test referral abuse.
* [ ] Test quota bypass.
* [ ] Test subscription-state manipulation.
* [ ] Test role downgrade/upgrade races.
* [ ] Test duplicate requests.
* [ ] Test replay attacks.
* [ ] Test parallel requests.
* [ ] Test TOCTOU races.
* [ ] Test approval workflow bypass.
* [ ] Test self-approval.
* [ ] Test approval with stale state.
* [ ] Verify the confirmation step for a payout, bank-account change or large transfer shows the exact amount and destination, and that the server binds the confirmation to those values and refuses execution if any changed after confirming.
* [ ] Test deletion/recreation ownership tricks.
* [ ] Test soft-delete bypass.
* [ ] Test archive/restore authorization.
* [ ] Test export abuse.
* [ ] Test mass enumeration.
* [ ] Test resource exhaustion through legitimate functionality.
* [ ] Verify notifications, loyalty points, outgoing webhooks and automations fire only after payment is confirmed, never when a checkout is created — an abandoned checkout must leave nothing a buyer or seller can see.
* [ ] Verify an abandoned or expired checkout releases the stock, seats or slots it reserved.
* [ ] Verify a zero-priced item takes a path that never calls the payment gateway, and that it grants exactly what the paid path grants and nothing more.
* [ ] Verify a reconciliation or repair sweep treats every terminal state (delivered, ended, refunded, revoked) as finished, so running it twice changes nothing and announces nothing twice.
* [ ] Verify that releasing a quota or usage counter writes nothing when it fails — an error path that resets usage to zero gives the account an unlimited quota.
---

## Race Conditions


* [ ] Test concurrent password changes.
* [ ] Test concurrent email changes.
* [ ] Test concurrent MFA changes.
* [ ] Test concurrent account deletion.
* [ ] Test concurrent role changes.
* [ ] Test concurrent ownership changes.
* [ ] Test concurrent invitations.
* [ ] Test concurrent payment/credit operations.
* [ ] Test concurrent upload/delete.
* [ ] Test concurrent create operations.
* [ ] Test duplicate webhook processing.
* [ ] Test duplicate job execution.
* [ ] Test replay of signed requests.
* [ ] Verify unique database constraints where required.
* [ ] Verify transactions.
* [ ] Verify row locks/optimistic locking where required.
* [ ] Verify idempotency keys.
