---
title: Notifications
---

# Notifications

Notifications keep users informed about workflow events, approvals, and system changes. Laravolt v7 uses Laravel's notification system with email, database, and in-app channels. {% .lead %}

## Notification channels

Laravel supports multiple channels:
- **Database** — store notifications in database for in-app display
- **Mail** — send email notifications
- **Broadcast** — real-time notifications via WebSockets
- **Slack** — send to Slack channels
- **Custom** — build your own channels

## Basic notification

```php
// app/Notifications/RequisitionSubmitted.php
namespace App\Notifications;

use App\Models\PurchaseRequisition;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequisitionSubmitted extends Notification
{
    use Queueable;

    public function __construct(
        public PurchaseRequisition $requisition
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New requisition requires approval')
            ->line('A new purchase requisition has been submitted.')
            ->line('Requester: ' . $this->requisition->requester->name)
            ->line('Total: $' . number_format($this->requisition->total, 2))
            ->action('Review requisition', route('requisitions.show', $this->requisition))
            ->line('Please review and approve or reject this requisition.');
    }

    public function toDatabase($notifiable): array
    {
        return [
            'requisition_id' => $this->requisition->id,
            'requester_name' => $this->requisition->requester->name,
            'total' => $this->requisition->total,
            'action_url' => route('requisitions.show', $this->requisition),
        ];
    }
}
```

## Sending notifications

```php
// app/Models/PurchaseRequisition.php
use App\Notifications\RequisitionSubmitted;
use App\Notifications\RequisitionApproved;
use App\Notifications\RequisitionRejected;

class PurchaseRequisition extends Model
{
    protected function notifyApprovers()
    {
        $approvers = User::role('approver')->get();

        foreach ($approvers as $approver) {
            $approver->notify(new RequisitionSubmitted($this));
        }
    }

    protected function notifyRequester(string $action)
    {
        $notification = match($action) {
            'approved' => new RequisitionApproved($this),
            'rejected' => new RequisitionRejected($this),
        };

        $this->requester->notify($notification);
    }
}
```

## Email templates

Customize email appearance:

```php
// app/Notifications/RequisitionSubmitted.php
public function toMail($notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('New requisition requires approval')
        ->greeting('Hello ' . $notifiable->name . ',')
        ->line('A new purchase requisition has been submitted and requires your approval.')
        ->line('**Requisition details:**')
        ->line('- Requester: ' . $this->requisition->requester->name)
        ->line('- Date: ' . $this->requisition->created_at->format('M d, Y'))
        ->line('- Total: $' . number_format($this->requisition->total, 2))
        ->line('- Items: ' . $this->requisition->items->count())
        ->action('Review requisition', route('requisitions.show', $this->requisition))
        ->line('Please review this requisition at your earliest convenience.')
        ->salutation('Best regards, ' . config('app.name'));
}
```


## In-app notifications

Display notifications in the UI:

### 1. Database migration

```php
// database/migrations/xxxx_create_notifications_table.php
Schema::create('notifications', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('type');
    $table->morphs('notifiable');
    $table->text('data');
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
});
```

### 2. Notification component

```blade
{{-- resources/views/components/notifications-dropdown.blade.php --}}
<div x-data="{ open: false }" class="relative">
    <button 
        @click="open = !open"
        type="button" 
        class="relative inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        @if($unreadCount = auth()->user()->unreadNotifications->count())
        <span class="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {{ $unreadCount }}
        </span>
        @endif
    </button>

    <div 
        x-show="open"
        @click.away="open = false"
        x-cloak
        class="absolute right-0 z-50 mt-2 w-80 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-neutral-800 dark:divide-neutral-700"
    >
        <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div class="font-medium">Notifications</div>
        </div>

        <div class="max-h-96 overflow-y-auto">
            @forelse(auth()->user()->notifications->take(10) as $notification)
            <a 
                href="{{ $notification->data['action_url'] ?? '#' }}"
                @if(!$notification->read_at)
                    @click="$wire.markAsRead('{{ $notification->id }}')"
                @endif
                class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-700 {{ $notification->read_at ? 'opacity-60' : '' }}"
            >
                <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ $notification->data['title'] ?? 'Notification' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ $notification->data['message'] ?? '' }}
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {{ $notification->created_at->diffForHumans() }}
                    </div>
                </div>
                @if(!$notification->read_at)
                <div class="flex-shrink-0">
                    <span class="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                </div>
                @endif
            </a>
            @empty
            <div class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications
            </div>
            @endforelse
        </div>

        <a href="{{ route('notifications.index') }}" class="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700">
            View all notifications
        </a>
    </div>
</div>
```

### 3. Mark as read

```php
// app/Http/Controllers/NotificationController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()->notifications()->paginate(20);

        return view('notifications.index', compact('notifications'));
    }

    public function markAsRead(string $id)
    {
        auth()->user()->notifications()->findOrFail($id)->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return back()->with('success', 'All notifications marked as read');
    }
}
```

## Notification preferences

Let users control notification channels:

```php
// app/Models/User.php
public function notificationPreferences()
{
    return $this->hasOne(NotificationPreference::class);
}

public function shouldReceiveNotification(string $type, string $channel): bool
{
    $preferences = $this->notificationPreferences;

    if (!$preferences) {
        return true; // Default: receive all
    }

    return $preferences->isEnabled($type, $channel);
}
```

```php
// app/Notifications/RequisitionSubmitted.php
public function via($notifiable): array
{
    $channels = [];

    if ($notifiable->shouldReceiveNotification('requisition_submitted', 'mail')) {
        $channels[] = 'mail';
    }

    if ($notifiable->shouldReceiveNotification('requisition_submitted', 'database')) {
        $channels[] = 'database';
    }

    return $channels;
}
```

## Queued notifications

Send notifications asynchronously:

```php
// app/Notifications/RequisitionSubmitted.php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class RequisitionSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    // Notification will be queued automatically
}
```

## Notification groups

Group related notifications:

```php
// app/Notifications/RequisitionSubmitted.php
public function toDatabase($notifiable): array
{
    return [
        'group' => 'requisitions',
        'requisition_id' => $this->requisition->id,
        'requester_name' => $this->requisition->requester->name,
        'total' => $this->requisition->total,
        'action_url' => route('requisitions.show', $this->requisition),
    ];
}
```

Display grouped notifications:

```blade
@php
$grouped = auth()->user()->notifications->groupBy('data.group');
@endphp

@foreach($grouped as $group => $notifications)
<div class="mb-4">
    <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
        {{ ucfirst($group) }}
    </h3>
    @foreach($notifications as $notification)
        {{-- Display notification --}}
    @endforeach
</div>
@endforeach
```

## Integration with workflows

Trigger notifications at workflow transitions:

```php
// app/Models/PurchaseRequisition.php
use App\Notifications\RequisitionSubmitted;
use App\Notifications\RequisitionApproved;
use App\Notifications\RequisitionRejected;

class PurchaseRequisition extends Model
{
    public function submit()
    {
        $this->state->transitionTo(PendingApproval::class);
        $this->save();

        // Notify approvers
        $this->notifyApprovers();

        // Log activity
        activity()
            ->performedOn($this)
            ->causedBy(auth()->user())
            ->log('Requisition submitted');
    }

    public function approve(User $approver)
    {
        $this->state->transitionTo(Approved::class);
        $this->approved_by = $approver->id;
        $this->approved_at = now();
        $this->save();

        // Notify requester
        $this->requester->notify(new RequisitionApproved($this));

        // Create purchase order
        $this->createPurchaseOrder();
    }

    public function reject(User $approver, string $reason)
    {
        $this->state->transitionTo(Rejected::class);
        $this->rejected_by = $approver->id;
        $this->rejected_at = now();
        $this->rejection_reason = $reason;
        $this->save();

        // Notify requester
        $this->requester->notify(new RequisitionRejected($this, $reason));
    }

    protected function notifyApprovers()
    {
        $approvers = $this->determineApprovers();

        foreach ($approvers as $approver) {
            $approver->notify(new RequisitionSubmitted($this));
        }
    }
}
```

## Verification commands

Test notifications:

```bash
# Send test notification
php artisan tinker
>>> $user = User::first()
>>> $pr = PurchaseRequisition::first()
>>> $user->notify(new RequisitionSubmitted($pr))

# Check database notifications
>>> $user->notifications
>>> $user->unreadNotifications

# Mark as read
>>> $user->unreadNotifications->markAsRead()

# Test email
php artisan queue:work
# Submit requisition → check email inbox

# Test notification preferences
>>> $user->notificationPreferences->disable('requisition_submitted', 'mail')
>>> $user->notify(new RequisitionSubmitted($pr))
# Should only send database notification
```

## Common pitfalls

### Missing queue worker
Queued notifications require a running queue worker:

```bash
# Development
php artisan queue:work

# Production (use Supervisor)
[program:laravel-worker]
command=php /path/to/artisan queue:work --sleep=3 --tries=3
```

### Notification spam
Batch notifications to avoid overwhelming users:

```php
// Instead of notifying immediately
public function submit()
{
    $this->state->transitionTo(PendingApproval::class);
    $this->save();

    // Queue notification for later
    NotifyApprovers::dispatch($this)->delay(now()->addMinutes(5));
}
```

### Missing notification data
Always include action URLs and context:

```php
public function toDatabase($notifiable): array
{
    return [
        'title' => 'New requisition requires approval',
        'message' => 'Requisition #' . $this->requisition->id . ' from ' . $this->requisition->requester->name,
        'action_url' => route('requisitions.show', $this->requisition),
        'requisition_id' => $this->requisition->id,
    ];
}
```

## What to read next

- [Approval flows](/v7/workflows/approval-flows) — state machines and approval patterns
- [Workflow overview](/v7/workflow-and-automation/overview) — workflow automation basics
- [Thunderclap](/v7/admin-workflows/thunderclap) — rapid CRUD with workflow integration
