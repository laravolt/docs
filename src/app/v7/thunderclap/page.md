---
title: Thunderclap
description: Lightning-fast CRUD generator for Laravel - Generate complete, production-ready modules from database tables in seconds
---

⚡ **Lightning-fast CRUD generator for Laravel** - Generate complete, production-ready modules from database tables in seconds. {% .lead %}

---

## What is Thunderclap?

Thunderclap is an intelligent code generator that creates complete CRUD modules from your database tables. It analyzes your database schema and generates:

- 📋 **Models** with automatic traits (AutoFilter, AutoSearch, AutoSort)
- 🎮 **Controllers** with full CRUD operations
- 👁️ **Views** using modern Preline UI and Tailwind CSS
- ✅ **Form Requests** with validation rules
- 🧪 **Tests** with factories and test cases
- 🗺️ **Routes** with proper middleware and naming
- 📦 **Service Providers** with menu registration

### Key Features

- ⚡ **Instant CRUD Generation** - Complete module in seconds
- 🧠 **Smart Model Detection** - Auto-discovers existing models
- 🔄 **Model Enhancement** - Adds required traits and properties to existing models
- 🎨 **Modern UI** - Uses Preline UI components with Tailwind CSS
- 📦 **Modular Structure** - Generates organized, self-contained modules
- 🔍 **Multiple Templates** - Customizable stub templates
- 🎯 **Type-Safe** - PHP 8.2+ with strict types
- 🧪 **Test-Ready** - Includes factories and test cases

---

## Installation

Thunderclap is included with Laravolt by default. If you need to install it separately:

```bash
composer require laravolt/thunderclap
```

### Requirements

| Requirement | Version |
|------------|---------|
| **PHP** | `>= 8.2` |
| **Laravel** | `^10.0 \|\| ^11.0 \|\| ^12.0` |
| **Doctrine DBAL** | `^3.0` |
| **Laravolt Suitable** | For AutoFilter, AutoSearch, AutoSort traits |

### Optional Dependencies

```bash
# For code formatting (recommended)
composer require laravel/pint --dev
```

---

## Quick Start

### Basic CRUD Generation

Generate a complete CRUD module from a database table:

```bash
# Interactive mode - choose from available tables
php artisan laravolt:clap

# Generate from specific table
php artisan laravolt:clap --table=users

# Generate with custom module name
php artisan laravolt:clap --table=users --module=UserManagement
```

### What Gets Generated

```
modules/
└── User/
    ├── Controllers/
    │   └── UserController.php
    ├── Models/
    │   ├── User.php
    │   └── UserFactory.php
    ├── Requests/
    │   ├── Store.php
    │   └── Update.php
    ├── Tests/
    │   └── UserTest.php
    ├── resources/
    │   └── views/
    │       ├── index.blade.php
    │       ├── create.blade.php
    │       ├── edit.blade.php
    │       ├── show.blade.php
    │       └── _form.blade.php
    ├── routes/
    │   └── web.php
    ├── config/
    │   └── user.php
    ├── ServiceProvider.php
    └── UserTableView.php
```

---

## Core Concepts

### Module-Based Architecture

Thunderclap generates **self-contained modules** in the `modules/` directory:

```
modules/
├── Product/          # Product module
│   ├── Controllers/
│   ├── Models/
│   ├── resources/
│   └── ServiceProvider.php
└── Category/         # Category module
    ├── Controllers/
    ├── Models/
    ├── resources/
    └── ServiceProvider.php
```

Each module is:
- ✅ Self-contained and independent
- ✅ Easy to understand and maintain
- ✅ Simple to move or share
- ✅ Follows consistent structure

### Smart Model Detection

Thunderclap intelligently detects existing models:

```bash
# Detects models in app/Models/
php artisan laravolt:models

# Output:
# ┌─────────┬──────────────┬─────────┬─────────────┬────────────┐
# │ Model   │ Class        │ Table   │ Auto Traits │ Searchable │
# ├─────────┼──────────────┼─────────┼─────────────┼────────────┤
# │ User    │ App\Models\… │ users   │ ❌          │ ❌         │
# │ Product │ App\Models\… │ products│ ✅          │ ✅         │
# └─────────┴──────────────┴─────────┴─────────────┴────────────┘
```

