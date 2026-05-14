---
title: Form validation
---

# Form validation

Laravolt v7 forms use Laravel's `FormRequest` as the single source of truth for validation. The same rules drive browser validation attributes, `data-validation-rules` JSON, error display, and the final server-side check. {% .lead %}

## The principle

Server-side validation is non-negotiable — it runs regardless of what the browser does. Client-side validation is a UX improvement on top, not a replacement.

Laravolt keeps both layers honest by deriving the client-side behaviour from the server-side rules. Defining validation twice (once in PHP, once in JavaScript) drifts over time. Defining it once, in a `FormRequest`, does not.

## Define a FormRequest

Create a Laravel `FormRequest` like you would on any Laravel project:

```bash
php artisan make:request StoreProductRequest
```

```php
// app/Http/Requests/StoreProductRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Product::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:120'],
            'email' => ['required', 'email'],
            'website' => ['nullable', 'url'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'between:1,1000'],
            'sku' => ['required', 'regex:/^[A-Z]{3}-\d{4}$/'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
        ];
    }

    public function messages(): array
    {
        return [
            'sku.regex' => 'SKU must look like ABC-1234.',
        ];
    }
}
```

The controller signature uses the request object directly:

```php
public function store(StoreProductRequest $request)
{
    $product = Product::create($request->validated());

    return to_route('products.show', $product)->with('success', 'Product created.');
}
```

## Wire the FormRequest into the form

Pass the `FormRequest` class to `->validate()` when opening the form. Laravolt reads its rules and applies them to every matching field.

```blade
{!! PrelineForm::open('products.store')
    ->post()
    ->validate(\App\Http\Requests\StoreProductRequest::class) !!}

    {!! PrelineForm::text('name')->label('Name') !!}
    {!! PrelineForm::email('email')->label('Email') !!}
    {!! PrelineForm::text('website')->label('Website') !!}
    {!! PrelineForm::number('price')->label('Price') !!}
    {!! PrelineForm::number('quantity')->label('Quantity') !!}
    {!! PrelineForm::text('sku')->label('SKU') !!}
    {!! PrelineForm::select('status', [
        'draft' => 'Draft',
        'published' => 'Published',
        'archived' => 'Archived',
    ])->label('Status') !!}

    {!! PrelineForm::submit('Save')->primary() !!}
{!! PrelineForm::close() !!}
```

`->validate()` accepts three things:

1. A `FormRequest` class name (recommended).
2. An instantiated `FormRequest` object.
3. A plain `['field' => 'rule|rule']` array for quick prototypes.

## How rules map to HTML attributes

Laravolt converts common Laravel rules into the HTML attributes browsers understand natively. This lets the browser refuse invalid input before the form submits, without custom JavaScript.

| Laravel rule | Applied attribute(s) | Notes |
| --- | --- | --- |
| `required`, `accepted` | `required="required"` | |
| `email` | `type="email"` | |
| `url`, `active_url` | `type="url"` | |
| `min:n` | `minlength="n"` or `min="n"` | `min` when the field is numeric, `minlength` otherwise |
| `max:n` | `maxlength="n"` or `max="n"` | Same numeric vs. text split |
| `between:a,b` | both `min`/`minlength` and `max`/`maxlength` | |
| `size:n` | exact length or exact value | |
| `digits:n` | `pattern="\d{n}"` | |
| `digits_between:a,b` | `pattern="\d{a,b}"` | |
| `regex:/.../` | `pattern="..."` | Delimiters and flags stripped |
| `in:a,b,c` | `data-validation-accepted-values="a,b,c"` | For custom client handlers |
| `integer`, `numeric`, `decimal` | `inputmode="numeric"` | |

All rules are also exposed as a JSON blob on `data-validation-rules`, so you can wire any custom client-side library without reparsing PHP rules.

```html
<input type="text" name="name" required minlength="3" maxlength="120"
       data-validation-rules='{"required":[],"string":[],"min":["3"],"max":["120"]}'>
```

## Error display

Errors come from Laravel's validator. When a `FormRequest` fails, Laravel redirects back with old input and errors. `PrelineForm` automatically:

- Shows the field in an error state (red border, Preline UI error styling).
- Renders the first message for the field below the input.
- Preserves old input so the user does not retype everything.

You never need `@error` blocks or `old()` calls in a Laravolt form — the builder does both.

## Custom messages and attribute names

Laravel's usual overrides still apply:

```php
// app/Http/Requests/StoreProductRequest.php
public function messages(): array
{
    return [
        'name.required' => 'Give the product a name.',
        'sku.regex' => 'SKU must look like ABC-1234.',
    ];
}

public function attributes(): array
{
    return [
        'sku' => 'product SKU',
    ];
}
```

Custom messages are also surfaced to the client as `data-validation-message` so browser-side UX can show the same text without duplicating strings.

## Array and nested fields

Dotted and bracketed field names are normalised for rule lookup, so the same rule applies whether the field uses `items[0][name]`, `items.0.name`, or a wildcard:

```php
public function rules(): array
{
    return [
        'items.*.name' => ['required', 'string'],
        'items.*.qty' => ['required', 'integer', 'min:1'],
    ];
}
```

```blade
@foreach ($items as $index => $item)
    {!! PrelineForm::text("items[$index][name]")->label('Item name') !!}
    {!! PrelineForm::number("items[$index][qty]")->label('Qty') !!}
@endforeach
```

## Working without a FormRequest

For small or ad-hoc cases, you can pass rules directly to `->validate()`:

```blade
{!! PrelineForm::post('search')->validate([
    'q' => ['required', 'string', 'min:2'],
]) !!}

    {!! PrelineForm::text('q')->label('Search') !!}
    {!! PrelineForm::submit('Go')->primary() !!}

{!! PrelineForm::close() !!}
```

Prefer a real `FormRequest` once the form is used in more than one place — the authorization hook alone is worth the extra file.

## Checking errors manually

If you need to style something outside a field, `PrelineForm` exposes the Laravel error bag through helpers such as `hasError($name)` and `getError($name)`. Reach for them only when a framework-level pattern does not fit; most screens should not need them.

## Testing validation

Treat validation like any other Laravel feature and write assertions against the rules, not the HTML:

```php
// tests/Feature/StoreProductTest.php
use App\Http\Requests\StoreProductRequest;

it('requires a name', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('products.store'), [])
        ->assertSessionHasErrors('name');
});

it('accepts a valid payload', function () {
    $payload = [
        'name' => 'Widget',
        'email' => 'store@example.com',
        'price' => 10,
        'quantity' => 1,
        'sku' => 'ABC-0001',
        'status' => 'draft',
    ];

    $this->actingAs(User::factory()->create())
        ->post(route('products.store'), $payload)
        ->assertRedirect();
});
```

Because Laravolt drives client-side validation from the same rules, passing these tests is enough to keep the UI honest too.

## What to read next

- [Input masking](/v7/forms/input-masking) — add Inputmask-compatible masks on top of validation rules.
- [Forms overview](/v7/forms/overview) — builder basics and model binding.
- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — why deriving client-side behaviour from a server-side contract matters when AI agents contribute code.
