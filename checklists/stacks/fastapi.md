# FastAPI

Items from the domain checklists that are specific to **FastAPI**. If you do not use it, skip this file entirely — the domain checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify `/docs`, `/redoc` and `/openapi.json` are disabled or authenticated in production; they are on by default and describe every endpoint you have.
* [ ] Verify `debug=True` is not set on the app in production.
* [ ] Verify CORS middleware does not combine `allow_origins=["*"]` with `allow_credentials=True`; Starlette permits the combination and browsers treat it as a wildcard failure.
* [ ] Verify `TrustedHostMiddleware` is configured, or Host-header injection reaches the application.
* [ ] Verify exception handlers do not return the traceback; a bare `Exception` handler that echoes `str(e)` leaks internals.
* [ ] Verify request body size is bounded — neither Starlette nor Uvicorn imposes a limit by default.
* [ ] Verify long-running work is not done in `async def` handlers without awaiting; a blocking call there stalls the whole event loop, not one request.
* [ ] Verify `BackgroundTasks` is not used for anything that must not be lost — it runs in-process and dies with the worker.

## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify authentication is a dependency applied at the router or app level, not remembered per endpoint; a route added without it is the default failure here.
* [ ] Verify `Depends` security dependencies actually raise rather than returning `None` for an unauthenticated caller.
* [ ] Verify `response_model` is set on every route returning an ORM object — without it FastAPI serialises whatever attributes exist, including hashes and internal flags.
* [ ] Verify `response_model_exclude` is not the only thing protecting a sensitive field; prefer a schema that never contains it.
* [ ] Verify request models do not accept ownership fields — `user_id`, `role`, `is_admin` — from the body, and that `model_config` forbids extra fields.
* [ ] Verify OAuth2 scopes, if used, are checked and not merely declared.

## Database & Row-Level Security
<sub>from [`security/core/06-database.md`](../security/core/06-database.md)</sub>

* [ ] Verify SQLAlchemy `text()` and `.execute()` calls use bound parameters rather than f-strings.
* [ ] Verify the async session is scoped per request and never shared across concurrent tasks.
* [ ] Verify a session is not held open across an `await` on an external call.

## Backend & Delivery
<sub>from [`performance/07-backend-and-delivery.md`](../performance/07-backend-and-delivery.md)</sub>

* [ ] Verify the app runs under Uvicorn workers sized for the machine, and that a sync endpoint is declared `def` so it runs in the threadpool rather than blocking the loop.
* [ ] Verify `--reload` is not used in production.
