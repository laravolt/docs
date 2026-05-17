# API Integration Patterns

This guide covers RESTful API patterns with Laravolt v7, including authentication, resources, and exposing Thunderclap-generated CRUD as APIs.

## Overview

Laravolt applications can expose APIs for:
- Mobile applications
- Third-party integrations
- Microservices communication
- Headless CMS scenarios
- Webhook consumers

**Key Principles:**
- Use Laravel Sanctum for authentication
- Transform data with API Resources
- Version your APIs (`/api/v1/...`)
- Rate limit to prevent abuse
- Document with OpenAPI/Swagger

---

## Authentication with Sanctum

### Step 1: Install and Configure Sanctum

```bash
# Install Sanctum
composer require laravel/sanctum

# Publish config
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Run migrations
php artisan migrate
```

### Step 2: Configure API Authentication

```php
// config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    'guard' => ['web'],

    'expiration' => null, // Tokens never expire (or set minutes)

    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

### Step 3: Add Sanctum to User Model

```php
<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens;

    // ... existing code
}
```

### Step 4: Create Token Issuance Endpoint

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### Step 5: Define API Routes

```php
// routes/api.php
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
```

### Step 6: Test Authentication

```bash
# Login and get token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password",
    "device_name": "mobile-app"
  }'

# Response:
# {
#   "token": "1|abc123...",
#   "user": { ... }
# }

# Use token for authenticated requests
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer 1|abc123..."
```

---

## API Resources and Transformers

### Step 1: Generate API Resource

```bash
php artisan make:resource ProductResource
php artisan make:resource ProductCollection
```

### Step 2: Define Resource Transformation

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'price' => [
                'amount' => $this->price,
                'currency' => 'USD',
                'formatted' => '$' . number_format($this->price, 2),
            ],
            'description' => $this->description,
            'stock' => $this->stock_quantity,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'links' => [
                'self' => route('api.products.show', $this->id),
                'category' => route('api.categories.show', $this->category_id),
            ],
        ];
    }
}
```

### Step 3: Define Collection Resource

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'last_page' => $this->lastPage(),
            ],
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
        ];
    }
}
```

---

## Exposing Thunderclap CRUD as API

### Step 1: Generate Thunderclap Resources

```bash
# Generate full CRUD with API support
php artisan thunderclap:generate Product \
  --fields="name:string,sku:string:unique,price:decimal,description:text" \
  --api
```

This generates:
- `app/Domains/Product/Models/Product.php`
- `app/Domains/Product/Http/Controllers/ProductController.php`
- `app/Domains/Product/Http/Controllers/Api/ProductApiController.php`
- `app/Domains/Product/Http/Resources/ProductResource.php`
- `app/Domains/Product/Http/Requests/StoreProductRequest.php`
- `app/Domains/Product/Http/Requests/UpdateProductRequest.php`

### Step 2: API Controller (Generated)

```php
<?php

namespace App\Domains\Product\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domains\Product\Models\Product;
use App\Domains\Product\Http\Requests\StoreProductRequest;
use App\Domains\Product\Http\Requests\UpdateProductRequest;
use App\Domains\Product\Http\Resources\ProductResource;
use App\Domains\Product\Http\Resources\ProductCollection;

class ProductApiController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images'])
            ->paginate(15);

        return new ProductCollection($products);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        return new ProductResource($product);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'images']);

        return new ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }
}
```

### Step 3: Define API Routes

```php
// routes/api.php
use App\Domains\Product\Http\Controllers\Api\ProductApiController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductApiController::class);
});
```

### Step 4: Test API Endpoints

```bash
# List products (paginated)
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer {token}"

# Create product
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99,
    "description": "High-performance laptop"
  }'

# Get single product
curl http://localhost:8000/api/products/1 \
  -H "Authorization: Bearer {token}"

# Update product
curl -X PUT http://localhost:8000/api/products/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "price": 1299.99
  }'

# Delete product
curl -X DELETE http://localhost:8000/api/products/1 \
  -H "Authorization: Bearer {token}"
```

---

## Rate Limiting

### Step 1: Configure Rate Limits

```php
// app/Providers/RouteServiceProvider.php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

protected function configureRateLimiting()
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('api-strict', function (Request $request) {
        return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
    });
}
```

### Step 2: Apply Rate Limiting

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('products', ProductApiController::class);
});

// Stricter limits for expensive operations
Route::middleware(['auth:sanctum', 'throttle:api-strict'])->group(function () {
    Route::post('/products/bulk-import', [ProductApiController::class, 'bulkImport']);
});
```

