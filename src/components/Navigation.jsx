import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { Icon } from '@/components/Icon'
import { Tag } from '@/components/Tag'

// Icon per documentation page (icon set: src/components/Icon.jsx)
const navIcons = {
  '/': 'book', '/quickstart': 'bolt', '/concepts': 'blocks', '/uses-cases': 'examples', '/playground': 'play',
  '/templates': 'shapes',
  '/add-functions': 'functions', '/context': 'context', '/methods': 'terminal', '/events': 'events',
  '/databases': 'database',
  '/providers/meta': 'cloud', '/providers/twilio': 'phone', '/providers/baileys': 'qr',
  '/providers#venom': 'browser', '/providers#wpp-connect': 'browser',
  '/deploy': 'upload', '/deploy/railway': 'layers', '/deploy/docker': 'container', '/deploy/vps': 'server',
  '/showcases/queue-limit': 'queue', '/showcases/modularize': 'modules', '/showcases/fast-entires': 'fast',
  '/showcases/idle-optional': 'clock', '/showcases/docker-pm2': 'reboot', '/showcases/event-in-out-messages': 'swap',
  '/showcases/cron-reminder': 'bell', '/showcases/forward-conversation-to-human': 'human',
  '/showcases/gotoflow-use': 'branch', '/showcases/multiple-messages': 'messages',
  '/tutorials/migrate-to-builderbot': 'migrate', '/tutorials/api-use': 'api',
  '/tutorials/chatbot-with-gemini': 'sparkle', '/tutorials/langchain': 'link',
  '/contribute': 'doc', '/contribute/core': 'chip', '/resources': 'shapes',
  '/plugins/telegram': 'send', '/plugins/shopify': 'bag', '/plugins/agents': 'agent', '/plugins/langchain': 'link',
}


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

function NavLink({ href, tag, active, icon, collapsed, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? children : undefined}
      className={clsx(
        'flex items-center gap-2.5 text-[13.5px] transition',
        collapsed ? 'h-9 justify-center' : 'py-1 pl-3 pr-3',
        active
          ? 'rounded-r-lg bg-gradient-to-r from-bb-l2/15 to-transparent font-medium text-bb-head shadow-[inset_2px_0_0_rgb(var(--bb-l2))]'
          : 'rounded-lg text-bb-ink2 hover:text-bb-head'
      )}
    >
      {icon && <Icon name={icon} size={16} className={active ? 'text-bb-l2' : 'text-bb-mute'} />}
      <span className={collapsed ? 'sr-only' : 'flex-1 truncate'}>{children}</span>
      {tag && !collapsed && (
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

function NavigationGroup({ group, className, collapsed }) {
  let router = useRouter()
  let locale = (router.asPath.split('/')[1] || 'en').toLowerCase()

  return (
    <li className={clsx('relative', collapsed ? 'mt-3 border-t border-bb-line pt-3 first:border-0 first:pt-0' : 'mt-6', className)}>
      <h2 className={collapsed ? 'sr-only' : 'bb-kicker'}>{group.title}</h2>
      <ul role="list" className={clsx('flex flex-col gap-0.5', !collapsed && 'mt-2')}>
        {group.links.map((link) => (
          <li key={link.href}>
            <NavLink
              href={`/${locale}${link.href === '/' ? '' : link.href}`}
              active={parseLocation({ link: link.href, pathname: router.pathname })}
              icon={navIcons[link.href]}
              collapsed={collapsed}
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
      { title: 'Templates', href: '/templates' },
      { title: 'Playground', href: '/playground' },
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

export function Navigation({ collapsed = false, ...props }) {
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
            collapsed={collapsed}
            className={groupIndex === 0 && (collapsed ? 'lg:mt-0' : 'lg:mt-0 lg:pt-6')}
          />
        ))}
      </ul>
    </nav>
  )
}
