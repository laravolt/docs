---
title: Browser testing
---

# Browser testing

Laravolt v7 uses Pest Browser and Playwright to test critical UI flows in a real browser. {% .lead %}

Unit and feature tests prove the backend works. Browser tests prove the product surface works: pages render, forms are usable, validation appears, menus are visible, and role-protected actions behave the way users expect.

{% callout title="v7 work in progress" type="warning" %}
Browser testing support is being introduced for Laravolt v7. Verify the final command names and CI details against the release branch before copying this page into production onboarding.
{% /callout %}

## What to test in a browser

Do not move your whole test suite into the browser. Use browser tests for flows where the HTML, JavaScript, CSS, or Livewire interaction matters.

Good browser test candidates:

- login page smoke test
- navigation and sidebar visibility
- create/edit form rendering
- client-side validation attributes
- input masking behaviour
- Livewire table search/filter/sort
- permission-dependent buttons
- file upload preview flows
- approval workflow happy paths

Keep business rules in feature/unit tests. Keep browser tests focused on the interface contract.

## Install dependencies

Laravolt v7 includes Pest Browser support in the platform setup. A project that runs browser tests also needs Playwright in the application root.

```bash
composer require --dev pestphp/pest-plugin-browser
npm install --save-dev playwright@1.59.1
npx playwright install chromium
```

{% callout title="Why pin Playwright?" %}
The Pest Browser integration expects a compatible Playwright runtime. Pinning the Playwright version used in CI avoids surprises when a new Playwright release changes browser installation behaviour.
{% /callout %}

## The test directory

Put browser tests in `tests/Browser`:

```txt
tests/
  Browser/
    LoginTest.php
    ProductWorkflowTest.php
```

A small smoke test is better than a large brittle flow:

```php
use function Pest\Laravel\get;

it('renders the login page', function () {
    $page = visit('/auth/login');

    $page->assertSee('Login')
        ->assertPresent('input[name="email"]')
        ->assertPresent('input[name="password"]');
});
```

{% callout title="TODO: verify login route" type="warning" %}
Laravolt skeletons may expose the login route as `/auth/login` or another application-specific URL. Keep the generated smoke test aligned with the starter kit route.
{% /callout %}

## Running browser tests

Laravolt v7 provides an artisan wrapper so teams do not need to remember Pest Browser flags:

```bash
php artisan laravolt:test:browser
```

Run only Chromium/Chrome:

```bash
php artisan laravolt:test:browser --browser=chrome
```

Run with debugging enabled:

```bash
php artisan laravolt:test:browser --debug
```

Run in parallel where the test environment supports it:

```bash
php artisan laravolt:test:browser --parallel
```

Under the hood, the command delegates to Pest and targets `tests/Browser` by default.

## CI setup

Browser tests need Node and Playwright installed before the Pest command runs.

```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: 22

- name: Install Playwright
  run: |
    npm install --save-dev playwright@1.59.1
    npx playwright install --with-deps chromium

- name: Run browser tests
  run: php artisan laravolt:test:browser --browser=chrome
```

For faster CI, run browser tests after unit/feature tests pass. Browser failures are usually more expensive to debug, so fail fast on PHP syntax, static analysis, and feature tests first.

## Writing stable browser tests

Prefer tests that check user-visible contracts:

```php
it('shows validation feedback when required fields are empty', function () {
    $page = visit('/products/create');

    $page->press('Save product')
        ->assertSee('The product name field is required');
});
```

Avoid tests that depend on implementation details:

- generated IDs that can change
- CSS classes unrelated to behaviour
- exact animation timing
- third-party network calls
- seeded data that another test mutates

## Browser testing and AI-assisted development

Browser tests are useful guardrails for coding agents. After asking an agent to change a form, table, menu, or workflow, ask it to update the matching browser test.

A good task prompt:

```txt
Update the Product create form to add SKU input masking.
Use PrelineForm. Update the browser test to assert the SKU field is present
and accepts the expected mask pattern. Run laravolt:test:browser if Playwright
is installed; otherwise explain the exact local setup needed.
```

## Troubleshooting

### Playwright is not installed

Install Playwright in the application root:

```bash
npm install --save-dev playwright@1.59.1
npx playwright install chromium
```

### Browser tests pass locally but fail in CI

Check that CI installs browser dependencies with `--with-deps` and that the app key, database, queue, and asset build steps match your normal feature test environment.

### Tests are flaky

Reduce the test scope. Browser tests should verify a small contract, not every detail of a workflow. Move business rule assertions back to feature tests.

## What to read next

- [Forms validation](/v7/forms/validation) — server and client validation conventions.
- [Input masking](/v7/forms/input-masking) — browser-visible field behaviour worth testing.
- [Access control](/v7/security/access-control) — combine policy tests with browser smoke tests for protected UI.
