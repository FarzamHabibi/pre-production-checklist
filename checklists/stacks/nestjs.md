# NestJS

Items from the core checklists that are specific to **NestJS**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Confirm whether NestJS uses Express or Fastify and review middleware/security differences.
* [ ] Verify HTTP request smuggling/desynchronization exposure between Cloudflare → load balancer → Cloud Run → NestJS is reviewed.
* [ ] Verify every external DTO is validated.
* [ ] Verify `tsconfig.json` has `strict: true`; without `strictNullChecks` an `undefined` user id type-checks and reaches the query.
* [ ] Search for `as any`, `: any`, `@ts-ignore` and `@ts-expect-error` in guards, interceptors, pipes and anything that reads `request.user` — a cast there removes the only check the compiler was making.
* [ ] Verify every controller parameter that comes from the request is a DTO class with `class-validator` decorators, not an `interface` or `type` — types are erased at build time and `ValidationPipe` can only enforce what a decorator declares.
* [ ] Verify `ValidationPipe` runs with `whitelist: true`, `forbidNonWhitelisted: true` and `transform: true`, and that `forbidUnknownValues` has not been set to `false` — an undecorated DTO otherwise accepts anything.
* [ ] Verify `@ValidateNested()` and `@Type(() => Child)` are both present on every nested DTO property; with either one missing the nested object is never validated.
* [ ] Verify the result of `JSON.parse`, `JwtService.verify`, a queue payload and a webhook body is validated at runtime before it is used as its declared type — a TypeScript assertion is a promise, not a check.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] NestJS source audit complete.

## AI-Generated Application Bugs
<sub>from [`security/ai-generated-code/03-backend-frontend-api.md`](../security/ai-generated-code/03-backend-frontend-api.md)</sub>

* [ ] Review every generated DTO.
* [ ] Verify DTO validation exists.
