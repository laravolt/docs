# Laravolt v7 AI-Ready Demo Blueprint

Working title: **VoltProcure** — procurement and inventory operations in one Laravolt v7 application.

This is a planning/spec document for the demo only. It is intentionally docs-driven and implementation-ready, but it must not be treated as verified implementation code until the API checklist near the end is completed against `/Users/rama/Laravolt/laravolt`.

## 1. Demo thesis

VoltProcure proves that Laravolt v7 is an **AI-ready Laravel application platform**, not just an admin panel or a collection of packages.

The demo should make these points visible:

1. **Business workflow, not CRUD-only** — purchase requests move through approval, PO issuance, goods receiving, and inventory movements.
2. **Predictable extension points** — screens map to documented Laravolt surfaces: `PrelineForm`, Suitable/Livewire tables, ACL/policies, workflow service, browser tests, and `llms.txt` docs.
3. **AI-safe code shape** — every generated task has an explicit resource contract, named permissions, FormRequests, policies, tests, and docs context.
4. **Operational evidence** — users can see who requested, approved, ordered, received, and moved stock.
5. **Docs as agent context** — a coding agent can fetch `/llms.txt`, `/llms-full.txt`, or page-specific `.md` docs, then implement narrowly-scoped work packages without guessing where code belongs.

Success criterion: after the demo, a developer should believe Laravolt v7 can become their repeatable platform for back-office Laravel systems that humans and AI agents can both extend safely.

## 2. Demo app narrative

**App name:** VoltProcure

**Scenario:** A mid-sized company needs to control purchasing for operational supplies. Teams request items, department managers approve them, procurement converts approved requests into purchase orders, warehouse staff receive goods, and inventory is updated with an auditable movement trail.

**Demo storyline:**

1. A staff member requests 10 units of toner and 5 keyboards.
2. Their manager reviews the request, approves one line, adjusts another, and submits approval.
3. Procurement creates a PO to the preferred supplier.
4. Warehouse receives a partial delivery.
5. The system records inventory movements and flags the PO as partially received.
6. Dashboard/listing pages show pending approvals, open POs, low stock, and recent stock movements.
7. An AI coding agent is asked to add one small field or report using the docs context and passes tests.

## 3. Docs alignment

Current v7 docs navigation already supports this demo structure:

- **Introduction** — positions v7 as an AI-ready Laravel application platform.
- **Getting started / Installation** — `composer require laravolt/laravolt`, `php artisan laravolt:install`, migrations, admin user, frontend build.
- **Core concepts / AI-ready platform** — three-layer mental model and predictable locations for forms, tables, permissions, workflow, and menus.
- **UI foundation / Tables and listings** — `php artisan make:table`, `app/Http/Livewire/Table`, Suitable columns, search/sort/pagination, row actions.
- **Forms** — `PrelineForm`, model binding, `FormRequest` validation, Inputmask.
- **Admin workflows** — resource-first layout, list/create/edit/show/action patterns, auditability.
- **Workflow & automation** — `WorkflowService::start()` and `WorkflowService::submitTask()`, workflow events, queued side effects.
- **Security / Access control** — resource-action permission naming, policies, menu permission metadata, positive/negative permission tests.
- **Testing / Browser testing** — Pest Browser + Playwright smoke tests for forms, tables, menu visibility, and workflow happy paths.
- **Reference / llms.txt** — generated `/llms.txt`, `/llms-full.txt`, and per-page `.md` mirrors for LLM-readable context.
- **Reference / Artisan commands** — install, admin, permission sync, `make:table`, `make:view`, `laravolt:workflow:*`, Pest setup.

The demo should repeatedly link these docs pages in task recipes instead of inventing a separate convention.

## 4. Roles and permissions

Use resource-action permission names so policies, menu metadata, and tests all share the same vocabulary.

### Roles

| Role | Narrative | Key permissions |
| --- | --- | --- |
| Administrator | Owns demo setup and can access everything. | `*` |
| Requester | Creates purchase requests for their department. | `purchase-request.read`, `purchase-request.create`, `purchase-request.update-own`, `purchase-request.submit`, `item.read`, `supplier.read` |
| Department Manager | Reviews requests from their department. | `purchase-request.read`, `purchase-request.approve`, `purchase-request.reject`, `purchase-request.return`, `dashboard.approvals` |
| Procurement Officer | Converts approved requests into POs and manages suppliers. | `purchase-order.read`, `purchase-order.create`, `purchase-order.update`, `purchase-order.issue`, `supplier.read`, `supplier.create`, `supplier.update`, `purchase-request.read` |
| Warehouse Staff | Receives goods and records inventory movements. | `receiving.read`, `receiving.create`, `inventory.read`, `inventory-movement.create`, `purchase-order.read` |
| Inventory Auditor | Reviews inventory and exports movement evidence. | `inventory.read`, `inventory-movement.read`, `report.export` |

