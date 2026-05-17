---
title: Form layouts
---

# Form layouts

Real business forms need more than vertical field stacks. This guide shows responsive layout patterns for single-column, two-column, tabbed, and wizard forms using Tailwind CSS grid and Preline UI components. {% .lead %}

## Why layout patterns matter

Form layout affects:
- **Cognitive load** — grouped fields reduce mental effort
- **Mobile usability** — responsive grids adapt to screen size
- **Completion rates** — clear structure guides users through complex forms
- **Validation clarity** — errors appear near their fields

Laravolt forms use Tailwind CSS utilities for layout, so patterns are portable across projects.

## Single-column layout

Default for most forms. Fields stack vertically with consistent spacing:

```blade
{!! PrelineForm::open('users.store')->post() !!}
    <div class="space-y-4">
        {!! PrelineForm::text('name')->label('Full name')->required() !!}
        {!! PrelineForm::email('email')->label('Email')->required() !!}
        {!! PrelineForm::password('password')->label('Password')->required() !!}
        {!! PrelineForm::textarea('bio')->label('Bio')->rows(4) !!}
    </div>

    <div class="mt-6 flex gap-3">
        {!! PrelineForm::submit('Create account')->primary() !!}
        {!! PrelineForm::link('Cancel', route('home'))->secondary() !!}
    </div>
{!! PrelineForm::close() !!}
```

**When to use:**
- Simple forms (< 6 fields)
- Mobile-first designs
- Forms with long text fields

## Two-column layout

Reduces vertical scrolling for forms with many short fields:

```blade
{!! PrelineForm::open('products.store')->post() !!}
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="space-y-4">
            {!! PrelineForm::text('name')->label('Product name')->required() !!}
            {!! PrelineForm::text('sku')->label('SKU')->required() !!}
            {!! PrelineForm::number('price')->label('Price')->mask('currency') !!}
        </div>

        <div class="space-y-4">
            {!! PrelineForm::select('category_id', $categories)->label('Category')->required() !!}
            {!! PrelineForm::select('brand_id', $brands)->label('Brand') !!}
            {!! PrelineForm::checkbox('is_featured', 1)->label('Featured product') !!}
        </div>
    </div>

    <div class="mt-6">
        {!! PrelineForm::textarea('description')->label('Description')->rows(4) !!}
    </div>

    <div class="mt-6 flex gap-3">
        {!! PrelineForm::submit('Save product')->primary() !!}
    </div>
{!! PrelineForm::close() !!}
```

**Responsive behavior:**
- Mobile: single column (`grid-cols-1`)
- Desktop: two columns (`lg:grid-cols-2`)

**When to use:**
- Forms with 6-12 short fields
- Desktop-heavy workflows
- Related field groups (e.g., billing + shipping)


## Tabbed forms

Group related sections into tabs for long forms:

```blade
<div x-data="{ tab: 'basic' }">
    {!! PrelineForm::open('products.store')->post() !!}
        
        {{-- Tab navigation --}}
        <div class="border-b border-gray-200 dark:border-neutral-700">
            <nav class="flex gap-x-2">
                <button 
                    type="button"
                    @click="tab = 'basic'"
                    :class="tab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
                    class="inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium"
                >
                    Basic info
                </button>
                <button 
                    type="button"
                    @click="tab = 'pricing'"
                    :class="tab === 'pricing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
                    class="inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium"
                >
                    Pricing
                </button>
                <button 
                    type="button"
                    @click="tab = 'inventory'"
                    :class="tab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
                    class="inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium"
                >
                    Inventory
                </button>
            </nav>
        </div>

        {{-- Tab panels --}}
        <div class="mt-6">
            <div x-show="tab === 'basic'" class="space-y-4">
                {!! PrelineForm::text('name')->label('Product name')->required() !!}
                {!! PrelineForm::textarea('description')->label('Description')->rows(4) !!}
                {!! PrelineForm::select('category_id', $categories)->label('Category') !!}
            </div>

            <div x-show="tab === 'pricing'" class="space-y-4">
                {!! PrelineForm::number('price')->label('Price')->mask('currency')->required() !!}
                {!! PrelineForm::number('cost')->label('Cost')->mask('currency') !!}
                {!! PrelineForm::number('discount')->label('Discount %')->min(0)->max(100) !!}
            </div>

            <div x-show="tab === 'inventory'" class="space-y-4">
                {!! PrelineForm::text('sku')->label('SKU')->required() !!}
                {!! PrelineForm::number('stock')->label('Stock quantity')->min(0) !!}
                {!! PrelineForm::checkbox('track_inventory', 1)->label('Track inventory') !!}
            </div>
        </div>

        <div class="mt-6 flex gap-3">
            {!! PrelineForm::submit('Save product')->primary() !!}
        </div>

    {!! PrelineForm::close() !!}
</div>
```

