---
title: AI-ready platform
---

# AI-ready platform

Laravolt v7 is designed so both human developers and AI coding agents can reason about a project without guessing. This page explains what "AI-ready" means in practice, why it matters, and how to use it. {% .lead %}

## Why AI-ready is an engineering stance

Business applications are rarely hard because of one algorithm. They become hard because small decisions multiply: where a field is declared, how validation is displayed, where permissions are checked, how admin actions are named, how tables are filtered.

When those decisions are implicit, every change requires reading the whole codebase. That is bad for humans. It is worse for AI coding assistants, which rely on obvious structure and clear extension points to produce safe edits.

Laravolt v7 treats AI-readiness as ordinary engineering discipline:

- **Explicit conventions** — forms, tables, menus, actions, permissions, and configuration live in predictable places.
- **Composable APIs** — each abstraction is a fluent builder with documented methods, not a pile of magic.
- **Safe defaults** — CSRF, authorization, validation, and error handling are on by default.
- **Laravel-native primitives** — `FormRequest`, policies, queues, events, and tests still do the heavy lifting.
- **Documentation that explains intent** — every convention answers "why" before "how".

AI-ready does not replace engineers. It makes the codebase a better collaborator.

## The mental model

Think of a Laravolt project as three layers:

1. **The Laravel application** you already know — routes, controllers, models, migrations, jobs, events, policies.
2. **The Laravolt platform layer** — authentication, roles and permissions, menus, flash messages, audit, settings, and starter UI.
3. **Product surfaces** — forms, tables, actions, and workflows built with Laravolt's fluent APIs on top of Blade, Livewire, Preline UI, and Tailwind CSS.

Everything that feels unfamiliar should map back to one of these layers. If it does not, something is probably wrong.

## What makes Laravolt predictable

### Predictable places

A new developer — or a coding agent — should be able to answer these questions in under a minute:

| Question | Where to look |
| --- | --- |
| Where is a form defined? | Blade view using `PrelineForm::...`, validated by an `app/Http/Requests/*` class |
| Where is a list/table defined? | Suitable builder/table class, often generated with `php artisan make:table` |
| Where are permissions checked? | Laravel policies, `@can` directives, or Laravolt ACL helpers |
| Where does a menu item live? | `app('laravolt.menu.builder')->register(...)` or `config/laravolt/menu/*` |
| Where does a workflow run? | Workflow module using `WorkflowService::start()` / `submitTask()` |

Every Laravolt convention tries to collapse "it depends" into "it lives here".

### Predictable APIs

Platform builders share the same fluent shape. For example, a form field is always:

```php
PrelineForm::text('email')
    ->label('Email')
    ->required()
    ->hint('Work email is fine too');
```

And a model-bound form always opens the same way:

```php
PrelineForm::open('users.update', $user)
    ->put()
    ->validate(UpdateUserRequest::class);
```

Consistency is the point. When a developer or an AI assistant sees `PrelineForm::text`, they can guess `PrelineForm::select`, `PrelineForm::date`, and `PrelineForm::file` without reading source code.

### Predictable errors

Validation errors are driven by Laravel's `FormRequest`. Authorization errors are driven by Laravel policies. Flash messages follow a single API. If something breaks, the cause is usually obvious because the code paths are short and named clearly.

## Writing for both humans and agents

If you are planning to use AI tools to assist development, structure the project so every prompt has enough context to succeed.

- **Name things after the business.** `PurchaseOrder`, `Invoice`, `ApprovalStep` beat `Item`, `Record`, `Step`.
- **Keep files small and named after their role.** `CreatePurchaseOrderRequest` in `app/Http/Requests`, not inside a controller.
- **Prefer Laravolt builders over ad-hoc Blade.** `PrelineForm::text('sku')` is easier for an agent to modify than raw HTML.
- **Write FormRequests, policies, and tests.** Validation and authorization belong outside controllers.
- **Document intent in PHPDoc.** A one-line summary on each public method is enough for most agents to make correct edits.

## Safe extension points

Laravolt gives you a short list of places where it is safe to extend platform behaviour:

- **Config files** — enable or disable modules, change table prefixes, customize labels.
- **Service providers** — register macros, bind interfaces, publish views.
- **Form macros** — add a reusable field type with `PrelineForm::macro(...)`.
- **Policies** — decide who can do what, without touching controllers.
- **Events and listeners** — react to platform events (for example "user invited") without modifying core code.
- **Overridable views** — publish and edit platform Blade components when needed.

If you find yourself monkey-patching platform code, stop and open an issue. The convention should cover the case.

## Use AI tools with guardrails

Laravolt is AI-ready, not AI-autonomous. Always keep the following in place:

- **Automated tests** — treat tests as the contract AI suggestions have to satisfy.
- **Static analysis** — use Larastan/PHPStan and Pint to catch regressions.
- **Authorization at the boundary** — assume every generated endpoint is untrusted until a policy says otherwise.
- **Code review** — a human approves every change before it ships, regardless of who wrote it.

Documentation, policies, tests, and conventions are the guardrails. AI is the accelerator.

## Verified extension points

The current codebase exposes practical extension points for the most common generated work:

- menu registration through `app('laravolt.menu.builder')->register(...)` and config arrays under `config/laravolt/menu/*`
- table/list rendering through Suitable builders and generated table classes
- workflow state transitions through `WorkflowService::start()` and `WorkflowService::submitTask()`
- AI assistant recipes in [AI-ready development guide](/v7/ai-ready-development/guide)

## What to read next

- [Forms overview](/v7/forms/overview) — the first concrete example of Laravolt's convention-first APIs.
- [Installation](/v7/getting-started/installation) — set up a project that follows these conventions from day one.
- [Upgrade guide](/v7/upgrade-guide) — how the platform layer evolved from v6 to v7.
