# Performance Optimization

Comprehensive guide to optimizing Laravolt v7 applications for production performance.

## Overview

Performance optimization areas:
- **Database:** Query optimization, indexing, eager loading
- **Caching:** Application cache, query cache, view cache
- **Assets:** Minification, compression, CDN
- **Server:** Octane, FrankenPHP, opcache
- **Monitoring:** Profiling, APM, logging

---

## Database Optimization

### Query Optimization

**Problem: N+1 Query Problem**

```php
// ❌ Bad: N+1 queries (1 + N for each product's category)
$products = Product::all();
foreach ($products as $product) {
    echo $product->category->name; // Triggers query per product
}
```

**Solution: Eager Loading**

```php
// ✅ Good: 2 queries total (1 for products, 1 for categories)
$products = Product::with('category')->get();
foreach ($products as $product) {
    echo $product->category->name;
}
```

**Verification:**
```bash
# Enable query logging in tinker
php artisan tinker
```

```php
DB::enableQueryLog();
$products = Product::with('category')->get();
dd(DB::getQueryLog()); // Should show 2 queries
```

---

### Indexing Strategy

**Add Indexes for:**
- Foreign keys (`category_id`, `user_id`)
- Frequently filtered columns (`status`, `type`)
- Unique constraints (`email`, `sku`)
- Composite indexes for multi-column filters

**Example Migration:**

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->string('sku')->unique();
    $table->string('name');
    $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
    $table->decimal('price', 10, 2);
    $table->timestamps();

    // Indexes
    $table->index('category_id'); // Foreign key
    $table->index('status'); // Frequently filtered
    $table->index(['category_id', 'status']); // Composite for common query
    $table->index('created_at'); // For sorting/pagination
});
```

**Verify Index Usage:**

```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 1 AND status = 'published';

-- MySQL
EXPLAIN SELECT * FROM products WHERE category_id = 1 AND status = 'published';
```

Look for `Index Scan` (good) vs `Seq Scan` (bad).

---

### Pagination for Large Datasets

**Problem: OFFSET Performance Degradation**

```php
// ❌ Bad: OFFSET becomes slow with large offsets
Product::paginate(20); // Page 1000 = OFFSET 20000 (slow!)
```

**Solution: Cursor Pagination**

```php
// ✅ Good: Uses WHERE id > last_id (fast at any page)
Product::orderBy('id')->cursorPaginate(20);
```

**API Response:**

```json
{
  "data": [...],
  "meta": {
    "per_page": 20,
    "next_cursor": "eyJpZCI6MTAwMCwiX3BvaW50c1RvTmV4dEl0ZW1zIjp0cnVlfQ",
    "prev_cursor": null
  }
}
```

---

### Database Connection Pooling

**For High-Traffic Applications:**

```php
// config/database.php
'mysql' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'strict' => true,
    'engine' => null,
    'options' => [
        PDO::ATTR_PERSISTENT => true, // Connection pooling
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false,
    ],
],
```

---

## Caching Strategies

### Application Cache

**Cache Expensive Operations:**

```php
use Illuminate\Support\Facades\Cache;

// ❌ Bad: Recalculate every request
$stats = [
    'total_products' => Product::count(),
    'total_orders' => Order::count(),
    'revenue' => Order::sum('total'),
];

// ✅ Good: Cache for 1 hour
$stats = Cache::remember('dashboard.stats', 3600, function () {
    return [
        'total_products' => Product::count(),
        'total_orders' => Order::count(),
        'revenue' => Order::sum('total'),
    ];
});
```

**Invalidate Cache on Changes:**

```php
class Product extends Model
{
    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('dashboard.stats');
        });

        static::deleted(function () {
            Cache::forget('dashboard.stats');
        });
    }
}
```

---

### Query Result Cache

**For Rarely-Changing Data:**

```php
// Cache categories for 24 hours
$categories = Cache::remember('categories.all', 86400, function () {
    return Category::with('children')->get();
});
```

**Cache Tags (Redis/Memcached only):**

```php
// Cache with tags for selective invalidation
Cache::tags(['products', 'category:' . $categoryId])->remember(
    "products.category.{$categoryId}",
    3600,
    fn() => Product::where('category_id', $categoryId)->get()
);

