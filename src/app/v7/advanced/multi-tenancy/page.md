# Multi-Tenancy Patterns

This guide covers multi-tenant architecture patterns with Laravolt v7, including tenant isolation strategies and implementation examples.

## Overview

Multi-tenancy allows a single application instance to serve multiple customers (tenants) while keeping their data isolated and secure.

**When to Use Multi-Tenancy:**
- SaaS applications serving multiple organizations
- White-label platforms with customer-specific branding
- Enterprise applications with department-level isolation
- Marketplace platforms with vendor separation

**Trade-offs:**
- ✅ Lower infrastructure costs (shared resources)
- ✅ Easier maintenance (single codebase)
- ✅ Faster feature deployment (all tenants updated simultaneously)
- ⚠️ More complex data isolation logic
- ⚠️ Potential performance impact from noisy neighbors
- ⚠️ Higher security requirements

---

## Tenant Isolation Strategies

### Strategy 1: Database Per Tenant

**Description:** Each tenant gets a dedicated database.

**Pros:**
- Complete data isolation
- Easy backup/restore per tenant
- Independent scaling
- Simpler queries (no tenant filtering)

**Cons:**
- Higher infrastructure costs
- Complex connection management
- Difficult cross-tenant reporting
- Migration overhead (N databases)

**When to Use:**
- Enterprise customers requiring data residency
- High-value tenants with custom requirements
- Strict compliance requirements (HIPAA, SOC2)

---

### Strategy 2: Shared Database with Tenant Column

**Description:** Single database with `tenant_id` column on all tables.

**Pros:**
- Lower infrastructure costs
- Easy cross-tenant analytics
- Simple connection management
- Efficient resource utilization

**Cons:**
- Risk of data leakage if queries miss tenant filter
- Complex query scoping
- Shared resource contention
- Backup/restore affects all tenants

**When to Use:**
- SMB SaaS with many small tenants
- Cost-sensitive applications
- Tenants with similar data volumes

---

### Strategy 3: Schema Per Tenant (PostgreSQL)

**Description:** Single database with separate schema per tenant.

**Pros:**
- Good data isolation
- Moderate infrastructure costs
- Easier than database-per-tenant
- Schema-level permissions

**Cons:**
- PostgreSQL-specific
- Connection pooling complexity
- Migration overhead (N schemas)

**When to Use:**
- PostgreSQL-based applications
- Medium-sized tenant base (10-100 tenants)
- Balance between isolation and cost

---

## Implementation: Shared Database Strategy

This is the most common pattern for Laravel/Laravolt applications.

### Step 1: Database Schema

```sql
-- Tenants table
CREATE TABLE tenants (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE,
    database VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_domain (domain)
);

-- Example: Products table with tenant_id
CREATE TABLE products (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant (tenant_id),
    UNIQUE KEY unique_sku_per_tenant (tenant_id, sku)
);
```

### Step 2: Tenant Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'domain',
        'database',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function scopeByDomain($query, string $domain)
    {
        return $query->where('domain', $domain);
    }

    public function scopeBySlug($query, string $slug)
    {
        return $query->where('slug', $slug);
    }
}
```

### Step 3: Tenant-Aware Base Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

abstract class TenantModel extends Model
{
    protected static function booted()
    {
        // Auto-scope all queries to current tenant
        static::addGlobalScope('tenant', function (Builder $builder) {
            if ($tenantId = self::getCurrentTenantId()) {
                $builder->where('tenant_id', $tenantId);
            }
        });

        // Auto-set tenant_id on creation
        static::creating(function ($model) {
            if (!$model->tenant_id && $tenantId = self::getCurrentTenantId()) {
                $model->tenant_id = $tenantId;
            }
        });
    }

    protected static function getCurrentTenantId(): ?int
    {
        return Auth::user()?->tenant_id ?? session('tenant_id');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

### Step 4: Product Model (Tenant-Aware)

```php
<?php

namespace App\Domains\Catalog\Models;

use App\Models\TenantModel;

class Product extends TenantModel
{
    protected $fillable = [
        'tenant_id',
        'name',
        'sku',
        'price',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Queries automatically scoped to current tenant
    // Product::all() → only current tenant's products
    // Product::find(1) → only if belongs to current tenant
}
```

### Step 5: Tenant Identification Middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        $tenant = $this->identifyTenant($request);

        if (!$tenant) {
            abort(404, 'Tenant not found');
        }

        // Store tenant in session
        session(['tenant_id' => $tenant->id]);

        // Share with views
        view()->share('currentTenant', $tenant);

        return $next($request);
    }

    protected function identifyTenant(Request $request): ?Tenant
    {
        // Strategy 1: Subdomain (tenant1.app.com)
        if ($subdomain = $this->getSubdomain($request)) {
            return Tenant::bySlug($subdomain)->first();
        }

        // Strategy 2: Custom domain (tenant1.com)
        if ($domain = $request->getHost()) {
            return Tenant::byDomain($domain)->first();
        }

        // Strategy 3: Path prefix (/tenant1/...)
        if ($slug = $request->segment(1)) {
            return Tenant::bySlug($slug)->first();
        }

        return null;
    }

    protected function getSubdomain(Request $request): ?string
    {
        $host = $request->getHost();
        $parts = explode('.', $host);

        // tenant1.app.com → tenant1
        if (count($parts) >= 3) {
            return $parts[0];
        }

        return null;
    }
}
```

Register in `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'web' => [
        // ... other middleware
        \App\Http\Middleware\IdentifyTenant::class,
    ],
];
```

---

## Thunderclap in Multi-Tenant Context

### Generate Tenant-Aware CRUD

```bash
# 1. Generate base CRUD
php artisan thunderclap:generate Product \
    --fields="name:string,sku:string,price:decimal" \
    --with-tenant

# 2. Thunderclap adds tenant_id to migration
```

Generated migration includes:

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('sku');
    $table->decimal('price', 10, 2);
    $table->timestamps();

