---
title: Cards
---

# Cards

Cards group related content and actions into contained, scannable blocks. Laravolt v7 uses Preline UI card patterns for consistent spacing, borders, and dark mode support. {% .lead %}

## Basic card

```blade
<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
    <div class="p-4 md:p-5">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            Card title
        </h3>
        <p class="mt-2 text-gray-500 dark:text-neutral-400">
            Card content goes here. This is a basic card with title and description.
        </p>
    </div>
</div>
```

## Card with header and footer

```blade
<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
    {{-- Header --}}
    <div class="bg-gray-100 border-b rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
        <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500">
            Featured
        </p>
    </div>

    {{-- Body --}}
    <div class="p-4 md:p-5">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            Product name
        </h3>
        <p class="mt-2 text-gray-500 dark:text-neutral-400">
            Product description and details.
        </p>
    </div>

    {{-- Footer --}}
    <div class="bg-gray-100 border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
        <div class="flex gap-3">
            <a href="#" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
                View details
            </a>
            <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700">
                Edit
            </button>
        </div>
    </div>
</div>
```

## Stats card

Display key metrics:

```blade
<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
    <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
            <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Total users
            </p>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
            <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                72,540
            </h3>
            <span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
                <svg class="inline-block size-4 self-center" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="inline-block text-xs font-medium">
                    12%
                </span>
            </span>
        </div>
    </div>
</div>
```


## List card

Display items in a card:

```blade
<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
    <div class="p-4 md:p-5">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            Recent orders
        </h3>
    </div>

    <div class="divide-y divide-gray-200 dark:divide-neutral-700">
        @foreach($orders as $order)
        <div class="p-4 md:p-5 flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-800 dark:text-white">
                    Order #{{ $order->id }}
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-500">
                    {{ $order->created_at->diffForHumans() }}
                </p>
            </div>
            <div class="text-right">
                <p class="text-sm font-medium text-gray-800 dark:text-white">
                    ${{ number_format($order->total, 2) }}
                </p>
                <span class="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                    {{ $order->status }}
                </span>
            </div>
        </div>
        @endforeach
    </div>
</div>
```

## Card grid

Responsive grid of cards:

```blade
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    @foreach($products as $product)
    <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
        <img class="w-full h-48 object-cover rounded-t-xl" src="{{ $product->image }}" alt="{{ $product->name }}">
        
        <div class="p-4 md:p-5">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                {{ $product->name }}
            </h3>
            <p class="mt-1 text-gray-500 dark:text-neutral-400">
                {{ Str::limit($product->description, 100) }}
            </p>
            <p class="mt-3 text-xl font-bold text-gray-800 dark:text-white">
                ${{ number_format($product->price, 2) }}
            </p>
        </div>

        <div class="mt-auto p-4 md:p-5 border-t border-gray-200 dark:border-neutral-700">
            <a href="{{ route('products.show', $product) }}" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 w-full">
                View details
            </a>
        </div>
    </div>
    @endforeach
</div>
```

## Interactive card (clickable)

Make entire card clickable:

```blade
<a href="{{ route('projects.show', $project) }}" class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-700">
    <div class="p-4 md:p-5">
        <div class="flex justify-between items-center gap-x-3">
            <div class="grow">
                <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                    {{ $project->name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-neutral-500">
                    {{ $project->description }}
                </p>
            </div>
            <div>
                <svg class="shrink-0 size-5 text-gray-800 dark:text-neutral-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
</a>
```

## Card with image overlay

```blade
<div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
    <img class="w-full h-64 object-cover" src="{{ $post->cover_image }}" alt="{{ $post->title }}">
    
    <div class="absolute bottom-0 start-0 end-0 p-4 md:p-5 bg-gradient-to-t from-black/80 to-transparent">
        <h3 class="text-lg font-bold text-white">
            {{ $post->title }}
        </h3>
        <p class="mt-1 text-sm text-gray-300">
            {{ $post->excerpt }}
        </p>
    </div>
</div>
```

## Common patterns

### Dashboard stats grid

```blade
<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {{-- Total revenue --}}
    <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
        <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
                <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Total revenue
                </p>
            </div>
            <div class="mt-1 flex items-center gap-x-2">
                <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    $45,231.89
                </h3>
            </div>
        </div>
    </div>

    {{-- Repeat for other stats --}}
</div>
```

### Empty state card

```blade
<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
    <div class="p-4 md:p-10 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
            No orders yet
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">
            Start by creating your first order.
        </p>
        <div class="mt-5">
            <a href="{{ route('orders.create') }}" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
                Create order
            </a>
        </div>
    </div>
</div>
```

## Verification commands

Test card rendering:

```bash
# Create a test view with cards
# Verify responsive grid (sm:grid-cols-2 lg:grid-cols-3)
# Check dark mode (dark:bg-neutral-900 dark:border-neutral-700)
# Test hover states on interactive cards
# Verify shadow transitions (hover:shadow-md)

# Accessibility check
# Verify clickable cards use <a> not <div>
# Verify proper heading hierarchy (h3 for card titles)
# Check color contrast in dark mode
```

## What to read next

- [Buttons](/v7/ui-components/buttons) — button placement in card footers
- [Tables](/v7/ui-foundation/tables) — Suitable table component
- [UI foundation](/v7/ui-foundation/overview) — Preline UI component library