// Invalidate all product caches
Cache::tags('products')->flush();

// Invalidate specific category
Cache::tags('category:5')->flush();
```

---

### View Cache

**Cache Rendered Views:**

```php
// In controller
public function index()
{
    $products = Cache::remember('products.index', 3600, function () {
        return Product::with('category')->paginate(20);
    });

    return view('products.index', compact('products'));
}
```

**Cache Entire Response:**

```php
// routes/web.php
Route::get('/products', [ProductController::class, 'index'])
    ->middleware('cache.response:3600'); // Custom middleware
```

**Custom Cache Response Middleware:**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;

class CacheResponse
{
    public function handle($request, Closure $next, $ttl = 3600)
    {
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        $key = 'response:' . md5($request->fullUrl());

        return Cache::remember($key, $ttl, function () use ($request, $next) {
            return $next($request);
        });
    }
}
```

---

## Asset Optimization

### Vite Build Optimization

```js
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor code
                    vendor: ['alpinejs', 'axios'],
                    preline: ['preline'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
            },
        },
    },
});
```

**Build for Production:**

```bash
npm run build

# Verify output
ls -lh public/build/assets/
# Should show minified .js and .css files
```

---

### Image Optimization

**Use Laravel Intervention Image:**

```bash
composer require intervention/image
```

```php
use Intervention\Image\Facades\Image;

// Resize and optimize on upload
$image = Image::make($request->file('photo'))
    ->resize(800, null, function ($constraint) {
        $constraint->aspectRatio();
        $constraint->upsize();
    })
    ->encode('webp', 80); // Convert to WebP, 80% quality

$path = 'products/' . uniqid() . '.webp';
Storage::disk('public')->put($path, $image);
```

**Serve Optimized Images:**

```blade
<img 
    src="{{ Storage::url($product->image) }}" 
    alt="{{ $product->name }}"
    loading="lazy"
    width="800"
    height="600"
>
```

---

### CDN Integration

```php
// config/filesystems.php
'disks' => [
    'cdn' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'), // CloudFront URL
    ],
],
```

```php
// Upload to CDN
Storage::disk('cdn')->put('products/image.jpg', $imageContent);

// Get CDN URL
$url = Storage::disk('cdn')->url('products/image.jpg');
// https://cdn.example.com/products/image.jpg
```

---

## Laravel Octane

### Installation

```bash
composer require laravel/octane

# Choose Swoole or RoadRunner
php artisan octane:install --server=swoole
```

### Configuration

```php
// config/octane.php
return [
    'server' => env('OCTANE_SERVER', 'swoole'),

    'swoole' => [
        'options' => [
            'http_compression' => true,
            'http_compression_level' => 6,
            'compression_min_length' => 20,
            'open_http2_protocol' => true,
        ],
    ],

    'warm' => [
        ...['config', 'routes', 'views'],
    ],

    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],
];
```

### Running Octane

```bash
# Development
php artisan octane:start --watch

# Production
php artisan octane:start --server=swoole --host=0.0.0.0 --port=8000 --workers=4
```

### Octane-Safe Code

**❌ Avoid:**
```php
// Static properties persist across requests
class ProductController
{
    protected static $cache = []; // ❌ Shared across requests!
}
```

**✅ Use:**
```php
// Request-scoped data
class ProductController
{
    public function index(Request $request)
    {
        $cache = []; // ✅ Fresh per request
    }
}
```

---

## FrankenPHP

### Installation

```bash
# Download FrankenPHP
curl -L https://github.com/dunglas/frankenphp/releases/latest/download/frankenphp-linux-x86_64 -o frankenphp
chmod +x frankenphp

# Run
./frankenphp php-server --listen :8000
```

### Caddyfile Configuration

```caddyfile
{
    frankenphp
    order php_server before file_server
}

:8000 {
    root * public
    php_server
    encode gzip
    file_server
}
```

