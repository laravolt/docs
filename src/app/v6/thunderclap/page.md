---
title: Thunderclap
description: CRUD code generator for Laravolt applications
nextjs:
  metadata:
    title: Thunderclap Code Generator
    description: Learn how to use Thunderclap to generate consistent, high-quality CRUD code for your Laravolt applications.
---

Thunderclap is a powerful code generator that accelerates development by automatically generating CRUD (Create, Read, Update, Delete) code based on your database schema and predefined templates.

---

## Overview

Building CRUD interfaces is a common but often repetitive task in web development. Thunderclap addresses this challenge by automating the generation of controllers, models, views, and routes based on your database structure. This approach offers several advantages:

- **Consistency**: Maintains coding standards across your entire application
- **Efficiency**: Reduces development time for routine CRUD operations
- **Quality**: Eliminates simple errors that can occur during manual coding
- **Focus**: Frees developers to concentrate on complex business logic

Thunderclap reads your database schema and generates code according to templates that you can customize to match your project's specific requirements.

## Installation

Install Thunderclap via Composer:

```bash
composer require laravolt/thunderclap
```

## Basic Usage

The simplest way to use Thunderclap is with the `laravolt:clap` Artisan command:

```bash
php artisan laravolt:clap
```

This interactive command will:

1. Ask you to select a database table
2. Generate a complete set of CRUD files based on that table
3. Create a new module in the `modules` directory

### Command Options

You can also specify options directly on the command line:

```bash
php artisan laravolt:clap --table=users --template=custom --force
```

| Option       | Description                                   |
| ------------ | --------------------------------------------- |
| `--table`    | The database table to use for code generation |
| `--template` | The template to use (default: "laravolt")     |
| `--force`    | Overwrite existing files                      |

## Module Registration

After generating code, you need to register the new module in your application:

### 1. Update Composer Autoloading

Add the modules directory to your PSR-4 autoloading configuration in `composer.json`:

```json
"autoload": {
    "psr-4": {
        "App\\": "app/",
        "Modules\\": "modules"
    }
}
```

### 2. Register Service Provider

Add the generated service provider to your `config/app.php` file. For example, if you generated code for a table named "categories":

```php
'providers' => [
    // Other service providers...

    Modules\Category\Providers\CategoryServiceProvider::class,

    // Application service providers...
],
```

### 3. Update Autoloader

Run the following command to update the Composer autoloader:

```bash
composer dumpautoload
```

## Customizing Templates

Thunderclap comes with default templates designed for Laravolt admin panels, but you can create your own templates tailored to your project needs.

### 1. Publish the Configuration

First, publish the configuration file:

```bash
php artisan vendor:publish --provider="Laravolt\Thunderclap\ServiceProvider"
```

### 2. Configure Custom Templates

Edit the `config/laravolt/thunderclap.php` file to add your custom template:

```php
// Template skeleton (stubs)
'default' => 'custom',

// name => directory path, relative with stubs directory or absolute path
'templates' => [
    'laravolt' => 'laravolt',
    'custom' => base_path('stubs/custom'),
],
```

### 3. Create Template Files

Create a new directory for your templates at `stubs/custom`. The easiest way to start is by copying the default templates:

```bash
mkdir -p stubs/custom
cp -r vendor/laravolt/thunderclap/stubs/laravolt/* stubs/custom/
```

### 4. Modify Template Files

Edit the template files in `stubs/custom` according to your needs. These files are standard PHP files with `.stub` extensions that contain placeholders that will be replaced during code generation.

Common placeholders include:

| Placeholder       | Description                                     |
| ----------------- | ----------------------------------------------- |
| `{{ class }}`     | The class name (e.g., "User")                   |
| `{{ namespace }}` | The namespace (e.g., "Modules\User")            |
| `{{ table }}`     | The database table name (e.g., "users")         |
| `{{ fields }}`    | Generated form fields based on the table schema |

### 5. Generate Code with Custom Template

Generate code using your custom template:

```bash
php artisan laravolt:clap --template=custom
```

## Template Structure

A complete template set should include the following files (all with `.stub` extensions):

```
stubs/custom/
├── Controller.stub
├── Model.stub
├── Provider.stub
├── Route.stub
├── lang.stub
├── views/
│   ├── create.stub
│   ├── edit.stub
│   ├── index.stub
│   └── show.stub
└── tests/
    └── Feature.stub
```

## Advanced Template Customization

### Working with Fields

Thunderclap automatically generates form fields based on the database schema, but you can customize how these fields are rendered by modifying the view templates.

### Example: Custom Form Field Template

Here's an example of how you might customize a form field in a template:

```blade
@foreach($fields as $field)
    <x-volt-field
        name="{{ $field->name }}"
        label="{{ $field->label }}"
        required="{{ $field->required }}"
        type="{{ $field->htmlType }}"
    >
        @if($field->htmlType === 'select')
            @foreach($field->options as $value => $label)
                <option value="{{ $value }}">{{ $label }}</option>
            @endforeach
        @endif
    </x-volt-field>
@endforeach
```

### Conditional Logic

You can include conditional logic in your templates using standard PHP syntax:

```php
@if($hasSoftDeletes)
    use Illuminate\Database\Eloquent\SoftDeletes;
@endif

class {{ class }} extends Model
{
    @if($hasSoftDeletes)
    use SoftDeletes;
    @endif

    // Other model code
}
```

### Extending Models

For models that need relationships or additional methods:

```php
protected $fillable = [
    {{ fillable }}
];

// Add your relationships here
public function categories()
{
    return $this->belongsToMany(Category::class);
}
```

## Best Practices

### 1. Start with Default Templates

Begin with the default templates and make incremental changes as needed. This approach helps you understand how Thunderclap works before making major customizations.

### 2. Modular Design

Design your templates with modularity in mind. Focus on creating reusable components that can be included across multiple views.

### 3. Code Review

Always review the generated code before deploying to production. While Thunderclap aims to produce high-quality code, your specific business requirements may necessitate manual adjustments.

### 4. Version Control

Keep your templates under version control to track changes and collaborate with team members.

### 5. Balance Automation and Customization

Aim for a balance between automation and customization. It's often better to generate 80% of the code automatically and manually implement the remaining 20% with complex business logic than to create overly complex templates.

## Troubleshooting

### Common Issues

#### Missing Service Provider

**Issue**: After generating code, the application throws a "Class not found" exception.

**Solution**: Ensure you've registered the service provider in `config/app.php` and run `composer dumpautoload`.

#### Template Not Found

**Issue**: The command reports that a template cannot be found.

**Solution**: Check the path in your `thunderclap.php` configuration file and make sure the template directory exists.

#### Database Connection Issues

**Issue**: Thunderclap cannot read the database schema.

**Solution**: Verify your database connection settings and ensure the table exists.

## Related Documentation

- [CRUD Operations](/v6/auto-crud) - For information on the Auto CRUD feature that works with Thunderclap
- [Form Components](/v6/form) - Documentation on form components that can be used in templates
- [Table Components](/v6/table) - Learn about table components for displaying data
