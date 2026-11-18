import Link from 'next/link'

import { BrandIcon } from '@/components/BrandIcon'
import { Heading } from '@/components/Heading'

const resources = [
  {
    href: '/showcases/modularize',
    name: 'Modularize',
    description: 'Learn how to modularise flows so that you can have a more maintainable bot.',
    icon: 'grid',
  },
  {
    href: '/tutorials/api-use',
    name: 'Send Message',
    description: 'How to send a message via HTTP to start conversations, you can send multimedia as well.',
    icon: 'send',
  },
  {
    href: '/deploy/docker',
    name: 'Dockerizer',
    description: 'A good practice is to dockerise your bots to make them more maintainable and effective.',
    icon: 'box',
  },
  {
    href: '/events',
    name: 'Events',
    description: 'Learning about events will make us more fluent when creating chatbots.',
    icon: 'bolt',
  },
]

export function Resources() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="resources">
        Resources
      </Heading>
      <div className="not-prose mt-8 grid grid-cols-1 border-l border-t border-bb-line sm:grid-cols-2">
        {resources.map((resource) => (
          <div
            key={resource.href}
            className="relative flex flex-col gap-3 border-b border-r border-bb-line p-6 transition-colors hover:bg-bb-bg2"
          >
            <span aria-hidden="true" className="absolute -left-[5px] -top-[11px] font-mono text-sm font-light text-bb-soft">
              +
            </span>
            <BrandIcon name={resource.icon} />
            <h3 className="text-lg font-normal leading-snug text-bb-head">
              <Link href={resource.href} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {resource.name}
              </Link>
            </h3>
            <p className="text-sm font-light leading-relaxed text-bb-ink2">{resource.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
