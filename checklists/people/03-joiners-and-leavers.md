# Joiners & Leavers

**The attacker here does not need a bug, only a person who does what they are asked.** Here, it is often a person who still has access they should not: a contractor whose project ended, a tester whose account was never closed, an employee who left angry.

Access that is granted ad hoc is removed ad hoc, which in practice means not at all. The fix is not trust; it is a list that is followed on the first day and the last.

[← all checklists](../README.md)

---


## Joining

* [ ] Verify there is a written list of what each role gets on day one — accounts, groups, repositories, environments — so access is granted from a role, not copied from whoever sat there before.
* [ ] Verify every person gets their own named account on every system, with no shared logins for admin consoles, social profiles or payment dashboards.
* [ ] Verify a new person's MFA is enrolled before they receive production access, not afterwards.
* [ ] Verify production and customer-data access is granted only when the work needs it, and is recorded with who approved it.
* [ ] Verify contractors and agencies get accounts in your systems, under your control, rather than you getting access to theirs, so you can end it.
* [ ] Verify contractor and tester accounts carry an end date that expires or alerts, rather than relying on someone remembering.

## Leaving

* [ ] Verify there is a written offboarding checklist that names every system, and that it is used for every departure, including founders, contractors and testers.
* [ ] Verify access ends on the departure day — sign-in disabled, sessions revoked, tokens and API keys they created rotated or deleted, SSH keys removed.
* [ ] Verify secrets the person could have seen are rotated, not only their own account disabled: shared passwords, environment secrets, webhook secrets, signing keys.
* [ ] Verify their personal devices lose access to company email, chat and files, and that any company device is returned or wiped.
* [ ] Verify ownership of what they owned is moved before the account is deleted — repositories, documents, scheduled jobs, domains, billing — so nothing dies with it.
* [ ] Verify OAuth apps and integrations they connected under their own account are found and moved or revoked, since they keep working after the person goes.
* [ ] Verify their access to third-party admin consoles that are not behind your single sign-on is removed by hand and recorded, since those are the ones that get missed.

## In between

* [ ] Verify access is reviewed on a schedule — who has admin anywhere, who has production database access, who can deploy — and that anything without a current reason is removed.
* [ ] Verify a change of role removes the old role's access, not only adds the new one.
* [ ] Verify bulk export, mass download or unusual access by a staff account raises an alert, since that is what a person leaving with data looks like.
* [ ] Verify staff actions on customer data are logged against the named person, so a misuse can be traced to who did it — see [`security/core/04-backend-api.md`](../security/core/04-backend-api.md).
* [ ] Verify a person who has resigned or been told they are leaving gets their access narrowed then, not on the last day.