### Permission list

- `dashboard.view`
- `dashboard.approvals`
- `item.read`, `item.create`, `item.update`, `item.archive`
- `supplier.read`, `supplier.create`, `supplier.update`, `supplier.archive`
- `purchase-request.read`, `purchase-request.create`, `purchase-request.update-own`, `purchase-request.submit`, `purchase-request.approve`, `purchase-request.reject`, `purchase-request.return`, `purchase-request.cancel`
- `purchase-order.read`, `purchase-order.create`, `purchase-order.update`, `purchase-order.issue`, `purchase-order.cancel`
- `receiving.read`, `receiving.create`, `receiving.reverse`
- `inventory.read`
- `inventory-movement.read`, `inventory-movement.create`, `inventory-movement.adjust`
- `report.export`

Implementation note: Laravolt roles expose `syncPermission([...])`; users using the role concern expose `assignRole($role)` and `hasPermission($permission)`. Verify the app's User model uses the expected Laravolt concern before seeding.

## 5. Domain model

### `Department`

Fields:

- `id`
- `code` string, unique, e.g. `OPS`, `IT`, `FIN`
- `name` string
- `manager_user_id` FK users, nullable
- `is_active` boolean
- timestamps

Relationships:

- has many users
- belongs to manager user
- has many purchase requests

### `Item`

Fields:

- `id`
- `sku` string, unique, masked pattern `ITM-9999` or category-specific code
- `name` string
- `description` text nullable
- `unit` string, e.g. `pcs`, `box`, `ream`
- `category` string or FK `item_categories` if time allows
- `reorder_point` integer default 0
- `standard_cost` decimal nullable
- `is_active` boolean default true
- timestamps, soft deletes optional

Relationships:

- has many purchase request lines
- has many purchase order lines
- has many inventory balances
- has many stock movements

### `Supplier`

Fields:

- `id`
- `code` string unique, e.g. `SUP-0001`
- `name` string
- `contact_name` string nullable
- `email` string nullable
- `phone` string nullable, masked
- `address` text nullable
- `payment_terms` string nullable
- `is_active` boolean default true
- timestamps

Relationships:

- has many purchase orders
- optional preferred items later

### `PurchaseRequest`

Fields:

- `id`
- `number` string unique, e.g. `PR-2026-0001`
- `department_id` FK
- `requester_id` FK users
- `needed_by` date nullable
- `purpose` text
- `status` enum/string
- `submitted_at`, `approved_at`, `rejected_at`, `cancelled_at` nullable timestamps
- `approved_by`, `rejected_by` FK users nullable
- `approval_note` text nullable
- timestamps

Statuses:

- `draft`
- `submitted`
- `manager_review`
- `approved`
- `returned`
- `rejected`
- `converted_to_po`
- `cancelled`

Relationships:

- belongs to department
- belongs to requester user
- belongs to approver user nullable
- has many lines
- has many purchase orders through conversion link or direct relation

### `PurchaseRequestLine`

Fields:

- `id`
- `purchase_request_id` FK
- `item_id` FK nullable if free-text allowed
- `description` string
- `quantity` integer/decimal
- `unit` string
- `estimated_unit_cost` decimal nullable
- `approved_quantity` integer/decimal nullable
- `note` text nullable
- timestamps

Relationships:

- belongs to purchase request
- belongs to item nullable

### `PurchaseOrder`

Fields:

- `id`
- `number` string unique, e.g. `PO-2026-0001`
- `purchase_request_id` FK nullable
- `supplier_id` FK
- `buyer_id` FK users
- `status` enum/string
- `ordered_at` timestamp nullable
- `expected_at` date nullable
- `issued_at` timestamp nullable
- `closed_at` timestamp nullable
- `subtotal` decimal
- `tax` decimal default 0
- `total` decimal
- `terms` text nullable
- timestamps

Statuses:

- `draft`
- `issued`
- `partially_received`
- `received`
- `closed`
- `cancelled`

Relationships:

- belongs to supplier
- belongs to buyer user
- belongs to purchase request nullable
- has many lines
- has many receiving notes

### `PurchaseOrderLine`

Fields:

- `id`
- `purchase_order_id` FK
- `purchase_request_line_id` FK nullable
- `item_id` FK
- `description` string
- `quantity_ordered` decimal/integer
- `quantity_received` decimal/integer default 0
- `unit` string
- `unit_cost` decimal
- `line_total` decimal
- timestamps

Relationships:

- belongs to PO
- belongs to item
- optionally belongs to request line

### `ReceivingNote`

Fields:

- `id`
- `number` string unique, e.g. `GRN-2026-0001`
- `purchase_order_id` FK
- `received_by` FK users
- `received_at` timestamp/date
- `status` enum/string
- `note` text nullable
- timestamps

