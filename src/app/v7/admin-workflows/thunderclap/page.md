---
title: Thunderclap
---

# Thunderclap

Thunderclap is one of the fundamental building blocks in Laravolt v7. It generates admin modules from database tables so teams can start from a working CRUD surface, then refine the generated code into a production workflow. {% .lead %}

In v7, Thunderclap is the default path for turning an existing schema into a conventional Laravolt module. It gives humans and AI coding agents the same predictable starting point: model, controller, form requests, views, routes, table view, tests, and module provider.

## What Thunderclap is

Thunderclap is the v7 scaffolding foundation for CRUD-heavy business software. The `laravolt:clap` command reads table metadata through Doctrine DBAL, copies a stub template, replaces placeholders, and writes a module into the configured target directory.

The default Laravolt template can generate:

- Eloquent model and factory
- controller
- store and update form requests
- index, create, edit, show, and form views
- table view class
- route file
- module configuration
- service provider
- feature test

Treat the output as a strong first draft. It gives each resource a conventional place, but application-specific authorization, validation, relationships, menus, labels, and tests still need review.

## Why it is fundamental in v7

Laravolt v7 treats generated scaffolding as part of the platform contract, not as disposable boilerplate. Thunderclap turns the most common starting point for enterprise applications — an existing table or migration — into files that follow the same names, folders, and review points across projects.

That matters because repeated structure is what makes v7 AI-ready:

- developers can inspect a generated module without learning a new project-specific pattern
- coding agents can modify forms, tables, requests, and routes in predictable places
- reviewers can focus on business rules instead of asking where the CRUD surface came from
- teams can standardize MVP delivery without hiding the Laravel code they still own

Thunderclap should be the first tool considered when a feature starts as a resource-backed admin module.

## When to use it

Thunderclap fits best when:

- a table already exists and you need an admin surface quickly
- the resource follows ordinary CRUD before custom business actions are added
- you want generated files to follow the same module structure across the application
- you want model search, filter, and sort traits prepared for Suitable listings
- you are building an MVP and need a visible workflow before refining edge cases

Do not use it as a replacement for domain modeling. If the process has approvals, task assignments, or long-running state, scaffold the resource first, then design the workflow explicitly.

## Basic workflow

Start by checking which models Thunderclap can detect:

```bash
php artisan laravolt:models
php artisan laravolt:models --table=purchase_requests
```

Generate a module from a table:

```bash
php artisan laravolt:clap --table=purchase_requests --module=PurchaseRequest
```

For interactive generation, omit the table option:

```bash
php artisan laravolt:clap
```

A practical review loop:

1. create or migrate the table
2. run `laravolt:models` to see whether an existing model is detected
3. run `laravolt:clap` for the target table
4. inspect generated routes, requests, views, table query, and tests
5. wire the module into application navigation and permissions
6. run Pint, tests, and a browser check before keeping the scaffold

## Commands

```bash
php artisan laravolt:clap {--table=} {--template=} {--force} {--module=} {--use-existing-models}
php artisan laravolt:models {--table=}
```

| Command | Purpose |
| --- | --- |
| `laravolt:clap` | Generate a CRUD module from a database table. |
| `laravolt:models` | List detected `app/Models` classes and inspect whether they are ready for generated listings. |

Important `laravolt:clap` options:

| Option | Use it when... |
| --- | --- |
| `--table=` | You already know which database table should drive the module. |
| `--module=` | The module name should differ from the table-derived default. |
| `--template=` | You want a custom stub template instead of the default Laravolt template. |
| `--force` | You intentionally want to replace an existing generated module directory. |
| `--use-existing-models` | You want Thunderclap to prefer detected `app/Models` classes where possible. |

Without `--table`, Thunderclap prompts for a table. Without a model decision, it can offer to enhance an existing model, create a module-local model, or skip model generation.

## Generated module structure

The default template is stored in the Thunderclap package stubs and is copied into the configured target directory. A generated module typically contains:

```txt
modules/PurchaseRequest/
  Controllers/
  Models/
  Requests/
  resources/views/
  routes/web.php
  config/config.php
  ServiceProvider.php
  TableView.php
  Tests/
```

The generated route file uses the module route configuration for prefix and middleware, then registers a resource controller. Review those defaults before exposing the module to real users.

## Existing model detection

Thunderclap scans `app/Models` for a model that matches the selected table. It checks common naming variations, verifies that the class extends Eloquent, and compares the resolved table name.

When an existing model is used, Thunderclap can prepare it for generated listings by adding missing Suitable traits:

- `AutoFilter`
- `AutoSearch`
- `AutoSort`

It can also add `$searchableColumns` based on the table columns. Review the generated searchable columns before relying on them for production search behavior.

## Configuration

Thunderclap configuration is merged under `laravolt.thunderclap` and can be published:

```bash
php artisan vendor:publish --provider="Laravolt\Thunderclap\ServiceProvider" --tag="config"
```

The published file is:

```txt
config/laravolt/thunderclap.php
```

Common settings include:

| Setting | Purpose |
| --- | --- |
| `columns.except` | Columns excluded from generated fields, such as IDs and timestamps. |
| `namespace` | Base namespace for generated modules. |
| `target_dir` | Directory where modules are written. |
| `routes.prefix` | Default route naming prefix used by generated route stubs. |
| `routes.middleware` | Middleware applied by generated module route configuration. |
| `default` | Default template name. |
| `templates` | Template names mapped to stub directories. |
| `transformer` | Class responsible for turning schema metadata into generated placeholders. |

Use custom templates when the generated structure is repeatedly close but not quite aligned with your application's conventions.

## Review generated code

Before keeping a Thunderclap scaffold, check:

- route names and middleware
- menu entries and permission metadata
- policies or controller authorization
- form request validation rules
- table search, filters, sorts, and pagination
- model relationships and casts
- generated tests and missing business cases
- generated labels and field types

Thunderclap is most useful when it removes repetitive typing without hiding responsibility. The final module should still read like ordinary Laravel and Laravolt code.

## What to read next

- [Admin workflows](/v7/admin-workflows/overview) — structure generated resources into business operations.
- [Forms overview](/v7/forms/overview) — refine generated create and edit screens.
- [Tables and listings](/v7/ui-foundation/tables) — tune generated listings.
- [Access control](/v7/security/access-control) — protect generated routes and actions.
- [Artisan commands](/v7/reference/artisan-commands) — command reference for Laravolt packages.
