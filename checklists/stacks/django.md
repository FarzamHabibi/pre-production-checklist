# Django

Items from the core checklists that are specific to **Django**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`core/04-backend-api.md`](../core/04-backend-api.md)</sub>

* [ ] Verify `DEBUG = False` in production, and that no code path re-enables it.
* [ ] Verify `ALLOWED_HOSTS` is an explicit list, never `['*']`.
* [ ] Verify `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE` and `SECURE_HSTS_SECONDS` are set.
* [ ] Verify `SECURE_PROXY_SSL_HEADER` matches your actual proxy, or is absent — a wrong value lets a client claim HTTPS.
* [ ] Run `python manage.py check --deploy` and resolve every warning or record why it is accepted.
* [ ] Audit every `@csrf_exempt`; confirm the endpoint authenticates by a mechanism CSRF cannot forge.
* [ ] Verify the Django admin is not reachable at the default path in production, and is behind authentication plus network controls.
* [ ] Verify `X_FRAME_OPTIONS` is `DENY` unless framing is required.

## Authentication & Authorization
<sub>from [`core/02-authorization.md`](../core/02-authorization.md)</sub>

* [ ] Verify DRF `DEFAULT_PERMISSION_CLASSES` is restrictive; a missing default means `AllowAny`.
* [ ] Audit every view that sets `permission_classes = [AllowAny]`.
* [ ] Verify `get_queryset` filters by the requesting user or tenant, rather than filtering in the serializer or template.
* [ ] Verify `ModelSerializer` with `fields = '__all__'` does not expose internal or ownership fields.
* [ ] Verify serializer `read_only_fields` covers every field a client must not set, including `user`, `owner` and `is_staff`.
* [ ] Verify `@login_required` / `LoginRequiredMixin` is present on every non-public view, including class-based ones.

## Database & Row-Level Security
<sub>from [`core/06-database.md`](../core/06-database.md)</sub>

* [ ] Search for `.raw(`, `.extra(`, `connection.cursor()` and any f-string or `%` formatting inside a query.
* [ ] Verify `filter(**request.GET.dict())` or equivalent mass-filtering is not exposed — it lets a caller query relations you did not intend.
* [ ] Verify `order_by(request.GET['sort'])` is allowlisted.

## Web Frontend
<sub>from [`core/05-web-frontend.md`](../core/05-web-frontend.md)</sub>

* [ ] Search templates for `|safe`, `{% autoescape off %}`, and `mark_safe` in Python.
* [ ] Verify `json_script` is used for passing data to JavaScript rather than raw interpolation.

## Sessions, Tokens & Cookies
<sub>from [`core/03-sessions-tokens.md`](../core/03-sessions-tokens.md)</sub>

* [ ] Verify `SESSION_SERIALIZER` is the JSON serializer; the pickle serializer turns session tampering into code execution.
* [ ] Verify `SECRET_KEY` comes from the environment and differs per environment.
* [ ] Verify `SESSION_COOKIE_SAMESITE` and `CSRF_COOKIE_SAMESITE` are set.

## Object Storage & File Handling
<sub>from [`core/07-storage-and-files.md`](../core/07-storage-and-files.md)</sub>

* [ ] Verify uploaded files are validated by content, not by extension or the client-supplied content type.
* [ ] Verify `MEDIA_ROOT` is not served by the application in production, and that user uploads cannot be executed.
* [ ] Verify `FileField`/`ImageField` upload paths cannot be influenced by user input.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Verify `django-debug-toolbar` and `django-extensions` are not installed in production.
* [ ] Verify `pip-audit` or `safety` runs in CI and no known-vulnerable package ships.
