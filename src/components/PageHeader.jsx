import Link from 'next/link'
import { useRouter } from 'next/router'

import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { navigation } from '@/components/Navigation'

const REPO = 'https://github.com/codigoencasa/documentation/edit/master/'

function findPage(pathname) {
  let path = pathname.slice(3) || '/'
  for (let group of navigation) {
    let link = group.links.find((l) => l.href === path)
    if (link) return { group: group.title, page: link.title }
  }
  return null
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M4 5h16M4 12h16M4 19h16" />
    </svg>
  )
}

function EditIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  )
}

/**
 * Breadcrumb kicker, "Edit this page" link and, when the MDX page has no h1,
 * the page title taken from the navigation. On mobile it adds a button that
 * opens the documentation menu.
 */
export function PageHeader({ title, sourcePath }) {
  let router = useRouter()
  let open = useMobileNavigationStore((s) => s.open)
  let current = findPage(router.pathname)

  return (
    <div className="not-prose mb-8">
      {current && (
        <button
          type="button"
          onClick={open}
          aria-label="Open documentation menu"
          className="mb-8 flex h-12 w-full items-center gap-2.5 rounded-xl bg-bb-bg2 px-4 text-sm text-bb-ink ring-1 ring-inset ring-bb-line lg:hidden"
        >
          <MenuIcon className="h-4 w-4 text-bb-mute" />
          <span className="text-bb-mute">{current.group}</span>
          <span aria-hidden="true" className="text-bb-soft">/</span>
          <span className="truncate text-bb-head">{current.page}</span>
          <span aria-hidden="true" className="ml-auto text-bb-mute">⌄</span>
        </button>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {current && (
          <p className="bb-kicker flex animate-bb-in items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bb-l1 shadow-[0_0_12px_rgb(var(--bb-l1))]" />
            {current.group} · {current.page}
          </p>
        )}
        {sourcePath && (
          <Link
            href={REPO + sourcePath}
            target="_blank"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-bb-mute transition hover:text-bb-head"
          >
            <EditIcon className="h-3.5 w-3.5" />
            Edit this page on GitHub
          </Link>
        )}
      </div>
      {!title && current && (
        <h1 className="mt-4 animate-bb-in text-[clamp(2rem,3.2vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-bb-head">
          {current.page}
        </h1>
      )}
    </div>
  )
}

/** Inline award badge (e.g. OpenExpo). */
export function Award({ href, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="not-prose inline-flex items-center gap-2 rounded-full bg-bb-head/[0.06] py-1 pl-1 pr-3 text-[13px] font-normal text-bb-ink no-underline ring-1 ring-inset ring-bb-line transition hover:ring-bb-line2"
    >
      <span className="rounded-full bg-[linear-gradient(90deg,#22d3ee,#818cf8_50%,#c084fc)] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0b0b0c]">
        1ST PRIZE
      </span>
      {children}
    </Link>
  )
}
