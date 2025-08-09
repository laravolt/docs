import glob from 'fast-glob'
import path from 'path'

export default async function sitemap() {
  const appDir = path.resolve('./src/app')

  // docs & pages
  const pageFiles = glob.sync('**/page.md', { cwd: appDir })
  const pageRoutes = pageFiles.map((file) => (file === 'page.md' ? '/' : '/' + file.replace(/\/page\.md$/, '')))

  // blog tsx index
  const blogIndex = ['/blog']

  const routes = [...new Set([...pageRoutes, ...blogIndex])]

  return routes.map((url) => ({ url }))
}