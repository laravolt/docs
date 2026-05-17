---
title: Task Recipes
---

# Task Recipes

Copy-paste recipes for common post-generation tasks. Each recipe shows what to change, where to change it, and how to verify. {% .lead %}

These recipes are the canonical patterns coding agents should follow when extending a Thunderclap-generated module. They sit on top of [Thunderclap Recipes](/v7/thunderclap-recipes) and [AI Task Patterns](/v7/ai-task-patterns).

## Recipe: Add a business action to a generated module

Goal: add an `approve` action to a generated `PurchaseOrder` module.

```text
1. Create app/Actions/PurchaseOrder/ApproveAction.php (single-invokable)
2. Add a policy method PurchaseOrderPolicy::approve(User, PurchaseOrder)
3. Add a route in modules/PurchaseOrder/routes/web.php with can:purchase-order.approve
4. Add controller method PurchaseOrderController::approve(...)
5. Add Blade button in modules/PurchaseOrder/resources/views/show.blade.php
6. Add Pest test for the action class
7. Add feature test for the route + policy combination
```

See [Business actions](/v7/admin-workflows/business-actions) for the full pattern.

Verify:

```bash
php artisan test --filter=ApproveAction
php artisan route:list | grep purchase-orders.approve
```

## Recipe: Add a custom permission to a generated module

Goal: give the `manager` role view-only access to `Item`.

```text
1. database/seeders/DemoSeeder.php — add permission 'item.view'
2. modules/Item/config/item.php — set 'permission' => 'item.view'
3. (already wired) routes/web.php applies can:item.view from config
4. Assign 'item.view' to the manager role in DemoSeeder
5. php artisan db:seed --class=DemoSeeder
```

Verify:

```bash
php artisan tinker
>>> User::where('email','manager@laravolt.dev')->first()->can('item.view')
=> true
```

## Recipe: Customize generated form fields

Goal: replace the default `text` field for `price` with a masked currency input.

```text
1. Open modules/Item/resources/views/_form.blade.php
2. Replace:
     {!! form()->text('price')->label('Price')->required() !!}
   with:
     {!! form()->number('price')->label('Price')->mask('currency')->required() !!}
3. Update modules/Item/Requests/Store.php and Update.php:
     'price' => ['required', 'numeric', 'min:0']
```

See [Forms overview](/v7/forms/overview) and [Input masking](/v7/forms/input-masking).

## Recipe: Add a search filter to a generated index

Goal: add a status dropdown filter to the `PurchaseOrder` index.

```text
1. Open modules/PurchaseOrder/PurchaseOrderTableView.php
2. Override filters() and add Dropdown filter
3. In data(), apply the filter conditionally
```

```php
use Laravolt\Suitable\Filters\Dropdown;

public function filters(): array
{
    return [
        Dropdown::make('status')->options([
            'draft' => 'Draft',
            'submitted' => 'Submitted',
            'approved' => 'Approved',
        ]),
    ];
}

public function data(): Builder
{
    $query = PurchaseOrder::query()
        ->autoSort($this->sortPayload())
        ->autoSearch(trim($this->search));

    if ($this->filterValue('status')) {
        $query->where('status', $this->filterValue('status'));
    }

    return $query->latest();
}
```

## Recipe: Add a sidebar menu entry without regenerating

Goal: add a menu entry for a hand-built module.

```text
1. Open the module's ServiceProvider
2. Override menu() and call app('laravolt.menu.builder')->register(...)
3. Pass ->data('permission', 'your.permission') to gate visibility
```

```php
public function menu(): void
{
    app('laravolt.menu.builder')->register(function ($menu) {
        if ($menu->modules) {
            $menu->modules
                ->add('My Module', route('modules:my-module.index'))
                ->data('icon', 'sparkles')
                ->data('permission', 'my-module.view')
                ->active('modules/my-module/*');
        }
    });
}
```

## Recipe: Add a browser smoke test for a generated module

Goal: assert the generated index renders and an admin can navigate to create.

```php
// tests/Browser/{Module}/{Module}CrudTest.php
use App\Models\User;
use Database\Seeders\DemoSeeder;

beforeEach(function () {
    $this->seed(DemoSeeder::class);
    $this->admin = User::query()->where('email', 'admin@laravolt.dev')->firstOrFail();
});

it('renders index for admin', function () {
    $this->actingAs($this->admin);

    visit('/modules/items')
        ->assertSee('Items')
        ->assertNoJavaScriptErrors();
})->group('browser');
```

Run with `pest --group=browser`.

## Recipe: Re-baseline screenshot snapshots after UI change

```bash
php vendor/bin/pest --testsuite Browser --update-snapshots
git diff --stat tests/.pest/snapshots/
git add tests/.pest/snapshots/
```

Always review the diff visually before committing — the snapshot is a hash of the rendered PNG, not the image itself.

## Related pages

- [AI Context](/v7/ai-context) — canonical agent context entry point
- [AI Task Patterns](/v7/ai-task-patterns) — prompt templates
- [Thunderclap Recipes](/v7/thunderclap-recipes) — generator-specific patterns
- [Business actions](/v7/admin-workflows/business-actions) — non-CRUD operation convention
