#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

function usage() {
  console.log('Usage: node scripts/generate-blog.mjs <csvPath> [--author="Name"] [--date="YYYY-MM-DD"]')
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cols = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(current)
        current = ''
      } else {
        current += ch
      }
    }
    cols.push(current)

    const row = {}
    headers.forEach((h, idx) => (row[h] = (cols[idx] ?? '').trim()))
    return row
  })
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function writePost({ slug, title, description, date, author, tags, body }) {
  const postDir = path.resolve('src/app/blog', slug)
  ensureDir(postDir)
  const frontmatter = [
    '---',
    'layout: blog',
    `title: ${title}`,
    description ? `description: ${description}` : null,
    date ? `date: ${date}` : null,
    author ? `author: ${author}` : null,
    tags && tags.length > 0 ? 'tags:\n' + tags.map((t) => `  - ${t}`).join('\n') : null,
    '---',
  ]
    .filter(Boolean)
    .join('\n')

  const content = `${frontmatter}\n\n${body || 'Coming soon.'}\n`
  fs.writeFileSync(path.join(postDir, 'page.md'), content, 'utf8')
  return postDir
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    usage()
    process.exit(1)
  }
  const csvPath = args[0]
  const authorArg = args.find((a) => a.startsWith('--author='))?.split('=')[1]
  const dateArg = args.find((a) => a.startsWith('--date='))?.split('=')[1]

  const csv = fs.readFileSync(csvPath, 'utf8')
  const rows = parseCsv(csv)

  let created = 0
  for (const row of rows) {
    const title = row.title || row.Title
    if (!title) continue
    const slug = row.slug ? slugify(row.slug) : slugify(title)
    const description = row.description || row.Description || ''
    const date = row.date || row.Date || dateArg || new Date().toISOString().slice(0, 10)
    const author = row.author || row.Author || authorArg || ''
    const tags = (row.tags || row.Tags || '')
      .split('|')
      .map((t) => t.trim())
      .filter(Boolean)
    const body = row.body || row.Body || ''

    writePost({ slug, title, description, date, author, tags, body })
    created++
  }

  console.log(`Generated ${created} posts in src/app/blog`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})