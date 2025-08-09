import { Prose } from '@/components/Prose'

export function BlogLayout({
  children,
  frontmatter,
}: {
  children: React.ReactNode
  frontmatter: {
    title?: string
    description?: string
    date?: string
    author?: string
    tags?: string[]
  }
}) {
  const { title, description, date, author, tags } = frontmatter ?? {}

  return (
    <div className="max-w-2xl min-w-0 flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      <article>
        {title ? (
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {(description || date || author || (tags && tags.length > 0)) && (
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {description && <p className="mt-1">{description}</p>}
                {(date || author) && (
                  <p className="mt-1">
                    {date && <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>}
                    {date && author && ' · '}
                    {author && <span>{author}</span>}
                  </p>
                )}
                {tags && tags.length > 0 && (
                  <p className="mt-1">
                    {tags.map((t) => (
                      <span key={t} className="mr-2 rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}
          </header>
        ) : null}
        <Prose>{children}</Prose>
      </article>
    </div>
  )
}