---
title: Naming Conventions
description: Consistent naming practices for Laravel applications
nextjs:
  metadata:
    title: Naming Conventions
    description: Learn the standard naming conventions for variables, classes, files, and database elements in Laravel applications.
---

Consistent naming conventions are crucial for maintaining readability and collaboration in software projects. Following these guidelines will help you create code that is easier to understand, maintain, and extend.

---

## Overview

As the saying goes, "There are only two hard things in Computer Science: cache invalidation and naming things." While we can't make naming easier, we can establish consistent patterns that improve code readability and reduce cognitive load when working on Laravel projects.

## General Principles

Good names should be:

- **Descriptive** - clearly communicate purpose and intent
- **Concise** - as short as possible without sacrificing clarity
- **Consistent** - follow established patterns throughout the project
- **Contextual** - consider where and how the name will be used

## Naming Standards by Category

### Code Elements

| Element          | Convention              | Examples                                                 |
| ---------------- | ----------------------- | -------------------------------------------------------- |
| Variables        | camelCase               | `$userId`, `$totalAmount`, `$isActive`                   |
| Class properties | camelCase               | `private $accessToken`, `protected $createdAt`           |
| Class methods    | camelCase               | `getFullName()`, `calculateTotal()`, `featuredArticle()` |
| Global helpers   | snake_case              | `format_rupiah()`, `convert_date()`                      |
| Classes          | StudlyCase (nouns)      | `User`, `PaymentGateway`, `UserProfile`                  |
| Interfaces       | StudlyCase (adjectives) | `Authenticatable`, `Reportable`                          |
| Traits           | StudlyCase (adjectives) | `Notifiable`, `Searchable`                               |

### Controllers

| Type                      | Convention                       | Examples                                                                      |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| Resource controllers      | StudlyCase (noun + `Controller`) | `UserController`, `ProductController`, `BukuTamuController`                   |
| Single action controllers | StudlyCase (verb + `Controller`) | `ClearCacheController`, `LogoutController`, `DownloadLaporanHarianController` |

### Files and Paths

| Type          | Convention                         | Examples                                             |
| ------------- | ---------------------------------- | ---------------------------------------------------- |
| View files    | kebab-case                         | `user-profile.blade.php`, `laporan-harian.blade.php` |
| Partial views | kebab-case with leading underscore | `_header.blade.php`, `_tabel-pegawai.blade.php`      |
| Config files  | kebab-case                         | `app.php`, `dynamic-form.php`                        |
| Config keys   | snake_case                         | `'allowed_types' => ['text', 'textarea']`            |

### Routing

| Element          | Convention                                         | Examples                              |
| ---------------- | -------------------------------------------------- | ------------------------------------- |
| Route URLs       | kebab-case                                         | `https://example.com/laporan-harian`  |
| Route names      | kebab-case with dot separating resource and action | `lowongan-kerja.index`, `user.create` |
| Route parameters | camelCase                                          | `{userId}`, `{lowonganKerja}`         |

### Database

| Element        | Convention                                 | Examples                                |
| -------------- | ------------------------------------------ | --------------------------------------- |
| Table names    | snake_case (plural nouns)                  | `users`, `blog_posts`, `order_items`    |
| Grouped tables | Prefixed snake_case                        | `master_provinsi`, `master_kabupaten`   |
| Pivot tables   | Singular model names in alphabetical order | `role_user`, `permission_role`          |
| Column names   | snake_case                                 | `first_name`, `created_at`, `is_active` |
| Primary keys   | `id`                                       | `id`                                    |
| Foreign keys   | Singular model name with `_id` suffix      | `user_id`, `post_id`                    |

### Commands and Jobs

| Element          | Convention        | Examples                               |
| ---------------- | ----------------- | -------------------------------------- |
| Artisan commands | kebab-case        | `php artisan generate-laporan`         |
| Command classes  | StudlyCase        | `GenerateLaporanCommand`               |
| Jobs             | StudlyCase (verb) | `ProcessPayment`, `SendReminderEmails` |

## Best Practices

### Be Consistent

Consistency is more important than the specific convention chosen. If you're joining an existing project, follow its established conventions even if they differ from these guidelines.

### Use Descriptive Names

Avoid abbreviations and single-letter variables except in very limited contexts (like loop counters). Names should be self-explanatory:

```php
// Poor naming
$u = User::find(1);
$r = $u->roles;
$p = [];
foreach ($r as $i) {
    $p[] = $i->permissions;
}

// Better naming
$user = User::find(1);
$roles = $user->roles;
$permissions = [];
foreach ($roles as $role) {
    $permissions[] = $role->permissions;
}
```

### Consider Search-ability

Names should be distinct enough to allow for effective code searching:

```php
// Hard to search for
$data = User::all();

// Better - unique and searchable
$activeUsers = User::where('status', 'active')->get();
```

### Use Domain Language

Align your naming with the domain language of your project:

```php
// Generic naming
$items = Order::find(1)->products;

// Domain-specific naming
$lineItems = Order::find(1)->products;
```

## Common Pitfalls

### Avoid Multiple Standards

Don't mix naming conventions for the same type of elements:

```php
// Inconsistent
$user_id = 1;
$orderID = 100;
$productId = 25;

// Consistent (choose one style)
$userId = 1;
$orderId = 100;
$productId = 25;
```

### Don't Reflect Type in Name

Modern IDEs provide type information, so don't include types in names:

```php
// Unnecessary
$usersArray = User::all()->toArray();
$nameString = $user->name;

// Better
$users = User::all()->toArray();
$name = $user->name;
```

### Avoid Unnecessary Context

Don't repeat the context that's already clear:

```php
// Redundant context
class User {
    public function getUserName() {...}
    public function getUserEmail() {...}
}

// Better
class User {
    public function name() {...}
    public function email() {...}
}
```

## Troubleshooting

### Resolving Naming Conflicts

When you encounter naming conflicts:

1. Consider adding more specific context
2. Use namespaces to separate identical names in different contexts
3. Refactor to better represent the domain concepts

### Managing Legacy Code

When working with legacy code that doesn't follow these conventions:

1. Follow existing patterns for modifications to maintain consistency
2. Create style guides for new code
3. Refactor incrementally when possible

## Related Documentation

- [Code Style Guide](/v6/code-quality)
- [Laravel Routes](/v6/routes)
- [Laravel Controllers](/v6/controller)