Statuses:

- `draft`
- `posted`
- `reversed`

Relationships:

- belongs to PO
- belongs to receiver user
- has many receiving lines
- has many inventory movements

### `ReceivingLine`

Fields:

- `id`
- `receiving_note_id` FK
- `purchase_order_line_id` FK
- `item_id` FK
- `quantity_received` decimal/integer
- `quantity_rejected` decimal/integer default 0
- `condition_note` string/text nullable
- timestamps

Relationships:

- belongs to receiving note
- belongs to PO line
- belongs to item

### `InventoryBalance`

Fields:

- `id`
- `item_id` FK
- `location_code` string default `MAIN`
- `quantity_on_hand` decimal/integer default 0
- `quantity_reserved` decimal/integer default 0
- `average_cost` decimal nullable
- timestamps

Relationships:

- belongs to item
- has many movements by item/location

Unique constraint:

- `item_id`, `location_code`

### `InventoryMovement`

Fields:

- `id`
- `item_id` FK
- `location_code` string
- `type` enum/string
- `quantity` signed decimal/integer
- `unit_cost` decimal nullable
- `reference_type` string nullable
- `reference_id` nullable
- `performed_by` FK users nullable
- `performed_at` timestamp
- `note` text nullable
- timestamps

Types:

- `receipt`
- `adjustment_in`
- `adjustment_out`
- `issue`
- `reversal`

Relationships:

- belongs to item
- belongs to performer user
- morph/reference to receiving note or manual adjustment, if implemented

### Optional audit model: `ApprovalLog`

Keep this optional if Laravolt workflow state already gives enough process evidence.

Fields:

- `id`
- `approvable_type`, `approvable_id`
- `from_status`, `to_status`
- `actor_id`
- `action`
- `note`
- `created_at`

## 6. Core flow

### Flow A — request creation

1. Requester opens **Purchase Requests → New request**.
2. Form uses `PrelineForm` and `StorePurchaseRequestRequest`.
3. Requester adds lines: item, description, quantity, estimated cost, note.
4. Save as `draft`.
5. Submit action validates at least one line and moves status to `submitted` / `manager_review`.
6. Event/log records submission.

Implementation surface:

- Model: `PurchaseRequest`, `PurchaseRequestLine`
- Controller: `PurchaseRequestController`
- Requests: `StorePurchaseRequestRequest`, `UpdatePurchaseRequestRequest`, `SubmitPurchaseRequestRequest`
- Policy methods: `viewAny`, `view`, `create`, `update`, `submit`
- UI: list table + create/edit/show pages
- Tests: validation, own-department visibility, cannot submit empty request

### Flow B — manager approval

1. Manager opens **Approvals inbox**.
2. Table filters requests where status is `manager_review` and department manager matches current user.
3. Manager opens request detail.
4. Manager can approve, reject, or return with note.
5. Approval records `approved_by`, `approved_at`, `approval_note`, and status `approved`.
6. Rejection records `rejected_by`, `rejected_at`, note, status `rejected`.

Implementation surface:

- Controller action class or methods: `ApprovePurchaseRequestController`, `RejectPurchaseRequestController`, `ReturnPurchaseRequestController`
- Request: `ApprovePurchaseRequestRequest` with note and approved quantities if editable
- Policy: `approve`, `reject`, `return`
- Workflow: optional explicit workflow module for `PurchaseRequestApproval` using `WorkflowService::start()` / `submitTask()`; for MVP, simple model transitions are acceptable if documented as demo simplification.
- Tests: allowed manager can approve, wrong manager forbidden, requester cannot self-approve unless configured.

### Flow C — PO generation

1. Procurement sees approved requests.
2. Procurement clicks **Create PO**.
3. Form pre-fills approved request lines and selects supplier.
4. PO starts in `draft`.
5. Procurement issues PO; status becomes `issued`, `issued_at` recorded.
6. Purchase request moves to `converted_to_po` once PO is issued.

Implementation surface:

- Models: `PurchaseOrder`, `PurchaseOrderLine`
- Controller: `PurchaseOrderController`
- Requests: `StorePurchaseOrderRequest`, `UpdatePurchaseOrderRequest`, `IssuePurchaseOrderRequest`
- Policy: `create`, `update`, `issue`
- Tables: open POs, draft POs, issued POs
- Jobs optional: `SendPurchaseOrderEmail` queued after issue
- Tests: cannot create PO from unapproved request, total is calculated, issue requires supplier and at least one line.

### Flow D — receiving goods

1. Warehouse opens an issued PO.
2. Clicks **Receive goods**.
3. Receiving form shows PO lines, ordered quantity, already received quantity, remaining quantity.
4. Warehouse enters received/rejected quantities and condition notes.
5. Posting the receiving note:
   - creates `ReceivingNote` and `ReceivingLine` records
   - increments `PurchaseOrderLine.quantity_received`
   - creates positive `InventoryMovement` records with type `receipt`
   - updates `InventoryBalance.quantity_on_hand`
   - sets PO status to `partially_received` or `received`
