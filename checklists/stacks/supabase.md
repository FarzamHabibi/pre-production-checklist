# Supabase

Items from the core checklists that are specific to **Supabase**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

### Architecture / Threat Model
<sub>from [`core/01-threat-model.md`](../core/01-threat-model.md)</sub>

* [ ] Draw the complete request/data-flow diagram from browser/mobile → Cloudflare → Cloud Run → NestJS → Supabase/Auth/Postgres/Storage → third parties.

### Managed Authentication Provider
<sub>from [`core/02-authorization.md`](../core/02-authorization.md)</sub>

* [ ] Search frontend/mobile bundles for Supabase service-role credentials.
* [ ] Verify session handling in SSR does not accidentally share one Supabase client/session across users.

### Secrets Management
<sub>from [`core/08-secrets-and-crypto.md`](../core/08-secrets-and-crypto.md)</sub>

* [ ] Identify Supabase service-role credentials.

### Incident Response
<sub>from [`core/16-monitoring-and-response.md`](../core/16-monitoring-and-response.md)</sub>

* [ ] Document how to revoke Supabase credentials.

### Findings That Should Block Release
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Any Supabase service-role credential exposed to a client.

### High-Risk “Must Not Exist” Search
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Supabase `service_role` key

### Production Configuration Review
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Verify production Supabase settings.

### Final Security Sign-Off
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Supabase RLS audit complete.
* [ ] Supabase Storage audit complete.
* [ ] Supabase Auth audit complete.

### AI Identity & Authorization
<sub>from [`ai/01-architecture-and-identity.md`](../ai/01-architecture-and-identity.md)</sub>

* [ ] AI does not receive Supabase `service_role` credentials unless absolutely unavoidable and isolated.

### Prompt Injection
<sub>from [`ai/02-prompt-injection.md`](../ai/02-prompt-injection.md)</sub>

* [ ] Supabase rows
* [ ] Supabase Storage objects

### Dangerous Tools
<sub>from [`ai/03-tools-and-agency.md`](../ai/03-tools-and-agency.md)</sub>

* [ ] Supabase administration

### AI + Database Access
<sub>from [`ai/04-data-access-and-privacy.md`](../ai/04-data-access-and-privacy.md)</sub>

* [ ] AI never receives Supabase service-role keys in user-controlled context.

### The "Do Not Trust" List
<sub>from [`ai/11-release-gate.md`](../ai/11-release-gate.md)</sub>

* [ ] Supabase rows

### Database / RLS Bugs
<sub>from [`vibe-coding/02-authorization-and-data.md`](../vibe-coding/02-authorization-and-data.md)</sub>

* [ ] AI did not add `service_role` access where anon/authenticated access was sufficient.

### Configuration Bugs
<sub>from [`vibe-coding/04-crypto-secrets-deps.md`](../vibe-coding/04-crypto-secrets-deps.md)</sub>

* [ ] Supabase configuration

### Copy-Paste Security Bugs
<sub>from [`vibe-coding/07-review-blind-spots.md`](../vibe-coding/07-review-blind-spots.md)</sub>

* [ ] Verify old Supabase auth patterns are not copied into current SSR architecture.

### Code Review Questions
<sub>from [`vibe-coding/08-prompts-and-pr-review.md`](../vibe-coding/08-prompts-and-pr-review.md)</sub>

* [ ] direct Supabase.

### Red Flags
<sub>from [`vibe-coding/09-release-gate.md`](../vibe-coding/09-release-gate.md)</sub>

* [ ] AI changed Supabase policies.
* [ ] AI introduced `service_role`.
