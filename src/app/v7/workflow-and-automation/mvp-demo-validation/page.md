---
title: MVP demo validation
---

# MVP demo validation

The VoltProcure demo validates how Laravolt v7 can be used to share an operational MVP story with stakeholders: a real procurement workflow, multiple roles, protected actions, and visible business state from request to inventory. {% .lead %}

Use this page as a capability map when presenting Laravolt v7 as an AI-ready Laravel platform for business applications. The demo proves workflow collaboration and handoff readiness; it does not claim public sharing links, comments, mentions, or realtime co-editing.

## What was validated

VoltProcure validates a complete procurement and inventory path:

1. a requester creates a draft purchase request
2. the request is submitted for manager review
3. the department manager approves it
4. procurement converts the approved request into a purchase order
5. the purchase order is issued
6. warehouse staff receive goods against the order
7. inventory balances and inventory movements are updated

The feature test covers the happy path and rejects over-receiving, so the demo is not only a screen prototype. It exercises the domain actions and the state transitions behind the screens.

## Validation evidence

The current MVP has been validated locally with a small but useful evidence set:

| Check | Result |
| --- | --- |
| `/voltprocure` route list | 22 routes detected. |
| Frontend build | `npm install` and `npm run build` passed. |
| Database setup | `php artisan migrate:fresh --seed` passed. |
| Targeted feature test | `tests/Feature/VoltProcureMvpTest.php` passed. |

The targeted test includes two cases:

- the full happy path from purchase request to approval, purchase order, issue, receiving, and inventory movement
- over-receiving validation, which blocks receiving more than the issued purchase order quantity

Treat deployment verification as a separate operational step. The MVP is validated locally, but production readiness should only be claimed after the deployment target has completed its own install, migration, build, route, and test checks.

## Roles involved

The demo uses separate roles to show that the application can model handoffs across people and responsibilities:

| Role | Responsibility in the demo |
| --- | --- |
| Requester | Creates and submits the purchase request. |
| Department Manager | Reviews and approves the submitted request. |
| Procurement Officer | Creates and issues the purchase order. |
| Warehouse Staff | Posts receiving notes and updates inventory state. |

This is the strongest sharing capability validated by the MVP: work is shared through controlled workflow state, inboxes, dashboards, and role-specific actions.

## Capability map

The demo maps to several Laravolt v7 platform capabilities:

| Capability | How VoltProcure demonstrates it |
| --- | --- |
| Admin workflow structure | The app has dedicated screens for items, suppliers, purchase requests, approvals, purchase orders, receiving, inventory balances, and inventory movements. |
| Stateful handoffs | Purchase requests move from draft to manager review, approved, and converted to purchase order. Purchase orders move from draft to issued, partially received, and received. |
| Action-oriented business logic | Submission, approval, purchase order creation, issuing, and receiving are implemented as named domain actions instead of hidden view logic. |
| Role-based operations | Seeded roles and permissions separate requester, manager, procurement, warehouse, and administrator responsibilities. |
| Operational visibility | The dashboard, approval inbox, purchase order pages, inventory balances, and movement history expose shared business state. |
| Audit evidence | Approval metadata, receiving notes, inventory movements, and performer references make the process reviewable after the fact. |

For stakeholders, this shows that Laravolt v7 can support more than CRUD. It can express a business process with ownership, authorization, state, and evidence.

## Sharing the capability

A concise demo narrative:

```txt
VoltProcure is a Laravolt v7 MVP for procurement and inventory.
It starts with a purchase request, routes it to a manager, converts approval into a purchase order,
tracks receiving, and updates inventory. Each step is protected by role-specific actions and leaves
visible operational state for the next team.
```

When sharing the demo, focus on these proof points:

- the same application supports requesters, approvers, procurement, and warehouse users
- business state is visible through dashboards, inboxes, and resource pages
- domain actions keep transitions explicit and testable
- the MVP is small enough to inspect but complete enough to explain an end-to-end operating model
- AI-assisted development is safer because the routes, states, roles, and actions are named clearly

## What is not validated yet

Do not present the current MVP as proof of these capabilities:

- public or private share links
- object-level sharing invitations
- comments or discussion threads
- mentions and notifications
- realtime collaborative editing
- configurable multi-approver workflow definitions

Those may be future capabilities, but this MVP validates workflow-based sharing of work, not document-sharing or realtime collaboration features.

## What to read next

- [Workflow and automation](/v7/workflow-and-automation/overview) — model approvals, task handoffs, and process state.
- [Admin workflows](/v7/admin-workflows/overview) — structure resource screens around business operations.
- [Access control](/v7/security/access-control) — protect resources and actions.
- [AI-ready development guide](/v7/ai-ready-development/guide) — give coding agents explicit contracts and guardrails.
- [Browser testing](/v7/testing/browser-testing) — verify operational workflows in a real browser.
