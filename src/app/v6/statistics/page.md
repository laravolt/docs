---
title: Statistics
description: Displaying single value metrics with attractive styling
nextjs:
  metadata:
    title: Statistics Components in Laravolt
    description: How to create and customize statistic components to display key metrics in your Laravolt applications
---

Statistics components provide a visually appealing way to present important metrics and KPIs in your application. Built as Livewire components, they allow easy display of single-value data with supporting elements like labels and icons.

---

## Overview

Laravolt's Statistics component is designed to highlight key metrics in your application with a clean, attractive UI. Each statistic displays a single value with supporting elements like a label, icon, and color coding to provide context and visual emphasis.

![Statistics Component Preview](https://cdn.statically.io/gh/laravolt/storage/master/2021/10/statistic-preview-br07F2.png)

## Installation/Setup

Statistics in Laravolt are implemented as Livewire components. Before using them, make sure you have:

1. Installed Livewire in your Laravel project
2. Included Laravolt's UI package

If you're using the complete Laravolt package, these dependencies are automatically installed.

## Basic Usage

### Creating a Statistic Component

Laravolt provides an artisan command to generate a new statistic component:

```bash
php artisan make:statistic TotalUser
```

This will create a new file at `app/Http/Livewire/Statistic/TotalUser.php`. You can then customize this component to display your specific data:

```php
<?php

namespace App\Http\Livewire\Statistic;

use Laravolt\Ui\Statistic;

class TotalUser extends Statistic
{
    public string $label = 'Total User';

    public ?string $icon = 'user';

    public function value(): int|string
    {
        return \App\Models\User::count();
    }
}
```

### Displaying the Statistic Component

Once your statistic component is defined, you can display it in your views using any of these methods:

```php
<livewire:statistic.total-user />

// or

@livewire('statistic.total-user')

// or

@livewire(\App\Http\Livewire\Statistic\TotalUser::class)
```

## Advanced Features

### Customizing the Label

To change the statistic's label, modify the `$label` property:

```php
public string $label = 'New Users';
```

For dynamic labels that depend on runtime conditions, override the `label()` method:

```php
public function label(): string
{
    $month = request()->query('month', date('F'));

    return "New Users in $month";
}
```

### Customizing the Value

The value displayed in the statistic is determined by the `value()` method:

```php
public function value(): int|string
{
    // Perform any calculations or database queries
    $count = \App\Models\User::whereMonth('created_at', now()->month)->count();

    return $count;
}
```

You can return either an integer or a string, allowing for formatted values like percentages or currency:

```php
public function value(): int|string
{
    $revenue = Order::sum('total');

    return '$' . number_format($revenue, 2);
}
```

### Customizing the Color

To change the color of your statistic, set the `$color` property:

```php
public ?string $color = 'red';
```

For dynamic colors that change based on the value or other conditions, override the `color()` method:

```php
public function color(): ?string
{
    $value = $this->value();

    if ($value > 100) {
        return 'green';
    } elseif ($value > 50) {
        return 'blue';
    } else {
        return 'red';
    }
}
```

Available colors include common options like `red`, `green`, `blue`, `yellow`, `purple`, and `gray`.

### Customizing the Icon

To change the icon displayed in your statistic, set the `$icon` property:

```php
public ?string $icon = 'user';
```

For dynamic icons, override the `icon()` method:

```php
public function icon(): ?string
{
    $trend = $this->calculateTrend();

    if ($trend === 'up') {
        return 'arrow-up';
    } elseif ($trend === 'down') {
        return 'arrow-down';
    }

    return 'circle';
}
```

Laravolt statistics use Font Awesome Duotone icons. For a complete list of available icons, visit [Font Awesome's website](https://fontawesome.com/v5/search?s=duotone).

### Customizing the Title

To add a title or heading above your statistic, set the `$title` property:

```php
public string $title = 'User Statistics';
```

For dynamic titles, override the `title()` method:

```php
public function title(): string
{
    $period = request()->query('period', 'monthly');

    return "$period User Statistics";
}
```

## Examples

### Basic Counter

```php
class ActiveUsers extends Statistic
{
    public string $label = 'Active Users';
    public ?string $icon = 'user';
    public ?string $color = 'blue';

    public function value(): int|string
    {
        return User::where('status', 'active')->count();
    }
}
```

### Percentage Metric

```php
class TaskCompletionRate extends Statistic
{
    public string $label = 'Completion Rate';
    public ?string $icon = 'tasks';
    public ?string $color = 'green';

    public function value(): int|string
    {
        $total = Task::count();
        $completed = Task::where('status', 'completed')->count();

        if ($total === 0) {
            return '0%';
        }

        $percentage = round(($completed / $total) * 100);
        return "$percentage%";
    }
}
```

### Currency Display

```php
class MonthlyRevenue extends Statistic
{
    public string $label = 'Monthly Revenue';
    public ?string $icon = 'money-bill';
    public ?string $color = 'green';

    public function value(): int|string
    {
        $revenue = Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total');

        return 'Rp ' . number_format($revenue, 0, ',', '.');
    }

    public function color(): ?string
    {
        $lastMonth = Order::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total');

        $currentMonth = $this->rawValue();

        return $currentMonth >= $lastMonth ? 'green' : 'red';
    }

    // Helper method to get the raw value for comparison
    protected function rawValue()
    {
        return Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total');
    }
}
```

## Best Practices

1. **Keep It Simple**: Statistics are meant to display single values. Avoid trying to show complex data in a statistic component.

2. **Optimize Queries**: Statistics often appear on dashboards where multiple components load simultaneously. Ensure your database queries are optimized.

3. **Use Caching**: For statistics that don't need real-time updates, consider implementing caching to improve performance.

4. **Consistent Colors**: Use color consistently across your application to indicate similar types of information.

5. **Meaningful Icons**: Choose icons that intuitively represent the data being displayed.

## Troubleshooting

### Statistics Not Updating

If your statistics aren't updating:

1. Ensure Livewire is properly installed and working
2. Check for JavaScript errors in your browser console
3. Verify that your data source is returning current data

### Performance Issues

If statistics are loading slowly:

1. Optimize your database queries
2. Consider implementing caching
3. Use eager loading if your statistics involve relationships

## Related Components/Features

- [Charts](/v6/charts) - For displaying more complex data visualizations
- [Livewire Documentation](https://laravel-livewire.com/docs/) - Learn more about the framework powering statistics
- [UI Components](/v6/ui-components) - Explore other Laravolt UI components
