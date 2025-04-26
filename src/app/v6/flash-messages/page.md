---
title: Flash Messages
description: Elegant toast notifications for Laravel applications
nextjs:
  metadata:
    title: Flash Messages
    description: Learn how to implement and customize flash messages (toast notifications) in your Laravel applications using Laravolt.
---

Flash messages provide contextual feedback to users about their actions and system events. Laravolt's flash message system automatically detects validation errors and session flash messages to display elegant toast notifications.

---

## Overview

Flash messages (also known as toast notifications) are temporary messages that appear after user actions or system events to provide immediate feedback. They typically disappear after a few seconds or can be manually dismissed by the user.

Laravolt provides a seamless integration with Laravel's session and validation systems to automatically display these notifications with minimal configuration.

## Installation

Flash message functionality is included by default in Laravolt. During the Laravolt installation process, the middleware `Laravolt\Middleware\DetectFlashMessage` is automatically added to the `web` middleware group in your application's `app/Http/Kernel.php` file.

To verify that it's properly installed, check your middleware configuration:

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'web' => [
        // ... other middleware
        \Laravolt\Middleware\DetectFlashMessage::class,
        // ... other middleware
    ],
];
```

## Basic Usage

### Form Validation Messages

One of the most common uses for flash messages is displaying form validation errors. Laravolt automatically detects Laravel validation errors and displays them as flash messages without requiring any additional code.

```php
public function store(Request $request)
{
    // Validation errors will automatically be displayed as flash messages
    $request->validate([
        'name' => 'required|min:3',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
    ]);

    // Process the validated data...
    User::create($request->all());

    return redirect()->route('users.index');
}
```

### Session Flash Messages

For more explicit control, you can set flash messages directly in your controller by using Laravel's session flash methods. These messages will be displayed on the next request, making them perfect for use with redirects.

```php
public function update(Request $request, User $user)
{
    $user->update($request->validated());

    // Flash message will be displayed after redirection
    return redirect()
        ->route('users.index')
        ->with('success', 'User profile updated successfully');
}
```

### Available Message Types

Laravolt supports four types of messages, each with distinctive styling to convey different levels of information:

| Type      | Purpose                         | Example                                             |
| --------- | ------------------------------- | --------------------------------------------------- |
| `info`    | General information             | `->with('info', 'Welcome back, John')`              |
| `success` | Successful operations           | `->with('success', 'Profile updated successfully')` |
| `warning` | Warnings that require attention | `->with('warning', 'Please complete your profile')` |
| `error`   | Errors that prevented an action | `->with('error', 'Unable to connect to server')`    |

## Advanced Features

### Current Request Flash Messages

Sometimes, you may want to display a flash message for the current request instead of waiting for the next request. You can do this using Laravel's `session()->now()` method:

```php
public function dashboard()
{
    // These messages will be displayed immediately
    session()->now('info', 'Welcome to your dashboard');

    if (!auth()->user()->hasCompletedProfile()) {
        session()->now('warning', 'Please complete your profile information');
    }

    return view('dashboard');
}
```

### Multiple Messages

You can set multiple flash messages of different types, and all will be displayed:

```php
return redirect()->route('home')
    ->with('success', 'Your settings have been saved')
    ->with('info', 'You might want to check out our new features');
```

### HTML Content in Messages

By default, flash messages support plain text only. If you need to include HTML in your messages, you'll need to customize the flash message template.

## Customization

### Message Duration

You can modify how long flash messages stay visible before automatically dismissing by publishing and editing the Laravolt configuration:

```bash
php artisan vendor:publish --tag=laravolt-config
```

Then edit the `config/laravolt/ui.php` file:

```php
'flash' => [
    'display_duration' => 5000, // Duration in milliseconds
],
```

### Message Templates

To customize the appearance of flash messages, you can publish the view files:

```bash
php artisan vendor:publish --tag=laravolt-views
```

Then edit the flash message template located at `resources/views/vendor/laravolt/flash.blade.php`.

## Best Practices

### Keep Messages Clear and Concise

- Use simple, action-oriented language
- Keep messages under 10 words when possible
- Make the feedback specific to the action that was performed

### Use Appropriate Message Types

- `info` for general information that doesn't require action
- `success` for confirmation of completed actions
- `warning` for non-critical issues that might need attention
- `error` for critical issues that prevented an action from completing

### Avoid Overusing Flash Messages

- Reserve flash messages for important information
- Don't display notifications for routine actions that don't need confirmation

## Troubleshooting

### Flash Messages Not Appearing

If your flash messages aren't appearing, check the following:

1. Verify that the `DetectFlashMessage` middleware is properly registered in your `app/Http/Kernel.php` file
2. Check that your layout template includes the flash message component:
   ```php
   @include('laravolt::_flash')
   ```
3. Inspect your browser console for any JavaScript errors that might prevent the flash messages from displaying

### Messages Displaying Incorrectly

If flash messages appear but don't look right:

1. Ensure you're using the correct message type (`info`, `success`, `warning`, `error`)
2. Check if you've customized the flash message template and revert to the default if needed
3. Verify that the required CSS and JavaScript assets are being loaded

## Related Components

- [Forms](/v6/form) - Form components that integrate with validation
- [Tables](/v6/table) - Table components with action feedback
- [Action Buttons](/v6/action-button) - Buttons that can trigger flash messages
