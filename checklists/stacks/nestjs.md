# NestJS

Items from the core checklists that are specific to **NestJS**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

### Backend Application Security
<sub>from [`core/04-backend-api.md`](../core/04-backend-api.md)</sub>

* [ ] Confirm whether NestJS uses Express or Fastify and review middleware/security differences.
* [ ] Verify HTTP request smuggling/desynchronization exposure between Cloudflare → load balancer → Cloud Run → NestJS is reviewed.
* [ ] Verify every external DTO is validated.

### Final Security Sign-Off
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] NestJS source audit complete.

### Backend Framework Bugs
<sub>from [`vibe-coding/03-backend-frontend-api.md`](../vibe-coding/03-backend-frontend-api.md)</sub>

* [ ] Review every generated DTO.
* [ ] Verify DTO validation exists.
