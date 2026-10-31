---
title: Custom fields
---

# Custom fields

PrelineForm provides standard HTML5 inputs, but real business forms need date pickers, file uploaders, rich text editors, and domain-specific controls. This guide shows how to build custom field components that integrate with PrelineForm's validation, old input, and error display. {% .lead %}

## Why custom fields

Standard inputs cover 80% of forms, but the remaining 20% — date ranges, multi-file uploads, WYSIWYG editors, color pickers — require JavaScript libraries and custom markup. Custom fields let you:

- Wrap third-party JS libraries (Flatpickr, Dropzone, Trix) in reusable Blade components
- Preserve PrelineForm's validation and error display
- Keep the fluent API consistent across standard and custom fields
- Share field definitions across projects

## Anatomy of a custom field

Every custom field is a Blade component that:

1. Accepts `name`, `value`, `label`, `error`, and `attributes` props
2. Renders the field markup with Preline UI classes
3. Preserves `old()` input on validation failure
4. Displays validation errors below the field
5. Integrates with JavaScript libraries via `@push('scripts')`

### Basic structure

```blade
{{-- resources/views/components/forms/date-picker.blade.php --}}
@props([
    'name',
    'value' => null,
    'label' => null,
    'error' => null,
    'required' => false,
])

<div class="space-y-2">
    @if($label)
        <label for="{{ $name }}" class="block text-sm font-medium text-gray-900 dark:text-white">
            {{ $label }}
            @if($required)<span class="text-red-500">*</span>@endif
        </label>
    @endif

    <input
        type="text"
        id="{{ $name }}"
        name="{{ $name }}"
        value="{{ old($name, $value) }}"
        {{ $attributes->merge(['class' => 'block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400']) }}
        data-datepicker
    />

    @if($error)
        <p class="text-sm text-red-600 dark:text-red-400">{{ $error }}</p>
    @endif
</div>

@once
@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-datepicker]').forEach(el => {
        flatpickr(el, {
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'F j, Y'
        });
    });
});
</script>
@endpush
@endonce
```

### Usage in forms

```blade
{!! PrelineForm::open('events.store')->post() !!}
    {!! PrelineForm::text('title')->label('Event title')->required() !!}
    
    <x-forms.date-picker 
        name="start_date" 
        :value="$event->start_date ?? null"
        label="Start date"
        :error="$errors->first('start_date')"
        required
    />
    
    {!! PrelineForm::submit('Save')->primary() !!}
{!! PrelineForm::close() !!}
```

## Integration with PrelineForm

To make custom fields feel native to PrelineForm, register them as macros:

```php
// app/Providers/AppServiceProvider.php
use Laravolt\PrelineForm\Facade as PrelineForm;

public function boot(): void
{
    PrelineForm::macro('datePicker', function (string $name, ?string $value = null) {
        $error = session('errors')?->first($name);
        
        return view('components.forms.date-picker', [
            'name' => $name,
            'value' => old($name, $value),
            'error' => $error,
            'attributes' => new \Illuminate\View\ComponentAttributeBag(),
        ])->render();
    });
}
```

Now use it like any PrelineForm field:

```blade
{!! PrelineForm::datePicker('start_date')->label('Start date')->required() !!}
```

## Example: File upload with preview

```blade
{{-- resources/views/components/forms/image-upload.blade.php --}}
@props([
    'name',
    'value' => null,
    'label' => null,
    'error' => null,
    'accept' => 'image/*',
])

<div class="space-y-2" x-data="imageUpload('{{ $value }}')">
    @if($label)
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
            {{ $label }}
        </label>
    @endif

    <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
            <img 
                x-show="preview" 
                :src="preview" 
                class="h-24 w-24 rounded-lg object-cover border border-gray-200 dark:border-neutral-700"
                alt="Preview"
            />
            <div 
                x-show="!preview"
                class="h-24 w-24 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center"
            >
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>

        <div class="flex-1">
            <input
                type="file"
                id="{{ $name }}"
                name="{{ $name }}"
                accept="{{ $accept }}"
                @change="handleFileChange"
                {{ $attributes->merge(['class' => 'block w-full text-sm text-gray-900 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 dark:text-neutral-400 dark:bg-neutral-900 dark:border-neutral-700']) }}
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                PNG, JPG, GIF up to 2MB
            </p>
        </div>
    </div>

    @if($error)
        <p class="text-sm text-red-600 dark:text-red-400">{{ $error }}</p>
    @endif
</div>

@once
@push('scripts')
<script>
function imageUpload(initialValue) {
    return {
        preview: initialValue,
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.preview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    };
}
</script>
@endpush
@endonce
```


## Example: Rich text editor (Trix)

```blade
{{-- resources/views/components/forms/rich-text.blade.php --}}
@props([
    'name',
    'value' => null,
    'label' => null,
    'error' => null,
])

<div class="space-y-2">
    @if($label)
        <label for="{{ $name }}" class="block text-sm font-medium text-gray-900 dark:text-white">
            {{ $label }}
        </label>
    @endif

    <input id="{{ $name }}_input" type="hidden" name="{{ $name }}" value="{{ old($name, $value) }}">
    <trix-editor 
        input="{{ $name }}_input"
        class="trix-content block w-full rounded-lg border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
    ></trix-editor>

    @if($error)
        <p class="text-sm text-red-600 dark:text-red-400">{{ $error }}</p>
    @endif
</div>

@once
@push('styles')
<link rel="stylesheet" href="https://unpkg.com/trix@2.0.0/dist/trix.css">
@endpush
@push('scripts')
<script src="https://unpkg.com/trix@2.0.0/dist/trix.umd.min.js"></script>
@endpush
@endonce
```

## Validation patterns

Custom fields must preserve Laravel validation errors:

```php
// Controller
public function store(Request $request)
{
    $validated = $request->validate([
        'start_date' => 'required|date|after:today',
        'avatar' => 'nullable|image|max:2048',
        'content' => 'required|min:100',
    ]);
    
    // Process validated data
}
```

```blade
{{-- View --}}
<x-forms.date-picker 
    name="start_date"
    :error="$errors->first('start_date')"
/>

<x-forms.image-upload 
    name="avatar"
    :error="$errors->first('avatar')"
/>

<x-forms.rich-text 
    name="content"
    :error="$errors->first('content')"
/>
```

## Common pitfalls

### Missing `old()` input
Always use `old($name, $value)` to preserve input on validation failure:

```blade
{{-- ❌ Wrong: loses input on validation error --}}
<input name="date" value="{{ $value }}">

{{-- ✅ Correct: preserves input --}}
<input name="date" value="{{ old('date', $value) }}">
```

### Script loading order
Use `@once` and `@push('scripts')` to avoid duplicate script tags:

```blade
@once
@push('scripts')
<script src="https://cdn.example.com/library.js"></script>
@endpush
@endonce
```

### Missing error display
Always show validation errors below the field:

```blade
@if($error)
    <p class="text-sm text-red-600 dark:text-red-400">{{ $error }}</p>
@endif
```

## Verification commands

Test custom fields:

```bash
# Create a test form with custom fields
php artisan make:controller TestFormController

# Add validation rules
# Submit invalid data and verify errors display correctly

# Check old() input preservation
# Fill form → submit with validation error → verify fields retain values

# Inspect rendered HTML
# Verify Preline UI classes are applied
# Verify accessibility attributes (id, for, aria-*)
```

## What to read next

- [Form layouts](/v7/forms/layouts) — organize custom fields in responsive layouts
- [Validation](/v7/forms/validation) — client-side and server-side validation patterns
- [UI foundation](/v7/ui-foundation/overview) — Preline UI component library
