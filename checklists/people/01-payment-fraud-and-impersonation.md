# Payment Fraud & Impersonation

**The attacker here does not need a bug, only a person who does what they are asked.** Each item asks whether that request would be stopped by a rule decided in advance, not by someone's judgement on a busy day.

A supplier's invoice with a new bank account. An email from the CEO asking for an urgent transfer. A video call where the founder's face and voice are generated. None of them touch your code, and all of them move real money.

[← all checklists](../README.md)

---


## Changing where money goes

* [ ] Verify a change to any payee's bank details — supplier, contractor, payroll, your own payout account — is confirmed through a second channel using contact details already on file, never the ones in the request.
* [ ] Verify the confirmation is a call you place, not a reply to the message or a number it supplies.
* [ ] Verify a changed payout or bank account on your payment processor or marketplace sends a notice to every founder, not only to the person who made the change.
* [ ] Verify a new payee, or a first payment to a changed account, waits a defined period or needs a second approver before the money leaves.
* [ ] Verify the threshold above which any outgoing payment needs two people is written down and enforced by the bank or tool, not by memory.
* [ ] Verify the bank's own alerts for new payees, large transfers and changed limits go to more than one person.

## Requests that claim authority

* [ ] Verify the team knows that urgency, secrecy and "I'm in a meeting, just do it" are the signature of the fraud, and that a request carrying them is verified, not rushed.
* [ ] Verify no payment, gift-card purchase, credential, or access change is ever made on the strength of an email, chat message or voicemail alone, whoever it appears to come from.
* [ ] Verify there is a verification phrase or question agreed between founders and finance in person, never written in email or chat, for confirming an unusual request by phone.
* [ ] Verify the team knows a live voice or video call is no longer proof of identity — faces and voices of anyone with public recordings can be generated in real time.
* [ ] Verify a request to move a conversation to a new channel, a personal number, or a new chat app is treated as a warning sign, not a convenience.

## Your domain and your name

* [ ] Verify SPF, DKIM and a DMARC policy of `quarantine` or `reject` are published for every domain you own, including ones that never send mail, so your exact address cannot be spoofed to your own suppliers.
* [ ] Verify you watch for lookalike domains of your company name — swapped letters, other top-level domains, added words — and know how to report one to its registrar.
* [ ] Verify suppliers and customers have been told how you will and will not ask them to change payment details, so a fraud using your name gets questioned on their side.
* [ ] Verify incoming mail from outside the organisation is visibly marked as external in your mail client.
* [ ] Verify a display name matching a founder or staff member, on mail from an outside address, is flagged rather than shown as if internal.

## If it happens

* [ ] Verify you know your bank's fraud line and how fast a recall request must be made — a transfer is often recoverable within hours and rarely after days.
* [ ] Verify a payment sent to a fraudster is reported to the police or the national fraud-reporting body as well as the bank, since recovery often depends on that report.
* [ ] Verify the mailbox the fraud came through, or was sent from, is checked for compromise: forwarding rules, new app passwords, OAuth grants, filters that hide replies.
* [ ] Verify your insurance has been read for whether it covers social-engineering transfers, since many cyber policies exclude them unless added.
