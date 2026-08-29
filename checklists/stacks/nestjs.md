# NestJS

Items from the core checklists that are specific to **NestJS**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Confirm whether NestJS uses Express or Fastify and review middleware/security differences.
* [ ] Verify HTTP request smuggling/desynchronization exposure between Cloudflare → load balancer → Cloud Run → NestJS is reviewed.
* [ ] Verify every external DTO is validated.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] NestJS source audit complete.

## AI-Generated Application Bugs
<sub>from [`security/ai-generated-code/03-backend-frontend-api.md`](../security/ai-generated-code/03-backend-frontend-api.md)</sub>

* [ ] Review every generated DTO.
* [ ] Verify DTO validation exists.
