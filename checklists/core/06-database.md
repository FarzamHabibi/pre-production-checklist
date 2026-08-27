# Database & Row-Level Security

Row-level security is the single highest-leverage control for multi-tenant products. Applies to Postgres, MySQL, and any database with policy or view-based isolation.

[← all checklists](../README.md)

---

## Database Security & RLS


### RLS

* [ ] Enable RLS on every exposed table that requires row-level authorization.
* [ ] Identify exposed schemas.
* [ ] Identify every table accessible by `anon`.
* [ ] Identify every table accessible by `authenticated`.
* [ ] Verify privileges and RLS policies are reviewed together.
* [ ] Verify adding RLS policies did not leave unintended grants.
* [ ] Verify SELECT policies.
* [ ] Verify INSERT policies.
* [ ] Verify UPDATE policies.
* [ ] Verify DELETE policies.
* [ ] Verify `WITH CHECK` conditions for inserts.
* [ ] Verify `WITH CHECK` conditions for updates.
* [ ] Verify UPDATE cannot change ownership.
* [ ] Verify users cannot change tenant IDs.
* [ ] Verify users cannot change roles.
* [ ] Verify users cannot change billing status.
* [ ] Verify users cannot modify security-sensitive flags.
* [ ] Verify service-role/bypass-RLS usage is limited.
* [ ] Verify privileged backend queries perform explicit authorization checks before bypassing RLS.
* [ ] Verify security-definer functions.
* [ ] Verify security-definer functions set a safe `search_path`.
* [ ] Verify security-definer functions do not expose arbitrary SQL execution.
* [ ] Verify function `EXECUTE` privileges.
* [ ] Verify exposed RPC functions.
* [ ] Verify RPC functions cannot be used to bypass RLS.
* [ ] Verify triggers cannot be abused to modify protected data.
* [ ] Verify views do not unintentionally bypass intended authorization.
* [ ] Verify materialized views do not expose cross-tenant data.
* [ ] Verify database functions cannot access secrets unnecessarily.
* [ ] Verify extensions are minimized.
* [ ] Verify extension privileges.
* [ ] Verify database roles follow least privilege.
* [ ] Verify anonymous/authenticated roles cannot create privileged objects.

Supabase states that exposed-schema tables without appropriate RLS can be readable/writable according to their grants, and recommends enabling RLS on every exposed table.

### Data isolation

* [ ] Define tenant key for every multi-tenant table.
* [ ] Verify every tenant-owned child table is protected.
* [ ] Verify indirect relations cannot cross tenants.
* [ ] Verify joins cannot leak another tenant's rows.
* [ ] Verify aggregate queries cannot infer restricted data.
* [ ] Verify counts cannot reveal existence of private objects.
* [ ] Verify search indexes cannot cross tenants.
* [ ] Verify full-text search cannot return unauthorized documents.
* [ ] Verify database views preserve tenant isolation.
* [ ] Verify reporting/export queries preserve tenant isolation.
* [ ] Verify background jobs preserve tenant isolation.
* [ ] Verify migration scripts preserve tenant fields.

### Database injection / logic

* [ ] Review all raw SQL.
* [ ] Review all RPC inputs.
* [ ] Review dynamic SQL.
* [ ] Review JSONB manipulation.
* [ ] Review `ORDER BY` and dynamic identifiers.
* [ ] Review regex usage.
* [ ] Review `LIKE`/ILIKE patterns.
* [ ] Review full-text search.
* [ ] Review SQL functions for privilege escalation.
* [ ] Review trigger recursion/abuse.
* [ ] Review race conditions around balances, counters, quotas, and ownership.

### Secrets / database security

* [ ] Verify secrets are not stored in normal application tables.
* [ ] Verify sensitive secrets use an appropriate secret-management mechanism.
* [ ] Verify database backups are protected.
* [ ] Verify database exports are protected.
* [ ] Verify production database credentials are separated from development credentials.
* [ ] Verify database credentials are rotated.
* [ ] Verify service-role credentials are rotated after suspected exposure.
* [ ] Verify database logs do not contain secrets.
* [ ] Verify PII classification exists for sensitive columns.
* [ ] Verify retention/deletion requirements.
* [ ] Verify cryptographic protection for particularly sensitive application data where needed.
* [ ] Verify database audit/logging meets the project's compliance requirements.