6. Browser demo shows inventory balance update after receipt.

Implementation surface:

- Models: `ReceivingNote`, `ReceivingLine`, `InventoryBalance`, `InventoryMovement`
- Controller: `ReceivingController`
- Request: `StoreReceivingNoteRequest`
- Service/action: `PostReceivingNoteAction`
- Policy: `receive`, `reverse`
- Tests: partial receipt, over-receipt blocked, inventory movement created, PO status updated.

### Flow E — inventory movement review

1. Auditor opens **Inventory → Movements**.
2. Suitable/Livewire table shows item, type, quantity, reference, performed by, performed at.
3. Auditor searches by SKU or reference number.
4. Optional export button gated by `report.export`.

Implementation surface:

- Table: `InventoryMovementTable`
- Policy: `viewAny`, `export`
- Browser smoke: table renders and search field works.

## 7. Screens/pages mapped to Laravolt features

| Screen | Route pattern | Laravolt feature(s) | Notes |
| --- | --- | --- | --- |
| Dashboard | `/dashboard` | `x-volt-app`, statistics/charts optional | Cards: pending approvals, open POs, low-stock items, recent receipts. |
| Items index | `/items` | `php artisan make:table ItemTable`, Suitable columns | Search SKU/name, active filter, low stock indicator. |
| Items create/edit | `/items/create`, `/items/{item}/edit` | `PrelineForm`, `StoreItemRequest`, `UpdateItemRequest`, Inputmask | SKU mask, unit select, reorder point numeric validation. |
| Suppliers index | `/suppliers` | Table + policy row actions | Search supplier name/contact. |
| Suppliers create/edit | `/suppliers/create`, `/suppliers/{supplier}/edit` | `PrelineForm`, phone mask, FormRequests | Demonstrates form builder beyond inventory. |
| Purchase requests index | `/purchase-requests` | Table/listing, policy-scoped query | Status badges and row actions. |
| Purchase request create/edit | `/purchase-requests/create`, `/purchase-requests/{purchaseRequest}/edit` | `PrelineForm`, nested line fields, FormRequest | Mark nested line UI API as TODO until implemented. |
| Purchase request show | `/purchase-requests/{purchaseRequest}` | `x-volt-app`, action buttons with `@can` | Submit/approve/reject/return buttons. |
| Approvals inbox | `/approvals/purchase-requests` | Table filtered by permission/department | Main workflow demo entry. |
| Purchase orders index | `/purchase-orders` | Table with status filters | Open/draft/issued/received tabs if time allows. |
| Purchase order create/edit | `/purchase-orders/create`, `/purchase-orders/{purchaseOrder}/edit` | `PrelineForm`, FormRequests, totals | Can be generated from approved PR. |
| Purchase order show | `/purchase-orders/{purchaseOrder}` | Detail + issue/receive actions | Clear operational state. |
| Receiving create | `/purchase-orders/{purchaseOrder}/receiving/create` | `PrelineForm`, FormRequest, action service | Posting creates movements. |
| Receiving show | `/receiving-notes/{receivingNote}` | Detail/evidence page | Show linked movements. |
| Inventory balances | `/inventory/balances` | Suitable/Livewire table | Current stock by item/location. |
| Inventory movements | `/inventory/movements` | Suitable/Livewire table | Audit trail and search. |
| Roles/users setup | existing Laravolt admin | Laravolt ACL | Seed roles for demo users. |
| AI context page | `/docs/ai-context.md` in app repo or `docs/ai-context.md` | docs/LLM context | Local demo-specific guide for agents. |

### Menu mapping

Use menu registration with permission metadata as described in access-control docs:

- Dashboard — `dashboard.view`
- Master Data
  - Items — `item.read`
  - Suppliers — `supplier.read`
- Procurement
  - Purchase Requests — `purchase-request.read`
  - Approval Inbox — `purchase-request.approve`
  - Purchase Orders — `purchase-order.read`
- Warehouse
  - Receive Goods — `receiving.create`
  - Inventory Balances — `inventory.read`
  - Inventory Movements — `inventory-movement.read`

API note: docs mention `app('laravolt.menu.builder')->register(...)` and config arrays under `config/laravolt/menu/*`; verify preferred v7 menu location before implementation.

## 8. Technical implementation plan

### Project bootstrap

Likely commands for a fresh demo app:

```bash
composer create-project laravel/laravel voltprocure
cd voltprocure
composer require laravolt/laravolt
php artisan laravolt:install
php artisan migrate
php artisan laravolt:admin "Rama" rama@example.com secret --no-verify
npm install
npm run build
```

Notes:

