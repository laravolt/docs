---
title: Tables and listings
---

# Tables and listings

Laravolt v7 uses Suitable and generated table classes for searchable, paginated admin listings. {% .lead %}

A table should keep listing logic in one place: query, columns, search, sort, pagination, and row actions. Blade should describe the page structure, not rebuild table behaviour by hand.

## When to use a table

Use a Laravolt table when users need to:

- browse many records
- search or filter by common fields
- sort operational lists
- paginate consistently
- expose row-level actions such as view, edit, approve, archive, or export

For a small static list, normal Blade markup is fine. For a growing admin resource, start with a table class early.

## Generate a table class

```bash
php artisan make:table ProductTable
```

The current generator creates a table class and prints a Blade usage hint. Verify the generated namespace and component tag in your application before documenting it in project-specific prompts; the expected usage usually looks like:

```blade
<livewire:table.product-table />
```

Use the generated class as the home for query and column decisions. That keeps the view small and makes the listing easier to review.

## Render a table on a page

A typical listing page puts the table inside the platform layout and keeps page actions in the action slot:

```blade
<x-volt-app title="Products">
    <x-slot name="actions">
        @can('create', App\Models\Product::class)
            <x-volt-button href="{{ route('products.create') }}" variant="primary">
                New product
            </x-volt-button>
        @endcan
    </x-slot>

    <livewire:table.product-table />
</x-volt-app>
```

Authorization still belongs on the route/controller. Hiding the button is user experience, not the security boundary.

## Suitable builder API

For simple listings, Suitable can render directly from a collection or paginator:

```php
use Laravolt\Suitable\Columns\Text;
use Laravolt\Suitable\Columns\DateTime;
use Laravolt\Suitable\Facade as Suitable;

{!! Suitable::source($products)
    ->title('Products')
    ->search()
    ->columns([
        Text::make('name', 'Name')->sortable(),
        Text::make('sku', 'SKU')->sortable(),
        DateTime::make('created_at', 'Created at')->sortable(),
    ])
    ->render() !!}
```

`source()` accepts the data to render. When the source is a paginator, Suitable can render pagination through the configured table view. Keep advanced builder helpers close to the table class and verify exact helper names against the installed Suitable version before publishing app-specific conventions.

## Column choices

Suitable ships focused column classes for common admin lists, including text, number, currency, boolean, date, datetime, image, URL, HTML, view-backed cells, buttons, dropdown actions, row numbers, and relationship display.

Prefer explicit column classes when behaviour matters:

```php
Text::make('name', 'Name')->sortable();
Currency::make('price', 'Price');
Boolean::make('is_active', 'Active');
```

Use raw HTML or custom view columns only when the cell needs presentation that cannot be expressed by the standard columns.

## Search, sort, and pagination

Keep database-aware search and sort behaviour close to the table class. Avoid filtering records inside Blade after the query has already run.

A practical pattern:

1. Build the base Eloquent query.
2. Apply search/filter request input in the table class.
3. Paginate the query.
4. Pass the paginator to Suitable.
5. Let Suitable render pagination and table chrome.

This gives reviewers one obvious place to inspect list behaviour.

## Row actions

Row actions should use named routes and policy checks:

```blade
@can('update', $product)
    <x-volt-button href="{{ route('products.edit', $product) }}" variant="secondary">
        Edit
    </x-volt-button>
@endcan
```

For destructive actions, prefer POST/DELETE forms with CSRF protection and backend authorization. Do not rely on hiding a dropdown item as the only control.

## AI-ready table conventions

When asking a coding agent to add or change a listing, include:

```txt
Use a generated Laravolt table class for Product.
Keep query/search/sort logic out of Blade.
Use Suitable columns where possible.
Add policy checks for row actions.
Add a feature or browser smoke test for the listing.
Mark uncertain Suitable APIs as TODO: verify API.
```

A table is easier to modify safely when the columns, query, permissions, and view are not mixed together.

## What to read next

- [Admin workflows](/v7/admin-workflows/overview) — combine lists, forms, and actions into resource workflows.
- [Access control](/v7/security/access-control) — protect row actions and menu entries.
- [Artisan commands](/v7/reference/artisan-commands) — command reference for `make:table`.
