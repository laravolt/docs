---
title: Package list
---

# Package list

Laravolt v7 is a platform made from focused packages. {% .lead %}

The main `laravolt/laravolt` package wires the service providers, facades, commands, migrations, assets, and configuration together.

## Core packages

| Package namespace | Purpose |
| --- | --- |
| `Laravolt\Platform` | application shell, UI providers, menu services, permissions, settings, commands |
| `Laravolt\Epicentrum` | user, role, account, profile, and permission management screens |
| `Laravolt\PrelineForm` | Preline UI form builder with validation and input masking support |
| `Laravolt\Suitable` | table/list builder for admin screens |
| `Laravolt\AutoCrud` | generated CRUD workflows |
| `Laravolt\Workflow` | process modules, forms, workflow service, events, and synchronization |
| `Laravolt\Media` | media library and client upload support |
| `Laravolt\Asset` | platform asset management |
| `Laravolt\Support` | shared helpers and support utilities |

## Optional / feature packages

| Package namespace | Purpose |
| --- | --- |
| `Laravolt\Lookup` | configurable lookup/reference data |
| `Laravolt\FileManager` | file management UI |
| `Laravolt\DatabaseMonitor` | database monitoring surfaces |
| `Laravolt\Mailkeeper` | queued mail sending utilities |
| `Laravolt\Thunderclap` | code generation and module scaffolding |
| `Laravolt\Pint` | code style helpers |
| `Laravolt\SemanticForm` | legacy-compatible form surface kept during migration |

## Facades and aliases

The main package registers these aliases:

| Alias | Target |
| --- | --- |
| `Asset` | `Laravolt\Asset\AssetFacade` |
| `Suitable` | `Laravolt\Suitable\Facade` |
| `PrelineForm` | `Laravolt\PrelineForm\Facade` |
| `Form` | legacy-compatible alias to the PrelineForm facade |

For new v7 form code, prefer the explicit `PrelineForm` alias instead of the legacy-compatible `Form` alias.

## Service providers

The metapackage auto-discovers providers for platform modules, Preline/Semantic form builders, Suitable, Auto CRUD, Workflow, Media, Lookup, File Manager, Mailkeeper, Thunderclap, Asset, Support, and UI services.

In normal applications you should not need to manually register those providers. If you are building a package or running an unusual testbench setup, confirm provider discovery before debugging missing views, commands, or facades.

## Choosing the right primitive

| If you need... | Start with... |
| --- | --- |
| a create/edit form | `PrelineForm` + `FormRequest` |
| a searchable admin list | `Suitable` |
| generated CRUD from an existing table | `Thunderclap` / `AutoCrud` |
| user and role management | `Epicentrum` |
| role-gated navigation | platform menu services + permissions |
| process state and approvals | `Workflow` |
| uploads and media records | `Media` |

## What to read next

- [Forms overview](/v7/forms/overview) — build with PrelineForm.
- [Admin workflows](/v7/admin-workflows/overview) — combine forms, tables, actions, and permissions.
- [Artisan commands](/v7/reference/artisan-commands) — commands exposed by these packages.
