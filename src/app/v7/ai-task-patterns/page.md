---
title: AI Task Patterns
---

# AI Task Patterns

Practical prompt templates for common Laravolt v7 tasks. Each pattern includes the prompt, expected output, verification steps, and common pitfalls. {% .lead %}

## How to use these patterns

1. Copy the prompt template
2. Replace `{placeholders}` with your values
3. Include `/llms.txt` context reference
4. Specify expected deliverables
5. Verify the output with provided commands

## Pattern 1: Generate CRUD for table

### Prompt template

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Generate CRUD module for {table_name}

Steps:
1. Create migration for {table_name} with fields:
   - {field_1}: {type}, {constraints}
   - {field_2}: {type}, {constraints}
   - ...
2. Run migration: php artisan migrate
3. Generate module: php artisan laravolt:clap --table={table_name} --module={ModuleName}
4. Register ServiceProvider in config/app.php
5. Verify routes: php artisan route:list --name={route_prefix}
6. Run tests: php artisan test --filter={ModuleName}Test

Deliverables:
- Migration file
- Generated module structure
- Route list output
- Test results
```

### Example: Product CRUD

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Generate CRUD module for products

Steps:
1. Create migration for products with fields:
   - name: string, required, max 255
   - sku: string, required, unique, max 50
   - description: text, nullable
   - price: decimal(10,2), required
   - is_active: boolean, default true
2. Run migration: php artisan migrate
3. Generate module: php artisan laravolt:clap --table=products --module=Product
4. Register ServiceProvider in config/app.php
5. Verify routes: php artisan route:list --name=product
6. Run tests: php artisan test --filter=ProductTest

Deliverables:
- Migration file
- Generated module structure
- Route list output
- Test results
```

### Expected output

```
✓ Migration created: database/migrations/2024_01_15_create_products_table.php
✓ Migration run successfully
✓ Module generated: modules/Product/
✓ ServiceProvider registered
✓ Routes verified (7 routes)
✓ Tests passed (4 tests)

Files created:
- modules/Product/Controllers/ProductController.php
- modules/Product/Models/Product.php
- modules/Product/Requests/StoreProductRequest.php
- modules/Product/Requests/UpdateProductRequest.php
- modules/Product/resources/views/index.blade.php
- modules/Product/resources/views/create.blade.php
- modules/Product/resources/views/edit.blade.php
- modules/Product/resources/views/show.blade.php
- modules/Product/resources/views/form.blade.php
- modules/Product/TableView.php
- modules/Product/routes/web.php
- modules/Product/config/config.php
- modules/Product/ServiceProvider.php
- modules/Product/Tests/Feature/ProductTest.php
```

### Verification

```bash
php artisan route:list --name=product
php artisan test --filter=ProductTest
php artisan serve
# Visit: http://localhost:8000/product
```

### Common pitfalls

- ❌ Forgetting to register ServiceProvider → routes not found
- ❌ Not running migration before `laravolt:clap` → table not found error
- ❌ Using wrong table name (plural vs singular) → model mismatch
- ✅ Always verify routes after generation
- ✅ Run tests before customizing

## Pattern 2: Add approval workflow

### Prompt template

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Add approval workflow to {ModuleName}

Requirements:
1. Add status field to {table_name}: enum('draft', 'submitted', 'approved', 'rejected')
2. Add submitted_at, approved_at, rejected_at timestamps
3. Add approver_id foreign key (references users)
4. Add approval actions to controller:
   - submit() - change status to 'submitted'
   - approve() - change status to 'approved', set approved_at and approver_id
   - reject() - change status to 'rejected', set rejected_at and approver_id
5. Add routes for approval actions
6. Add action buttons to show page (conditional on status)
7. Add permissions: {resource}.submit, {resource}.approve, {resource}.reject
8. Add policy checks for each action
9. Add feature tests for approval workflow

