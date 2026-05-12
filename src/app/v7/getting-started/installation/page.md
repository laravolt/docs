---
title: Installation
---

# Installation

Install Laravolt v7 into a Laravel application, publish the platform assets, run migrations, and create the first administrator account. {% .lead %}

## Requirements

Laravolt v7 targets the current Laravel and Livewire generation.

| Dependency | Version |
| --- | --- |
| PHP | `>= 8.2`, tested up to `8.4` |
| Laravel framework | `^12.0` or `^13.0` |
| Livewire | `^4.0` |
| Preline UI | `^2.0` |
| Tailwind CSS | `^3.0` or later &nbsp;&nbsp; _TODO: verify the exact Tailwind version shipped with the starter kit_ |
| Database | Any database supported by Laravel migrations |

Laravolt also relies on common PHP extensions: `bcmath`, `ctype`, `curl`, `gd`, `json`, `mbstring`, `openssl`, `pdo`, and `xml`.

{% callout title="Upgrading from v6?" %}
Laravolt v6 targeted Laravel 11/12 and Livewire 3. v7 raises the baseline to Laravel 12/13 and Livewire 4. Review [Upgrade guide](/v7/upgrade-guide) before adding v7 to an existing v6 project.
{% /callout %}

## Install the package

Add Laravolt to a fresh or existing Laravel application:

```bash
composer require laravolt/laravolt
```

Laravolt is split into small packages under the `laravolt/*` namespace (for example `laravolt/preline-form`, `laravolt/suitable`, `laravolt/auto-crud`). The main metapackage wires the service providers, migrations, and configuration together.

## Run the installer

```bash
php artisan laravolt:install
```

The installer publishes configuration, migrations, assets, and seed data used by the platform modules.

{% callout title="TODO: verify installer flags" type="warning" %}
Confirm the exact flags and prompts exposed by `laravolt:install` in v7 (for example starter kit selection, optional modules, or non-interactive mode) before documenting them.
{% /callout %}

## Run migrations

Laravolt ships migrations for platform tables such as users, roles, permissions, settings, jobs, media, and workflow state.

```bash
php artisan migrate
```

Follow normal Laravel migration practices in production: review the generated SQL, back up important data, and migrate during a safe deployment window.

## Create the first admin user

Create an administrator account after the platform tables exist:

```bash
php artisan laravolt:admin
```

The command asks for name, email, and password. TODO: verify whether v7 supports non-interactive flags (for example `--name`, `--email`, `--password`) for scripted provisioning.

## Build frontend assets

Laravolt v7 uses Preline UI and Tailwind CSS for its UI foundation. Install frontend dependencies with the package manager your project uses:

```bash
# npm
npm install
npm run build

# bun
bun install
bun run build

# pnpm
pnpm install
pnpm run build
```

Use the same manager consistently across development and CI. The documentation site uses Bun; the application starter kit defaults to npm. TODO: verify the starter kit's preferred package manager in v7.

## Project structure

A Laravolt project keeps the business application understandable by following Laravel conventions. A typical layout:

```txt
app/
  Http/
    Controllers/
    Requests/             # FormRequest classes validated on the server
  Models/
  Policies/
  Providers/
config/
  laravolt.php            # TODO: verify published config filenames in v7
resources/
  views/
  js/
  css/
routes/
  web.php
  auth.php
```

Keep domain logic in standard Laravel locations. Use Laravolt abstractions for platform surfaces: forms (`PrelineForm`), tables (`Suitable`), menus, actions, permissions, and generated admin workflows.

## Verify the installation

After installation:

1. Visit the application in a browser.
2. Sign in with the administrator account created above.
3. Open the admin area and confirm the navigation renders.
4. Create or edit a small record using a Laravolt form.
5. Run your test suite.

```bash
php artisan test
```

If a step fails, check [Upgrade guide](/v7/upgrade-guide) for dependency notes and TODO items that still need API verification against the live v7 release.

## What to read next

- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — the mental model for structuring v7 projects so teams and coding agents can extend them safely.
- [Forms overview](/v7/forms/overview) — how `PrelineForm` turns Laravel validation and Preline UI into a single form API.
