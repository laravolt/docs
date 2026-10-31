# Common Issues and Troubleshooting

This guide covers common issues you may encounter when working with Laravolt v7 and provides systematic solutions.

## Installation and Setup Issues

### Issue: Composer Install Fails with Package Conflicts

**Symptom:**
```bash
composer require laravolt/laravolt
# Error: Your requirements could not be resolved to an installable set of packages.
```

**Diagnosis:**
- Laravel version incompatibility (Laravolt v7 requires Laravel 10+)
- PHP version mismatch (requires PHP 8.1+)
- Conflicting package versions in `composer.json`

**Solution:**
```bash
# 1. Check Laravel version
php artisan --version
# Expected: Laravel Framework 10.x or 11.x

# 2. Check PHP version
php -v
# Expected: PHP 8.1.0 or higher

# 3. Update composer.json constraints
composer require laravolt/laravolt --with-all-dependencies

# 4. If still failing, check for conflicts
composer why-not laravolt/laravolt
```

**Verification:**
```bash
composer show laravolt/laravolt
# Should show version 7.x.x

php artisan vendor:publish --tag=laravolt-config
# Should publish config files successfully
```

---

### Issue: Missing Service Provider After Installation

**Symptom:**
```bash
php artisan config:cache
# Error: Class 'Laravolt\LaravoltServiceProvider' not found
```

**Diagnosis:**
- Service provider not auto-discovered
- Cached config contains stale references
- Package not properly installed

**Solution:**
```bash
# 1. Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 2. Verify package installation
composer show laravolt/laravolt

# 3. Manually register provider (Laravel 10 only, if auto-discovery fails)
# Add to config/app.php:
# 'providers' => [
#     Laravolt\LaravoltServiceProvider::class,
# ]

# 4. Rebuild caches
php artisan config:cache
php artisan route:cache
```

**Verification:**
```bash
php artisan route:list | grep laravolt
# Should show Laravolt routes

php artisan config:show laravolt
# Should display Laravolt configuration
```

---

## Thunderclap Generation Issues

### Issue: Thunderclap Command Not Found

**Symptom:**
```bash
php artisan thunderclap:generate Product
# Command "thunderclap:generate" is not defined.
```

**Diagnosis:**
- Thunderclap package not installed
- Service provider not loaded
- Command not registered

**Solution:**
```bash
# 1. Verify Thunderclap is installed
composer show laravolt/thunderclap

# 2. If not installed, add it
composer require laravolt/thunderclap

# 3. Publish Thunderclap config
php artisan vendor:publish --tag=thunderclap-config

# 4. Clear caches
php artisan config:clear

# 5. Verify command is available
php artisan list | grep thunderclap
```

**Verification:**
```bash
php artisan thunderclap:generate --help
# Should show command usage and options
```

---

### Issue: Generated Files Have Wrong Namespace

**Symptom:**
Generated model has namespace `App\Models\Product` but should be `App\Domains\Product\Models\Product`.

**Diagnosis:**
- Thunderclap config not customized for domain-driven structure
- Default Laravel namespace conventions applied

**Solution:**
```bash
# 1. Edit config/thunderclap.php
# Set custom namespace patterns:
```

```php
'namespaces' => [
    'model' => 'App\\Domains\\{domain}\\Models',
    'controller' => 'App\\Domains\\{domain}\\Http\\Controllers',
    'request' => 'App\\Domains\\{domain}\\Http\\Requests',
    'resource' => 'App\\Domains\\{domain}\\Http\\Resources',
],

'paths' => [
    'model' => 'app/Domains/{domain}/Models',
    'controller' => 'app/Domains/{domain}/Http/Controllers',
    'request' => 'app/Domains/{domain}/Http/Requests',
    'resource' => 'app/Domains/{domain}/Http/Resources',
],
```

```bash
# 2. Regenerate with domain flag
php artisan thunderclap:generate Product --domain=Catalog

# 3. Verify generated files
ls -la app/Domains/Catalog/Models/
```

**Verification:**
```bash
# Check model namespace
head -n 5 app/Domains/Catalog/Models/Product.php
# Should show: namespace App\Domains\Catalog\Models;
```

