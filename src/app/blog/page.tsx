import type { Metadata } from 'next'
import Link from 'next/link'
import glob from 'fast-glob'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, tutorials, and updates. Programmatic SEO-ready content to grow traffic.',
}

interface BlogPostMeta {
  title?: string
  description?: string
  date?: string
  author?: string
  tags?: string[]
  href: string
}

async function getPosts(): Promise<BlogPostMeta[]> {
  const cwd = path.resolve('./src/app/blog')
  const files = glob.sync('**/page.md', { cwd })

  const posts: BlogPostMeta[] = files.map((file) => {
    const md = fs.readFileSync(path.join(cwd, file), 'utf8')
    const frontmatterRaw = md.match(/^---\n([\s\S]*?)\n---/)
    const frontmatter = frontmatterRaw ? (yaml.load(frontmatterRaw[1]) as any) : {}
    const href = '/blog/' + file.replace(/\/page\.md$/, '')

    return {
      title: frontmatter?.title,
      description: frontmatter?.description,
      date: frontmatter?.date,
      author: frontmatter?.author,
      tags: Array.isArray(frontmatter?.tags) ? frontmatter.tags : undefined,
      href,
    }
  })

  posts.sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0
    const bd = b.date ? new Date(b.date).getTime() : 0
    return bd - ad
  })

  return posts
}

export default async function BlogIndexPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-2xl min-w-0 flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Blog</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Fresh content generated and curated to help you build faster and smarter.
        </p>
      </header>

      <ul className="space-y-10">
        {posts.map((post) => (
          <li key={post.href} className="">
            <article>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                <Link href={post.href} className="hover:underline">
                  {post.title ?? post.href}
                </Link>
              </h2>
              {post.description && (
                <p className="mt-2 text-slate-600 dark:text-slate-400">{post.description}</p>
              )}
              {(post.date || post.author) && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {post.date && (
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                  )}
                  {post.date && post.author && ' · '}
                  {post.author}
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {post.tags.map((t) => (
                    <span key={t} className="mr-2 rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      #{t}
                    </span>
                  ))}
                </p>
              )}
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}