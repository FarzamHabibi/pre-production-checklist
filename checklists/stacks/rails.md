# Ruby on Rails

Items from the core checklists that are specific to **Ruby on Rails**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`core/04-backend-api.md`](../core/04-backend-api.md)</sub>

* [ ] Verify every controller inherits CSRF protection; audit each `skip_before_action :verify_authenticity_token` and confirm the endpoint is genuinely token-authenticated.
* [ ] Verify strong parameters are used everywhere; search for `params.permit!` and `params.require(...).permit(...)` with an over-broad list.
* [ ] Verify no model calls `attr_accessible`-era patterns or `Model.new(params[:model])` without permitting.
* [ ] Verify `config.force_ssl = true` in production.
* [ ] Verify `config.action_dispatch.default_headers` sets the security headers you expect.
* [ ] Verify `before_action :authenticate_user!` is not silently skipped by an `only:`/`except:` list that drifted from the actions.
* [ ] Verify ActionCable `allowed_request_origins` is set and not a permissive regex.
* [ ] Verify Rack middleware order puts security middleware ahead of the application.
* [ ] Verify `config.hosts` is set so Host-header injection cannot reach the app.

## Database & Row-Level Security
<sub>from [`core/06-database.md`](../core/06-database.md)</sub>

* [ ] Search for string interpolation inside `where`, `find_by_sql`, `order`, `group`, `having`, `pluck` and `select` — these accept raw SQL and are the standard Rails injection sites.
* [ ] Verify `order(params[:sort])` is allowlisted rather than passed through.
* [ ] Verify scopes used for tenant isolation cannot be bypassed by `unscoped` or `default_scope` removal.
* [ ] Verify `find` / `find_by` on user-supplied ids is scoped to the current user or tenant, not global.

## Web Frontend
<sub>from [`core/05-web-frontend.md`](../core/05-web-frontend.md)</sub>

* [ ] Search for `html_safe`, `raw`, and `sanitize` with a custom allowlist in views and helpers.
* [ ] Verify `content_security_policy` is configured in an initializer and enforced, not report-only, in production.
* [ ] Verify `redirect_to` never takes a user-supplied URL without `allow_other_host: false` or an allowlist.

## Sessions, Tokens & Cookies
<sub>from [`core/03-sessions-tokens.md`](../core/03-sessions-tokens.md)</sub>

* [ ] Verify the session store choice: `cookie_store` puts session data in the client's cookie — confirm nothing sensitive is in the session, or move to a server-side store.
* [ ] Verify `secret_key_base` is loaded from credentials or the environment, never committed.
* [ ] Verify session cookies are `secure`, `httponly` and `same_site: :lax` or stricter.
* [ ] Verify Devise `config.timeout_in` and lockable settings match the documented policy.

## Object Storage & File Handling
<sub>from [`core/07-storage-and-files.md`](../core/07-storage-and-files.md)</sub>

* [ ] Verify `send_file` and `send_data` paths cannot be influenced by user input (path traversal).
* [ ] Verify ActiveStorage direct uploads validate content type and size server-side, not only in the client.
* [ ] Verify ActiveStorage `service_urls` expire, and that public buckets are intentional.

## Secrets Management & Cryptography
<sub>from [`core/08-secrets-and-crypto.md`](../core/08-secrets-and-crypto.md)</sub>

* [ ] Verify `config/master.key` is gitignored and provisioned out of band.
* [ ] Verify no secret sits in `config/credentials.yml.enc` that should be rotated per environment.
* [ ] Search for `Marshal.load`, `YAML.load` (not `safe_load`), and `Psych.load` on any untrusted input — all are remote code execution.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Verify `config.consider_all_requests_local = false` in production so exception pages are not served.
* [ ] Verify the Rails debug gems — `web-console`, `better_errors`, `listen` — are in the development group only.
* [ ] Verify `bin/rails credentials:show` output is not logged by CI.
* [ ] Run `bundle audit` and confirm no known-vulnerable gem ships.