Files to modify:
- New migration: add_approval_fields_to_{table_name}
- {ModuleName}Controller.php
- routes/web.php
- resources/views/show.blade.php
- {ModuleName}Policy.php (create if not exists)
- Tests/Feature/{ModuleName}ApprovalTest.php (new)

Deliverables:
- Migration file
- Updated controller with approval methods
- Updated routes
- Updated show view with action buttons
- Policy with approval rules
- Test results
```

### Example: Purchase Order approval

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Add approval workflow to PurchaseOrder

Requirements:
1. Add status field to purchase_orders: enum('draft', 'submitted', 'approved', 'rejected')
2. Add submitted_at, approved_at, rejected_at timestamps
3. Add approver_id foreign key (references users)
4. Add approval actions to controller:
   - submit() - change status to 'submitted'
   - approve() - change status to 'approved', set approved_at and approver_id
   - reject() - change status to 'rejected', set rejected_at and approver_id
5. Add routes for approval actions
6. Add action buttons to show page (conditional on status)
7. Add permissions: purchase-order.submit, purchase-order.approve, purchase-order.reject
8. Add policy checks for each action
9. Add feature tests for approval workflow

Files to modify:
- New migration: add_approval_fields_to_purchase_orders
- PurchaseOrderController.php
- routes/web.php
- resources/views/show.blade.php
- PurchaseOrderPolicy.php (create if not exists)
- Tests/Feature/PurchaseOrderApprovalTest.php (new)

Deliverables:
- Migration file
- Updated controller with approval methods
- Updated routes
- Updated show view with action buttons
- Policy with approval rules
- Test results
```

### Expected output

```
✓ Migration created and run
✓ Controller updated with submit/approve/reject methods
✓ Routes added: purchase-order.submit, purchase-order.approve, purchase-order.reject
✓ Show view updated with conditional action buttons
✓ Policy created with approval rules
✓ Tests created and passing

New routes:
POST   purchase-order/{purchase_order}/submit  ... purchase-order.submit
POST   purchase-order/{purchase_order}/approve ... purchase-order.approve
POST   purchase-order/{purchase_order}/reject  ... purchase-order.reject
```

### Verification

```bash
php artisan migrate
php artisan route:list --name=purchase-order
php artisan test --filter=PurchaseOrderApprovalTest

# Manual test:
# 1. Create purchase order (status: draft)
# 2. Click "Submit" (status: submitted)
# 3. Login as approver
# 4. Click "Approve" (status: approved, approved_at set)
```

### Common pitfalls

- ❌ Not adding policy checks → unauthorized users can approve
- ❌ Not validating status transitions → can approve already approved orders
- ❌ Forgetting to set timestamps → approved_at remains null
- ❌ Not testing negative cases → missing "cannot approve draft" test
- ✅ Always check current status before transition
- ✅ Use policy gates, not just UI hiding
- ✅ Test both allowed and denied paths

## Pattern 3: Customize form with validation

### Prompt template

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Customize {ModuleName} form with validation

Requirements:
1. Update form fields in form.blade.php:
   - {field_1}: {field_type}, {attributes}
   - {field_2}: {field_type}, {attributes}
   - ...
2. Update validation in StoreRequest and UpdateRequest:
   - {field_1}: {rules}
   - {field_2}: {rules}
   - ...
3. Add custom validation messages if needed
4. Add input masks for formatted fields (phone, currency, etc.)

Files to modify:
- resources/views/form.blade.php
- Requests/Store{ModuleName}Request.php
- Requests/Update{ModuleName}Request.php

Use PrelineForm API for fields.
Use Laravel validation rules.

