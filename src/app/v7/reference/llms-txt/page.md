---
title: llms.txt and Copy Markdown
---

# llms.txt and Copy Markdown

The Laravolt docs site publishes itself in a form that large language models (LLMs) and coding agents can consume directly — a generated `llms.txt` index, a full-text `llms-full.txt`, a `.md` mirror of every page, and an in-page **Copy Markdown** button with quick links to ChatGPT and Claude. {% .lead %}

This page explains what the feature produces, where each artifact lives, and how to regenerate it. It mirrors the approach used by [Rspress SSG-MD](https://rspress.rs/guide/basic/ssg-md#ui-display) but is implemented for our Next.js 15 + Markdoc pipeline.

## What gets generated

Every build runs `scripts/generate-llms.mjs` before `next build`. The script walks `src/app/**/page.md` and writes three kinds of artifacts into `/public`:

| File | Purpose |
| --- | --- |
| `/llms.txt` | Human- and LLM-readable index. Title, short description, and a list of every page grouped by section. Follows the [llmstxt.org](https://llmstxt.org) convention. |
| `/llms-full.txt` | Every page concatenated, with route headers. Useful when a model can accept large context and you want the whole docs in one shot. |
| `/<route>.md` | Per-page markdown mirror. For example `/v7/forms/overview.md` returns the raw Markdoc source of that page. |

A representative `llms.txt` snippet:

```text
# Laravolt v7

> Laravolt v7 is an AI-ready Laravel application platform...

## Laravolt v7

- [Introduction](/v7/introduction.md): Laravolt v7 is an AI-ready Laravel...
- [Installation](/v7/getting-started/installation.md): Install Laravolt v7...
- [Forms overview](/v7/forms/overview.md): PrelineForm is Laravolt v7's form builder...
```

The `.md` mirrors are the same raw Markdoc you see in `src/app/.../page.md`. Markdoc tags (`{% callout %}`, `{% quick-links %}`) are kept intact — they do not hurt LLM comprehension and keep the file small.

## The "Copy Markdown" button

Every docs page renders a **Copy Markdown** control below its title. Clicking the primary button fetches the current route's `.md` mirror and places it on the clipboard. The dropdown to its right exposes three additional actions:

- **Copy Markdown** — same as the primary button.
- **Copy Markdown link** — copies the fully-qualified `.md` URL, for pasting into any tool that can fetch a URL.
- **Open in ChatGPT** — opens `chatgpt.com` in a new tab with a prompt pointing at this page's `.md` URL.
- **Open in Claude** — opens `claude.ai` in a new tab with the same prompt.

The prompt is intentionally conservative:

```text
Read https://docs.example.com/v7/forms/overview.md and help me understand,
summarize, and answer questions about the content.
```

Feel free to adjust the prompt in `src/components/LlmsCopyButton.tsx` if your users prefer a different phrasing.

## How routes map to files

The generator matches routes 1-to-1 with Next.js App Router files:

| Source | Route | Mirror file |
| --- | --- | --- |
| `src/app/page.md` | `/` | `public/index.md` |
| `src/app/v7/introduction/page.md` | `/v7/introduction` | `public/v7/introduction.md` |
| `src/app/v7/forms/overview/page.md` | `/v7/forms/overview` | `public/v7/forms/overview.md` |

The UI button derives the mirror URL by appending `.md` to the current pathname (or `/index.md` at the root). Because Next.js serves `/public/*` as static assets, no route handlers are required.

## Running the generator

The generator runs automatically before `next build` and `next dev`, thanks to the `prebuild` and `predev` hooks in `package.json`. You can also invoke it explicitly:

```bash
bun run llms
# or
node scripts/generate-llms.mjs
```

Output:

```text
[llms] wrote llms.txt, llms-full.txt, and 35 page mirrors to /public
```

## Git-ignoring generated artifacts

Generated files are derived from the source Markdoc pages and are recreated on every build, so they are excluded from version control:

```gitignore
/public/llms.txt
/public/llms-full.txt
/public/index.md
/public/v6/**/*.md
/public/v7/**/*.md
```

If you add a new top-level section under `src/app/<section>/...`, extend the `.gitignore` patterns accordingly (or switch to a single `/public/**/*.md` rule if you have no hand-authored `.md` files under `public/`).

## Pointing AI tools at the docs

Publish the following URLs once the site is deployed:

- `https://<your-domain>/llms.txt` — index for agents that support llms.txt.
- `https://<your-domain>/llms-full.txt` — everything, concatenated.
- `https://<your-domain>/<route>.md` — per-page access.

Anecdotally, the per-page `.md` URL is the most useful day-to-day: it is cheap to fetch, keeps context windows small, and plays well with the **Copy Markdown link** UI action.

## Implementation pointers

If you need to customize behaviour, these are the files to edit:

- `scripts/generate-llms.mjs` — generation logic: walks Markdoc pages, extracts titles and descriptions, and writes the three artifact kinds. Uses only `js-yaml` and `fast-glob`, both already present.
- `src/components/LlmsCopyButton.tsx` — the Copy Markdown button. Uses Headless UI's `Menu`, matching the pattern used in `ThemeSelector.tsx`.
- `src/components/DocsLayout.tsx` — where the button is rendered, right under `DocsHeader`.

## Limitations

- Markdoc tags are preserved verbatim. An LLM that has never seen the syntax may try to render `{% callout %}` literally. In practice, recent models ignore it, but if you want strict CommonMark set up a pre-processor that strips Markdoc tags before writing the `.md` mirrors.
- The generator runs once per build. Live-editing a page does not update the `.md` mirror until the next `bun run dev` (which triggers `predev`) or a manual `bun run llms` call.
- The prompt used for ChatGPT / Claude hints at reading a URL; both services accept the query parameter but the exact rendering depends on their product decisions at the time of click.

## What to read next

- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — the broader stance that `llms.txt` and Copy Markdown support.
- [Upgrade guide](/v7/upgrade-guide) — v6 → v7 differences, including the form builder rename that the `.md` mirrors make obvious.
