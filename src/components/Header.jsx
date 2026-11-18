import { forwardRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { ModeToggle } from '@/components/ModeToggle'
import { MobileSearch, Search } from '@/components/Search'
import LanguageSelector from './LanguajeSelector'

function TopLevelNavItem({ href, children, target, current = false, className }) {
  return (
    <li className={className}>
      <Link
        href={href}
        target={target ?? '_self'}
        aria-current={current ? 'page' : undefined}
        className={clsx(
          'text-sm font-medium transition',
          current ? 'text-bb-head' : 'text-bb-ink2 hover:text-bb-head'
        )}
      >
        {children}
      </Link>
    </li>
  )
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let router = useRouter()
  let locale = router.asPath.split('/')[1] || 'en'

  return (
    <div
      ref={ref}
      className={clsx(className, 'fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 lg:px-[18px]', !isInsideMobileNavigation && 'bg-gradient-to-b from-bb-bg from-60% to-transparent pb-3')}
    >
      <div
        className={clsx(
          'flex h-[60px] items-center gap-2 rounded-full pl-1.5 pr-2 sm:gap-4 sm:pl-2',
          isInsideMobileNavigation ? 'bg-bb-bg' : 'bg-bb-bg/85 backdrop-blur-xl backdrop-saturate-150'
        )}
      >
        <Link href={`/${locale}`} aria-label="BuilderBot, home" className="flex-none">
          <Logo />
        </Link>
        <Search />
        <span className="flex-1" />
        <nav aria-label="Main" className="hidden lg:block">
          <ul role="list" className="flex items-center gap-5">
            <TopLevelNavItem href={`/${locale}`} current>Documentation</TopLevelNavItem>
            <TopLevelNavItem href={`/${locale}/tutorials/api-use`}>API</TopLevelNavItem>
            <TopLevelNavItem href="https://link.codigoencasa.com/DISCORD" target="_blank">Support</TopLevelNavItem>
            <TopLevelNavItem href={`/${locale}/contribute`} className="hidden 2xl:block">Contribute</TopLevelNavItem>
            <TopLevelNavItem
              target="_blank"
              href="https://app.codigoencasa.com/courses/curso-chatbot-whatsapp?refCode=LEIFER"
              className="hidden 2xl:block"
            >
              Course
            </TopLevelNavItem>
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <Link
            href="https://github.com/codigoencasa/bot-whatsapp"
            target="_blank"
            aria-label="GitHub"
            className="hidden h-10 w-10 place-items-center rounded-full text-bb-ink transition hover:bg-bb-chip sm:grid"
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </Link>
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <ModeToggle />
          <MobileSearch />
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        </div>
        <Link
          href="https://builderbot.cloud"
          className="hidden h-10 items-center rounded-full bg-bb-btn px-5 text-[13px] text-bb-btnfg transition hover:opacity-90 sm:inline-flex"
        >
          Get started
        </Link>
      </div>
    </div>
  )
})
