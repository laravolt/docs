---
title: AI Context
---

# AI Context

This page is the canonical entry point for coding agents that need to understand Laravolt v7 before generating code. Feed this page (or `/llms-full.txt`) to your agent as project context. {% .lead %}

## What is Laravolt v7?

Laravolt v7 is a Laravel application platform for teams building internal tools, enterprise apps, admin panels, and workflow systems. It provides:

- **Thunderclap** — CRUD module generator from database tables
- **PrelineForm** — form builder with Preline UI + Tailwind CSS + FormRequest validation
- **Suitable / TableView** — data table components (Livewire-powered)
- **ACL** — role/permission system with Gate integration and menu visibility
- **Workflow** — optional Camunda-backed process engine for multi-step approvals

## Key conventions

| Concept | Location | Notes |
| --- | --- | --- |
| Generated modules | `modules/{Module}/` | Created by `php artisan laravolt:clap --table=<table>` |
| Custom actions | `app/Actions/{Domain}/{Verb}Action.php` | Survives regeneration |
| Form requests | `modules/{Module}/Requests/Store.php`, `Update.php` | Extend `FormRequest` |
| Policies | `app/Policies/{Model}Policy.php` | Standard Laravel policies |
| Table views | `modules/{Module}/{Module}TableView.php` | Extends `Laravolt\Ui\TableView` |
| Config | `modules/{Module}/config/{module-name}.php` | Permission, routes, menu |
| Routes | `modules/{Module}/routes/web.php` | `can:<permission>` middleware |
| Views | `modules/{Module}/resources/views/` | Preline + Tailwind |
| Tests | `modules/{Module}/Tests/{Module}Test.php` | Pest, with admin role seeded |

## Stack

- PHP 8.4, Laravel 13, Livewire 4
- Preline UI + Tailwind CSS 4
- Pest 4 (unit + browser via Playwright)
- SQLite (dev) / PostgreSQL (prod)

## How to use this as agent context

### Option 1: Full context dump

```bash
curl https://docs.laravolt.dev/llms-full.txt | pbcopy
# Paste into your agent's system prompt or context window
```

### Option 2: Targeted pages

Feed the agent only the pages relevant to the task:

- **Scaffolding a new module:** `/v7/admin-workflows/thunderclap.md` + `/v7/ai-coding-quickstart.md`
- **Adding a business action:** `/v7/admin-workflows/business-actions.md`
- **Form work:** `/v7/forms/overview.md` + `/v7/forms/validation.md`
- **Table/listing work:** `/v7/ui-foundation/tables.md`
- **Permissions:** `/v7/security/access-control.md`
- **Testing:** `/v7/testing/browser-testing.md`

### Option 3: llms.txt index

```bash
curl https://docs.laravolt.dev/llms.txt
# Shows all available pages with one-line descriptions
```

## Common agent pitfalls

1. **Inventing package APIs** — Laravolt's public surface is documented. If a method isn't in the docs, it probably doesn't exist. Ask the agent to mark uncertain calls for review.
2. **Skipping FormRequest** — Every form must have a FormRequest. Inline validation in controllers is not the v7 convention.
3. **Ignoring permissions** — Generated modules gate on `modules.<name>.view`. Custom actions need their own permission + policy method.
4. **Raw `<table>` markup** — Use `TableView` (Livewire) or `Suitable` (server-rendered). Never hand-roll table HTML in admin pages.
5. **Fomantic/Semantic classes** — v7 is Preline + Tailwind only. No `ui button`, `ui segment`, etc.

## Related pages

- [AI-ready development guide](/v7/ai-ready-development/guide) — design principles
- [AI Coding Quickstart](/v7/ai-coding-quickstart) — step-by-step first module
- [AI Task Patterns](/v7/ai-task-patterns) — copy-paste prompt templates
- [Task Recipes](/v7/task-recipes) — post-generation customization recipes
