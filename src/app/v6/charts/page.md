---
title: Charts
description: Interactive data visualization using ApexCharts
nextjs:
  metadata:
    title: Charts
    description: Learn how to create and customize interactive charts in Laravolt using Livewire and ApexCharts.
---

Charts provide powerful data visualization capabilities for your Laravel applications. Laravolt's chart components leverage the popular ApexCharts library, wrapped in Livewire components for a seamless PHP development experience.

---

## Overview

Laravolt charts enable you to create sophisticated data visualizations without writing any JavaScript. The package serves as a wrapper around [ApexCharts](https://apexcharts.com/), a modern JavaScript charting library, but exposes its API entirely through PHP.

## Installation

Charts functionality is included in the Laravolt UI package. If you haven't installed Laravolt yet, refer to the [installation guide](/v6/installation).

The charts component relies on Laravel Livewire, which should be installed as part of the Laravolt installation process.

## Basic Usage

### Creating a Chart Component

To create a new chart component, use the provided Artisan command:

```bash
php artisan make:chart DailyRegistration
```

This command generates a new Livewire component in the `app/Http/Livewire/Chart` directory. The generated class extends the appropriate chart type base class and provides a template for you to customize:

```php
<?php

namespace App\Http\Livewire\Chart;

use Laravolt\Charts\Line;

class DailyRegistration extends Line
{
    public string $title = 'Daily Registration';

    public function series(): array
    {
        return [
            'series-1' => [
                'Label 1' => 10,
                'Label 2' => 14,
                'Label 3' => 40
            ],
        ];
    }
}
```

### Displaying a Chart Component

Once created, you can display your chart component in any Blade view using one of these methods:

```blade
<livewire:chart.daily-registration />

{{-- Or using the @livewire directive --}}
@livewire('chart.daily-registration')

{{-- Or using the full class name --}}
@livewire(\App\Http\Livewire\Chart\DailyRegistration::class)
```

## Chart Types

Laravolt provides several chart types, each extending a base class that configures the appropriate ApexCharts settings:

### Bar Charts

For vertical bar charts, extend the `Bar` class:

```php
use Laravolt\Charts\Bar;

class MonthlyRevenue extends Bar
{
    public string $title = 'Monthly Revenue';

    public function series(): array
    {
        return [
            'revenue' => [
                'January' => 12000,
                'February' => 14000,
                'March' => 18000,
                // ...
            ],
        ];
    }
}
```

### Line Charts

For line charts that highlight trends over time, extend the `Line` class:

```php
use Laravolt\Charts\Line;

class DailyActiveUsers extends Line
{
    public string $title = 'Daily Active Users';

    public function series(): array
    {
        return [
            'users' => [
                'Monday' => 120,
                'Tuesday' => 140,
                'Wednesday' => 180,
                // ...
            ],
        ];
    }
}
```

### Area Charts

For filled line charts that emphasize volume, extend the `Area` class:

```php
use Laravolt\Charts\Area;

class WebsiteTraffic extends Area
{
    public string $title = 'Website Traffic';

    public function series(): array
    {
        // Your data here
        return [
            'visits' => [
                'Week 1' => 4500,
                'Week 2' => 5200,
                'Week 3' => 4800,
                // ...
            ],
        ];
    }
}
```

### Donut Charts

For circular charts that show composition, extend the `Donut` class:

```php
use Laravolt\Charts\Donut;

class BrowserUsage extends Donut
{
    public string $title = 'Browser Usage';

    public function series(): array
    {
        return [
            'Chrome' => 64.4,
            'Firefox' => 10.3,
            'Safari' => 8.5,
            'Edge' => 13.6,
            'Others' => 3.2,
        ];
    }
}
```

## Customization

### Title Configuration

Set a static title using the `$title` property:

```php
public string $title = 'Monthly Sales Data';
```

For dynamic titles that respond to filters or other context, override the `title()` method:

```php
public function title(): string
{
    $month = request()->query('month', date('F'));
    $year = request()->query('year', date('Y'));

    return "Monthly Sales Data - {$month} {$year}";
}
```

### Height Adjustment

Control the chart height using the `$height` property:

```php
protected int $height = 500;
```

For dynamic height based on conditions, override the `height()` method:

```php
public function height(): int
{
    if (request()->has('detailed')) {
        return 600;
    }

    return 400;
}
```

### Labels Customization

By default, chart labels come from the keys in your series data. To customize labels, override the `labels()` method:

```php
public function labels(): array
{
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
```

### Chart Options

ApexCharts provides many options to customize the appearance and behavior of charts. You can set these options by overriding the `options()` method:

```php
public function options(): array
{
    $defaultOptions = parent::options();
    $customOptions = [
        'legend' => [
            'position' => 'top',
        ],
        'colors' => ['#008FFB', '#00E396', '#FEB019'],
        'tooltip' => [
            'shared' => true,
            'intersect' => false,
        ],
    ];

    return array_merge($defaultOptions, $customOptions);
}
```

## Data Processing Examples

### Monthly User Registrations Example

This example shows how to generate a chart showing user registration data by month:

```php
public function series(): array
{
    // Initialize 12 months with zero values
    $months = collect()->pad(12, 0);

    // Get monthly registration data from database
    $users = User::whereYear('created_at', now()->year)
        ->get()
        ->groupBy(function ($user) {
            // Month index starts at 0 to match array indexing
            return Carbon::parse($user->created_at)->month - 1;
        })
        ->map(function ($users) {
            return $users->count();
        });

    // Merge real data with the zero-filled array to ensure all months are included
    $data = $users->union($months)->toArray();

    return [
        'registrations' => $data,
    ];
}

public function labels(): array
{
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
```

### Multiple Series Example

This example creates a chart comparing two different metrics:

```php
public function series(): array
{
    // Get order data grouped by month
    $orders = Order::whereYear('created_at', now()->year)
        ->get()
        ->groupBy(function ($order) {
            return Carbon::parse($order->created_at)->month - 1;
        });

    // Calculate revenue by month
    $revenue = collect()->pad(12, 0);
    $orders->each(function ($monthlyOrders, $month) use (&$revenue) {
        $revenue[$month] = $monthlyOrders->sum('total');
    });

    // Calculate order count by month
    $count = collect()->pad(12, 0);
    $orders->each(function ($monthlyOrders, $month) use (&$count) {
        $count[$month] = $monthlyOrders->count();
    });

    return [
        'revenue' => $revenue->toArray(),
        'orders' => $count->toArray(),
    ];
}
```

## Advanced Features

### Real-time Updates with Polling

Make your charts update automatically at regular intervals using Livewire's polling feature:

```php
class ActiveUsersChart extends Line
{
    protected $listeners = ['$refresh'];
    protected $polling = 10000; // Update every 10 seconds

    // Chart definition
}
```

### Handling User Interactions

You can respond to user input by defining Livewire methods and properties:

```php
class SalesChart extends Bar
{
    public $selectedYear;

    public function mount()
    {
        $this->selectedYear = now()->year;
    }

    public function updatedSelectedYear()
    {
        // Chart will automatically refresh when the year changes
    }

    public function series(): array
    {
        return [
            'sales' => Order::whereYear('created_at', $this->selectedYear)
                ->get()
                ->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->month - 1;
                })
                ->map(function ($orders) {
                    return $orders->sum('total');
                })
                ->union(collect()->pad(12, 0))
                ->toArray(),
        ];
    }
}
```

The corresponding Blade template:

```blade
<div>
    <select wire:model="selectedYear">
        @foreach(range(2018, now()->year) as $year)
            <option value="{{ $year }}">{{ $year }}</option>
        @endforeach
    </select>

    <livewire:chart.sales-chart :key="$selectedYear" />
</div>
```

## Best Practices

### Performance Considerations

- For complex data processing, consider caching results
- Use database aggregations (using SQL `SUM()`, `COUNT()`, etc.) rather than collecting all records and processing in PHP
- Limit the amount of data displayed to maintain responsiveness

### Visual Clarity

- Choose appropriate chart types for your data:
  - Line/area charts for trends over time
  - Bar charts for comparing discrete categories
  - Pie/donut charts for showing composition (limit to 5-7 segments)
- Use a consistent color palette throughout your application
- Avoid cluttering charts with too many data series

### Responsive Design

- Test your charts on different screen sizes
- Consider simplified views for mobile devices
- Adjust the chart height based on the viewport

## Troubleshooting

### Charts Not Displaying

If your charts aren't showing up:

1. Check the browser console for JavaScript errors
2. Verify that Livewire is properly installed and registered
3. Ensure your data format matches what ApexCharts expects
4. Check that the chart height is set to a positive value

### Performance Issues

If charts are slow to render:

1. Optimize your data queries to minimize processing time
2. Consider adding database indexes to columns used for filtering or grouping
3. Implement caching for expensive calculations
4. Reduce the amount of data displayed if appropriate

## Related Components

- [Statistics](/v6/statistics) - For displaying single-value metrics
- [Tables](/v6/table) - For displaying tabular data
- [Dashboard Layouts](/v6/layout) - For arranging multiple visualization components