---

### Issue: Migration Already Exists Error

**Symptom:**
```bash
php artisan thunderclap:generate Order
# Error: Migration already exists: create_orders_table
```

**Diagnosis:**
- Previous migration with same name exists
- Thunderclap trying to create duplicate migration

**Solution:**
```bash
# Option 1: Skip migration generation
php artisan thunderclap:generate Order --skip-migration

# Option 2: Remove old migration first
rm database/migrations/*_create_orders_table.php

# Option 3: Use different table name
php artisan thunderclap:generate Order --table=customer_orders

# Option 4: Force regeneration (overwrites existing)
php artisan thunderclap:generate Order --force
```

**Verification:**
```bash
ls -la database/migrations/ | grep orders
# Should show only one migration file
```

---

## Form Validation Issues

### Issue: Custom Validation Rule Not Working

**Symptom:**
Form submits successfully despite custom validation rule that should fail.

**Diagnosis:**
- Validation rule not registered
- Rule class not found
- Rule logic incorrect

**Solution:**
```bash
# 1. Verify rule class exists
ls -la app/Rules/

# 2. Check rule is imported in Request class
```

```php
use App\Rules\UniqueProductSku;

public function rules(): array
{
    return [
        'sku' => ['required', 'string', new UniqueProductSku($this->product)],
    ];
}
```

```bash
# 3. Test rule in isolation
php artisan tinker
```

```php
$rule = new App\Rules\UniqueProductSku(null);
$rule->passes('sku', 'TEST-001');
// Should return false if SKU exists
```

**Verification:**
```bash
# Submit form with invalid data via HTTP test
php artisan test --filter=ProductValidationTest
```

---

### Issue: Validation Messages Not Displaying

**Symptom:**
Form validation fails but no error messages appear in the UI.

**Diagnosis:**
- Blade template missing `@error` directives
- Session flash not persisting
- JavaScript intercepting form submission

**Solution:**
```bash
# 1. Check Blade template has error display
```

```blade
<input type="text" name="name" value="{{ old('name') }}">
@error('name')
    <span class="text-red-500 text-sm">{{ $message }}</span>
@enderror
```

```bash
# 2. Verify session driver is working
php artisan tinker
```

```php
session()->put('test', 'value');
session()->get('test'); // Should return 'value'
```

```bash
# 3. Check for JavaScript form hijacking
# Look for event.preventDefault() in form submit handlers

# 4. Test with PrelineForm component (recommended)
```

```blade
<x-preline-form :action="route('products.store')">
    <x-preline-input name="name" label="Product Name" required />
    <x-preline-button type="submit">Save</x-preline-button>
</x-preline-form>
```

**Verification:**
```bash
# Submit form with invalid data and check response
curl -X POST http://localhost/products \
  -d "name=" \
  -H "X-Requested-With: XMLHttpRequest"
# Should return 422 with validation errors JSON
```

---

## Asset Build Issues

### Issue: Vite Build Fails with Module Not Found

**Symptom:**
```bash
npm run build
# Error: Could not resolve '@laravolt/preline'
```

**Diagnosis:**
- NPM package not installed
- Import path incorrect
- Node modules cache stale

**Solution:**
```bash
# 1. Install Laravolt frontend assets
npm install @laravolt/preline

# 2. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Verify import path in app.js
```

```javascript
import '@laravolt/preline';
```

```bash
# 4. Rebuild assets
npm run build
```

**Verification:**
```bash
ls -la public/build/
# Should contain compiled assets

# Check browser console for errors
npm run dev
# Visit app in browser, check console
```

---

### Issue: Tailwind Classes Not Applied

**Symptom:**
Laravolt components render but have no styling.

**Diagnosis:**
- Tailwind not scanning Laravolt views
- Preline plugin not loaded
- CSS not imported

**Solution:**
```bash
# 1. Update tailwind.config.js
```

```javascript
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './vendor/laravolt/**/*.blade.php', // Add this
  ],
  plugins: [
    require('@laravolt/preline/plugin'), // Add this
  ],
}
```

```bash
# 2. Import Preline CSS in app.css
```

```css
@import '@laravolt/preline';
```

