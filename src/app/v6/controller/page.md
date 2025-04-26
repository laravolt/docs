---
title: Controller Best Practices
description: Writing clean, maintainable controllers in Laravel applications
nextjs:
  metadata:
    title: Controller Best Practices
    description: Learn how to implement the thin controller approach and best practices for organizing controller logic in Laravel applications.
---

Well-structured controllers are essential for maintainable Laravel applications. Following the "thin controller" approach helps keep your application's business logic organized and testable.

---

## Overview

Controllers serve as the bridge between HTTP requests and your application's business logic. They should remain focused on handling request/response interactions rather than implementing complex application logic. This separation of concerns leads to more maintainable, testable, and scalable applications.

## Core Principles

The "thin controller" philosophy is built on several key principles:

### 1. Focus on HTTP Concerns

Controllers should primarily deal with HTTP-related tasks:

- Receiving input from requests
- Coordinating with other application layers
- Returning appropriate responses
- Managing redirects and status codes

### 2. Delegate Business Logic

Complex business logic should be delegated to dedicated services or models:

```php
// ❌ Business logic in controller
public function store(Request $request)
{
    $data = $request->validate([
        'title' => 'required|max:255',
        'content' => 'required',
    ]);

    // Business logic mixed with controller code
    $post = new Post();
    $post->title = $data['title'];
    $post->content = $data['content'];
    $post->slug = Str::slug($data['title']);
    $post->user_id = auth()->id();
    $post->published_at = $request->has('publish') ? now() : null;
    $post->save();

    // More business logic
    if ($request->has('notify_subscribers')) {
        $subscribers = User::subscribers()->get();
        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber)->send(new NewPostNotification($post));
        }
    }

    return redirect()->route('posts.index')
        ->with('success', 'Post created successfully');
}

// ✅ Thin controller with delegated business logic
public function store(CreatePostRequest $request, PostService $postService)
{
    $post = $postService->create($request->validated(), $request->has('publish'));

    if ($request->has('notify_subscribers')) {
        $postService->notifySubscribers($post);
    }

    return redirect()->route('posts.index')
        ->with('success', 'Post created successfully');
}
```

## Implementation Guidelines

### Use Form Requests for Validation

Controllers should not contain form validation logic. Instead, use Laravel's Form Request classes for validation:

```php
// Controller
public function store(StorePostRequest $request)
{
    // $request is already validated
    $post = Post::create($request->validated());

    return redirect()->route('posts.show', $post)
        ->with('success', 'Post created successfully');
}

// Form Request
class StorePostRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|max:255',
            'content' => 'required',
            'category_id' => 'required|exists:categories,id',
        ];
    }

    public function messages()
    {
        return [
            'category_id.exists' => 'The selected category does not exist',
        ];
    }
}
```

### Implement Authorization

Controllers should handle authorization, typically using Laravel's policies:

```php
public function update(UpdatePostRequest $request, Post $post)
{
    $this->authorize('update', $post);

    $post->update($request->validated());

    return redirect()->route('posts.show', $post)
        ->with('success', 'Post updated successfully');
}
```

### Follow Resource Controller Pattern

Organize your controllers using Laravel's resource controller pattern:

| HTTP Verb | URI                  | Action  | Route Name    |
| --------- | -------------------- | ------- | ------------- |
| GET       | `/posts`             | index   | posts.index   |
| GET       | `/posts/create`      | create  | posts.create  |
| POST      | `/posts`             | store   | posts.store   |
| GET       | `/posts/{post}`      | show    | posts.show    |
| GET       | `/posts/{post}/edit` | edit    | posts.edit    |
| PUT/PATCH | `/posts/{post}`      | update  | posts.update  |
| DELETE    | `/posts/{post}`      | destroy | posts.destroy |

Generate a resource controller with:

```bash
php artisan make:controller PostController --resource
```

Use route registration:

```php
// routes/web.php
Route::resource('posts', PostController::class);
```

### Create Single-Action Controllers for Custom Operations

When actions don't fit the resource pattern, use single action controllers:

```php
// Single Action Controller example
class PublishPostController extends Controller
{
    public function __invoke(Post $post)
    {
        $this->authorize('publish', $post);

        $post->publish();

        return redirect()->back()->with('success', 'Post published successfully');
    }
}

// Routes
Route::post('/posts/{post}/publish', PublishPostController::class)->name('posts.publish');
```

## Advanced Patterns

### Service Classes

For complex operations that involve multiple models or external services, create dedicated service classes:

```php
// Controller remains thin
public function store(StoreOrderRequest $request, OrderService $orderService)
{
    $order = $orderService->createOrder(
        $request->validated(),
        $request->user()
    );

    return redirect()->route('orders.show', $order)
        ->with('success', 'Order placed successfully');
}

// Service class handles the complex business logic
class OrderService
{
    public function createOrder(array $data, User $user)
    {
        DB::transaction(function () use ($data, $user, &$order) {
            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total' => 0,
                'status' => 'pending',
            ]);

            // Process items
            $total = 0;
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->price * $item['quantity'];

                $orderItem = $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            // Update order total
            $order->update(['total' => $total]);

            // Check inventory
            $this->checkAndUpdateInventory($order);

            // Process payment
            $this->processPayment($order, $data['payment_method']);

            // Send notifications
            $this->sendNotifications($order);
        });

        return $order;
    }

    // Additional methods...
}
```

### Controller Namespacing

For complex applications, organize controllers in namespaces:

```txt
app/Http/Controllers/
  ├── Admin/
  │   ├── UserController.php
  │   ├── ProductController.php
  │   └── OrderController.php
  ├── Api/
  │   ├── V1/
  │   │   └── UserController.php
  │   └── V2/
  │       └── UserController.php
  └── Front/
      ├── HomeController.php
      ├── ProductController.php
      └── CartController.php
```

## Best Practices

### Keep Methods Small

Each controller method should be concise and focused on a single responsibility. If a method grows beyond 15-20 lines, consider refactoring into smaller components.

### Use Dependency Injection

Leverage Laravel's service container to inject dependencies into your controllers:

```php
class ReportController extends Controller
{
    private $reportGenerator;

    public function __construct(ReportGeneratorInterface $reportGenerator)
    {
        $this->reportGenerator = $reportGenerator;
    }

    public function generate(Request $request)
    {
        return $this->reportGenerator->generate($request->validated());
    }
}
```

### Return Appropriate Responses

Ensure your controller methods return appropriate responses based on context:

```php
public function show(Post $post)
{
    $this->authorize('view', $post);

    if (request()->wantsJson()) {
        return response()->json([
            'data' => new PostResource($post)
        ]);
    }

    return view('posts.show', compact('post'));
}
```

### Use View Models or Presenters

For complex view data preparation, consider using view models or presenters:

```php
public function show(Post $post)
{
    return view('posts.show', [
        'viewModel' => new PostViewModel($post)
    ]);
}
```

## Troubleshooting

### Controller Methods Growing Too Large

**Issue**: Controller methods become too long and complex.

**Solution**: Look for repeating patterns and extract them into services, actions, or helper methods.

### Duplicate Logic Across Controllers

**Issue**: Similar logic appears in multiple controllers.

**Solution**: Extract shared functionality into traits, base controller classes, or dedicated services.

### Controller Testing Difficulties

**Issue**: Complex controllers are difficult to test.

**Solution**: Move business logic to testable services and only test HTTP concerns in controller tests.

## Related Documentation

- [Form Requests](/v6/form)
- [Routes and Naming](/v6/routes)
- [Service Pattern](/v6/best-practices)
- [Action Classes](/v6/action-classes)
