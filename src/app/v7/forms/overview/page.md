---
title: Forms overview
---

# Forms overview

`PrelineForm` is Laravolt v7's form builder. It renders Preline UI + Tailwind CSS markup, preserves old input, shows validation errors, and integrates with Laravel `FormRequest` validation and Inputmask — all through one fluent API. {% .lead %}

## Why a form builder

Most real business UIs spend far too much code on forms: field containers, labels, errors, old input, accessibility attributes, model binding, CSRF tokens. Copying these patterns across a project leads to inconsistent UIs, accessibility regressions, and subtle validation bugs.

`PrelineForm` turns forms into a small, declarative API so every form in a Laravolt project looks, behaves, and fails the same way.

Raw Laravel Blade:

```blade
<form method="POST" action="{{ route('users.store') }}" class="space-y-6">
  @csrf
  <div>
    <label for="email" class="block text-sm">Email</label>
    <input id="email" name="email" type="email"
           value="{{ old('email') }}"
           class="mt-1 block w-full rounded-lg border-gray-200 @error('email') border-red-500 @enderror" />
    @error('email')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror
  </div>

  <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-white">Save</button>
</form>
```

Same form with `PrelineForm`:

```php
{!! PrelineForm::open('users.store')->post() !!}
    {!! PrelineForm::email('email')->label('Email')->required() !!}
    {!! PrelineForm::submit('Save')->primary() !!}
{!! PrelineForm::close() !!}
```

CSRF, old input, validation errors, accessible labels, dark mode styling, and Preline UI classes are all applied by the builder.

## The API surface

Every form is built with three groups of methods.

### 1. Opening the form

```php
PrelineForm::open('users.store');      // action="{{ route('users.store') }}" method=POST
PrelineForm::open()->get();            // method=GET
PrelineForm::open()->post();           // method=POST (default)
PrelineForm::open()->put();
PrelineForm::open()->patch();
PrelineForm::open()->delete();

// Short syntax
PrelineForm::post('users.store');
PrelineForm::put('users.update');
PrelineForm::delete('users.destroy');

// Action sources
PrelineForm::open()->action(url('/users'));
PrelineForm::open()->route('users.store', ['team' => $team]);

// File uploads
PrelineForm::open('users.store')->post()->multipart();

// Disable CSRF token (rare)
PrelineForm::post('search')->withoutToken();
```

A hidden `_token` is injected automatically for non-GET forms. `put`, `patch`, and `delete` add the `_method` hidden field expected by Laravel.

### 2. Adding fields

```php
PrelineForm::text('name')->label('Full name')->required();
PrelineForm::email('email')->label('Email');
PrelineForm::password('password')->label('Password');
PrelineForm::number('age')->min(0)->max(120)->step(1);
PrelineForm::textarea('bio')->rows(5);
PrelineForm::date('birthday');
PrelineForm::time('start_at');
PrelineForm::color('theme');

PrelineForm::select('country', $countries)->placeholder('--Select--');
PrelineForm::selectMultiple('tags', $tags);
PrelineForm::checkbox('terms', 1)->label('I agree');
PrelineForm::checkboxGroup('fruits', ['apple' => 'Apple', 'banana' => 'Banana']);
PrelineForm::radio('plan', 'pro')->label('Pro plan');
PrelineForm::radioGroup('plan', ['free' => 'Free', 'pro' => 'Pro'], 'pro');

PrelineForm::file('avatar')->accept('image/*');
PrelineForm::hidden('team_id', $team->id);
```

Every field accepts a chainable modifier set:

```php
PrelineForm::text('username')
    ->label('Username')
    ->placeholder('jane.doe')
    ->hint('Letters, numbers, dots, and dashes only.')
    ->required()
    ->id('username')
    ->addClass('font-mono')
    ->attributes(['maxlength' => 32])
    ->data('role', 'username-field');
```

See [Validation](/v7/forms/validation) and [Input masking](/v7/forms/input-masking) for server-driven client-side validation and Inputmask integration.

### 3. Actions and closing the form

```php
PrelineForm::submit('Save')->primary();
PrelineForm::button('Cancel')->secondary();
PrelineForm::submit('Delete')->danger();
PrelineForm::submit('Confirm')->success();

PrelineForm::close();
```

Buttons share the same variant names across the platform so a UI convention can be taught once.

## Model binding

Most admin forms are either "create" or "edit" against a model. Laravolt handles both with one API:

```php
// Create
{!! PrelineForm::open('users.store')->post() !!}
    {!! PrelineForm::text('name')->label('Name') !!}
{!! PrelineForm::close() !!}

// Edit: pass the model to open()
{!! PrelineForm::open('users.update', $user)->put() !!}
    {!! PrelineForm::text('name')->label('Name') !!}
{!! PrelineForm::close() !!}

// Or bind explicitly
{!! PrelineForm::bind($user)->put(route('users.update', $user)) !!}
    {!! PrelineForm::text('name')->label('Name') !!}
{!! PrelineForm::close() !!}
```

Bound forms pre-fill each field by the field name, fall back to `old()` input when validation fails, and preserve unsaved values on re-render.

{% callout title="v7 compatibility with v6 syntax" %}
`PrelineForm` keeps method signatures compatible with the earlier `Form` facade from v6 (`laravolt/semantic-form`). See [Upgrade guide](/v7/upgrade-guide) for the concrete migration steps.
{% /callout %}

## A complete example

```php
{!! PrelineForm::open('products.store', $product ?? null)
    ->post()
    ->multipart()
    ->validate(StoreProductRequest::class) !!}

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="space-y-4">
            {!! PrelineForm::text('name')->label('Product name')->required() !!}
            {!! PrelineForm::textarea('description')->label('Description')->rows(4) !!}
            {!! PrelineForm::number('price')->label('Price')->mask('currency') !!}
        </div>

        <div class="space-y-4">
            {!! PrelineForm::select('category_id', $categories)
                ->label('Category')
                ->placeholder('Select a category')
                ->required() !!}

            {!! PrelineForm::file('images')
                ->label('Images')
                ->accept('image/*')
                ->multiple() !!}

            {!! PrelineForm::checkbox('is_featured', 1)->label('Featured product') !!}
        </div>
    </div>

    <div class="mt-6 flex gap-3">
        {!! PrelineForm::submit('Save product')->primary() !!}
        {!! PrelineForm::link('Cancel', route('products.index'))->secondary() !!}
    </div>

{!! PrelineForm::close() !!}
```

This example combines model binding, server-side validation through `StoreProductRequest`, input masking for currency, multipart uploads, and a Preline UI-styled action bar. It compiles conceptually against Laravolt v7 APIs.

## Reusable fields

Macros register reusable field types at service provider boot time:

```php
// app/Providers/AppServiceProvider.php
use Laravolt\PrelineForm\Facade as PrelineForm;

public function boot(): void
{
    PrelineForm::macro('phone', function (string $name, ?string $value = null) {
        return PrelineForm::text($name, $value)->mask('phone')->hint('Include area code');
    });
}
```

```blade
{!! PrelineForm::phone('mobile')->label('Mobile number') !!}
```

Macros are the recommended way to extend the builder: they keep the fluent API consistent and are easy to discover from tests.

## What to read next

- [Validation](/v7/forms/validation) — share a Laravel `FormRequest` with the browser for client-side and server-side validation.
- [Input masking](/v7/forms/input-masking) — phone, currency, date, and custom masks via Inputmask.
- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — why these conventions matter when coding agents collaborate on your project.
