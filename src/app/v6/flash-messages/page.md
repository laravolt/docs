---
title: Flash Messages
description: Displaying temporary notifications and feedback to users
nextjs:
  metadata:
    title: Flash Messages (Toast) in Laravolt
    description: How to implement and customize flash messages to provide user feedback in your Laravolt applications
---

Flash messages provide immediate feedback to users about the result of their actions. Laravolt automatically detects validation errors and session messages with specific keys, transforming them into visually appealing toast notifications.

---

## Overview

Flash messages (sometimes called toast notifications) are temporary notifications that appear briefly to inform users about the result of their actions, such as successful form submission, validation errors, or important information they should be aware of. Laravolt provides a streamlined system for implementing these notifications with minimal effort.

![Flash Message Example](https://cdn.statically.io/gh/laravolt/storage/master/2021/10/flash-messages-example.png)

## Basic Usage

Laravolt's flash message system is designed to work seamlessly with Laravel's built-in session and validation mechanisms. Here's how to use it:

### Form Validation Messages

When form validation fails, Laravolt automatically displays the error messages as flash notifications without requiring any additional code:

```php
// In your controller
public function store(Request $request)
{
    $request->validate([
        'start_date_project' => 'required',
        'end_date_project' => 'required',
        'maintenance_date' => 'required',
    ]);

    // Process form submission if validation passes
    // ...
}
```

The validation errors will be automatically converted to flash messages.

### Session Flash Messages

For general notifications across redirects, use Laravel's session flash functionality with specific message types:

```php
// In your controller
return redirect()->to('home')->with('info', 'Welcome back');
return redirect()->to('home')->with('success', 'Profile updated');
return redirect()->to('home')->with('warning', 'Please complete your profile');
return redirect()->to('home')->with('error', 'Sorry, dashboard not available right now');
```

Each message type (`info`, `success`, `warning`, `error`) has a distinctive style, making it easy for users to understand the nature of the notification.

### Current Request Messages

If you need to display flash messages during the current request (without redirecting), use the `session()->now()` method:

```php
public function index()
{
    session()->now('info', 'Welcome back');
    session()->now('success', 'Profile updated');
    session()->now('warning', 'Please complete your profile');
    session()->now('error', 'Sorry, dashboard not available right now');

    return view('home');
}
```

## Installation/Setup

The flash message system is automatically configured during Laravolt installation. The middleware `Laravolt\Middleware\DetectFlashMessage` is added to the `web` middleware group in `app/Http/Kernel.php`.

If you're not seeing flash messages, verify that this middleware is properly registered:

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'web' => [
        // ...other middleware
        \Laravolt\Middleware\DetectFlashMessage::class,
        // ...other middleware
    ],
    // ...
];
```

## Advanced Features

### Message Duration Control

You can control how long flash messages remain visible before automatically disappearing:

```php
// In your .env file
LARAVOLT_FLASH_DURATION=5000  // Duration in milliseconds (5 seconds)
```

### Customizing Flash Messages

To customize the appearance and behavior of flash messages, you can publish the related assets:

```bash
php artisan vendor:publish --tag=laravolt-flash
```

This will copy the necessary files to your application, allowing you to modify:

- Message templates
- Animation effects
- Positioning
- Icons used for each message type

## Best Practices

1. **Be Concise**: Keep flash messages short and to the point.
2. **Use Appropriate Types**: Use the correct message type to convey the right context:
   - `success` for successful operations
   - `error` for failed operations or errors
   - `warning` for cautionary messages
   - `info` for general informational messages
3. **Don't Overuse**: Flash messages should only be used for important notifications. Too many messages can become annoying to users.
4. **Include Actionable Information**: When applicable, include information about what the user can or should do next.

## Troubleshooting

### Flash Messages Not Appearing

If flash messages aren't appearing when expected:

1. Verify the `DetectFlashMessage` middleware is registered correctly.
2. Check your browser's console for JavaScript errors.
3. Ensure you're using the correct session keys: `info`, `success`, `warning`, or `error`.
4. Confirm that your application's session configuration is correct.

### Messages Disappearing Too Quickly/Slowly

If flash messages are disappearing too quickly or lingering too long:

- Adjust the `LARAVOLT_FLASH_DURATION` configuration value in your `.env` file.

## Related Components/Features

- [Form Validation](/v6/form) - Learn more about form handling and validation
- [UI Components](/v6/ui-components) - Explore other Laravolt UI components
- [Layouts](/v6/layouts) - Understand how flash messages fit into page layouts
