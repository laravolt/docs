---
title: Admin workflows
---

# Admin workflows

Laravolt v7 is designed for the boring-but-critical screens behind real business systems: lists, forms, actions, approvals, imports, exports, and operational dashboards. {% .lead %}

These screens are often called “admin panels”, but in production they become workflow software. People use them to move work forward, enforce rules, and leave an auditable trail.

## The workflow shape

Most admin workflows follow the same loop:

1. find the record
2. inspect its current state
3. make a decision or edit
4. validate the input
5. persist the change
6. notify the next person or system
7. record what happened

Laravolt gives this loop a consistent structure so each feature does not need a bespoke mini-framework.

## Start with the resource

Before building screens, name the business resource and its lifecycle.

For example, an inventory module may have:

- `Product`
- `StockMovement`
- `Supplier`
- `PurchaseOrder`
- `ReceivingNote`

Each resource should have clear ownership:

```txt
app/
  Models/Product.php
  Http/Controllers/ProductController.php
  Http/Requests/StoreProductRequest.php
  Http/Requests/UpdateProductRequest.php
  Policies/ProductPolicy.php
  Http/Livewire/Table/ProductTable.php
resources/views/products/
  index.blade.php
  create.blade.php
  edit.blade.php
```

This is ordinary Laravel. Laravolt adds platform primitives around it.

## Lists and tables

A list page should answer three questions quickly:

- what records exist?
- which records need attention?
- what actions are safe for the current user?

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

Use table components for search, filtering, sorting, pagination, and row actions. Keep database query decisions inside the table class so the Blade view remains readable. See [Tables and listings](/v7/ui-foundation/tables) for the current table patterns and command reference.

## Create and edit screens

Create and edit screens should share as much structure as possible. Keep validation in `FormRequest` classes and rendering in `PrelineForm`.

```php
// app/Http/Requests/StoreProductRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:120'],
        'sku' => ['required', 'string', 'max:50', 'unique:products,sku'],
        'price' => ['required', 'numeric', 'min:0'],
    ];
}
```

```blade
{!! PrelineForm::post('products.store')
    ->validate(App\Http\Requests\StoreProductRequest::class) !!}

    {!! PrelineForm::text('name')->label('Product name') !!}
    {!! PrelineForm::text('sku')->label('SKU')->mask('AAA-9999') !!}
    {!! PrelineForm::number('price')->label('Price')->mask('currency') !!}

    {!! PrelineForm::submit('Save product')->primary() !!}

{!! PrelineForm::close() !!}
```

The same `FormRequest` drives server-side validation and client-side hints where supported.

## Actions

An action is a named business operation, not just a button. Examples:

- approve an invoice
- reject a request
- resend an invitation
- export selected records
- regenerate a report
- archive a project

Prefer explicit controller methods or action classes over anonymous closure logic in the view.

```php
Route::post('/purchase-orders/{purchaseOrder}/approve', ApprovePurchaseOrderController::class)
    ->name('purchase-orders.approve')
    ->middleware('can:approve,purchaseOrder');
```

```blade
<x-volt-button
    as="form"
    method="POST"
    action="{{ route('purchase-orders.approve', $purchaseOrder) }}"
    variant="primary"
>
    Approve
</x-volt-button>
```

## Auditability

A business workflow should leave evidence. At minimum, decide what needs to be recorded:

- who performed the action
- when it happened
- what changed
- why it changed, if the action needs a reason
- which external system was notified

Use Laravel events, model observers, activity logs, or workflow state transitions depending on the feature. The important thing is to design for review before the system goes live.

## AI-assisted admin development

Admin workflows are a good fit for AI-assisted development because they follow repeatable patterns. To keep generated code safe:

- ask agents to create `FormRequest` classes before writing forms
- require policies for every new resource
- keep table queries in table classes
- ask for tests next to every action
- avoid letting agents invent hidden permission names
- review route names, policy methods, and menu entries together

A useful prompt:

```txt
Add a Laravolt v7 admin workflow for PurchaseOrder.
Create index/create/edit screens, FormRequests, policy methods, sidebar menu entry,
and a table with search by number and supplier.
Use PrelineForm for forms. Use Suitable for the listing. Do not invent package APIs; mark any uncertain app-specific behavior for review.
```

## What to read next

- [Forms overview](/v7/forms/overview) — form conventions for create/edit screens.
- [Access control](/v7/security/access-control) — protect resources and actions.
- [Browser testing](/v7/testing/browser-testing) — verify admin workflows in a real browser.
