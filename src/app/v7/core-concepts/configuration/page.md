---
title: Configuration
---

# Configuration

Laravolt v7 keeps platform behaviour in Laravel configuration files so applications can change defaults without patching package code. {% .lead %}

Configuration is one of the main AI-ready extension points: it is explicit, searchable, reviewable, and easy to diff in pull requests.

## Published configuration

`php artisan laravolt:install` publishes the Laravolt skeleton, migrations, assets, and package configuration. Review the generated files before committing them, especially in existing applications.

Common configuration areas include:

| Area | Purpose |
| --- | --- |
| `config/laravolt/platform.php` | platform shell and application-level defaults |
| `config/laravolt/ui.php` | UI-related defaults |
| `config/laravolt/menu/*` | menu registration for system and module navigation |
| `config/laravolt/epicentrum.php` | user, account, role, and permission model configuration |
| `config/laravolt/suitable.php` | table/listing behaviour |
| `config/laravolt/workflow.php` | workflow integration |
| package configs | modules such as auto-crud, asset, media, lookup, file-manager, mailkeeper, database-monitor, and thunderclap |

Exact filenames may vary by package publish tag. If a file is missing, inspect the installed package publish providers before assuming the option is unavailable.

## Treat config as application code

Configuration changes can alter security, navigation, generated screens, upload behaviour, workflow integration, and table defaults. Review them like code:

```bash
php artisan laravolt:install
git diff config/ resources/ routes/ database/
```

For existing applications, do not accept a publish diff blindly. Keep the parts you need and discard accidental overwrites.

## Menu configuration

Menus can be registered from code or configuration. Config-driven menus are useful for modules because the navigation contract sits next to the module metadata.

```php
'Products' => [
    'order' => 20,
    'menu' => [
        'All products' => [
            'route' => 'products.index',
            'icon' => 'box',
            'permissions' => 'product.read',
        ],
    ],
],
```

Keep permission metadata close to each menu item. The route/controller must still enforce authorization.

## Model configuration

Some Laravolt modules resolve models through config. For example, platform commands use configured Epicentrum user and role models when creating admin users or syncing permissions.

That means custom user or role classes should be configured first, then tested through the same commands your operators will use:

```bash
php artisan laravolt:admin
php artisan laravolt:sync-permission
```

## Safe customization order

When changing platform behaviour:

1. Prefer published config.
2. Prefer service provider bindings or macros.
3. Prefer published views for presentation-only changes.
4. Open an issue or add an extension point before patching vendor/platform code.

This order keeps upgrades manageable and makes AI-assisted edits less risky.

## AI-ready configuration prompts

A useful prompt for agents:

```txt
Update Laravolt v7 configuration for a procurement module.
Register menu entries with permission metadata.
Do not change package source.
Return config files changed and explain each new key.
Mark unknown config keys as TODO: verify API.
```

Good generated config should be small, named after the business domain, and easy to review in a diff.

## What to read next

- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — why explicit extension points matter.
- [Access control](/v7/security/access-control) — align permissions across config, policies, and menus.
- [Package list](/v7/reference/package-list) — packages that contribute configuration.
