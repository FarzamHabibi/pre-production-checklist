# Stack file format

Copy this file to `checklists/stacks/<slug>.md`, delete this heading block, and fill in
the template at the bottom. Everything above the template explains the rules; nothing
above it should survive into your file.

[← all checklists](../README.md)

---

## The one rule

> **If you can rewrite the item without naming the product and it still makes sense, it
> belongs in `security/core/`, not here.**

| | |
| --- | --- |
| ✅ Belongs here | `Verify DRF DEFAULT_PERMISSION_CLASSES is restrictive; a missing default means AllowAny.` |
| ❌ Belongs in `security/core/` | `Verify authorization is enforced server-side.` |
| ✅ Belongs here | `Verify html/template is used rather than text/template, which does not escape.` |
| ❌ Belongs in `security/core/` | `Verify output is escaped in the correct context.` |

A stack file is a **supplement**. Someone reading it has already been given all 2,756
stack-agnostic items; you are adding what those cannot express. Aim for **15–35 items**.
Past roughly 60, most of it belongs in `security/core/`.

## File anatomy

```markdown
# Django                          ← H1: the display label. Shown in `prodcheck stacks`.

Items from the core checklists that are specific to **Django**. If you do not use it,
skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Backend Application & API      ← H2: which core checklist this group extends.
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify `DEBUG = False` in production, and that no code path re-enables it.
* [ ] Verify `ALLOWED_HOSTS` is an explicit list, never `['*']`.

## Database & Row-Level Security  ← another group, another core checklist
<sub>from [`security/core/06-database.md`](../security/core/06-database.md)</sub>

* [ ] Search for `.raw(`, `.extra(`, and any f-string formatting inside a query.
```

### Fields, and what each one drives

| Element | Required | What it does |
| --- | --- | --- |
| **Filename** `<slug>.md` | yes | Becomes `stack_id` in [`data/checklist.json`](../../data/checklist.json). This is what people type: `npx prodcheck --stack django`. Lowercase, hyphens, no spaces. |
| **H1** `# Display Label` | yes | Becomes `stack`. Human-readable, proper capitalization: `Ruby on Rails`, not `rails`. Both the slug and the label resolve on the command line. |
| **Intro paragraph** | yes | Copy it verbatim from the template, swapping the product name. It tells a reader who does not use this product that they can skip the file without losing anything. |
| **H2** `## Checklist Name` | yes | Becomes `section`. **Must match the H1 of a real checklist file** — usually one in `security/core/`, but `security/ai/` and `security/ai-generated-code/` are equally valid targets. This is what tells a reader where the item sits in the larger picture. |
| `<sub>from ...</sub>` line | yes | The back-link to that core checklist. Relative path from `stacks/`, so it starts `../core/`. |
| `* [ ] ` items | yes | One verifiable action each. Never `[x]`, never `[N/A]` — the file ships unchecked. |

### The H2 must name a real checklist

Use one of these exactly. Most supplements only need two or three of them.

| H2 to write | Back-link path |
| --- | --- |
| `Architecture & Threat Model` | `security/core/01-threat-model.md` |
| `Authentication & Authorization` | `security/core/02-authorization.md` |
| `Sessions, Tokens & Cookies` | `security/core/03-sessions-tokens.md` |
| `Backend Application & API` | `security/core/04-backend-api.md` |
| `Web Frontend` | `security/core/05-web-frontend.md` |
| `Database & Row-Level Security` | `security/core/06-database.md` |
| `Object Storage & File Handling` | `security/core/07-storage-and-files.md` |
| `Secrets Management & Cryptography` | `security/core/08-secrets-and-crypto.md` |
| `Common Web Attack Classes` | `security/core/09-common-web-attacks.md` |
| `Business Logic & Race Conditions` | `security/core/10-business-logic.md` |
| `Mobile Applications` | `security/core/11-mobile-apps.md` |
| `Desktop Applications` | `security/core/12-desktop-apps.md` |
| `Runtime, Containers & Hosting` | `security/core/13-runtime-and-containers.md` |
| `DNS, CDN, Edge & WAF` | `security/core/14-edge-dns-waf.md` |
| `CI/CD & Supply Chain` | `security/core/15-ci-cd-and-supply-chain.md` |
| `Monitoring, Detection & Incident Response` | `security/core/16-monitoring-and-response.md` |
| `Pre-Release Gates` | `security/core/17-release-gates.md` |

If your product touches the AI surface, these are valid too — `security/ai/02-prompt-injection.md`,
`security/ai/03-tools-and-agency.md`, `security/ai/07-multi-agent-and-mcp.md` and the rest of `security/ai/` and
`security/ai-generated-code/`. Use the target file's H1 as the heading, exactly as above.

### Writing the items

* One verifiable action per line, imperative mood.
* Start with `Verify`, `Confirm`, `Search for`, `Audit`, `Run`, `Identify` or `Inventory`.
* Name the actual symbol, setting or file in backticks — `DEBUG`, `params.permit!`,
  `management.endpoints.web.exposure.include`. A reader should be able to grep for it.
* Say *why* when the reason is not obvious. `Verify SECURE_PROXY_SSL_HEADER matches your
  actual proxy — a wrong value lets a client claim HTTPS` is worth twice the bare version.
* No vendor pitches, no affiliate links, no tool recommendations unless the item is
  meaningless without one.

## After you add the file

1. Add the slug to `STACK_LABEL` in [`scripts/build_data.py`](../../scripts/build_data.py)
   so items get the display label instead of falling back to `any`.
2. Run `./scripts/build.sh` and commit the regenerated files.
3. Run `node cli/test.js` — the suite checks that every stack resolves by both slug and
   label, and that counts stay consistent.

---

<!-- ============ DELETE EVERYTHING ABOVE THIS LINE ============ -->

# <Product or platform name>

Items from the core checklists that are specific to **<Product>**. If you do not use it,
skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## <Exact H1 of a core checklist — see the table above>
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] <A check that only makes sense for this product.>
* [ ] <Another one.>

## <Another core checklist>
<sub>from [`security/core/06-database.md`](../security/core/06-database.md)</sub>

* [ ] <...>
