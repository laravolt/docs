---
title: Input masking
---

# Input masking

Laravolt v7 ships a thin adapter around [Inputmask](https://github.com/RobinHerbots/Inputmask). A `->mask(...)` call on any text-like field produces the `data-inputmask` options Inputmask expects, along with sensible `inputmode` attributes for mobile keyboards. {% .lead %}

## Why masks, not regex

Input masks guide users while they type. A phone mask lets a user see the final format as they key it in; a currency mask adds grouping separators; a date mask refuses letters and keeps the shape of `yyyy-mm-dd`. This is a better UX than "submit and get an error".

Masks complement — they do not replace — [server-side validation](/v7/forms/validation). The mask is polish; the `FormRequest` is the contract.

## Quick start

```blade
{!! PrelineForm::text('phone')->mask('phone') !!}
{!! PrelineForm::text('amount')->mask('currency') !!}
{!! PrelineForm::text('birthday')->mask('date') !!}
```

Each call sets two data attributes on the rendered `<input>`:

```html
<input type="text" name="phone"
       data-mask="phone"
       data-inputmask='{"mask":"(+99) 9999-9999[9]","placeholder":"_"}'
       inputmode="tel">
```

Initialize Inputmask on page load (see [Initializing Inputmask](#initializing-inputmask)) and every masked field is live.

## Available presets

| Preset | Behavior |
| --- | --- |
| `phone` | International-friendly mask `(+99) 9999-9999[9]`. Adds `inputmode="tel"`. |
| `currency` | Inputmask `currency` alias. Default prefix `Rp `, `.` as group separator, `,` as radix point, 0 decimals. Submits the unmasked number. |
| `date` | `datetime` alias with `inputFormat="yyyy-mm-dd"`. |
| `datetime` | `datetime` alias with `inputFormat="yyyy-mm-dd HH:MM"`. |
| `time` | `datetime` alias with `inputFormat="HH:MM"`. |
| `email` | Inputmask `email` alias. |

Override options on any preset by passing a second argument:

```php
PrelineForm::text('birthday')->mask('date', [
    'inputFormat' => 'dd/mm/yyyy',
    'placeholder' => 'dd/mm/yyyy',
]);
```

The override merges on top of the preset definition, so you only supply what you want to change.

## Custom masks

Any string other than a preset name is treated as a raw Inputmask pattern:

```php
PrelineForm::text('sku')->mask('AAA-9999');
PrelineForm::text('ip')->mask('999.999.999.999');
PrelineForm::text('card')->mask('9999 9999 9999 9999');
```

Inputmask's mask characters apply:

| Char | Meaning |
| --- | --- |
| `9` | Numeric |
| `a` | Alphabetical |
| `A` | Alphabetical uppercase |
| `*` | Any |
| `[...]` | Optional group |

See the [Inputmask documentation](https://github.com/RobinHerbots/Inputmask#masking) for the full specification.

## Raw options

When a preset is not expressive enough, pass a raw options array with `->mask([...])` or `->inputmask([...])`. Both forms behave identically — `inputmask` exists for readability.

```php
PrelineForm::text('code')->inputmask([
    'mask' => '999-AAA',
    'casing' => 'upper',
    'placeholder' => '_',
]);

PrelineForm::text('uk_postcode')->mask([
    'mask' => '[a]AA 9[a][a]',
    'greedy' => false,
    'casing' => 'upper',
]);
```

## Removing a mask

Use `->unmask()` to strip mask attributes from a field. Handy for conditionally-masked inputs:

```php
$input = PrelineForm::text('identifier')->mask('AAA-9999');

if ($team->usesFreeFormIds()) {
    $input->unmask();
}
```

## Initializing Inputmask

Laravolt does not bundle the Inputmask JavaScript itself; it only emits the data attributes. Include Inputmask via npm, CDN, or your preferred asset pipeline, then initialize every field that has `data-inputmask`:

```html
<!-- CDN -->
<script src="https://cdn.jsdelivr.net/npm/inputmask@5/dist/inputmask.min.js"></script>

<script>
  document.querySelectorAll('[data-inputmask]').forEach((element) => {
    Inputmask(JSON.parse(element.dataset.inputmask)).mask(element);
  });
</script>
```

Or from an application JavaScript entry:

```js
import Inputmask from 'inputmask';

function initMasks(root = document) {
  root.querySelectorAll('[data-inputmask]').forEach((element) => {
    const options = JSON.parse(element.dataset.inputmask);
    Inputmask(options).mask(element);
  });
}

initMasks();

// Re-run after Livewire updates swap DOM nodes in.
document.addEventListener('livewire:init', () => {
  Livewire.hook('morph.added', ({ el }) => initMasks(el));
});
```

{% callout title="Livewire and dynamic markup" %}
Re-initialize masks after any DOM swap. Livewire's `morph.added` hook, Alpine's `x-init`, or a simple `MutationObserver` on your main content area all work. Without this, fields loaded after the initial page render will not be masked.
{% /callout %}

## Submitting masked values

Some masks (like `currency`) submit the unmasked value by default, because `removeMaskOnSubmit` and `autoUnmask` are enabled in the preset. Others submit the formatted value as typed. Decide per form:

- **Store numbers as numbers.** Currency, phone counts — keep them unmasked on submit so the server parses cleanly.
- **Store formatted values only when the format is part of the business meaning.** For example if your domain treats "ABC-0001" as the canonical identifier, keep it masked.

Either way, document the decision in the corresponding `FormRequest` rule and test it.

## Accessibility notes

- Keep a clear `label` on every masked input. Screen readers depend on it.
- Use `hint()` to describe the expected format in plain language ("Format: `DD/MM/YYYY`").
- Prefer `<label>` text that mirrors the mask intent ("Phone number"), not the mask pattern itself.
- Inputmask already forwards keystrokes to assistive tech; do not block paste events or add custom `beforeinput` handlers that fight the library.

## Testing masks

Masks are a frontend concern, so unit tests focus on the emitted attributes rather than the visual behaviour:

```php
it('applies the phone preset', function () {
    $html = PrelineForm::text('phone')->mask('phone')->render();

    expect($html)
        ->toContain('data-mask="phone"')
        ->toContain('data-inputmask=')
        ->toContain('inputmode="tel"');
});
```

For the browser-level UX, rely on Playwright/Dusk/integration tests that submit the form and assert the server receives the expected value.

## What to read next

- [Validation](/v7/forms/validation) — the server-side contract that masks decorate.
- [Forms overview](/v7/forms/overview) — the full form builder API.
- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — why keeping masks declarative and testable matters when AI tools modify forms.
