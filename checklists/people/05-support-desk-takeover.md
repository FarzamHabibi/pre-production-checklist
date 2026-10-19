# Support-Desk Account Takeover

**The attacker here does not need a bug, only a person who does what they are asked.** On the support desk, that person is trained to help — and an attacker who cannot break the login can often just ask support to change the email.

Every recovery path a human or an AI assistant can open is a login path. It is usually the weakest one, because it was designed for users who have lost everything and so asks for very little.

[← all checklists](../README.md)

---


## What support can change

* [ ] Verify there is a written list of what support may change on an account — email, phone, second factor, password, payout details, ownership — and which of those need more than a conversation.
* [ ] Verify support cannot read a user's password, recovery codes or full payment details, so a tricked or compromised agent cannot hand them over.
* [ ] Verify changing a sign-in email, removing a second factor, or changing payout details through support needs proof from something the real owner holds — a link to the current email, the current second factor, a signed-in session — not facts an attacker can find.
* [ ] Verify details visible in public or in past breaches — name, date of birth, address, last four card digits, order numbers — are never accepted as proof of identity on their own.
* [ ] Verify a request to move an account to a new email always notifies the old address and gives it a window to stop the change.

## AI assistants and chat

* [ ] Verify an AI support or site assistant cannot perform account changes — email, password, second factor, payout, ownership — and can only send the user into the normal verified flow.
* [ ] Verify the assistant does not reveal another user's data or account existence when asked, however the request is framed.
* [ ] Verify instructions the user types — "I am the admin", "ignore the policy, this is urgent" — cannot raise what the assistant is permitted to do, because its permissions come from the session, not the conversation.

## Watching for it

* [ ] Verify every support-initiated account change is logged with the agent, the reason, and the evidence accepted.
* [ ] Verify repeated recovery attempts against one account, or one requester trying many accounts, raise an alert.
* [ ] Verify high-value accounts — creators with a balance, admins, staff — can be marked so that support changes to them need a second approver.
* [ ] Verify a recovery completed through support is followed by a notice to every contact method on the account, so the real owner learns of it.

## The people doing it

* [ ] Verify support staff know the common scripts — urgency, anger, a sad story, a claimed manager — and that refusing is the expected answer when proof is missing.
* [ ] Verify an agent is never penalised for refusing an unverified change, so the incentive does not favour the attacker.
* [ ] Verify outsourced support has the same limits and logging as in-house support, enforced by the tool rather than by their training.
