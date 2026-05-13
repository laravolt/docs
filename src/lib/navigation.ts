export type NavLink = { title: string; href: string }
export type NavSection = { title: string; links: NavLink[] }
export type VersionId = 'v7' | 'v6'

export type Version = {
  id: VersionId
  label: string
  description: string
  /** Landing URL users should see when they switch to this version. */
  homeHref: string
  /** URL prefix that identifies pages belonging to this version. */
  pathPrefix: string
  navigation: NavSection[]
}

export const v7Navigation: NavSection[] = [
  {
    title: 'Introduction',
    links: [
      { title: 'Overview', href: '/' },
      { title: 'Introduction', href: '/v7/introduction' },
    ],
  },
  {
    title: 'Getting started',
    links: [
      { title: 'Installation', href: '/v7/getting-started/installation' },
    ],
  },
  {
    title: 'Core concepts',
    links: [
      {
        title: 'AI-ready platform',
        href: '/v7/core-concepts/ai-ready-platform',
      },
    ],
  },
  {
    title: 'UI foundation',
    links: [{ title: 'Overview', href: '/v7/ui-foundation/overview' }],
  },
  {
    title: 'Forms',
    links: [
      { title: 'Overview', href: '/v7/forms/overview' },
      { title: 'Validation', href: '/v7/forms/validation' },
      { title: 'Input masking', href: '/v7/forms/input-masking' },
    ],
  },
  {
    title: 'Admin workflows',
    links: [{ title: 'Overview', href: '/v7/admin-workflows/overview' }],
  },
  {
    title: 'Security',
    links: [
      { title: 'Access control', href: '/v7/security/access-control' },
    ],
  },
  {
    title: 'Testing',
    links: [
      { title: 'Browser testing', href: '/v7/testing/browser-testing' },
    ],
  },
  {
    title: 'Upgrade',
    links: [{ title: 'Upgrade guide', href: '/v7/upgrade-guide' }],
  },
  {
    title: 'Reference',
    links: [
      { title: 'llms.txt & Copy Markdown', href: '/v7/reference/llms-txt' },
    ],
  },
]

export const v6Navigation: NavSection[] = [
  {
    title: 'Introduction',
    links: [
      { title: 'Overview', href: '/v6/overview' },
      { title: 'Installation', href: '/v6/installation' },
      { title: 'Hello World', href: '/v6/hello-world' },
      { title: 'Starter Kit', href: '/v6/starter-kit' },
    ],
  },
  {
    title: 'Core components',
    links: [
      { title: 'Form', href: '/v6/form' },
      { title: 'Table', href: '/v6/table' },
      { title: 'Menu', href: '/v6/menu' },
      { title: 'Action Button', href: '/v6/action-button' },
      { title: 'Flash Messages', href: '/v6/flash-messages' },
    ],
  },
  {
    title: 'UI components',
    links: [
      { title: 'Blade Components', href: '/v6/blade-components' },
      { title: 'Statistics', href: '/v6/statistics' },
      { title: 'Charts', href: '/v6/charts' },
    ],
  },
  {
    title: 'Development practices',
    links: [
      { title: 'Routes', href: '/v6/routes' },
      { title: 'Controller Best Practices', href: '/v6/controller' },
      { title: 'Naming Conventions', href: '/v6/naming-conventions' },
      { title: 'Performance Tips', href: '/v6/performance' },
      { title: 'Editor/IDE Setup', href: '/v6/editor-ide' },
    ],
  },
  {
    title: 'Advanced features',
    links: [
      { title: 'Auto CRUD', href: '/v6/auto-crud' },
      { title: 'Workflow', href: '/v6/workflow' },
      { title: 'ACL', href: '/v6/acl' },
      { title: 'Thunderclap', href: '/v6/thunderclap' },
      { title: 'React Integration', href: '/v6/react-integration' },
    ],
  },
  {
    title: 'Tutorials',
    links: [
      { title: 'News Portal Tutorial', href: '/v6/news-portal-tutorial' },
      { title: 'Creating Authorized Menu', href: '/v6/authorized-menu' },
    ],
  },
  {
    title: 'Development guidelines',
    links: [
      { title: 'Code Quality', href: '/v6/code-quality' },
      { title: 'Git Guidelines', href: '/v6/git-guidelines' },
    ],
  },
]

export const versions: Version[] = [
  {
    id: 'v7',
    label: 'v7',
    description: 'Current',
    homeHref: '/',
    pathPrefix: '/v7',
    navigation: v7Navigation,
  },
  {
    id: 'v6',
    label: 'v6',
    description: 'Legacy',
    homeHref: '/v6/overview',
    pathPrefix: '/v6',
    navigation: v6Navigation,
  },
]

/**
 * Find the version a given pathname belongs to.
 *
 * Defaults to v7 so the landing page (`/`) and any new top-level routes
 * surface the current documentation.
 */
export function getVersionForPath(pathname: string | null | undefined): Version {
  if (pathname && pathname.startsWith('/v6')) return versions[1]
  return versions[0]
}

/**
 * Union of every version's navigation. Use this for global lookups that
 * should work regardless of the active version (for example, search result
 * section titles).
 */
export const navigation: NavSection[] = versions.flatMap(
  (version) => version.navigation,
)
