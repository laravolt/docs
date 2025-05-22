---
title: Auto CRUD
description: Generate CRUD interfaces from configuration files
---

Create, Read, Update, Delete operations are among the most common features in information system development.

---

## Overview

Typical CRUD features include:

1. A page containing a list of data, usually displayed in a datatable complete with searching, sorting, and pagination.
2. Buttons to add, edit, and delete data.

With Auto CRUD, these features don't need to be coded at all. Simply **"define"** what fields need to be displayed from an Eloquent Model, and a complete CRUD feature can automatically be accessed through the application without coding.

## Installation

### Enable Auto CRUD

Make sure `auto-crud` has been enabled:

###### config/laravolt/platform.php

```php
<?php

return [
    'middleware' => ['web', 'auth'],
    'features' => [
        'auto-crud' => true,
    ],
];
```

### Define Your Model

Define your Eloquent Model including its **_relationships_**. The Model here is a regular [Eloquent](https://laravel.com/docs/master/eloquent) class, just like what we usually define in Laravel. The Model is used to interact with the database in the CRUD process.

```php
class User extends Model
{
    public function country()
    {
        return $this->belongsTo("App\\Models\\Country");
    }
}
```

This relationship is optional, but very useful when there are 2 or more models that are interconnected, such as Post and Category. Please read Laravel's official documentation on [Eloquent Relationships](https://laravel.com/docs/master/eloquent-relationships).

### Register Configuration File

Create a new configuration file in the `config/laravolt/auto-crud-resources` folder. The configuration file defines which fields will be displayed in:

- Forms, including validation
- Tables, including `searchable` and `sortable` flags
- Detail pages

Here's a minimal example of a configuration file to create a CRUD based on the User model:

###### config/laravolt/auto-crud-resources/user.php

```php
return [
    'label' => 'User',
    'model' => \App\Models\User::class,

    // optional, if you want to override the default Table
    //'table' => \App\Http\Livewire\Table\UserCustomTable::class

    'schema' => [
        [
            'name' => 'name',
            'type' => \Laravolt\Fields\Field::TEXT,
            'label' => 'Full Name',
        ],
        [
            'name' => 'email',
            'type' => \Laravolt\Fields\Field::EMAIL,
            'label' => 'Email',
        ],
        [
            'name' => 'password',
            'type' => \Laravolt\Fields\Field::PASSWORD,
            'label' => 'Password',
        ],
    ],
];
```

## Customization

### Table Customization

#### Create a Table

```bash
php artisan make:table UserCustomTable
```

#### Define Columns

Modify the skeleton class to look like this:

```php
<?php

namespace App\Http\Livewire\Table;

use Laravolt\AutoCrud\Tables\ResourceTable;
use Laravolt\Suitable\Columns\Label;

class UserCustomTable extends ResourceTable
{
    protected function prepareColumns(): array
    {
        // keep default columns, call parent method
        $columns = parent::prepareColumns();

        // or override and prepare columns from scratch
        // $columns = [];

        // Define additional columns here as needed
        $columns[] = Label::make('status', 'Status');

        return $columns;
    }
}

```

Column documentation can be found at https://laravolt.dev/docs/v6/table/.

#### Add the following entry to your configuration file:

###### config/laravolt/auto-crud-resources/user.php

```php
return [
    // ...existing configuration
    'table' => \App\Http\Livewire\Table\UserCustomTable::class
    // ...
];
```

#### Refresh Your Browser!

## Available Options

### `label`

The text that will be displayed in the menu.

### `model`

The Eloquent Model class that will be called for each CRUD action performed.

### `restful_button`

By default, each row will have three buttons: detail, edit, and delete (restful button).
To hide these buttons, change the `restful_button` option to `false`:

```php
'restful_button' => false,
```

### `schema`

Defines which fields need to be displayed. The minimum entries that must exist are `name`, `type`, and `label`:

```php
'schema' => [
    [
        'name' => 'fullname',
        'type' => 'text',
        'label' => 'Full Name',
    ],
    [
        // others fields...
    ]
]
```

You can refer to the `\Laravolt\Fields\Field` interface to see the available `type` values:

```php
// Input Elements
\Laravolt\Fields\Field::BOOLEAN;
\Laravolt\Fields\Field::CHECKBOX;
\Laravolt\Fields\Field::CHECKBOX_GROUP;
\Laravolt\Fields\Field::COLOR;
\Laravolt\Fields\Field::DATE;
\Laravolt\Fields\Field::DATE_PICKER;
\Laravolt\Fields\Field::DATETIME_PICKER;
\Laravolt\Fields\Field::DROPDOWN;
\Laravolt\Fields\Field::DROPDOWN_COLOR;
\Laravolt\Fields\Field::DROPDOWN_DB;
\Laravolt\Fields\Field::EMAIL;
\Laravolt\Fields\Field::HIDDEN;
\Laravolt\Fields\Field::NUMBER;
\Laravolt\Fields\Field::MULTIROW;
\Laravolt\Fields\Field::PASSWORD;
\Laravolt\Fields\Field::RADIO_GROUP;
\Laravolt\Fields\Field::REDACTOR;
\Laravolt\Fields\Field::RUPIAH;
\Laravolt\Fields\Field::TEXT;
\Laravolt\Fields\Field::TEXTAREA;
\Laravolt\Fields\Field::TIME;
\Laravolt\Fields\Field::UPLOADER;

// Other Elements
\Laravolt\Fields\Field::ACTION;
\Laravolt\Fields\Field::BUTTON;
\Laravolt\Fields\Field::HTML;
\Laravolt\Fields\Field::RESTFUL_BUTTON;
\Laravolt\Fields\Field::SEGMENT;
\Laravolt\Fields\Field::SUBMIT;

// Relationship
\Laravolt\Fields\Field::BELONGS_TO;
```

### Visibility

For each field, the following options can be used to determine whether the field needs to be displayed or not. _By default_ all are **true**.

```php
'show_on_index' => false,
'show_on_detail' => true,
'show_on_create' => true,
'show_on_edit' => true,
```

### Sorting

To determine whether a field can be sorted or not, you can use the `sortable` option. For **Input Elements** type fields, by default `sortable` will be `true`. To disable _sorting_, simply set it to `false`:

```php
'sortable' => false,
```

For **Relationship** type fields, the default value is `false`. To enable sorting, we need to set it to the column name that will be used for sorting on the _related table_:

```php
// sort by "name" column on the "countries" table (or whatever the table name is, according to the relationship definition)
'type' => Laravolt\Fields\Field::BELONGS_TO,
'name' => 'country',
'sortable' => 'name',
'label' => 'Country',
```

By default, the `Laravolt\Fields\Field::BELONGS_TO` field will display data from its relation model in JSON format. To change this, add a public **display()** method to the relation model.

```php
class Country extends Model
{
    public function display()
    {
        //display data from the name column
        return $this->name;
    }
}
```

When adding sorting to a Relationship field, we also need to add the `Laravolt\Suitable\AutoSort` trait to the original model, which is `\App\Models\User`:

```php
use Laravolt\Suitable\AutoSort;

class User extends Model
{
    use AutoSort;

    public function country()
    {
        return $this->belongsTo("App\\Models\\Country");
    }
}
```

The `AutoSort` trait will automatically modify the _query_ to be able to sort on related tables using the join mechanism.

### Searching

To determine whether a field can be searched or not, you can use the `searchable` option. For **Input Elements** type fields, by default `searchable` will be `true`. If you want to remove a column from the search list, simply set it to `false`:

```php
'searchable' => false,
```

For **Relationship** type fields, the default value is `false`. To enable searching on the related table, we need to set it to the appropriate column name:

```php
// search will also be done on the countries.name column
'type' => Laravolt\Fields\Field::BELONGS_TO,
'name' => 'country',
'searchable' => 'name',
'label' => 'Country',
```

### Form Validation

To add validation, simply add "rules":

```php
'rules' => ['required', 'size:10'],
```

#### Using Rule Objects

You can also use Laravel's Rule objects for more complex validation:

```php
'rules' => ['required', \Illuminate\Validation\Rule::unique('users', 'name')],
```

However, when using Rule objects in configuration files, be aware of potential serialization issues when running `php artisan config:cache`. Laravel's `Rule` objects are not directly serializable. To avoid this issue, you have two options:

1. **Use string representation** (Recommended for config files):

   ```php
   'rules' => ['required', 'unique:users,name'],
   ```

2. **Use Rule objects** (Available but requires proper handling):

   ```php
   'rules' => ['required', \Illuminate\Validation\Rule::unique('users', 'name')],
   ```

   If you choose to use Rule objects, ensure your application correctly handles the serialization process or avoid using `config:cache`.

For comprehensive validation examples, see the [Advanced Configuration](#advanced-configuration-considerations) section.

[All validations available in Laravel](https://laravel.com/docs/master/validation#available-validation-rules) can be applied here.

## Field Types (Schema)

### Boolean

```php
[
    'type' => \Laravolt\Fields\Field::BOOLEAN,
    'name' => 'approved',
    'label' => 'Approved?',
],

```

### Checkbox

```php
[
    'type' => \Laravolt\Fields\Field::CHECKBOX,
    'name' => 'remember',
    'label' => 'Remember Me',
],
```

### Checkbox Group

```php
[
    'type' => \Laravolt\Fields\Field::CHECKBOX_GROUP,
    'name' => 'education',
    'label' => 'Last Education',
    'options' => ['elementary', 'junior high', 'high school', 'undergraduate'],
    'inline' => false, // false (default value) or true
],
```

### Color

```php
[
    'type' => \Laravolt\Fields\Field::COLOR,
    'name' => 'color',
    'label' => 'Color',
],
```

### Date

```php
[
    'type' => \Laravolt\Fields\Field::DATE,
    'name' => 'date',
    'label' => 'Date',
],
```

### Date Picker

```php
[
    'type' => \Laravolt\Fields\Field::DATE_PICKER,
    'name' => 'datepicker',
    'label' => 'Date Picker',
],
```

### Datetime Picker

```php
[
    'type' => \Laravolt\Fields\Field::DATETIME_PICKER,
    'name' => 'datetimepicker',
    'label' => 'Datetime Picker',
],
```

### Dropdown

```php
[
    'type' => \Laravolt\Fields\Field::DROPDOWN,
    'name' => 'dropdown',
    'label' => 'Dropdown',
    'options' => [1 => 'Elementary', 2 => 'Junior High', 3 => 'High School'],
],
```

### Dropdown Color

```php
[
    'type' => \Laravolt\Fields\Field::DROPDOWN_COLOR,
    'name' => 'dropdown_color',
    'label' => 'Dropdown Color',
],
```

### Dropdown DB

Dropdown with _option_ choices obtained from database query results.

```php
[
    'type' => \Laravolt\Fields\Field::DROPDOWN_DB,
    'name' => 'dropdown_db',
    'label' => 'Dropdown DB',
    'query' => 'select id, name from users limit 10'
],
```

### Email

```php
[
    'type' => \Laravolt\Fields\Field::EMAIL,
    'name' => 'email',
    'label' => 'Email',
],
```

### Hidden

```php
[
    'type' => \Laravolt\Fields\Field::HIDDEN,
    'name' => 'user_id',
],
```

### Number

```php
[
    'type' => \Laravolt\Fields\Field::NUMBER,
    'name' => 'number',
    'label' => 'Number',
],
```

### Multirow

//TODO

```php

```

### Password

```php
[
    'type' => \Laravolt\Fields\Field::PASSWORD,
    'name' => 'password',
    'label' => 'Password',
],
```

### Radio Group

```php
[
    'type' => \Laravolt\Fields\Field::RADIO_GROUP,
    'name' => 'radio_group',
    'label' => 'Radio Group',
    'options' => [1 => 'Elementary', 2 => 'Junior High', 3 => 'High School'],
    'inline' => false, // false (default value) or true
],
```

### Redactor

```php
[
    'type' => \Laravolt\Fields\Field::REDACTOR,
    'name' => 'article',
    'label' => 'Article',
],
```

### Restful Button

```php
[
    'type' => \Laravolt\Fields\Field::RESTFUL_BUTTON,
    'show_on_create' => false,
    'show_on_edit' => false,
    'show_on_detail' => false,
    'only' => ['show'], // available options: 'show', 'edit', 'destroy'
]
```

### Rupiah

```php
[
    'type' => \Laravolt\Fields\Field::RUPIAH,
    'name' => 'rupiah',
    'label' => 'Rupiah',
],
```

### Text

```php
[
    'type' => \Laravolt\Fields\Field::TEXT,
    'name' => 'text',
    'label' => 'Text',
],
```

### Textarea

```php
[
    'type' => \Laravolt\Fields\Field::TEXTAREA,
    'name' => 'textarea',
    'label' => 'Textarea',
],
```

### Time

```php
[
    'type' => \Laravolt\Fields\Field::TIME,
    'name' => 'time',
    'label' => 'Time (Standard Browser)',
],
```

### Uploader

```php
[
    'name' => 'profile_picture',
    'type' => \Laravolt\Fields\Field::UPLOADER,
    'label' => 'Profile Picture',
    'limit' => 1, // maximum number of files that can be uploaded
    'extensions' => ['jpg', 'png'],
    'fileMaxSize' => 5, // in MB
],
```

## Autofill Value

We can add parameters in the URL query string to provide default values to certain fields.
For example, if we have a form schema like this:

```php
[
    'type' => \Laravolt\Fields\Field::TEXT,
    'name' => 'name',
    'label' => 'Name',
],
```

To provide an initial value to the form, we can add a query string as follows:

```bash
http://localhost/resource/user/create?name=John
```

When the user create page is opened for the first time, the `name` field will automatically be filled with the value "John".

## Advanced Configuration Considerations

### Serialization of Configuration Files

When running `php artisan config:cache` in Laravel, all configuration files are serialized into a single cached file. This can cause issues with certain object types that are not serializable, such as validation `Rule` objects.

#### Error Symptoms

If you're using Rule objects in your config files, you might encounter this error when running `php artisan config:cache` or `php artisan optimize`:

```
LogicException: Your configuration files are not serializable.

Error::("Call to undefined method Illuminate\Validation\Rules\Unique::__set_state()")
```

#### Handling Non-Serializable Rule Objects

To resolve the serialization issue, consider these solutions:

1. **Use string representation for validation rules (Simplest approach):**

   ```php
   // Instead of:
   'rules' => ['required', \Illuminate\Validation\Rule::unique('users', 'name')],

   // Use:
   'rules' => ['required', 'unique:users,name'],
   ```

   This is the most straightforward solution and works in all cases.

2. **Create a custom service provider that converts Rule objects to strings:**

   ```php
   <?php

   namespace App\Providers;

   use Illuminate\Support\ServiceProvider;
   use Illuminate\Validation\Rules\Unique;

   class AutoCrudRuleSerializationProvider extends ServiceProvider
   {
       public function boot()
       {
           if (!$this->app->configurationIsCached()) {
               $this->processAutoCrudResources();
           }
       }

       protected function processAutoCrudResources(): void
       {
           $resources = config('laravolt.auto-crud-resources', []);
           if (empty($resources)) {
               return;
           }

           $processed = [];
           foreach ($resources as $key => $resource) {
               $processed[$key] = $this->processResource($resource);
           }

           // Update the config repository with the processed resources
           config(['laravolt.auto-crud-resources' => $processed]);
       }

       protected function processResource(array $resource): array
       {
           if (!isset($resource['schema']) || !is_array($resource['schema'])) {
               return $resource;
           }

           foreach ($resource['schema'] as $index => $field) {
               if (isset($field['rules']) && is_array($field['rules'])) {
                   $resource['schema'][$index]['rules'] = $this->processRules($field['rules']);
               }
           }

           return $resource;
       }

       protected function processRules(array $rules): array
       {
           return array_map(function ($rule) {
               if (is_array($rule)) {
                   return $this->processRules($rule);
               }

               if ($rule instanceof Unique) {
                   // Convert Unique rule to string format
                   return $this->uniqueRuleToString($rule);
               }

               return $rule;
           }, $rules);
       }

       protected function uniqueRuleToString(Unique $rule): string
       {
           // Extract table and column using reflection
           $table = $this->extractProperty($rule, 'table', 'unknown_table');
           $column = $this->extractProperty($rule, 'column', 'NULL');

           return "unique:{$table},{$column}";
       }

       protected function extractProperty($object, $property, $default = null)
       {
           try {
               $reflector = new \ReflectionClass($object);
               $prop = $reflector->getProperty($property);
               $prop->setAccessible(true);
               $value = $prop->getValue($object);
               return $value ?: $default;
           } catch (\Exception $e) {
               return $default;
           }
       }

           config(['laravolt.auto-crud-resources' => $processed]);
       }

       // Additional helper methods...
   }
   ```

   Then register this provider in your `config/app.php` or `bootstrap/providers.php` file.

#### Best Practices Summary

For optimal experience with Auto CRUD validation rules and Laravel's config cache:

1. **In development environments:**

   - You can use Rule objects directly for better IDE support and type safety
   - Avoid running `php artisan config:cache` or disable it with `php artisan config:clear`

2. **In production environments:**

   - Use string-based validation rules in your configuration files
   - Or implement a rule serialization service provider as shown above
   - Always test your `php artisan optimize` command before deploying

3. **For rule objects with special features:**
   When you need features like `ignore()` for unique rules during updates, create a helper class that converts string rules back to Rule objects at runtime:

   ```php
   <?php

   namespace App\Support;

   use Illuminate\Support\Str;
   use Illuminate\Validation\Rule;

   class RuleHelper
   {
       /**
        * Convert rule strings back to Rule objects during runtime validation.
        */
       public static function resolveRules(array $rules): array
       {
           return array_map(function($rule) {
               if (is_array($rule)) {
                   return self::resolveRules($rule);
               }

               if (!is_string($rule)) {
                   return $rule;
               }

               // Convert unique:table,column back to Rule::unique() object
               if (Str::startsWith($rule, 'unique:')) {
                   $parts = explode(':', $rule, 2);
                   if (isset($parts[1])) {
                       $params = explode(',', $parts[1]);
                       $table = $params[0] ?? null;
                       $column = $params[1] ?? null;

                       if ($table) {
                           return Rule::unique($table, $column);
                       }
                   }
               }

               return $rule;
           }, $rules);
       }
   }
   ```

This approach gives you the best of both worlds: serializable configurations and the full power of Laravel's validation Rule objects when needed.
