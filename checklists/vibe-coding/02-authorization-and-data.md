# AI-Generated Authorization & Data Bugs

The most common and most damaging category by a wide margin.

[← all checklists](../README.md)

---

## Authorization Bugs


This is a high-priority category.

* [ ] Search AI-generated code for missing authorization checks.
* [ ] Verify every new endpoint has authentication.
* [ ] Verify every new endpoint has authorization.
* [ ] Verify every object access checks ownership/tenant.
* [ ] Verify every new mutation checks authorization.
* [ ] Verify every admin route requires explicit admin authorization.
* [ ] Verify new service methods cannot be called without authorization.
* [ ] Verify authorization is not accidentally removed during refactoring.
* [ ] Verify AI did not replace authorization with authentication only.
* [ ] Verify AI did not treat “user is logged in” as “user owns this resource.”
* [ ] Verify AI did not trust `userId` from request bodies.
* [ ] Verify AI did not trust `tenantId` from client input.
* [ ] Verify AI did not trust role values from JWT payloads without proper validation.
* [ ] Verify AI did not add hidden authorization bypass parameters.
* [ ] Verify AI did not rely on frontend route protection as the security boundary.
* [ ] Verify AI did not create alternate endpoints that bypass the primary authorization layer.
* [ ] Verify AI did not expose service-layer methods directly through a new controller.
* [ ] Verify AI did not introduce a privileged "internal" endpoint accessible from the public network.
* [ ] Verify AI did not accidentally make internal methods public.
---

## Database / RLS Bugs


* [ ] Every new table has intentional RLS configuration.
* [ ] Every new exposed table is reviewed for RLS.
* [ ] Every new INSERT policy has appropriate `WITH CHECK`.
* [ ] Every new UPDATE policy has appropriate `USING`.
* [ ] Every new UPDATE policy has appropriate `WITH CHECK`.
* [ ] Every new DELETE policy is reviewed.
* [ ] Every new SELECT policy is reviewed.
* [ ] AI did not move queries from user-scoped clients to privileged server clients unnecessarily.
* [ ] AI did not bypass RLS for convenience.
* [ ] Security-definer functions use safe `search_path`.
* [ ] Function `EXECUTE` privileges are limited.
* [ ] AI-generated SQL cannot change ownership fields.
* [ ] AI-generated queries cannot cross tenants.
* [ ] AI-generated database functions cannot modify security-sensitive fields.
* [ ] AI did not expose private Storage objects.
* [ ] AI-created Storage policies are tested with multiple users/tenants.
