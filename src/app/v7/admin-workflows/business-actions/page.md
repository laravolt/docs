---
title: Business actions
---

# Business actions

Most Laravolt v7 admin modules start as plain CRUD: a table, a create form, an edit form, a delete button. Real systems quickly grow operations that are **not** create/update/delete on a single row — _submit_, _approve_, _reject_, _issue_, _receive_, _cancel_, _resend_, _retry_. Treat these as **business actions** with their own files, routes, policies, and tests. {% .lead %}

This page documents the v7 convention for non-CRUD operations on top of generated Thunderclap modules. The full workflow engine (Camunda + `WorkflowService`) is a separate, post-stable integration; this page covers the lightweight pattern that ships with v7 stable.

## When to use what

Use the simpler tool first.

| Need                                                                 | Use                                                  |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| One-shot state change on a single row (`status = 'approved'`)        | **Action class** + controller endpoint + policy      |
| Two or three named states with a clear transition graph              | **Action class** per transition + model status enum  |
| Long-running multi-actor process with assignments and audit history  | **Camunda / `WorkflowService`** (post-stable)        |
| Pure CRUD with no business rules beyond field validation             | Generated controller — no action class needed        |

If you find yourself adding `if ($status === 'draft')` branches inside the generated `update()` method, that is the signal to extract a business action.

## Folder convention

```txt
app/
  Actions/
    PurchaseOrder/
      SubmitAction.php
      ApproveAction.php
      RejectAction.php
      CancelAction.php
    Invoice/
      IssueAction.php
      MarkPaidAction.php
modules/
  PurchaseOrder/
    Controllers/PurchaseOrderController.php
    Requests/
      Store.php
      Update.php
      ApproveRequest.php
      RejectRequest.php
```

Rules of thumb:

- One action class per verb, named `{Verb}Action.php`.
- Group by **business domain** (`PurchaseOrder`, `Invoice`), not by HTTP verb.
- Actions live under `app/Actions/`, **not** inside the generated module folder, so they survive `php artisan laravolt:clap --force` regeneration.
- Use Laravel's `Bus\Dispatchable` or a plain invokable; both are fine.

## Anatomy of an action class

Use a single-action invokable when the action is small and self-contained:

```php
<?php

declare(strict_types=1);

namespace App\Actions\PurchaseOrder;

use App\Models\PurchaseOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class ApproveAction
{
    public function __invoke(PurchaseOrder $purchaseOrder, User $approver, ?string $note = null): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder, $approver, $note) {
            abort_unless($purchaseOrder->status === 'submitted', 422, 'Only submitted POs can be approved.');

            $purchaseOrder->forceFill([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $approver->id,
                'approval_note' => $note,
            ])->save();

            // Optional: dispatch a domain event for listeners
            event(new \App\Events\PurchaseOrderApproved($purchaseOrder, $approver));

            return $purchaseOrder->refresh();
        });
    }
}
```

Promote to a class-with-methods (`handle()`, `authorize()`, `rules()`) when an action grows side effects or shared helpers. Avoid global helpers for business rules — keep them on the action.

## Routing and policy authorization

Wire actions explicitly. Do **not** rely on menu visibility for security; route middleware and controller `authorize()` are the boundary.

```php
// modules/PurchaseOrder/routes/web.php
use App\Actions\PurchaseOrder\ApproveAction;
use Modules\PurchaseOrder\Controllers\PurchaseOrderController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::resource('purchase-orders', PurchaseOrderController::class);

    Route::post('purchase-orders/{purchaseOrder}/approve', [PurchaseOrderController::class, 'approve'])
        ->name('purchase-orders.approve')
        ->middleware('can:approve,purchaseOrder');

    Route::post('purchase-orders/{purchaseOrder}/reject', [PurchaseOrderController::class, 'reject'])
        ->name('purchase-orders.reject')
        ->middleware('can:reject,purchaseOrder');
});
```

Add the corresponding policy methods next to the existing `view`/`create`/`update`/`delete` set:

```php
// app/Policies/PurchaseOrderPolicy.php
public function approve(User $user, PurchaseOrder $po): bool
{
    return $user->can('purchase-order.approve')
        && $po->status === 'submitted'
        && $po->created_by !== $user->id; // four-eyes rule
}
```

Two-layer authorization is intentional:

- Permission gate (`purchase-order.approve`) decides _who can ever_ perform the action.
- Policy decides _whether this specific record_ is in the right state for this user right now.

Menu entries should mirror permission gates, not policy preconditions:

```php
Menu::add('purchase-orders.index')
    ->permissions('purchase-order.view');
```

## Controller method

Keep the controller thin. It validates input, calls the action, redirects.

