---
title: Code Quality
description: Tools and practices for maintaining high-quality code
---

This guide outlines the standard tools and practices for maintaining high-quality code in Laravolt projects.

---

## Introduction

What if bugs could be detected without having to run the program? What if bugs could be detected automatically, without requiring manual code review?

The tools described in this document help catch issues early and maintain consistent code quality across projects. While human code reviewers have limited energy and capabilities, automated tools provide consistent, objective analysis based on predefined rules.

This allows code reviewers to focus on more important matters like:

1. Naming
2. Algorithms
3. Class architecture
4. And other aspects that require human wisdom

## Code Style: Pint

### Purpose

Ensure consistent code writing style across programmers even when using different IDEs/editors.

### Tools

[Laravel Pint](https://github.com/laravel/pint) - An opinionated PHP code style fixer for minimalists.

### Installation

```bash
composer require laravel/pint --dev
```

### Usage

> 🌟 Run the following commands from your application folder.

To automatically fix code style issues:

```bash
vendor/bin/pint
```

To check for issues without fixing them, add the `--test` option:

```bash
vendor/bin/pint --test
```

If the command is too long to remember, add a shortcut/alias to composer.json:

```json
"scripts": {
    "pint": [
        "vendor/bin/pint"
    ]
}
```

Then you can simply call the alias defined above:

```bash
composer pint
```

### Custom Configuration

Create a `pint.json` file in your project root:

```json
{
  "preset": "psr12",
  "rules": {
    "simplified_null_return": true,
    "braces": false,
    "new_with_braces": { "anonymous_class": false, "named_class": false }
  }
}
```

## Static Analysis

### Purpose

Find bugs before bugs find us.

### Tools

- [PHPStan](https://phpstan.org/)
- [Larastan](https://github.com/larastan/larastan) - PHPStan extension for Laravel

### Installation

```bash
composer require larastan/larastan --dev
composer require spaze/phpstan-disallowed-calls --dev
```

### Configuration

Create a `phpstan.neon` file in your project root:

```yaml
includes:
  - ./vendor/larastan/larastan/extension.neon
  - ./vendor/spaze/phpstan-disallowed-calls/extension.neon

parameters:
  paths:
    - app
    - config

  # The level 9 is the highest level
  level: 8

  disallowedFunctionCalls:
    - function: 'env()'
      message: 'use config() instead'
      allowIn:
        - config/*.php
```

### Usage

```bash
vendor/bin/phpstan analyse
```

## Cognitive Complexity

### Purpose

Ensure code is readable and maintainable over the long term.

### Tools

[SonarLint](https://www.sonarlint.org/) - IDE extension that helps you detect and fix quality issues as you write code.

### Installation

- For IntelliJ IDEA: Install the SonarLint plugin through the marketplace
- For VS Code: Install the SonarLint extension from the VS Code marketplace
- For other IDEs: Check the SonarLint website for available integrations

## GrumPHP

### Purpose

Running all the above tools every time we make code changes can be time-consuming and easy to forget. Therefore, Laravolt comes equipped with GrumPHP, which automatically performs checks whenever we commit. If any check fails, the commit cannot proceed, and we must fix the code first.

### Installation

```bash
composer require phpro/grumphp --dev
```

### Configuration

Create a `grumphp.yml` file in your project root:

```yaml
grumphp:
  tasks:
    phpstan:
      configuration: phpstan.neon
      use_grumphp_paths: false
```

### Usage

#### Manual Check

```bash
vendor/bin/grumphp run
```

#### Automatic Integration with Git

```bash
vendor/bin/grumphp git:init
```

After running the above code, GrumPHP will automatically run before each commit.

## Best Practices

### Follow Laravel Conventions

Adhere to the Laravel way of doing things whenever possible. The framework provides many conventions and helpers that maintain code quality and readability.

### Write Tests

Implement automated tests for critical functionality. Laravel provides excellent testing tools that are easy to use.

```bash
php artisan make:test FeatureTest
```

### Document Complex Logic

Add comments for complex code sections to help other developers (and your future self) understand the reasoning behind implementation decisions.

### Keep Functions Small and Focused

Each function should have a single responsibility. If a function is growing too large or handling multiple tasks, consider breaking it down into smaller, more manageable parts.

### Use Type Declarations

PHP 7.4+ and Laravel 8+ support type declarations for properties, parameters, and return values, which can help catch type-related bugs early.

```php
public function calculateTotal(int $quantity, float $price): float
{
    return $quantity * $price;
}
```

### Regularly Update Dependencies

Keep your dependencies up-to-date with security patches and new features, but be cautious with major version updates.

```bash
composer update
```

### Review Code Changes

Even with all these automated tools, human code review remains essential. Always have another developer review your code before merging it into the main branch.
