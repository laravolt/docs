'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { getVersionForPath, versions } from '@/lib/navigation'

export function Navigation({
  className,
  onLinkClick,
}: {
  className?: string
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  let pathname = usePathname()
  let activeVersion = getVersionForPath(pathname)

  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <VersionSwitcher
        activeVersionId={activeVersion.id}
        onLinkClick={onLinkClick}
      />
      <ul role="list" className="space-y-9">
        {activeVersion.navigation.map((section) => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
            >
              {section.links.map((link) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={clsx(
                      'block w-full pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                      link.href === pathname
                        ? 'font-semibold text-sky-500 before:bg-sky-500'
                        : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300',
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Segmented version switcher rendered at the top of the docs sidebar.
 *
 * Clicking a version navigates to that version's home page. This keeps the
 * two documentation sets visually separated so readers focus on one major
 * version at a time instead of seeing a single long, mixed sidebar.
 */
function VersionSwitcher({
  activeVersionId,
  onLinkClick,
}: {
  activeVersionId: string
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <div className="mb-8">
      <p className="mb-2 font-display text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        Documentation
      </p>
      <div
        role="tablist"
        aria-label="Documentation version"
        className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/60"
      >
        {versions.map((version) => {
          let isActive = version.id === activeVersionId
          return (
            <Link
              key={version.id}
              href={version.homeHref}
              role="tab"
              aria-selected={isActive}
              onClick={onLinkClick}
              className={clsx(
                'flex flex-col items-center rounded-md px-2 py-1.5 text-center text-sm transition-colors',
                isActive
                  ? 'bg-white font-semibold text-sky-600 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              <span>Laravolt {version.label}</span>
              <span
                className={clsx(
                  'text-[11px] font-normal',
                  isActive
                    ? 'text-sky-500/80 dark:text-sky-400/80'
                    : 'text-slate-500 dark:text-slate-500',
                )}
              >
                {version.description}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
