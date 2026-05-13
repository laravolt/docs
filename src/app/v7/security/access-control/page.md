---
title: Access control
---

# Access control

Laravolt v7 treats access control as a platform concern: routes, policies, menus, and UI actions should all describe the same permission model. {% .lead %}

Permissions are not only about hiding buttons. They define who is allowed to change business state.

## The model

A typical Laravolt application uses:

- users
- roles
- permissions
- Laravel policies
- menu visibility metadata
- middleware or controller authorization checks

Keep the permission vocabulary explicit. A permission like `product.update` is easier to understand, test, and generate than a vague name like `manage product`.

## Naming permissions

Use a resource-action pattern:

```txt
product.read
product.create
product.update
product.delete
purchase-order.approve
report.export
user.invite
```

This makes permissions searchable and easy to map to policies, menu items, and action buttons.

## Authorize routes and controllers

Protect the route or controller before thinking about the UI.

```php
Route::resource('products', ProductController::class)
    ->middleware('auth');
```

Then authorize inside the controller using Laravel policies:

```php
public function edit(Product $product): View
{
    $this->authorize('update', $product);

    return view('products.edit', compact('product'));
}
```

For one-off workflow actions, use named policy methods:

```php
public function approve(PurchaseOrder $purchaseOrder): RedirectResponse
{
    $this->authorize('approve', $purchaseOrder);

    // approve the purchase order...

    return back()->with('success', 'Purchase order approved.');
}
```

## Protect menu entries

Menus should not show destinations the current user cannot open.

```php
menu('sidebar')->register(function ($menu) {
    $menu->add('Products', route('products.index'))
        ->data('icon', 'box')
        ->data('permissions', 'product.read');
});
```

For module configuration, keep permission metadata near the route:

```php
'Products' => [
    'menu' => [
        'All products' => [
            'route' => 'products.index',
            'icon' => 'box',
            'permissions' => 'product.read',
        ],
    ],
],
```

Menu visibility is a convenience, not the security boundary. Always protect the route/controller too.

## Protect buttons and row actions

Buttons should mirror the same policy checks used by the backend.

```blade
@can('update', $product)
    <x-volt-button href="{{ route('products.edit', $product) }}" variant="secondary">
        Edit
    </x-volt-button>
@endcan

@can('delete', $product)
    <x-volt-button variant="danger">
        Delete
    </x-volt-button>
@endcan
```

This keeps the UI honest: users only see actions that make sense for their role and the record state.

## Role and permission changes

Laravolt v7 invalidates access after role or permission updates so permission changes take effect immediately. This protects teams from stale sessions where a user keeps access after a role was removed.

{% callout title="Operational note" %}
When changing roles in production, communicate the expected session impact. Users may need to sign in again after their permissions are updated.
{% /callout %}

## Testing access control

Every important permission should have at least one positive and one negative test.

```php
it('allows product managers to edit products', function () {
    $user = User::factory()->create();
    $user->grantPermission('product.update'); // TODO: verify helper name

    $this->actingAs($user)
        ->get(route('products.edit', Product::factory()->create()))
        ->assertOk();
});

it('blocks users without product update permission', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('products.edit', Product::factory()->create()))
        ->assertForbidden();
});
```

{% callout title="TODO: verify permission helper names" type="warning" %}
The exact helper methods for granting permissions should be verified against Laravolt v7's user/role API. The testing pattern is the important part: assert both allowed and denied paths.
{% /callout %}

## AI-ready security rules

When using coding agents on Laravolt projects, include these rules in the task prompt:

```txt
Do not add a route, controller action, menu item, or destructive button
without adding the corresponding policy/permission check.
Use resource-action permission names.
Add tests for allowed and denied access.
```

This keeps generated code aligned with the platform security model.

## Checklist

- [ ] Permission names follow `resource.action`.
- [ ] Routes/controllers authorize access.
- [ ] Menu entries declare permission metadata.
- [ ] Buttons and row actions use `@can` or equivalent checks.
- [ ] Role/permission updates are tested for session invalidation where relevant.
- [ ] Positive and negative access tests exist for critical workflows.

## What to read next

- [Admin workflows](/v7/admin-workflows/overview) — structure screens and actions around resources.
- [Browser testing](/v7/testing/browser-testing) — verify that protected workflows behave correctly in a browser.
