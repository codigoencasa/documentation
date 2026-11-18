import Link from 'next/link'
import clsx from 'clsx'

import { BrandIcon } from '@/components/BrandIcon'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/uses-cases#my-first-bot',
    name: 'My first chatbot',
    description: 'Learn how build your first chatbot in few minutes',
    icon: 'chat',
    wide: true,
  },
  {
    href: '/concepts',
    name: 'Concepts',
    description: 'Understand the essential concepts for building bots',
    icon: 'layers',
  },
  {
    href: '/add-functions',
    name: 'Add Functions',
    description: 'The key to learning how to write flows is add-functions.',
    icon: 'code',
  },
  {
    href: '/plugins',
    name: 'Plugins',
    description: 'Unlimitate and start implementing the community plugins.',
    icon: 'plug',
    wide: true,
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {guides.map((guide) => (
          <div
            key={guide.href}
            className={clsx(
              'bb-gcard relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-bb-bg2 p-6 ring-1 ring-inset ring-bb-line',
              guide.wide ? 'xl:col-span-4' : 'xl:col-span-2'
            )}
          >
            <BrandIcon name={guide.icon} />
            <h3 className="text-lg font-normal leading-snug text-bb-head">
              <Link href={guide.href} className="focus:outline-none">
                <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
                {guide.name}
              </Link>
            </h3>
            <p className="text-sm font-light leading-relaxed text-bb-ink2">{guide.description}</p>
            <p className="mt-auto pt-2 text-sm text-bb-head">
              Read more <span aria-hidden="true" className="text-bb-l2">→</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