```bash
# 3. Rebuild assets
npm run build

# 4. Clear view cache
php artisan view:clear
```

**Verification:**
```bash
# Inspect compiled CSS
grep "preline" public/build/assets/*.css
# Should find Preline classes
```

---

## Database Migration Issues

### Issue: Foreign Key Constraint Fails

**Symptom:**
```bash
php artisan migrate
# SQLSTATE[HY000]: General error: 1215 Cannot add foreign key constraint
```

**Diagnosis:**
- Referenced table doesn't exist yet
- Column types don't match
- Migration order incorrect

**Solution:**
```bash
# 1. Check migration timestamps
ls -la database/migrations/ | grep -E "(users|products|orders)"

# 2. Ensure parent table migrates first
# Rename migration file to adjust order:
mv database/migrations/2024_01_15_create_orders_table.php \
   database/migrations/2024_01_16_create_orders_table.php

# 3. Verify column types match
```

```php
// Parent table (users)
$table->id(); // bigint unsigned

// Child table (orders)
$table->foreignId('user_id') // bigint unsigned - matches!
      ->constrained()
      ->cascadeOnDelete();
```

```bash
# 4. Reset and remigrate
php artisan migrate:fresh
```

**Verification:**
```bash
php artisan db:show
# Check foreign keys are created

mysql -e "SHOW CREATE TABLE orders\G"
# Should show FOREIGN KEY constraints
```

---

### Issue: Migration Rollback Fails

**Symptom:**
```bash
php artisan migrate:rollback
# Error: SQLSTATE[42S02]: Base table or view not found
```

**Diagnosis:**
- `down()` method references non-existent table
- Manual database changes broke migration state
- Migration batch tracking corrupted

**Solution:**
```bash
# 1. Check migrations table
php artisan db:table migrations

# 2. Manually fix migration state
php artisan tinker
```

```php
DB::table('migrations')->where('migration', 'like', '%orders%')->delete();
```

```bash
# 3. Fix down() method to check table existence
```

```php
public function down(): void
{
    Schema::dropIfExists('orders');
}
```

```bash
# 4. Reset migrations cleanly
php artisan migrate:fresh
```

**Verification:**
```bash
php artisan migrate:status
# All migrations should show "Ran"
```

---

## Performance and Debugging

### Issue: Slow Page Load with Suitable Tables

**Symptom:**
Table page takes 5+ seconds to load with 1000 records.

**Diagnosis:**
- Missing database indexes
- N+1 query problem
- No pagination applied

**Solution:**
```bash
# 1. Enable query logging
```

```php
DB::enableQueryLog();
// ... render table
dd(DB::getQueryLog());
```

```bash
# 2. Add indexes to frequently queried columns
```

```php
Schema::table('products', function (Blueprint $table) {
    $table->index('status');
    $table->index('category_id');
    $table->index(['status', 'created_at']);
});
```

```bash
# 3. Eager load relationships in Suitable config
```

```php
public function query(): Builder
{
    return Product::query()
        ->with(['category', 'supplier']) // Eager load
        ->select('products.*');
}
```

```bash
# 4. Ensure pagination is enabled
```

```php
public function perPage(): int
{
    return 50; // Limit results
}
```

**Verification:**
```bash
# Check query count
php artisan debugbar:clear
# Reload page, check Debugbar
# Should show < 10 queries for table render
```

---

## Getting Help

If you encounter an issue not covered here:

1. **Check logs**: `storage/logs/laravel.log`
2. **Enable debug mode**: Set `APP_DEBUG=true` in `.env`
3. **Run diagnostics**:
   ```bash
   php artisan about
   php artisan config:show laravolt
   ```
4. **Search documentation**: Use `/llms.txt` index
5. **Community support**: GitHub Issues, Discord, or Laravel forums

---

## Quick Diagnostic Commands

```bash
# System health check
php artisan about

# Clear all caches
php artisan optimize:clear

# Verify Laravolt installation
composer show laravolt/*

# Check routes
php artisan route:list | grep laravolt

# Database status
php artisan migrate:status

# View compiled config
php artisan config:show laravolt

# Test database connection
php artisan db:show
```
