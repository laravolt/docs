---
title: Approval flows
---

# Approval flows

Multi-step approval workflows route documents through sequential approvers with state tracking, notifications, and audit trails. Laravolt v7 uses state machines to model approval flows. {% .lead %}

## Why state machines

Approval flows have:
- **Discrete states** — draft, pending, approved, rejected
- **Transitions** — submit, approve, reject, revise
- **Guards** — only certain users can approve
- **Side effects** — send notifications, log changes

State machines make these rules explicit and testable.

## Basic approval flow

Purchase requisition → approval → purchase order:

### 1. Define states and transitions

```php
// app/States/PurchaseRequisitionState.php
namespace App\States;

use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

abstract class PurchaseRequisitionState extends State
{
    abstract public function canEdit(): bool;
    abstract public function canSubmit(): bool;
    abstract public function canApprove(): bool;

    public static function config(): StateConfig
    {
        return parent::config()
            ->default(Draft::class)
            ->allowTransition(Draft::class, PendingApproval::class)
            ->allowTransition(PendingApproval::class, Approved::class)
            ->allowTransition(PendingApproval::class, Rejected::class)
            ->allowTransition(Rejected::class, Draft::class);
    }
}

class Draft extends PurchaseRequisitionState
{
    public function canEdit(): bool { return true; }
    public function canSubmit(): bool { return true; }
    public function canApprove(): bool { return false; }
}

class PendingApproval extends PurchaseRequisitionState
{
    public function canEdit(): bool { return false; }
    public function canSubmit(): bool { return false; }
    public function canApprove(): bool { return true; }
}

class Approved extends PurchaseRequisitionState
{
    public function canEdit(): bool { return false; }
    public function canSubmit(): bool { return false; }
    public function canApprove(): bool { return false; }
}

class Rejected extends PurchaseRequisitionState
{
    public function canEdit(): bool { return true; }
    public function canSubmit(): bool { return true; }
    public function canApprove(): bool { return false; }
}
```

### 2. Add state to model

```php
// app/Models/PurchaseRequisition.php
namespace App\Models;

use App\States\PurchaseRequisitionState;
use Illuminate\Database\Eloquent\Model;
use Spatie\ModelStates\HasStates;

class PurchaseRequisition extends Model
{
    use HasStates;

    protected $casts = [
        'state' => PurchaseRequisitionState::class,
    ];

    public function submit()
    {
        $this->state->transitionTo(PendingApproval::class);
        $this->save();

        // Notify approvers
        $this->notifyApprovers();
    }

    public function approve(User $approver)
    {
        $this->state->transitionTo(Approved::class);
        $this->approved_by = $approver->id;
        $this->approved_at = now();
        $this->save();

        // Create purchase order
        $this->createPurchaseOrder();

        // Notify requester
        $this->notifyRequester('approved');
    }

    public function reject(User $approver, string $reason)
    {
        $this->state->transitionTo(Rejected::class);
        $this->rejected_by = $approver->id;
        $this->rejected_at = now();
        $this->rejection_reason = $reason;
        $this->save();

        // Notify requester
        $this->notifyRequester('rejected');
    }
}
```


### 3. Controller actions

```php
// app/Http/Controllers/PurchaseRequisitionController.php
namespace App\Http\Controllers;

use App\Models\PurchaseRequisition;
use Illuminate\Http\Request;

class PurchaseRequisitionController extends Controller
{
    public function submit(PurchaseRequisition $requisition)
    {
        $this->authorize('submit', $requisition);

        $requisition->submit();

        return redirect()
            ->route('requisitions.show', $requisition)
            ->with('success', 'Requisition submitted for approval');
    }

    public function approve(PurchaseRequisition $requisition)
    {
        $this->authorize('approve', $requisition);

        $requisition->approve(auth()->user());

        return redirect()
            ->route('requisitions.index')
            ->with('success', 'Requisition approved');
    }

    public function reject(Request $request, PurchaseRequisition $requisition)
    {
        $this->authorize('approve', $requisition);

        $validated = $request->validate([
            'reason' => 'required|string|min:10',
        ]);

        $requisition->reject(auth()->user(), $validated['reason']);

        return redirect()
            ->route('requisitions.index')
            ->with('success', 'Requisition rejected');
    }
}
```

### 4. Authorization

```php
// app/Policies/PurchaseRequisitionPolicy.php
namespace App\Policies;

use App\Models\PurchaseRequisition;
use App\Models\User;
use App\States\Draft;
use App\States\PendingApproval;

class PurchaseRequisitionPolicy
{
    public function submit(User $user, PurchaseRequisition $requisition): bool
    {
        return $requisition->created_by === $user->id
            && $requisition->state instanceof Draft;
    }

    public function approve(User $user, PurchaseRequisition $requisition): bool
    {
        return $user->hasRole('approver')
            && $requisition->state instanceof PendingApproval;
    }
}
```

