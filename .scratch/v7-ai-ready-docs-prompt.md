# Laravolt v7 Documentation Prompt — AI Ready Platform

You are writing the new Laravolt v7 documentation from scratch for the June v7 release.

Repository: `/Users/rama/Laravolt/docs-v7`
Target branch: `docs/v7-ai-ready`
Framework: Next.js 15 + Markdoc + Tailwind CSS 4. Existing content is v6-era and should be treated only as repository structure reference, not as source material.

## Product positioning
Laravolt v7 is not just an admin panel or Laravel package collection. Position it as an **AI-ready Laravel application platform** for teams building real business systems quickly, safely, and consistently.

Inspiration: Remix documentation style — clear mental models, strong narrative, practical examples, confidence-building APIs.

Core message:
> Laravolt v7 helps Laravel teams ship internal tools, enterprise apps, admin panels, workflows, and AI-assisted business systems with a complete, opinionated, production-ready foundation.

## Strategic angle
AI is now part of software delivery. Laravolt v7 should feel ready for that world:
- structured conventions that are easy for humans and coding agents to understand
- predictable component APIs
- generated/admin CRUD flows that AI tools can extend safely
- form/table/menu/workflow abstractions that reduce ambiguity
- code quality, authorization, and auditability as platform defaults
- documentation optimized for both developers and AI coding assistants

Avoid hype without substance. Use “AI-ready” as a practical engineering stance: explicit conventions, composable APIs, safe defaults, and clear extension points.

## Do not rely on old docs
Start from first principles. You may inspect old pages only to understand repo routing/layout conventions. Do not copy the old v6 narrative or structure blindly.

## Suggested v7 information architecture
Create a fresh `/v7` docs section and update navigation accordingly.

1. Introduction
   - What is Laravolt v7?
   - Why Laravolt exists
   - AI-ready Laravel platform
   - When to use Laravolt / when not to

2. Getting Started
   - Requirements: PHP/Laravel/Livewire/Preline/Tailwind versions
   - Installation
   - Starter kit
   - First admin user
   - Project structure

3. Core Concepts
   - Platform philosophy
   - Conventions over glue code
   - Packages and modules
   - Service providers/configuration
   - UI foundation: Preline + Tailwind

4. UI Foundation
   - Layout
   - Blade components
   - Form builder
   - Table/listing
   - Menu/navigation
   - Flash/notifications
   - Charts/statistics

5. Forms
   - Basic form API
   - Layout/grid
   - Validation via FormRequest
   - Client-side validation
   - Input masking
   - Custom fields/components

6. Data & Admin Workflows
   - Auto CRUD
   - Actions/action buttons
   - Filters/search/sort
   - Import/export if applicable
   - Auditability patterns

7. Security & Access Control
   - Users/roles/permissions
   - Permission checks
   - Role/permission update behavior
   - Menus with authorization

8. Workflow & Automation
   - Workflow module
   - Business process modeling
   - Background jobs/queues
   - Integration points for AI-assisted workflows

9. AI-Ready Development
   - How to structure Laravolt projects for coding agents
   - Promptable conventions
   - Safe extension points
   - Documentation as context
   - Recommended repo layout and tests

10. Upgrade Guide
   - v6 to v7 breaking changes
   - dependency matrix
   - migration checklist
   - deprecated/removed APIs

11. Reference
   - configuration
   - package list
   - artisan commands
   - testing
   - troubleshooting

## Writing style
- Clear, direct, developer-first.
- Prefer practical examples over marketing claims.
- Use concise paragraphs, strong headings, and code snippets.
- Explain why before how when introducing concepts.
- Use Indonesian/Southeast Asia context only when it strengthens the platform story; docs should remain globally useful.
- Avoid vague claims like “seamless”, “powerful”, “next-gen” unless backed by concrete capability.

## Implementation instructions
- Use Markdoc pages under `src/app/v7/.../page.md` or the repo’s existing route convention.
- Update `src/lib/navigation.ts` to surface v7 as the primary docs section.
- Keep v6 routes intact unless explicitly asked to remove them.
- Prefer many small pages over one huge page.
- Add examples that compile conceptually with Laravolt v7 APIs.
- If an API is uncertain, mark it as `TODO: verify API` instead of inventing behavior.

## First deliverable
Create a v7 documentation skeleton with:
- landing page copy for `/`
- `/v7/introduction`
- `/v7/getting-started/installation`
- `/v7/core-concepts/ai-ready-platform`
- `/v7/forms/overview`
- `/v7/forms/validation`
- `/v7/forms/input-masking`
- `/v7/upgrade-guide`
- updated navigation

Run:
```bash
bun install
bun run build
```

Return:
- changed files
- build result
- open questions / APIs needing verification