**When to use:**
- Forms with 12+ fields
- Logically distinct sections
- Optional sections (e.g., advanced settings)

**Validation note:** All tabs submit together. Show error indicators on tab buttons:

```blade
<button 
    type="button"
    @click="tab = 'basic'"
    class="..."
>
    Basic info
    @if($errors->has(['name', 'description', 'category_id']))
        <span class="ml-1 h-2 w-2 rounded-full bg-red-500"></span>
    @endif
</button>
```

## Wizard forms (multi-step)

Break complex forms into sequential steps:

```blade
<div x-data="{ step: 1 }">
    {!! PrelineForm::open('orders.store')->post() !!}
        
        {{-- Progress indicator --}}
        <div class="mb-8">
            <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li :class="step >= 1 ? 'text-blue-600 dark:text-blue-500' : ''" class="flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 border rounded-full shrink-0" 
                          :class="step >= 1 ? 'border-blue-600' : 'border-gray-500'">
                        1
                    </span>
                    <span class="ml-2">Customer</span>
                </li>
                <li :class="step >= 2 ? 'text-blue-600 dark:text-blue-500' : ''" class="flex items-center ml-4">
                    <span class="flex items-center justify-center w-8 h-8 border rounded-full shrink-0"
                          :class="step >= 2 ? 'border-blue-600' : 'border-gray-500'">
                        2
                    </span>
                    <span class="ml-2">Products</span>
                </li>
                <li :class="step >= 3 ? 'text-blue-600 dark:text-blue-500' : ''" class="flex items-center ml-4">
                    <span class="flex items-center justify-center w-8 h-8 border rounded-full shrink-0"
                          :class="step >= 3 ? 'border-blue-600' : 'border-gray-500'">
                        3
                    </span>
                    <span class="ml-2">Review</span>
                </li>
            </ol>
        </div>

        {{-- Step 1: Customer --}}
        <div x-show="step === 1" class="space-y-4">
            {!! PrelineForm::select('customer_id', $customers)->label('Customer')->required() !!}
            {!! PrelineForm::date('order_date')->label('Order date')->required() !!}
            {!! PrelineForm::textarea('notes')->label('Notes')->rows(3) !!}
        </div>

        {{-- Step 2: Products --}}
        <div x-show="step === 2" class="space-y-4">
            <div id="products-container">
                {{-- Dynamic product rows --}}
            </div>
            <button type="button" class="text-sm text-blue-600">+ Add product</button>
        </div>

        {{-- Step 3: Review --}}
        <div x-show="step === 3" class="space-y-4">
            <div class="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
                <h3 class="font-medium">Order summary</h3>
                {{-- Display collected data --}}
            </div>
        </div>

        {{-- Navigation --}}
        <div class="mt-6 flex justify-between">
            <button 
                type="button" 
                @click="step--" 
                x-show="step > 1"
                class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium"
            >
                Previous
            </button>
            <button 
                type="button" 
                @click="step++" 
                x-show="step < 3"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
                Next
            </button>
            <button 
                type="submit" 
                x-show="step === 3"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
                Submit order
            </button>
        </div>

    {!! PrelineForm::close() !!}
</div>
```

**When to use:**
- Forms with 15+ fields
- Sequential data collection (e.g., checkout, onboarding)
- Forms where early steps determine later options

**Validation strategy:**
- Client-side: validate each step before allowing "Next"
- Server-side: validate all steps on final submit
- Show errors on the relevant step

