---
title: Modals
---

# Modals

Modals display focused content and actions without leaving the current page. Laravolt v7 uses Alpine.js and Preline UI for accessible, keyboard-navigable modals. {% .lead %}

## Basic modal

```blade
<div x-data="{ open: false }">
    {{-- Trigger button --}}
    <button 
        @click="open = true"
        type="button" 
        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
    >
        Open modal
    </button>

    {{-- Modal --}}
    <div 
        x-show="open"
        x-cloak
        @keydown.escape.window="open = false"
        class="fixed inset-0 z-50 overflow-y-auto"
    >
        {{-- Backdrop --}}
        <div 
            x-show="open"
            x-transition:enter="ease-out duration-300"
            x-transition:enter-start="opacity-0"
            x-transition:enter-end="opacity-100"
            x-transition:leave="ease-in duration-200"
            x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0"
            @click="open = false"
            class="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
        ></div>

        {{-- Modal content --}}
        <div class="flex min-h-full items-center justify-center p-4">
            <div 
                x-show="open"
                x-transition:enter="ease-out duration-300"
                x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                x-transition:leave="ease-in duration-200"
                x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                @click.away="open = false"
                class="relative w-full max-w-lg bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
            >
                {{-- Header --}}
                <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3 class="font-bold text-gray-800 dark:text-white">
                        Modal title
                    </h3>
                    <button 
                        @click="open = false"
                        type="button" 
                        class="inline-flex items-center justify-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
                    >
                        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {{-- Body --}}
                <div class="p-4 overflow-y-auto">
                    <p class="text-gray-800 dark:text-neutral-400">
                        Modal content goes here.
                    </p>
                </div>

                {{-- Footer --}}
                <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                    <button 
                        @click="open = false"
                        type="button" 
                        class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
```


## Confirmation dialog

Confirm destructive actions:

```blade
<div x-data="{ confirmDelete: false }">
    <button 
        @click="confirmDelete = true"
        type="button" 
        class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
    >
        Delete user
    </button>

    <div 
        x-show="confirmDelete"
        x-cloak
        @keydown.escape.window="confirmDelete = false"
        class="fixed inset-0 z-50 overflow-y-auto"
    >
        <div 
            x-show="confirmDelete"
            @click="confirmDelete = false"
            class="fixed inset-0 bg-gray-900 bg-opacity-50"
        ></div>

        <div class="flex min-h-full items-center justify-center p-4">
            <div 
                x-show="confirmDelete"
                @click.away="confirmDelete = false"
                class="relative w-full max-w-md bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
            >
                <div class="p-4 sm:p-7">
                    <div class="text-center">
                        <div class="mb-4 inline-flex justify-center items-center size-12 rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
                            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h3 class="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">
                            Delete user?
                        </h3>
                        <p class="text-gray-500 dark:text-neutral-500">
                            This action cannot be undone. All data associated with this user will be permanently deleted.
                        </p>

                        <div class="mt-6 flex justify-center gap-x-4">
                            <button 
                                @click="confirmDelete = false"
                                type="button" 
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </button>
                            <form method="POST" action="{{ route('users.destroy', $user) }}">
                                @csrf
                                @method('DELETE')
                                <button 
                                    type="submit"
                                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete user
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Form modal

Submit forms inside modals:

```blade
<div x-data="{ showForm: false }">
    <button 
        @click="showForm = true"
        type="button" 
        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
    >
        Create user
    </button>

    <div 
        x-show="showForm"
        x-cloak
        @keydown.escape.window="showForm = false"
        class="fixed inset-0 z-50 overflow-y-auto"
    >
        <div 
            x-show="showForm"
            @click="showForm = false"
            class="fixed inset-0 bg-gray-900 bg-opacity-50"
        ></div>

        <div class="flex min-h-full items-center justify-center p-4">
            <div 
                x-show="showForm"
                @click.away="showForm = false"
                class="relative w-full max-w-lg bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
            >
                <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3 class="font-bold text-gray-800 dark:text-white">
                        Create new user
                    </h3>
                    <button 
                        @click="showForm = false"
                        type="button" 
                        class="inline-flex items-center justify-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
                    >
                        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-4">
                    {!! PrelineForm::open('users.store')->post() !!}
                        <div class="space-y-4">
                            {!! PrelineForm::text('name')->label('Full name')->required() !!}
                            {!! PrelineForm::email('email')->label('Email')->required() !!}
                            {!! PrelineForm::password('password')->label('Password')->required() !!}
                        </div>

                        <div class="mt-6 flex justify-end gap-x-2">
                            <button 
                                @click="showForm = false"
                                type="button" 
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </button>
                            {!! PrelineForm::submit('Create user')->primary() !!}
                        </div>
                    {!! PrelineForm::close() !!}
                </div>
            </div>
        </div>
    </div>
</div>
```

## Livewire integration

Use Livewire for dynamic modal content:

```blade
{{-- Livewire component --}}
<div>
    <button 
        wire:click="$set('showModal', true)"
        type="button" 
        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
    >
        Edit user
    </button>

    @if($showModal)
    <div 
        x-data="{ open: @entangle('showModal') }"
        x-show="open"
        x-cloak
        @keydown.escape.window="open = false"
        class="fixed inset-0 z-50 overflow-y-auto"
    >
        <div 
            x-show="open"
            @click="open = false"
            class="fixed inset-0 bg-gray-900 bg-opacity-50"
        ></div>

        <div class="flex min-h-full items-center justify-center p-4">
            <div 
                x-show="open"
                @click.away="open = false"
                class="relative w-full max-w-lg bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
            >
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
                        Edit user
                    </h3>

                    <form wire:submit="save">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Name</label>
                                <input wire:model="name" type="text" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                                @error('name') <span class="text-sm text-red-600">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end gap-x-2">
                            <button 
                                wire:click="$set('showModal', false)"
                                type="button" 
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
```

## Accessibility

Modals must be keyboard-navigable and screen-reader friendly:

- **Escape key**: Close modal with `@keydown.escape.window="open = false"`
- **Click outside**: Close with `@click.away="open = false"`
- **Focus trap**: Keep focus inside modal while open
- **ARIA attributes**: Add `role="dialog"` and `aria-labelledby`

```blade
<div 
    role="dialog"
    aria-labelledby="modal-title"
    aria-modal="true"
    x-show="open"
    class="..."
>
    <h3 id="modal-title" class="...">
        Modal title
    </h3>
    ...
</div>
```

## Common pitfalls

### Missing x-cloak
Add `x-cloak` to prevent flash of unstyled content:

```blade
<div x-show="open" x-cloak class="...">
```

### Z-index conflicts
Ensure modal z-index is higher than other elements:

```blade
<div class="fixed inset-0 z-50 ...">
```

### Form submission in modals
Use Livewire or AJAX to avoid page reload:

```blade
<form wire:submit="save">
    {{-- Form fields --}}
</form>
```

## Verification commands

Test modals:

```bash
# Open modal → verify backdrop appears
# Press Escape → verify modal closes
# Click outside → verify modal closes
# Submit form → verify validation errors display
# Check dark mode → verify dark: classes apply

# Accessibility check
# Tab through modal → verify focus stays inside
# Screen reader → verify role="dialog" and aria-* attributes
```

## What to read next

- [Buttons](/v7/ui-components/buttons) — trigger modals from buttons
- [Forms overview](/v7/forms/overview) — forms inside modals
- [Livewire integration](/v7/ui-foundation/overview) — dynamic modal content