- `laravolt:install` publishes platform files, migrations, assets, media migrations, and Pest 4 setup per docs.
- Use `php artisan migrate` for normal work; avoid `migrate:fresh` unless the demo database is disposable.
- Run `php artisan list laravolt` in the app to confirm exact commands available.

### Artisan generation checklist

Likely commands:

```bash
php artisan make:model Department -mfs
php artisan make:model Item -mfs
php artisan make:model Supplier -mfs
php artisan make:model PurchaseRequest -mfs
php artisan make:model PurchaseRequestLine -mfs
php artisan make:model PurchaseOrder -mfs
php artisan make:model PurchaseOrderLine -mfs
php artisan make:model ReceivingNote -mfs
php artisan make:model ReceivingLine -mfs
php artisan make:model InventoryBalance -mfs
php artisan make:model InventoryMovement -mfs

php artisan make:request StoreItemRequest
php artisan make:request UpdateItemRequest
php artisan make:request StoreSupplierRequest
php artisan make:request UpdateSupplierRequest
php artisan make:request StorePurchaseRequestRequest
php artisan make:request UpdatePurchaseRequestRequest
php artisan make:request SubmitPurchaseRequestRequest
php artisan make:request ApprovePurchaseRequestRequest
php artisan make:request StorePurchaseOrderRequest
php artisan make:request UpdatePurchaseOrderRequest
php artisan make:request IssuePurchaseOrderRequest
php artisan make:request StoreReceivingNoteRequest

php artisan make:policy ItemPolicy --model=Item
php artisan make:policy SupplierPolicy --model=Supplier
php artisan make:policy PurchaseRequestPolicy --model=PurchaseRequest
php artisan make:policy PurchaseOrderPolicy --model=PurchaseOrder
php artisan make:policy ReceivingNotePolicy --model=ReceivingNote
php artisan make:policy InventoryMovementPolicy --model=InventoryMovement

php artisan make:controller ItemController --resource --model=Item
php artisan make:controller SupplierController --resource --model=Supplier
php artisan make:controller PurchaseRequestController --resource --model=PurchaseRequest
php artisan make:controller PurchaseOrderController --resource --model=PurchaseOrder
php artisan make:controller ReceivingController
php artisan make:controller InventoryController

php artisan make:table ItemTable
php artisan make:table SupplierTable
php artisan make:table PurchaseRequestTable
php artisan make:table ApprovalInboxTable
php artisan make:table PurchaseOrderTable
php artisan make:table InventoryBalanceTable
php artisan make:table InventoryMovementTable
```

TODO: verify whether `make:model -mfs`, `make:policy --model`, and controller flags align with the target Laravel version in the demo app. These are Laravel-native, not Laravolt-specific.

### Migrations

Implementation requirements:

- Use foreign keys with constrained deletes where safe.
- Do not cascade-delete operational evidence casually; prefer restrict/null-on-delete for users and suppliers.
- Add indexes for statuses, numbers, FK columns, and common searches (`sku`, `name`, `number`).
- Use decimals for quantities if the demo might include partial units; use integers if keeping MVP simple.
- Add enum-like strings and PHP backed enums if time allows.

Recommended MVP simplification:

- Use string `status` fields with constants/enums in model classes.
- Use one location code: `MAIN`.
- Avoid multi-currency/tax complexity beyond `subtotal`, `tax`, `total`.

### Models and relationships

Use typed relationships:

- `belongsTo`, `hasMany`, optional `morphTo` or plain reference fields for movement references.
- Add casts for money/quantity/status/date fields.
- Keep transition logic in action/service classes, not controllers.
- Avoid ad-hoc queries in Blade.

Suggested action classes:

- `SubmitPurchaseRequestAction`
- `ApprovePurchaseRequestAction`
- `RejectPurchaseRequestAction`
- `CreatePurchaseOrderFromRequestAction`
- `IssuePurchaseOrderAction`
- `PostReceivingNoteAction`
- `AdjustInventoryBalanceAction`

### Forms

Use `PrelineForm` for all create/edit/action forms:

- `PrelineForm::post('items.store')->validate(StoreItemRequest::class)`
- `PrelineForm::open('items.update', $item)->put()->validate(UpdateItemRequest::class)`
- `PrelineForm::text('sku')->mask('AAA-9999')`
- `PrelineForm::number('reorder_point')->min(0)->step(1)`
- `PrelineForm::select('supplier_id', $suppliers)->placeholder('Select supplier')`

Nested line forms:

- For MVP, render 3-5 line rows with `items[0][item_id]`, `items[0][quantity]`, etc.
- Use FormRequest wildcard rules: `lines.*.item_id`, `lines.*.quantity`, `lines.*.description`.
- TODO: verify preferred dynamic row component pattern in current Laravolt/Livewire 4 skeleton.

### Tables

