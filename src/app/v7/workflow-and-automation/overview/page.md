---
title: Workflow and automation
---

# Workflow and automation

Laravolt v7 includes workflow primitives for teams that need more than CRUD: approvals, task handoffs, process state, background synchronization, and operational evidence. {% .lead %}

Use the workflow module when a business process has named steps, multiple actors, or state that must be reviewed later.

## When to model a workflow

A workflow is useful when the feature needs to answer questions like:

- who can start this process?
- which task is active now?
- who is allowed to complete the task?
- what data was submitted at each step?
- what should happen before or after a task is completed?
- how do we synchronize external process state back into Laravel?

If the process is only a simple create/edit/delete screen, keep it as a normal admin workflow. If it has approvals, assignments, or long-running state, model it explicitly.

## The public surface

The workflow package exposes a small service surface around modules, forms, Camunda tasks, and local process instances.

```php
use Laravolt\Workflow\Entities\Module;
use Laravolt\Workflow\WorkflowService;

$instance = app(WorkflowService::class)->start(
    module: $module,
    data: $request->validated(),
);
```

For user tasks, submit the active task with validated data:

```php
app(WorkflowService::class)->submitTask(
    module: $module,
    task: $task,
    data: $request->validated(),
);
```

The service validates the form schema, dispatches task/process events used by the package, talks to Camunda, and synchronizes local process instance state.

## Lifecycle events

Use workflow events for side effects instead of hiding business logic in controllers. The package exposes event classes for process and task lifecycle points, including:

- `ProcessInstanceStarting`
- `ProcessInstanceStarted`
- `ProcessInstanceCompleting`
- `ProcessInstanceCompleted`
- `TaskCompleting`
- `TaskCompleted`

The current service path dispatches `ProcessInstanceStarting`, `TaskCompleting`, and `TaskCompleted` around start/task submission. Treat the other event classes as extension points and verify dispatch coverage before depending on them in production.

A common pattern is to keep validation in the form schema, state transition in the workflow service, and notifications/audit logging in event listeners.

## Artisan commands

The package ships operational commands:

```bash
php artisan laravolt:workflow:check
php artisan laravolt:workflow:sync-instances
```

Use `laravolt:workflow:check` during setup to confirm workflow integration health. Use `laravolt:workflow:sync-instances` from the scheduler or an operator runbook when local process state must be refreshed from the workflow engine.

## Automation with queues

Workflows often trigger long-running work. Keep the request cycle short:

```php
use Illuminate\Support\Facades\Event;
use Laravolt\Workflow\Events\TaskCompleted;

Event::listen(TaskCompleted::class, function (TaskCompleted $event) {
    GenerateApprovalPdf::dispatch($event->instance->id);
});
```

Put external API calls, PDF generation, notifications, and indexing into queued jobs. Workflow events should describe what happened; jobs should perform slow work safely with retries.

## AI-assisted workflow development

Workflow code is a strong fit for AI-assisted development if the process boundaries are explicit. Give coding agents the process vocabulary before asking for implementation:

```txt
Implement a Laravolt workflow for PurchaseOrderApproval.
Steps: draft, manager_review, finance_review, approved, rejected.
Use FormRequest or workflow form schema validation.
Do not bypass WorkflowService::start() or submitTask().
Add listeners for audit logging and tests for allowed/denied transitions.
```

Require agents to add tests around transitions, permissions, and event listeners. Never accept a generated workflow that only hides or shows buttons without protecting the underlying task submission.

## Checklist

- [ ] The process has named states and task keys.
- [ ] Start and task forms validate input before submission.
- [ ] Controllers call `WorkflowService` instead of duplicating transition logic.
- [ ] Events record audit evidence and dispatch slow work to queues.
- [ ] Permissions protect who can start and complete each task.
- [ ] Sync/check commands are covered by the deployment runbook.

## What to read next

- [Admin workflows](/v7/admin-workflows/overview) — structure resource screens around business operations.
- [Access control](/v7/security/access-control) — protect task submissions and workflow actions.
- [Artisan commands](/v7/reference/artisan-commands) — operational commands shipped by Laravolt.
