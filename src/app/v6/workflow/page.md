---
title: Workflow
nextjs:
  metadata:
    title: Workflow
    description: Business Process Modeling and Execution with Camunda
---

Laravolt Workflow provides a graphical user interface (GUI) for executing BPMN diagrams, leveraging [Camunda REST API](https://docs.camunda.org/manual/latest/), enabling business processes to be quickly executed and validated.

---

## Prerequisites

- Successfully installed Laravolt
- Able to login as an application Admin
- Understanding of BPMN concepts and Camunda Engine

## Installation

Ensure you have installed the Laravolt Camunda package and prepared its configuration:

```bash
composer require laravolt/camunda
```

Add to your `.env` file:

```env
CAMUNDA_URL=http://localhost:8080/engine-rest

#optional
CAMUNDA_TENANT_ID=
CAMUNDA_USER=
CAMUNDA_PASSWORD=
```

Add to your `config/services.php` file:

```php
'camunda' => [
    'url' => env('CAMUNDA_URL', 'https://localhost:8080/engine-rest'),
    'user' => env('CAMUNDA_USER', 'demo'),
    'password' => env('CAMUNDA_PASSWORD', 'demo'),
    'tenant_id' => env('CAMUNDA_TENANT_ID', ''),
],
```

Run `php artisan laravolt:workflow:check` to ensure connection to the Camunda REST API is successful.

## Import BPMN

Login to the application as Admin, select the Workflow > BPMN menu, and click the Add button.

Select a BPMN you want to import. The BPMNs displayed here are ones that have been previously deployed to the Camunda Engine.

Next, you need to define a Module to execute this BPMN.

## Adding a Module

After successfully importing a BPMN, we need to define a Module to execute it. Think of creating a Module as creating a new page, but instead of manually creating Routes, Controllers, Views, or Models one by one, we simply define a configuration file.

First, add a file `config/laravolt/workflow-modules/recruitment.php`. Change the filename `recruitment.php` to match your application's business process.

###### config/laravolt/workflow-modules/recruitment.php

```php
<?php

return [
    'process_definition_key' => 'proc_bl_recruitment',
    'name' => 'Employee Recruitment',
    'tasks' => [],
];
```

Based on this configuration file, the Module can now be accessed at `localhost/workflow/module/recruitment/instances`.

## Adding to the Menu

For easier access to the URL, we can add it to the menu. Create a file `config/laravolt/menu/app.php` with the following content:

```php
<?php

return [
    'App' => [
        'menu' => [
            'Recruitment' => [
                'route' => ['workflow::module.instances.index', 'recruitment'],
                'icon'  => 'inbox'
            ],
        ],
    ],
];
```

Feel free to adjust the `Recruitment` label, the `recruitment` route key, and the `inbox` icon according to your application's needs.

> Available icons can be viewed at https://fontawesome.com/v5/search?s=duotone

## Defining Forms

For each imported BPMN, we need to define form fields for all Start Events and User Tasks.

Open the `recruitment.php` file again, and add:

```php
return [
    'process_definition_key' => 'proc_bl_recruitment',
    'name' => 'Employee Recruitment',
    'tasks' => [
        'StartEvent_1' => [
            'form_schema' => [
                'full_name' => [
                    'type' => 'text',
                    'label' => 'Applicant Name',
                ],
            ],
        ],
    ],
];
```

In the example above, `StartEvent_1` is the ID of the Start Event in the recruitment BPMN. Form definitions can be added in the `form_schema` section. `full_name` is the variable name that will be stored in the application (and sent to the Camunda Engine). Adjust according to your application's needs.

> The IDs of Start Events and User Tasks can be viewed by opening the BPMN file using the Camunda Modeler application.

After all forms for the Start Event have been defined, you can revisit the `localhost/workflow/module/recruitment/instances` page and start a new process by clicking the **+ New** button.

Fill it out and submit. If successful, the data entered will appear on the previous page.

Continue defining forms for other User Tasks. For reference, the complete form definition for the recruitment BPMN can be viewed at https://gist.github.com/uyab/8cbd4bf94b5842646852b12ee42b853d.

In addition to `text`, there are several other field types provided by Laravolt Workflow, including:

- `email`
- `textarea`
- `datepicker`
- `checkbox`
- `boolean`
- `radioGroup`
- `dropdown`
- `uploader`
- `redactor`

Feel free to explore! :)

If all forms have been defined, press the **Action** button to continue the process until there are no more forms to fill (the process is completed).

## Form Listeners

Sometimes there's a need to send data to the Camunda API where the data doesn't come from a user's input form, such as `user_id`.

There are two Events that can be utilized for this. The `\Laravolt\Workflow\Events\ProcessInstanceStarting::class` event is used for the **Start Form** and the `\Laravolt\Workflow\Events\TaskCompleting::class` event is used for **User Task Forms**.

What we need to do is create a Listener class and register it in the configuration file.

The Listener class can be created using the command:

```bash
php artisan make:listener AttachUserId
```

The generated file can be found in the `app/Listeners` folder.

For the `ProcessInstanceStarting` event:

```php
<?php

namespace App\Listeners;

use Laravolt\Workflow\Events\ProcessInstanceStarting;

class AttachUserId
{
    public function handle(ProcessInstanceStarting $event)
    {
        $event->form->modifyVariables(
            function ($variables) {
                $variables['userId'] = ['value' => auth()->id()];

                return $variables;
            }
        );
    }
}
```

For the `TaskCompleting` event:

```php
<?php

namespace App\Listeners;

use Laravolt\Workflow\Events\TaskCompleting;

class MyListener
{
    public function handle(TaskCompleting $event)
    {
        $event->form->modifyVariables(
            function ($variables) {
                $variables['someVariable'] = ['value' => 'foo'];

                return $variables;
            }
        );
    }
}
```

Then, register the Listener that has been created to the corresponding event:

###### config/laravolt/workflow-modules/recruitment.php

```php
return [
    'process_definition_key' => 'proc_bl_recruitment',
    'name' => 'Employee Recruitment',
    'tasks' => [
        'StartEvent_1' => [
            'form_schema' => [],
            'listeners' => [
                \Laravolt\Workflow\Events\ProcessInstanceStarting::class => [
                    \App\Listeners\AttachUserId::class,
                ],
            ],
        ],
        'act_reviewDataDiri' => [
            'form_schema' => [],
            'listeners' => [
                \Laravolt\Workflow\Events\TaskCompleting::class => [
                    \App\Listeners\MyListener::class,
                ],
            ],
        ],
    ],
];
```

## Displaying Data With Tables

After successfully executing the BPMN, the next step is to configure what information needs to be displayed in the table. For simple cases, we can just define `table_variables` in the Module we've created. For more complex cases, we can create our own custom Table View.

### Defining Displayed Columns

Open the `recruitment.php` file again, then add `table_variables`:

###### config/laravolt/workflow-modules/recruitment.php

```php
<?php

return [
    'process_definition_key' => 'proc_bl_recruitment',
    'name' => 'Employee Recruitment',
    'table_variables' => ['full_name', 'job_title'],
    'tasks' => [...]
];
```

All fields we defined in `form_schema` can be used as `table_variables`. Give it a try.

### Custom Table View

For more complex needs, we can create our own Table component by adding the configuration:

```php
    'table' => \App\Http\Livewire\Tables\MyCustomTable::class
    //'table_variables' => ['full_name', 'job_title'], no longer needed
```

The method for creating a Table component can be learned in the [Laravolt Table documentation](https://laravolt.dev/docs/v6/table/).

## Public Form

[TODO]

## Task Assignment

[TODO]