Deliverables:
- Updated form view
- Updated validation rules
- Test command to verify validation
```

### Example: Product form customization

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Customize Product form with validation

Requirements:
1. Update form fields in form.blade.php:
   - name: text input, required, max 255, help text "Product display name"
   - sku: text input, required, max 50, uppercase, help text "Format: PROD-XXXX"
   - description: textarea, 5 rows, max 1000, optional
   - price: number input, required, min 0.01, currency mask (IDR)
   - category_id: select dropdown, required, load from categories table
   - is_active: checkbox, default checked
2. Update validation in StoreRequest and UpdateRequest:
   - name: required, string, max 255, unique
   - sku: required, string, max 50, unique, uppercase, regex:/^PROD-[A-Z0-9]+$/
   - description: nullable, string, max 1000
   - price: required, numeric, min 0.01
   - category_id: required, exists:categories,id
   - is_active: boolean
3. Add custom validation messages for SKU format
4. Add currency input mask for price field

Files to modify:
- resources/views/form.blade.php
- Requests/StoreProductRequest.php
- Requests/UpdateProductRequest.php

Use PrelineForm API for fields.
Use Laravel validation rules.

Deliverables:
- Updated form view
- Updated validation rules
- Test command to verify validation
```

### Expected output

Form view with PrelineForm:

```blade
{!! PrelineForm::text('name')
    ->label('Product Name')
    ->required()
    ->maxlength(255)
    ->help('Product display name') !!}

{!! PrelineForm::text('sku')
    ->label('SKU')
    ->required()
    ->maxlength(50)
    ->help('Format: PROD-XXXX')
    ->attributes(['style' => 'text-transform: uppercase']) !!}

{!! PrelineForm::textarea('description')
    ->label('Description')
    ->rows(5)
    ->maxlength(1000) !!}

{!! PrelineForm::number('price')
    ->label('Price (IDR)')
    ->required()
    ->min(0.01)
    ->step(0.01)
    ->inputmask(['alias' => 'currency', 'prefix' => 'Rp ', 'digits' => 0]) !!}

{!! PrelineForm::select('category_id', $categories)
    ->label('Category')
    ->required()
    ->placeholder('-- Select Category --') !!}

{!! PrelineForm::checkbox('is_active', 1)
    ->label('Active')
    ->checked(old('is_active', $product->is_active ?? true)) !!}
```

Validation rules:

```php
// StoreProductRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255', 'unique:products,name'],
        'sku' => ['required', 'string', 'max:50', 'unique:products,sku', 'uppercase', 'regex:/^PROD-[A-Z0-9]+$/'],
        'description' => ['nullable', 'string', 'max:1000'],
        'price' => ['required', 'numeric', 'min:0.01'],
        'category_id' => ['required', 'exists:categories,id'],
        'is_active' => ['boolean'],
    ];
}

public function messages(): array
{
    return [
        'sku.regex' => 'SKU must start with PROD- followed by uppercase letters and numbers.',
    ];
}
```

### Verification

```bash
# Test validation
php artisan test --filter=ProductTest

# Manual test:
# 1. Try invalid SKU format (e.g., "prod-123") → expect error
# 2. Try duplicate SKU → expect error
# 3. Try negative price → expect error
# 4. Try valid data → expect success
```

### Common pitfalls

- ❌ Not syncing validation rules between Store and Update requests
- ❌ Forgetting `unique` rule exception for Update request
- ❌ Not testing validation errors in browser
- ❌ Using wrong PrelineForm method names
- ✅ Always test both positive and negative validation cases
- ✅ Use `help()` for user guidance
- ✅ Use `inputmask()` for formatted inputs

## Pattern 4: Add search and filter to listing

### Prompt template

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Add search and filter to {ModuleName} listing

Requirements:
1. Add search on fields: {field_1}, {field_2}, ...
2. Add filters:
   - {filter_1}: {type} (e.g., select, checkbox, date range)
   - {filter_2}: {type}
   - ...
3. Update TableView query to apply search and filters
4. Add filter UI to index page

Files to modify:
- {ModuleName}TableView.php
- resources/views/index.blade.php (if custom filters needed)

Use Suitable searchable() and query() methods.

