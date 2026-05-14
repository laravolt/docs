---
title: Artisan commands
---

# Artisan commands

Laravolt v7 ships Artisan commands for installation, user management, permissions, scaffolding, assets, workflow checks, and module generation. {% .lead %}

Run `php artisan list laravolt` in your application to see the exact commands available after installation.

## Platform setup

```bash
php artisan laravolt:install
```

Publishes skeleton files, Laravolt migrations, Laravolt assets, media-library migrations, and installs Pest 4 support. The command currently has no flags.

After it finishes, the installer suggests `php artisan migrate:fresh` for a new application:

```bash
php artisan migrate:fresh
```

For existing applications, use normal migration practice instead:

```bash
php artisan migrate
```

Review generated files and migration impact before using `migrate:fresh` because it drops existing tables.

## Admin user

```bash
php artisan laravolt:admin {name?} {email?} {password?} {--no-verify}
```

Creates or updates an administrator account and assigns a role with wildcard permission.

Interactive mode:

```bash
php artisan laravolt:admin
```

Scripted mode:

```bash
php artisan laravolt:admin "Rama" rama@example.com secret --no-verify
```

The three credentials are positional arguments. Verify the exact behavior of `--no-verify` with `php artisan help laravolt:admin` before using it in automated provisioning.

## Permissions and roles

```bash
php artisan laravolt:sync-permission {--refresh}
php artisan laravolt:manage-user {user?}
php artisan laravolt:manage-role {role?}
```

Use `laravolt:sync-permission` after adding permission definitions. Use the manage commands for operator-driven user and role maintenance.

## Assets and links

```bash
php artisan laravolt:extract-assets
php artisan laravolt:link
```

These are normally called by `laravolt:install`, but they are useful when rebuilding public assets or repairing symlinks.

## Scaffolding

```bash
php artisan make:table {name} {--legacy}
php artisan make:view {name} {--force} {--title=}
php artisan make:chart {name}
php artisan make:statistic {name}
php artisan laravolt:clap {--table=}
php artisan laravolt:models {--table=}
```

Use `make:table` for Suitable/Livewire table classes and `make:view` for Blade views. `make:chart` and `make:statistic` generate Livewire components for dashboard surfaces. Thunderclap commands generate module scaffolding from database tables and list model candidates.

## Workflow

```bash
php artisan laravolt:workflow:check
php artisan laravolt:workflow:sync-instances
```

Use these commands to validate workflow integration and synchronize local process instances.

## Mailkeeper and media

```bash
php artisan laravolt:send-mail
php artisan media:cleanup-chunks {--hours=24} {--queue}
```

Use the mail command for queued mailkeeper delivery and the media cleanup command for stale chunked uploads. `--queue` dispatches cleanup work instead of running it synchronously.

## Testing setup

```bash
php artisan laravolt:pest4-install {--force}
```

This command installs and configures Pest 4. It is called by `laravolt:install`, but can be re-run with `--force` when repairing a local test setup.

## What to read next

- [Installation](/v7/getting-started/installation) — where setup commands fit into first install.
- [Workflow and automation](/v7/workflow-and-automation/overview) — operational workflow commands.
- [Package list](/v7/reference/package-list) — packages behind the commands.