### Worker Mode

```php
// public/index.php (FrankenPHP worker mode)
<?php

use Illuminate\Http\Request;

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$handler = function () use ($app) {
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    
    $request = Request::capture();
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);
    
    $app->flush(); // Clear request-scoped bindings
};

// Worker mode: handle multiple requests in same process
for ($nbRequests = 0, $running = true; $running; ++$nbRequests) {
    $running = \frankenphp_handle_request($handler);
    gc_collect_cycles();
}
```

---

## Monitoring and Profiling

### Laravel Telescope (Development)

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Access: `http://localhost:8000/telescope`

**Monitor:**
- Slow queries (> 100ms)
- N+1 query detection
- Request duration
- Memory usage

---

### Laravel Debugbar (Development)

```bash
composer require barryvdh/laravel-debugbar --dev
```

Shows in browser:
- Query count and duration
- View rendering time
- Memory usage
- Route information

---

### Production APM

**Laravel Pulse:**

```bash
composer require laravel/pulse
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"
php artisan migrate
```

Access: `http://localhost:8000/pulse`

**New Relic Integration:**

```bash
composer require newrelic/newrelic-php-agent
```

```php
// config/logging.php
'channels' => [
    'newrelic' => [
        'driver' => 'monolog',
        'handler' => NewRelic\Monolog\Enricher\Handler::class,
    ],
],
```

---

## Performance Checklist

### Development
- [ ] Enable query logging to detect N+1 problems
- [ ] Use Telescope/Debugbar to profile requests
- [ ] Test with realistic data volumes
- [ ] Profile memory usage with large datasets

### Database
- [ ] Add indexes for foreign keys and filtered columns
- [ ] Use eager loading for relationships
- [ ] Implement cursor pagination for large lists
- [ ] Enable query cache for read-heavy tables

### Caching
- [ ] Cache expensive calculations (> 100ms)
- [ ] Cache rarely-changing data (categories, settings)
- [ ] Implement cache invalidation strategy
- [ ] Use Redis/Memcached for production

### Assets
- [ ] Minify CSS/JS with Vite
- [ ] Optimize images (WebP, lazy loading)
- [ ] Use CDN for static assets
- [ ] Enable gzip/brotli compression

### Server
- [ ] Use Octane or FrankenPHP for production
- [ ] Enable opcache (`opcache.enable=1`)
- [ ] Configure PHP memory limit (`memory_limit=256M`)
- [ ] Use HTTP/2 and compression

### Monitoring
- [ ] Set up APM (Pulse, New Relic, Datadog)
- [ ] Monitor slow queries (> 100ms)
- [ ] Track error rates and response times
- [ ] Set up alerts for performance degradation

---

## Benchmarking

### Apache Bench

```bash
# Test homepage performance
ab -n 1000 -c 10 http://localhost:8000/

# Results:
# Requests per second: 500 [#/sec]
# Time per request: 20 [ms] (mean)
```

### Laravel Benchmarking

```php
use Illuminate\Support\Benchmark;

Benchmark::dd([
    'Scenario 1' => fn () => Product::all(),
    'Scenario 2' => fn () => Product::with('category')->get(),
    'Scenario 3' => fn () => Cache::remember('products', 60, fn () => Product::all()),
], iterations: 100);

// Output:
// Scenario 1: 150ms
// Scenario 2: 80ms (eager loading wins)
// Scenario 3: 5ms (cache wins)
```

---

## Conclusion

Performance optimization is iterative:
1. **Measure** with profiling tools
2. **Identify** bottlenecks (queries, cache misses)
3. **Optimize** the slowest parts first
4. **Verify** improvements with benchmarks
5. **Monitor** in production

Focus on the 20% of optimizations that give 80% of the gains:
- Fix N+1 queries
- Add database indexes
- Cache expensive operations
- Use Octane/FrankenPHP
- Optimize assets

---

**Next Steps:**
- Set up Telescope: `/v7/testing/browser-testing`
- Configure caching: `/v7/reference/configuration`
- Deploy with Octane: `/v7/getting-started/installation`