**Detection Logic:**
1. Checks for model in `app/Models/{ModelName}.php`
2. Verifies model uses the correct table
3. Checks for required traits (AutoFilter, AutoSearch, AutoSort)
4. Checks for `$searchableColumns` property
5. Suggests enhancements if needed

### Automatic Model Enhancement

Thunderclap can enhance existing models:

```php
// Before Enhancement
class User extends Model
{
    protected $table = 'users';
}

// After Enhancement (automatic)
class User extends Model
{
    use AutoFilter, AutoSearch, AutoSort, HasFactory;
    
    protected $table = 'users';
    
    /** @var array<string> */
    protected $searchableColumns = ["name", "email"];
    
    protected static function newFactory()
    {
        return UserFactory::new();
    }
}
```

**Enhancement includes:**
- ✅ Required traits (AutoFilter, AutoSearch, AutoSort)
- ✅ HasFactory trait
- ✅ Searchable columns based on table schema
- ✅ Factory method
- ✅ Automatic backup before changes

---

## Commands

### `laravolt:clap` - Generate CRUD Module

Main command for generating CRUD modules from database tables.

#### Syntax

```bash
php artisan laravolt:clap [options]
```

#### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--table=` | Specify table name | `--table=users` |
| `--module=` | Custom module name | `--module=UserManagement` |
| `--template=` | Template to use | `--template=custom` |
| `--force` | Overwrite existing files | `--force` |
| `--use-existing-models` | Auto-enhance existing models | `--use-existing-models` |

#### Interactive Mode

When run without options, launches interactive mode:

```bash
php artisan laravolt:clap

# Step 1: Choose table
Choose table:
  [0] categories
  [1] products
  [2] users
> 2

# Step 2: Existing model detected
⚠️  Existing model detected: App\Models\User

How would you like to proceed?
  [enhance] Enhance existing model
  [create] Create new model in module
  [skip] Skip model generation
> enhance

# Step 3: Generation
Creating modules directory...
Generating code from /path/to/stubs to /path/to/modules/User
✓ Running code style fix...
✓ Successfully enhanced existing model

🎉 Module generation completed!
```

#### Examples

```bash
# Basic generation (interactive)
php artisan laravolt:clap

# Generate from specific table
php artisan laravolt:clap --table=products

# Use existing model automatically
php artisan laravolt:clap --table=users --use-existing-models

# Custom module name
php artisan laravolt:clap --table=user_profiles --module=Profile

# Force overwrite
php artisan laravolt:clap --table=products --force

# Custom template
php artisan laravolt:clap --table=products --template=api
```

### `laravolt:models` - List Models

List all models and their enhancement status.

#### Syntax

```bash
php artisan laravolt:models [options]
```

#### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--table=` | Show model for specific table | `--table=users` |

#### Examples

```bash
# List all models
php artisan laravolt:models

# Output:
# Found 5 model(s):
# 
# ┌──────────┬──────────────────┬──────────┬─────────────┬────────────┐
# │ Model    │ Class            │ Table    │ Auto Traits │ Searchable │
# ├──────────┼──────────────────┼──────────┼─────────────┼────────────┤
# │ User     │ App\Models\User  │ users    │ ✅          │ ✅         │
# │ Product  │ App\Models\Pro…  │ products │ ❌          │ ❌         │
# │ Category │ App\Models\Cat…  │ categor… │ ✅          │ ❌         │
# └──────────┴──────────────────┴──────────┴─────────────┴────────────┘
# 
# Legend:
#   Auto Traits: AutoFilter, AutoSearch, AutoSort
#   Searchable: Has $searchableColumns property

# Check specific table
php artisan laravolt:models --table=users

# Output:
# ✓ Model found: App\Models\User
#   Path: /path/to/app/Models/User.php
#   Table: users
# 
# Enhancement Status:
#   ✓ All required traits present
#   ✓ Has searchableColumns property
```

---

## Generated Code Examples

### Controller

**`UserController.php`**:
```php
class UserController
{
    public function index(): View
    {
        return view('user::index');
    }

    public function create(): View
    {
        return view('user::create');
    }

    public function store(Store $request): RedirectResponse
    {
        User::create($request->validated());
        return to_route('modules::user.index')->withSuccess('User saved');
    }

    public function show(User $user): View
    {
        return view('user::show', compact('user'));
    }

    public function edit(User $user): View
    {
        return view('user::edit', compact('user'));
    }

    public function update(Update $request, User $user): RedirectResponse
    {
        $user->update($request->validated());
        return to_route('modules::user.index')->withSuccess('User updated');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();
        return to_route('modules::user.index')->withSuccess('User deleted');
    }
}
```

