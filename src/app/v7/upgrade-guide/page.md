---
title: Upgrade guide
---

# Upgrade guide: v6 to v7

Laravolt v7 is a minor-to-major jump in the underlying stack. Most application code keeps working, but some packages, method names, and UI classes changed. This guide lists the concrete differences and the recommended upgrade order. {% .lead %}

## Dependency matrix

| | Laravolt 6.x | Laravolt 7.x |
| --- | --- | --- |
| PHP | 8.2 – 8.4 | 8.2 – 8.4 |
| Laravel framework | 11.x, 12.x | 12.x, 13.x |
| Livewire | 3.x | 4.x |
| UI toolkit | Preline UI 2 (Tailwind CSS) — migrating off Fomantic/Semantic UI | Preline UI 2 (Tailwind CSS) as the default |
| Form builder | `laravolt/semantic-form` (`Form` facade) | `laravolt/preline-form` (`PrelineForm` facade) |
| Testing | PHPUnit / Pest 3 | Pest 4 (`pestphp/pest: ^4.0`) |

{% callout title="TODO: verify release ranges" %}
The matrix reflects the versions declared in the Laravolt repository (`composer.json`, `README.md`) at the time of writing. Re-confirm before the public v7 release and update this page if anything shifts.
{% /callout %}

## Breaking changes at a glance

1. **Form facade renamed.** `Form::` → `PrelineForm::`. The helper `form()` still exists and now returns the PrelineForm builder. See [Forms overview](/v7/forms/overview).
2. **Default UI is Preline UI + Tailwind CSS.** Fomantic/Semantic UI classes are deprecated. Custom classes added to fields must be migrated to Tailwind equivalents.
3. **Laravel framework floor raised to 12.0.** Laravel 11 is no longer supported.
4. **Livewire 4.** Livewire 3 components may need minor adjustments; see the Livewire 4 upgrade notes.
5. **PHPUnit/Pest.** Tests are expected to run under Pest 4. Plain PHPUnit tests still work.
6. **Client-side validation hook added.** Forms using `->validate()` now emit HTML validation attributes and `data-validation-rules` automatically. Existing forms are unaffected unless they relied on the absence of those attributes.

## Recommended upgrade order

1. Upgrade Laravel first (11 → 12, or confirm 12 already). Follow the [Laravel upgrade guide](https://laravel.com/docs/upgrade).
2. Upgrade Livewire (3 → 4). Follow the Livewire upgrade notes. Livewire 4 is largely backwards compatible but tightened some lifecycle behaviour.
3. Upgrade PHP to 8.2+ if you are not already there.
4. Run `composer require laravolt/laravolt:^7.0`.
5. Run `composer require laravolt/preline-form` (if not already installed). Consider removing `laravolt/semantic-form` once the migration is complete.
6. Run `php artisan laravolt:install` to re-publish configuration and assets. Review the diff before committing.
7. Run `php artisan migrate`.
8. Run your full test suite.

## Migrating forms

The form API is intentionally compatible, but a search-and-replace is the fastest way to move:

```diff
- use Laravolt\SemanticForm\Facade as Form;
+ use Laravolt\PrelineForm\Facade as PrelineForm;

- {!! Form::open('users.store')->post() !!}
+ {!! PrelineForm::open('users.store')->post() !!}

- {!! Form::text('name')->label('Name') !!}
+ {!! PrelineForm::text('name')->label('Name') !!}
```

The `form()` helper keeps working: `form()->text('name')` now returns a PrelineForm field.

### Deprecated Semantic UI classes

Replace Semantic UI classes added via `->addClass()` with Tailwind/Preline equivalents:

| Semantic UI (v6) | Tailwind + Preline (v7) |
| --- | --- |
| `ui primary button` | default `->primary()` variant, no custom class required |
| `ui large input` | `->addClass('text-lg p-4')` |
| `ui form` | drop it; forms are already styled |
| `ui error input` | drop it; error state is derived from the validator |
| `ui grid column` | Tailwind grid utilities (`grid grid-cols-2 gap-6`) |

If you extended SemanticForm elements, move them to the PrelineForm counterparts:

```php
// v6
class CustomText extends \Laravolt\SemanticForm\Elements\Text { /* ... */ }

// v7
class CustomText extends \Laravolt\PrelineForm\Elements\Text { /* ... */ }
```

## Migrating Blade components

If you used `laravolt/ui` Blade components in v6, continue using the same component names under v7. Several internal templates moved from Fomantic/Semantic UI to Preline UI. Custom Blade published in your application should be reviewed and re-rendered against Preline UI patterns.

TODO: verify the full list of renamed or removed `<x-volt-*>` components between v6 and v7 before the release.

## Migrating tables, menus, workflows

The public APIs for tables (Suitable), menus, actions, ACL, and Workflow are broadly the same in v7. Concrete differences are being finalised and will land here before the release:

- **Suitable (tables)** — `TODO: verify v7 Suitable entry points and any renamed column helpers`.
- **Menus** — `TODO: verify v7 menu registration API`.
- **Workflow** — `TODO: verify v7 workflow module entry points`.

## Migrating tests

Pest 4 tightened a few matchers. If you use Pest:

```bash
composer require --dev pestphp/pest:^4.0
vendor/bin/pest --init # if starting fresh
```

Plain PHPUnit tests continue to work without changes.

## Configuration changes

Re-publishing Laravolt configuration may introduce new keys. Review the diff produced by `php artisan laravolt:install` carefully:

```bash
php artisan laravolt:install
git diff config/
```

TODO: list newly introduced config keys once the v7 release is frozen.

## Post-upgrade checklist

- [ ] `composer install` succeeds without conflicts.
- [ ] `php artisan migrate` runs cleanly.
- [ ] `php artisan test` (or `vendor/bin/pest`) is green.
- [ ] Every screen renders with Preline UI styling (no stray Semantic UI classes).
- [ ] Forms submit, validate, and display errors correctly.
- [ ] Input masks initialize after Livewire DOM swaps.
- [ ] Permissions still apply (roles, policies, menu visibility).
- [ ] CI passes on the target PHP version.

## Rolling back

If the upgrade goes sideways:

1. Revert the composer lock changes: `git checkout HEAD -- composer.json composer.lock && composer install`.
2. Roll back configuration changes published by `laravolt:install`.
3. Restore the previous Livewire/Laravel versions if you bumped them.

Because v7 does not change Laravolt's core database schema, database migrations are usually the safest part of the upgrade. Verify with your own migration diff before assuming this holds.

## Open questions

These items are tracked for follow-up before the final v7 release:

- Exact list of breaking changes in `<x-volt-*>` Blade components — TODO.
- v7 Suitable table builder signatures — TODO.
- v7 Menu registration API — TODO.
- v7 Workflow public API — TODO.
- Verified Tailwind CSS version shipped by the starter kit — TODO.

## What to read next

- [Installation](/v7/getting-started/installation) — install v7 into a new or existing Laravel project.
- [Forms overview](/v7/forms/overview) — the new `PrelineForm` builder, including model binding.
- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — the conventions v7 relies on for safe extension.
