#!/usr/bin/env node
/**
 * Generate llms.txt, llms-full.txt, and per-page .md mirrors for the docs site.
 *
 * Inspired by https://rspress.rs/guide/basic/ssg-md — we emit:
 *   - public/llms.txt          Index file (title, description, list of links)
 *   - public/llms-full.txt     Concatenated full markdown of every page
 *   - public/<route>.md        Raw markdown mirror for each src/app/**\/page.md
 *
 * Each route mirror lets the "Copy Markdown" UI and any external LLM fetch
 * the clean source text for a page via a predictable URL.
 *
 * This script is intentionally dependency-light: it reads the page frontmatter
 * and body by hand, relying on js-yaml which is already part of the project.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import yaml from 'js-yaml'
import fg from 'fast-glob'

const __filename = url.fileURLToPath(import.meta.url)
const projectRoot = path.resolve(path.dirname(__filename), '..')
const appDir = path.join(projectRoot, 'src', 'app')
const publicDir = path.join(projectRoot, 'public')

const SITE_TITLE = 'Laravolt v7'
const SITE_DESCRIPTION =
  'Laravolt v7 is an AI-ready Laravel application platform for teams ' +
  'building internal tools, enterprise apps, admin panels, workflows, and ' +
  'AI-assisted business systems on a complete, opinionated, production-ready ' +
  'foundation.'

/**
 * Parse `---\nkey: value\n---\nbody` frontmatter. Returns `{ data, body }`.
 */
function parseFrontmatter(source) {
  if (!source.startsWith('---')) {
    return { data: {}, body: source }
  }
  const end = source.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, body: source }
  }
  const raw = source.slice(3, end).replace(/^\n/, '')
  const rest = source.slice(end + 4).replace(/^\r?\n/, '')
  let data = {}
  try {
    data = yaml.load(raw) ?? {}
  } catch {
    data = {}
  }
  return { data, body: rest }
}

/**
 * Map a page.md file path (relative to src/app) to a site URL.
 *   page.md                     -> /
 *   v7/introduction/page.md     -> /v7/introduction
 */
function toRoute(relativePath) {
  if (relativePath === 'page.md') return '/'
  const withoutPage = relativePath.replace(/\/page\.md$/u, '')
  return `/${withoutPage}`
}

/**
 * Map a route to the public/*.md target path.
 *   /                  -> public/index.md
 *   /v7/introduction   -> public/v7/introduction.md
 */
function toPublicMdPath(route) {
  if (route === '/') return path.join(publicDir, 'index.md')
  return path.join(publicDir, `${route.slice(1)}.md`)
}

/**
 * Extract the first non-empty prose line as a description.
 *  - Strips Markdoc inline annotations like `{% .lead %}` and `{% /foo %}`.
 *  - Skips blank lines, heading lines, and lines that start a Markdoc block.
 */
function extractDescription(body) {
  const lines = body.split(/\r?\n/u)
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('#')) continue
    if (line.startsWith('{%') || line.startsWith('---')) continue
    const stripped = line
      .replace(/\{%\s*[\s\S]*?%\}/gu, '')
      .replace(/`([^`]+)`/gu, '$1')
      .replace(/\*\*([^*]+)\*\*/gu, '$1')
      .replace(/\*([^*]+)\*/gu, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
      .trim()
    if (stripped) return stripped
  }
  return ''
}

/**
 * Derive a human-readable section label from a route.
 *   /                              -> Home
 *   /v7/forms/overview             -> v7 / forms / overview
 */
function sectionLabel(route) {
  if (route === '/') return 'Home'
  return route
    .slice(1)
    .split('/')
    .map((segment) =>
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    )
    .join(' / ')
}

/**
 * Group pages by their top-level segment so llms.txt reads predictably.
 *   / -> 'Overview'
 *   /v7/... -> 'Laravolt v7'
 *   /v6/... -> 'Laravolt v6 (legacy)'
 */
function groupKey(route) {
  if (route === '/') return 'Overview'
  const top = route.split('/')[1]
  if (top === 'v7') return 'Laravolt v7'
  if (top === 'v6') return 'Laravolt v6 (legacy)'
  return sectionLabel(`/${top}`)
}

async function main() {
  const files = await fg('**/page.md', { cwd: appDir, absolute: false })
  files.sort()

  const pages = []
  for (const relativePath of files) {
    const abs = path.join(appDir, relativePath)
    const source = await fs.readFile(abs, 'utf8')
    const { data, body } = parseFrontmatter(source)
    const route = toRoute(relativePath)
    const title =
      (typeof data.title === 'string' && data.title.trim()) ||
      sectionLabel(route)
    const description =
      (typeof data.description === 'string' && data.description.trim()) ||
      extractDescription(body)
    pages.push({ route, title, description, source, relativePath })
  }

  // Write per-page .md mirrors.
  let mirrorCount = 0
  for (const page of pages) {
    const target = toPublicMdPath(page.route)
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, page.source, 'utf8')
    mirrorCount += 1
  }

  // Write llms.txt (index file).
  const groups = new Map()
  for (const page of pages) {
    const key = groupKey(page.route)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(page)
  }
  const preferredOrder = ['Overview', 'Laravolt v7', 'Laravolt v6 (legacy)']
  const orderedGroups = [
    ...preferredOrder.filter((k) => groups.has(k)),
    ...[...groups.keys()].filter((k) => !preferredOrder.includes(k)),
  ]

  const indexLines = []
  indexLines.push(`# ${SITE_TITLE}`)
  indexLines.push('')
  indexLines.push(`> ${SITE_DESCRIPTION}`)
  indexLines.push('')
  for (const key of orderedGroups) {
    indexLines.push(`## ${key}`)
    indexLines.push('')
    for (const page of groups.get(key)) {
      const link = page.route === '/' ? '/index.md' : `${page.route}.md`
      const description = page.description
        ? `: ${page.description}`
        : ''
      indexLines.push(`- [${page.title}](${link})${description}`)
    }
    indexLines.push('')
  }
  await fs.writeFile(
    path.join(publicDir, 'llms.txt'),
    indexLines.join('\n').replace(/\n{3,}/gu, '\n\n'),
    'utf8',
  )

  // Write llms-full.txt (full content concatenation).
  const fullLines = []
  fullLines.push(`# ${SITE_TITLE}`)
  fullLines.push('')
  fullLines.push(`> ${SITE_DESCRIPTION}`)
  fullLines.push('')
  for (const key of orderedGroups) {
    for (const page of groups.get(key)) {
      fullLines.push('---')
      fullLines.push('')
      fullLines.push(`# ${page.title}`)
      fullLines.push('')
      fullLines.push(`Source: ${page.route}`)
      fullLines.push('')
      fullLines.push(page.source.trim())
      fullLines.push('')
    }
  }
  await fs.writeFile(
    path.join(publicDir, 'llms-full.txt'),
    fullLines.join('\n').replace(/\n{3,}/gu, '\n\n'),
    'utf8',
  )

  // eslint-disable-next-line no-console
  console.log(
    `[llms] wrote llms.txt, llms-full.txt, and ${mirrorCount} page mirrors to /public`,
  )
}

main().catch((error) => {
  console.error('[llms] generation failed:', error)
  process.exitCode = 1
})
