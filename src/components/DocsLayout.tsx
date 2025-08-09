import { type Node } from '@markdoc/markdoc'

import { DocsHeader } from '@/components/DocsHeader'
import { PrevNextLinks } from '@/components/PrevNextLinks'
import { Prose } from '@/components/Prose'
import { TableOfContents } from '@/components/TableOfContents'
import { collectSections } from '@/lib/sections'
import { BlogLayout } from '@/components/BlogLayout'

export function DocsLayout({
  children,
  frontmatter,
  nodes,
  layout = 'docs',
}: {
  children: React.ReactNode
  frontmatter: { title?: string; description?: string; date?: string; author?: string; tags?: string[] }
  nodes: Array<Node>
  layout?: 'docs' | 'blog'
}) {
  if (layout === 'blog') {
    return <BlogLayout frontmatter={frontmatter}>{children}</BlogLayout>
  }

  let tableOfContents = collectSections(nodes)

  return (
    <>
      <div className="max-w-2xl min-w-0 flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
        <article>
          <DocsHeader title={frontmatter?.title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </div>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  )
}