Deliverables:
- Updated TableView with search and filters
- Verification command
```

### Example: Product listing with search and filters

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Add search and filter to Product listing

Requirements:
1. Add search on fields: name, sku, description
2. Add filters:
   - category_id: select dropdown (all categories)
   - is_active: select (all/active/inactive)
   - price_range: min/max inputs
3. Update ProductTableView query to apply search and filters
4. Suitable will handle filter UI automatically

Files to modify:
- ProductTableView.php

Use Suitable searchable() and query() methods.

Deliverables:
- Updated TableView with search and filters
- Verification command
```

### Expected output

```php
// ProductTableView.php
use Laravolt\Suitable\Columns\Text;
use Laravolt\Suitable\Columns\Boolean;
use Laravolt\Suitable\Columns\Number;
use App\Models\Category;

public function columns(): array
{
    return [
        Text::make('name', 'Product Name')->sortable(),
        Text::make('sku', 'SKU')->sortable(),
        Text::make('category.name', 'Category'),
        Number::make('price', 'Price')->sortable()->prefix('Rp ')->decimal(0),
        Boolean::make('is_active', 'Active'),
    ];
}

public function searchable(): array
{
    return ['name', 'sku', 'description'];
}

public function query()
{
    $query = Product::with('category');

    // Filter by category
    if (request('category_id')) {
        $query->where('category_id', request('category_id'));
    }

    // Filter by active status
    if (request('is_active') !== null && request('is_active') !== '') {
        $query->where('is_active', request('is_active'));
    }

    // Filter by price range
    if (request('price_min')) {
        $query->where('price', '>=', request('price_min'));
    }
    if (request('price_max')) {
        $query->where('price', '<=', request('price_max'));
    }

    return $query;
}

public function filters(): array
{
    return [
        'category_id' => [
            'label' => 'Category',
            'type' => 'select',
            'options' => Category::pluck('name', 'id')->prepend('All Categories', ''),
        ],
        'is_active' => [
            'label' => 'Status',
            'type' => 'select',
            'options' => [
                '' => 'All',
                '1' => 'Active',
                '0' => 'Inactive',
            ],
        ],
        'price_min' => [
            'label' => 'Min Price',
            'type' => 'number',
        ],
        'price_max' => [
            'label' => 'Max Price',
            'type' => 'number',
        ],
    ];
}
```

### Verification

```bash
php artisan serve
# Visit: http://localhost:8000/product

# Test:
# 1. Type in search box → results filter by name/sku/description
# 2. Select category → results filter by category
# 3. Select "Active" status → only active products shown
# 4. Enter price range → results within range
# 5. Combine filters → all filters apply together
```

### Common pitfalls

- ❌ Not handling empty filter values → query breaks
- ❌ Forgetting to eager load relationships → N+1 query problem
- ❌ Not testing filter combinations → filters conflict
- ❌ Using `=` for text search instead of `LIKE`
- ✅ Always check `request('filter') !== null && request('filter') !== ''`
- ✅ Use `with()` for relationships shown in columns
- ✅ Test each filter individually and in combination

## Pattern 5: Add row actions with policy checks

### Prompt template

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Add row actions to {ModuleName} listing

Requirements:
1. Add row actions:
   - View: route to show page
   - Edit: route to edit page (if user can update)
   - Delete: delete action (if user can delete)
   - {Custom action}: route/action (if user can {permission})
2. Add policy checks for each action
3. Update TableView with action column

Files to modify:
- {ModuleName}TableView.php
- {ModuleName}Policy.php (if not exists, create it)

Use Suitable action columns.
Use Laravel policy gates.

Deliverables:
- Updated TableView with actions
- Policy with action rules
- Verification command
```

### Example: Product listing with actions

```txt
Read /llms.txt for Laravolt v7 conventions.

Task: Add row actions to Product listing

Requirements:
1. Add row actions:
   - View: route to show page
   - Edit: route to edit page (if user can update)
   - Delete: delete action (if user can delete)
   - Duplicate: custom action to duplicate product (if user can create)
2. Add policy checks for each action
3. Update ProductTableView with action column