    $table->unique(['tenant_id', 'sku']);
    $table->index('tenant_id');
});
```

Generated model extends `TenantModel`:

```php
class Product extends TenantModel
{
    // Automatically tenant-scoped
}
```

---

## Complete Example: Multi-Tenant Product Management

### Scenario
SaaS platform where each company manages their own product catalog.

### Implementation

**1. Tenant Setup**

```php
// Database seeder
$acme = Tenant::create([
    'name' => 'Acme Corp',
    'slug' => 'acme',
    'domain' => 'acme.myapp.com',
]);

$globex = Tenant::create([
    'name' => 'Globex Inc',
    'slug' => 'globex',
    'domain' => 'globex.myapp.com',
]);
```

**2. User Assignment**

```php
// Users table migration
Schema::table('users', function (Blueprint $table) {
    $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
});

// User model
class User extends Authenticatable
{
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

**3. Controller (Automatically Tenant-Scoped)**

```php
class ProductController extends Controller
{
    public function index()
    {
        // Only returns current tenant's products
        $products = Product::with('category')->paginate(20);

        return view('products.index', compact('products'));
    }

    public function store(StoreProductRequest $request)
    {
        // tenant_id automatically set by TenantModel
        $product = Product::create($request->validated());

        return redirect()->route('products.show', $product);
    }
}
```

**4. Testing Tenant Isolation**

```php
use Tests\TestCase;
use App\Models\Tenant;
use App\Models\Product;

class TenantIsolationTest extends TestCase
{
    public function test_users_only_see_their_tenant_products()
    {
        $acme = Tenant::factory()->create(['slug' => 'acme']);
        $globex = Tenant::factory()->create(['slug' => 'globex']);

        $acmeProduct = Product::factory()->create([
            'tenant_id' => $acme->id,
            'name' => 'Acme Widget',
        ]);

        $globexProduct = Product::factory()->create([
            'tenant_id' => $globex->id,
            'name' => 'Globex Gadget',
        ]);

        // Simulate Acme user
        session(['tenant_id' => $acme->id]);

        $products = Product::all();

        $this->assertCount(1, $products);
        $this->assertEquals('Acme Widget', $products->first()->name);
    }

    public function test_cannot_access_other_tenant_product()
    {
        $acme = Tenant::factory()->create();
        $globex = Tenant::factory()->create();

        $globexProduct = Product::factory()->create(['tenant_id' => $globex->id]);

        // Simulate Acme user
        session(['tenant_id' => $acme->id]);

        $product = Product::find($globexProduct->id);

        $this->assertNull($product); // Global scope filters it out
    }
}
```

---

## Security Considerations

### 1. Always Use Global Scopes

```php
// ❌ BAD: Bypasses tenant scope
DB::table('products')->where('id', $id)->first();

// ✅ GOOD: Respects tenant scope
Product::find($id);
```

### 2. Validate Tenant Ownership in Policies

```php
class ProductPolicy
{
    public function update(User $user, Product $product): bool
    {
        // Double-check tenant ownership
        return $user->tenant_id === $product->tenant_id;
    }
}
```

### 3. Prevent Tenant ID Tampering

```php
// ❌ BAD: Allows tenant_id in request
public function store(Request $request)
{
    Product::create($request->all()); // User could inject tenant_id!
}

// ✅ GOOD: Exclude tenant_id from mass assignment
protected $guarded = ['tenant_id'];

// Or explicitly set it
public function store(Request $request)
{
    $product = new Product($request->validated());
    $product->tenant_id = auth()->user()->tenant_id;
    $product->save();
}
```

### 4. Test Tenant Isolation

```bash
# Run tenant isolation test suite
php artisan test --filter=TenantIsolation
```

---

## Performance Optimization

### 1. Index tenant_id Columns

```php
$table->index('tenant_id');
$table->index(['tenant_id', 'created_at']); // For date-filtered queries
```

### 2. Partition Large Tables (MySQL 8.0+)

```sql
ALTER TABLE products
PARTITION BY HASH(tenant_id)
PARTITIONS 10;
```

### 3. Cache Per Tenant

```php
Cache::tags(['tenant:' . $tenantId, 'products'])->remember('products.list', 3600, function () {
    return Product::all();
});
```

---

## Migration from Single-Tenant

### Step 1: Add tenant_id to Existing Tables

```php
Schema::table('products', function (Blueprint $table) {
    $table->foreignId('tenant_id')->nullable()->constrained();
    $table->index('tenant_id');
});
```

### Step 2: Backfill tenant_id

```php
// Create default tenant
$defaultTenant = Tenant::create(['name' => 'Default', 'slug' => 'default']);

// Assign all existing records
DB::table('products')->update(['tenant_id' => $defaultTenant->id]);
DB::table('users')->update(['tenant_id' => $defaultTenant->id]);
```

### Step 3: Make tenant_id Required

```php
Schema::table('products', function (Blueprint $table) {
    $table->foreignId('tenant_id')->nullable(false)->change();
});
```

---

## Resources

- [Tenancy for Laravel](https://tenancyforlaravel.com/) - Popular multi-tenancy package
- [Spatie Multi-Tenancy](https://github.com/spatie/laravel-multitenancy) - Alternative package
- [Laravel Multi-Tenancy Best Practices](https://laravel-news.com/multi-tenancy)

---

**Next Steps:**
- [API Integration Patterns](/v7/advanced/api-integration)
- [Custom Generators](/v7/advanced/custom-generators)
- [Security: Access Control](/v7/security/access-control)
