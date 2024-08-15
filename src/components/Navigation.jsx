import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({ href, tag, active, isAnchorLink = false, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function parseLocation({ link, pathname }) {
  return link === pathname.slice(3)
}

function VisibleSectionHighlight({ group, pathname }) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation()
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => parseLocation({ link: link.href, pathname })) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => parseLocation({ link: link.href, pathname }))
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-teal-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className }) {
  const route = useRouter()
  const regexLanguage = /^\/([^\/]+)/;
  const currentPath = route.asPath;
  const language = currentPath.split(regexLanguage)[1].toLocaleLowerCase();
  const [locale, setLocale] = useState(language)
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  )

  useEffect(() => setLocale(language), [language])

  let isActiveGroup =
    group.links.findIndex((link) => parseLocation({ link: link.href, pathname: router.pathname })) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={`${link.href}`} active={parseLocation({ link: link.href, pathname: router.pathname })}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {parseLocation({ link: link.href, pathname: router.pathname }) && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.filter((s) => !s?.not).map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`/${locale}${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
  {
    title: 'Start here',
    links: [
      { title: 'Introduction', href: '/' },
      { title: 'Quickstart', href: '/quickstart' },
      { title: 'Concepts', href: '/concepts' },
      { title: 'Examples', href: '/uses-cases' },
    ],
  },
  {
    title: 'Basics',
    links: [
      { title: 'Functions', href: '/add-functions' },
      { title: 'Context', href: '/context' },
      { title: 'Methods', href: '/methods' },
      { title: 'Events', href: '/events' },
    ]
  },
  {
    title: 'Built-in',
    links: [
      { title: 'Databases', href: '/databases' },
    ]
  },
  {
    title: 'Providers',
    links: [
      { title: 'Meta', href: '/providers/meta' },
      { title: 'Twilio', href: '/providers/twilio' },
      { title: 'Baileys', href: '/providers/baileys' },
      { title: 'Venom', href: '/providers#venom' },
      { title: 'WPPConnect', href: '/providers#wpp-connect' },
    ]
  },
  {
    title: 'Deploy',
    links: [
      { title: 'Resume', href: '/deploy' },
      { title: 'Railway', href: '/deploy/railway' },
      { title: 'Docker', href: '/deploy/docker' },
      { title: 'VPS', href: '/deploy/vps' },
    ]
  },
  {
    title: 'Recipes',
    links: [
      { title: 'Queue limit', href: '/showcases/queue-limit' },
      { title: 'Modularize', href: '/showcases/modularize' },
      { title: 'Fast Entries', href: '/showcases/fast-entires' },
      { title: 'Idle', href: '/showcases/idle-optional' },
      { title: 'Scheduled Reboots', href: '/showcases/docker-pm2' },
      { title: 'In-Out messages', href: '/showcases/event-in-out-messages' },
      { title: 'Reminder', href: '/showcases/cron-reminder' },
      { title: 'Forward to human', href: '/showcases/forward-conversation-to-human' },
      { title: 'GotoFlow Use', href: '/showcases/gotoflow-use' },
      { title: 'Multiple messages', href: '/showcases/multiple-messages' }
    ],
  },
  {
    title: 'Tutorials',
    links: [
      { title: 'Migrate from bot-whatsapp', href: '/tutorials/migrate-to-builderbot' },
      { title: 'API Rest', href: '/tutorials/api-use' },
      { title: 'Gemini', href: '/tutorials/chatbot-with-gemini' },
      { title: 'Langchain', href: '/tutorials/langchain' }
    ]
  },
  {
    title: 'Community Contribute',
    links: [
      { title: 'Documentation', href: '/contribute' },
      { title: 'Core', href: '/contribute/core' },
      { title: 'Brand and Logos', href: '/resources' },
    ],
  },
  {
    title: 'Plugins',
    links: [
      { title: 'Telegram', href: '/plugins/telegram' },
      { title: 'Shopify', href: '/plugins/shopify' },
      { title: 'Agents', href: '/plugins/agents' },
      { title: 'Langchain', href: '/plugins/langchain' }
    ],
  },
]

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && 'md:mt-0'}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li>
      </ul>
    </nav>
  )
}
