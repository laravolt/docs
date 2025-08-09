import glob from 'fast-glob'
import path from 'path'

export default async function sitemap() {
  const cwd = path.resolve('./src/app/blog')
  const files = glob.sync('**/page.md', { cwd })
  const routes = files.map((file) => '/blog/' + file.replace(/\/page\.md$/, ''))

  return routes.map((url) => ({ url }))
}