---
title: AI Coding with Laravolt
---

# AI Coding with Laravolt

Laravolt v7 is designed for AI-assisted development. This quickstart shows AI agents and developers how to bootstrap a working admin module, verify it works, and customize it for production. {% .lead %}

## Prerequisites

Before starting, ensure:

- Laravel 11+ project with Laravolt v7 installed
- Database configured and migrated
- `php artisan serve` running
- Access to `/llms.txt` and `/llms-full.txt` for context

Verify installation:

```bash
php artisan laravolt:models
```

If this command runs without errors, Laravolt is ready.

## Quick bootstrap workflow

The fastest path from idea to working admin module:

### 1. Create the migration

```bash
php artisan make:migration create_products_table
```

Define the schema:

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('sku')->unique();
    $table->text('description')->nullable();
    $table->decimal('price', 10, 2);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

Run the migration:

```bash
php artisan migrate
```

### 2. Generate the module with Thunderclap

```bash
php artisan laravolt:clap --table=products --module=Product
```

This generates:

- `modules/Product/Controllers/ProductController.php`
- `modules/Product/Models/Product.php` (or enhances existing `app/Models/Product.php`)
- `modules/Product/Requests/StoreProductRequest.php`
- `modules/Product/Requests/UpdateProductRequest.php`
- `modules/Product/resources/views/` (index, create, edit, show, form)
- `modules/Product/TableView.php`
- `modules/Product/routes/web.php`
- `modules/Product/config/config.php`
- `modules/Product/ServiceProvider.php`
- `modules/Product/Tests/Feature/ProductTest.php`

### 3. Register the module

Add to `config/app.php` providers:

```php
'providers' => [
    // ...
    Modules\Product\ServiceProvider::class,
],
```

Or use auto-discovery if configured.

### 4. Verify routes

```bash
php artisan route:list --name=product
```

Expected routes:

```
GET|HEAD   product ..................... product.index
GET|HEAD   product/create .............. product.create
POST       product ..................... product.store
GET|HEAD   product/{product} ........... product.show
GET|HEAD   product/{product}/edit ...... product.edit
PUT|PATCH  product/{product} ........... product.update
DELETE     product/{product} ........... product.destroy
```

### 5. Run tests

```bash
php artisan test --filter=ProductTest
```

Generated tests verify:

- Index page loads
- Create form renders
- Store validation works
- Update validation works

### 6. Check the UI

Visit `http://localhost:8000/product` in your browser.

You should see:

- Empty product listing (Suitable table)
- "New product" button (if authorized)
- Search and sort controls

Click "New product" to test the create form.

## Using `/llms.txt` for context

When prompting an AI agent, include the documentation context:

```txt
Read /llms.txt to understand Laravolt v7 conventions.

Task: Add a "category" field to the Product module.
- Add migration for products.category_id foreign key
- Update StoreProductRequest and UpdateProductRequest validation
- Add category select field to form view
- Update ProductTable to show category name
- Add feature test for category validation
```

The agent can fetch `/llms-full.txt` for complete API reference or use the "Copy Markdown" button on specific pages.

## Common AI prompts

### Generate a new CRUD module

```txt
Generate a Laravolt v7 CRUD module for "PurchaseOrder" table.

Steps:
1. Create migration with fields: order_number (string, unique), vendor_name (string), total_amount (decimal), status (enum: draft/submitted/approved/rejected), notes (text, nullable)
2. Run migration
3. Generate module: php artisan laravolt:clap --table=purchase_orders --module=PurchaseOrder
4. Register ServiceProvider in config/app.php
5. Verify routes: php artisan route:list --name=purchase-order
6. Run tests: php artisan test --filter=PurchaseOrderTest
7. Return: generated files list, test results, route list
```

### Add validation rules

```txt
Update Product module validation:
- name: required, max 255
- sku: required, unique, max 50
- price: required, numeric, min 0
- description: nullable, max 1000

Files to modify:
- modules/Product/Requests/StoreProductRequest.php
- modules/Product/Requests/UpdateProductRequest.php

Return: updated validation rules, test command
```

### Customize the form

```txt
Customize Product form view:
- Add help text under SKU field: "Use format: PROD-XXXX"
- Make description field use textarea with 5 rows
- Add price input mask: currency format
- Group name and SKU in one row (2 columns)

File: modules/Product/resources/views/form.blade.php

Use PrelineForm API. Return: updated form code.
```

### Add table columns

```txt
Update Product listing table:
- Show: name, sku, price (formatted as currency), is_active (as badge), created_at
- Make name, sku, price sortable
- Add search on name and sku
- Add row actions: view, edit, delete (with policy check)

File: modules/Product/TableView.php

Use Suitable API. Return: updated table class.
```

## Expected file structure after generation

```
modules/Product/
├── Controllers/
│   └── ProductController.php          # Resource controller
├── Models/
│   └── Product.php                    # Eloquent model (or uses app/Models/Product.php)
├── Requests/
│   ├── StoreProductRequest.php        # Create validation
│   └── UpdateProductRequest.php       # Update validation
├── resources/views/
│   ├── index.blade.php                # List page (renders TableView)
│   ├── create.blade.php               # Create form page
│   ├── edit.blade.php                 # Edit form page
│   ├── show.blade.php                 # Detail page
│   └── form.blade.php                 # Shared form fields
├── routes/
│   └── web.php                        # Module routes
├── config/
│   └── config.php                     # Module configuration
├── Tests/Feature/
│   └── ProductTest.php                # Feature tests
├── ServiceProvider.php                # Module service provider
└── TableView.php                      # Suitable table class
```

## Verification commands

After any change, run these commands to verify:

```bash
# Check syntax
composer check-syntax

# Run static analysis
composer analyse

# Format code
composer format

# Run tests
php artisan test

# Check routes
php artisan route:list

# Clear caches
php artisan optimize:clear
```

## Common pitfalls

### 1. Module not registered

**Symptom:** Routes don't appear, views not found

**Fix:** Add `ServiceProvider` to `config/app.php` or verify auto-discovery

### 2. Validation not working

**Symptom:** Form accepts invalid data

**Fix:** Check `FormRequest` rules, ensure controller uses `StoreProductRequest` / `UpdateProductRequest`

### 3. Table not showing data

**Symptom:** Empty listing even with database records

**Fix:** Check `TableView` source query, verify model namespace, check permissions

### 4. Tests failing

**Symptom:** Generated tests fail

**Fix:** Run migrations in test environment, check `phpunit.xml` database config

## What to read next

- [Thunderclap recipes](/v7/thunderclap-recipes) — post-generation customization patterns
- [AI task patterns](/v7/ai-task-patterns) — prompt templates for common tasks
- [Forms overview](/v7/forms/overview) — PrelineForm API reference
- [Tables and listings](/v7/ui-foundation/tables) — Suitable API reference
- [AI-ready development guide](/v7/ai-ready-development/guide) — broader AI coding principles
