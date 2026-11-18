import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { Tag } from '@/components/Tag'

function TopLevelNavItem({ href, children, target }) {
  return (
    <li className="lg:hidden">
      <Link
        href={href}
        target={target}
        className="block py-1.5 text-sm font-medium text-bb-ink2 transition hover:text-bb-head"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({ href, tag, active, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pl-3 pr-3 text-[13.5px] transition',
        active
          ? 'rounded-r-lg bg-gradient-to-r from-bb-l2/15 to-transparent font-medium text-bb-head shadow-[inset_2px_0_0_rgb(var(--bb-l2))]'
          : 'rounded-lg text-bb-ink2 hover:text-bb-head'
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
  return link === (pathname.slice(3) || '/')
}

function NavigationGroup({ group, className }) {
  let router = useRouter()
  let locale = (router.asPath.split('/')[1] || 'en').toLowerCase()

  return (
    <li className={clsx('relative mt-6', className)}>
      <h2 className="bb-kicker">{group.title}</h2>
      <ul role="list" className="mt-2 flex flex-col gap-0.5">
        {group.links.map((link) => (
          <li key={link.href}>
            <NavLink
              href={`/${locale}${link.href === '/' ? '' : link.href}`}
              active={parseLocation({ link: link.href, pathname: router.pathname })}
            >
              {link.title}
            </NavLink>
          </li>
        ))}
      </ul>
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
        <TopLevelNavItem href="/tutorials/api-use">API</TopLevelNavItem>
        <TopLevelNavItem href="/">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="https://link.codigoencasa.com/DISCORD" target="_blank">Support</TopLevelNavItem>
        <TopLevelNavItem href="/contribute">Contribute</TopLevelNavItem>
        <TopLevelNavItem href="https://app.codigoencasa.com/courses/curso-chatbot-whatsapp?refCode=LEIFER" target="_blank">Course</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && 'lg:mt-0'}
          />
        ))}
      </ul>
    </nav>
  )
}