### Model

**`User.php`**:
```php
class User extends Model
{
    use AutoFilter, AutoSearch, AutoSort, HasFactory;

    protected $table = 'users';
    
    protected $guarded = [];

    /** @var array<string> */
    protected $searchableColumns = ["name", "email", "username"];

    protected static function newFactory()
    {
        return UserFactory::new();
    }
}
```

### View

**`index.blade.php`**:
```blade
<x-volt-app title="{{ __('User') }}" :isShowTitleBar="false">
    <div class="flex justify-between items-center gap-x-3">
        <h1 class="font-semibold text-xl text-gray-800 dark:text-neutral-200">
            {{ __('User') }}
        </h1>

        <div class="flex justify-end items-center gap-x-2">
            <x-volt-link-button 
                icon="plus" 
                :url="route('modules::user.create')" 
                :label="__('laravolt::action.add')" />
        </div>
    </div>

    @livewire(\Modules\User\UserTableView::class)
</x-volt-app>
```

---

## Configuration

### Publishing Configuration

```bash
php artisan vendor:publish --provider="Laravolt\Thunderclap\ServiceProvider" --tag="config"
```

This creates `config/laravolt/thunderclap.php`.

### Configuration Options

```php
// config/laravolt/thunderclap.php

return [
    // Columns to exclude from generation
    'columns' => [
        'except' => ['id', 'created_at', 'updated_at', 'deleted_at', 'remember_token'],
    ],

    // View configuration
    'view' => [
        'extends' => 'layout',  // Base layout to extend
    ],

    // Route configuration
    'routes' => [
        'prefix' => 'modules::',      // Route name prefix
        'middleware' => [],           // Default middleware
    ],

    // Module configuration
    'namespace' => 'Modules',         // Root namespace for modules
    'target_dir' => base_path('modules'),  // Where to generate modules

    // Transformer (customizes code generation)
    'transformer' => Laravolt\Thunderclap\LaravoltTransformer::class,

    // Files that need module name prefix
    'prefixed' => [
        'ServiceProvider.php',
        'Controller.php',
        'TableView.php',
        'Resource.php',
    ],

    // Default template
    'default' => 'laravolt',

    // Available templates
    'templates' => [
        'laravolt' => 'laravolt',
        // Add custom templates here
    ],
];
```

---

## Advanced Usage

### Using Existing Models

#### Auto-Enhance Mode

Automatically enhance existing models without prompts:

```bash
php artisan laravolt:clap --table=users --use-existing-models
```

This will:
1. Detect the existing `App\Models\User`
2. Automatically enhance it with required traits
3. Add searchable columns
4. Generate module files
5. Use the existing model instead of creating a new one

#### Manual Enhancement Choice

Without `--use-existing-models`, you'll get a choice menu:

```bash
php artisan laravolt:clap --table=users

# Prompts:
⚠️  Existing model detected: App\Models\User

How would you like to proceed?
  [enhance] Enhance existing model
  [create] Create new model in module
  [skip] Skip model generation
```

**Options:**
- **enhance**: Adds traits and properties to existing model
- **create**: Creates new model in module directory
- **skip**: Uses existing model as-is, no changes

### Working with Foreign Keys

Thunderclap handles foreign keys intelligently:

**Database Schema:**
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    category_id BIGINT,        -- Foreign key detected
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

Foreign keys (ending with `_id`) are:
- ✅ Excluded from searchable columns
- ✅ Excluded from detail views
- ✅ Excluded from factory generation
- ✅ Can be included in forms manually

### Multiple Modules

Generate multiple modules in one workflow:

```bash
# Generate for multiple tables
php artisan laravolt:clap --table=categories
php artisan laravolt:clap --table=products  
php artisan laravolt:clap --table=orders

# Result:
modules/
├── Category/
├── Product/
└── Order/
```

---

## Best Practices

### 1. Database First Approach

Design your database schema first, then generate:

```sql
-- 1. Create migrations
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    category_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 2. Run migrations
php artisan migrate

-- 3. Generate CRUD
php artisan laravolt:clap --table=products
```

### 2. Use Model Detection

Always check for existing models first:

```bash
# Before generation
php artisan laravolt:models

# If model exists
php artisan laravolt:clap --table=users --use-existing-models

# If no model exists
php artisan laravolt:clap --table=products
```

### 3. Code Review After Generation

Generated code is a starting point. Review and customize:

```php
// 1. Review validation rules
// Requests/Store.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'price' => ['required', 'numeric', 'min:0'],
        // Add custom rules
        'sku' => ['required', 'unique:products,sku'],
    ];
}

// 2. Customize relationships
// Models/Product.php
public function category()
{
    return $this->belongsTo(Category::class);
}

// 3. Add accessors/mutators
public function getPriceFormattedAttribute()
{
    return '$' . number_format($this->price, 2);
}
```

### 4. Version Control

Commit generated modules to version control:

```bash
git add modules/
git commit -m "feat: add Product module"
```

### 5. Test Generated Code

Always test generated modules:

```bash
# Run tests
php artisan test

# Or specific test
php artisan test modules/Product/Tests/ProductTest.php
```

---

## Troubleshooting

### Common Issues

#### Module Directory Already Exists

**Error:**
```
Folder /path/to/modules/Product already exist, do you want to overwrite it?
```

**Solutions:**
```bash
# Option 1: Use --force flag
php artisan laravolt:clap --table=products --force

# Option 2: Manually delete
rm -rf modules/Product

# Option 3: Rename existing
mv modules/Product modules/Product.backup
```

#### Table Not Found

**Error:**
```
Table 'database.products' doesn't exist
```

**Solutions:**
```bash
# Check if migrations are run
php artisan migrate

# Check database connection
php artisan db:show

# List available tables
php artisan laravolt:clap
```

#### Doctrine DBAL Issues

**Error:**
```
Class 'Doctrine\DBAL\DriverManager' not found
```

**Solution:**
```bash
composer require doctrine/dbal
```

#### Routes Not Working

**Issue:** Generated routes return 404

**Solutions:**

Register module service provider in `config/app.php`:
```php
'providers' => [
    // ...
    Modules\Product\ProductServiceProvider::class,
],
```

Or use auto-discovery in `composer.json`:
```json
{
    "extra": {
        "laravel": {
            "providers": [
                "Modules\\Product\\ProductServiceProvider"
            ]
        }
    }
}
```

#### Views Not Found

**Error:**
```
View [product::index] not found
```

**Solutions:**
```bash
# Clear view cache
php artisan view:clear
```

### Getting Help

If issues persist:

1. **Check Laravel Logs**: `storage/logs/laravel.log`
2. **Enable Debug Mode**: Set `APP_DEBUG=true` in `.env`
3. **Check Permissions**: Ensure `modules/` is writable
4. **Clear Caches**:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

---

## Real-World Examples

### Example 1: E-commerce Product Management

**Database Schema:**
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

**Generate Module:**
```bash
php artisan laravolt:clap --table=products
```

**Customize After Generation:**

```php
// Models/Product.php - Add relationships
public function category()
{
    return $this->belongsTo(Category::class);
}

public function orderItems()
{
    return $this->hasMany(OrderItem::class);
}

// Add scopes
public function scopeActive($query)
{
    return $query->where('is_active', true);
}

public function scopeInStock($query)
{
    return $query->where('stock', '>', 0);
}
```

### Example 2: Blog Post Management

**Database Schema:**
```sql
CREATE TABLE posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id BIGINT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featured_image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

**Generate Module:**
```bash
php artisan laravolt:clap --table=posts --module=BlogPost
```

**Customizations:**

```php
// Models/BlogPost.php
protected $casts = [
    'published_at' => 'datetime',
];

public function author()
{
    return $this->belongsTo(User::class, 'author_id');
}

public function scopePublished($query)
{
    return $query->where('status', 'published')
        ->whereNotNull('published_at')
        ->where('published_at', '<=', now());
}

public function scopeDraft($query)
{
    return $query->where('status', 'draft');
}
```

---

## Related Resources

- **[Laravolt Suitable](https://github.com/laravolt/laravolt/tree/main/packages/suitable)** - Provides AutoFilter, AutoSearch, AutoSort traits
- **[Laravolt Preline Form](https://github.com/laravolt/laravolt/tree/main/packages/preline-form)** - Form builder used in generated views
- **[Laravel Documentation](https://laravel.com/docs)** - Official Laravel documentation

---

Made with ⚡ by [Laravolt](https://laravolt.dev)
