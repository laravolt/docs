# Configuration Reference

Complete reference for Laravolt v7 configuration files, environment variables, and service provider settings.

## Core Laravolt Configuration

### `config/laravolt.php`

Main Laravolt configuration file.

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    | Used in UI components, emails, and notifications.
    */
    'app_name' => env('LARAVOLT_APP_NAME', config('app.name')),

    /*
    |--------------------------------------------------------------------------
    | Default Timezone
    |--------------------------------------------------------------------------
    | Used for date/time display in UI components.
    */
    'timezone' => env('LARAVOLT_TIMEZONE', 'Asia/Jakarta'),

    /*
    |--------------------------------------------------------------------------
    | Locale Settings
    |--------------------------------------------------------------------------
    */
    'locale' => [
        'default' => env('LARAVOLT_LOCALE', 'id'),
        'available' => ['id', 'en'],
        'fallback' => 'en',
    ],

    /*
    |--------------------------------------------------------------------------
    | UI Theme
    |--------------------------------------------------------------------------
    | Preline-based theme configuration.
    */
    'theme' => [
        'primary_color' => env('LARAVOLT_PRIMARY_COLOR', '#3b82f6'), // blue-500
        'dark_mode' => env('LARAVOLT_DARK_MODE', false),
        'layout' => env('LARAVOLT_LAYOUT', 'sidebar'), // sidebar|topbar
    ],

    /*
    |--------------------------------------------------------------------------
    | Menu Configuration
    |--------------------------------------------------------------------------
    */
    'menu' => [
        'cache' => env('LARAVOLT_MENU_CACHE', true),
        'cache_ttl' => env('LARAVOLT_MENU_CACHE_TTL', 3600), // seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Asset Configuration
    |--------------------------------------------------------------------------
    */
    'assets' => [
        'version' => env('LARAVOLT_ASSET_VERSION', '1.0.0'),
        'cdn' => env('LARAVOLT_CDN_URL', null),
    ],
];
```

**Environment Variables:**
```bash
LARAVOLT_APP_NAME="My Application"
LARAVOLT_TIMEZONE="Asia/Jakarta"
LARAVOLT_LOCALE="id"
LARAVOLT_PRIMARY_COLOR="#3b82f6"
LARAVOLT_DARK_MODE=false
LARAVOLT_LAYOUT="sidebar"
LARAVOLT_MENU_CACHE=true
LARAVOLT_MENU_CACHE_TTL=3600
LARAVOLT_ASSET_VERSION="1.0.0"
LARAVOLT_CDN_URL=null
```

---

## Thunderclap Configuration

### `config/thunderclap.php`

Thunderclap code generator configuration.

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Default Namespace Configuration
    |--------------------------------------------------------------------------
    | Define where generated files should be placed.
    */
    'namespaces' => [
        'model' => 'App\\Models',
        'controller' => 'App\\Http\\Controllers',
        'request' => 'App\\Http\\Requests',
        'resource' => 'App\\Http\\Resources',
        'factory' => 'Database\\Factories',
        'seeder' => 'Database\\Seeders',
        'test' => 'Tests\\Feature',
    ],

    /*
    |--------------------------------------------------------------------------
    | File Paths
    |--------------------------------------------------------------------------
    | Corresponding filesystem paths for namespaces.
    */
    'paths' => [
        'model' => 'app/Models',
        'controller' => 'app/Http/Controllers',
        'request' => 'app/Http/Requests',
        'resource' => 'app/Http/Resources',
        'migration' => 'database/migrations',
        'factory' => 'database/factories',
        'seeder' => 'database/seeders',
        'test' => 'tests/Feature',
        'view' => 'resources/views',
    ],

    /*
    |--------------------------------------------------------------------------
    | Stub Templates
    |--------------------------------------------------------------------------
    | Custom stub file locations.
    */
    'stubs' => [
        'model' => resource_path('stubs/thunderclap/model.stub'),
        'migration' => resource_path('stubs/thunderclap/migration.stub'),
        'controller' => resource_path('stubs/thunderclap/controller.stub'),
        'request' => resource_path('stubs/thunderclap/request.stub'),
        'resource' => resource_path('stubs/thunderclap/resource.stub'),
        'factory' => resource_path('stubs/thunderclap/factory.stub'),
        'test' => resource_path('stubs/thunderclap/test.stub'),
        'view' => resource_path('stubs/thunderclap/view.stub'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Generation Options
    |--------------------------------------------------------------------------
    */
    'options' => [
        'soft_deletes' => env('THUNDERCLAP_SOFT_DELETES', true),
        'timestamps' => env('THUNDERCLAP_TIMESTAMPS', true),
        'factory' => env('THUNDERCLAP_FACTORY', true),
        'seeder' => env('THUNDERCLAP_SEEDER', false),
        'test' => env('THUNDERCLAP_TEST', true),
        'api_resource' => env('THUNDERCLAP_API_RESOURCE', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Domain-Driven Design Support
    |--------------------------------------------------------------------------
    */
    'domain' => [
        'enabled' => env('THUNDERCLAP_DOMAIN_ENABLED', false),
        'base_path' => 'app/Domains',
        'namespace' => 'App\\Domains',
    ],

    /*
    |--------------------------------------------------------------------------
    | Code Style
    |--------------------------------------------------------------------------
    */
    'style' => [
        'indent' => 'spaces', // spaces|tabs
        'indent_size' => 4,
        'line_length' => 120,
        'psr12' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Post-Generation Hooks
    |--------------------------------------------------------------------------
    | Commands to run after generation.
    */
    'hooks' => [
        'after_generate' => [
            // 'php artisan ide-helper:models',
            // 'php artisan test',
        ],
    ],
];
```

