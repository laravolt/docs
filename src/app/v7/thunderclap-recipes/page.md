---
title: Thunderclap Task Recipes
---

# Thunderclap Task Recipes

Thunderclap generates a working CRUD module, but production features need customization. This page shows practical post-generation workflows with concrete before/after examples. {% .lead %}

## Recipe format

Each recipe follows this structure:

1. **Context**: What was generated
2. **Task**: What needs to change
3. **Files to modify**: Exact paths
4. **Before**: Generated code
5. **After**: Customized code
6. **Verification**: Commands to prove it works

## Recipe 1: Add validation rules

### Context

Thunderclap generated `StoreProductRequest` and `UpdateProductRequest` with basic validation.

### Task

Add business rules:
- `name`: required, max 255, unique
- `sku`: required, max 50, unique, uppercase
- `price`: required, numeric, min 0.01
- `description`: nullable, max 1000

### Files to modify

- `modules/Product/Requests/StoreProductRequest.php`
- `modules/Product/Requests/UpdateProductRequest.php`

### Before (generated)

```php
// modules/Product/Requests/StoreProductRequest.php
public function rules(): array
{
    return [
        'name' => ['required'],
        'sku' => ['required'],
        'price' => ['required'],
        'description' => ['nullable'],
    ];
}
```

### After (customized)

```php
// modules/Product/Requests/StoreProductRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255', 'unique:products,name'],
        'sku' => ['required', 'string', 'max:50', 'unique:products,sku', 'uppercase'],
        'price' => ['required', 'numeric', 'min:0.01'],
        'description' => ['nullable', 'string', 'max:1000'],
    ];
}

// modules/Product/Requests/UpdateProductRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255', 'unique:products,name,' . $this->route('product')->id],
        'sku' => ['required', 'string', 'max:50', 'unique:products,sku,' . $this->route('product')->id, 'uppercase'],
        'price' => ['required', 'numeric', 'min:0.01'],
        'description' => ['nullable', 'string', 'max:1000'],
    ];
}
```

### Verification

```bash
# Test validation
php artisan test --filter=ProductTest

# Manual test: try creating product with duplicate SKU
# Expected: validation error "The sku has already been taken."
```

## Recipe 2: Customize table columns

### Context

Generated `ProductTable` shows all columns with basic text formatting.

### Task

Customize listing:
- Show only: name, sku, price, is_active, created_at
- Format price as currency (IDR)
- Show is_active as badge (green/red)
- Make name, sku, price sortable
- Add search on name and sku

### Files to modify

- `modules/Product/TableView.php`

### Before (generated)

```php
use Laravolt\Suitable\Columns\Text;

public function columns(): array
{
    return [
        Text::make('id'),
        Text::make('name'),
        Text::make('sku'),
        Text::make('description'),
        Text::make('price'),
        Text::make('is_active'),
        Text::make('created_at'),
        Text::make('updated_at'),
    ];
}
```

### After (customized)

```php
use Laravolt\Suitable\Columns\Text;
use Laravolt\Suitable\Columns\Boolean;
use Laravolt\Suitable\Columns\DateTime;
use Laravolt\Suitable\Columns\Number;

public function columns(): array
{
    return [
        Text::make('name', 'Product Name')->sortable(),
        Text::make('sku', 'SKU')->sortable(),
        Number::make('price', 'Price')
            ->sortable()
            ->prefix('Rp ')
            ->decimal(0),
        Boolean::make('is_active', 'Active'),
        DateTime::make('created_at', 'Created')->sortable(),
    ];
}

public function searchable(): array
{
    return ['name', 'sku'];
}
```

### Verification

```bash
# Visit listing page
php artisan serve
# Open: http://localhost:8000/product

# Check:
# - Price shows "Rp 10,000" format
# - Active shows green/red badge
# - Search box filters by name/sku
# - Column headers are clickable for sort
```

## Recipe 3: Add relationships

### Context

Product belongs to Category. Category table exists.

### Task

- Add `category_id` foreign key to products table
- Add relationship to Product model
- Show category in listing
- Add category select in form

### Files to modify

1. New migration
2. `modules/Product/Models/Product.php` (or `app/Models/Product.php`)
3. `modules/Product/TableView.php`
4. `modules/Product/resources/views/form.blade.php`
5. `modules/Product/Requests/StoreProductRequest.php`
6. `modules/Product/Requests/UpdateProductRequest.php`

### Step 1: Migration