```php
public function approve(
    ApprovePurchaseOrderRequest $request,
    PurchaseOrder $purchaseOrder,
    ApproveAction $approve,
): RedirectResponse {
    $this->authorize('approve', $purchaseOrder);

    $approve($purchaseOrder, $request->user(), $request->validated('note'));

    return to_route('purchase-orders.show', $purchaseOrder)
        ->withSuccess(__('Purchase order approved.'));
}
```

`ApprovePurchaseOrderRequest` is a normal `FormRequest` — same convention as Store/Update generated by Thunderclap. Use it for action-specific input (notes, attachments, reasons) and skip it for zero-input actions.

## Blade trigger

Render action buttons with the existing Preline volt components. Keep the trigger explicit so the audit trail is obvious in the markup:

```blade
@can('approve', $purchaseOrder)
    <form method="POST" action="{{ route('purchase-orders.approve', $purchaseOrder) }}">
        @csrf
        <x-volt-button type="submit" variant="primary" icon="check">
            {{ __('Approve') }}
        </x-volt-button>
    </form>
@endcan
```

For multi-input actions, render a modal with a small PrelineForm bound to the action route:

```blade
{!! form()->post(route('purchase-orders.reject', $purchaseOrder)) !!}
    {!! form()->textarea('reason')->label(__('Reason'))->required() !!}
    {!! form()->submit(__('Reject'))->variant('danger') !!}
{!! form()->close() !!}
```

## Testing actions

Action classes are pure PHP — test them without HTTP:

```php
it('approves a submitted purchase order', function () {
    $po = PurchaseOrder::factory()->submitted()->create();
    $approver = User::factory()->withPermission('purchase-order.approve')->create();

    app(ApproveAction::class)($po, $approver, note: 'Looks good');

    expect($po->refresh())
        ->status->toBe('approved')
        ->approved_by->toBe($approver->id)
        ->approval_note->toBe('Looks good');
});

it('refuses to approve a draft purchase order', function () {
    $po = PurchaseOrder::factory()->draft()->create();
    $approver = User::factory()->withPermission('purchase-order.approve')->create();

    expect(fn () => app(ApproveAction::class)($po, $approver))
        ->toThrow(\Symfony\Component\HttpKernel\Exception\HttpException::class);
});
```

Add a feature test for the route to lock in the permission + policy combination:

```php
it('blocks unauthorized users from the approve route', function () {
    $po = PurchaseOrder::factory()->submitted()->create();
    $user = User::factory()->create(); // no permission

    actingAs($user)
        ->post(route('purchase-orders.approve', $po))
        ->assertForbidden();
});
```

## Adding actions on top of Thunderclap

Thunderclap generates a CRUD controller, routes, requests, model, table view, and tests. To add a custom action on top of the generated module **without** losing it on the next regeneration:

1. **Add the action class** under `app/Actions/{Domain}/` — not inside the module folder.
2. **Open the generated `modules/{Module}/routes/web.php`** and append the action route(s). The generator only seeds the file once; subsequent runs do not touch it unless `--force` is used, in which case you can re-apply from a small `routes/{module}-actions.php` partial included from `web.php`.
3. **Add a policy method** on the resource policy. Permissions live in the seeded permission list; see [Demo seeders](/v7/getting-started/installation) for the convention.
4. **Add the controller method** in `modules/{Module}/Controllers/{Module}Controller.php`. If you intend to re-run the generator, move custom methods to a trait under `app/Concerns/` and `use` it from the generated controller.
5. **Add the action FormRequest** (if it takes input) under `modules/{Module}/Requests/` or `app/Http/Requests/{Module}/`.
6. **Add the Blade trigger** to the relevant generated view (`show.blade.php` is usually the right place).
7. **Add a Pest test** for the action class and a feature test for the route.

Treat the generator as a starting point. Regeneration with `--force` is a tool for stub upgrades, not a daily operation; protect anything that grew custom logic.

## When to graduate to the workflow engine

Move from action classes to `WorkflowService` / Camunda when:

- There are more than three or four named states and the transition graph is non-trivial.
- The process has task assignments per role (manager review → finance review → CEO sign-off).
- Long-running state must survive deployments and be observable from a dashboard outside Laravel.
- Audit history and SLA timers are first-class requirements.

Until then, **action classes + model status + policy** is the recommended v7 stable pattern. Defer the workflow engine to a later phase rather than ship half-integrated.

## What to read next

- [Admin workflows overview](/v7/admin-workflows/overview) — the loop that actions plug into.
- [Thunderclap](/v7/admin-workflows/thunderclap) — generate the CRUD baseline before adding actions.
- [Access control](/v7/security/access-control) — permissions and policy methods.
- [Workflow & automation overview](/v7/workflow-and-automation/overview) — the engine-backed path for complex processes.