Use generated table classes for operational lists:

- Query/search/sort logic lives in `app/Http/Livewire/Table/*Table.php` or generated equivalent.
- Blade page uses `<livewire:table.item-table />` or `@livewire(App\Http\Livewire\Table\ItemTable::class)` per `make:table` output.
- Use Suitable columns where direct rendering is enough: `Text`, `DateTime`, `Currency`, `Boolean`, `Numbering`, `RestfulButton` when appropriate.
- TODO: verify current generated table stub path and exact Livewire 4 syntax in the target app because source command exists, but stub path should be checked in the installed application.

### Policies and ACL

Policy methods should be explicit:

- `ItemPolicy`: `viewAny`, `view`, `create`, `update`, `archive`
- `PurchaseRequestPolicy`: `viewAny`, `view`, `create`, `update`, `submit`, `approve`, `reject`, `return`, `cancel`
- `PurchaseOrderPolicy`: `viewAny`, `view`, `create`, `update`, `issue`, `cancel`
- `ReceivingNotePolicy`: `viewAny`, `view`, `create`, `reverse`
- `InventoryMovementPolicy`: `viewAny`, `view`, `create`, `adjust`, `export`

Seed roles with `syncPermission([...])`. Register menu entries with permission metadata. Use `@can` for buttons, but keep route/controller authorization as the real boundary.

### Workflow

Two-tier plan:

1. **MVP:** Use explicit action classes and model statuses for request approval and receiving. This keeps the 1-day demo achievable.
2. **Beta/polished:** Add a `PurchaseRequestApproval` workflow module and demonstrate `WorkflowService::start()` / `submitTask()` for the manager approval path.

Verified from source:

- `Laravolt\Workflow\WorkflowService::start(Module $module, array $data): ProcessInstance`
- `Laravolt\Workflow\WorkflowService::submitTask(Module $module, Task $task, array $data)`
- events around lifecycle include `ProcessInstanceStarting`, `TaskCompleting`, `TaskCompleted` in current service path.

TODO: verify module/form schema authoring APIs and whether Camunda is expected for the demo environment.

### Seeders

Seed:

- Roles and permissions listed above.
- Users:
  - admin@example.test — Administrator
  - requester@example.test — Requester
  - manager@example.test — Department Manager
  - procurement@example.test — Procurement Officer
  - warehouse@example.test — Warehouse Staff
  - auditor@example.test — Inventory Auditor
- Departments: IT, Operations, Finance.
- Items: toner, keyboard, monitor, safety gloves, paper reams.
- Suppliers: Acme Office Supply, Nusantara Tech Supplier, SafeOps Industrial.
- Inventory balances: a few items below reorder point.
- One draft PR, one submitted PR, one approved PR, one issued PO, one partially received PO.

### Tests

Feature tests:

- Requester can create and submit a PR.
- Empty PR cannot be submitted.
- Manager can approve department PR.
- Wrong manager/user cannot approve.
- Procurement can create PO only from approved PR.
- Warehouse can post partial receiving.
- Over-receiving is blocked.
- Inventory movement and balance update after receiving.
- Permission-denied cases for each critical action.

Browser smoke tests:

- Login/admin navigation smoke.
- Purchase request create form renders fields and validation feedback.
- Approval inbox shows pending request for manager.
- PO issue/receiving happy path, kept short.
- Inventory movement table search by SKU/reference.

Commands to use as gates:

```bash
php artisan test
vendor/bin/pest tests/Browser
npm run build
php artisan route:list
./vendor/bin/pint --test
```

Use narrower filters during development, then run full gates before publishing the demo.

## 9. LLM-readiness plan

### Demo-specific AI context

Create a demo app file such as `docs/ai-context.md` or `.ai/laravolt-context.md` with:

- App narrative and roles.
- Domain model summary.
- Permission vocabulary.
- Route naming conventions.
- Required Laravolt docs URLs/pages:
  - `/llms.txt`
  - `/llms-full.txt`
  - `/v7/forms/overview.md`
  - `/v7/ui-foundation/tables.md`
  - `/v7/security/access-control.md`
  - `/v7/workflow-and-automation/overview.md`
  - `/v7/testing/browser-testing.md`
  - `/v7/ai-ready-development/guide.md`
- Evidence contract: changed files, tests run, TODOs, screenshots if UI changed.

### Task recipes

Include reusable prompts in `docs/task-recipes.md`:

1. **Add a master data resource**
   - Resource contract, fields, FormRequests, policy, table, menu, tests.
2. **Add a workflow action**
   - Action method/class, permission, policy method, button, route authorization, tests.
3. **Add a table filter/column**
   - Generated table class only; no Blade query logic.
4. **Add a FormRequest validation rule**
   - Server-side rule first, PrelineForm field update, tests.
5. **Add browser smoke test**
   - User-visible assertion only, stable selectors/field names.

