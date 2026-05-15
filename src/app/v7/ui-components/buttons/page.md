---
title: Buttons
---

# Buttons

Buttons trigger actions, submit forms, and navigate between pages. Laravolt v7 uses Preline UI button styles with consistent variants across the platform. {% .lead %}

## Button variants

Laravolt defines semantic button variants that map to Preline UI classes:

### Primary buttons

Main call-to-action. Use sparingly (one per screen):

```blade
{!! PrelineForm::submit('Save changes')->primary() !!}
{!! PrelineForm::button('Create user')->primary() !!}
```

Renders:
```html
<button type="submit" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
    Save changes
</button>
```

### Secondary buttons

Alternative actions or cancel operations:

```blade
{!! PrelineForm::button('Cancel')->secondary() !!}
{!! PrelineForm::link('Back', route('users.index'))->secondary() !!}
```

Renders:
```html
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
    Cancel
</button>
```

### Danger buttons

Destructive actions (delete, remove, revoke):

```blade
{!! PrelineForm::submit('Delete user')->danger() !!}
{!! PrelineForm::button('Remove access')->danger() !!}
```

Renders:
```html
<button type="submit" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:bg-red-700 disabled:opacity-50 disabled:pointer-events-none">
    Delete user
</button>
```

### Success buttons

Confirmation or approval actions:

```blade
{!! PrelineForm::submit('Approve')->success() !!}
{!! PrelineForm::button('Confirm payment')->success() !!}
```

Renders:
```html
<button type="submit" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none">
    Approve
</button>
```

## Icon buttons

Add icons using Heroicons or any SVG icon library:

```blade
{!! PrelineForm::submit('Save changes')->primary()->icon('
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
') !!}
```

Or use Blade components:

```blade
<button type="submit" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
    <x-heroicon-o-check class="w-4 h-4" />
    Save changes
</button>
```


## Loading states

Show loading indicators during async operations:

```blade
<button 
    type="submit" 
    x-data="{ loading: false }"
    @click="loading = true"
    :disabled="loading"
    class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
>
    <svg x-show="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span x-show="!loading">Save changes</span>
    <span x-show="loading">Saving...</span>
</button>
```

## Button groups

Group related actions:

```blade
<div class="inline-flex rounded-lg shadow-sm">
    <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700">
        Edit
    </button>
    <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700">
        Duplicate
    </button>
    <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700">
        Delete
    </button>
</div>
```

## Size variants

Preline UI supports three button sizes:

```blade
{{-- Small --}}
<button class="py-2 px-3 text-sm ...">Small</button>

{{-- Default --}}
<button class="py-3 px-4 text-sm ...">Default</button>

{{-- Large --}}
<button class="py-4 px-5 text-base ...">Large</button>
```

## Disabled state

Buttons automatically disable when forms are submitting:

```blade
{!! PrelineForm::submit('Save')->primary()->disabled($user->isLocked()) !!}
```

Or use Alpine.js for dynamic disabling:

```blade
<button 
    type="submit"
    :disabled="!agreed"
    class="... disabled:opacity-50 disabled:pointer-events-none"
>
    Submit
</button>
```

## Link buttons

Style links as buttons:

```blade
{!! PrelineForm::link('View details', route('users.show', $user))->primary() !!}
```

Renders:
```html
<a href="/users/123" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
    View details
</a>
```

## Common patterns

### Action bar

```blade
<div class="flex items-center justify-between">
    <div class="flex gap-3">
        {!! PrelineForm::submit('Save')->primary() !!}
        {!! PrelineForm::button('Save as draft')->secondary() !!}
    </div>
    <div>
        {!! PrelineForm::link('Cancel', route('users.index'))->secondary() !!}
    </div>
</div>
```

### Confirmation dialog trigger

```blade
<button 
    type="button"
    @click="$dispatch('open-modal', 'confirm-delete')"
    class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
>
    Delete user
</button>
```

## Verification commands

Test button rendering:

```bash
# Inspect button HTML
php artisan tinker
>>> PrelineForm::submit('Save')->primary()

# Test button states
# Click button → verify loading state
# Submit form → verify disabled state
# Check dark mode → verify dark: classes apply

# Accessibility check
# Verify type="submit" vs type="button"
# Verify disabled state prevents clicks
# Verify focus styles (focus:outline-none focus:bg-*)
```

## What to read next

- [Modals](/v7/ui-components/modals) — trigger modals from buttons
- [Forms overview](/v7/forms/overview) — button integration with PrelineForm
- [Cards](/v7/ui-components/cards) — button placement in card footers
