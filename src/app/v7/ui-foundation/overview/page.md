---
title: UI foundation
---

# UI foundation

Laravolt v7 uses Preline UI, Tailwind CSS, Blade components, and Laravel conventions to make business interfaces consistent by default. {% .lead %}

The goal is not to hide HTML from Laravel developers. The goal is to make the common parts of internal tools — layouts, navigation, forms, tables, actions, alerts, cards, and empty states — predictable across the whole application.

## Why the UI layer matters

Business applications usually grow screen by screen. Without a shared UI foundation, every controller and Blade file starts inventing its own spacing, buttons, table actions, validation display, and authorization checks.

That creates three problems:

- users see inconsistent behaviour between pages
- developers copy brittle markup instead of reusing platform conventions
- AI coding assistants have to guess which UI pattern is correct

Laravolt v7 solves this by making the UI layer explicit: Preline UI provides the component language, Tailwind CSS provides the design tokens, and Laravolt wraps the repetitive application patterns in Laravel-native APIs.

## The stack

| Layer | Responsibility |
| --- | --- |
| Laravel Blade | Server-rendered views and component composition |
| Livewire | Reactive interactions where server state should stay close to the UI |
| Tailwind CSS | Utility-first styling and responsive layout |
| Preline UI | Accessible component patterns and interactive behaviour |
| Laravolt components | Business-oriented primitives: forms, tables, menus, buttons, cards, alerts |

Use the lowest layer that keeps the screen clear. A static settings page may only need Blade and Laravolt components. A complex table may use Livewire. A custom dashboard card may use raw Tailwind utilities inside the Laravolt layout.

## Layouts

A Laravolt screen should start from the platform layout instead of creating a one-off shell.

```blade
<x-volt-app title="Products">
    <x-slot name="actions">
        <x-volt-button href="{{ route('products.create') }}" variant="primary">
            New product
        </x-volt-button>
    </x-slot>

    {{-- Page content --}}
</x-volt-app>
```

The current v7 views include `<x-volt-app>`, `<x-volt-button>`, `<x-volt-alert>`, `<x-volt-panel>`, `<x-volt-table>`, `<x-volt-chart>`, `<x-volt-datepicker>`, `<x-volt-file-upload>`, `<x-volt-notification>`, `<x-volt-titlebar>`, and related UI components. A dedicated component reference can expand this list later.

## Buttons and actions

Use semantic variants instead of memorising classes:

```blade
<x-volt-button variant="primary">Save</x-volt-button>
<x-volt-button variant="secondary">Cancel</x-volt-button>
<x-volt-button variant="danger">Delete</x-volt-button>
```

For form builder buttons, use the matching fluent API:

```php
PrelineForm::submit('Save')->primary();
PrelineForm::button('Cancel')->secondary();
PrelineForm::submit('Delete')->danger();
```

This keeps the application vocabulary small. Developers and coding agents can search for `primary`, `secondary`, or `danger` instead of reverse-engineering long class strings.

## Feedback and flash messages

Business systems need clear feedback after every state change: saved, rejected, queued, failed, exported, imported, or waiting for approval.

Use the shared flash convention over hand-written alert markup:

```php
return back()->with('success', 'Product saved.');
return back()->with('error', 'The import file could not be processed.');
return back()->with('warning', 'This workflow is waiting for manager approval.');
```

Then render feedback through the shared layout so alerts have consistent colours, icons, spacing, and accessibility attributes.

## Navigation

Navigation is part of the application contract. It should be registered in a predictable place and protected by permissions.

```php
app('laravolt.menu.builder')->register(function ($menu) {
    $menu->add('Products', route('products.index'))
        ->data('icon', 'box')
        ->data('permissions', 'product.read');
});
```

Laravolt also supports array-based menu loading from module configuration. Use this for packages or modules that should register their own menu entries.

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

## A simple page pattern

A maintainable Laravolt page usually follows this shape:

```blade
<x-volt-app title="Products">
    <x-slot name="actions">
        <x-volt-button href="{{ route('products.create') }}" variant="primary">
            New product
        </x-volt-button>
    </x-slot>

    <x-volt-panel>
        <livewire:table.product-table />
    </x-volt-panel>
</x-volt-app>
```

The important part is not the exact component names. The important part is the pattern:

1. one platform layout
2. one action area
3. reusable containers
4. table/form components that own their behaviour
5. permissions enforced in routes, policies, and menu visibility

## AI-ready UI conventions

A UI is easier to extend safely when the codebase has a small number of obvious patterns:

- pages use the platform layout
- actions live in a named slot or action bar
- destructive buttons use the `danger` variant
- forms use `PrelineForm`
- tables use the table builder or Livewire table pattern
- menu entries declare permission metadata
- one-off Tailwind classes stay close to the screen that needs them

These conventions help human reviewers and AI coding agents make smaller, more predictable changes.

## What to read next

- [Forms overview](/v7/forms/overview) — build consistent forms with Preline UI and Laravel validation.
- [Admin workflows](/v7/admin-workflows/overview) — structure CRUD-heavy business screens.
- [Access control](/v7/security/access-control) — protect pages, menus, and actions with roles and permissions.
