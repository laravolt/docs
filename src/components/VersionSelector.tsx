'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import clsx from 'clsx'

import { getVersionForPath, versions } from '@/lib/navigation'

/**
 * Compact documentation version switcher rendered in the site header,
 * next to the theme toggle.
 *
 * The button shows the active version label (e.g. "v7") and a chevron.
 * Clicking it opens a dropdown listing every documented version; picking
 * one navigates to that version's home page.
 */
export function VersionSelector({ className }: { className?: string }) {
  let pathname = usePathname()
  let activeVersion = getVersionForPath(pathname)

  return (
    <Menu
      as="div"
      className={clsx('relative', className)}
    >
      <MenuButton
        aria-label={`Documentation version, currently Laravolt ${activeVersion.label}`}
        className={clsx(
          'flex h-6 items-center gap-1 rounded-lg px-2 text-xs font-semibold',
          'shadow-md ring-1 shadow-black/5 ring-black/5',
          'bg-white text-slate-700',
          'hover:text-slate-900',
          'dark:bg-slate-700 dark:text-slate-200 dark:ring-white/5 dark:ring-inset',
          'dark:hover:text-white',
        )}
      >
        <span>Laravolt {activeVersion.label}</span>
        <ChevronDownIcon className="h-3 w-3" />
      </MenuButton>
      <MenuItems
        anchor={{ to: 'bottom end', gap: 12 }}
        className={clsx(
          'z-50 w-64 overflow-hidden rounded-xl bg-white p-2 text-sm shadow-md ring-1 shadow-black/5 ring-black/5',
          'dark:bg-slate-800 dark:ring-white/5',
          'focus:outline-none',
        )}
      >
        <p className="px-2 pt-1 pb-2 font-display text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          Documentation version
        </p>
        {versions.map((version) => {
          let isActive = version.id === activeVersion.id
          return (
            <MenuItem key={version.id}>
              {({ focus }) => (
                <Link
                  href={version.homeHref}
                  className={clsx(
                    'flex items-center justify-between gap-3 rounded-[0.625rem] p-2 transition-colors',
                    focus && 'bg-slate-100 dark:bg-slate-700/60',
                  )}
                >
                  <span className="flex flex-col">
                    <span
                      className={clsx(
                        'font-medium',
                        isActive
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-slate-900 dark:text-white',
                      )}
                    >
                      Laravolt {version.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {version.description}
                    </span>
                  </span>
                  {isActive && (
                    <CheckIcon
                      className="h-4 w-4 text-sky-500 dark:text-sky-400"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )}
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}

function ChevronDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  )
}

function CheckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m5 10 3 3 7-7" />
    </svg>
  )
}
