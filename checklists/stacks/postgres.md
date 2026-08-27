# PostgreSQL

Items from the core checklists that are specific to **PostgreSQL**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Backend Application & API
<sub>from [`core/04-backend-api.md`](../core/04-backend-api.md)</sub>

* [ ] Test PostgreSQL function parameters.

## Database & Row-Level Security
<sub>from [`core/06-database.md`](../core/06-database.md)</sub>

* [ ] Review every `SECURITY DEFINER` function.

## AI-Generated Authorization & Data Bugs
<sub>from [`vibe-coding/02-authorization-and-data.md`](../vibe-coding/02-authorization-and-data.md)</sub>

* [ ] AI did not create a `SECURITY DEFINER` function unnecessarily.
* [ ] Every AI-created `SECURITY DEFINER` function is manually reviewed.