### Step 3: Handle Rate Limit Exceeded

```php
// app/Exceptions/Handler.php
use Illuminate\Http\Exceptions\ThrottleRequestsException;

public function render($request, Throwable $exception)
{
    if ($exception instanceof ThrottleRequestsException) {
        return response()->json([
            'message' => 'Too many requests. Please try again later.',
            'retry_after' => $exception->getHeaders()['Retry-After'] ?? 60,
        ], 429);
    }

    return parent::render($request, $exception);
}
```

---

## API Versioning

### Strategy 1: URL Versioning (Recommended)

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductApiController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('products', ProductV2ApiController::class);
});
```

### Strategy 2: Header Versioning

```php
// app/Http/Middleware/ApiVersion.php
public function handle(Request $request, Closure $next)
{
    $version = $request->header('Accept-Version', 'v1');
    
    config(['api.version' => $version]);
    
    return $next($request);
}
```

---

## Complete Example: Product API with Laravolt

### Generate Resources

```bash
# Generate Thunderclap CRUD with API
php artisan thunderclap:generate Product \
  --fields="name:string,sku:string:unique,price:decimal,stock_quantity:integer,description:text" \
  --relationships="belongsTo:Category" \
  --api \
  --resource
```

### API Routes

```php
// routes/api.php
use App\Domains\Product\Http\Controllers\Api\ProductApiController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::apiResource('products', ProductApiController::class);
    
    // Custom endpoints
    Route::get('/products/{product}/stock', [ProductApiController::class, 'checkStock']);
    Route::post('/products/{product}/restock', [ProductApiController::class, 'restock']);
});
```

### Custom API Methods

```php
// app/Domains/Product/Http/Controllers/Api/ProductApiController.php
public function checkStock(Product $product)
{
    return response()->json([
        'sku' => $product->sku,
        'stock_quantity' => $product->stock_quantity,
        'in_stock' => $product->stock_quantity > 0,
        'low_stock' => $product->stock_quantity < 10,
    ]);
}

public function restock(Request $request, Product $product)
{
    $request->validate([
        'quantity' => 'required|integer|min:1',
    ]);

    $product->increment('stock_quantity', $request->quantity);

    return new ProductResource($product->fresh());
}
```

### Test Complete Flow

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password","device_name":"test"}' \
  | jq -r '.token')

# 2. Create product
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99,
    "stock_quantity": 50,
    "description": "High-performance laptop"
  }'

# 3. Check stock
curl http://localhost:8000/api/v1/products/1/stock \
  -H "Authorization: Bearer $TOKEN"

# 4. Restock
curl -X POST http://localhost:8000/api/v1/products/1/restock \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 25}'

# 5. List all products
curl http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer $TOKEN"
```

---

## Best Practices

### 1. Always Use API Resources
Transform models before returning to ensure consistent structure and hide internal fields.

### 2. Validate All Input
Use Form Requests for validation, even in APIs.

### 3. Return Proper HTTP Status Codes
- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### 4. Implement Pagination
Always paginate list endpoints to prevent performance issues.

### 5. Document Your API
Use tools like Scribe or L5-Swagger to generate API documentation.

```bash
composer require knuckleswtf/scribe
php artisan scribe:generate
```

### 6. Version Your API
Use URL versioning (`/api/v1/...`) for clarity and backward compatibility.

### 7. Secure Sensitive Operations
Require additional authentication (2FA, confirmation) for destructive actions.

---

## Verification Commands

```bash
# Test authentication
php artisan test --filter=AuthenticationTest

# Test API endpoints
php artisan test --filter=ProductApiTest

# Check routes
php artisan route:list --path=api

# Verify rate limiting
php artisan tinker
>>> RateLimiter::for('api', fn() => Limit::perMinute(60));
```

---

## Next Steps

- [Custom Generators](/v7/advanced/custom-generators) - Extend Thunderclap for API-specific patterns
- [Performance Optimization](/v7/reference/performance) - Optimize API response times
- [Security Best Practices](/v7/security/access-control) - Secure your APIs

---

**Related:**
- [Thunderclap Overview](/v7/admin-workflows/thunderclap)
- [Form Validation](/v7/forms/validation)
- [Access Control](/v7/security/access-control)
