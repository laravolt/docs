---
title: AI-ready development guide
---

# AI-ready development guide

Laravolt v7 is AI-ready because its conventions make work easier to describe, review, and test. {% .lead %}

The goal is not to let a coding agent improvise an application. The goal is to give humans and agents a shared map: where code belongs, which APIs are safe to extend, and what evidence proves the change works.

## Start with a clear feature contract

Before asking an agent to code, write the feature in Laravolt terms:

```txt
Resource: PurchaseOrder
Screens: index, create, edit, show
Actions: submit, approve, reject
Permissions: purchase-order.read/create/update/approve/reject
Validation: StorePurchaseOrderRequest, UpdatePurchaseOrderRequest
UI: PrelineForm for forms, Suitable for listing
Tests: feature tests for validation and permissions, browser smoke for happy path
```

This turns a vague prompt into a reviewable checklist.

## Preferred project layout

Keep custom application code in standard Laravel locations:

```txt
app/
  Actions/
  Http/
    Controllers/
    Requests/
  Jobs/
  Models/
  Policies/
  Providers/
resources/views/
routes/web.php
tests/Feature/
tests/Browser/
```

Use Laravolt packages for platform surfaces: forms, tables, menus, access control, workflow, media, and generated admin modules. Do not bury domain logic inside Blade views or anonymous callbacks.

## Promptable conventions

Good Laravolt prompts mention the exact platform primitive to use:

- “Use `PrelineForm` and a `FormRequest`.”
- “Use `Suitable` for the list page and keep query logic out of Blade.”
- “Register the sidebar menu with permission metadata.”
- “Add positive and negative permission tests.”
- “Dispatch slow side effects to a queued job.”
- “Mark unknown APIs as TODO instead of inventing them.”

Bad prompts ask for broad output without boundaries:

```txt
Build an inventory module with AI.
```

Better:

```txt
Build a Laravolt v7 inventory module for Product.
Create controller, FormRequests, policy, menu entry, Suitable list, PrelineForm create/edit views,
and tests for product.read/create/update permissions.
Do not add destructive actions without policy checks.
```

## Safe extension points

Prefer these extension points when automating work:

| Need | Extension point |
| --- | --- |
| Validate form input | Laravel `FormRequest` |
| Render business forms | `PrelineForm` |
| Render lists | `Suitable` builder/table classes |
| Protect actions | Laravel policies and Laravolt permissions |
| Register navigation | `app('laravolt.menu.builder')->register(...)` or `config/laravolt/menu/*` |
| Slow side effects | queued jobs and event listeners |
| Workflow state | `WorkflowService` and workflow events |
| Browser confidence | Playwright/browser smoke tests |

If an agent needs to change something outside this table, ask it to explain why before accepting the patch.

## Review checklist for AI-generated code

Review generated Laravolt code with this checklist:

- [ ] Routes are named and protected by auth/authorization.
- [ ] Controllers are thin and delegate business work.
- [ ] Forms use `FormRequest` validation.
- [ ] Blade views do not contain query or permission logic.
- [ ] Menu entries include permission metadata.
- [ ] Destructive buttons have backend authorization, not only UI hiding.
- [ ] Tests cover allowed and denied paths.
- [ ] Docs or comments explain any non-obvious convention.

## Minimal evidence contract

Every agent task should return evidence, not just a summary:

```txt
Return changed files, tests run, build result, screenshots if UI changed,
and any TODOs that require human verification.
```

For release work, require at least:

```bash
composer test
bun run build
php artisan route:list
```

Use smaller targeted gates during development, then full gates before tagging a release.

## What to read next

- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — the product-level mental model.
- [Forms overview](/v7/forms/overview) — predictable form APIs for humans and agents.
- [Browser testing](/v7/testing/browser-testing) — smoke tests that catch integration drift.