**Environment Variables:**
```bash
THUNDERCLAP_SOFT_DELETES=true
THUNDERCLAP_TIMESTAMPS=true
THUNDERCLAP_FACTORY=true
THUNDERCLAP_SEEDER=false
THUNDERCLAP_TEST=true
THUNDERCLAP_API_RESOURCE=false
THUNDERCLAP_DOMAIN_ENABLED=false
```

---

## Suitable (Table Builder) Configuration

### `config/suitable.php`

Data table configuration.

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Default Table Settings
    |--------------------------------------------------------------------------
    */
    'defaults' => [
        'per_page' => env('SUITABLE_PER_PAGE', 25),
        'per_page_options' => [10, 25, 50, 100],
        'sortable' => true,
        'searchable' => true,
        'filterable' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | UI Configuration
    |--------------------------------------------------------------------------
    */
    'ui' => [
        'theme' => 'preline', // preline|tailwind|bootstrap
        'icons' => 'heroicons', // heroicons|fontawesome|bootstrap
        'responsive' => true,
        'sticky_header' => env('SUITABLE_STICKY_HEADER', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance
    |--------------------------------------------------------------------------
    */
    'performance' => [
        'cache_queries' => env('SUITABLE_CACHE_QUERIES', false),
        'cache_ttl' => env('SUITABLE_CACHE_TTL', 300), // seconds
        'lazy_load' => env('SUITABLE_LAZY_LOAD', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Export Options
    |--------------------------------------------------------------------------
    */
    'export' => [
        'enabled' => env('SUITABLE_EXPORT_ENABLED', true),
        'formats' => ['csv', 'xlsx', 'pdf'],
        'max_rows' => env('SUITABLE_EXPORT_MAX_ROWS', 10000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Search Configuration
    |--------------------------------------------------------------------------
    */
    'search' => [
        'min_length' => env('SUITABLE_SEARCH_MIN_LENGTH', 3),
        'debounce' => env('SUITABLE_SEARCH_DEBOUNCE', 300), // milliseconds
        'highlight' => env('SUITABLE_SEARCH_HIGHLIGHT', true),
    ],
];
```

**Environment Variables:**
```bash
SUITABLE_PER_PAGE=25
SUITABLE_STICKY_HEADER=false
SUITABLE_CACHE_QUERIES=false
SUITABLE_CACHE_TTL=300
SUITABLE_LAZY_LOAD=true
SUITABLE_EXPORT_ENABLED=true
SUITABLE_EXPORT_MAX_ROWS=10000
SUITABLE_SEARCH_MIN_LENGTH=3
SUITABLE_SEARCH_DEBOUNCE=300
SUITABLE_SEARCH_HIGHLIGHT=true
```

---

## PrelineForm Configuration

### `config/preline-form.php`

Form builder configuration.

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Default Form Settings
    |--------------------------------------------------------------------------
    */
    'defaults' => [
        'method' => 'POST',
        'theme' => 'preline',
        'layout' => 'vertical', // vertical|horizontal|inline
        'label_position' => 'top', // top|left|floating
    ],

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */
    'validation' => [
        'show_errors' => env('PRELINE_FORM_SHOW_ERRORS', true),
        'error_position' => 'below', // below|above|tooltip
        'required_indicator' => '*',
        'live_validation' => env('PRELINE_FORM_LIVE_VALIDATION', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Input Masking
    |--------------------------------------------------------------------------
    */
    'masking' => [
        'enabled' => env('PRELINE_FORM_MASKING_ENABLED', true),
        'library' => 'imask', // imask|cleave
        'presets' => [
            'phone' => '+62 000-0000-0000',
            'currency' => 'Rp 0.000.000',
            'date' => 'DD/MM/YYYY',
            'time' => 'HH:MM',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | File Uploads
    |--------------------------------------------------------------------------
    */
    'uploads' => [
        'max_size' => env('PRELINE_FORM_MAX_UPLOAD_SIZE', 10240), // KB
        'allowed_types' => ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
        'preview' => env('PRELINE_FORM_UPLOAD_PREVIEW', true),
        'drag_drop' => env('PRELINE_FORM_DRAG_DROP', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | WYSIWYG Editor
    |--------------------------------------------------------------------------
    */
    'editor' => [
        'enabled' => env('PRELINE_FORM_EDITOR_ENABLED', true),
        'library' => 'tiptap', // tiptap|quill|tinymce
        'toolbar' => ['bold', 'italic', 'link', 'bulletList', 'orderedList'],
    ],
];
```

**Environment Variables:**
```bash
PRELINE_FORM_SHOW_ERRORS=true
PRELINE_FORM_LIVE_VALIDATION=false
PRELINE_FORM_MASKING_ENABLED=true
PRELINE_FORM_MAX_UPLOAD_SIZE=10240
PRELINE_FORM_UPLOAD_PREVIEW=true
PRELINE_FORM_DRAG_DROP=true
PRELINE_FORM_EDITOR_ENABLED=true
```

---

## Access Control Configuration

### `config/laravolt-acl.php`

Role-based access control configuration.

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Table Names
    |--------------------------------------------------------------------------
    */
    'tables' => [
        'roles' => 'roles',
        'permissions' => 'permissions',
        'role_user' => 'role_user',
        'permission_role' => 'permission_role',
    ],

    /*
    |--------------------------------------------------------------------------
    | Model Classes
    |--------------------------------------------------------------------------
    */
    'models' => [
        'role' => \Laravolt\Acl\Models\Role::class,
        'permission' => \Laravolt\Acl\Models\Permission::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    */
    'cache' => [
        'enabled' => env('LARAVOLT_ACL_CACHE', true),
        'ttl' => env('LARAVOLT_ACL_CACHE_TTL', 3600), // seconds
        'key_prefix' => 'laravolt.acl',
    ],

    /*
    |--------------------------------------------------------------------------
    | Super Admin
    |--------------------------------------------------------------------------
    */
    'super_admin' => [
        'enabled' => env('LARAVOLT_SUPER_ADMIN_ENABLED', true),
        'role_name' => 'super-admin',
    ],

    /*
    |--------------------------------------------------------------------------
    | Middleware
    |--------------------------------------------------------------------------
    */
    'middleware' => [
        'role' => \Laravolt\Acl\Middleware\RoleMiddleware::class,
        'permission' => \Laravolt\Acl\Middleware\PermissionMiddleware::class,
    ],
];
```

**Environment Variables:**
```bash
LARAVOLT_ACL_CACHE=true
LARAVOLT_ACL_CACHE_TTL=3600
LARAVOLT_SUPER_ADMIN_ENABLED=true
```

---

## Common Configuration Patterns

### Pattern 1: Environment-Specific Settings

```php
// config/laravolt.php
return [
    'debug' => env('LARAVOLT_DEBUG', config('app.debug')),
    
    'cache' => [
        'enabled' => env('APP_ENV') === 'production',
        'driver' => env('LARAVOLT_CACHE_DRIVER', 'redis'),
    ],
    
    'logging' => [
        'level' => env('APP_ENV') === 'production' ? 'error' : 'debug',
    ],
];
```

### Pattern 2: Feature Flags

```php
// config/laravolt.php
return [
    'features' => [
        'dark_mode' => env('FEATURE_DARK_MODE', false),
        'export_pdf' => env('FEATURE_EXPORT_PDF', true),
        'api_access' => env('FEATURE_API_ACCESS', false),
        'multi_tenancy' => env('FEATURE_MULTI_TENANCY', false),
    ],
];
```

```php
// Usage in code
if (config('laravolt.features.dark_mode')) {
    // Enable dark mode UI
}
```

### Pattern 3: Dynamic Configuration

```php
// app/Providers/AppServiceProvider.php
public function boot()
{
    // Override config from database
    if (Schema::hasTable('settings')) {
        $settings = \App\Models\Setting::pluck('value', 'key');
        
        config([
            'laravolt.app_name' => $settings['app_name'] ?? config('laravolt.app_name'),
            'laravolt.theme.primary_color' => $settings['primary_color'] ?? config('laravolt.theme.primary_color'),
        ]);
    }
}
```

### Pattern 4: Multi-Environment .env

```bash
# .env.local (development)
LARAVOLT_DEBUG=true
LARAVOLT_CACHE_ENABLED=false
SUITABLE_CACHE_QUERIES=false

# .env.staging
LARAVOLT_DEBUG=true
LARAVOLT_CACHE_ENABLED=true
SUITABLE_CACHE_QUERIES=true

# .env.production
LARAVOLT_DEBUG=false
LARAVOLT_CACHE_ENABLED=true
SUITABLE_CACHE_QUERIES=true
LARAVOLT_CDN_URL="https://cdn.example.com"
```

---

## Service Provider Configuration

### Registering Custom Providers

```php
// config/app.php
'providers' => [
    // ...
    App\Providers\LaravoltCustomizationProvider::class,
],
```

### Custom Provider Example

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravolt\Thunderclap\Thunderclap;

class LaravoltCustomizationProvider extends ServiceProvider
{
    public function boot()
    {
        // Customize Thunderclap stubs
        Thunderclap::useStub('model', resource_path('stubs/custom-model.stub'));
        
        // Add custom menu items
        \Laravolt\Menu\MenuBuilder::macro('addCustomItems', function () {
            $this->add('Custom', route('custom.index'))
                ->icon('heroicon-o-star')
                ->active('custom/*');
        });
        
        // Override default views
        $this->loadViewsFrom(resource_path('views/vendor/laravolt'), 'laravolt');
    }

    public function register()
    {
        // Merge custom config
        $this->mergeConfigFrom(
            base_path('config/laravolt-custom.php'),
            'laravolt'
        );
    }
}
```

---

## Configuration Validation

### Artisan Command for Config Check

```bash
php artisan config:show laravolt
php artisan config:show thunderclap
php artisan config:show suitable
```

### Custom Validation Command

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ValidateLaravoltConfig extends Command
{
    protected $signature = 'laravolt:validate-config';
    protected $description = 'Validate Laravolt configuration';

    public function handle()
    {
        $this->info('Validating Laravolt configuration...');

        $errors = [];

        // Check required configs
        if (empty(config('laravolt.app_name'))) {
            $errors[] = 'laravolt.app_name is not set';
        }

        if (!in_array(config('laravolt.theme.layout'), ['sidebar', 'topbar'])) {
            $errors[] = 'laravolt.theme.layout must be "sidebar" or "topbar"';
        }

        // Check file paths exist
        $paths = config('thunderclap.paths');
        foreach ($paths as $key => $path) {
            if (!is_dir(base_path($path))) {
                $errors[] = "Directory does not exist: {$path}";
            }
        }

        if (empty($errors)) {
            $this->info('✅ Configuration is valid');
            return 0;
        }

        $this->error('❌ Configuration errors found:');
        foreach ($errors as $error) {
            $this->line("  - {$error}");
        }

        return 1;
    }
}
```

---

## Quick Reference

### Essential Environment Variables

```bash
# Core
APP_NAME="My App"
APP_ENV=production
APP_DEBUG=false

# Laravolt
LARAVOLT_APP_NAME="${APP_NAME}"
LARAVOLT_TIMEZONE="Asia/Jakarta"
LARAVOLT_LOCALE="id"

# Thunderclap
THUNDERCLAP_SOFT_DELETES=true
THUNDERCLAP_TIMESTAMPS=true
THUNDERCLAP_FACTORY=true
THUNDERCLAP_TEST=true

# Suitable
SUITABLE_PER_PAGE=25
SUITABLE_CACHE_QUERIES=true

# PrelineForm
PRELINE_FORM_SHOW_ERRORS=true
PRELINE_FORM_MASKING_ENABLED=true

# ACL
LARAVOLT_ACL_CACHE=true
LARAVOLT_SUPER_ADMIN_ENABLED=true
```

### Configuration Commands

```bash
# View configuration
php artisan config:show laravolt
php artisan config:show thunderclap

# Clear configuration cache
php artisan config:clear

# Cache configuration (production)
php artisan config:cache

# Publish vendor configs
php artisan vendor:publish --tag=laravolt-config
php artisan vendor:publish --tag=thunderclap-config

# Validate configuration
php artisan laravolt:validate-config
```

---

## Next Steps

- **Troubleshooting:** [Common Issues](/v7/troubleshooting/common-issues)
- **Performance:** [Performance Optimization](/v7/reference/performance)
- **Advanced:** [Multi-Tenancy](/v7/advanced/multi-tenancy)
- **API:** [API Integration](/v7/advanced/api-integration)