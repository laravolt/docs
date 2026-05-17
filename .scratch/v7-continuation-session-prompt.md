# Copy-paste prompt for a fresh Laravolt v7 docs session

You are continuing Laravolt v7 documentation work for Rama.

Context:
- Rama is preparing Laravolt v7 for a June release.
- Docs should position Laravolt v7 as an **AI-ready Laravel application platform**, not merely an admin panel/package collection.
- Inspiration: Remix docs style — strong mental models, clean narrative, practical examples, confidence-building APIs.
- Start from first principles. Existing v6 docs may be used only for repo structure/routing reference, not copied blindly.

Repository:
- Docs repo path: `/Users/rama/Laravolt/docs-v7`
- Branch: `docs/v7-ai-ready`
- Framework: Next.js 15 + Markdoc + Tailwind CSS 4

Related Laravolt app repo:
- Main repo path: `/Users/rama/Laravolt/laravolt`
- Main repo currently has a dirty file: `packages/preline-form/src/ServiceProvider.php`; do not overwrite unrelated changes.
- Recent v7 work:
  - PR #383 Preline declarative grid layout: merged.
  - PR #384 force logout when role/permission updates: merged.
  - Issue #51 automatic client-side validation: done/merged as PR #385 commit `1d7848e4`.
  - Issue #5 input masking: implemented on branch `feat/5-input-masking`, commit `fbafd794`, pushed. PR creation was blocked locally due missing GitHub auth/gh.

Current docs repo status at handoff:
- Branch: `docs/v7-ai-ready` tracking `origin/docs/v7-ai-ready`
- Dirty/modified files observed:
  - `TODO.md`
  - `src/app/v7/admin-workflows/overview/page.md`
  - `src/app/v7/core-concepts/ai-ready-platform/page.md`
  - `src/app/v7/getting-started/installation/page.md`
  - `src/app/v7/security/access-control/page.md`
  - `src/app/v7/testing/browser-testing/page.md`
  - `src/app/v7/ui-foundation/overview/page.md`
  - `src/app/v7/upgrade-guide/page.md`
  - `src/lib/navigation.ts`
- New/untracked dirs observed:
  - `src/app/v7/ai-ready-development/`
  - `src/app/v7/reference/artisan-commands/`
  - `src/app/v7/reference/package-list/`
  - `src/app/v7/workflow-and-automation/`

Task:
1. Inspect current docs repo state first:
   - `git status --short --branch`
   - review changed/new v7 pages and `src/lib/navigation.ts`
   - identify what has already been drafted vs missing.
2. Continue cleaning and completing the v7 docs skeleton.
3. Keep the documentation practical, developer-first, and API-aware.
4. Do **not** invent uncertain Laravolt APIs. If unsure, mark as `TODO: verify API` or inspect `/Users/rama/Laravolt/laravolt`.
5. Preserve v6 routes/content unless explicitly asked to remove them.
6. Prefer many small focused pages over one huge page.
7. Make navigation coherent and ensure v7 is surfaced as the primary docs section.
8. Run the verification gate:
   - `bun install` only if dependencies are missing/stale
   - `bun run build`
9. Return:
   - concise summary of what changed
   - files changed
   - build result
   - open questions / APIs needing verification
   - suggested next docs pages or article-series topics

Content direction:
- Core positioning: Laravolt v7 helps Laravel teams ship internal tools, enterprise apps, admin panels, workflows, and AI-assisted business systems with a complete, opinionated, production-ready foundation.
- AI-ready means practical engineering: explicit conventions, composable APIs, predictable structure, safe defaults, clear extension points, tests, authorization, auditability, docs that coding agents can use as context.
- Avoid vague hype such as “seamless”, “powerful”, “next-gen” unless backed by concrete capability.
- Mention AI only where it helps explain conventions and maintainability.

Important pages/sections to prioritize:
- `/v7/introduction`
- `/v7/getting-started/installation`
- `/v7/core-concepts/ai-ready-platform`
- `/v7/ui-foundation/overview`
- `/v7/forms/overview`
- `/v7/forms/validation`
- `/v7/forms/input-masking`
- `/v7/admin-workflows/overview`
- `/v7/security/access-control`
- `/v7/workflow-and-automation/...`
- `/v7/ai-ready-development/...`
- `/v7/testing/browser-testing`
- `/v7/upgrade-guide`
- `/v7/reference/artisan-commands`
- `/v7/reference/package-list`

Also keep in mind Rama wants an article/content series around Laravolt v7 beta. Recommended demo app direction from prior planning:
- procurement/inventory operations system
- cover install, PrelineForm, tables, ACL, workflows, browser testing, and AI-assisted development
- goal: generate feedback/fixes toward stable v7.