### Acceptance tests as AI guardrails

Each subagent/task must include at least:

- One positive feature test.
- One negative permission or validation test.
- A route/menu/button authorization review.
- A note listing any uncertain Laravolt APIs as `TODO: verify API`.

### Docs build usage

The demo should explicitly show this workflow:

1. Open Laravolt docs page.
2. Use Copy Markdown or per-page `.md` mirror.
3. Give an agent `/llms.txt` or `/llms-full.txt` plus the local `docs/ai-context.md`.
4. Ask for a narrow implementation task.
5. Agent returns evidence and tests.

This is the actual AI-readiness story: docs + conventions + tests + review, not “AI magic”.

## 10. Milestones

### MVP in 1 day

Goal: end-to-end story works locally with seeded data and simple status transitions.

Scope:

- Fresh Laravolt v7 app installed.
- Roles/permissions/users seeded.
- Migrations/models/factories/seeders for core entities.
- CRUD/list screens for Items, Suppliers, Purchase Requests, Purchase Orders.
- Submit/approve/create PO/issue/receive actions implemented with model status transitions.
- Inventory balance and movement update on receiving.
- Minimal dashboard cards.
- Feature tests for the critical happy path and one denied path per major role.
- `docs/ai-context.md` created in demo app.

Defer:

- Full workflow engine integration.
- Fancy dynamic line editing.
- Exports/PDF/email.
- Multi-location inventory.
- Full browser suite.

### Beta demo in 3 days

Goal: presentable demo for developers with visible Laravolt conventions and AI task workflow.

Add:

- Generated table classes polished with search/sort/status filters.
- Better `PrelineForm` forms with masks, hints, validation messages.
- Approval inbox and PO/receiving detail pages polished.
- Browser smoke tests for critical flows.
- Menu permission metadata and role-specific screenshots.
- Optional queued job on PO issue or receiving posted.
- Workflow module proof for purchase request approval if Camunda/setup is ready.
- Demo-specific docs: `docs/ai-context.md`, `docs/task-recipes.md`, `docs/demo-script.md`.
- Article/video draft assets.

### Polished release demo in 1 week

Goal: public-quality reference app and content series.

Add:

- Workflow engine integration or clearly documented non-workflow fallback.
- Audit/evidence timeline on PR/PO/receiving pages.
- Export/report screen gated by `report.export`.
- Strong seed story with realistic statuses.
- CI pipeline running PHP tests, build, and selected browser tests.
- Screenshots/GIF/video script.
- A “build this with an AI agent” recorded segment using `llms.txt` and task recipes.
- Cleanup pass: naming, policies, factories, docs, route names, test readability.

## 11. Parallelizable next implementation tasks for subagents

### Work package 1 — Domain schema and seed story

Deliver:

- Migrations, models, factories, seeders for all core entities.
- Status constants/enums.
- Demo users, roles, permissions, departments, items, suppliers, stock, PR/PO/receiving sample data.
- Tests for relationships and seed role permissions.

Evidence:

- changed files
- `php artisan migrate:fresh --seed` result on disposable demo DB
- targeted model/relationship tests

### Work package 2 — Forms, resource controllers, and policies

Deliver:

- Resource controllers for Items, Suppliers, Purchase Requests, Purchase Orders.
- FormRequests with validation/authorization.
- Policies with resource-action permission names.
- `PrelineForm` create/edit views.
- Menu registration with permission metadata.

Evidence:

- route list for resources
- feature tests for create/update allowed/denied
- screenshots if browser available

### Work package 3 — Tables and operational listings

Deliver:

- Generated table classes: Item, Supplier, PurchaseRequest, ApprovalInbox, PurchaseOrder, InventoryBalance, InventoryMovement.
- Search/sort/status filters in table classes.
- Row actions protected with policies.
- List pages using Livewire table component or Suitable rendering.

Evidence:

- `php artisan make:table` outputs/usage checked
- table feature/browser smoke where possible
- no query logic in Blade

### Work package 4 — Workflow/actions and inventory posting

Deliver:

- Action classes for submit/approve/reject/create PO/issue/receive.
- Receiving posting transaction updates PO lines, PO status, inventory balances, movements.
- Optional workflow engine spike for `PurchaseRequestApproval` with `WorkflowService`.
- Events/listeners for audit/notifications if time allows.

Evidence:

- transition tests
- over-receiving validation test
- notes on workflow API verification

### Work package 5 — AI-readiness docs, browser tests, and content assets

Deliver:

- Demo app `docs/ai-context.md`, `docs/task-recipes.md`, `docs/demo-script.md`.
- Browser smoke tests for request → approval → PO → receiving → movement.
- Article/video outline expanded into draft posts/scripts.
- README section showing how to use Laravolt docs `/llms.txt` and local AI context.

Evidence:

