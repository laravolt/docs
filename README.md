# Syntax

Syntax is a [Tailwind Plus](https://tailwindcss.com/plus) site template built using [Tailwind CSS](https://tailwindcss.com) and [Next.js](https://nextjs.org).

## Getting started

To get started with this template, first install the bun dependencies:

```bash
bun install
```

Next, run the development server:

```bash
bun run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Customizing

You can start editing this template by modifying the files in the `/src` folder. The site will auto-update as you edit these files.

## Global search

This template includes a global search that's powered by the [FlexSearch](https://github.com/nextapps-de/flexsearch) library. It's available by clicking the search input or by using the `⌘K` shortcut.

This feature requires no configuration, and works out of the box by automatically scanning your documentation pages to build its index. You can adjust the search parameters by editing the `/src/markdoc/search.mjs` file.

## License

This site template is a commercial product and is licensed under the [Tailwind Plus license](https://tailwindcss.com/plus/license).

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
- [Markdoc](https://markdoc.io) - the official Markdoc documentation
- [Algolia Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/) - the official Algolia Autocomplete documentation
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - the official FlexSearch documentation

### Blog (Programmatic SEO)

Add a scalable blog that renders Markdoc `.md` files and supports programmatic generation for SEO at scale.

- **Index**: `GET /blog` auto-lists posts from `src/app/blog/**/page.md`
- **Post URL**: `GET /blog/<slug>`
- **Renderer**: Markdoc with `layout: blog` frontmatter (uses `BlogLayout`)
- **Sitemaps**: `src/app/sitemap.ts` and `src/app/blog/sitemap.ts`

#### Creating posts manually

Create a folder under `src/app/blog/<your-slug>/page.md` with frontmatter:

```md
---
layout: blog
title: Your Post Title
description: One-line summary for SERP snippet.
date: 2025-01-15
author: Your Name
tags:
  - seo
  - programmatic-seo
---

Your content goes here. You can use existing Markdoc tags like callouts:

{% callout title="Heads up" type="note" %}
Short tip or important note.
{% /callout %}
```

#### Generate posts from CSV (programmatic SEO)

Convert a CSV of keywords/topics into ready-to-publish posts.

- Script: `scripts/generate-blog.mjs`
- Run:

```bash
yarn generate:blog path/to/keywords.csv --author="Your Name" --date=2025-01-20
```

- CSV columns (header row required):
  - `title` (required), `slug` (optional), `description`, `date`, `author`, `tags`, `body`
  - `tags` can be pipe-separated, e.g. `seo|programmatic-seo|growth`

Example CSV:

```csv
title,slug,description,tags,body
"What Is Programmatic SEO?","programmatic-seo-what-is-it","Create highly targeted pages at scale.","seo|programmatic-seo|growth","## Why it works\n\nLong-tail pages compound over time."
```

This generates `src/app/blog/programmatic-seo-what-is-it/page.md` with proper frontmatter.

#### Notes

- The blog index and sitemaps are generated at build time using file globs.
- Posts must include `layout: blog` in frontmatter to use the blog layout.
- Existing Markdoc components (callout, figure, iframe, quick-links) can be used in posts.
