# Thunderclap Demo Plan

Recommended approach: **create a fresh Thunderclap-first branch/app based on `laravolt/laravolt:v7.0.0-beta.3`, then port only the useful workflow layer from current VoltProcure.**

The current repo at `/Users/rama/Laravolt/voltprocure` already has good domain schema, actions, seed story, Docker work, and feature-test intent, but the CRUD/admin UI is hand-built in [routes/web.php](../voltprocure/routes/web.php) and `resources/views/voltprocure/*`. For article credibility, the generated CRUD must visibly come from Thunderclap, not retrofitted manual pages.

## Recommended branch strategy

Use the **existing VoltProcure repo, but on a clean rewrite branch**:

```bash
cd /Users/rama/Laravolt/voltprocure
git checkout main
git pull
git checkout -b demo/thunderclap-first-beta3
```

Then reset the app toward a beta.3 Thunderclap-first state instead of trying to patch current manual CRUD.

Why this over a totally new repo:

- Keeps Docker work from `e27d18c`.
- Keeps the existing schema/action/test artifacts as reference material.
- Avoids losing the MVP story already encoded in the app.
- Still allows deleting/replacing manual CRUD routes/views/controllers cleanly.

If the current branch has uncommitted manual table fixes, either commit/stash them as “old MVP reference” or start the branch from `origin/main` to avoid mixing the old hand-coded CRUD patch into the Thunderclap demo.

## Keep vs rewrite

### Keep / port

From current VoltProcure:

- Domain migrations:
  - `departments`
  - `items`
  - `suppliers`
  - `purchase_requests`
  - `purchase_request_lines`
  - `purchase_orders`
  - `purchase_order_lines`
  - `receiving_notes`
  - `receiving_lines`
  - `inventory_balances`
  - `inventory_movements`
- Models under `app/Models/*`, but let `--use-existing-models` enhance them.
- Business actions:
  - `SubmitPurchaseRequestAction`
  - `ApprovePurchaseRequestAction`
  - `CreatePurchaseOrderFromRequestAction`
  - `IssuePurchaseOrderAction`
  - `PostReceivingNoteAction`
- Seeder story from `database/seeders/DatabaseSeeder.php`.
- Docker files and deployment notes.
- Existing feature-test scenario as reference.

### Rewrite / delete

- Hand-built CRUD controllers:
  - `app/Http/Controllers/VoltProcure/ItemController.php`
  - `SupplierController.php`
  - likely base admin CRUD methods for PR/PO/receiving/inventory
- Hand-built CRUD views:
  - `resources/views/voltprocure/items/*`
  - `resources/views/voltprocure/suppliers/*`
  - `_table.blade.php`
  - basic index/create admin screens that duplicate generated modules
- CRUD resource routes in [routes/web.php](../voltprocure/routes/web.php:31).
- Any local table implementation that competes with generated `Laravolt\Ui\TableView`.

Keep only custom workflow screens under `/voltprocure/*`: dashboard, approval inbox, PO issue, receiving, inventory evidence, and demo navigation.

## Exact schema before Thunderclap

Use the current schema as the MVP schema. It is already article-friendly and demonstrates realistic generated columns.

### Master data modules

#### `departments`

```php
id
code string unique
name string
manager_user_id foreign nullable -> users, nullOnDelete
is_active boolean default true
timestamps
```

#### `items`

```php
id
sku string unique
name string
description text nullable
unit string default 'pcs'
category string nullable
reorder_point unsignedInteger default 0
standard_cost decimal(14, 2) default 0
is_active boolean default true
timestamps
```

#### `suppliers`

```php
id
code string unique
name string
contact_name string nullable
email string nullable
phone string nullable
address text nullable
payment_terms string nullable
is_active boolean default true
timestamps
```

### Workflow/admin evidence modules

#### `purchase_requests`

```php
id
number string unique
department_id foreign -> departments, restrictOnDelete
requester_id foreign -> users, restrictOnDelete
needed_by date nullable
purpose text
status string default 'draft', index
submitted_at timestamp nullable
approved_at timestamp nullable
rejected_at timestamp nullable
approved_by foreign nullable -> users, nullOnDelete
rejected_by foreign nullable -> users, nullOnDelete
approval_note text nullable
timestamps
```

#### `purchase_request_lines`

Do **not** make this a primary MVP Thunderclap module unless needed. Keep it workflow-owned.

```php
id
purchase_request_id foreign -> purchase_requests, cascadeOnDelete
item_id foreign -> items, restrictOnDelete
description string
quantity decimal(12, 2)
unit string default 'pcs'
estimated_unit_cost decimal(14, 2) default 0
approved_quantity decimal(12, 2) nullable
note text nullable
timestamps
```

#### `purchase_orders`

```php
id
number string unique
purchase_request_id foreign
```
