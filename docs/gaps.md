# Open coverage gaps

Things the checklist does not cover, found while doing something else, written down
before a decision has been made about them. Nothing here is a commitment to add anything.
A gap stays on this page until it is either filled or explicitly rejected with a reason,
so that "we thought about this and said no" is distinguishable from "nobody noticed".

Each entry records what was searched, what came back, and what is actually being asked.

---

## Provider-initiated termination of access

**Found** 6 September 2026, reading a Product Hunt thread in `p/cursor` about OpenAI
ending its contract with Cursor after Cursor's acquisition by SpaceX. Access ends
12 November, roughly sixty days' notice, for reasons unrelated to any developer using it.

**What was searched.** `data/checklist.json` for `terminat|revoke|withdraw|deprecat|
contract|vendor lock|provider chang|second provider|fallback (model|provider)|swap model`.
28 items matched. Every one is about the system revoking a user: revoked sessions and
tokens, expired credentials, deprecated endpoints, deprecated algorithms, user deletion
terminating access. None is about a supplier revoking the system.

The `integrations` domain sounds like the right home and is not: its 200 items are about
discoverability, crawlers, canonical tags and how third parties describe you. It is
integration in the marketing sense, not the dependency sense.

**So the gap is real.** The list covers every way access dies except the one where
somebody decides. That includes a model provider, but also a payment processor dropping a
category, a registry removing a package, an API tier being withdrawn, or an acquisition
changing who your counterparty is.

**The open question is scope, not whether the gap exists.** Everything on the list today
is verifiable by looking at your own code or your own infrastructure before you ship.
"Could you survive losing your model provider" is not that shape. It is a business
continuity question, the answer changes with contracts nobody can inspect, and the
honest version of the item may be unanswerable in the format the rest of the list uses.

The version that might fit the format is narrower and worth considering on its own:
not "do you have a plan" but "have you ever actually performed the switch". Whether the
prompts were tuned to one provider's behaviour, whether the eval numbers were ever
portable, and how long a swap took the one time it was tried, are all things a team can
establish before they need to know.

**Decision:** none yet. Do not add items from this page without deciding the scope
question first, because the wrong version of this becomes advice rather than a check, and
advice is what this list has stayed away from.
