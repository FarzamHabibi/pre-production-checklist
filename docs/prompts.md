# Prompts

[← back to repository](../README.md) · [MCP setup](mcp-clients.md)

Copy one of these into your assistant. They work with any model — Claude, GPT, Gemini,
DeepSeek, Qwen, Kimi, GLM — and in both modes: if the assistant has the
[MCP server](mcp-clients.md#mcp-server) it will fetch the items itself, and if not, paste
a generated checklist file after the prompt.

Every prompt below is built around the same three rules, because without them an
assistant will tell you the code is fine:

1. **Cite `file:line` for every claim.** A finding with no citation is not a finding.
2. **`unknown` is a real answer.** Anything you cannot determine from the code stays
   unknown; it never becomes a pass.
3. **You do not mark anything verified.** You produce evidence; a human decides.

---

## 0. Start here — if you have not used prodcheck before

Paste this into any assistant. It works out what your project is, explains what prodcheck
will do for it, sets it up whichever way your assistant is capable of, and starts on the
release blockers. Use this one if you do not know which of the others you want.

<!-- start-prompt:begin -->
```text
I want to get my project ready to ship. Use prodcheck:
a free, open-source pre-production checklist of 4,349 items
covering security, performance, scale, integrations and what to
do after launch.

It is new, so do not answer it from memory. Everything you need:

- Site: https://prodcheck.pages.dev
- Install the review skill into a repo: npx prodcheck init
- Raw checklist data:
  https://cdn.jsdelivr.net/npm/prodcheck@latest/data/checklist.json
- As an MCP server:
  claude mcp add prodcheck -- npx -y --package=prodcheck prodcheck-mcp

Do this in order.

1. Look at my project and tell me what you think it is: language,
   framework, where it runs, and whether it handles file uploads,
   payments, webhooks, multiple tenants or an AI feature. Say how
   confident you are. Ask me about anything you cannot tell.

2. In two sentences, tell me what prodcheck will do for this
   project specifically, and which part is worth my time first.
   Do not describe the whole thing.

3. Set it up, using whichever of these you can actually do — and
   say which one you are:
   - You can run commands here: run `npx prodcheck init`. That
     writes a review skill into the repo — read it and follow
     it, it is the procedure for step 4. Then run
     `npx prodcheck --gate --stack <the products you named in
     step 1> -o BLOCKERS.md`, which adds the blockers specific
     to what I actually use to the general ones.
   - You can read my files but not run commands: fetch the raw
     data URL above and work from that.
   - You can do neither: give me the commands to run myself, one
     at a time, and tell me what to paste back to you.

4. Start on the release blockers. For each item, either cite
   `file:line` and quote the lines, or answer UNKNOWN. UNKNOWN is
   a normal answer — it means a human has to go and look. Never
   mark anything verified on my behalf; that is my call, not
   yours.

Work through it with me a section at a time. Do not dump the
whole checklist at me.
```
<!-- start-prompt:end -->

---

## 1. Review this codebase against the checklist

The general one. Use it with MCP, or paste a checklist after it.

```
You are reviewing this codebase against a pre-production checklist.

If you have the prodcheck MCP tools, call `checklist_for_stack` with the stacks this
project actually uses to get the relevant items. Otherwise use the checklist I paste
below.

Rules, in order of importance:

1. Every finding must cite file:line and quote the two or three lines it refers to.
   If you cannot cite it, do not report it.
2. Use exactly three states per item:
   - FINDING   — you read the code and it does not do what the item asks. Cite it and
                 say what an attacker or a user would experience.
   - UNKNOWN   — you could not determine this. A normal answer, and often the most
                 useful one. Say what you would need to see.
   - N/A       — the item cannot apply here, and you can say why.
3. There is no pass. Never mark an item verified on my behalf — that is a human's
   mark to make after reading your evidence, and a model has no way to earn it.
   If you want a fourth state, the answer is UNKNOWN.
4. Absence of evidence is UNKNOWN, never a pass. Code that merely looks correct has
   not been established as correct.
5. Skip items that do not apply to this project and say why in one line.

Work in this order: first the items that would block a release, then the rest.

Output a markdown table: item | verdict | file:line | one-sentence reason.
Then list the FINDINGs again underneath with the detail.
```

---

## 2. Just the blockers

For "is it safe to ship this week".

```
Using the prodcheck release gate (call `release_gate`, or use the checklist I paste),
tell me only whether anything here should stop a release.

For each blocking item: FINDING, UNKNOWN or N/A, with file:line for every FINDING.

Then give me one paragraph: if you were the person signing off on this release, what
would you want fixed first and why. Be specific and be blunt. Do not pad the list to
look thorough — if only two things matter, say two things.
```

---

## 3. Scope it before reviewing

Cuts a four-thousand-item checklist down before any of it is read. Good first step.

```
Look at this repository and tell me which parts of a pre-production checklist apply.

Report:
- Language, framework, database, hosting, CDN, CI — from the actual config files, not
  from the README.
- Which of these the project has: file upload, webhooks, background jobs, multi-tenancy,
  payments, email or SMS sending, an LLM or agent feature, a mobile client, a public API.
- For each one, the file that proves it.

Then give me the exact prodcheck command to generate the right checklist, using
`npx prodcheck <domain> --stack <name>`. Domains are security, performance, scale,
integrations, post-launch.
```

---

## 4. Work through it with me

For actually finishing a checklist rather than generating a report nobody reads.

```
We are going to work through this checklist together, one section at a time.

For each section:
1. Tell me which items you can determine from the code, with file:line.
2. Tell me which ones need me — a console, a dashboard, a decision, a conversation.
3. Ask me about those, one question at a time, in plain language. Do not ask me
   something you could have looked up.
4. When I answer, write the result back into the checklist file with [x], [!] or [N/A]
   and a one-line note saying why.

Do not move to the next section until the current one is finished. Do not mark an item
[x] on your own initiative — only after I have said so, or after you have cited code
that proves it and I have agreed.
```

---

## 5. Review a single pull request

Narrow and fast — the one worth wiring into a workflow.

```
Review only the changes in this diff against the checklist.

Ignore everything the diff does not touch. For each changed file, ask which checklist
items its change could plausibly break, and check those.

Pay attention to the classes of mistake that are common in AI-assisted code:
authorization moved to the client, a validation removed during a refactor, a secret
introduced into config, an unpinned dependency or CI action, an error handler that now
returns the stack trace, a query built by string concatenation.

Report only what you can cite. If the diff is clean against the checklist, say so in one
line rather than manufacturing findings.
```

---

## 6. Turn a finding into a fix

After a review, for each real finding.

```
For this finding, produce:
1. The smallest change that fixes it, as a diff.
2. Why this fix and not the more obvious one, if they differ.
3. A test that fails before the fix and passes after it.
4. Anywhere else in the codebase with the same shape of problem, with file:line.

Do not fix anything else while you are in there.
```

---

## A note on trusting the output

An assistant that reviews code written by an assistant will usually conclude it is fine.
That is the entire subject of
[`security/ai-generated-code/`](../checklists/security/ai-generated-code/), and these
prompts are written against it: citations are demanded because they are checkable, and
`UNKNOWN` is made a first-class answer because the alternative is a quiet PASS.

Spot-check the citations. If a line number is wrong, treat the whole run as suspect.