- browser test command result or setup blocker
- docs files
- demo script checklist

## 12. Risks and API verification checklist

### Main risks

- **Workflow integration scope** — current docs/source mention Camunda-backed workflow service. A fully working workflow engine may exceed 1 day.
- **Livewire 4/table generation details** — docs say `make:table` creates `app/Http/Livewire/Table`, but exact generated stub and usage must be checked in a fresh installed app.
- **Nested line forms** — dynamic PR/PO/receiving lines may need Livewire components or careful Blade arrays; keep MVP simple.
- **ACL model assumptions** — seeders depend on configured Laravolt role/user/permission model classes.
- **Browser test setup** — Pest Browser support is documented as work in progress; commands/CI may need release-branch verification.
- **Dirty unrelated file in app repo** — `/Users/rama/Laravolt/laravolt/packages/preline-form/src/ServiceProvider.php` is already dirty; do not touch during demo planning.

### API verification checklist

Before coding, verify these in a fresh demo app or source:

- [ ] `composer require laravolt/laravolt` installs the expected v7 branch/packages.
- [ ] `php artisan laravolt:install` completes and published files match docs.
- [ ] Exact `make:table` generated file path and component usage.
- [ ] Suitable facade alias/import: docs use `Laravolt\Suitable\Facade as Suitable`; confirm app alias if using `Suitable::source()` directly.
- [ ] Available Suitable columns needed: `Text`, `DateTime`, `Currency`, `Boolean`, `Numbering`, `RestfulButton`.
- [ ] `PrelineForm::open(...)->post()->validate(FormRequest::class)` works in target app.
- [ ] `PrelineForm::link()` exists before using it in views. TODO: verify API.
- [ ] Inputmask masks (`phone`, `currency`, custom SKU) render required assets.
- [ ] Menu registration preferred approach: service provider callback vs `config/laravolt/menu/*`.
- [ ] Role and permission model config keys and seed syntax.
- [ ] User model uses Laravolt role/permission concern or equivalent.
- [ ] Policy middleware route syntax with route-model parameter names.
- [ ] Workflow module authoring API: `Module`, form schema, task keys, Camunda configuration.
- [ ] Browser test command and Playwright install command for the chosen app skeleton.
- [ ] CI/build command uses npm/bun/pnpm consistently.

## 13. Suggested article/video series

### Article 1 — “Laravolt v7 is not just an admin panel”

Angle: platform thesis through the VoltProcure demo.

Outline:

- Why internal apps become workflow software.
- The request → approval → PO → receiving → inventory story.
- Laravolt layers: Laravel app, platform layer, product surfaces.
- AI-ready as explicit conventions + docs + tests.

### Article 2 — “Building business forms with PrelineForm and FormRequest”

Angle: purchase request and receiving forms.

Outline:

- FormRequest as single source of truth.
- `PrelineForm` fields, validation, masks.
- Nested lines and server-side validation.
- Tests as agent guardrails.

### Article 3 — “Tables, permissions, and operational lists in Laravolt v7”

Angle: approval inbox, purchase order list, inventory movements.

Outline:

- Generated table classes.
- Suitable columns and search.
- Policy-protected row actions.
- Menu permission metadata.

### Article 4 — “From CRUD to workflow: approvals and inventory movements”

Angle: action classes and optional workflow module.

Outline:

- Named business actions.
- Status transitions.
- `WorkflowService` when process state needs explicit tasks.
- Audit events and queued side effects.

### Article 5 / Video — “Letting an AI agent safely add a feature to Laravolt v7”

Angle: the AI-readiness proof.

Outline:

- Show `/llms.txt` and `/llms-full.txt`.
- Show demo `docs/ai-context.md`.
- Prompt an agent to add a field/table filter/action.
- Review changed files and tests.
- Explain why the platform conventions made the edit safe.

### Short video demo script

1. Open dashboard: pending approvals/open POs/low stock.
2. Login as requester; create and submit PR.
3. Login as manager; approve PR.
4. Login as procurement; create and issue PO.
5. Login as warehouse; receive partial goods.
6. Open inventory movement audit trail.
7. Open Laravolt docs Copy Markdown / `llms.txt` and show the AI task recipe.
8. Run tests or show CI passing.

## 14. Definition of done for the demo

The demo is ready when:

- A seeded user can complete request → approval → PO → receiving → inventory movement.
- Role-specific users see only the intended menu/actions.
- At least one denied permission case is visibly tested.
- Forms use `PrelineForm` + `FormRequest`.
- Listings use generated table classes or Suitable, with query logic outside Blade.
- Critical transitions are covered by feature tests.
- A browser smoke test covers at least one end-to-end UI path.
- Demo docs explain how an AI agent should use Laravolt docs context and local task recipes.
- All uncertain APIs are either verified or clearly marked `TODO: verify API`.
