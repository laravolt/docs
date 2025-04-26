---
title: Laravel Route Best Practices
description: Effective routing strategies and conventions for Laravel applications
nextjs:
  metadata:
    title: Laravel Route Best Practices
    description: Learn about Laravel routing best practices, naming conventions, and advanced route organization techniques.
---

Laravel's routing system provides an elegant and expressive way to define application routes. Following consistent naming conventions and best practices ensures your application remains maintainable as it grows.

---

## Overview

Routes define the entry points to your application, connecting URLs to controller actions. Implementing a consistent routing strategy improves code organization, readability, and makes your application easier to maintain over time.

## Route Naming Conventions

Consistency in naming routes and URLs helps maintain a clean codebase and improves developer experience. Follow these conventions for best results:

| Element         | Convention           | Good Examples              | Poor Examples                                             |
| --------------- | -------------------- | -------------------------- | --------------------------------------------------------- |
| **URL Paths**   | singular, kebab-case | `/laporan-harian`          | `/laporanHarian`<br />`/laporan_harian`                   |
| **Route Names** | singular, kebab-case | `->name("laporan-harian")` | `->name("laporanHarian")`<br />`->name("laporan_harian")` |

## RESTful Resource Routes

Laravel provides a convenient way to define RESTful routes that map to standard CRUD operations. Always follow these seven standard REST actions for consistency:

| HTTP Verb | URI                 | Controller Action | Route Name   |
| :-------- | :------------------ | :---------------- | :----------- |
| GET       | `/user`             | index             | user.index   |
| GET       | `/user/create`      | create            | user.create  |
| POST      | `/user`             | store             | user.store   |
| GET       | `/user/{user}`      | show              | user.show    |
| GET       | `/user/{user}/edit` | edit              | user.edit    |
| PUT/PATCH | `/user/{user}`      | update            | user.update  |
| DELETE    | `/user/{user}`      | destroy           | user.destroy |

### Explicit Route Definition

You can define resource routes explicitly:

```php
Route::get('/user', 'UserController@index')->name('user.index');
Route::get('/user/create', 'UserController@create')->name('user.create');
Route::post('/user', 'UserController@store')->name('user.store');
Route::get('/user/{user}', 'UserController@show')->name('user.show');
Route::get('/user/{user}/edit', 'UserController@edit')->name('user.edit');
Route::put('/user/{user}', 'UserController@update')->name('user.update');
Route::delete('/user/{user}', 'UserController@destroy')->name('user.destroy');
```

### Implicit Resource Routes

Laravel provides a shorthand for defining all seven RESTful routes in a single line:

```php
Route::resource('user', 'UserController');
```

## Advanced Routing Strategies

When your application requires additional actions beyond the standard RESTful routes, consider these approaches:

### Feature-Based Controllers

For actions that don't fit into the seven standard RESTful methods, create dedicated controllers that focus on a specific feature while still adhering to RESTful conventions.

#### Example: Managing User Passwords

❌ **Avoid creating non-standard action names**:

```php
// Bad: "editPassword" and "updatePassword" are not standard REST actions
Route::get('/user/{user}/password', 'UserController@editPassword');
Route::put('/user/{user}/password', 'UserController@updatePassword');
```

✅ **Create feature-specific controllers**:

```php
// Good: Using dedicated controller with standard REST verbs
Route::get('/user/{user}/password', 'UserPasswordController@edit');
Route::put('/user/{user}/password', 'UserPasswordController@update');
```

✅ **Or use nested controllers**:

```php
// Also good: Using nested namespace approach
Route::get('/user/{user}/password', 'User\\PasswordController@edit');
Route::put('/user/{user}/password', 'User\\PasswordController@update');
```

### Example: Displaying User Followers

❌ **Avoid non-standard controller methods**:

```php
// Bad: "follower" is not a standard REST action
Route::get('/user/{user}/follower', 'UserController@follower');
```

✅ **Use resource-specific controllers**:

```php
// Good: Using composite controller name with standard REST verb
Route::get('/user/{user}/follower', 'UserFollowerController@index');
```

✅ **Or use nested controllers**:

```php
// Also good: Using nested namespace approach
Route::get('/user/{user}/follower', 'User\\FollowerController@index');
```

## Single Action Controllers

Single Action Controllers are ideal for standalone operations that:

1. Don't fit into standard CRUD operations
2. Can be called from multiple places in your application
3. Relate to pivot tables or many-to-many relationships
4. Represent atomic actions with clear, singular purposes

### When to Use Single Action Controllers

Consider using Single Action Controllers for these common scenarios:

- File uploads
- Password reset workflows
- Cache management operations
- Post-login landing pages
- Authentication actions (logout)
- Toggleable actions (like/unlike, follow/unfollow)

### Implementation Example

```php
namespace App\Http\Controllers;

class DownloadInvoiceController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        // Authorization logic
        $this->authorize('download', $invoice);

        // Processing logic
        $pdf = $this->generateInvoicePdf($invoice);

        // Return response
        return response()->download($pdf);
    }
}
```

Route definition:

```php
Route::get('/invoices/{invoice}/download', DownloadInvoiceController::class);
```

## Best Practices

- **Be consistent** with your route naming throughout your application
- **Use route groups** to apply middleware, prefixes, or namespaces to related routes
- **Leverage route model binding** to automatically inject models into your routes
- **Name all routes** to make them easier to reference in views and controllers
- **Avoid hardcoding URLs** in your views - use the `route()` helper instead
- **Keep controllers focused** on specific resources or features
- **Use route caching** in production to improve performance

## Troubleshooting

### Common Routing Issues

| Issue                       | Solution                                                       |
| --------------------------- | -------------------------------------------------------------- |
| Route not found (404)       | Check route definition and ensure correct HTTP verb is used    |
| Method not allowed (405)    | Verify that you're using the correct HTTP method for the route |
| Route parameter conflicts   | Place more specific routes before wildcard routes              |
| Controller method not found | Verify namespace and method name in route definition           |

### Route Caching Issues

If your application behaves differently after running `php artisan route:cache`:

1. Check for route definitions using closures (they can't be cached)
2. Ensure all controller classes exist and are correctly namespaced
3. Clear the route cache with `php artisan route:clear` and try again

## Related Documentation

- [Laravel Routing](/v6/basics)
- [Controller Organization](/v6/controller)
- [Middleware](/v6/middleware)
- [Authentication](/v6/authentication)