Files to modify:
- ProductTableView.php
- ProductPolicy.php (create if not exists)

Use Suitable action columns.
Use Laravel policy gates.

Deliverables:
- Updated TableView with actions
- Policy with action rules
- Verification command
```

### Expected output

Policy:

```php
// app/Policies/ProductPolicy.php
namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('product.read');
    }

    public function view(User $user, Product $product): bool
    {
        return $user->can('product.read');
    }

    public function create(User $user): bool
    {
        return $user->can('product.create');
    }

    public function update(User $user, Product $product): bool
    {
        return $user->can('product.update');
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->can('product.delete');
    }

    public function duplicate(User $user, Product $product): bool
    {
        return $user->can('product.create');
    }
}
```

TableView with actions:

```php
// ProductTableView.php
use Laravolt\Suitable\Columns\Action;
use Laravolt\Suitable\Columns\DropdownAction;

public function columns(): array
{
    return [
        Text::make('name', 'Product Name')->sortable(),
        Text::make('sku', 'SKU')->sortable(),
        Number::make('price', 'Price')->sortable()->prefix('Rp ')->decimal(0),
        Boolean::make('is_active', 'Active'),
        
        DropdownAction::make('Actions')
            ->actions(function ($row) {
                $actions = [];

                if (auth()->user()->can('view', $row)) {
                    $actions[] = [
                        'label' => 'View',
                        'url' => route('product.show', $row),
                    ];
                }

                if (auth()->user()->can('update', $row)) {
                    $actions[] = [
                        'label' => 'Edit',
                        'url' => route('product.edit', $row),
                    ];
                }

                if (auth()->user()->can('duplicate', $row)) {
                    $actions[] = [
                        'label' => 'Duplicate',
                        'url' => route('product.duplicate', $row),
                        'method' => 'POST',
                    ];
                }

                if (auth()->user()->can('delete', $row)) {
                    $actions[] = [
                        'label' => 'Delete',
                        'url' => route('product.destroy', $row),
                        'method' => 'DELETE',
                        'confirm' => 'Are you sure you want to delete this product?',
                    ];
                }

                return $actions;
            }),
    ];
}
```

### Verification

```bash
# Register policy in AuthServiceProvider
# app/Providers/AuthServiceProvider.php
protected $policies = [
    Product::class => ProductPolicy::class,
];

php artisan serve
# Visit: http://localhost:8000/product

# Test as different users:
# 1. User with product.read only → see View action only
# 2. User with product.update → see View, Edit actions
# 3. User with product.delete → see View, Edit, Delete actions
# 4. User with product.create → see View, Edit, Duplicate actions
```

### Common pitfalls

- ❌ Not registering policy in AuthServiceProvider → policy not applied
- ❌ Using UI hiding instead of policy checks → security hole
- ❌ Not testing with different user roles → unauthorized access
- ❌ Forgetting CSRF token for POST/DELETE actions
- ✅ Always use `auth()->user()->can()` for action visibility
- ✅ Add `confirm` for destructive actions
- ✅ Test with users having different permissions

## Summary

These patterns cover the most common Laravolt v7 tasks:

1. **Generate CRUD** - Bootstrap from table to working module
2. **Add approval workflow** - Status transitions with permissions
3. **Customize form** - Validation, input masks, field types
4. **Add search/filter** - Query customization for listings
5. **Add row actions** - Policy-protected actions in tables

For each task:
- ✅ Use concrete prompts with exact file paths
- ✅ Specify verification commands
- ✅ Include expected output
- ✅ List common pitfalls
- ✅ Reference `/llms.txt` for context

## What to read next

- [AI Coding Quickstart](/v7/ai-coding-quickstart) - Bootstrap workflow
- [Thunderclap Recipes](/v7/thunderclap-recipes) - Post-generation customization
- [AI-ready development guide](/v7/ai-ready-development/guide) - Review checklist
- [Thunderclap](/v7/admin-workflows/thunderclap) - Generation command reference