```bash
php artisan make:migration add_category_id_to_products_table
```

```php
public function up()
{
    Schema::table('products', function (Blueprint $table) {
        $table->foreignId('category_id')->nullable()->constrained()->cascadeOnDelete();
    });
}

public function down()
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropForeign(['category_id']);
        $table->dropColumn('category_id');
    });
}
```

```bash
php artisan migrate
```

### Step 2: Add relationship to model

```php
// modules/Product/Models/Product.php
use App\Models\Category;

protected $fillable = [
    'name',
    'sku',
    'description',
    'price',
    'is_active',
    'category_id', // Add this
];

public function category()
{
    return $this->belongsTo(Category::class);
}
```

### Step 3: Show category in table

```php
// modules/Product/TableView.php
use Laravolt\Suitable\Columns\Text;

public function columns(): array
{
    return [
        Text::make('name', 'Product Name')->sortable(),
        Text::make('sku', 'SKU')->sortable(),
        Text::make('category.name', 'Category'), // Add this
        // ... other columns
    ];
}

public function query()
{
    return Product::with('category'); // Eager load
}
```

### Step 4: Add category select in form

```php
// modules/Product/resources/views/form.blade.php

{!! PrelineForm::text('name')->label('Product Name')->required() !!}
{!! PrelineForm::text('sku')->label('SKU')->required() !!}

{{-- Add this --}}
{!! PrelineForm::select('category_id', $categories)
    ->label('Category')
    ->placeholder('-- Select Category --')
    ->required() !!}

{!! PrelineForm::number('price')->label('Price')->required() !!}
{!! PrelineForm::textarea('description')->label('Description')->rows(5) !!}
{!! PrelineForm::checkbox('is_active', 1)->label('Active')->checked(old('is_active', $product->is_active ?? true)) !!}
```

### Step 5: Pass categories to view

```php
// modules/Product/Controllers/ProductController.php

public function create()
{
    $categories = \App\Models\Category::pluck('name', 'id');
    return view('product::create', compact('categories'));
}

public function edit(Product $product)
{
    $categories = \App\Models\Category::pluck('name', 'id');
    return view('product::edit', compact('product', 'categories'));
}
```

### Step 6: Update validation

```php
// modules/Product/Requests/StoreProductRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'sku' => ['required', 'string', 'max:50', 'unique:products,sku'],
        'category_id' => ['required', 'exists:categories,id'], // Add this
        'price' => ['required', 'numeric', 'min:0.01'],
        'description' => ['nullable', 'string', 'max:1000'],
        'is_active' => ['boolean'],
    ];
}
```

### Verification

```bash
# Run tests
php artisan test --filter=ProductTest

# Check routes
php artisan route:list --name=product

# Manual test:
# 1. Visit /product/create
# 2. Check category dropdown appears
# 3. Try submitting without category (should fail validation)
# 4. Create product with category
# 5. Check listing shows category name
```

## Recipe 4: Override generated views

### Context

Generated form view uses default layout. Need custom styling.

### Task

Wrap form fields in card, add section headers, use 2-column grid for name/SKU.

### Files to modify

- `modules/Product/resources/views/form.blade.php`

### Before (generated)

```blade
{!! PrelineForm::text('name')->label('Product Name')->required() !!}
{!! PrelineForm::text('sku')->label('SKU')->required() !!}
{!! PrelineForm::number('price')->label('Price')->required() !!}
{!! PrelineForm::textarea('description')->label('Description') !!}
{!! PrelineForm::checkbox('is_active', 1)->label('Active') !!}
```

### After (customized)

```blade
<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
    {{-- Basic Information --}}
    <div>
        <h3 class="text-lg font-semibold mb-4">Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!! PrelineForm::text('name')->label('Product Name')->required() !!}
            {!! PrelineForm::text('sku')
                ->label('SKU')
                ->required()
                ->help('Format: PROD-XXXX') !!}
        </div>
    </div>

    {{-- Pricing --}}
    <div>
        <h3 class="text-lg font-semibold mb-4">Pricing</h3>
        {!! PrelineForm::number('price')
            ->label('Price (IDR)')
            ->required()
            ->min(0)
            ->step(0.01) !!}
    </div>

    {{-- Details --}}
    <div>
        <h3 class="text-lg font-semibold mb-4">Details</h3>
        {!! PrelineForm::textarea('description')
            ->label('Description')
            ->rows(5)
            ->help('Maximum 1000 characters') !!}
    </div>

    {{-- Status --}}
    <div>
        <h3 class="text-lg font-semibold mb-4">Status</h3>
        {!! PrelineForm::checkbox('is_active', 1)
            ->label('Active')
            ->checked(old('is_active', $product->is_active ?? true)) !!}
    </div>
</div>
```