## Multi-level approval

Some workflows need sequential approvers:

```php
// app/Models/PurchaseRequisition.php
public function approvalSteps()
{
    return $this->hasMany(ApprovalStep::class)->orderBy('order');
}

public function currentStep()
{
    return $this->approvalSteps()->whereNull('approved_at')->first();
}

public function approve(User $approver)
{
    $step = $this->currentStep();

    if (!$step || $step->approver_id !== $approver->id) {
        throw new \Exception('Not authorized to approve this step');
    }

    $step->update([
        'approved_at' => now(),
        'approved_by' => $approver->id,
    ]);

    // Check if all steps are complete
    if ($this->approvalSteps()->whereNull('approved_at')->count() === 0) {
        $this->state->transitionTo(Approved::class);
        $this->save();
        $this->createPurchaseOrder();
    } else {
        // Notify next approver
        $this->notifyNextApprover();
    }
}
```

## Parallel approval

Multiple approvers must approve simultaneously:

```php
// app/Models/PurchaseRequisition.php
public function approvers()
{
    return $this->belongsToMany(User::class, 'requisition_approvals')
        ->withPivot('approved_at', 'rejected_at', 'notes')
        ->withTimestamps();
}

public function approve(User $approver)
{
    $this->approvers()->updateExistingPivot($approver->id, [
        'approved_at' => now(),
    ]);

    // Check if all approvers have approved
    $pending = $this->approvers()->wherePivot('approved_at', null)->count();

    if ($pending === 0) {
        $this->state->transitionTo(Approved::class);
        $this->save();
        $this->createPurchaseOrder();
    }
}
```

## Conditional routing

Route to different approvers based on amount:

```php
// app/Models/PurchaseRequisition.php
public function submit()
{
    $this->state->transitionTo(PendingApproval::class);
    $this->save();

    // Determine approvers based on total amount
    $approvers = $this->determineApprovers();

    foreach ($approvers as $approver) {
        $this->approvers()->attach($approver->id);
    }

    $this->notifyApprovers();
}

protected function determineApprovers(): Collection
{
    $total = $this->total;

    if ($total < 1000) {
        return User::role('supervisor')->get();
    } elseif ($total < 10000) {
        return User::role('manager')->get();
    } else {
        return User::role('director')->get();
    }
}
```

## Audit trail

Track all state changes:

```php
// app/Models/PurchaseRequisition.php
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class PurchaseRequisition extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['state', 'approved_by', 'rejected_by', 'rejection_reason'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function approve(User $approver)
    {
        activity()
            ->performedOn($this)
            ->causedBy($approver)
            ->withProperties(['action' => 'approved'])
            ->log('Requisition approved');

        $this->state->transitionTo(Approved::class);
        $this->approved_by = $approver->id;
        $this->approved_at = now();
        $this->save();
    }
}
```

## Verification commands

Test approval flows:

```bash
# Create test requisition
php artisan tinker
>>> $pr = PurchaseRequisition::factory()->create()
>>> $pr->submit()
>>> $pr->state // Should be PendingApproval

# Test approval
>>> $approver = User::role('approver')->first()
>>> $pr->approve($approver)
>>> $pr->state // Should be Approved

# Test rejection
>>> $pr2 = PurchaseRequisition::factory()->create()
>>> $pr2->submit()
>>> $pr2->reject($approver, 'Insufficient budget')
>>> $pr2->state // Should be Rejected

# Check audit trail
>>> activity()->forSubject($pr)->get()
```

## Common pitfalls

### Missing authorization checks
Always authorize before state transitions:

```php
// ❌ Wrong: no authorization
public function approve(PurchaseRequisition $requisition)
{
    $requisition->approve(auth()->user());
}

// ✅ Correct: authorize first
public function approve(PurchaseRequisition $requisition)
{
    $this->authorize('approve', $requisition);
    $requisition->approve(auth()->user());
}
```

### Invalid state transitions
State machines prevent invalid transitions:

```php
// This will throw an exception if transition is not allowed
$requisition->state->transitionTo(Approved::class);
```

### Missing notifications
Always notify relevant users:

```php
public function approve(User $approver)
{
    $this->state->transitionTo(Approved::class);
    $this->save();

    // Don't forget notifications!
    $this->notifyRequester('approved');
    $this->notifyAccountingTeam();
}
```

## What to read next

- [Notifications](/v7/workflows/notifications) — send approval notifications
- [Thunderclap](/v7/admin-workflows/thunderclap) — generate approval flow scaffolding
- [Access control](/v7/security/access-control) — role-based approval authorization