### Verification

```bash
# Visit create/edit pages
# Check:
# - Form is wrapped in card
# - Sections have headers
# - Name and SKU are side-by-side on desktop
# - Help text appears under fields
```

## Recipe 5: Add custom actions

### Context

Need "Duplicate" action on product listing.

### Task

Add "Duplicate" button to table row actions that copies product with new SKU.

### Files to modify

1. `modules/Product/TableView.php`
2. `modules/Product/Controllers/ProductController.php`
3. `modules/Product/routes/web.php`

### Step 1: Add route

```php
// modules/Product/routes/web.php
Route::post('product/{product}/duplicate', [ProductController::class, 'duplicate'])
    ->name('product.duplicate');
```

### Step 2: Add controller method

```php
// modules/Product/Controllers/ProductController.php
public function duplicate(Product $product)
{
    $this->authorize('create', Product::class);

    $newProduct = $product->replicate();
    $newProduct->sku = $product->sku . '-COPY-' . time();
    $newProduct->name = $product->name . ' (Copy)';
    $newProduct->save();

    return redirect()
        ->route('product.index')
        ->with('success', 'Product duplicated successfully.');
}
```

### Step 3: Add action to table

```php
// modules/Product/TableView.php
use Laravolt\Suitable\Columns\Action;

public function columns(): array
{
    return [
        // ... other columns
        Action::make('actions')
            ->label('Actions')
            ->actions(function ($row) {
                return [
                    [
                        'label' => 'View',
                        'url' => route('product.show', $row),
                    ],
                    [
                        'label' => 'Edit',
                        'url' => route('product.edit', $row),
                    ],
                    [
                        'label' => 'Duplicate',
                        'url' => route('product.duplicate', $row),
                        'method' => 'POST',
                        'confirm' => 'Duplicate this product?',
                    ],
                    [
                        'label' => 'Delete',
                        'url' => route('product.destroy', $row),
                        'method' => 'DELETE',
                        'confirm' => 'Delete this product?',
                    ],
                ];
            }),
    ];
}
```

### Verification

```bash
# Check route exists
php artisan route:list --name=product.duplicate

# Manual test:
# 1. Visit /product
# 2. Click "Duplicate" on any product
# 3. Confirm dialog appears
# 4. Check new product created with "-COPY-" suffix
```

## Common pitfalls

### 1. Forgetting to update both Store and Update requests

**Problem**: Added validation to `StoreProductRequest` but not `UpdateProductRequest`.

**Fix**: Always update both request classes with the same rules (except unique constraints).

### 2. Not eager loading relationships

**Problem**: N+1 query when showing category in product listing.

**Fix**: Add `with('category')` to table query method.

### 3. Missing authorization checks

**Problem**: Generated controller has no policy checks.

**Fix**: Add policy and `$this->authorize()` calls in controller methods.

### 4. Hardcoded values in views

**Problem**: Form has hardcoded category options.

**Fix**: Pass dynamic data from controller to view.

## AI-friendly task templates

Use these templates when prompting AI agents:

### Template: Add validation

```txt
Update [Module] validation:
- [field]: [rules]
- [field]: [rules]

Files: modules/[Module]/Requests/Store[Module]Request.php, Update[Module]Request.php
Return: updated rules, test command
```

### Template: Customize table

```txt
Update [Module] table:
- Show columns: [list]
- Format [column] as [type]
- Make [columns] sortable
- Add search on [columns]

File: modules/[Module]/TableView.php
Return: updated columns() method
```

### Template: Add relationship

```txt
Add [relationship] to [Module]:
1. Migration: add [foreign_key] to [table]
2. Model: add [relationship]() method
3. Table: show [related_field]
4. Form: add [select/input] for [relationship]
5. Validation: add [foreign_key] rules

Return: migration, model, table, form, validation changes
```

## What to read next

- [Thunderclap](/v7/admin-workflows/thunderclap) — core scaffolding concepts
- [Forms overview](/v7/forms/overview) — PrelineForm API reference
- [Tables and listings](/v7/ui-foundation/tables) — Suitable API reference
- [AI task patterns](/v7/ai-task-patterns) — prompt templates for common tasks
